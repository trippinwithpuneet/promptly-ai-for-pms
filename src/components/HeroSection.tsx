import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export const HeroSection = () => {
  const scrollToContent = () => {
    const element = document.getElementById('news');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex min-h-[58vh] items-center overflow-hidden border-b border-border/70 bg-gradient-hero">
      <div className="absolute inset-y-0 left-[9%] w-px bg-primary/30" />
      <div className="container relative z-10 mx-auto py-20 md:py-24">
        <div className="mb-10 md:hidden"><BrandMark /></div>
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase text-primary">
          <Sparkles className="h-4 w-4" />
          AI, decoded for product people
        </div>
        <h1 className="max-w-5xl text-5xl uppercase leading-[0.95] text-foreground md:text-7xl lg:text-8xl">
          Less jargon.<br /><span className="text-primary">More signal.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Daily AI news, plain-English concepts, and practical model choices for product managers.
        </p>
        <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button 
            size="lg" 
            onClick={scrollToContent}
            className="h-12 px-6 text-base font-semibold shadow-glow"
          >
            Read today's nuggets
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Curated for fast-moving product teams
          </p>
        </div>
      </div>
    </section>
  );
};