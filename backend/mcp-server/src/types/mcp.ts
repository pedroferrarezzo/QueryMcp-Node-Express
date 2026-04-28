import { Implementation } from "@modelcontextprotocol/sdk/types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

/** Tipos e interfaces relacionados ao servidor MCP */
export type McpServerSetupDTO = { schema: Implementation; registerToolsFunc: (server: McpServer) => void;};

/** Tipo que representa uma sessão MCP, contendo o servidor MCP e o transporte HTTP Streamable associado (se houver) */
export type McpSessionDTO = {server: McpServer; streamableHttpTransport?: StreamableHTTPServerTransport | null;}