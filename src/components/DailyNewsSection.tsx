import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Zap,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Target,
  ChevronDown,
  ChevronUp,
  RefreshCw,
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

  const loadNews = useCallback(async () => {
    const { data, error } = await supabase
      .from("news_items")
      .select("*")
      .order("published_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5);

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

  return (
    <section id="news" className="border-b border-border/70 bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-10 grid gap-6 border-b border-border pb-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-primary">
              <Zap className="h-4 w-4" />
              Add-on / Stay current
            </div>
            <h2 className="text-4xl uppercase md:text-6xl">Daily nuggets</h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
               Five useful AI updates — one story at a time, curated for product managers.
            </p>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Sources:</span>{" "}
              OpenAI, Google AI, Google DeepMind, TechCrunch AI, VentureBeat AI, and MIT Technology Review.
            </p>
          </div>
          <Button variant="outline" onClick={() => refreshNews()} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Fetching latest news…" : "Get today's news"}
          </Button>
        </div>

        <div className="mx-auto mb-8 max-w-5xl">
          {loading ? (
            <Card className="overflow-hidden border-border bg-card shadow-card">
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
                  Fetch today's AI news to start your feed.
                </p>
                <Button onClick={() => refreshNews()} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  Get today's news
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border border-border shadow-card">
              <div className="flex items-start gap-4 border-b border-border p-6 md:p-8">
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
                  <h3 className="max-w-4xl text-2xl leading-tight md:text-4xl">{currentNews.title}</h3>
                </div>
              </div>

              <CardContent className="p-6 md:p-8">
                <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">{currentNews.summary}</p>

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

                {currentNews.source_url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={currentNews.source_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Source
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {news.length > 1 && (
            <div className="flex items-center justify-between mt-6 gap-4">
              <Button variant="outline" onClick={prevNews}>
                ← Previous
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-2">
                 {news.map((_, idx) => (
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
