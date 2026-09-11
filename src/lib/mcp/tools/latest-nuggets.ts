import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "latest_ai_nuggets",
  title: "Latest AI nuggets",
  description: "Get Promptly's latest public AI news, simplified for product managers.",
  inputSchema: { limit: z.number().int().min(1).max(10).default(5).describe("Number of stories to return.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ limit }) => {
    const { data, error } = await supabaseAnon()
      .from("news_items")
      .select("title,summary,simple_explanation,relevance_to_pm,pm_use_cases,pricing_comparison,published_date,source_name,source_url")
      .order("published_date", { ascending: false })
      .limit(limit);

    if (error) return { content: [{ type: "text", text: `Could not load nuggets: ${error.message}` }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: { nuggets: data ?? [] } };
  },
});