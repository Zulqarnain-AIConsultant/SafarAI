import { 
  X, 
  Globe, 
  Languages, 
  Plane, 
  Star,
  Sparkles,
  MapPin,
  Users,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  const stats = [
    { icon: Globe, value: "50+", label: "Indian Destinations", color: "text-primary" },
    { icon: Languages, value: "10+", label: "Languages Supported", color: "text-secondary" },
    { icon: Plane, value: "10,000+", label: "Travelers Helped", color: "text-navy" },
    { icon: Star, value: "4.9/5", label: "User Rating", color: "text-gold" },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Smart Itinerary Planning",
      description: "AI-powered trip planning that considers your interests, budget, and travel style to create the perfect journey."
    },
    {
      icon: Languages,
      title: "Real-time Translation",
      description: "Break language barriers with instant translation between English and 10+ Indian languages."
    },
    {
      icon: Shield,
      title: "Cultural Intelligence",
      description: "Navigate cultural nuances with confidence using our comprehensive guide to Indian customs and etiquette."
    },
  ];

  return (
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
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full">
        <div
          className={cn(
            "bg-card rounded-3xl shadow-elevated max-h-full overflow-y-auto",
            "transition-all duration-300 ease-out",
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          {/* Header */}
          <div className="relative p-6 md:p-8 bg-gradient-hero rounded-t-3xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                About SafarAI
              </h2>
              <p className="text-white/90 max-w-md mx-auto">
                Your intelligent companion for exploring the incredible diversity of India
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Mission */}
            <div className="mb-8">
              <h3 className="font-display font-semibold text-lg mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                SafarAI was created to make India accessible and enjoyable for every 
                international traveler. We combine cutting-edge AI technology with deep 
                cultural understanding to help you navigate, communicate, and experience 
                India like never before. Whether you're seeking spiritual enlightenment in 
                Varanasi, culinary adventures in Delhi, or beach relaxation in Goa, we're 
                here to guide your journey.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="text-center p-4 rounded-2xl bg-muted/50"
                >
                  <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
                  <p className="font-display font-bold text-2xl">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-lg">Key Features</h3>
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">Built with ❤️ for travelers exploring India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
