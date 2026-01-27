import { useState, useEffect } from "react";
import { 
  Mic, 
  Volume2, 
  Copy, 
  Star, 
  Trash2, 
  ChevronDown,
  Clock,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface SavedTranslation {
  id: string;
  english: string;
  translated: string;
  language: string;
  isFavorite: boolean;
  timestamp: Date;
}

const languages: Language[] = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇮🇳" },
];

interface QuickPhrase {
  english: string;
  translations: Record<string, string>;
}

interface PhraseCategory {
  id: string;
  title: string;
  icon: string;
  phrases: QuickPhrase[];
}

const phraseCategories: PhraseCategory[] = [
  {
    id: "greetings",
    title: "Greetings & Basics",
    icon: "👋",
    phrases: [
      { english: "Hello / Namaste", translations: { hi: "नमस्ते", ta: "வணக்கம்", te: "నమస్కారం", bn: "নমস্কার", mr: "नमस्कार", gu: "નમસ્તે", kn: "ನಮಸ್ಕಾರ", ml: "നമസ്കാരം", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", ur: "السلام علیکم" }},
      { english: "Thank you", translations: { hi: "धन्यवाद", ta: "நன்றி", te: "ధన్యవాదాలు", bn: "ধন্যবাদ", mr: "धन्यवाद", gu: "આભાર", kn: "ಧನ್ಯವಾದ", ml: "നന്ദി", pa: "ਧੰਨਵਾਦ", ur: "شکریہ" }},
      { english: "Please", translations: { hi: "कृपया", ta: "தயவுசெய்து", te: "దయచేసి", bn: "অনুগ্রহ করে", mr: "कृपया", gu: "કૃપા કરીને", kn: "ದಯವಿಟ್ಟು", ml: "ദയവായി", pa: "ਕਿਰਪਾ ਕਰਕੇ", ur: "براہ کرم" }},
      { english: "Sorry / Excuse me", translations: { hi: "माफ कीजिए", ta: "மன்னிக்கவும்", te: "క్షమించండి", bn: "দুঃখিত", mr: "माफ करा", gu: "માફ કરશો", kn: "ಕ್ಷಮಿಸಿ", ml: "ക്ഷമിക്കണം", pa: "ਮਾਫ਼ ਕਰਨਾ", ur: "معاف کیجیے" }},
      { english: "Yes / No", translations: { hi: "हाँ / नहीं", ta: "ஆம் / இல்லை", te: "అవును / కాదు", bn: "হ্যাঁ / না", mr: "हो / नाही", gu: "હા / ના", kn: "ಹೌದು / ಇಲ್ಲ", ml: "അതെ / ഇല്ല", pa: "ਹਾਂ / ਨਹੀਂ", ur: "ہاں / نہیں" }},
      { english: "Goodbye", translations: { hi: "अलविदा", ta: "போய் வருகிறேன்", te: "వీడ్కోలు", bn: "বিদায়", mr: "निरोप", gu: "આવજો", kn: "ವಿದಾಯ", ml: "വിട", pa: "ਅਲਵਿਦਾ", ur: "الوداع" }},
    ],
  },
  {
    id: "transportation",
    title: "Transportation",
    icon: "🚗",
    phrases: [
      { english: "Where is...?", translations: { hi: "...कहाँ है?", ta: "...எங்கே?", te: "...ఎక్కడ?", bn: "...কোথায়?", mr: "...कुठे आहे?", gu: "...ક્યાં છે?", kn: "...ಎಲ್ಲಿ?", ml: "...എവിടെ?", pa: "...ਕਿੱਥੇ ਹੈ?", ur: "...کہاں ہے؟" }},
      { english: "How much does this cost?", translations: { hi: "इसकी कीमत क्या है?", ta: "இதன் விலை என்ன?", te: "దీని ధర ఎంత?", bn: "এটার দাম কত?", mr: "याची किंमत काय?", gu: "આની કિંમત શું છે?", kn: "ಇದರ ಬೆಲೆ ಎಷ್ಟು?", ml: "ഇതിന്റെ വില എന്താണ്?", pa: "ਇਸਦੀ ਕੀਮਤ ਕੀ ਹੈ?", ur: "یہ کتنے کا ہے؟" }},
      { english: "Taxi / Auto-rickshaw", translations: { hi: "टैक्सी / ऑटो", ta: "டாக்ஸி / ஆட்டோ", te: "టాక్సీ / ఆటో", bn: "ট্যাক্সি / অটো", mr: "टॅक्सी / रिक्षा", gu: "ટેક્સી / રિક્ષા", kn: "ಟ್ಯಾಕ್ಸಿ / ಆಟೋ", ml: "ടാക്സി / ഓട്ടോ", pa: "ਟੈਕਸੀ / ਆਟੋ", ur: "ٹیکسی / آٹو" }},
      { english: "Train station / Airport", translations: { hi: "रेलवे स्टेशन / हवाई अड्डा", ta: "ரயில் நிலையம் / விமான நிலையம்", te: "రైల్వే స్టేషన్ / విమానాశ్రయం", bn: "রেলস্টেশন / বিমানবন্দর", mr: "रेल्वे स्टेशन / विमानतळ", gu: "રેલવે સ્ટેશન / એરપોર્ટ", kn: "ರೈಲು ನಿಲ್ದಾಣ / ವಿಮಾನ ನಿಲ್ದಾಣ", ml: "റെയിൽവേ സ്റ്റേഷൻ / വിമാനത്താവളം", pa: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ / ਹਵਾਈ ਅੱਡਾ", ur: "ریلوے اسٹیشن / ہوائی اڈا" }},
      { english: "Stop here, please", translations: { hi: "यहाँ रुकिए, कृपया", ta: "இங்கே நிறுத்துங்கள்", te: "ఇక్కడ ఆపండి", bn: "এখানে থামুন", mr: "इथे थांबा", gu: "અહીં રોકો", kn: "ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ", ml: "ഇവിടെ നിർത്തൂ", pa: "ਇੱਥੇ ਰੁਕੋ", ur: "یہاں رکیں" }},
    ],
  },
  {
    id: "food",
    title: "Food & Dining",
    icon: "🍛",
    phrases: [
      { english: "Water, please", translations: { hi: "पानी दीजिए", ta: "தண்ணீர் கொடுங்கள்", te: "నీళ్ళు ఇవ్వండి", bn: "জল দিন", mr: "पाणी द्या", gu: "પાણી આપો", kn: "ನೀರು ಕೊಡಿ", ml: "വെള്ളം തരൂ", pa: "ਪਾਣੀ ਦਿਓ", ur: "پانی دیجیے" }},
      { english: "Is this spicy?", translations: { hi: "क्या यह मसालेदार है?", ta: "இது காரமா?", te: "ఇది కారంగా ఉందా?", bn: "এটা কি ঝাল?", mr: "हे तिखट आहे का?", gu: "આ તીખું છે?", kn: "ಇದು ಖಾರವಾಗಿದೆಯೇ?", ml: "ഇത് എരിവുള്ളതാണോ?", pa: "ਕੀ ਇਹ ਮਸਾਲੇਦਾਰ ਹੈ?", ur: "کیا یہ مسالے دار ہے؟" }},
      { english: "Vegetarian food", translations: { hi: "शाकाहारी खाना", ta: "சைவ உணவு", te: "శాకాహార భోజనం", bn: "নিরামিষ খাবার", mr: "शाकाहारी जेवण", gu: "શાકાહારી ભોજન", kn: "ಸಸ್ಯಾಹಾರ", ml: "സസ്യാഹാരം", pa: "ਸ਼ਾਕਾਹਾਰੀ ਭੋਜਨ", ur: "سبزی خور کھانا" }},
      { english: "Bill, please", translations: { hi: "बिल दीजिए", ta: "பில் கொடுங்கள்", te: "బిల్లు ఇవ్వండి", bn: "বিল দিন", mr: "बिल द्या", gu: "બિલ આપો", kn: "ಬಿಲ್ ಕೊಡಿ", ml: "ബിൽ തരൂ", pa: "ਬਿੱਲ ਦਿਓ", ur: "بل دیجیے" }},
      { english: "Delicious!", translations: { hi: "स्वादिष्ट!", ta: "சுவையான!", te: "రుచికరమైన!", bn: "সুস্বাদু!", mr: "स्वादिष्ट!", gu: "સ્વાદિષ્ટ!", kn: "ರುಚಿಯಾಗಿದೆ!", ml: "രുചികരം!", pa: "ਸੁਆਦੀ!", ur: "مزیدار!" }},
    ],
  },
  {
    id: "emergency",
    title: "Emergency",
    icon: "🆘",
    phrases: [
      { english: "Help!", translations: { hi: "मदद!", ta: "உதவி!", te: "సహాయం!", bn: "সাহায্য!", mr: "मदत!", gu: "મદદ!", kn: "ಸಹಾಯ!", ml: "സഹായം!", pa: "ਮਦਦ!", ur: "مدد!" }},
      { english: "I need a doctor", translations: { hi: "मुझे डॉक्टर चाहिए", ta: "எனக்கு மருத்துவர் வேண்டும்", te: "నాకు డాక్టర్ కావాలి", bn: "আমার ডাক্তার দরকার", mr: "मला डॉक्टर हवा", gu: "મને ડૉક્ટર જોઈએ", kn: "ನನಗೆ ವೈದ್ಯರ ಅಗತ್ಯವಿದೆ", ml: "എനിക്ക് ഡോക്ടറെ വേണം", pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਚਾਹੀਦਾ ਹੈ", ur: "مجھے ڈاکٹر چاہیے" }},
      { english: "Police", translations: { hi: "पुलिस", ta: "காவல்துறை", te: "పోలీసులు", bn: "পুলিশ", mr: "पोलीस", gu: "પોલીસ", kn: "ಪೊಲೀಸ್", ml: "പോലീസ്", pa: "ਪੁਲਿਸ", ur: "پولیس" }},
      { english: "I'm lost", translations: { hi: "मैं खो गया हूँ", ta: "நான் வழி தவறிவிட்டேன்", te: "నేను తప్పిపోయాను", bn: "আমি পথ হারিয়েছি", mr: "मी हरवलो आहे", gu: "હું ખોવાઈ ગયો છું", kn: "ನಾನು ಕಳೆದುಹೋಗಿದ್ದೇನೆ", ml: "ഞാൻ വഴി തെറ്റി", pa: "ਮੈਂ ਗੁੰਮ ਹੋ ਗਿਆ ਹਾਂ", ur: "میں کھو گیا ہوں" }},
      { english: "Call embassy", translations: { hi: "दूतावास को फोन करें", ta: "தூதரகத்தை அழைக்கவும்", te: "రాయబార కార్యాలయానికి కాల్ చేయండి", bn: "দূতাবাসে ফোন করুন", mr: "दूतावासाला फोन करा", gu: "દૂતાવાસને ફોન કરો", kn: "ರಾಯಭಾರ ಕಚೇರಿಗೆ ಕರೆ ಮಾಡಿ", ml: "എംബസിയെ വിളിക്കൂ", pa: "ਦੂਤਾਵਾਸ ਨੂੰ ਕਾਲ ਕਰੋ", ur: "سفارت خانے کو فون کریں" }},
    ],
  },
  {
    id: "shopping",
    title: "Shopping",
    icon: "🛍️",
    phrases: [
      { english: "How much?", translations: { hi: "कितना?", ta: "எவ்வளவு?", te: "ఎంత?", bn: "কত?", mr: "किती?", gu: "કેટલું?", kn: "ಎಷ್ಟು?", ml: "എത്ര?", pa: "ਕਿੰਨਾ?", ur: "کتنا؟" }},
      { english: "Too expensive", translations: { hi: "बहुत महंगा", ta: "மிகவும் விலை அதிகம்", te: "చాలా ఖరీదు", bn: "অনেক দাম", mr: "खूप महाग", gu: "ઘણું મોંઘું", kn: "ತುಂಬಾ ದುಬಾರಿ", ml: "വളരെ വിലയേറിയത്", pa: "ਬਹੁਤ ਮਹਿੰਗਾ", ur: "بہت مہنگا" }},
      { english: "Can you reduce the price?", translations: { hi: "क्या कीमत कम हो सकती है?", ta: "விலை குறைக்க முடியுமா?", te: "ధర తగ్గించగలరా?", bn: "দাম কমাতে পারবেন?", mr: "किंमत कमी करता येईल का?", gu: "ભાવ ઓછો કરી શકો?", kn: "ಬೆಲೆ ಕಡಿಮೆ ಮಾಡಬಹುದೇ?", ml: "വില കുറയ്ക്കാമോ?", pa: "ਕੀ ਕੀਮਤ ਘੱਟ ਹੋ ਸਕਦੀ ਹੈ?", ur: "کیا قیمت کم ہو سکتی ہے؟" }},
      { english: "I'll take it", translations: { hi: "मैं यह लूँगा", ta: "நான் இதை எடுத்துக்கொள்கிறேன்", te: "నేను దీన్ని తీసుకుంటాను", bn: "আমি এটা নেব", mr: "मी हे घेतो", gu: "હું આ લઈશ", kn: "ನಾನು ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತೇನೆ", ml: "ഞാൻ ഇത് എടുക്കാം", pa: "ਮੈਂ ਇਹ ਲੈਂਦਾ ਹਾਂ", ur: "میں یہ لے لوں گا" }},
      { english: "Just looking", translations: { hi: "बस देख रहा हूँ", ta: "பார்க்கிறேன் மட்டும்", te: "చూస్తున్నాను అంతే", bn: "শুধু দেখছি", mr: "फक्त बघतोय", gu: "ફક્ત જોઈ રહ્યો છું", kn: "ನೋಡುತ್ತಿದ್ದೇನೆ ಅಷ್ಟೇ", ml: "നോക്കുന്നു മാത്രം", pa: "ਬੱਸ ਦੇਖ ਰਿਹਾ ਹਾਂ", ur: "بس دیکھ رہا ہوں" }},
    ],
  },
];

const TranslationTool = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("hi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [savedTranslations, setSavedTranslations] = useState<SavedTranslation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const maxCharacters = 500;

  // Demo translation function
  const translateText = async (text: string, langCode: string): Promise<string> => {
    // Check quick phrases first
    for (const category of phraseCategories) {
      for (const phrase of category.phrases) {
        if (phrase.english.toLowerCase() === text.toLowerCase()) {
          return phrase.translations[langCode] || text;
        }
      }
    }
    
    // Demo translations for common words/phrases
    const demoTranslations: Record<string, Record<string, string>> = {
      hi: {
        "hello": "नमस्ते",
        "thank you": "धन्यवाद",
        "good morning": "सुप्रभात",
        "how are you": "आप कैसे हैं",
        "my name is": "मेरा नाम है",
        "i love india": "मुझे भारत से प्यार है",
        "beautiful": "सुंदर",
        "food": "खाना",
        "water": "पानी",
        "help": "मदद",
      },
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lowerText = text.toLowerCase().trim();
    if (demoTranslations[langCode]?.[lowerText]) {
      return demoTranslations[langCode][lowerText];
    }
    
    // Return a demo message for now
    const lang = languages.find(l => l.code === langCode);
    return `[${lang?.nativeName || langCode}] ${text}`;
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await translateText(inputText, selectedLanguage);
      setTranslatedText(result);
    } catch (error) {
      toast({
        title: "Translation Error",
        description: "Could not translate the text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleQuickPhrase = async (phrase: QuickPhrase) => {
    setInputText(phrase.english);
    const translation = phrase.translations[selectedLanguage];
    if (translation) {
      setTranslatedText(translation);
    }
  };

  const handleCopy = async (text: string, id?: string) => {
    await navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
    toast({
      title: "Copied!",
      description: "Translation copied to clipboard",
    });
  };

  const handleSave = () => {
    if (!inputText.trim() || !translatedText.trim()) return;
    
    const newTranslation: SavedTranslation = {
      id: Date.now().toString(),
      english: inputText,
      translated: translatedText,
      language: selectedLanguage,
      isFavorite: false,
      timestamp: new Date(),
    };
    
    setSavedTranslations(prev => [newTranslation, ...prev].slice(0, 20));
    toast({
      title: "Saved!",
      description: "Translation added to your saved phrases",
    });
  };

  const toggleFavorite = (id: string) => {
    setSavedTranslations(prev =>
      prev.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)
    );
  };

  const deleteSaved = (id: string) => {
    setSavedTranslations(prev => prev.filter(t => t.id !== id));
  };

  const handleVoicePlayback = () => {
    if (!translatedText) return;
    
    // Use Web Speech API for demo
    const utterance = new SpeechSynthesisUtterance(translatedText);
    const langMap: Record<string, string> = {
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      bn: "bn-IN",
      mr: "mr-IN",
      gu: "gu-IN",
      kn: "kn-IN",
      ml: "ml-IN",
      pa: "pa-IN",
      ur: "ur-PK",
    };
    utterance.lang = langMap[selectedLanguage] || "hi-IN";
    window.speechSynthesis.speak(utterance);
  };

  const clearInput = () => {
    setInputText("");
    setTranslatedText("");
  };

  // Auto-translate on language change if there's text
  useEffect(() => {
    if (inputText.trim() && translatedText) {
      handleTranslate();
    }
  }, [selectedLanguage]);

  const selectedLang = languages.find(l => l.code === selectedLanguage);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6">
              <span className="text-xl">🗣️</span>
              <span className="font-medium">Live Translation</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Real-time Translation
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Break language barriers with instant translation between English and 
              10+ Indian languages. Type, tap, or speak - we've got you covered.
            </p>
          </div>

          {/* Translation Interface */}
          <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-sm">English</label>
                  <span className={cn(
                    "text-xs",
                    inputText.length > maxCharacters * 0.9 
                      ? "text-destructive" 
                      : "text-muted-foreground"
                  )}>
                    {inputText.length}/{maxCharacters}
                  </span>
                </div>
                <div className="relative">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value.slice(0, maxCharacters))}
                    placeholder="Type or paste English text here..."
                    className="min-h-[180px] resize-none pr-12 text-lg"
                  />
                  <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Voice input (demo)"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    {inputText && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={clearInput}
                        title="Clear"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isTranslating}
                  className="w-full"
                  variant="hero"
                >
                  {isTranslating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Translating...
                    </>
                  ) : (
                    "Translate"
                  )}
                </Button>
              </div>

              {/* Output Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-auto gap-2">
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          <span>{selectedLang?.flag}</span>
                          <span>{selectedLang?.name}</span>
                          <span className="text-muted-foreground">({selectedLang?.nativeName})</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                            <span className="text-muted-foreground">({lang.nativeName})</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <div 
                    className={cn(
                      "min-h-[180px] rounded-md border border-input bg-muted/50 px-3 py-2 text-lg",
                      !translatedText && "flex items-center justify-center text-muted-foreground"
                    )}
                  >
                    {translatedText || "Translation will appear here..."}
                  </div>
                  {translatedText && (
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-secondary"
                        onClick={handleVoicePlayback}
                        title="Play audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopy(translatedText)}
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={handleSave}
                        title="Save translation"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Phrases Section */}
          <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6 md:p-8 mb-8">
            <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <span>⚡</span>
              Quick Phrases
            </h3>
            <Accordion type="single" collapsible className="space-y-2">
              {phraseCategories.map((category) => (
                <AccordionItem 
                  key={category.id} 
                  value={category.id}
                  className="border rounded-xl px-4 data-[state=open]:bg-muted/30"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium">{category.title}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.phrases.map((phrase, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickPhrase(phrase)}
                          className="text-left p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border group"
                        >
                          <div className="font-medium text-sm group-hover:text-primary transition-colors">
                            {phrase.english}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {phrase.translations[selectedLanguage]}
                          </div>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Saved Translations */}
          {savedTranslations.length > 0 && (
            <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6 md:p-8">
              <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Saved Translations
              </h3>
              
              {/* Favorites */}
              {savedTranslations.some(t => t.isFavorite) && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    Favorites
                  </h4>
                  <div className="space-y-2">
                    {savedTranslations.filter(t => t.isFavorite).map((translation) => (
                      <SavedTranslationItem
                        key={translation.id}
                        translation={translation}
                        onCopy={handleCopy}
                        onToggleFavorite={toggleFavorite}
                        onDelete={deleteSaved}
                        copiedId={copiedId}
                        languages={languages}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Recent
                </h4>
                <div className="space-y-2">
                  {savedTranslations.filter(t => !t.isFavorite).slice(0, 5).map((translation) => (
                    <SavedTranslationItem
                      key={translation.id}
                      translation={translation}
                      onCopy={handleCopy}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deleteSaved}
                      copiedId={copiedId}
                      languages={languages}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

interface SavedTranslationItemProps {
  translation: SavedTranslation;
  onCopy: (text: string, id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  copiedId: string | null;
  languages: Language[];
}

const SavedTranslationItem = ({
  translation,
  onCopy,
  onToggleFavorite,
  onDelete,
  copiedId,
  languages,
}: SavedTranslationItemProps) => {
  const lang = languages.find(l => l.code === translation.language);
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{translation.english}</div>
        <div className="text-sm text-muted-foreground truncate">
          {lang?.flag} {translation.translated}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onCopy(translation.translated, translation.id)}
        >
          {copiedId === translation.id ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onToggleFavorite(translation.id)}
        >
          <Star className={cn(
            "w-3.5 h-3.5",
            translation.isFavorite && "fill-primary text-primary"
          )} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:text-destructive"
          onClick={() => onDelete(translation.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default TranslationTool;
