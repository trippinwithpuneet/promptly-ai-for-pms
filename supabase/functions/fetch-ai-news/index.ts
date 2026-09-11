// Fetches real AI news from reputable sources and enriches it for product managers.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FEEDS = [
  { name: "OpenAI", url: "https://openai.com/news/rss.xml" },
  { name: "Google AI", url: "https://blog.google/technology/ai/rss/" },
  { name: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml" },
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/" },
  { name: "MIT Technology Review", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed" },
];

interface RawItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

function decode(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&#039;|&apos;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8212;|&#8211;/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
}

function linkFromEntry(block: string): string {
  const href = block.match(/<link[^>]*href=["']([^"']+)["']/i);
  if (href) return href[1];
  return tag(block, "link");
}

async function parseFeed(feed: { name: string; url: string }): Promise<RawItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PromptlyNewsBot/1.0)" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/g) ?? [];
    return blocks.slice(0, 6).map((b) => ({
      title: tag(b, "title"),
      link: linkFromEntry(b),
      description: (tag(b, "description") || tag(b, "summary") || tag(b, "content")).slice(0, 900),
      pubDate: tag(b, "pubDate") || tag(b, "published") || tag(b, "updated"),
      source: feed.name,
    })).filter((i) => i.title && i.link);
  } catch (_e) {
    return [];
  }
}

const SYSTEM = `You explain AI news to a product manager at a quick-commerce company who is smart but not technical.
For each story return JSON only. Never invent facts that are not implied by the headline/summary.
Pricing: only include a pricing_comparison when the story is about a specific named model or API and you are confident about published list prices (USD per 1K input tokens). Otherwise set it to null.`;

const schema = {
  type: "object",
  properties: {
    stories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          index: { type: "number" },
          keep: { type: "boolean" },
          title: { type: "string" },
          summary: { type: "string" },
          simple_explanation: { type: "string" },
          relevance_to_pm: { type: "string" },
          pm_use_cases: { type: "array", items: { type: "string" } },
          pricing_comparison: {
            type: ["object", "null"],
            properties: {
              model: { type: "string" },
              price_per_1k_tokens: { type: "number" },
              competitors: {
                type: "array",
                items: {
                  type: "object",
                  properties: { name: { type: "string" }, price_per_1k_tokens: { type: "number" } },
                  required: ["name", "price_per_1k_tokens"],
                },
              },
            },
            required: ["model", "price_per_1k_tokens", "competitors"],
          },
        },
        required: ["index", "keep", "title", "summary", "simple_explanation", "relevance_to_pm", "pm_use_cases"],
      },
    },
  },
  required: ["stories"],
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const feedResults = await Promise.all(FEEDS.map(parseFeed));
    const items = feedResults.flat();
    if (items.length === 0) {
      return new Response(JSON.stringify({ error: "Could not reach any news sources right now." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Skip stories already stored.
    const { data: existing } = await supabase.from("news_items").select("source_url");
    const known = new Set((existing ?? []).map((r: { source_url: string | null }) => r.source_url));
    const fresh = items.filter((i) => !known.has(i.link)).slice(0, 14);

    if (fresh.length === 0) {
      return new Response(JSON.stringify({ inserted: 0, message: "Already up to date." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Today is ${new Date().toISOString().slice(0, 10)}.
Here are candidate AI news stories. Keep only the 6 most relevant for a product manager building AI features (models, pricing, agents, voice, vision, tooling, adoption). Set keep=false for the rest.
For kept stories write:
- title: a clear headline (max 90 chars)
- summary: 2 sentences of what happened
- simple_explanation: an everyday analogy, no jargon
- relevance_to_pm: why a PM should care, starting with "For PMs:"
- pm_use_cases: 3-4 concrete product use cases
- pricing_comparison: only if confident, else null

Stories:
${fresh.map((it, i) => `[${i}] SOURCE: ${it.source}\nTITLE: ${it.title}\nSUMMARY: ${it.description}`).join("\n\n")}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
        tools: [{ type: "function", function: { name: "return_stories", parameters: schema } }],
        tool_choice: { type: "function", function: { name: "return_stories" } },
      }),
    });

    if (!aiRes.ok) {
      const detail = await aiRes.text();
      console.error("AI gateway error", aiRes.status, detail);
      const message = aiRes.status === 429
        ? "Too many requests right now, please try again in a minute."
        : aiRes.status === 402
        ? "AI credits are exhausted. Add credits in workspace settings."
        : "Could not summarise the news right now.";
      return new Response(JSON.stringify({ error: message }), {
        status: aiRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const args = aiJson.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = args ? JSON.parse(args) : { stories: [] };

    const rows = (parsed.stories ?? [])
      .filter((s: { keep?: boolean; index: number }) => s.keep !== false && fresh[s.index])
      .map((s: Record<string, unknown>) => {
        const src = fresh[s.index as number];
        const published = new Date(src.pubDate);
        return {
          title: (s.title as string) || src.title,
          summary: s.summary as string,
          simple_explanation: s.simple_explanation as string,
          relevance_to_pm: s.relevance_to_pm as string,
          pm_use_cases: (s.pm_use_cases as string[]) ?? [],
          pricing_comparison: s.pricing_comparison ?? null,
          published_date: isNaN(published.getTime())
            ? new Date().toISOString().slice(0, 10)
            : published.toISOString().slice(0, 10),
          source_name: src.source,
          source_url: src.link,
          is_featured: true,
          is_user_submitted: false,
        };
      });

    if (rows.length === 0) {
      return new Response(JSON.stringify({ inserted: 0, message: "No new relevant stories found." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("news_items")
      .upsert(rows, { onConflict: "source_url", ignoreDuplicates: true })
      .select("id");

    if (error) throw error;

    return new Response(JSON.stringify({ inserted: data?.length ?? 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-ai-news failed", e);
    return new Response(JSON.stringify({ error: "Something went wrong fetching the news." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
