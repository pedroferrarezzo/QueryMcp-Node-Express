// mcp-http.helpers.ts

import { Request, Response } from "express";

export const SESSION_HEADER = "MCP-Session-Id";
export const PROTOCOL_HEADER = "MCP-Protocol-Version";
export const SUPPORTED_PROTOCOL_VERSION = "2025-11-25";

export class McpHttpHelpers {

    /**
     * Valida o header Origin para prevenir DNS rebinding.
     * 
     * @param {string | undefined} origin Header Origin da requisição
     * @returns {boolean} True se permitido
     */
    static isValidOrigin(origin?: string): boolean {
        if (!origin) return true;
        return origin.includes("localhost") || origin.includes("127.0.0.1");
    }

    /**
     * Valida o header Accept para requisições POST.
     * Deve conter application/json e text/event-stream.
     * 
     * @param {string | undefined} accept Header Accept
     * @returns {boolean}
     */
    static isValidPostAccept(accept?: string): boolean {
        if (!accept) return false;
        return accept.includes("application/json") && accept.includes("text/event-stream");
    }

    /**
     * Valida o header Accept para requisições GET (SSE).
     * 
     * @param {string | undefined} accept Header Accept
     * @returns {boolean}
     */
    static isValidSseAccept(accept?: string): boolean {
        if (!accept) return false;
        return accept.includes("text/event-stream");
    }

    /**
     * Valida a versão do protocolo MCP.
     * 
     * @param {string | undefined} version Header MCP-Protocol-Version
     * @returns {boolean}
     */
    static isValidProtocolVersion(version?: string): boolean {
        if (!version) return true; // fallback permitido pela spec
        return version === SUPPORTED_PROTOCOL_VERSION;
    }

    /**
     * Extrai o sessionId do header MCP-Session-Id.
     * 
     * @param {Request} req
     * @returns {string | undefined}
     */
    static getSessionId(req: Request): string | undefined {
        return req.headers[SESSION_HEADER.toLowerCase()] as string | undefined;
    }

    /**
     * Retorna erro JSON-RPC padrão sem id.
     * 
     * @param {string} message
     * @returns {object}
     */
    static jsonRpcError(message: string, code: number = -32000) {
        return {
            jsonrpc: "2.0",
            error: {
                code,
                message
            }
        };
    }

    /**
     * Resposta HTTP 400 com erro JSON-RPC.
     */
    static badRequest(res: Response, message: string, code: number = -32600) {
        return res.status(400).json(this.jsonRpcError(message, code)).end();
    }

    /**
     * Resposta HTTP 401 com erro JSON-RPC.
     */
    static unauthorized(res: Response, message: string = "Unauthorized") {
        return res.status(401).json(this.jsonRpcError(message, -32001)).end();
    }

    /**Resposta HTTP 405 com erro JSON-RPC. */
    static notAllowed(res: Response, message: string = "Method not allowed") {
        return res.status(405).json(this.jsonRpcError(message, -32600)).end();
    }

    /**
     * Resposta HTTP 500 com erro JSON-RPC.
     */
    static internalError(res: Response) {
        return res.status(500).json(this.jsonRpcError("Internal error", -32603)).end();
    }
}