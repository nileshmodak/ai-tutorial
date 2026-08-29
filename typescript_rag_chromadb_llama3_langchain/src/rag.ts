import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { Document } from "@langchain/core/documents";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { config } from "./config.js";

const embeddings = new OllamaEmbeddings({
  model: config.embeddingModel,
  baseUrl: config.ollamaUrl
});

const llm = new ChatOllama({
  model: config.llmModel,
  baseUrl: config.ollamaUrl,
  temperature: 0
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful AI assistant.

Answer the user's question using ONLY the
provided context.

If the answer cannot be found in the context, say:

"I couldn't find that information in the provided documents."

Do not make up information.

Always mention the source document when possible.

CONTEXT:
{context}
`
  ],
  ["human", "{question}"]
]);

const outputParser = new StringOutputParser();

function formatContext(documents: Document[]): string {
  return documents
    .map((doc) => {
      const source = doc.metadata.source ?? "unknown";
      return `
SOURCE: ${source}

${doc.pageContent}
`;
    })
    .join("\n----------------\n");
}

export async function askQuestion(question: string) {
  const vectorStore = await getVectorStore();

  const chain = RunnableSequence.from([
    {
      context: vectorStore
        .asRetriever(5)
        .pipe((documents: Document[]) => formatContext(documents)),
      question: new RunnablePassthrough()
    },
    prompt,
    llm,
    outputParser
  ]);

  const answer = await chain.invoke(question);

  const documents = await vectorStore.similaritySearch(question, 5);

  return {
    answer,
    sources: documents.map((doc) => ({
      source: doc.metadata.source ?? "unknown"
    }))
  };
}

export async function getVectorStore() {
  return new Chroma(embeddings, {
    collectionName: config.collectionName,
    url: config.chromaUrl
  });
}
