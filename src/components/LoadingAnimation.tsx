import { Compass } from "lucide-react";

const LoadingAnimation = () => {
  const loadingMessages = [
    "Discovering hidden gems...",
    "Planning your perfect route...",
    "Finding the best local experiences...",
    "Curating cultural insights...",
    "Mapping your adventure...",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Animated Compass */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-hero flex items-center justify-center shadow-glow animate-pulse-soft">
          <Compass className="w-12 h-12 text-white animate-spin-slow" />
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 rounded-full bg-secondary" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-2 h-2 rounded-full bg-gold" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <h3 className="font-display text-xl font-semibold mb-2">
          Creating Your Itinerary
        </h3>
        <div className="h-6 overflow-hidden">
          <div className="animate-slide-up" style={{ animationDuration: "12s", animationIterationCount: "infinite" }}>
            {loadingMessages.map((message, idx) => (
              <p 
                key={idx}
                className="text-muted-foreground h-6 flex items-center justify-center"
              >
                {message}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1.5 bg-muted rounded-full mt-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-hero rounded-full"
          style={{
            animation: "shimmer 2s ease-in-out infinite",
            backgroundSize: "200% 100%",
            backgroundImage: "linear-gradient(90deg, hsl(30 100% 60%) 0%, hsl(45 100% 55%) 50%, hsl(30 100% 60%) 100%)"
          }}
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;
