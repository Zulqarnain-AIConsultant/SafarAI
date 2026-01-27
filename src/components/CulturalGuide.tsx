import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ThumbsUp, ThumbsDown, Trash2, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "helpful" | "not-helpful";
}

const quickQuestions = [
  "What should I wear visiting temples?",
  "Is tipping expected in India?",
  "How do I greet people respectfully?",
  "What are common tourist scams?",
  "What does the head wobble mean?",
  "Dining etiquette and table manners",
  "How to bargain in markets?",
  "Religious site protocols",
  "Photography restrictions",
  "Appropriate dress code for women",
];

// Demo responses for hackathon - will be replaced with AI
const demoResponses: Record<string, string> = {
  "What should I wear visiting temples?": `🛕 **Temple Dress Code in India**

When visiting temples in India, modest dress is essential:

**For Everyone:**
• Cover shoulders and knees - no sleeveless tops or shorts
• Remove shoes before entering (there are usually shoe storage areas)
• Some temples provide cloth wraps if needed

**For Women:**
• Salwar kameez or long skirts are ideal
• Carry a scarf to cover your head if required
• Avoid tight or revealing clothing

**For Men:**
• Long pants preferred over shorts
• Collared shirts are respectful
• Some temples may require removing shirts (South Indian temples)

**Pro Tips:**
• Wear slip-on shoes for easy removal
• Carry a pair of socks for hot temple floors
• Some temples don't allow leather items

🙏 When in doubt, observe what locals are wearing!`,

  "Is tipping expected in India?": `💵 **Tipping Guide for India**

Tipping culture in India is moderate - appreciated but not always expected:

**Restaurants:**
• 10-15% if service charge isn't included
• Check your bill - many add 5-10% service charge
• Small cafes/street food: Not expected

**Hotels:**
• Bellboys: ₹50-100 per bag
• Housekeeping: ₹50-100 per day
• Room service: ₹50-100

**Transportation:**
• Taxi/Uber: Round up or 5-10%
• Auto-rickshaw: Usually not expected
• Tour drivers: ₹200-500 per day

**Other Services:**
• Spa/Salon: 10-15%
• Tour guides: ₹300-500 per day
• Porters at stations: ₹50-100

**💡 Pro Tip:** Keep small denominations (₹10, ₹20, ₹50 notes) handy for tips!`,

  "How do I greet people respectfully?": `🙏 **Indian Greetings Guide**

**The Namaste:**
• Press palms together at chest level
• Slight bow of the head
• Say "Namaste" (nuh-muh-STAY)
• Used universally across India
• Perfect for temples, elders, and formal situations

**Handshakes:**
• Common in business settings
• Wait for Indians to initiate with opposite gender
• Men usually shake hands with men
• Some traditional women prefer Namaste

**Regional Variations:**
• South India: "Vanakkam" (Tamil)
• Bengal: "Namaskar"
• Punjab: "Sat Sri Akal"
• Maharashtra: "Namaskar"

**Respect Tips:**
• Address elders as "Uncle/Aunty" or "Sir/Madam"
• Use "ji" suffix for respect (e.g., "Sharma-ji")
• Avoid using first names for elders
• Touch feet of elders as a sign of deep respect

🌟 **Remember:** A warm smile is universal!`,

  "What are common tourist scams?": `⚠️ **Tourist Scams to Watch For**

**Transportation Scams:**
• "Meter is broken" - Insist or find another taxi
• Inflated fares at airports - Use prepaid taxis
• "Hotel is closed/burnt down" - Call to verify
• Wrong destination drop-offs

**Shopping Scams:**
• Fake gemstones/silk - Buy from reputed shops
• Switched items after you pay
• "Export quality" at high prices
• Commission-based "guides" to shops

**Street Scams:**
• Friendly "students" wanting to practice English (lead to shops)
• Free henna/ear cleaning (then demand payment)
• Baby formula scam (they return for cash)
• Fake holy men asking for donations

**How to Protect Yourself:**
✅ Research prices beforehand
✅ Use official tourism services
✅ Book hotels directly
✅ Keep valuables secure
✅ Trust your instincts
✅ Politely decline persistent offers

**Emergency:** Tourist Police Helpline: 1363`,

  "What does the head wobble mean?": `😄 **Decoding the Indian Head Wobble**

The famous Indian head wobble can mean many things:

**The Movements:**
• **Side-to-side shake:** Usually means "yes" or acknowledgment
• **Slight tilt:** "I understand" or agreement
• **Figure-8 motion:** Enthusiasm or strong agreement

**Common Meanings:**
✅ Yes / Okay / Sure
✅ I understand
✅ I'm listening
✅ Maybe / We'll see
✅ Thank you
✅ No problem

**Context Matters:**
• More wobble = more enthusiasm
• Combined with "Haan" = definite yes
• With a smile = positive response
• Slow wobble = uncertainty or "perhaps"

**Fun Facts:**
• It's subconscious for most Indians
• Varies by region (more common in South)
• You might catch yourself doing it after a while!

🎯 **Tip:** Don't confuse it with the Western "no" headshake - they're different!`,

  default: `🙏 **Thank you for your question!**

I'd be happy to help you navigate Indian culture and customs. Here are some general tips:

**Key Cultural Points:**
• India is incredibly diverse - customs vary by region
• Respect for elders is paramount
• Remove shoes before entering homes and temples
• Use your right hand for eating and giving/receiving items
• Personal space norms are different - crowds are common

**Communication Tips:**
• Indians often avoid direct "no" - listen for soft refusals
• "Indian Standard Time" is a real thing - expect flexibility
• Bargaining is expected in markets
• Hospitality is taken seriously - accept offers graciously

**Safety Reminders:**
• Drink bottled water only
• Be cautious with street food initially
• Keep emergency numbers saved
• Register with your embassy

Feel free to ask me anything specific about:
- Temple etiquette
- Food customs
- Regional traditions
- Festival celebrations
- Travel safety

I'm here to help make your India journey amazing! 🇮🇳`,
};

