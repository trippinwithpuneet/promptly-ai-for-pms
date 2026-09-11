import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible";
import { generateText, NoObjectGeneratedError, Output } from "npm:ai";
import { z } from "npm:zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const recommendationSchema = z.object({
  mode: z.enum(["question", "recommendation"]),
  question: z.string().nullable(),
  questionContext: z.string().nullable(),
  summary: z.string(),
  recommendations: z.array(z.object({
    modelName: z.string(),
    provider: z.string(),
    modelType: z.string(),
    pricingType: z.string(),
    pricingDetails: z.string(),
    fitReason: z.string(),
    strengths: z.array(z.string()),
    limitations: z.array(z.string()),
    nextStep: z.string(),
  })),
});

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

function errorMessage(status: number, fallback: string) {
  if (status === 402) return "AI credits are unavailable. The app owner can add credits in Lovable.";
  if (status === 403) return "Model Finder is currently unavailable because AI access is disabled.";
  if (status === 429) return "Model Finder is busy right now. Please wait a moment and try again.";
  return fallback;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return Response.json(
        { error: "Model Finder is not configured yet." },
        { status: 500, headers: corsHeaders },
      );
    }

    const body = await req.json();
    const messages = Array.isArray(body?.messages)
      ? body.messages.filter((message: ConversationMessage) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
      ).slice(-6)
      : [];
    const userTurnCount = messages.filter((message: ConversationMessage) => message.role === "user").length;

    if (userTurnCount < 1 || userTurnCount > 3) {
      return Response.json(
        { error: "Please provide between one and three answers." },
        { status: 400, headers: corsHeaders },
      );
    }

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });

    const systemPrompt = `You are Promptly's Model Finder for non-technical product managers.
Decide whether the conversation contains enough information to recommend current AI models.

Ask a clarifying question only when the missing answer could materially change the recommendation. Useful dimensions include the task, input/output modality, expected scale, latency, privacy, language, integration needs, and budget. Ask exactly one focused question at a time.

Hard rules:
- There are ${userTurnCount} user answers so far. Never ask another question when this number is 3.
- Prefer recommending immediately when the use case is already specific.
- If recommending, return 2 or 3 practical, currently available models ranked by fit.
- Clearly distinguish free, freemium, and paid access. Avoid false precision; say pricing varies when uncertain.
- Explain trade-offs in plain language for a PM. Do not assume engineering knowledge.
- In question mode, recommendations must be empty, summary must be a short acknowledgment, and questionContext briefly explains why the answer matters.
- In recommendation mode, question and questionContext must be null, and summary must synthesize the understood need.`;

    const result = await generateText({
      model: gateway("google/gemini-3.8-flash"),
      system: systemPrompt,
      messages,
      output: Output.object({ schema: recommendationSchema }),
    });

    return Response.json(result.output, { headers: corsHeaders });
  } catch (error) {
    console.error("model-finder failed", error);

    if (NoObjectGeneratedError.isInstance(error)) {
      return Response.json(
        { error: "Model Finder could not structure that recommendation. Please try again." },
        { status: 502, headers: corsHeaders },
      );
    }

    const status = typeof error === "object" && error && "statusCode" in error
      ? Number(error.statusCode)
      : 500;
    const detail = error instanceof Error ? error.message : "Model Finder could not respond.";
    return Response.json(
      { error: errorMessage(status, detail) },
      { status, headers: corsHeaders },
    );
  }
});