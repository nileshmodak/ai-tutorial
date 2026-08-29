import fs from "node:fs/promises";
import path from "node:path";
import { ChromaClient } from "chromadb";
import { createEmbedding } from "./embeddings.js";
import { config } from "./config.js";

const documentsPath = path.resolve("documents");

function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 150
): string[] {
  const chunks: string[] = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(
      start + chunkSize,
      text.length
    );

    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    start += chunkSize - overlap;
  }

  return chunks;
}

async function getCollection() {
  const client = new ChromaClient({
    path: config.chromaUrl
  });

  return client.getOrCreateCollection({
    name: config.collectionName
  });
}

async function readDocuments() {
  const files = await fs.readdir(documentsPath);

  const supported = files.filter((file) =>
    [".txt", ".md"].includes(path.extname(file).toLowerCase())
  );

  return supported;
}

async function main() {
  console.log("Starting ingestion...");

  const collection = await getCollection();

  const files = await readDocuments();

  if (files.length === 0) {
    console.log(
      "No .txt or .md documents found in documents/"
    );
    return;
  }

  let id = 0;

  for (const file of files) {
    console.log(`Processing: ${file}`);

    const filePath = path.join(documentsPath, file);

    const text = await fs.readFile(
      filePath,
      "utf8"
    );

    const chunks = chunkText(text);

    for (const chunk of chunks) {
      console.log(`Embedding chunk ${id}`);

      const embedding = await createEmbedding(chunk);

      await collection.add({
        ids: [`${file}-${id}`],
        documents: [chunk],
        embeddings: [embedding],
        metadatas: [
          {
            source: file
          }
        ]
      });

      id++;
    }
  }

  console.log(
    `\nIngestion complete. Added ${id} chunks.`
  );
}

main().catch(console.error);