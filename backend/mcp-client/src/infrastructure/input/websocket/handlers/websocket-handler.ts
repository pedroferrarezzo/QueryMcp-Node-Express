import { WebSocket } from "ws";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createAgent, SystemMessage } from "langchain";
import { EventStream, WebSocketMessage } from "../../../types/index.js";

/**
 * Cria um agente Langchain com as ferramentas e modelo fornecidos.
 */
function createMcpAgent(
  llm: BaseLanguageModel,
  tools: DynamicStructuredTool[]
) {
  return createAgent({
    model: llm,
    tools,
    systemPrompt: new SystemMessage({
      content: [
        {
          type: "text",
          text: "Responda todas as perguntas em PT-BR",
        },
        {
          type: "text",
          text: "Use as ferramentas disponíveis para responder às perguntas, e se necessário, combine os resultados de múltiplas ferramentas.",
        },
        {
          type: "text",
          text: "Não diga quais ferramentas utilizou.",
        },
      ],
    }),
  });
}

/**
 * Processa uma query recebida via WebSocket usando o agente Langchain.
 */
async function processQuery(
  eventStream: EventStream,
  ws: WebSocket
): Promise<void> {
  for await (const { event, data } of eventStream) {
    if (event === "on_chat_model_stream") {
      const content = data.chunk?.content;
      if (content) {
        const message: WebSocketMessage = {
          type: "chunk",
          content,
        };
        ws.send(JSON.stringify(message));
      }
    }
  }

  const endMessage: WebSocketMessage = {
    type: "end",
  };
  ws.send(JSON.stringify(endMessage));
}

/**
 * Envia uma mensagem de erro via WebSocket.
 */
function sendError(ws: WebSocket, message: string): void {
  const errorMessage: WebSocketMessage = {
    type: "error",
    message,
  };
  ws.send(JSON.stringify(errorMessage));
}

/**
 * Configura os handlers para uma conexão WebSocket.
 */
export function setupWebSocketHandlers(
  ws: WebSocket,
  llm: BaseLanguageModel,
  tools: DynamicStructuredTool[]
): void {
  const connectionId = crypto.randomUUID();
  const agent = createMcpAgent(llm, tools);

  ws.on("message", async (event) => {
    try {
      const parsed = JSON.parse(event.toString());

      if (!parsed.prompt) {
        sendError(ws, "Missing 'prompt' field in request");
        return;
      }

      const eventStream = agent.streamEvents(
        { messages: [{ role: "user", content: parsed.prompt }] },
        {
          version: "v2",
          configurable: { thread_id: connectionId },
        }
      );

      await processQuery(eventStream, ws);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      sendError(ws, message);
    }
  });

  ws.on("close", () => {
  
  });

  ws.on("error", (err) => {

  });
}
