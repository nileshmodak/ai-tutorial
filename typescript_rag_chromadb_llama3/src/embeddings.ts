import ollama from "ollama";
import { config } from "./config.js";

export async function createEmbedding(
  text: string
): Promise<number[]> {
  const response = await ollama.embed({
    model: config.embeddingModel,
    input: text
  });

  return response.embeddings[0];
}