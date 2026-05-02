import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

/**
 * Cria um cliente MCP conectado ao Query MCP Server.
 * @param endpoint URL do endpoint do Query MCP Server
 * @returns {Promise<Client>} O cliente MCP criado e conectado.
 */
export async function createMcpClient(endpoint: string): Promise<Client> {
  const transport = new StreamableHTTPClientTransport(new URL(endpoint));

  const client = new Client({
    name: "query-mcp-client",
    version: "1.0.0",
  });

  await client.connect(transport);

  return client;
}
