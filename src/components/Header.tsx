import { Button } from "@/components/ui/button";
import { BookOpen, Zap, MessageCircle, ScanSearch } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="container flex h-20 items-center justify-between">
        <BrandMark compact />
        
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('news')}
            className="text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <Zap className="w-4 h-4 mr-2" />
            Daily nuggets
          </Button>
          <Button 
            variant="ghost"
            onClick={() => scrollToSection('glossary')}
            className="text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Jargon buster
          </Button>
          <Button 
            variant="ghost"
            onClick={() => scrollToSection('models')}
            className="text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <ScanSearch className="w-4 h-4 mr-2" />
            Model finder
          </Button>
          <Button 
            variant="ghost"
            onClick={() => scrollToSection('feedback')}
            className="text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Feedback
          </Button>
        </nav>
      </div>
    </header>
  );
};