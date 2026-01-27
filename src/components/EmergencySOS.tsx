import { useState } from "react";
import { 
  Shield, 
  Phone, 
  MapPin, 
  Languages, 
  X,
  Ambulance,
  Building2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EmergencySOS = () => {
  const [isOpen, setIsOpen] = useState(false);

  const emergencyContacts = [
    { icon: Phone, label: "Police", number: "100", color: "bg-destructive" },
    { icon: Ambulance, label: "Ambulance", number: "102", color: "bg-secondary" },
    { icon: AlertTriangle, label: "Fire", number: "101", color: "bg-primary" },
    { icon: Building2, label: "Tourist Helpline", number: "1363", color: "bg-navy" },
  ];

  const quickPhrases = [
    { hindi: "मुझे मदद चाहिए", english: "I need help", transliteration: "Mujhe madad chahiye" },
    { hindi: "मैं खो गया हूँ", english: "I am lost", transliteration: "Main kho gaya hoon" },
    { hindi: "कृपया अस्पताल बुलाएं", english: "Please call hospital", transliteration: "Kripya aspataal bulaayein" },
  ];

  return (
    <>
      {/* SOS Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center",
          "bg-destructive text-destructive-foreground shadow-elevated",
          "hover:scale-110 active:scale-95 transition-all duration-200",
          "animate-pulse-soft"
        )}
        aria-label="Emergency SOS"
      >
        <Shield className="w-6 h-6" />
      </button>

      {/* SOS Panel */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-all duration-300",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-elevated p-6",
            "transition-transform duration-300 ease-out max-h-[80vh] overflow-y-auto",
            isOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          {/* Handle */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-muted" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Emergency Assistance</h3>
                <p className="text-sm text-muted-foreground">Quick access to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Emergency Numbers */}
          <div className="mb-6">
            <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">
              Emergency Numbers
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {emergencyContacts.map((contact) => (
                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", contact.color)}>
                    <contact.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {contact.label}
                    </p>
                    <p className="text-xl font-bold text-primary">{contact.number}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Phrases */}
          <div className="mb-6">
            <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Quick Phrases (Hindi)
            </h4>
            <div className="space-y-2">
              {quickPhrases.map((phrase, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <p className="font-semibold text-lg">{phrase.hindi}</p>
                  <p className="text-sm text-primary">{phrase.transliteration}</p>
                  <p className="text-sm text-muted-foreground">{phrase.english}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Share Location */}
          <Button 
            className="w-full gap-2 py-6 text-lg rounded-2xl bg-gradient-hero hover:opacity-90"
          >
            <MapPin className="w-5 h-5" />
            Share My Location
          </Button>

          {/* Embassy Info */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            For embassy contacts, visit your country's official website
          </p>
        </div>
      </div>
    </>
  );
};

export default EmergencySOS;
