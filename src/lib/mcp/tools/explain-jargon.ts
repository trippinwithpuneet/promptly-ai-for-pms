import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { glossary } from "../knowledge";

export default defineTool({
  name: "explain_ai_jargon",
  title: "Explain AI jargon",
  description: "Explain an AI term simply, including benefits, drawbacks, and alternatives.",
  inputSchema: { query: z.string().trim().min(1).max(100).describe("The AI term or phrase to explain.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const needle = query.toLowerCase();
    const matches = glossary.filter((entry) => entry.term.toLowerCase().includes(needle) || needle.includes(entry.term.toLowerCase())).slice(0, 5);
    if (matches.length === 0) return { content: [{ type: "text", text: `Promptly does not have an explanation for “${query}” yet.` }], structuredContent: { matches: [] } };
    return { content: [{ type: "text", text: JSON.stringify(matches, null, 2) }], structuredContent: { matches } };
  },
});