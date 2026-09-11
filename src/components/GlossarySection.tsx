import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Star, ChevronRight, Lightbulb, ThumbsUp, ThumbsDown, RefreshCw, GraduationCap, ArrowUpRight } from "lucide-react";
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
  },
  {
    id: "5",
    term: "RAG (Retrieval-Augmented Generation)",
    simple_explanation: "Letting AI look up trusted information before it answers, like giving it an open-book test.",
    detailed_explanation: "RAG connects an AI model to a searchable knowledge source so it can retrieve relevant facts before generating a response.",
    benefits: "More accurate answers, easier knowledge updates, better use of company information",
    drawbacks: "Quality depends on the source material and search setup",
    alternatives: "Fine-tuning, long-context prompts, manual knowledge bases",
    category: "AI Architecture",
    difficulty_level: "intermediate",
    is_featured: false
  },
  {
    id: "6",
    term: "Hallucination",
    simple_explanation: "When an AI confidently makes up an answer that sounds believable but is not true.",
    detailed_explanation: "A hallucination is generated information that is unsupported by the model's inputs or reliable evidence.",
    benefits: "None directly, but tracking it helps teams measure answer reliability",
    drawbacks: "Can mislead users and reduce trust",
    alternatives: "RAG, citations, human review, constrained responses",
    category: "AI Quality",
    difficulty_level: "beginner",
    is_featured: false
  },
  {
    id: "7",
    term: "Tokens",
    simple_explanation: "The small pieces of text an AI reads and writes—roughly parts of words rather than whole sentences.",
    detailed_explanation: "Models break text into tokens for processing, and providers commonly use token counts for limits and pricing.",
    benefits: "Makes model usage measurable and supports flexible text processing",
    drawbacks: "Token counts are not intuitive and vary by language and model",
    alternatives: "Character limits, word limits, request-based pricing",
    category: "AI Basics",
    difficulty_level: "beginner",
    is_featured: false
  },
  {
    id: "8",
    term: "Fine-tuning",
    simple_explanation: "Giving an existing AI extra training so it becomes better at one specific kind of job.",
    detailed_explanation: "Fine-tuning updates a pre-trained model using curated examples to improve its behavior for a narrower task or style.",
    benefits: "More consistent outputs, specialized behavior, shorter prompts",
    drawbacks: "Needs good training data, costs more, and requires ongoing evaluation",
    alternatives: "Prompt engineering, RAG, few-shot examples",
    category: "Model Customization",
    difficulty_level: "intermediate",
    is_featured: false
  },
  {
    id: "9",
    term: "Embeddings",
    simple_explanation: "A way to turn meaning into numbers so AI can spot which pieces of information are similar.",
    detailed_explanation: "Embeddings represent content as numeric vectors, allowing systems to compare meaning and retrieve related items.",
    benefits: "Powers semantic search, recommendations, clustering, and RAG",
    drawbacks: "Requires storage and does not explain why items are considered similar",
    alternatives: "Keyword search, rules-based matching, metadata filters",
    category: "Data Management",
    difficulty_level: "intermediate",
    is_featured: false
  },
  {
    id: "10",
    term: "Context Window",
    simple_explanation: "The amount of information an AI can keep in mind during one conversation.",
    detailed_explanation: "A context window is the maximum number of tokens a model can process together in a single request.",
    benefits: "Larger windows can handle longer documents and conversations",
    drawbacks: "More context can increase cost and still does not guarantee better attention",
    alternatives: "Summarization, RAG, conversation memory",
    category: "AI Basics",
    difficulty_level: "beginner",
    is_featured: false
  },
  {
    id: "11",
    term: "AI Agent",
    simple_explanation: "An AI that can choose steps and use tools to complete a goal instead of only answering once.",
    detailed_explanation: "AI agents combine a model with instructions, memory, and tools to plan and carry out multi-step tasks.",
    benefits: "Automates workflows and handles tasks that need several decisions",
    drawbacks: "Harder to predict, test, and control than a simple chatbot",
    alternatives: "Fixed workflows, rule engines, standard chatbots",
    category: "AI Architecture",
    difficulty_level: "intermediate",
    is_featured: false
  },
  {
    id: "12",
    term: "Guardrails",
    simple_explanation: "Rules and checks that keep an AI from giving unsafe, irrelevant, or unwanted answers.",
    detailed_explanation: "Guardrails validate model inputs and outputs against safety, policy, quality, and business requirements.",
    benefits: "Improves safety, consistency, and compliance",
    drawbacks: "Can block useful answers and needs continuous tuning",
    alternatives: "Human moderation, strict prompts, limited model access",
    category: "AI Safety",
    difficulty_level: "beginner",
    is_featured: false
  }
];

