import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { models } from "../knowledge";

export default defineTool({
  name: "find_ai_models",
  title: "Find AI models",
  description: "Recommend AI models for a product use case with pricing, strengths, and limitations.",
  inputSchema: { useCase: z.string().trim().min(3).max(1000).describe("What the product manager wants AI to do.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ useCase }) => {
    const query = useCase.toLowerCase();
    let matches = models.filter((model) => `${model.type} ${model.useCases}`.toLowerCase().split(/[ ,]+/).some((word) => word.length > 3 && query.includes(word)));
    if (query.includes("voice") || query.includes("speech") || query.includes("transcri")) matches = models.filter((model) => model.type === "voice");
    else if (query.includes("image") || query.includes("visual")) matches = models.filter((model) => model.type === "multimodal");
    else if (query.includes("support") || query.includes("chat") || query.includes("text")) matches = models.filter((model) => model.type === "text" || model.type === "multimodal");
    if (matches.length === 0) matches = models.filter((model) => model.type === "text" || model.type === "multimodal");
    const recommendations = matches.slice(0, 3);
    return { content: [{ type: "text", text: JSON.stringify(recommendations, null, 2) }], structuredContent: { recommendations } };
  },
});