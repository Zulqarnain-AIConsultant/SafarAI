import { 
  Sun, 
  Sunset, 
  Moon, 
  MapPin, 
  IndianRupee,
  Shield,
  Heart,
  UtensilsCrossed,
  Download,
  Mail,
  Share2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FormData } from "./ItineraryForm";
import { GeneratedItinerary, ItineraryActivity } from "@/lib/gemini";

interface ItineraryResultsProps {
  formData: FormData;
  itineraryData: GeneratedItinerary;
  onModify: () => void;
}

const cityNames: Record<string, string> = {
  "new-delhi": "New Delhi",
  "mumbai": "Mumbai",
  "bangalore": "Bangalore",
  "jaipur": "Jaipur",
  "goa": "Goa",
  "kerala": "Kerala",
  "agra": "Agra",
  "varanasi": "Varanasi",
  "udaipur": "Udaipur",
  "rishikesh": "Rishikesh",
};

const getTimeIcon = (time: string) => {
  const lowerTime = time.toLowerCase();
  if (lowerTime.includes("morning")) {
    return <Sun className="w-4 h-4 text-gold" />;
  } else if (lowerTime.includes("afternoon")) {
    return <Sunset className="w-4 h-4 text-primary" />;
  } else {
    return <Moon className="w-4 h-4 text-navy" />;
  }
};

const ItineraryResults = ({ formData, itineraryData, onModify }: ItineraryResultsProps) => {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  const toggleDay = (day: number) => {
    setExpandedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-4">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{cityNames[formData.city]}</span>
              <span className="text-muted-foreground">•</span>
              <span>{formData.days} Days</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Your Personalized Itinerary
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Crafted based on your interests with a {formData.budget} budget for your {formData.travelStyle} adventure.
            </p>
            
            {/* Total Estimated Cost */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <IndianRupee className="w-4 h-4" />
              <span className="font-medium">Estimated Total: {itineraryData.totalEstimatedCost}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              Email Itinerary
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" onClick={onModify} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Modify Preferences
            </Button>
          </div>

          {/* General Tips */}
          {itineraryData.generalTips && itineraryData.generalTips.length > 0 && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">General Tips for Your Trip</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {itineraryData.generalTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Itinerary Days */}
          <div className="space-y-4">
            {itineraryData.days.map((day) => (
              <div 
                key={day.day}
                className={cn(
                  "bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300",
                  expandedDays.includes(day.day) ? "shadow-elevated" : "shadow-card"
                )}
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                      <span className="font-display font-bold text-primary-foreground">
                        {day.day}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-display font-semibold text-lg">{day.date}</h3>
                      <p className="text-muted-foreground text-sm">
                        {day.activities.length} activities planned
                      </p>
                    </div>
                  </div>
                  {expandedDays.includes(day.day) ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Day Content */}
                {expandedDays.includes(day.day) && (
                  <div className="px-4 md:px-6 pb-6 animate-fade-in">
                    {/* Activities */}
                    <div className="space-y-4">
                      {day.activities.map((activity: ItineraryActivity, idx: number) => (
                        <div 
                          key={idx}
                          className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-1 min-w-[80px]">
                              {getTimeIcon(activity.time)}
                              <span className="text-xs text-muted-foreground text-center">
                                {activity.time.split("(")[0].trim()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{activity.activity}</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                {activity.description}
                              </p>
                              
                              {/* Cost */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                                  <IndianRupee className="w-3 h-3" />
                                  {activity.cost}
                                </span>
                              </div>

                              {/* Tips Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                {/* Safety Tip */}
                                <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-3 h-3 text-destructive" />
                                    <span className="font-medium text-xs">Safety Tip</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{activity.safetyTip}</p>
                                </div>

                                {/* Cultural Note */}
                                <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Heart className="w-3 h-3 text-secondary" />
                                    <span className="font-medium text-xs">Cultural Note</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{activity.culturalNote}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryResults;
