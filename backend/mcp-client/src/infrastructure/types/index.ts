import { StreamEvent } from "@langchain/core/tracers/log_stream";
import { IterableReadableStream } from "@langchain/core/utils/stream";

/**
 * Tipo para o payload de mensagem WebSocket
 */
export interface WebSocketMessage {
  type: "chunk" | "error" | "end";
  content?: string;
  message?: string;
}

/**
 * Tipo para evento de stream do agente Langchain
 */
export type EventStream = IterableReadableStream<StreamEvent>;

/**
 * Tipo para a configuração do WebSocket
 */
export interface WebSocketConfig {
  endpoint: string;
  port: number;
}
