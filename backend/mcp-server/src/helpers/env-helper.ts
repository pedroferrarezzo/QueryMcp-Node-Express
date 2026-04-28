import "dotenv/config";

export const MCP_SERVER_ENDPOINT = process.env.MCP_SERVER_ENDPOINT || "/mcp";
export const MCP_SERVER_PORT = process.env.MCP_SERVER_PORT || 3001;

/**
 * Valida se as variáveis de ambiente necessárias estão definidas.
 */
export function validateEnv() {
    
}