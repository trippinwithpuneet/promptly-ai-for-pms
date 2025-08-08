import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

    // Simulate API call - in real app, this would save to Supabase
    setTimeout(() => {
      toast({
        title: "Thank you for your feedback! 🎉",
        description: "Your feedback helps us improve NeuralFlow.",
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
    }, 1000);
  };

  const handleRating = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  return (
    <section id="feedback" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">Your Feedback Matters</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Help us improve NeuralFlow. Share your thoughts, suggestions, 
            or report any issues you've encountered.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
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
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        className={`p-1 rounded transition-colors ${
                          star <= formData.rating
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : 'text-muted-foreground hover:text-yellow-300'
                        }`}
                      >
                        <Star 
                          className="w-6 h-6" 
                          fill={star <= formData.rating ? 'currentColor' : 'none'}
                        />
                      </button>
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
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
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