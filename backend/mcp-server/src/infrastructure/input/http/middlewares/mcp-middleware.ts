import { Request, Response, NextFunction } from "express";

/**
 * Extrai o sessionId do header e injeta na request.
 */
export function extractSessionId(req: Request, _: Response, next: NextFunction): void {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    (req as any).sessionId = sessionId;
    next();
}

/**
 * Garante que a requisição possui sessionId.
 */
export function requireSessionId(req: Request, res: Response, next: NextFunction): void {
    if (!(req as any).sessionId) {
        res.status(401).json({ error: "Session ID required" });
        return;
    }
    next();
}