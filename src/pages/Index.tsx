import { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ItineraryForm, { FormData } from "@/components/ItineraryForm";
import ItineraryResults from "@/components/ItineraryResults";
import LoadingAnimation from "@/components/LoadingAnimation";
import TranslationTool from "@/components/TranslationTool";
import CulturalGuide from "@/components/CulturalGuide";
import EmergencySOS from "@/components/EmergencySOS";
import AboutModal from "@/components/AboutModal";
import Footer from "@/components/Footer";
import { generateItinerary, GeneratedItinerary } from "@/lib/gemini";
import { toast } from "sonner";

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [itineraryData, setItineraryData] = useState<GeneratedItinerary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const planSectionRef = useRef<HTMLDivElement>(null);
  const translateSectionRef = useRef<HTMLDivElement>(null);
  const guideSectionRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (section === "plan") {
      planSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (section === "translate") {
      translateSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (section === "guide") {
      guideSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartPlanning = () => {
    setActiveSection("plan");
    setShowResults(false);
    setFormData(null);
    setItineraryData(null);
    setError(null);
    setTimeout(() => {
      planSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const cityNames: Record<string, string> = {
    "new-delhi": "New Delhi",
    "mumbai": "Mumbai",
    "bangalore": "Bangalore",
    "jaipur": "Jaipur",
    "goa": "Goa",
    "kerala": "Kerala (Kochi)",
    "agra": "Agra",
    "varanasi": "Varanasi",
    "udaipur": "Udaipur",
    "rishikesh": "Rishikesh",
  };

  const interestLabels: Record<string, string> = {
    "culture": "Culture & Heritage",
    "food": "Food & Cuisine",
    "adventure": "Adventure & Trekking",
    "spirituality": "Spirituality & Yoga",
    "nature": "Nature & Wildlife",
    "shopping": "Shopping & Markets",
    "beaches": "Beaches & Relaxation",
    "photography": "Photography",
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setFormData(data);
    setError(null);
    
    try {
      const cityName = cityNames[data.city] || data.city;
      const interestNames = data.interests.map(i => interestLabels[i] || i);
      
      const itinerary = await generateItinerary(
        data.days,
        cityName,
        interestNames,
        data.budget,
        data.travelStyle
      );
      
      setItineraryData(itinerary);
      setShowResults(true);
      
      // Scroll to results
      setTimeout(() => {
        window.scrollTo({ 
          top: planSectionRef.current?.offsetTop || 0, 
          behavior: "smooth" 
        });
      }, 100);
    } catch (err) {
      console.error("Error generating itinerary:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      if (errorMessage.includes("429")) {
        setError("Too many requests. Please wait a minute and try again.");
      } else if (errorMessage.includes("JSON") || errorMessage.includes("processing")) {
        setError("Error processing response. Please try again.");
      } else {
        setError("Unable to generate itinerary. Please check your connection and try again.");
      }
      
      toast.error(error || "Failed to generate itinerary");
      setShowResults(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModifyPreferences = () => {
    setShowResults(false);
    setFormData(null);
    setItineraryData(null);
    setError(null);
    planSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <main>
        {/* Hero Section */}
        <HeroSection onStartPlanning={handleStartPlanning} />

        {/* Plan Section */}
        <div ref={planSectionRef}>
          {isGenerating ? (
            <section className="py-16 md:py-24 bg-muted/30 pattern-indian">
              <div className="container mx-auto px-4">
                <LoadingAnimation />
              </div>
            </section>
          ) : showResults && formData && itineraryData ? (
            <ItineraryResults 
              formData={formData}
              itineraryData={itineraryData}
              onModify={handleModifyPreferences}
            />
          ) : (
            <ItineraryForm 
              onSubmit={handleFormSubmit}
              isGenerating={isGenerating}
              error={error}
              onRetry={() => formData && handleFormSubmit(formData)}
            />
          )}
        </div>

        {/* Translate Section */}
        <div ref={translateSectionRef}>
          <TranslationTool />
        </div>

        {/* Cultural Guide Section */}
        <div ref={guideSectionRef}>
          <CulturalGuide />
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Emergency SOS Button */}
      <EmergencySOS />

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};

export default Index;
