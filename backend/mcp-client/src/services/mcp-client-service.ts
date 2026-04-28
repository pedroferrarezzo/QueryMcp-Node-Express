import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { QUERY_MCP_SERVER_ENDPOINT } from "../helpers/env-helper.js";

/**
 * Cria um cliente MCP.
 * @returns {Promise<Client>} O cliente MCP criado.
 */
export async function createMcpClient() {
    if (!QUERY_MCP_SERVER_ENDPOINT) {
        throw new Error("Variáveis de ambiente para conexão com o Query MCP Server não estão definidas.");
    }

    const transport = new StreamableHTTPClientTransport(
        new URL(QUERY_MCP_SERVER_ENDPOINT)
    );

    const client = new Client({
        name: "query-mcp-client",
        version: "1.0.0"
    });

    await client.connect(transport);

    return client;
}