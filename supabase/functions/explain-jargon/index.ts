import { createOpenAI } from "npm:@ai-sdk/openai";
import { streamText } from "npm:ai";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
} from "../_shared/ai-gateway.ts";

const BodySchema = z.object({ term: z.string().trim().min(1).max(100) });
const DifficultySchema = z.enum(["beginner", "intermediate", "advanced"]);

type Explanation = {
  isAiRelated: boolean;
  term: string;
  simpleExplanation: string;
  detailedExplanation: string;
  benefits: string;
  drawbacks: string;
  alternatives: string;
  category: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
};

function recoverExplanation(text: string): Explanation | null {
  try {
    const jsonText = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]
      ?? text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const raw = JSON.parse(jsonText) as Record<string, unknown>;
    const isAiRelated = raw.isAiRelated === true;
    const difficulty = DifficultySchema.safeParse(raw.difficultyLevel);

    if (!isAiRelated) {
      return {
        isAiRelated: false,
        term: String(raw.term ?? ""),
        simpleExplanation: "",
        detailedExplanation: "",
        benefits: "",
        drawbacks: "",
        alternatives: "",
        category: "",
        difficultyLevel: "beginner",
      };
    }

    const explanation = {
      isAiRelated: true,
      term: String(raw.term ?? "").trim(),
      simpleExplanation: String(raw.simpleExplanation ?? "").trim(),
      detailedExplanation: String(raw.detailedExplanation ?? "").trim(),
      benefits: String(raw.benefits ?? "").trim(),
      drawbacks: String(raw.drawbacks ?? "").trim(),
      alternatives: String(raw.alternatives ?? "").trim(),
      category: String(raw.category ?? "AI terminology").trim(),
      difficultyLevel: difficulty.success ? difficulty.data : "intermediate",
    } satisfies Explanation;

    return explanation.term && explanation.simpleExplanation && explanation.detailedExplanation
      ? explanation
      : null;
  } catch {
    return null;
  }
}

function gatewayError(status: number, message: string) {
  if (status === 401) return "Jargon Buster is not configured correctly.";
  if (status === 402) return message || "AI explanations are temporarily paused because credits are unavailable.";
  if (status === 403) return message || "AI explanations are currently unavailable.";
  if (status === 429) return "Jargon Buster is busy right now. Please wait a moment and try again.";
  return message || "Jargon Buster could not explain that term. Please try again.";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405, headers: corsHeaders });
  }

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Enter an AI term between 1 and 100 characters." },
        { status: 400, headers: corsHeaders },
      );
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return Response.json(
        { error: "Jargon Buster is not configured yet." },
        { status: 500, headers: corsHeaders },
      );
    }

    const initialRunId = getLovableAiGatewayRunId(req);
    const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
      fetch: runIdFetch.fetch,
    });

    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system: `You are Promptly's Jargon Buster for non-technical product managers.
Classify whether the user's phrase is genuinely related to artificial intelligence, machine learning, AI products, AI infrastructure, or common AI business concepts.
If it is unrelated, set isAiRelated to false and leave all explanation fields empty.
If it is related, explain it accurately in plain language. Keep each field concise and useful to a PM. Benefits, drawbacks, and alternatives should be short comma-separated points. Use only beginner, intermediate, or advanced for difficultyLevel.
Return only one valid JSON object with exactly these fields and no markdown:
{"isAiRelated":boolean,"term":string,"simpleExplanation":string,"detailedExplanation":string,"benefits":string,"drawbacks":string,"alternatives":string,"category":string,"difficultyLevel":"beginner"|"intermediate"|"advanced"}`,
      prompt: `Explain this term as JSON: ${parsed.data.term}`,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const explanation = recoverExplanation(await result.text);
    if (!explanation) {
      return Response.json(
        { error: "Jargon Buster could not read that explanation. Please try again." },
        { status: 502, headers: corsHeaders },
      );
    }

    const headers = getLovableAiGatewayResponseHeaders(undefined, corsHeaders);
    const runId = runIdFetch.getRunId();
    if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
    return Response.json(explanation, { headers });
  } catch (error) {
    console.error("explain-jargon failed", error);
    const status = typeof error === "object" && error && "statusCode" in error
      ? Number(error.statusCode)
      : 500;
    const detail = error instanceof Error ? error.message : "";
    return Response.json(
      { error: gatewayError(status, detail) },
      { status, headers: corsHeaders },
    );
  }
});