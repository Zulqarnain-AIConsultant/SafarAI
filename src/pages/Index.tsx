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

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

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
    setTimeout(() => {
      planSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setFormData(data);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    setShowResults(true);
    
    // Scroll to results
    setTimeout(() => {
      window.scrollTo({ 
        top: planSectionRef.current?.offsetTop || 0, 
        behavior: "smooth" 
      });
    }, 100);
  };

  const handleModifyPreferences = () => {
    setShowResults(false);
    setFormData(null);
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
          ) : showResults && formData ? (
            <ItineraryResults 
              formData={formData}
              onModify={handleModifyPreferences}
            />
          ) : (
            <ItineraryForm 
              onSubmit={handleFormSubmit}
              isGenerating={isGenerating}
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
