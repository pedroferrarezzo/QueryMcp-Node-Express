import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  MCP_CLIENT_WS_ENDPOINT: z.string().default("/ws"),
  MCP_CLIENT_PORT: z.coerce.number().default(3000),
  QUERY_MCP_SERVER_ENDPOINT: z.string(),
  OLLAMA_MODEL_NAME: z.string(),
  OLLAMA_HOST: z.string(),
});

type Env = z.infer<typeof envSchema>;

/**
 * Valida se as variáveis de ambiente necessárias estão definidas.
 */
function validateEnv(): Env {
  return envSchema.parse(process.env);
}

/**
 * Exporta as variáveis de ambiente.
 */
export const ENV: Env = validateEnv();