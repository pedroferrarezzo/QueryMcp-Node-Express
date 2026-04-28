import express, { Request, Response } from "express"
import { MCPServerService } from "./services/mcp-server-service"
import { registerTools } from "./tools/mcp-tools"
import { MCP_SERVER_ENDPOINT, MCP_SERVER_PORT, validateEnv } from "./helpers/env-helper"
import type { McpServerSetupDTO } from "./types/mcp"

try {
    validateEnv();
} catch (err: unknown) {
    console.error(err instanceof Error ? err.message : err);
    
    process.exit(1);
}

const app = express()
const router = express.Router()

const mcpServerSetup: McpServerSetupDTO = {
        schema: {
            name: "mcp-server",
            version: "1.0.0"
        },
        registerToolsFunc: registerTools
    }
const mcpServer = new MCPServerService(mcpServerSetup)

router.post(MCP_SERVER_ENDPOINT, async (req: Request, res: Response) => {
    await mcpServer.handlePost(req, res)
})
router.get(MCP_SERVER_ENDPOINT, async (req: Request, res: Response) => {
    await mcpServer.handleGet(req, res)
})

app.use(express.json())
app.use('/', router)

app.listen(MCP_SERVER_PORT, () => {
    console.log(`MCP server listening on port ${MCP_SERVER_PORT} and endpoint ${MCP_SERVER_ENDPOINT}`)
    
})

process.on('SIGINT', async () => {
    console.log('Shutting down MCP server...')
    await mcpServer.cleanup();
    process.exit(0)
})