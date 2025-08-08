import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Star, ChevronRight, Lightbulb, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { useState } from "react";

interface GlossaryTerm {
  id: string;
  term: string;
  simple_explanation: string;
  detailed_explanation?: string;
  benefits?: string;
  drawbacks?: string;
  alternatives?: string;
  category?: string;
  difficulty_level: string;
  is_featured: boolean;
}

// Mock data - will be replaced with Supabase data
const mockTerms: GlossaryTerm[] = [
  {
    id: "1",
    term: "LangGraph",
    simple_explanation: "A tool that helps you build AI chatbots that can think step by step, like a flowchart for AI conversations.",
    detailed_explanation: "LangGraph is a framework for building stateful, multi-actor applications with Language Models. Think of it as creating a map of how your AI should handle different conversation paths.",
    benefits: "Makes complex AI workflows easier to manage, helps build more reliable chatbots, good for customer support automation",
    drawbacks: "Can be complex to set up initially, requires some technical knowledge",
    alternatives: "LangChain, Haystack, custom state management solutions",
    category: "Development Tools",
    difficulty_level: "intermediate",
    is_featured: true
  },
  {
    id: "2",
    term: "PTU (Processing Time Units)",
    simple_explanation: "Think of PTUs like 'AI credits' - they measure how much computer power your AI tasks use up.",
    detailed_explanation: "Processing Time Units are a billing metric used by some AI providers to measure computational resources consumed by AI model operations.",
    benefits: "Predictable billing, helps with cost planning, scales with usage",
    drawbacks: "Can be expensive for heavy usage, hard to estimate exact costs upfront",
    alternatives: "Token-based pricing, flat monthly fees, pay-per-request models",
    category: "Pricing & Billing",
    difficulty_level: "beginner",
    is_featured: false
  },
  {
    id: "3",
    term: "Caching",
    simple_explanation: "Storing frequently used AI responses so you don't have to ask the AI the same question twice - saves time and money.",
    detailed_explanation: "In AI applications, caching involves storing previous AI model outputs to avoid redundant API calls and reduce latency and costs.",
    benefits: "Faster response times, lower costs, better user experience",
    drawbacks: "Stored answers might become outdated, requires storage management",
    alternatives: "Real-time processing, edge computing, content delivery networks",
    category: "Performance",
    difficulty_level: "beginner",
    is_featured: false
  },
  {
    id: "4",
    term: "Vector Database",
    simple_explanation: "A special type of database that helps AI remember and find similar information, like a smart filing system for AI.",
    detailed_explanation: "Vector databases store data as mathematical vectors, enabling AI systems to find semantically similar content quickly.",
    benefits: "Enables semantic search, improves AI accuracy, handles large datasets efficiently",
    drawbacks: "Complex setup, requires vector embeddings, additional infrastructure",
    alternatives: "Traditional databases with search, elastic search, manual similarity matching",
    category: "Data Management",
    difficulty_level: "intermediate",
    is_featured: false
  }
];

const difficultyColors = {
  beginner: "bg-success/20 text-success-foreground",
  intermediate: "bg-primary/20 text-primary-foreground", 
  advanced: "bg-destructive/20 text-destructive-foreground"
};

export const GlossarySection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  
  // Daily rotation logic - changes featured term based on day of year
  const getDailyFeaturedTerm = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const termIndex = dayOfYear % mockTerms.length;
    return mockTerms[termIndex];
  };
  
  const [featuredTerm] = useState(getDailyFeaturedTerm());

  const filteredTerms = mockTerms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.simple_explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="glossary" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">Jargon buster</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn AI terminology explained like you're 5. From basic concepts to advanced topics, 
            all simplified for product managers.
          </p>
        </div>

        {/* Word of the Day */}
        <div className="mb-12">
          <Card className="bg-gradient-primary text-white shadow-glow border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium text-white/90">Word of the Day</span>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  {featuredTerm.difficulty_level}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{featuredTerm.term}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-lg mb-4">{featuredTerm.simple_explanation}</p>
              <Button 
                variant="secondary" 
                onClick={() => setSelectedTerm(featuredTerm)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Learn More
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search AI terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTerms.map((term) => (
            <Card 
              key={term.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-105"
              onClick={() => setSelectedTerm(term)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{term.term}</CardTitle>
                  <Badge className={difficultyColors[term.difficulty_level as keyof typeof difficultyColors]}>
                    {term.difficulty_level}
                  </Badge>
                </div>
                {term.category && (
                  <Badge variant="outline" className="w-fit">{term.category}</Badge>
                )}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm line-clamp-3">
                  {term.simple_explanation}
                </CardDescription>
                <Button variant="ghost" size="sm" className="mt-3 p-0">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Term Detail Modal/Panel */}
        {selectedTerm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto animate-scale-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{selectedTerm.term}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={difficultyColors[selectedTerm.difficulty_level as keyof typeof difficultyColors]}>
                        {selectedTerm.difficulty_level}
                      </Badge>
                      {selectedTerm.category && (
                        <Badge variant="outline">{selectedTerm.category}</Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedTerm(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="w-4 h-4 text-info-foreground mr-2" />
                    <h4 className="font-semibold text-info-foreground">Simple Explanation</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedTerm.simple_explanation}</p>
                </div>

                {selectedTerm.detailed_explanation && (
                  <div>
                    <h4 className="font-semibold mb-2">Detailed Explanation</h4>
                    <p className="text-muted-foreground">{selectedTerm.detailed_explanation}</p>
                  </div>
                )}

                {selectedTerm.benefits && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <ThumbsUp className="w-4 h-4 text-success-foreground mr-2" />
                      <h4 className="font-semibold text-success-foreground">Benefits</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTerm.benefits}</p>
                  </div>
                )}

                {selectedTerm.drawbacks && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <ThumbsDown className="w-4 h-4 text-destructive-foreground mr-2" />
                      <h4 className="font-semibold text-destructive-foreground">Drawbacks</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTerm.drawbacks}</p>
                  </div>
                )}

                {selectedTerm.alternatives && (
                  <div>
                    <div className="flex items-center mb-2">
                      <RefreshCw className="w-4 h-4 text-muted-foreground mr-2" />
                      <h4 className="font-semibold">Alternatives</h4>
                    </div>
                    <p className="text-muted-foreground">{selectedTerm.alternatives}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};