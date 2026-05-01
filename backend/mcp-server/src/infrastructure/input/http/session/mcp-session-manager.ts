import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpServerSetupDTO, McpSessionDTO } from "../../../types/mcp";

/**
 * Gerencia sessões MCP e integração com o transporte HTTP do SDK.
 * Responsável por lifecycle técnico (infraestrutura).
 */
export class MCPSessionManager {
    private sessions: McpSessionDTO[] = [];

    constructor(private readonly setup: McpServerSetupDTO) {}

    /**
     * Cria e registra uma nova sessão MCP.
     */
    async createSession(): Promise<McpSessionDTO> {
        const server = new McpServer(this.setup.schema);
        this.setup.registerToolsFunc(server, {
            dbRepository: this.setup.dbRepository,
            emailClient: this.setup.emailClient
        });

        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID()
        });

        await server.connect(transport);

        const session: McpSessionDTO = {
            server,
            streamableHttpTransport: transport
        };

        this.sessions.push(session);
        return session;
    }

    /**
     * Recupera uma sessão pelo ID.
     */
    getSession(sessionId: string): McpSessionDTO | undefined {
        return this.sessions.find(
            s => s.streamableHttpTransport?.sessionId === sessionId
        );
    }

    /**
     * Encerra todas as sessões ativas.
     */
    async cleanup(): Promise<void> {
        for (const session of this.sessions) {
            await session.server.close();
        }
    }
}