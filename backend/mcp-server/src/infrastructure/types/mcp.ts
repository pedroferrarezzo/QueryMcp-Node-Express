import { Implementation } from "@modelcontextprotocol/sdk/types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { DbRepository } from "../output/repository/db-repository";
import { EmailClient } from "../output/email/email-client";

/** Tipos e interfaces relacionados ao servidor MCP */
export type McpServerSetupDTO = { schema: Implementation; dbRepository: DbRepository; emailClient: EmailClient; registerToolsFunc: (server: McpServer, deps: { dbRepository: DbRepository; emailClient: EmailClient; }) => void;};

/** Tipo que representa uma sessão MCP, contendo o servidor MCP e o transporte HTTP Streamable associado (se houver) */
export type McpSessionDTO = {server: McpServer; streamableHttpTransport?: StreamableHTTPServerTransport | null;}