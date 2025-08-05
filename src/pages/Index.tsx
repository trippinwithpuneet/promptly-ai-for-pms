import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DailyNewsSection } from "@/components/DailyNewsSection";
import { GlossarySection } from "@/components/GlossarySection";
import { ModelRecommenderSection } from "@/components/ModelRecommenderSection";
import { FeedbackSection } from "@/components/FeedbackSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <DailyNewsSection />
      <GlossarySection />
      <ModelRecommenderSection />
      <FeedbackSection />
    </div>
  );
};

export default Index;
