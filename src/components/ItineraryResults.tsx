import { 
  Sun, 
  Sunset, 
  Moon, 
  MapPin, 
  Clock, 
  IndianRupee,
  DollarSign,
  Shield,
  Heart,
  UtensilsCrossed,
  Download,
  Mail,
  Share2,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FormData } from "./ItineraryForm";

interface ItineraryResultsProps {
  formData: FormData;
  onModify: () => void;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  duration: string;
  costINR: number;
  costUSD: number;
  icon: "morning" | "afternoon" | "evening";
}

interface DayPlan {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
  safetyTip: string;
  cultureTip: string;
  restaurant: {
    name: string;
    cuisine: string;
    priceRange: string;
  };
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

// Demo itinerary data
const generateDemoItinerary = (formData: FormData): DayPlan[] => {
  const cityItineraries: Record<string, DayPlan[]> = {
    "new-delhi": [
      {
        day: 1,
        date: "Day 1",
        theme: "Historic Delhi",
        activities: [
          { time: "9:00 AM", title: "Red Fort", description: "Explore the magnificent Mughal-era fortress, a UNESCO World Heritage Site", duration: "2.5 hours", costINR: 500, costUSD: 6, icon: "morning" },
          { time: "12:00 PM", title: "Chandni Chowk", description: "Walk through India's oldest and busiest market, sample street food", duration: "2 hours", costINR: 300, costUSD: 4, icon: "afternoon" },
          { time: "4:00 PM", title: "Jama Masjid", description: "Visit one of India's largest mosques with stunning architecture", duration: "1.5 hours", costINR: 300, costUSD: 4, icon: "afternoon" },
          { time: "7:00 PM", title: "Dinner at Karim's", description: "Legendary Mughlai restaurant since 1913", duration: "1.5 hours", costINR: 800, costUSD: 10, icon: "evening" },
        ],
        safetyTip: "Keep valuables secure in Chandni Chowk's crowded lanes. Use cycle rickshaws to navigate narrow streets.",
        cultureTip: "Remove shoes before entering Jama Masjid. Women should carry a scarf to cover their heads.",
        restaurant: { name: "Karim's", cuisine: "Mughlai", priceRange: "₹400-800 per person" }
      },
      {
        day: 2,
        date: "Day 2",
        theme: "Modern Delhi & Monuments",
        activities: [
          { time: "8:00 AM", title: "India Gate", description: "Start your day at Delhi's iconic war memorial", duration: "1 hour", costINR: 0, costUSD: 0, icon: "morning" },
          { time: "10:00 AM", title: "Humayun's Tomb", description: "Marvel at the precursor to the Taj Mahal", duration: "2 hours", costINR: 600, costUSD: 7, icon: "morning" },
          { time: "2:00 PM", title: "Lodhi Gardens", description: "Peaceful stroll among 15th-century tombs", duration: "1.5 hours", costINR: 0, costUSD: 0, icon: "afternoon" },
          { time: "5:00 PM", title: "Hauz Khas Village", description: "Trendy cafes, boutiques, and ancient ruins", duration: "3 hours", costINR: 500, costUSD: 6, icon: "evening" },
        ],
        safetyTip: "Stay hydrated and carry sunscreen. Book a reliable taxi or use metro for safe transport.",
        cultureTip: "Tip 10-15% at restaurants. Bargaining is acceptable at markets but not in fixed-price stores.",
        restaurant: { name: "Social", cuisine: "Multi-cuisine", priceRange: "₹500-1000 per person" }
      },
    ],
    "jaipur": [
      {
        day: 1,
        date: "Day 1",
        theme: "Royal Jaipur",
        activities: [
          { time: "8:00 AM", title: "Amber Fort", description: "Majestic hilltop fortress with stunning views and intricate mirror work", duration: "3 hours", costINR: 500, costUSD: 6, icon: "morning" },
          { time: "12:00 PM", title: "Jal Mahal", description: "Photo stop at the beautiful Water Palace in Man Sagar Lake", duration: "30 mins", costINR: 0, costUSD: 0, icon: "afternoon" },
          { time: "2:00 PM", title: "City Palace", description: "Explore royal residence with museums and courtyards", duration: "2.5 hours", costINR: 700, costUSD: 8, icon: "afternoon" },
          { time: "6:00 PM", title: "Hawa Mahal at Sunset", description: "Watch the Palace of Winds glow in golden light", duration: "1 hour", costINR: 200, costUSD: 2, icon: "evening" },
        ],
        safetyTip: "Hire guides from official counters only. Beware of gem scams - don't buy precious stones from strangers.",
        cultureTip: "Dress modestly when visiting palaces. Photography may be restricted in some areas.",
        restaurant: { name: "1135 AD", cuisine: "Royal Rajasthani", priceRange: "₹1500-2500 per person" }
      },
    ],
  };

  const defaultItinerary: DayPlan[] = [
    {
      day: 1,
      date: "Day 1",
      theme: "Arrival & Orientation",
      activities: [
        { time: "10:00 AM", title: "Hotel Check-in & Rest", description: "Settle into your accommodation and freshen up", duration: "2 hours", costINR: 0, costUSD: 0, icon: "morning" },
        { time: "1:00 PM", title: "Local Lunch", description: "Experience authentic local cuisine at a nearby restaurant", duration: "1.5 hours", costINR: 500, costUSD: 6, icon: "afternoon" },
        { time: "4:00 PM", title: "Neighborhood Walk", description: "Explore the local area, get familiar with surroundings", duration: "2 hours", costINR: 0, costUSD: 0, icon: "afternoon" },
        { time: "7:00 PM", title: "Welcome Dinner", description: "Traditional dinner to start your Indian culinary journey", duration: "2 hours", costINR: 800, costUSD: 10, icon: "evening" },
      ],
      safetyTip: "Save emergency contacts in your phone. Download offline maps of the area.",
      cultureTip: "Indians eat with their right hand traditionally. It's polite to finish everything on your plate.",
      restaurant: { name: "Local Specialty Restaurant", cuisine: "Regional", priceRange: "₹300-600 per person" }
    },
  ];

  const cityData = cityItineraries[formData.city] || defaultItinerary;
  const result: DayPlan[] = [];

  for (let i = 0; i < formData.days; i++) {
    const basePlan = cityData[i % cityData.length];
    result.push({
      ...basePlan,
      day: i + 1,
      date: `Day ${i + 1}`,
    });
  }

  return result;
};

const ItineraryResults = ({ formData, onModify }: ItineraryResultsProps) => {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const itinerary = generateDemoItinerary(formData);

  const toggleDay = (day: number) => {
    setExpandedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const getTimeIcon = (icon: Activity["icon"]) => {
    switch (icon) {
      case "morning": return <Sun className="w-4 h-4 text-gold" />;
      case "afternoon": return <Sunset className="w-4 h-4 text-primary" />;
      case "evening": return <Moon className="w-4 h-4 text-navy" />;
    }
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
              Crafted based on your interests in {formData.interests.join(", ")} 
              with a {formData.budget} budget for your {formData.travelStyle} adventure.
            </p>
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

          {/* Itinerary Days */}
          <div className="space-y-4">
            {itinerary.map((day) => (
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
                      <p className="text-muted-foreground">{day.theme}</p>
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
                    <div className="space-y-4 mb-6">
                      {day.activities.map((activity, idx) => (
                        <div 
                          key={idx}
                          className="flex gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex flex-col items-center gap-1">
                            {getTimeIcon(activity.icon)}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {activity.time}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {activity.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {activity.duration}
                              </span>
                              <span className="flex items-center gap-1 text-secondary">
                                <IndianRupee className="w-3 h-3" />
                                {activity.costINR.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <DollarSign className="w-3 h-3" />
                                {activity.costUSD}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tips Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Safety Tip */}
                      <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-destructive" />
                          <span className="font-semibold text-sm">Safety Tip</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{day.safetyTip}</p>
                      </div>

                      {/* Culture Tip */}
                      <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-secondary" />
                          <span className="font-semibold text-sm">Cultural Note</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{day.cultureTip}</p>
                      </div>

                      {/* Restaurant */}
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <UtensilsCrossed className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-sm">Recommended</span>
                        </div>
                        <p className="text-xs font-medium">{day.restaurant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {day.restaurant.cuisine} • {day.restaurant.priceRange}
                        </p>
                      </div>
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
