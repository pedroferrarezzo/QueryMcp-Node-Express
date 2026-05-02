import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Cria um modelo de linguagem usando o Google Gemini.
 * @param apiKey Chave de API do Google Gemini
 * @param modelName Nome do modelo Gemini
 * @returns {ChatGoogleGenerativeAI} O modelo de linguagem criado.
 */
export function createLangchainClient(
  apiKey: string,
  modelName: string
): ChatGoogleGenerativeAI {
  return new ChatGoogleGenerativeAI({
    apiKey: apiKey,
    model: modelName,
    temperature: 0,
  });
}
