import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, DollarSign, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { useState } from "react";

interface AIModel {
  id: string;
  model_name: string;
  provider: string;
  model_type: string;
  pricing_type: string;
  pricing_details: string;
  use_cases: string;
  strengths: string;
  limitations: string;
}

// Mock data - will be replaced with Supabase data
const mockModels: AIModel[] = [
  {
    id: "1",
    model_name: "GPT-4",
    provider: "OpenAI",
    model_type: "text",
    pricing_type: "paid",
    pricing_details: "$0.03 per 1K tokens (input), $0.06 per 1K tokens (output)",
    use_cases: "Customer support, content generation, code assistance, analysis",
    strengths: "Excellent reasoning, good at following instructions, versatile",
    limitations: "Can be expensive for high volume, sometimes verbose"
  },
  {
    id: "2",
    model_name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    model_type: "text",
    pricing_type: "paid", 
    pricing_details: "$3 per million input tokens, $15 per million output tokens",
    use_cases: "Complex reasoning, analysis, creative writing, coding",
    strengths: "Great at analysis, helpful and honest, good safety features",
    limitations: "Limited availability in some regions, newer so less ecosystem"
  },
  {
    id: "3",
    model_name: "Gemini Pro",
    provider: "Google",
    model_type: "multimodal",
    pricing_type: "freemium",
    pricing_details: "Free tier available, paid tiers for higher usage",
    use_cases: "Text generation, image analysis, multimodal tasks",
    strengths: "Good integration with Google services, handles images and text",
    limitations: "Free tier has usage limits, quality can vary"
  },
  {
    id: "4",
    model_name: "Whisper",
    provider: "OpenAI",
    model_type: "voice",
    pricing_type: "free",
    pricing_details: "Open source, free to use",
    use_cases: "Speech-to-text, transcription, voice interfaces",
    strengths: "Very accurate, supports many languages, free",
    limitations: "Requires technical setup, no real-time streaming in basic version"
  }
];

const typeColors = {
  text: "bg-info/20 text-info-foreground",
  voice: "bg-secondary text-secondary-foreground",
  image: "bg-success/20 text-success-foreground",
  multimodal: "bg-accent/20 text-foreground"
};

const pricingColors = {
  free: "bg-success text-success-foreground",
  paid: "bg-destructive text-destructive-foreground",
  freemium: "bg-primary text-primary-foreground"
};

export const ModelRecommenderSection = () => {
  const [useCase, setUseCase] = useState("");
  const [recommendations, setRecommendations] = useState<AIModel[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeUseCase = () => {
    setIsAnalyzing(true);
    
    // Simple keyword-based matching (in real app, this would be more sophisticated)
    setTimeout(() => {
      let filtered = mockModels;
      
      if (useCase.toLowerCase().includes('voice') || useCase.toLowerCase().includes('speech')) {
        filtered = mockModels.filter(model => model.model_type === 'voice' || model.use_cases.toLowerCase().includes('voice'));
      } else if (useCase.toLowerCase().includes('image') || useCase.toLowerCase().includes('visual')) {
        filtered = mockModels.filter(model => model.model_type === 'image' || model.model_type === 'multimodal');
      } else if (useCase.toLowerCase().includes('customer support') || useCase.toLowerCase().includes('chat')) {
        filtered = mockModels.filter(model => model.use_cases.toLowerCase().includes('customer support') || model.use_cases.toLowerCase().includes('chat'));
      } else {
        // Show text models by default
        filtered = mockModels.filter(model => model.model_type === 'text' || model.model_type === 'multimodal');
      }
      
      setRecommendations(filtered.slice(0, 3)); // Top 3 recommendations
      setIsAnalyzing(false);
    }, 1500);
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
            Describe the job. Get a practical shortlist with strengths, limits, and clear pricing.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Use Case Input */}
          <Card className="mb-8 border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle>Describe Your Use Case</CardTitle>
              <CardDescription>
                Tell us what you want to build or improve. Be specific about your requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: I want to build a customer support chatbot that can understand images of product issues and provide helpful responses. We get about 1000 conversations per month."
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button 
                onClick={analyzeUseCase}
                disabled={!useCase.trim() || isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center">Recommended AI Models</h3>
              
              {recommendations.map((model, index) => (
                <Card key={model.id} className="overflow-hidden border-border bg-card transition-all hover:border-primary/40 hover:shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1} Recommendation
                          </Badge>
                          <Badge className={pricingColors[model.pricing_type as keyof typeof pricingColors]}>
                            {model.pricing_type}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{model.model_name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span>by {model.provider}</span>
                          <Badge 
                            variant="outline" 
                            className={typeColors[model.model_type as keyof typeof typeColors]}
                          >
                            {model.model_type}
                          </Badge>
                        </CardDescription>
                      </div>
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Pricing */}
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground mr-1" />
                        <span className="text-sm font-medium">Pricing</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{model.pricing_details}</p>
                    </div>

                    {/* Use Cases */}
                    <div>
                      <h4 className="text-sm font-medium mb-1">Best For</h4>
                      <p className="text-sm text-muted-foreground">{model.use_cases}</p>
                    </div>

                    {/* Strengths & Limitations */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <CheckCircle className="w-4 h-4 text-success-foreground mr-1" />
                          <span className="text-sm font-medium text-success-foreground">Strengths</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{model.strengths}</p>
                      </div>
                      
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <AlertCircle className="w-4 h-4 text-destructive-foreground mr-1" />
                          <span className="text-sm font-medium text-destructive-foreground">Limitations</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{model.limitations}</p>
                      </div>
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