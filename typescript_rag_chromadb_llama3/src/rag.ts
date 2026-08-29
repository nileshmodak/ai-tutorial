import { ChromaClient } from "chromadb";
import { createEmbedding } from "./embeddings.js";
import { generateAnswer } from "./ollama.js";
import { config } from "./config.js";

async function getCollection() {
  const client = new ChromaClient({
    path: config.chromaUrl
  });

  return client.getOrCreateCollection({
    name: config.collectionName
  });
}

export async function askQuestion(
  question: string
) {
  const collection = await getCollection();

  const queryEmbedding =
    await createEmbedding(question);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 5
  });

  const documents =
    results.documents?.[0] ?? [];

  const metadatas =
    results.metadatas?.[0] ?? [];

  const context = documents
    .map((doc, index) => {
      const source =
        metadatas[index]?.source ?? "unknown";

      return `
SOURCE: ${source}

${doc}
`;
    })
    .join("\n----------------\n");

  const prompt = `
You are a helpful AI assistant.

Answer the user's question using ONLY the
provided context.

If the answer cannot be found in the context,
say:

"I couldn't find that information in the
provided documents."

Do not make up information.

Always mention the source document when
possible.

CONTEXT:
${context}

QUESTION:
${question}

ANSWER:
`;

  const answer =
    await generateAnswer(prompt);

  return {
    answer,
    sources: metadatas
  };
}