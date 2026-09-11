import { defineMcp } from "@lovable.dev/mcp-js";
import explainJargon from "./tools/explain-jargon";
import findModels from "./tools/find-models";
import latestNuggets from "./tools/latest-nuggets";

export default defineMcp({
  name: "promptly-ai-for-pms",
  title: "promptly-ai-for-pms",
  version: "0.1.0",
  instructions: "Promptly helps product managers understand current AI news, jargon, and model choices. Use these read-only tools for simple, practical answers. Never imply access to private feedback or user data.",
  tools: [latestNuggets, explainJargon, findModels],
});