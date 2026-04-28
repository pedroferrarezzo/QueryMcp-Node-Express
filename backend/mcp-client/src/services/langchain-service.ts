import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { ChatOllama } from "@langchain/ollama";
import { OLLAMA_MODEL_NAME, OLLAMA_HOST } from "../helpers/env-helper.js";
import { StreamEvent } from "@langchain/core/tracers/log_stream";
import { IterableReadableStream } from "@langchain/core/utils/stream";

/**
 * Obtém as ferramentas disponíveis no MCP e as converte para o formato esperado pelo Langchain.
 */
export async function getLangchainToolsFromMcp(mcpClient: Client): Promise<DynamicStructuredTool<{
    [x: string]: unknown;
    type: "object";
    properties?: Record<string, object> | undefined;
    required?: string[] | undefined;
}, unknown, unknown, string, unknown, string>[]> {
    const mcpResponse = await mcpClient.listTools();
    const mcpTools = mcpResponse.tools;
    const langchainTools = mcpTools.map((mcpTool) => {
        return tool(
            async (input: any) => {
                const result = await mcpClient.callTool({
                    name: mcpTool.name,
                    arguments: input
                });

                return JSON.stringify(result.content);
            },
            {
                name: mcpTool.name,
                description: mcpTool.description || "",
                schema: mcpTool.inputSchema
            }
        );
    });

    return langchainTools;
}

/**
 * Cria um modelo de linguagem usando o Ollama, com base nas variáveis de ambiente definidas.
 * @returns {ChatOllama} O modelo de linguagem criado.
 */
export function createLLM(): ChatOllama {
    if (!OLLAMA_MODEL_NAME || !OLLAMA_HOST) {
        throw new Error("Variáveis de ambiente para conexão com o Ollama não estão definidas.");
    }

    return new ChatOllama({
        model: OLLAMA_MODEL_NAME,
        temperature: 0,
        baseUrl: OLLAMA_HOST
    });
}

/**
 * Processa uma query usando o Langchain.
 * @param iterableEventStream O stream de eventos gerado pelo agente do Langchain.
 * @param ws O WebSocket para enviar os resultados de volta ao cliente.
 */
export async function processQuery(iterableEventStream: IterableReadableStream<StreamEvent>, ws: WebSocket) {
    for await (const { event, data } of iterableEventStream) {
        if (event === "on_chat_model_stream") {
            const content = data.chunk?.content;
            if (content) {
                ws.send(JSON.stringify({ type: "chunk", content }));
            }
        } 
    }

    ws.send(JSON.stringify({ type: "end" }));
}