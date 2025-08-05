import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Calendar, ExternalLink, TrendingUp } from "lucide-react";
import { useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  simple_explanation: string;
  relevance_to_pm: string;
  published_date: string;
  source_url?: string;
  is_featured: boolean;
}

// Mock data - will be replaced with Supabase data
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "OpenAI Releases GPT-4 Turbo with Enhanced Speed",
    summary: "OpenAI announced GPT-4 Turbo, offering 3x faster processing and reduced costs for enterprise customers.",
    simple_explanation: "Think of this like upgrading from a regular car to a sports car - same destination, but you get there much faster and use less fuel.",
    relevance_to_pm: "For PMs: This means your AI-powered features can respond faster to users and cost less to run, improving user experience and reducing operational costs.",
    published_date: "2024-01-08",
    source_url: "https://openai.com",
    is_featured: true
  },
  {
    id: "2", 
    title: "Google Launches Gemini Pro with Multimodal Capabilities",
    summary: "Google's new AI model can understand both text and images simultaneously, opening new possibilities for customer support.",
    simple_explanation: "Imagine having an assistant who can both read your email AND look at the attached photos to give you complete help.",
    relevance_to_pm: "For PMs: You can now build features where users upload screenshots of issues and get AI help that understands both the text description and the visual problem.",
    published_date: "2024-01-07",
    is_featured: true
  },
  {
    id: "3",
    title: "AI Voice Assistants Show 40% Improvement in Accuracy",
    summary: "Latest benchmarks show significant improvements in voice AI accuracy across multiple languages and accents.",
    simple_explanation: "Voice assistants are getting much better at understanding what people say, even with different accents or in noisy places.",
    relevance_to_pm: "For PMs: Voice interfaces are becoming more reliable for customer support, making voice-based features more viable for your product roadmap.",
    published_date: "2024-01-06",
    is_featured: false
  }
];

export const DailyNewsSection = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section id="news" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">Daily AI Updates</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay informed with the latest AI developments that matter for product managers. 
            Complex tech, simplified for busy PMs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockNews.map((item) => (
            <Card 
              key={item.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-105 ${
                item.is_featured ? 'ring-2 ring-primary/20 bg-gradient-card' : ''
              }`}
              onClick={() => toggleExpand(item.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.published_date).toLocaleDateString()}
                    </span>
                  </div>
                  {item.is_featured && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                <CardDescription className="text-sm">{item.summary}</CardDescription>
              </CardHeader>

              {expandedCard === item.id && (
                <CardContent className="pt-0 animate-fade-in">
                  <div className="space-y-4">
                    <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                      <h4 className="font-semibold text-info-foreground mb-2 flex items-center">
                        💡 Simple Explanation
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.simple_explanation}</p>
                    </div>
                    
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <h4 className="font-semibold text-success-foreground mb-2 flex items-center">
                        🎯 PM Relevance
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.relevance_to_pm}</p>
                    </div>
                    
                    {item.source_url && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Read Full Article
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
};