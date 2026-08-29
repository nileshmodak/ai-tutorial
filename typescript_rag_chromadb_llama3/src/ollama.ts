import ollama from "ollama";
import { config } from "./config.js";

export async function generateAnswer(
  prompt: string
): Promise<string> {
  const response = await ollama.generate({
    model: config.llmModel,
    prompt,
    stream: false
  });

  return response.response;
}