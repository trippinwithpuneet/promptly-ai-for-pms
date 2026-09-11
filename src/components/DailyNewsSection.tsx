import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Zap,
  ExternalLink,
  TrendingUp,
  MessageCircle,
  DollarSign,
  Target,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plus,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PricingComparison {
  model: string;
  price_per_1k_tokens: number;
  competitors: Array<{ name: string; price_per_1k_tokens: number }>;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  simple_explanation: string | null;
  relevance_to_pm: string | null;
  pm_use_cases: string[];
  pricing_comparison: PricingComparison | null;
  published_date: string;
  source_name: string | null;
  source_url: string | null;
  is_featured: boolean;
  is_user_submitted: boolean;
  submitted_by: string | null;
}

export const DailyNewsSection = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    source_url: "",
    source_name: "",
    submitted_by: "",
    relevance_to_pm: "",
  });

  const loadNews = useCallback(async () => {
    const { data, error } = await supabase
      .from("news_items")
      .select("*")
      .order("published_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      toast({
        title: "Could not load the nuggets",
        description: "Please try refreshing in a moment.",
        variant: "destructive",
      });
      return [] as NewsItem[];
    }
    const rows = (data ?? []) as unknown as NewsItem[];
    setNews(rows);
    setCurrentNewsIndex(0);
    return rows;
  }, [toast]);

  const refreshNews = useCallback(
    async (silent = false) => {
      setRefreshing(true);
      const { data, error } = await supabase.functions.invoke("fetch-ai-news");
      setRefreshing(false);

      if (error || (data as { error?: string })?.error) {
        if (!silent) {
          toast({
            title: "Could not fetch today's news",
            description: (data as { error?: string })?.error ?? "Please try again in a moment.",
            variant: "destructive",
          });
        }
        return;
      }

      const inserted = (data as { inserted?: number })?.inserted ?? 0;
      await loadNews();
      if (!silent) {
        toast({
          title: inserted > 0 ? `${inserted} fresh nuggets added` : "You're already up to date",
          description:
            inserted > 0
              ? "Pulled from OpenAI, Google, TechCrunch and more."
              : "No new stories since the last check.",
        });
      }
    },
    [loadNews, toast],
  );

  useEffect(() => {
    (async () => {
      const rows = await loadNews();
      setLoading(false);
      if (rows.length === 0) await refreshNews(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentNews = news[currentNewsIndex];

  const nextNews = () => setCurrentNewsIndex((prev) => (prev + 1) % news.length);
  const prevNews = () => setCurrentNewsIndex((prev) => (prev - 1 + news.length) % news.length);
  const toggleDetails = (section: string) =>
    setExpandedDetails((prev) => ({ ...prev, [section]: !prev[section] }));

  const submitStory = async () => {
    if (!form.title.trim() || !form.summary.trim()) {
      toast({
        title: "Add a headline and a short summary",
        description: "Those two are needed to save your story.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("news_items").insert({
      title: form.title.trim(),
      summary: form.summary.trim(),
      relevance_to_pm: form.relevance_to_pm.trim() || null,
      source_url: form.source_url.trim() || null,
      source_name: form.source_name.trim() || "Added by you",
      submitted_by: form.submitted_by.trim() || null,
      is_user_submitted: true,
      is_featured: false,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Could not save your story",
        description: error.message.includes("duplicate")
          ? "That link is already on the feed."
          : "Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Story added", description: "It's now at the top of your feed." });
    setForm({ title: "", summary: "", source_url: "", source_name: "", submitted_by: "", relevance_to_pm: "" });
    setAddOpen(false);
    await loadNews();
  };

  return (
    <section id="news" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">Daily nuggets</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real AI news from OpenAI, Google, DeepMind, TechCrunch, VentureBeat and MIT Technology
            Review — one story at a time, explained for product managers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => refreshNews()} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Fetching latest news…" : "Get today's news"}
          </Button>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add your own story
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add a story to the feed</DialogTitle>
                <DialogDescription>
                  Spotted something worth keeping? Save it here and it shows up at the top.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="story-title">Headline</Label>
                  <Input
                    id="story-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Anthropic ships cheaper voice model"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="story-summary">What happened</Label>
                  <Textarea
                    id="story-summary"
                    rows={3}
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    placeholder="A couple of sentences in your own words"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="story-relevance">Why it matters to you (optional)</Label>
                  <Textarea
                    id="story-relevance"
                    rows={2}
                    value={form.relevance_to_pm}
                    onChange={(e) => setForm({ ...form, relevance_to_pm: e.target.value })}
                    placeholder="Could cut our support voice-bot costs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="story-url">Link (optional)</Label>
                    <Input
                      id="story-url"
                      value={form.source_url}
                      onChange={(e) => setForm({ ...form, source_url: e.target.value })}
                      placeholder="https://…"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="story-source">Source name (optional)</Label>
                    <Input
                      id="story-source"
                      value={form.source_name}
                      onChange={(e) => setForm({ ...form, source_name: e.target.value })}
                      placeholder="The Verge"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="story-by">Your name (optional)</Label>
                  <Input
                    id="story-by"
                    value={form.submitted_by}
                    onChange={(e) => setForm({ ...form, submitted_by: e.target.value })}
                    placeholder="Puneet"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitStory} disabled={submitting}>
                  {submitting ? "Saving…" : "Add story"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          {loading ? (
            <Card className="bg-card border border-border shadow-card">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ) : !currentNews ? (
            <Card className="bg-card border border-border shadow-card">
              <CardContent className="p-10 text-center space-y-4">
                <h3 className="text-xl font-semibold">No nuggets yet</h3>
                <p className="text-muted-foreground">
                  Fetch today's AI news, or add a story you came across yourself.
                </p>
                <Button onClick={() => refreshNews()} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  Get today's news
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border border-border shadow-card">
              <div className="flex items-start gap-4 p-4 border-b border-border">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {currentNews.source_name ?? "AI news"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(currentNews.published_date).toLocaleDateString()}
                    </span>
                    {currentNews.is_user_submitted ? (
                      <Badge className="bg-accent/10 text-accent-foreground text-xs">
                        <UserRound className="w-3 h-3 mr-1" />
                        {currentNews.submitted_by ? `Added by ${currentNews.submitted_by}` : "Your story"}
                      </Badge>
                    ) : (
                      currentNews.is_featured && (
                        <Badge className="bg-primary/10 text-primary text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      )
                    )}
                  </div>
                  <h3 className="text-xl font-bold leading-tight">{currentNews.title}</h3>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-muted-foreground mb-6">{currentNews.summary}</p>

                {currentNews.simple_explanation && (
                  <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-info-foreground mb-2 flex items-center">
                      💡 ELI5 (Explain Like I'm 5)
                    </h4>
                    <p className="text-sm text-muted-foreground">{currentNews.simple_explanation}</p>
                  </div>
                )}

                {currentNews.pm_use_cases?.length > 0 && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-4">
                    <Button
                      variant="ghost"
                      onClick={() => toggleDetails("useCases")}
                      className="w-full justify-between p-0 h-auto hover:bg-transparent"
                    >
                      <h4 className="font-semibold text-success-foreground flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        PM Use Cases ({currentNews.pm_use_cases.length})
                      </h4>
                      {expandedDetails.useCases ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>

                    {expandedDetails.useCases && (
                      <div className="mt-3 space-y-2 animate-fade-in">
                        {currentNews.pm_use_cases.map((useCase, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-success-foreground font-medium text-sm">•</span>
                            <span className="text-sm text-muted-foreground">{useCase}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentNews.pricing_comparison && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
                    <Button
                      variant="ghost"
                      onClick={() => toggleDetails("pricing")}
                      className="w-full justify-between p-0 h-auto hover:bg-transparent"
                    >
                      <h4 className="font-semibold text-accent-foreground flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Pricing vs Competitors
                      </h4>
                      {expandedDetails.pricing ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>

                    {expandedDetails.pricing && (
                      <div className="mt-3 animate-fade-in">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-primary/10 p-3 rounded">
                            <div className="font-medium text-primary text-sm">
                              {currentNews.pricing_comparison.model}
                            </div>
                            <div className="text-lg font-bold">
                              ${currentNews.pricing_comparison.price_per_1k_tokens}
                            </div>
                            <div className="text-xs text-muted-foreground">per 1K tokens</div>
                          </div>
                          {currentNews.pricing_comparison.competitors?.map((comp, idx) => (
                            <div key={idx} className="bg-muted/50 p-3 rounded">
                              <div className="font-medium text-sm">{comp.name}</div>
                              <div className="text-lg font-bold">${comp.price_per_1k_tokens}</div>
                              <div className="text-xs text-muted-foreground">per 1K tokens</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentNews.relevance_to_pm && (
                  <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-2 flex items-center">🎯 Strategic PM Insight</h4>
                    <p className="text-sm text-muted-foreground">{currentNews.relevance_to_pm}</p>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={`https://hn.algolia.com/?query=${encodeURIComponent(currentNews.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Discussion
                    </a>
                  </Button>
                  {currentNews.source_url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={currentNews.source_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Source
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {news.length > 1 && (
            <div className="flex items-center justify-between mt-6 gap-4">
              <Button variant="outline" onClick={prevNews}>
                ← Previous
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {news.slice(0, 12).map((_, idx) => (
                  <Button
                    key={idx}
                    variant={idx === currentNewsIndex ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentNewsIndex(idx)}
                  >
                    {idx + 1}
                  </Button>
                ))}
              </div>
              <Button variant="outline" onClick={nextNews}>
                Next →
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
