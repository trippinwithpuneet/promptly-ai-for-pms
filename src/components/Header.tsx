import { Button } from "@/components/ui/button";
import { Brain, BookOpen, Zap, MessageCircle } from "lucide-react";

export const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Promptly
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('news')}
            className="text-sm font-medium hover:text-primary"
          >
            <Zap className="w-4 h-4 mr-2" />
            Daily nuggets
          </Button>
          <Button 
            variant="ghost"
            onClick={() => scrollToSection('glossary')}
            className="text-sm font-medium hover:text-primary"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Jargon buster
          </Button>
          <Button 
            variant="ghost"
            onClick={() => scrollToSection('models')}
            className="text-sm font-medium hover:text-primary"
          >
            <Brain className="w-4 h-4 mr-2" />
            Model finder
          </Button>
          <Button 
            variant="ghost"
            onClick={() => scrollToSection('feedback')}
            className="text-sm font-medium hover:text-primary"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Feedback
          </Button>
        </nav>
      </div>
    </header>
  );
};