const CulturalGuide = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! 🙏 I'm your cultural guide for India. Ask me anything about Indian customs, etiquette, traditions, or travel tips! I'm here to help you navigate this beautiful, diverse country with confidence.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = (question: string): string => {
    // Check for exact matches first
    if (demoResponses[question]) {
      return demoResponses[question];
    }
    
    // Check for partial matches
    const lowerQuestion = question.toLowerCase();
    for (const [key, value] of Object.entries(demoResponses)) {
      if (lowerQuestion.includes(key.toLowerCase().split(" ").slice(0, 3).join(" "))) {
        return value;
      }
    }
    
    return demoResponses.default;
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const response = generateResponse(messageText);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  const handleFeedback = (messageId: string, feedback: "helpful" | "not-helpful") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
    toast({
      title: feedback === "helpful" ? "Thanks for the feedback! 🙏" : "Sorry to hear that",
      description: feedback === "helpful" 
        ? "Glad I could help!" 
        : "I'll try to improve my responses.",
    });
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hi! 🙏 I'm your cultural guide for India. Ask me anything about Indian customs, etiquette, traditions, or travel tips! I'm here to help you navigate this beautiful, diverse country with confidence.",
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Chat cleared",
      description: "Starting fresh!",
    });
  };

  const handleExportChat = () => {
    const chatContent = messages
      .map((msg) => {
        const time = msg.timestamp.toLocaleTimeString();
        const role = msg.role === "user" ? "You" : "SafarAI Guide";
        return `[${time}] ${role}:\n${msg.content}\n`;
      })
      .join("\n---\n\n");

    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "safarai-cultural-guide-chat.txt";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Chat exported!",
      description: "Your conversation has been downloaded.",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = (content: string) => {
    // Simple markdown-like rendering
    return content.split("\n").map((line, i) => {
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Bullet points
      if (line.startsWith("•") || line.startsWith("✅") || line.startsWith("✓")) {
        return (
          <p key={i} className="ml-2" dangerouslySetInnerHTML={{ __html: line }} />
        );
      }
      return (
        <p key={i} className={line.trim() === "" ? "h-2" : ""} dangerouslySetInnerHTML={{ __html: line }} />
      );
    });
  };

  return (
    <section id="guide-section" className="py-16 md:py-24 bg-muted/30 pattern-indian">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/10 text-navy mb-4">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">Cultural Intelligence</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Cultural Context AI Guide
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get instant answers about Indian customs, etiquette, traditions, and travel tips
            </p>
          </div>

          {/* Quick Question Chips */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3 text-center">Quick questions:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-saffron/10 to-india-green/10 
                           hover:from-saffron/20 hover:to-india-green/20 border border-saffron/20 
                           text-foreground transition-all duration-200 hover:scale-105"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">SafarAI Cultural Guide</h3>
                  <p className="text-xs text-muted-foreground">Your India travel companion</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportChat}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="h-[400px] md:h-[500px]" ref={scrollRef}>
              <div className="p-4 md:p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      )}
                    >
                      <div className={cn(
                        "text-sm md:text-base leading-relaxed",
                        message.role === "assistant" && "space-y-1"
                      )}>
                        {message.role === "assistant" 
                          ? renderMessage(message.content)
                          : message.content
                        }
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-2 mt-2 text-xs",
                          message.role === "user"
                            ? "text-primary-foreground/70 justify-end"
                            : "text-muted-foreground"
                        )}
                      >
                        <span>{formatTime(message.timestamp)}</span>
                        
                        {/* Feedback buttons for assistant messages */}
                        {message.role === "assistant" && message.id !== "welcome" && (
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => handleFeedback(message.id, "helpful")}
                              className={cn(
                                "p-1 rounded hover:bg-background/50 transition-colors",
                                message.feedback === "helpful" && "text-india-green"
                              )}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, "not-helpful")}
                              className={cn(
                                "p-1 rounded hover:bg-background/50 transition-colors",
                                message.feedback === "not-helpful" && "text-destructive"
                              )}
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50 bg-muted/30">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Indian culture, customs, or travel tips..."
                  className="min-h-[44px] max-h-[120px] resize-none rounded-xl bg-background"
                  rows={1}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="h-11 w-11 rounded-xl bg-gradient-hero hover:opacity-90"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalGuide;
