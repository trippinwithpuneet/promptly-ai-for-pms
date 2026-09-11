import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FeedbackSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    section: "",
    rating: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("feedback").insert({
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      feedback: formData.feedback.trim(),
      section: formData.section || null,
      rating: formData.rating || null,
    });

    if (error) {
      console.error("Feedback submission failed:", error.message);
      toast({
        title: "Feedback wasn't submitted",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

      toast({
        title: "Thank you for your feedback! 🎉",
        description: "Your feedback helps us improve Promptly.",
        duration: 5000,
      });
      
      setFormData({
        name: "",
        email: "",
        feedback: "",
        section: "",
        rating: 0
      });
      setIsSubmitting(false);
  };

  const handleRating = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  return (
    <section id="feedback" className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-primary">
            <MessageCircle className="h-4 w-4" />
            Help shape Promptly
          </div>
          <h2 className="text-4xl uppercase md:text-6xl">Your feedback matters</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Share what was useful, what was unclear, or what you want Promptly to cover next.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle>Share Your Feedback</CardTitle>
              <CardDescription>
                Your input helps us create better content and features for product managers like you.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Overall Rating</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Rate ${star} out of 5`}
                        onClick={() => handleRating(star)}
                        className={`h-9 w-9 transition-colors ${
                          star <= formData.rating
                              ? 'text-primary hover:text-primary/80'
                              : 'text-muted-foreground hover:text-primary/70'
                        }`}
                      >
                        <Star 
                          className="w-6 h-6" 
                          fill={star <= formData.rating ? 'currentColor' : 'none'}
                        />
                      </Button>
                    ))}
                    {formData.rating > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {formData.rating} / 5
                      </span>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@company.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll only use this to follow up if needed.
                  </p>
                </div>

                {/* Section */}
                <div className="space-y-2">
                  <Label htmlFor="section">Which section is this about? (optional)</Label>
                  <select
                    id="section"
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a section</option>
                    <option value="daily-news">Daily AI News</option>
                    <option value="glossary">AI Glossary</option>
                    <option value="model-finder">AI Model Finder</option>
                    <option value="general">General Website</option>
                  </select>
                </div>

                {/* Feedback */}
                <div className="space-y-2">
                  <Label htmlFor="feedback">Your Feedback *</Label>
                  <Textarea
                    id="feedback"
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    placeholder="Share your thoughts, suggestions, or report issues..."
                    rows={5}
                    required
                    className="resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting || !formData.name.trim() || !formData.feedback.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Your feedback is stored securely and helps us improve the platform. 
              We analyze feedback patterns to identify common themes and prioritize improvements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};