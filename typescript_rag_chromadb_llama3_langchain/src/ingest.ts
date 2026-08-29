import fs from "node:fs/promises";
import path from "node:path";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "@langchain/core/documents";
import { config } from "./config.js";

const documentsPath = path.resolve("documents");

const embeddings = new OllamaEmbeddings({
  model: config.embeddingModel,
  baseUrl: config.ollamaUrl
});

async function getVectorStore() {
  return new Chroma(embeddings, {
    collectionName: config.collectionName,
    url: config.chromaUrl
  });
}

async function readDocuments() {
  const files = await fs.readdir(documentsPath);

  return files.filter((file) =>
    [".txt", ".md"].includes(path.extname(file).toLowerCase())
  );
}

async function main() {
  console.log("Starting ingestion...");

  const vectorStore = await getVectorStore();

  const files = await readDocuments();

  if (files.length === 0) {
    console.log("No .txt or .md documents found in documents/");
    return;
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150
  });

  const allDocuments: Document[] = [];

  for (const file of files) {
    console.log(`Processing: ${file}`);

    const filePath = path.join(documentsPath, file);
    const text = await fs.readFile(filePath, "utf8");

    const chunks = await splitter.splitDocuments([
      new Document({ pageContent: text, metadata: { source: file } })
    ]);

    console.log(`  → ${chunks.length} chunks`);

    allDocuments.push(...chunks);
  }

  if (allDocuments.length === 0) {
    console.log("No content found to embed.");
    return;
  }

  await vectorStore.addDocuments(allDocuments);

  console.log(`\nIngestion complete. Added ${allDocuments.length} chunks.`);
}

main().catch(console.error);
