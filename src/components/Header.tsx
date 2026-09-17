import { Button } from "@/components/ui/button";
import { BookOpen, Zap, ScanSearch, GraduationCap, Moon, Sun } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
        
        <div className="flex items-center gap-2">
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
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
            onClick={() => scrollToSection('course')}
            className="text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            AI 101 course
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
            onClick={() => scrollToSection('news')}
            className="text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <Zap className="w-4 h-4 mr-2" />
            Daily nuggets
          </Button>
        </nav>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                aria-label={resolvedTheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
                disabled={!mounted}
              >
                {mounted && resolvedTheme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {resolvedTheme === "light" ? "Use dark mode" : "Use light mode"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};