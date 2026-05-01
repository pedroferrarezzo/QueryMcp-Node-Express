import express from "express";
import { MCPController } from "../controllers/mcp-controller";
import { extractSessionId, requireSessionId } from "../middlewares/mcp-middleware";

/**
 * Cria router MCP com middlewares aplicados.
 */
export function createMcpRouter(controller: MCPController) {
    const router = express.Router();

    router.post(
        "/mcp",
        extractSessionId,
        (req, res) => controller.post(req, res)
    );

    router.get(
        "/mcp",
        extractSessionId,
        requireSessionId,
        (req, res) => controller.get(req, res)
    );

    return router;
}