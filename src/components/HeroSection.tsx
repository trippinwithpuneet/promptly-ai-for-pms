import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const HeroSection = () => {
  const scrollToContent = () => {
    const element = document.getElementById('news');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-ai-purple/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-ai-cyan/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-6 animate-fade-in">
          Promptly
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          AI Intelligence for Product Leaders
        </p>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Stay updated with AI trends, learn technical terms simplified, 
          and discover the best AI models for your use cases - all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            size="lg" 
            onClick={scrollToContent}
            className="bg-white text-primary hover:bg-white/90 shadow-lg px-8 py-3 text-lg font-semibold"
          >
            Explore Knowledge Hub
          </Button>
          <p className="text-white/70 text-sm">
            Built for PMs at fast-growing startups
          </p>
        </div>
        
        <div className="mt-16 animate-bounce">
          <ChevronDown 
            className="w-8 h-8 text-white/60 mx-auto cursor-pointer hover:text-white/80 transition-colors" 
            onClick={scrollToContent}
          />
        </div>
      </div>
    </section>
  );
};