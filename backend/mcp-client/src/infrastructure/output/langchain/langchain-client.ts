import { ChatOllama } from "@langchain/ollama";

/**
 * Cria um modelo de linguagem usando o Ollama.
 * @param modelName Nome do modelo Ollama
 * @param baseUrl URL base do servidor Ollama
 * @returns {ChatOllama} O modelo de linguagem criado.
 */
export function createLangchainClient(
  modelName: string,
  baseUrl: string
): ChatOllama {
  return new ChatOllama({
    model: modelName,
    temperature: 0,
    baseUrl: baseUrl,
  });
}
