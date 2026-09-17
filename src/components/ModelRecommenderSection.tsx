import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AlertCircle, Brain, CheckCircle, DollarSign, RotateCcw, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface ModelRecommendation {
  modelName: string;
  provider: string;
  modelType: string;
  pricingType: string;
  pricingDetails: string;
  fitReason: string;
  strengths: string[];
  limitations: string[];
  nextStep: string;
}

interface FinderResponse {
  mode: "question" | "recommendation";
  question: string | null;
  questionContext: string | null;
  summary: string;
  recommendations: ModelRecommendation[];
}

const pricingColors: Record<string, string> = {
  free: "bg-success text-success-foreground",
  paid: "bg-destructive text-destructive-foreground",
  freemium: "bg-primary text-primary-foreground",
};

const initialAssistantMessage = "Tell me what you want AI to do. Include anything you already know about your users, inputs, scale, speed, privacy, or budget.";

export const ModelRecommenderSection = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { role: "assistant", content: initialAssistantMessage },
  ]);
  const [recommendations, setRecommendations] = useState<ModelRecommendation[]>([]);
  const [recommendationSummary, setRecommendationSummary] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userTurnCount = messages.filter((message) => message.role === "user").length;
  const isComplete = recommendations.length > 0;

  useEffect(() => {
    if (userTurnCount > 0 && !isThinking && !isComplete) inputRef.current?.focus({ preventScroll: true });
  }, [userTurnCount, isThinking, isComplete, messages.length]);

  const submitAnswer = async (event: FormEvent) => {
    event.preventDefault();
    const answer = input.trim();
    if (!answer || isThinking || isComplete || userTurnCount >= 3) return;

    const nextMessages = [...messages, { role: "user" as const, content: answer }];
    const conversationForModel = nextMessages.filter((_, index) => index > 0);
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsThinking(true);

    const restoreFailedAnswer = (message: string) => {
      setMessages(messages);
      setInput(answer);
      setError(message);
    };

    const { data, error: functionError } = await supabase.functions.invoke("model-finder", {
      body: { messages: conversationForModel },
    });

    setIsThinking(false);

    if (functionError || !data) {
      restoreFailedAnswer(functionError?.message || "Model Finder could not respond. Please try again.");
      return;
    }

    if (data.error) {
      restoreFailedAnswer(data.error);
      return;
    }

    const response = data as FinderResponse;
    const nextTurnCount = userTurnCount + 1;

    if (response.mode === "question" && response.question && nextTurnCount < 3) {
      const clarification = response.questionContext
        ? `${response.question}\n\n_${response.questionContext}_`
        : response.question;
      setMessages((current) => [...current, { role: "assistant", content: clarification }]);
      return;
    }

    if (!response.recommendations?.length) {
      restoreFailedAnswer("I couldn't form a useful shortlist. Your answer is still here—please try again.");
      return;
    }

    setRecommendationSummary(response.summary);
    setRecommendations(response.recommendations.slice(0, 3));
    setMessages((current) => [
      ...current,
      { role: "assistant", content: "I have enough context. Here’s the shortlist I’d test first." },
    ]);
  };

  const resetFinder = () => {
    setInput("");
    setMessages([{ role: "assistant", content: initialAssistantMessage }]);
    setRecommendations([]);
    setRecommendationSummary("");
    setError("");
  };

  return (
    <section id="models" className="border-b border-border/70 bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-primary">
            <Brain className="h-4 w-4" />
            Choose with confidence
          </div>
          <h2 className="text-4xl uppercase md:text-6xl">Model finder</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Describe the job. Model Finder will ask only what matters, then recommend within three answers.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <Card className="border-border bg-card shadow-card">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Find your best-fit model
                  </CardTitle>
                  <CardDescription className="mt-2">
                    One focused conversation. No account or saved history.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{userTurnCount} of 3 answers</span>
                  {userTurnCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={resetFinder}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Start over
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="space-y-5 p-5 md:p-7" aria-live="polite">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "max-w-[88%] bg-primary text-primary-foreground md:max-w-[75%]"
                          : "w-full border border-border bg-muted text-foreground"
                      }`}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                      Thinking about what matters for this choice…
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}
              </div>

              {!isComplete && (
                <form onSubmit={submitAnswer} className="border-t border-border p-5 md:p-7">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={userTurnCount === 0
                      ? "Example: I need to automate customer support for an Indian commerce app…"
                      : "Add the detail Model Finder asked for…"}
                    rows={4}
                    disabled={isThinking}
                    className="resize-none"
                    aria-label="Your AI use case"
                  />
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      It may recommend immediately when your brief is detailed enough.
                    </p>
                    <Button type="submit" size="lg" disabled={!input.trim() || isThinking}>
                      {userTurnCount === 0 ? "Find models" : "Send answer"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {isComplete && (
            <div className="mt-10 space-y-6">
              <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase text-primary">Your shortlist</p>
                  <h3 className="mt-2 text-3xl uppercase">Models worth testing</h3>
                  <p className="mt-3 max-w-2xl text-muted-foreground">{recommendationSummary}</p>
                </div>
                <Button variant="outline" onClick={resetFinder}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try another use case
                </Button>
              </div>

              {recommendations.map((model, index) => (
                <Card key={`${model.provider}-${model.modelName}`} className="overflow-hidden border-border bg-card transition-all hover:border-primary/40 hover:shadow-card">
                  <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">#{index + 1} recommendation</Badge>
                          <Badge className={pricingColors[model.pricingType.toLowerCase()] ?? "bg-muted text-muted-foreground"}>
                            {model.pricingType}
                          </Badge>
                          <Badge variant="outline">{model.modelType}</Badge>
                        </div>
                        <CardTitle className="text-2xl">{model.modelName}</CardTitle>
                        <CardDescription>by {model.provider}</CardDescription>
                      </div>
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <p className="text-base leading-relaxed">{model.fitReason}</p>
                    <div className="rounded-lg bg-muted p-4">
                      <p className="mb-1 text-sm font-semibold">Pricing</p>
                      <p className="text-sm text-muted-foreground">{model.pricingDetails}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-success/20 bg-success/10 p-4">
                        <p className="mb-2 flex items-center text-sm font-semibold text-success">
                          <CheckCircle className="mr-2 h-4 w-4" /> Strengths
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {model.strengths.map((strength) => <li key={strength}>• {strength}</li>)}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                        <p className="mb-2 flex items-center text-sm font-semibold text-destructive">
                          <AlertCircle className="mr-2 h-4 w-4" /> Watch-outs
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {model.limitations.map((limitation) => <li key={limitation}>• {limitation}</li>)}
                        </ul>
                      </div>
                    </div>
                    <div className="border-l-2 border-primary pl-4">
                      <p className="text-sm font-semibold">Best next step</p>
                      <p className="mt-1 text-sm text-muted-foreground">{model.nextStep}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};