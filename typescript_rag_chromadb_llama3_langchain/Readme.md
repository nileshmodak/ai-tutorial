# LangChain RAG with Ollama + ChromaDB (TypeScript)

Rewrite of the plain-TypeScript RAG example
(`typescript_rag_chromadb_llama3`) using **LangChain.js**.

Same architecture, but the manual embedding, chunking,
vector-store and chain logic is now handled by LangChain
abstractions:

- `RecursiveCharacterTextSplitter` replaces manual chunking
- `OllamaEmbeddings` replaces the raw `ollama.embed` call
- `Chroma` vector store replaces direct `ChromaClient` usage
- `ChatOllama` + `ChatPromptTemplate` + LCEL chain replace the
  hand-written prompt and raw `ollama.generate` call

## Steps to run

### 1. Start ChromaDB

```text
docker run -d --name chromadb -p 8000:8000 chromadb/chroma
```

### 2. Configure

Copy `.env.example` to `.env` and adjust as needed.

### 3. Ingest your documents

```text
npm run ingest
```

### 4. Start the RAG chatbot

```text
npm run start
```

## Architecture

```text
┌─────────────────┐
│  Your Documents │
│    PDF/TXT/MD   │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ RecursiveCharacter- │
│   TextSplitter      │
└────────┬────────────┘
         │
         ▼
┌──────────────────┐
│ OllamaEmbeddings │
│ nomic-embed-text │
└────────┬─────────┘
         │
         ▼
┌─────────────┐
│ ChromaDB    │
│ Vector Store│
└─────────────┘


        User Question
              │
              ▼
┌──────────────┐
│  asRetriever │
│ (top 5 docs) │
└──────┬───────┘
       │
       ▼
┌────────────────┐
│ ChatPromptTemplate
│   + ChatOllama │
│    llama3.1    │
└───────┬────────┘
        │
        ▼
      Answer
```
