import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { McpHttpHelpers, PROTOCOL_HEADER } from "../helpers/mcp-http-helpers";
import type { McpServerSetupDTO, McpSessionDTO } from "../types/mcp"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/** Classe que representa um servidor MCP */
export class MCPServerService {
    private mcpServerSetup: McpServerSetupDTO;
    private sessions: McpSessionDTO[] = [];

    constructor(mcpServerSetup: McpServerSetupDTO) { 
        this.mcpServerSetup = mcpServerSetup;
    }

    /** Manipula requisições POST para o endpoint MCP */
    async handlePost(req: Request, res: Response) {
        try {
            if (!McpHttpHelpers.isValidOrigin(req.headers.origin)) {
                return McpHttpHelpers.unauthorized(res, "Invalid Origin");
            }

            if (!McpHttpHelpers.isValidPostAccept(req.headers.accept)) {
                return McpHttpHelpers.badRequest(res, "Invalid Accept header", -32600);
            }

            const protocolVersion = req.headers[PROTOCOL_HEADER.toLowerCase()] as string | undefined;
            if (!McpHttpHelpers.isValidProtocolVersion(protocolVersion)) {
                return McpHttpHelpers.badRequest(res, "Unsupported protocol version", -32000);
            }

            const sessionId = McpHttpHelpers.getSessionId(req);

            if (sessionId) {       
                const session = this.getSessionById(sessionId);
                const transport = session?.streamableHttpTransport;
                
                if (!transport) {
                    return McpHttpHelpers.unauthorized(res, "Invalid session ID");
                }

                await transport.handleRequest(req, res, req.body);
                
                return;
            }

            const newSession = await this.createSession();
            const transport = newSession.streamableHttpTransport;

            if (!transport) {
                return McpHttpHelpers.internalError(res);
            }

            await transport.handleRequest(req, res, req.body);

        } catch(error) {
            return McpHttpHelpers.internalError(res);
        }
    }

    /** Manipula requisições GET para o endpoint MCP (SSE) */
    async handleGet(req: Request, res: Response) {
        try {
            if (!McpHttpHelpers.isValidOrigin(req.headers.origin)) {
                return McpHttpHelpers.unauthorized(res, "Invalid Origin");
            }

            if (!McpHttpHelpers.isValidSseAccept(req.headers.accept)) {
                return McpHttpHelpers.notAllowed(res, "GET requests to MCP endpoint must have Accept header including text/event-stream");
            }

            const sessionId = McpHttpHelpers.getSessionId(req);

            if (sessionId) {
                const session = this.getSessionById(sessionId);
                const transport = session?.streamableHttpTransport;

                if (!transport) {
                    return McpHttpHelpers.unauthorized(res, "Invalid session ID");
                }

                await transport.handleRequest(req, res, req.body);

                return;
            }

            return McpHttpHelpers.unauthorized(res, "Session ID required for GET requests");

        } catch(error) {
            return McpHttpHelpers.internalError(res);
        }
    }

    /**
     * Cria uma nova sessão MCP, conectando um novo servidor MCP a um transporte HTTP Streamable e armazenando a sessão para uso futuro.
     * @returns A sessão MCP criada, contendo o servidor MCP e o transporte HTTP Streamable associado.
     */
    async createSession() {
        const mcpServer = new McpServer(this.mcpServerSetup.schema);
        this.mcpServerSetup.registerToolsFunc(mcpServer);

        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID()
        });
        await mcpServer.connect(transport);

        const session: McpSessionDTO = { server: mcpServer, streamableHttpTransport: transport };
        this.sessions.push(session);

        return session;
    }

    /** Encerra todas as sessões MCP ativas, fechando os servidores MCP e os transportes HTTP Streamable associados. */
    async cleanup() {
        for (const session of this.sessions) {
            await session.server.close();
        }
    }

    /**
     * Recupera uma sessão MCP existente pelo ID da sessão.
     * @param sessionId  O ID da sessão a ser recuperada.
     * @returns A sessão MCP correspondente ao ID fornecido, ou undefined se nenhuma sessão for encontrada com esse ID.
     */
    getSessionById(sessionId: string): McpSessionDTO | undefined {
        return this.sessions.find(s => s.streamableHttpTransport?.sessionId === sessionId);
    }
}