const difficultyColors = {
  beginner: "bg-success/20 text-success-foreground",
  intermediate: "border border-primary/60 bg-primary text-primary-foreground",
  advanced: "bg-destructive/20 text-destructive-foreground"
};

export const GlossarySection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const getTermsForVisit = () => {
    const storageKey = "promptly-last-glossary-terms";

    try {
      const previousIds = new Set(JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as string[]);
      const shuffled = [...mockTerms].sort(() => Math.random() - 0.5);
      const changedTerms = shuffled.filter((term) => !previousIds.has(term.id));
      const nextTerms = [...changedTerms, ...shuffled.filter((term) => previousIds.has(term.id))].slice(0, 4);
      window.localStorage.setItem(storageKey, JSON.stringify(nextTerms.map((term) => term.id)));
      return nextTerms;
    } catch {
      return [...mockTerms].sort(() => Math.random() - 0.5).slice(0, 4);
    }
  };

  const [termsForVisit] = useState(getTermsForVisit);
  
  const getFeaturedTermForVisit = () => {
    const storageKey = "promptly-last-featured-term";

    try {
      const lastFeaturedId = window.localStorage.getItem(storageKey);
      const availableTerms = mockTerms.length > 1
        ? mockTerms.filter((term) => term.id !== lastFeaturedId)
        : mockTerms;
      const nextTerm = availableTerms[Math.floor(Math.random() * availableTerms.length)] ?? mockTerms[0];

      if (nextTerm) window.localStorage.setItem(storageKey, nextTerm.id);
      return nextTerm;
    } catch {
      return mockTerms[Math.floor(Math.random() * mockTerms.length)] ?? mockTerms[0];
    }
  };
  
  const [featuredTerm] = useState(getFeaturedTermForVisit);

  const termsToSearch = searchTerm.trim() ? mockTerms : termsForVisit;
  const filteredTerms = termsToSearch.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.simple_explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="glossary" className="border-b border-border/70 bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-primary">
            <BookOpen className="h-4 w-4" />
            Section 01 / Learn the language
          </div>
          <h2 className="text-4xl uppercase md:text-6xl">Jargon buster</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            AI terminology without the technical fog — explained simply, with practical trade-offs.
          </p>
        </div>

        {/* Word of the Day */}
        <div className="mb-12">
          <Card className="border-primary/40 bg-primary text-primary-foreground shadow-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase">Featured this visit</span>
                </div>
                <Badge className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground">
                  {featuredTerm.difficulty_level}
                </Badge>
              </div>
              <CardTitle className="text-3xl uppercase">{featuredTerm.term}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-5 max-w-3xl text-lg">{featuredTerm.simple_explanation}</p>
              <Button 
                variant="secondary" 
                onClick={() => setSelectedTerm(featuredTerm)}
                className="border border-primary-foreground/30 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Learn More
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
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
              className="cursor-pointer border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 h-auto p-0 text-foreground hover:bg-transparent hover:text-primary"
                >
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div id="course" className="relative mt-14 scroll-mt-24 overflow-hidden border-y border-primary bg-primary px-6 py-10 text-primary-foreground shadow-glow md:px-10 md:py-14">
          <GraduationCap className="pointer-events-none absolute -right-5 -top-8 h-44 w-44 opacity-10 md:right-8 md:h-56 md:w-56" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 border border-primary-foreground/30 px-3 py-1 text-sm font-semibold uppercase">
                <GraduationCap className="h-4 w-4" />
                Section 02 / Free course for product managers
              </div>
              <h3 className="max-w-2xl text-4xl uppercase leading-tight md:text-6xl">Build your AI foundation</h3>
              <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
                Take AI 101 for PMs — a practical, jargon-free course made to help you make sharper AI product decisions.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="min-h-12 shrink-0 border border-primary-foreground/20 px-6 font-semibold">
              <a
                href="https://trippinwithpuneet.github.io/AI-101-for-PMs/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start AI 101 free
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Term Detail Modal/Panel */}
        {selectedTerm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm">
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
                    aria-label="Close term details"
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