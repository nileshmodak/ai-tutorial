import readline from "node:readline";
import { askQuestion } from "./rag.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
====================================
       LOCAL RAG ASSISTANT
====================================

Ask questions about your documents.

Type "exit" to quit.
`);

function question() {
  rl.question("\nYou: ", async (input) => {
    const text = input.trim();

    if (text.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    if (!text) {
      question();
      return;
    }

    try {
      console.log("\nThinking...\n");

      const result = await askQuestion(text);

      console.log("Assistant:");
      console.log(result.answer);

      const sources = [
        ...new Set(
          result.sources
            .map((s: any) => s?.source)
            .filter(Boolean)
        )
      ];

      if (sources.length) {
        console.log(
          "\nSources:",
          sources.join(", ")
        );
      }
    } catch (error) {
      console.error(
        "\nError:",
        error
      );
    }

    question();
  });
}

question();
