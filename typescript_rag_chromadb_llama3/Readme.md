
## Steps to run:
## 1. Start chromaDB:

```text
docker run -d --name chromadb -p 8000:8000 chromadb/chroma
```

## 2. Ingest your documents:
```text
npx tsx src/ingest.ts
```

## 3. Start your RAG chatbot
```text
npx tsx src/index.ts
```

## Architecture

```text
┌─────────────────┐
│  Your Documents │
│    PDF/TXT/MD   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   TypeScript    │
│    Ingestion    │
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│ Ollama Embedding │
│ nomic-embed-text │
└────────┬─────────┘
         │
         ▼
┌─────────────┐
│  ChromaDB   │
│  Vector DB  │
└─────────────┘


        User Question
              │
              ▼
┌──────────────────┐
│ Query Embedding  │
│      Ollama      │
└────────┬─────────┘
         │
         ▼
┌─────────────┐
│Vector Search│
└──────┬──────┘
       │
       │ Top 5 chunks
       ▼
┌────────────────┐
│   Ollama LLM   │
│    llama3.1    │
└───────┬────────┘
        │
        ▼
      Answer