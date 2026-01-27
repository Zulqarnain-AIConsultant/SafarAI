import { 
  Compass, 
  MapPin, 
  Languages, 
  BookOpen,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Heart
} from "lucide-react";

interface FooterProps {
  onNavigate: (section: string) => void;
}

const Footer = ({ onNavigate }: FooterProps) => {
  const features = [
    { label: "Plan Trip", icon: MapPin, section: "plan" },
    { label: "Translate", icon: Languages, section: "translate" },
    { label: "Cultural Guide", icon: BookOpen, section: "guide" },
  ];

  const resources = [
    { label: "Help Center", href: "#" },
    { label: "Travel Tips", href: "#" },
    { label: "Safety Guide", href: "#" },
    { label: "FAQ", href: "#" },
  ];

  const legal = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ];

  const socials = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">SafarAI</span>
            </div>
            <p className="text-background/70 text-sm mb-6">
              Your intelligent travel companion for exploring the incredible diversity of India. 
              AI-powered, culturally aware, always helpful.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-display font-semibold mb-4">Features</h4>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.label}>
                  <button
                    onClick={() => onNavigate(feature.section)}
                    className="flex items-center gap-2 text-background/70 hover:text-primary transition-colors"
                  >
                    <feature.icon className="w-4 h-4" />
                    {feature.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.label}>
                  <a
                    href={resource.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold mb-4">Stay Updated</h4>
            <p className="text-background/70 text-sm mb-4">
              Get travel tips and updates delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background text-foreground text-sm placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-background/50 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> for travelers
              <span className="mx-2">•</span>
              © {new Date().getFullYear()} SafarAI
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-background/50 text-sm hover:text-background transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
