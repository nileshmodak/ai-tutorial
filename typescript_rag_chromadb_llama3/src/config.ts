import "dotenv/config";

export const config = {
  ollamaUrl: process.env.OLLAMA_URL ?? "http://localhost:11434",
  llmModel: process.env.LLM_MODEL ?? "llama3.1",
  embeddingModel: process.env.EMBEDDING_MODEL ?? "nomic-embed-text",
  chromaUrl: process.env.CHROMA_URL ?? "http://localhost:8000",
  collectionName: process.env.COLLECTION_NAME ?? "local_documents"
};