import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Calendar, ExternalLink, TrendingUp, ArrowUp, MessageCircle, DollarSign, Target, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  simple_explanation: string;
  relevance_to_pm: string;
  pm_use_cases: string[];
  pricing_comparison?: {
    model: string;
    price_per_1k_tokens: number;
    competitors: Array<{
      name: string;
      price_per_1k_tokens: number;
    }>;
  };
  published_date: string;
  source_url?: string;
  is_featured: boolean;
  upvotes: number;
  comments: number;
}

// Mock data - will be replaced with Supabase data
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "OpenAI Releases GPT-4 Turbo with Enhanced Speed",
    summary: "OpenAI announced GPT-4 Turbo, offering 3x faster processing and reduced costs for enterprise customers.",
    simple_explanation: "Think of this like upgrading from a regular car to a sports car - same destination, but you get there much faster and use less fuel.",
    relevance_to_pm: "For PMs: This means your AI-powered features can respond faster to users and cost less to run, improving user experience and reducing operational costs.",
    pm_use_cases: [
      "Real-time customer support chatbots",
      "Code review automation for dev teams", 
      "Instant document summarization",
      "Dynamic content personalization"
    ],
    pricing_comparison: {
      model: "GPT-4 Turbo",
      price_per_1k_tokens: 0.01,
      competitors: [
        { name: "GPT-4", price_per_1k_tokens: 0.03 },
        { name: "Gemini Pro", price_per_1k_tokens: 0.0005 },
        { name: "Claude-3", price_per_1k_tokens: 0.015 }
      ]
    },
    published_date: "2024-01-08",
    source_url: "https://openai.com",
    is_featured: true,
    upvotes: 1240,
    comments: 89
  },
  {
    id: "2", 
    title: "Google Launches Gemini Pro with Multimodal Capabilities",
    summary: "Google's new AI model can understand both text and images simultaneously, opening new possibilities for customer support.",
    simple_explanation: "Imagine having an assistant who can both read your email AND look at the attached photos to give you complete help.",
    relevance_to_pm: "For PMs: You can now build features where users upload screenshots of issues and get AI help that understands both the text description and the visual problem.",
    pm_use_cases: [
      "Visual bug reporting systems",
      "Product image analysis and tagging",
      "Medical image consultation",
      "Educational content creation"
    ],
    pricing_comparison: {
      model: "Gemini Pro",
      price_per_1k_tokens: 0.0005,
      competitors: [
        { name: "GPT-4V", price_per_1k_tokens: 0.01 },
        { name: "Claude-3 Vision", price_per_1k_tokens: 0.015 }
      ]
    },
    published_date: "2024-01-07",
    is_featured: true,
    upvotes: 892,
    comments: 134
  },
  {
    id: "3",
    title: "AI Voice Assistants Show 40% Improvement in Accuracy",
    summary: "Latest benchmarks show significant improvements in voice AI accuracy across multiple languages and accents.",
    simple_explanation: "Voice assistants are getting much better at understanding what people say, even with different accents or in noisy places.",
    relevance_to_pm: "For PMs: Voice interfaces are becoming more reliable for customer support, making voice-based features more viable for your product roadmap.",
    pm_use_cases: [
      "Multilingual customer support",
      "Voice-controlled IoT devices",
      "Accessibility features for apps",
      "Voice data entry for mobile apps"
    ],
    published_date: "2024-01-06",
    is_featured: false,
    upvotes: 456,
    comments: 67
  }
];

export const DailyNewsSection = () => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [expandedDetails, setExpandedDetails] = useState<{ [key: string]: boolean }>({});

  const currentNews = mockNews[currentNewsIndex];

  const nextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % mockNews.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + mockNews.length) % mockNews.length);
  };

  const toggleDetails = (section: string) => {
    setExpandedDetails(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <section id="news" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">AI Intelligence Feed</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Latest AI developments with PM-focused insights. 
            One story at a time, deeply analyzed.
          </p>
        </div>

        {/* Main News Card - Reddit Style */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-card border border-border shadow-card">
            {/* Header with upvotes and meta */}
            <div className="flex items-center gap-4 p-4 border-b border-border">
              <div className="flex flex-col items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                  <ArrowUp className="w-4 h-4 text-muted-foreground hover:text-primary" />
                </Button>
                <span className="text-sm font-medium text-primary">{currentNews.upvotes}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">r/AIProductNews</Badge>
                  <span className="text-xs text-muted-foreground">
                    Posted {new Date(currentNews.published_date).toLocaleDateString()}
                  </span>
                  {currentNews.is_featured && (
                    <Badge className="bg-primary/10 text-primary text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold leading-tight">{currentNews.title}</h3>
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-6">{currentNews.summary}</p>

              {/* Simple Explanation */}
              <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-info-foreground mb-2 flex items-center">
                  💡 ELI5 (Explain Like I'm 5)
                </h4>
                <p className="text-sm text-muted-foreground">{currentNews.simple_explanation}</p>
              </div>

              {/* PM Use Cases - Collapsible */}
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-4">
                <Button
                  variant="ghost"
                  onClick={() => toggleDetails('useCases')}
                  className="w-full justify-between p-0 h-auto hover:bg-transparent"
                >
                  <h4 className="font-semibold text-success-foreground flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    PM Use Cases ({currentNews.pm_use_cases.length})
                  </h4>
                  {expandedDetails.useCases ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
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

              {/* Pricing Comparison - Collapsible */}
              {currentNews.pricing_comparison && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => toggleDetails('pricing')}
                    className="w-full justify-between p-0 h-auto hover:bg-transparent"
                  >
                    <h4 className="font-semibold text-accent-foreground flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Pricing vs Competitors
                    </h4>
                    {expandedDetails.pricing ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </Button>
                  
                  {expandedDetails.pricing && (
                    <div className="mt-3 animate-fade-in">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-primary/10 p-3 rounded">
                          <div className="font-medium text-primary text-sm">{currentNews.pricing_comparison.model}</div>
                          <div className="text-lg font-bold">${currentNews.pricing_comparison.price_per_1k_tokens}</div>
                          <div className="text-xs text-muted-foreground">per 1K tokens</div>
                        </div>
                        {currentNews.pricing_comparison.competitors.map((comp, idx) => (
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

              {/* PM Relevance */}
              <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2 flex items-center">
                  🎯 Strategic PM Insight
                </h4>
                <p className="text-sm text-muted-foreground">{currentNews.relevance_to_pm}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {currentNews.comments} comments
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
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={prevNews} disabled={mockNews.length <= 1}>
              ← Previous
            </Button>
            <div className="flex items-center gap-2">
              {mockNews.map((_, idx) => (
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
            <Button variant="outline" onClick={nextNews} disabled={mockNews.length <= 1}>
              Next →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};