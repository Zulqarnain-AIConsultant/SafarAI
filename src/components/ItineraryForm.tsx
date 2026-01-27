import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Heart, 
  Wallet, 
  Users,
  Landmark,
  UtensilsCrossed,
  Mountain,
  Sparkles as YogaIcon,
  TreePine,
  ShoppingBag,
  Palmtree,
  Camera,
  Check,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ItineraryFormProps {
  onSubmit: (data: FormData) => void;
  isGenerating: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export interface FormData {
  days: number;
  city: string;
  interests: string[];
  budget: string;
  travelStyle: string;
}

const cities = [
  { value: "new-delhi", label: "New Delhi", description: "Capital city, history & culture" },
  { value: "mumbai", label: "Mumbai", description: "Financial hub, Bollywood" },
  { value: "bangalore", label: "Bangalore", description: "Tech city, gardens & cafes" },
  { value: "jaipur", label: "Jaipur", description: "Pink City, palaces & forts" },
  { value: "goa", label: "Goa", description: "Beaches & nightlife" },
  { value: "kerala", label: "Kerala (Kochi)", description: "Backwaters & Ayurveda" },
  { value: "agra", label: "Agra", description: "Taj Mahal & Mughal heritage" },
  { value: "varanasi", label: "Varanasi", description: "Spiritual capital, Ganges" },
  { value: "udaipur", label: "Udaipur", description: "City of Lakes, romance" },
  { value: "rishikesh", label: "Rishikesh", description: "Yoga capital, adventure" },
];

const interests = [
  { value: "culture", label: "Culture & Heritage", icon: Landmark, emoji: "🏛️" },
  { value: "food", label: "Food & Cuisine", icon: UtensilsCrossed, emoji: "🍛" },
  { value: "adventure", label: "Adventure & Trekking", icon: Mountain, emoji: "🏔️" },
  { value: "spirituality", label: "Spirituality & Yoga", icon: YogaIcon, emoji: "🧘" },
  { value: "nature", label: "Nature & Wildlife", icon: TreePine, emoji: "🌴" },
  { value: "shopping", label: "Shopping & Markets", icon: ShoppingBag, emoji: "🛍️" },
  { value: "beaches", label: "Beaches & Relaxation", icon: Palmtree, emoji: "🏖️" },
  { value: "photography", label: "Photography", icon: Camera, emoji: "📸" },
];

const budgetOptions = [
  { value: "budget", label: "Budget", range: "₹1,000-2,000/day", description: "Hostels, street food, local transport" },
  { value: "midrange", label: "Mid-range", range: "₹3,000-6,000/day", description: "3-star hotels, restaurants, mix of transport" },
  { value: "luxury", label: "Luxury", range: "₹8,000+/day", description: "5-star hotels, fine dining, private transfers" },
];

const travelStyles = [
  { value: "solo", label: "Solo Explorer", icon: "🎒" },
  { value: "couple", label: "Couple's Getaway", icon: "💑" },
  { value: "family", label: "Family Trip", icon: "👨‍👩‍👧‍👦" },
  { value: "friends", label: "Friends Adventure", icon: "👯" },
];

const ItineraryForm = ({ onSubmit, isGenerating, error, onRetry }: ItineraryFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    days: 7,
    city: "",
    interests: [],
    budget: "",
    travelStyle: "",
  });

  const totalSteps = 5;

  const canProceed = () => {
    switch (step) {
      case 1: return formData.days > 0;
      case 2: return formData.city !== "";
      case 3: return formData.interests.length > 0;
      case 4: return formData.budget !== "";
      case 5: return formData.travelStyle !== "";
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <section id="plan-section" className="py-16 md:py-24 bg-muted/30 pattern-indian">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Plan Your Perfect Trip
            </h2>
            <p className="text-muted-foreground text-lg">
              Tell us about your dream India adventure
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
              {onRetry && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRetry}
                  className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round((step / totalSteps) * 100)}% complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-hero transition-all duration-500 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-3xl shadow-elevated p-6 md:p-8 border border-border/50">
            {/* Step 1: Duration */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">How many days?</h3>
                    <p className="text-muted-foreground text-sm">Select your trip duration</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="text-center">
                    <span className="font-display text-6xl font-bold text-gradient-saffron">
                      {formData.days}
                    </span>
                    <span className="text-2xl text-muted-foreground ml-2">days</span>
                  </div>

                  <Slider
                    value={[formData.days]}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, days: value[0] }))}
                    min={1}
                    max={30}
                    step={1}
                    className="py-4"
                  />

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 day</span>
                    <span>30 days</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Starting City */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">Starting city</h3>
                    <p className="text-muted-foreground text-sm">Where will your journey begin?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cities.map((city) => (
                    <button
                      key={city.value}
                      onClick={() => setFormData(prev => ({ ...prev, city: city.value }))}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left transition-all duration-200",
                        formData.city === city.value
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{city.label}</p>
                          <p className="text-sm text-muted-foreground">{city.description}</p>
                        </div>
                        {formData.city === city.value && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">Your interests</h3>
                    <p className="text-muted-foreground text-sm">Select all that excite you</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest.value}
                      onClick={() => toggleInterest(interest.value)}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left transition-all duration-200 group",
                        formData.interests.includes(interest.value)
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{interest.emoji}</span>
                        <span className="font-medium">{interest.label}</span>
                        {formData.interests.includes(interest.value) && (
                          <Check className="w-5 h-5 text-primary ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  {formData.interests.length} interest{formData.interests.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {/* Step 4: Budget */}
            {step === 4 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">Budget level</h3>
                    <p className="text-muted-foreground text-sm">What's your comfort zone?</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {budgetOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, budget: option.value }))}
                      className={cn(
                        "w-full p-5 rounded-2xl border-2 text-left transition-all duration-200",
                        formData.budget === option.value
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-lg">{option.label}</span>
                        <span className="text-primary font-medium">{option.range}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Travel Style */}
            {step === 5 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">Travel style</h3>
                    <p className="text-muted-foreground text-sm">Who's joining the adventure?</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {travelStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setFormData(prev => ({ ...prev, travelStyle: style.value }))}
                      className={cn(
                        "p-6 rounded-2xl border-2 text-center transition-all duration-200",
                        formData.travelStyle === style.value
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <span className="text-4xl mb-2 block">{style.icon}</span>
                      <span className="font-medium">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed() || isGenerating}
                className={cn(
                  "gap-2 px-6",
                  step === totalSteps && "bg-gradient-hero hover:opacity-90"
                )}
              >
                {step === totalSteps ? (
                  isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate My Itinerary"
                  )
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryForm;
