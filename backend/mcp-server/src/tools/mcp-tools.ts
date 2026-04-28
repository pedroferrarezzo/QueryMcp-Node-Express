import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Registra as ferramentas disponíveis no MCP Server
 * @param server 
 */
export function registerTools(server: McpServer) {
    server.tool(
        "",
        "",
        {
           
        },
        async () => {

        }
    );

    
}
