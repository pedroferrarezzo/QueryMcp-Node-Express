import { MCP_CLIENT_WS_ENDPOINT, MCP_CLIENT_PORT, validateEnv } from "./helpers/env-helper.js"
import express from "express"
import { WebSocketServer } from "ws"
import { processQuery, getLangchainToolsFromMcp, createLLM } from "./services/langchain-service.js"
import { createAgent, SystemMessage } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import {createMcpClient} from "./services/mcp-client-service.js"

try {
    validateEnv();
} catch (err: unknown) {
    console.error(err instanceof Error ? err.message : err);
    
    process.exit(1);
}

const mcpClient = await createMcpClient();
const tools = await getLangchainToolsFromMcp(mcpClient);
const llm = createLLM();
const agent = createAgent({
    model: llm,
    tools,
    systemPrompt: new SystemMessage({
    content: [
        {type: "text", text: "Responda todas as perguntas em PT-BR"}, 
        {type: "text", text: "Use as ferramentas disponíveis para responder às perguntas, e se necessário, combine os resultados de múltiplas ferramentas."},
        {type: "text", text: "Não diga quais ferramentas utilizou."},]}),
});

const app = express()
const router = express.Router()
app.use(express.json())
app.use('/', router)

const server = app.listen(MCP_CLIENT_PORT, () => {
    console.log(`MCP Client listening on port ${MCP_CLIENT_PORT} and endpoint ${MCP_CLIENT_WS_ENDPOINT}`)
})
const wss = new WebSocketServer({
    server,
    path: MCP_CLIENT_WS_ENDPOINT
})

wss.on("connection", (ws: WebSocket) => {
    const connectionId = crypto.randomUUID();

    ws.onmessage = async (event: MessageEvent) => {
        try {
            const parsed = JSON.parse(event.data.toString());

            if (!parsed.prompt) {
                ws.send(JSON.stringify({ type: "error", message: "Missing 'prompt'" }));
                return;
            }

            const eventStream = agent.streamEvents(
                { messages: [{ role: "user", content: parsed.prompt }] },
                { version: "v2", configurable: { thread_id: connectionId } },
            );

            await processQuery(eventStream, ws);

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown error";
            ws.send(JSON.stringify({ type: "error", message }));
        }
    };

    ws.onclose = () => {

    };

    ws.onerror = (err) => {

    };
});

process.on('SIGINT', async () => {
    console.log('Shutting down MCP Client...')
    process.exit(0)
})