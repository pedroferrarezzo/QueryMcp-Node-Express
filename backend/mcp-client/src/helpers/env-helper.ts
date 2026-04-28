import "dotenv/config";

export const MCP_CLIENT_WS_ENDPOINT = process.env.MCP_CLIENT_WS_ENDPOINT || "/ws";
export const MCP_CLIENT_PORT = process.env.MCP_CLIENT_PORT || 3000;
export const QUERY_MCP_SERVER_ENDPOINT = process.env.QUERY_MCP_SERVER_ENDPOINT;
export const OLLAMA_MODEL_NAME = process.env.OLLAMA_MODEL_NAME;
export const OLLAMA_HOST = process.env.OLLAMA_HOST;

/**
 * Valida se as variáveis de ambiente necessárias estão definidas.
 */
export function validateEnv() {
    if (!QUERY_MCP_SERVER_ENDPOINT) {
        throw new Error("Variáveis de ambiente para conexão com o Query MCP Server não estão definidas.");
    }

    if (!OLLAMA_MODEL_NAME || !OLLAMA_HOST) {
        throw new Error("Variáveis de ambiente para conexão com o Ollama não estão definidas.");
    }
}