import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Fuel, 
  ExternalLink, 
  Truck,
  Search,
  ChevronLeft,
  Car,
  Wrench,
  Building,
  Calculator,
  MapPin,
  FileText,
  Navigation,
  Grid3X3,
  Award,
  Shield,
  Users,
  Heart,
  CreditCard,
  LayoutGrid,
  List,
  ChevronDown,
  Save,
  Package,
  ShoppingBag
} from "lucide-react";

// Financial Institutions Data (1 item)
const FINANCIAL_INSTITUTIONS = [
  {
    id: "drivers-credit-union",
    name: "Drivers Credit Union",
    type: "Credit Union",
    description: "Specialized financial services for professional drivers and transportation workers",
    website: "https://www.driverscu.org",
    features: ["Driver-specific loans", "Commercial vehicle financing", "Fuel card programs", "Mobile banking"],
    badges: ["Driver Focused", "Nationwide", "Member Owned"],
    color: "violet"
  }
];

// Financial Tools Data (6 items)
const FINANCIAL_TOOLS = [
  {
    id: "quickbooks",
    name: "QuickBooks Self-Employed",
    type: "Tax & Expense Tracking",
    description: "Track business expenses, mileage, and estimated taxes automatically",
    website: "https://quickbooks.intuit.com/self-employed",
    features: ["Automatic mileage tracking", "Expense categorization", "Quarterly tax estimates", "Receipt capture"],
    badges: ["Popular Choice", "IRS Approved", "Mobile App"],
    color: "blue"
  },
  {
    id: "hurdlr",
    name: "Hurdlr",
    type: "Expense & Mileage Tracking",
    description: "Real-time expense tracking and mileage logging for gig workers",
    website: "https://www.hurdlr.com",
    features: ["Real-time tracking", "Tax deduction maximizer", "Profit/loss reports", "Multiple business tracking"],
    badges: ["Gig Worker Focused", "Real-time", "Multi-business"],
    color: "green"
  },
  {
    id: "stride-tax",
    name: "Stride Tax",
    type: "Tax Preparation",
    description: "Free tax app designed specifically for independent contractors and drivers",
    website: "https://www.stridehealth.com/tax",
    features: ["Free tax filing", "Deduction finder", "Year-round tracking", "Driver-specific deductions"],
    badges: ["Free", "Driver Specific", "Year-round"],
    color: "purple"
  },
  {
    id: "everlance",
    name: "Everlance",
    type: "Mileage & Expense Tracker",
    description: "Automatic mileage and expense tracking with IRS-compliant reporting",
    website: "https://www.everlance.com",
    features: ["Automatic trip detection", "IRS-compliant reports", "Receipt scanning", "Tax deduction calculator"],
    badges: ["IRS Compliant", "Automatic", "Receipt Scanner"],
    color: "orange"
  },
  {
    id: "taxbot",
    name: "TaxBot",
    type: "Business Expense Tracker",
    description: "Smart expense tracking with automated categorization and tax preparation",
    website: "https://www.taxbot.com",
    features: ["Smart categorization", "Receipt management", "Tax preparation", "Business insights"],
    badges: ["Smart AI", "Receipt Manager", "Business Insights"],
    color: "cyan"
  },
  {
    id: "wave-accounting",
    name: "Wave Accounting",
    type: "Accounting Software",
    description: "Free accounting software for small businesses and independent contractors",
    website: "https://www.waveapps.com",
    features: ["Free accounting", "Invoicing", "Payment processing", "Financial reporting"],
    badges: ["Free", "Full Accounting", "Invoicing"],
    color: "teal"
  }
];

// Fuel Cards Data (21 items)
const FUEL_CARDS = [
  {
    id: "upside",
    name: "Upside",
    type: "Cashback App",
    description: "Get cash back at gas stations, grocery stores, and restaurants",
    website: "https://www.upside.com",
    cashback: "Up to 25¢/gal",
    features: ["No membership fees", "Instant cashback", "Stack with other rewards", "Wide network"],
    badges: ["Popular", "No Fees", "Instant Cashback"],
    color: "green"
  },
  {
    id: "wex-fleet-card",
    name: "WEX Fleet Card",
    type: "Fleet Card",
    description: "Commercial fuel card with detailed reporting and controls",
    website: "https://www.wexinc.com",
    cashback: "Volume discounts",
    features: ["Fuel controls", "Detailed reporting", "Driver management", "24/7 support"],
    badges: ["Commercial", "Fleet Management", "Controls"],
    color: "blue"
  },
  {
    id: "shell-fuel-rewards",
    name: "Shell Fuel Rewards",
    type: "Loyalty Program",
    description: "Earn and redeem fuel rewards at Shell stations nationwide",
    website: "https://www.shell.us/motorists/shell-fuel-rewards",
    cashback: "5¢-20¢/gal savings",
    features: ["No membership fee", "Partner rewards", "Mobile app", "Nationwide network"],
    badges: ["Major Brand", "Partner Rewards", "Mobile App"],
    color: "yellow"
  },
  {
    id: "exxon-mobil-rewards",
    name: "Exxon Mobil Rewards+",
    type: "Loyalty Program", 
    description: "Earn points on fuel and convenience store purchases",
    website: "https://www.exxon.com/en/rewards",
    cashback: "3¢/gal in points",
    features: ["Points redemption", "Bonus offers", "Mobile pay", "Convenience rewards"],
    badges: ["Points System", "Mobile Pay", "Convenience"],
    color: "red"
  },
  {
    id: "bp-driver-rewards",
    name: "BPme Rewards",
    type: "Mobile Rewards",
    description: "Mobile app with fuel savings and payment convenience",
    website: "https://www.bp.com/en_us/united-states/home/products-and-services/bp-rewards.html",
    cashback: "5¢/gal savings",
    features: ["Mobile payment", "Skip the line", "Instant rewards", "Pump control"],
    badges: ["Mobile First", "Instant", "Pump Control"],
    color: "green"
  },
  {
    id: "speedway-speedy-rewards",
    name: "Speedy Rewards",
    type: "Loyalty Program",
    description: "Earn points on fuel and store purchases at Speedway locations",
    website: "https://www.speedway.com/speedy-rewards",
    cashback: "Points for rewards",
    features: ["Points system", "Mobile app", "Special offers", "Store rewards"],
    badges: ["Points System", "Store Rewards", "Special Offers"],
    color: "red"
  },
  {
    id: "circle-k-easy-rewards",
    name: "Easy Rewards",
    type: "Loyalty Program",
    description: "Circle K's rewards program for fuel and convenience store savings",
    website: "https://www.circlek.com/easy-rewards",
    cashback: "Points and discounts",
    features: ["Mobile app", "Personalized offers", "Fuel discounts", "Store rewards"],
    badges: ["Personalized", "Mobile App", "Store Rewards"],
    color: "red"
  },
  {
    id: "costco-gas",
    name: "Costco Gas Stations",
    type: "Membership Discount",
    description: "Members-only fuel stations with wholesale pricing",
    website: "https://www.costco.com/gas-stations",
    cashback: "Wholesale pricing",
    features: ["Member pricing", "High quality fuel", "Cashback with Citi card", "Convenient locations"],
    badges: ["Member Only", "Wholesale Price", "High Quality"],
    color: "blue"
  },
  {
    id: "sams-club-gas",
    name: "Sam's Club Fuel Centers",
    type: "Membership Discount",
    description: "Member fuel savings at Sam's Club fuel centers",
    website: "https://www.samsclub.com/content/fuel",
    cashback: "5¢/gal discount",
    features: ["Member discount", "Plus member extra savings", "Quality fuel", "Convenient hours"],
    badges: ["Member Discount", "Plus Benefits", "Quality"],
    color: "blue"
  },
  {
    id: "chevron-techron-advantage",
    name: "Chevron Techron Advantage",
    type: "Credit Card",
    description: "Chevron and Texaco credit card with fuel rewards",
    website: "https://www.chevron.com/cards",
    cashback: "3¢/gal rebate",
    features: ["Fuel rebates", "No annual fee", "Fraud protection", "Online account management"],
    badges: ["Credit Card", "No Annual Fee", "Rebates"],
    color: "blue"
  },
  {
    id: "pilot-flying-j-myrewards",
    name: "myRewards Plus",
    type: "Professional Driver Program",
    description: "Pilot Flying J's professional driver rewards program",
    website: "https://pilotflyingj.com/fuel/myrewards-plus",
    cashback: "Shower credits & discounts",
    features: ["Shower credits", "Food discounts", "Fuel discounts", "Professional driver focused"],
    badges: ["Professional", "Shower Credits", "Trucker Focused"],
    color: "orange"
  },
  {
    id: "loves-travel-stops",
    name: "Love's Fuel Card",
    type: "Travel Center Card",
    description: "Professional driver benefits at Love's Travel Stops",
    website: "https://www.loves.com/en/fuel-cards",
    cashback: "Driver benefits",
    features: ["Professional driver discounts", "Shower programs", "Food discounts", "Wide network"],
    badges: ["Professional", "Travel Centers", "Driver Benefits"],
    color: "red"
  },
  {
    id: "ta-petro-ultraone",
    name: "UltraONE",
    type: "Professional Driver Card",
    description: "TravelCenters of America professional driver rewards",
    website: "https://www.ta-petro.com/ultraone",
    cashback: "Driver rewards",
    features: ["Shower credits", "Food rewards", "Fuel discounts", "Maintenance discounts"],
    badges: ["Professional", "Maintenance", "Shower Credits"],
    color: "blue"
  },
  {
    id: "fleet-one-fuelman",
    name: "Fuelman",
    type: "Fleet Fuel Card",
    description: "Fleet management fuel card with comprehensive controls",
    website: "https://www.fleetone.com",
    cashback: "Fleet discounts",
    features: ["Fleet controls", "Detailed reporting", "Fraud protection", "Driver management"],
    badges: ["Fleet Management", "Controls", "Reporting"],
    color: "gray"
  },
  {
    id: "voyager-fleet-card",
    name: "Voyager Fleet Card",
    type: "Commercial Fleet Card",
    description: "U.S. Bank's fleet fuel card for commercial vehicles",
    website: "https://www.voyagerfleet.com",
    cashback: "Commercial pricing",
    features: ["Commercial pricing", "Expense controls", "Detailed reports", "24/7 support"],
    badges: ["Commercial", "U.S. Bank", "24/7 Support"],
    color: "navy"
  },
  {
    id: "comdata-mastercard",
    name: "Comdata MasterCard",
    type: "Fleet Payment Card",
    description: "Fleet payment solutions with fuel and maintenance coverage",
    website: "https://www.comdata.com",
    cashback: "Fleet savings",
    features: ["Fuel and maintenance", "Expense management", "Driver tools", "Fleet optimization"],
    badges: ["Fleet Solutions", "Maintenance", "Driver Tools"],
    color: "red"
  },
  {
    id: "rts-carrier-services",
    name: "RTS Fuel Card",
    type: "Carrier Services",
    description: "Fuel card designed specifically for trucking companies and drivers",
    website: "https://www.rtscarrier.com",
    cashback: "Carrier discounts",
    features: ["Trucking focused", "Carrier services", "Fuel optimization", "Route planning"],
    badges: ["Trucking Focused", "Carrier Services", "Route Planning"],
    color: "orange"
  },
  {
    id: "multi-service-fuel-card",
    name: "Multi Service Fuel Card",
    type: "Independent Network",
    description: "Independent fuel card network with competitive pricing",
    website: "https://www.multiservicefuelcard.com",
    cashback: "Network discounts",
    features: ["Independent network", "Competitive pricing", "No setup fees", "Quick approval"],
    badges: ["Independent", "No Setup Fees", "Quick Approval"],
    color: "green"
  },
  {
    id: "mudflap",
    name: "Mudflap",
    type: "Mobile Fuel App",
    description: "Mobile app offering instant fuel discounts for truckers",
    website: "https://www.mudflap.com", 
    cashback: "10-60¢/gal discount",
    features: ["No fees", "No cards needed", "Instant discounts", "Trucker focused"],
    badges: ["No Fees", "Mobile Only", "Instant", "Trucker App"],
    color: "brown"
  },
  {
    id: "tcs-fuel-card",
    name: "TCS Fuel Card",
    type: "Transportation Card",
    description: "Fuel card services for transportation and logistics companies",
    website: "https://www.tcsfuelcard.com",
    cashback: "Transportation discounts",
    features: ["Transportation focused", "Fleet management", "Expense tracking", "Driver support"],
    badges: ["Transportation", "Fleet Management", "Driver Support"],
    color: "blue"
  },
  {
    id: "gasbuddy-pay",
    name: "GasBuddy Pay",
    type: "Mobile Payment App",
    description: "Mobile payment app with fuel savings and station finder",
    website: "https://www.gasbuddy.com/pay",
    cashback: "Up to 40¢/gal savings",
    features: ["Mobile payment", "Station finder", "Price comparison", "Fuel savings"],
    badges: ["Mobile Payment", "Price Comparison", "Station Finder"],
    color: "purple"
  }
];

// Insurance Brokers Data
const INSURANCE_BROKERS = [
  {
    id: "progressive-commercial",
    name: "Progressive Commercial",
    type: "Commercial Auto Insurance",
    description: "Commercial auto insurance for delivery drivers and couriers",
    website: "https://www.progressivecommercial.com",
    coverage: ["Commercial auto liability", "Cargo insurance", "Physical damage", "Hired/non-owned auto"],
    badges: ["Major Carrier", "Online Quotes", "24/7 Claims"],
    color: "blue"
  },
  {
    id: "simply-business",
    name: "Simply Business",
    type: "Insurance Broker",
    description: "Compare commercial auto, cargo, and general liability insurance quotes",
    website: "https://www.simplybusiness.com",
    coverage: ["Commercial auto", "Cargo", "General liability", "Workers comp"],
    badges: ["Comparison Tool", "Multiple Carriers", "Fast Quotes"],
    color: "purple"
  },
  {
    id: "next-insurance",
    name: "Next Insurance",
    type: "Digital Insurance",
    description: "Fast online insurance for courier and delivery businesses",
    website: "https://www.nextinsurance.com",
    coverage: ["General liability", "Commercial auto", "Cargo", "Tools/equipment"],
    badges: ["Digital First", "Instant Quotes", "Affordable"],
    color: "cyan"
  },
  {
    id: "commercial-auto-insurance",
    name: "Commercial Auto Insurance Specialists",
    type: "Specialized Broker",
    description: "Brokers specializing in courier and delivery vehicle insurance",
    website: "https://www.caispecialists.com",
    coverage: ["$300k-$1M liability", "$10k-$100k cargo", "Occupational accident", "Physical damage"],
    badges: ["Courier Focused", "Flexible Terms", "High Limits"],
    color: "green"
  },
  {
    id: "wex-fleet-card",
    name: "WEX Fuel Cards",
    type: "Fuel Management",
    description: "Fleet fuel cards with spending controls and detailed reporting",
    website: "https://www.wexinc.com",
    features: ["Volume discounts", "Fuel controls", "Detailed reporting", "Driver management"],
    badges: ["Fleet Management", "Commercial", "Controls"],
    color: "orange"
  },
  {
    id: "atob-fuel-card",
    name: "AtoB Fuel Card",
    type: "Modern Fuel Card",
    description: "Modern fuel card for fleets with no setup fees and instant discounts",
    website: "https://www.atob.com",
    features: ["No setup fees", "Instant discounts", "Spending controls", "Mobile app"],
    badges: ["Modern Platform", "No Fees", "Mobile First"],
    color: "teal"
  }
];

// Equipment & Tools Data
const EQUIPMENT_TOOLS = [
  {
    id: "vava-dashcam",
    name: "VAVA Dual Dash Cam",
    type: "Dashcam",
    description: "Front and rear dashcam with night vision and GPS tracking",
    website: "https://www.amazon.com/s?k=vava+dash+cam",
    features: ["1080P front/rear", "Night vision", "GPS tracking", "Loop recording"],
    price: "$100-$200",
    badges: ["Top Rated", "Dual Camera", "GPS"],
    color: "blue"
  },
  {
    id: "garmin-dashcam",
    name: "Garmin Dash Cam",
    type: "Dashcam",
    description: "Premium dashcam with voice control and driver alerts",
    website: "https://www.garmin.com/en-US/c/automotive/dash-cams/",
    features: ["1440P recording", "Voice control", "Driver alerts", "Cloud connectivity"],
    price: "$150-$400",
    badges: ["Premium", "Voice Control", "Cloud Sync"],
    color: "cyan"
  },
  {
    id: "medical-cooler",
    name: "Coleman Medical Transport Cooler",
    type: "Medical Cooler",
    description: "Insulated cooler for medical specimen and pharmaceutical transport",
    website: "https://www.amazon.com/s?k=medical+transport+cooler",
    features: ["Temperature logging", "Gel pack compatible", "Leak-proof", "Certified insulation"],
    price: "$40-$120",
    badges: ["Medical Grade", "Temperature Control", "Certified"],
    color: "red"
  },
  {
    id: "pelican-cooler",
    name: "Pelican Elite Coolers",
    type: "Premium Cooler",
    description: "Heavy-duty coolers for medical and pharmaceutical delivery",
    website: "https://www.pelican.com/us/en/products/coolers",
    features: ["Extended ice retention", "Bear-resistant", "Lifetime warranty", "Temperature certified"],
    price: "$200-$500",
    badges: ["Premium", "Lifetime Warranty", "Medical Certified"],
    color: "orange"
  },
  {
    id: "spill-kit",
    name: "Medical Spill Kit",
    type: "Safety Equipment",
    description: "OSHA-compliant spill kit for biological materials",
    website: "https://www.amazon.com/s?k=medical+spill+kit",
    features: ["OSHA compliant", "Absorbent materials", "PPE included", "Disposal bags"],
    price: "$30-$80",
    badges: ["OSHA Compliant", "Safety Essential", "PPE Included"],
    color: "yellow"
  },
  {
    id: "roadside-kit",
    name: "AAA Roadside Emergency Kit",
    type: "Emergency Kit",
    description: "Complete roadside emergency kit with jumper cables and tools",
    website: "https://www.amazon.com/s?k=aaa+roadside+emergency+kit",
    features: ["Jumper cables", "First aid", "Reflective vest", "Flashlight & tools"],
    price: "$40-$100",
    badges: ["Emergency Essential", "AAA Approved", "Complete"],
    color: "red"
  },
  {
    id: "tire-chains",
    name: "Snow/Ice Tire Chains",
    type: "Winter Equipment",
    description: "Heavy-duty tire chains for winter delivery operations",
    website: "https://www.amazon.com/s?k=tire+chains",
    features: ["Easy installation", "SAE certified", "Multiple sizes", "Storage case"],
    price: "$50-$150",
    badges: ["Winter Essential", "SAE Certified", "All Sizes"],
    color: "blue"
  },
  {
    id: "phone-mount",
    name: "Hands-Free Phone Mount",
    type: "Mobile Accessory",
    description: "Magnetic hands-free phone mount for navigation and delivery apps",
    website: "https://www.amazon.com/s?k=magnetic+phone+mount+car",
    features: ["Strong magnetic hold", "360° rotation", "Easy installation", "Universal fit"],
    price: "$15-$40",
    badges: ["Essential", "Hands-Free", "Universal"],
    color: "purple"
  }
];

// Curated Service Bundles
const CURATED_BUNDLES = [
  {
    id: "start-solo",
    name: "Start Solo Bundle",
    type: "Beginner Package",
    description: "Everything you need to start as a solo courier driver",
    includes: [
      "QuickBooks Self-Employed (Accounting)",
      "Upside or Shell Fuel Rewards (Fuel savings)",
      "Progressive or Next Insurance ($300k-$500k liability)",
      "Basic dashcam ($100-150)",
      "Everlance or Stride Tax (Mileage tracking)",
      "Hand-held cooler for medical ($40-80)",
      "Roadside emergency kit"
    ],
    estimatedCost: "$400-$800 setup + $100-200/mo",
    badges: ["Beginner", "Complete Setup", "Affordable"],
    color: "green"
  },
  {
    id: "add-drivers",
    name: "Add 1-3 Drivers Bundle",
    type: "Small Fleet Package",
    description: "Scale to a small fleet with proper management tools",
    includes: [
      "Wave or QuickBooks (Multi-user accounting)",
      "WEX or AtoB Fuel Card (Fleet fuel management)",
      "$1M liability + hired/non-owned auto coverage",
      "Fleet dashcams for each vehicle",
      "Route4Me or Onfleet TMS ($30-150/mo)",
      "Driver agreements (1099 IC templates)",
      "Occupational accident insurance per driver",
      "Background check service (Checkr or similar)"
    ],
    estimatedCost: "$1,500-$3,000 setup + $300-600/mo",
    badges: ["Small Fleet", "Management Tools", "Scalable"],
    color: "blue"
  },
  {
    id: "medical-addon",
    name: "Medical Transport Add-On",
    type: "Medical Specialization",
    description: "Upgrade for medical specimen and pharmaceutical delivery",
    includes: [
      "HIPAA training certification",
      "Business Associate Agreement (BAA) templates",
      "Medical-grade coolers with gel packs",
      "Temperature logging system",
      "Spill kit (OSHA compliant)",
      "Bloodborne pathogens certification",
      "CPR/First Aid certification",
      "Cargo insurance ($25k-$100k)",
      "Medical privacy device policy"
    ],
    estimatedCost: "$500-$1,200 setup + $50-150/mo insurance",
    badges: ["Medical Premium", "HIPAA Compliant", "High Value"],
    color: "red"
  }
];

// Category definitions (organized alphabetically)
const DRIVER_CATEGORIES = [
  {
    id: "financial-institutions",
    name: "Financial Institutions",
    icon: CreditCard,
    description: "Banks and credit unions offering driver benefits",
    count: FINANCIAL_INSTITUTIONS.length,
    color: "violet"
  },
  {
    id: "financial-tools",
    name: "Financial Tools",
    icon: Calculator,
    description: "Expense tracking and tax preparation",
    count: FINANCIAL_TOOLS.length,
    color: "purple"
  },
  {
    id: "fuel-cards",
    name: "Fuel Cards",
    icon: Fuel,
    description: "Discover and track fuel card rewards",
    count: FUEL_CARDS.length,
    color: "green"
  },
  {
    id: "curated-bundles",
    name: "Curated Service Bundles",
    icon: ShoppingBag,
    description: "Complete packages: Start Solo, Add Drivers, Medical Add-On",
    count: CURATED_BUNDLES.length,
    color: "emerald"
  },
  {
    id: "equipment-tools",
    name: "Equipment & Safety Tools",
    icon: Package,
    description: "Dashcams, coolers, spill kits, roadside equipment",
    count: EQUIPMENT_TOOLS.length,
    color: "slate"
  },
  {
    id: "insurance-brokers",
    name: "Insurance & Fuel Cards",
    icon: Shield,
    description: "Commercial auto, cargo insurance, and fuel card programs",
    count: INSURANCE_BROKERS.length,
    color: "indigo"
  },
  {
    id: "job-boards",
    name: "General Job Boards",
    icon: Grid3X3,
    description: "Major employment platforms for W-2 driver positions",
    count: 21,
    color: "blue"
  },
  {
    id: "job-posting-platforms",
    name: "Gig & Delivery Platforms",
    icon: Building,
    description: "Independent contractor and gig work opportunities",
    count: 9,
    color: "cyan"
  },
  {
    id: "insurance-tax",
    name: "Insurance & Tax",
    icon: Shield,
    description: "Insurance providers and tax services",
    count: 7,
    color: "red"
  },
  {
    id: "driver-loadboards",
    name: "Load Boards & Freight",
    icon: Navigation,
    description: "Find loads, freight, and cargo opportunities for your vehicle",
    count: 14,
    color: "blue"
  },
  {
    id: "medical-insurance",
    name: "Medical Insurance and Health Care",
    icon: Heart,
    description: "Healthcare benefits and medical cost sharing memberships",
    count: 2,
    color: "rose"
  },
  {
    id: "online-resources",
    name: "Online Resources",
    icon: Grid3X3,
    description: "Useful websites and online resources for drivers",
    count: 7,
    color: "amber"
  },
  {
    id: "training-associations",
    name: "Training and Trade Associations to Join",
    icon: Users,
    description: "Professional organizations, training programs, and industry associations",
    count: 12,
    color: "teal"
  }
];

export default function DriverResources() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Notes and Login Credentials state
  const [loadBoardNotes, setLoadBoardNotes] = useState<{[key: string]: string}>({});
  const [loadBoardCredentials, setLoadBoardCredentials] = useState<{[key: string]: {username: string, password: string}}>({});
  const [associationNotes, setAssociationNotes] = useState<{[key: string]: string}>({});
  const [associationCredentials, setAssociationCredentials] = useState<{[key: string]: {username: string, password: string}}>({});
  const [isSaving, setIsSaving] = useState<{[key: string]: boolean}>({});
  const [openNotesDialog, setOpenNotesDialog] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const debounceRef = useRef<{[key: string]: NodeJS.Timeout}>({});
  
  // Benefits expansion state
  const [openBenefits, setOpenBenefits] = useState<Set<string>>(new Set());
  
  // YouTube URLs database integration
  const { data: youtubeUrlsData = [] } = useQuery({
    queryKey: ['/api/youtube-video-urls'],
  });

  // Convert array to object for easier access
  const youtubeUrls = youtubeUrlsData.reduce((acc: {[key: string]: string}, item: any) => {
    acc[item.resourceName] = item.url;
    return acc;
  }, {});

  const saveYoutubeUrlMutation = useMutation({
    mutationFn: async ({ resourceName, url }: { resourceName: string; url: string }) => {
      return apiRequest('/api/youtube-video-urls', {
        method: 'PUT',
        body: JSON.stringify({ resourceName, url }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/youtube-video-urls'] });
    },
  });
  
  // Toggle benefits expansion
  const toggleBenefits = (associationId: string) => {
    setOpenBenefits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(associationId)) {
        newSet.delete(associationId);
      } else {
        newSet.add(associationId);
      }
      return newSet;
    });
  };
  
  // YouTube URL handlers
  const handleYouTubeUrlChange = (cardId: string, url: string) => {
    // Save to database
    saveYoutubeUrlMutation.mutate({ resourceName: cardId, url });
  };
  
  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };
  
  const openYouTubeVideo = (cardId: string) => {
    const url = youtubeUrls[cardId];
    if (url && isValidYouTubeUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Fetch notes from database
  const { data: savedNotes = [] } = useQuery({
    queryKey: ["/api/job-board-notes"],
    retry: false,
  });
  
  // Convert saved notes array to object for easier access
  useEffect(() => {
    if (Array.isArray(savedNotes) && savedNotes.length > 0) {
      const notesObject = (savedNotes as any[]).reduce((acc: any, note: any) => {
        acc[note.jobBoardName] = note.notes || '';
        return acc;
      }, {});
      setLoadBoardNotes(notesObject);
    }
  }, [savedNotes]);
  
  // Mutation to save notes to database
  const saveNoteMutation = useMutation({
    mutationFn: async ({ jobBoardName, notes }: { jobBoardName: string; notes: string }) => {
      return await apiRequest("/api/job-board-notes", { method: "PUT", body: { jobBoardName, notes } });
    },
    onSuccess: (_, { jobBoardName }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-board-notes"] });
      setIsSaving(prev => ({ ...prev, [jobBoardName]: false }));
      toast({
        title: "Notes saved",
        description: `Notes for ${jobBoardName} saved to database`,
        duration: 1500,
      });
    },
    onError: (error, { jobBoardName }) => {
      setIsSaving(prev => ({ ...prev, [jobBoardName]: false }));
      console.error('Failed to save note:', error);
      toast({
        title: "Save failed",
        description: "Failed to save notes to database",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
  
  // Auto-save notes with debouncing
  const debouncedSave = useCallback((boardName: string, notes: string) => {
    if (debounceRef.current[boardName]) {
      clearTimeout(debounceRef.current[boardName]);
    }
    
    setIsSaving(prev => ({ ...prev, [boardName]: true }));
    
    debounceRef.current[boardName] = setTimeout(() => {
      saveNoteMutation.mutate({ jobBoardName: boardName, notes });
    }, 1000);
  }, [saveNoteMutation]);
  
  // Handle notes change
  const handleNotesChange = (boardName: string, value: string) => {
    setLoadBoardNotes(prev => ({ ...prev, [boardName]: value }));
    debouncedSave(boardName, value);
  };
  
  // Handle opening notes dialog
  const handleOpenNotes = (boardName: string) => {
    setCurrentNoteText(loadBoardNotes[boardName] || '');
    const credentials = loadBoardCredentials[boardName];
    setCurrentUsername(credentials?.username || '');
    setCurrentPassword(credentials?.password || '');
    setOpenNotesDialog(boardName);
  };
  
  // Handle saving notes from dialog
  const handleSaveNotes = () => {
    if (openNotesDialog) {
      handleNotesChange(openNotesDialog, currentNoteText);
      // Save credentials to local state (displayed in plain text as requested)
      setLoadBoardCredentials(prev => ({
        ...prev,
        [openNotesDialog]: {
          username: currentUsername,
          password: currentPassword
        }
      }));
      setOpenNotesDialog(null);
    }
  };
  
  // Handle closing dialog without saving
  const handleCloseNotes = () => {
    setOpenNotesDialog(null);
    setCurrentNoteText('');
    setCurrentUsername('');
    setCurrentPassword('');
  };

  // Handle opening association notes dialog
  const handleOpenAssociationNotes = (associationName: string) => {
    setCurrentNoteText(associationNotes[associationName] || '');
    const credentials = associationCredentials[associationName];
    setCurrentUsername(credentials?.username || '');
    setCurrentPassword(credentials?.password || '');
    setOpenNotesDialog(associationName);
  };

  // Handle saving association notes from dialog
  const handleSaveAssociationNotes = () => {
    if (openNotesDialog) {
      // Save notes to association state
      setAssociationNotes(prev => ({ ...prev, [openNotesDialog]: currentNoteText }));
      // Save credentials to local state (displayed in plain text as requested)
      setAssociationCredentials(prev => ({
        ...prev,
        [openNotesDialog]: {
          username: currentUsername,
          password: currentPassword
        }
      }));
      setOpenNotesDialog(null);
    }
  };

  const filteredCategories = DRIVER_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategoryData = DRIVER_CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Professional Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Driver Resources
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Professional tools and platforms for your driving business</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                data-testid="search-categories"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Category Navigation */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-120px)] sticky top-[120px]">
          <div className="p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
            <ScrollArea className="flex-1 -mx-2 px-2" data-testid="categories-scroll">
              <nav className="space-y-1 pb-4">
                {filteredCategories.map((category) => {
                const IconComponent = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <div key={category.id}>
                    {category.id === 'job-boards' ? (
                      <Link href="/job-boards">
                        <div
                          data-testid={`category-${category.id}`}
                          className={`group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                            isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <IconComponent className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                            <span>{category.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      </Link>
                    ) : category.id === 'job-posting-platforms' ? (
                      <Link href="/job-posting-platforms">
                        <div
                          data-testid={`category-${category.id}`}
                          className={`group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                            isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <IconComponent className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                            <span>{category.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      </Link>
                    ) : (
                      <div
                        data-testid={`category-${category.id}`}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                          isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                          <span>{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
              </nav>
            </ScrollArea>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6">
          {!selectedCategory ? (
            // Welcome Content
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Driver Resources</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Select a category from the sidebar to explore professional resources, tools, and platforms designed specifically for drivers and logistics professionals. Each category contains curated resources to help grow your driving business.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4" data-testid="stat-job-boards">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">21</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Job Boards</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4" data-testid="stat-fuel-cards">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">21</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fuel Cards</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4" data-testid="stat-load-boards">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">14</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Load Boards</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4" data-testid="stat-gig-platforms">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">9</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Gig Platforms</div>
                </div>
              </div>
            </div>
          ) : (
            // Selected Category Detail View
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center space-x-2"
                  data-testid="back-to-overview"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Overview</span>
                </Button>
                
                {selectedCategoryData && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <selectedCategoryData.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCategoryData.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{selectedCategoryData.description}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Category-specific content */}
              {selectedCategory === "fuel-cards" && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Fuel Cards & Savings</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Maximize fuel savings with cashback apps, loyalty programs, and fuel cards
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {FUEL_CARDS.map((fuelCard) => (
                      <Card 
                        key={fuelCard.id}
                        data-testid={`fuel-card-${fuelCard.id}`}
                        className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-green-100 to-green-200">
                                <Fuel className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {fuelCard.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="text-xs text-white bg-green-600 border-0">
                                    {fuelCard.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Cashback Amount */}
                          <div className="bg-green-50 rounded-lg p-3 mb-4">
                            <div className="text-sm font-semibold text-green-900 mb-1">Savings</div>
                            <div className="text-lg font-bold text-green-700">{fuelCard.cashback}</div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Top Action Bar */}
                          <div className="space-y-2">
                            {/* Compact YouTube Educational Video */}
                            <div className="bg-green-50 dark:bg-green-900/20 rounded p-2 border border-green-200 dark:border-green-800">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openYouTubeVideo(`fuel-${fuelCard.id}`)}
                                  disabled={!youtubeUrls[`fuel-${fuelCard.id}`] || !isValidYouTubeUrl(youtubeUrls[`fuel-${fuelCard.id}`])}
                                  className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                    youtubeUrls[`fuel-${fuelCard.id}`] && isValidYouTubeUrl(youtubeUrls[`fuel-${fuelCard.id}`]) 
                                      ? 'bg-green-600 hover:bg-green-700 cursor-pointer' 
                                      : 'bg-green-400 cursor-not-allowed'
                                  }`}
                                  data-testid={`youtube-play-fuel-${fuelCard.id}`}
                                >
                                  <span className="text-white text-xs">▶</span>
                                </button>
                                <Input
                                  value={youtubeUrls[`fuel-${fuelCard.id}`] || ''}
                                  onChange={(e) => handleYouTubeUrlChange(`fuel-${fuelCard.id}`, e.target.value)}
                                  placeholder="Add YouTube educational video link..."
                                  className="text-xs bg-white dark:bg-gray-800 border-green-300 dark:border-green-700 focus:border-green-500 dark:focus:border-green-400 h-7"
                                  data-testid={`youtube-input-fuel-${fuelCard.id}`}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open(fuelCard.website, '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-fuel-${fuelCard.id}`}
                              >
                                <span className="truncate">Visit Website</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`fuel-${fuelCard.id}`)}
                                data-testid={`button-benefits-fuel-${fuelCard.id}`}
                                aria-expanded={openBenefits.has(`fuel-${fuelCard.id}`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`fuel-${fuelCard.id}`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                            {fuelCard.description}
                          </p>

                          {/* Features */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {fuelCard.badges.map((badge, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-gray-50 border-gray-200">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Benefits Section */}
                          {openBenefits.has(`fuel-${fuelCard.id}`) && (
                            <div 
                              className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500 transition-all duration-300"
                              data-testid={`benefits-content-fuel-${fuelCard.id}`}
                            >
                              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">How this helps drivers save money</h4>
                              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200 mb-4">
                                {fuelCard.features.map((feature, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Quick steps to get value</h4>
                              <ol className="space-y-1 text-sm text-green-800 dark:text-green-200">
                                <li>1. Sign up for the {fuelCard.name} program to start earning rewards</li>
                                <li>2. Download their mobile app for easy tracking and location finding</li>
                                <li>3. Use the card/app consistently at participating locations to maximize savings</li>
                                <li>4. Monitor your rewards balance and redeem earnings regularly</li>
                              </ol>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Financial Tools Section */}
              {selectedCategory === "financial-tools" && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Financial Tools</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Expense tracking, tax preparation, and accounting tools for drivers
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {FINANCIAL_TOOLS.map((tool) => (
                      <Card 
                        key={tool.id}
                        data-testid={`financial-tool-${tool.id}`}
                        className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200">
                                <Calculator className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {tool.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="text-xs text-white bg-purple-600 border-0">
                                    {tool.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Top Action Bar */}
                          <div className="space-y-2">
                            {/* Compact YouTube Educational Video */}
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2 border border-purple-200 dark:border-purple-800">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openYouTubeVideo(`financial-${tool.id}`)}
                                  disabled={!youtubeUrls[`financial-${tool.id}`] || !isValidYouTubeUrl(youtubeUrls[`financial-${tool.id}`])}
                                  className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                    youtubeUrls[`financial-${tool.id}`] && isValidYouTubeUrl(youtubeUrls[`financial-${tool.id}`]) 
                                      ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer' 
                                      : 'bg-purple-400 cursor-not-allowed'
                                  }`}
                                  data-testid={`youtube-play-financial-${tool.id}`}
                                >
                                  <span className="text-white text-xs">▶</span>
                                </button>
                                <Input
                                  value={youtubeUrls[`financial-${tool.id}`] || ''}
                                  onChange={(e) => handleYouTubeUrlChange(`financial-${tool.id}`, e.target.value)}
                                  placeholder="Add YouTube educational video link..."
                                  className="text-xs bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 h-7"
                                  data-testid={`youtube-input-financial-${tool.id}`}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open(tool.website, '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-financial-${tool.id}`}
                              >
                                <span className="truncate">Visit Website</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`financial-${tool.id}`)}
                                data-testid={`button-benefits-financial-${tool.id}`}
                                aria-expanded={openBenefits.has(`financial-${tool.id}`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`financial-${tool.id}`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                            {tool.description}
                          </p>

                          {/* Features */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {tool.badges.map((badge, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-gray-50 border-gray-200">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Benefits Section */}
                          {openBenefits.has(`financial-${tool.id}`) && (
                            <div 
                              className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500 transition-all duration-300"
                              data-testid={`benefits-content-financial-${tool.id}`}
                            >
                              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">How this helps drivers manage finances</h4>
                              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200 mb-4">
                                {tool.features.map((feature, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Quick steps to get value</h4>
                              <ol className="space-y-1 text-sm text-purple-800 dark:text-purple-200">
                                <li>1. Sign up for a free {tool.name} account to start tracking your business expenses</li>
                                <li>2. Connect your bank accounts and credit cards for automatic expense importing</li>
                                <li>3. Set up expense categories specific to your driving business needs</li>
                                <li>4. Use the mobile app to capture receipts and track mileage on the go</li>
                              </ol>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Institutions Section */}
              {selectedCategory === "financial-institutions" && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Financial Institutions</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Banks and credit unions offering driver-specific benefits and services
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {FINANCIAL_INSTITUTIONS.map((institution) => (
                      <Card 
                        key={institution.id}
                        data-testid={`financial-institution-${institution.id}`}
                        className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-violet-100 to-violet-200">
                                <CreditCard className="w-5 h-5 text-violet-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {institution.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="text-xs text-white bg-violet-600 border-0">
                                    {institution.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Top Action Bar */}
                          <div className="space-y-2">
                            {/* Compact YouTube Educational Video */}
                            <div className="bg-violet-50 dark:bg-violet-900/20 rounded p-2 border border-violet-200 dark:border-violet-800">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openYouTubeVideo(`institution-${institution.id}`)}
                                  disabled={!youtubeUrls[`institution-${institution.id}`] || !isValidYouTubeUrl(youtubeUrls[`institution-${institution.id}`])}
                                  className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                    youtubeUrls[`institution-${institution.id}`] && isValidYouTubeUrl(youtubeUrls[`institution-${institution.id}`]) 
                                      ? 'bg-violet-600 hover:bg-violet-700 cursor-pointer' 
                                      : 'bg-violet-400 cursor-not-allowed'
                                  }`}
                                  data-testid={`youtube-play-institution-${institution.id}`}
                                >
                                  <span className="text-white text-xs">▶</span>
                                </button>
                                <Input
                                  value={youtubeUrls[`institution-${institution.id}`] || ''}
                                  onChange={(e) => handleYouTubeUrlChange(`institution-${institution.id}`, e.target.value)}
                                  placeholder="Add YouTube educational video link..."
                                  className="text-xs bg-white dark:bg-gray-800 border-violet-300 dark:border-violet-700 focus:border-violet-500 dark:focus:border-violet-400 h-7"
                                  data-testid={`youtube-input-institution-${institution.id}`}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open(institution.website, '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-institution-${institution.id}`}
                              >
                                <span className="truncate">Visit Website</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-violet-200 hover:bg-violet-50 hover:border-violet-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`institution-${institution.id}`)}
                                data-testid={`button-benefits-institution-${institution.id}`}
                                aria-expanded={openBenefits.has(`institution-${institution.id}`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`institution-${institution.id}`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                            {institution.description}
                          </p>

                          {/* Features */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {institution.badges.map((badge, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-gray-50 border-gray-200">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Benefits Section */}
                          {openBenefits.has(`institution-${institution.id}`) && (
                            <div 
                              className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border-l-4 border-violet-500 transition-all duration-300"
                              data-testid={`benefits-content-institution-${institution.id}`}
                            >
                              <h4 className="font-semibold text-violet-900 dark:text-violet-100 mb-3">How this helps drivers with banking</h4>
                              <ul className="space-y-2 text-sm text-violet-800 dark:text-violet-200 mb-4">
                                {institution.features.map((feature, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <h4 className="font-semibold text-violet-900 dark:text-violet-100 mb-2">Quick steps to get value</h4>
                              <ol className="space-y-1 text-sm text-violet-800 dark:text-violet-200">
                                <li>1. Research membership requirements and benefits specific to drivers</li>
                                <li>2. Apply for membership online or visit a local branch</li>
                                <li>3. Open a business checking account for your driving operations</li>
                                <li>4. Explore vehicle financing options and competitive loan rates</li>
                              </ol>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Insurance Brokers Section */}
              {selectedCategory === "insurance-brokers" && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Insurance & Fuel Cards</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Commercial auto, cargo insurance, and fuel card programs for courier drivers
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {INSURANCE_BROKERS.map((broker) => (
                      <Card 
                        key={broker.id}
                        data-testid={`insurance-broker-${broker.id}`}
                        className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200">
                                <Shield className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {broker.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="text-xs text-white bg-indigo-600 border-0">
                                    {broker.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Coverage/Features Highlight */}
                          {(broker.coverage || broker.features) && (
                            <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                              <div className="text-sm font-semibold text-indigo-900 mb-1">
                                {broker.coverage ? "Coverage" : "Features"}
                              </div>
                              <div className="text-xs text-indigo-700 space-y-1">
                                {(broker.coverage || broker.features)?.slice(0, 2).map((item, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Top Action Bar */}
                          <div className="space-y-2">
                            {/* Compact YouTube Educational Video */}
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded p-2 border border-indigo-200 dark:border-indigo-800">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openYouTubeVideo(`insurance-${broker.id}`)}
                                  disabled={!youtubeUrls[`insurance-${broker.id}`] || !isValidYouTubeUrl(youtubeUrls[`insurance-${broker.id}`])}
                                  className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                    youtubeUrls[`insurance-${broker.id}`] && isValidYouTubeUrl(youtubeUrls[`insurance-${broker.id}`]) 
                                      ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer' 
                                      : 'bg-indigo-400 cursor-not-allowed'
                                  }`}
                                  data-testid={`youtube-play-insurance-${broker.id}`}
                                >
                                  <span className="text-white text-xs">▶</span>
                                </button>
                                <Input
                                  value={youtubeUrls[`insurance-${broker.id}`] || ''}
                                  onChange={(e) => handleYouTubeUrlChange(`insurance-${broker.id}`, e.target.value)}
                                  placeholder="Add YouTube educational video link..."
                                  className="text-xs bg-white dark:bg-gray-800 border-indigo-300 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 h-7"
                                  data-testid={`youtube-input-insurance-${broker.id}`}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open(broker.website, '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-insurance-${broker.id}`}
                              >
                                <span className="truncate">Visit Website</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`insurance-${broker.id}`)}
                                data-testid={`button-benefits-insurance-${broker.id}`}
                                aria-expanded={openBenefits.has(`insurance-${broker.id}`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`insurance-${broker.id}`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                            {broker.description}
                          </p>

                          {/* Features */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {broker.badges.map((badge, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-gray-50 border-gray-200">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Benefits Section */}
                          {openBenefits.has(`insurance-${broker.id}`) && (
                            <div 
                              className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-500 transition-all duration-300"
                              data-testid={`benefits-content-insurance-${broker.id}`}
                            >
                              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
                                {broker.coverage ? "Coverage details" : "How this helps drivers"}
                              </h4>
                              <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200 mb-4">
                                {(broker.coverage || broker.features)?.map((item, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Quick steps to get value</h4>
                              <ol className="space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                                <li>1. Get a quote online or by phone to compare coverage options</li>
                                <li>2. Review coverage limits and ensure they meet your business needs</li>
                                <li>3. Ask about discounts for multiple vehicles or good driving records</li>
                                <li>4. Keep proof of insurance in your vehicle at all times</li>
                              </ol>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment & Tools Section */}
              {selectedCategory === "equipment-tools" && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Equipment & Safety Tools</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Essential equipment: dashcams, coolers, spill kits, and roadside tools for professional drivers
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {EQUIPMENT_TOOLS.map((equipment) => (
                      <Card 
                        key={equipment.id}
                        data-testid={`equipment-${equipment.id}`}
                        className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200">
                                <Package className="w-5 h-5 text-slate-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {equipment.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="text-xs text-white bg-slate-600 border-0">
                                    {equipment.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price Range */}
                          <div className="bg-slate-50 rounded-lg p-3 mb-4">
                            <div className="text-sm font-semibold text-slate-900 mb-1">Price Range</div>
                            <div className="text-lg font-bold text-slate-700">{equipment.price}</div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Top Action Bar */}
                          <div className="space-y-2">
                            {/* Compact YouTube Educational Video */}
                            <div className="bg-slate-50 dark:bg-slate-900/20 rounded p-2 border border-slate-200 dark:border-slate-800">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openYouTubeVideo(`equipment-${equipment.id}`)}
                                  disabled={!youtubeUrls[`equipment-${equipment.id}`] || !isValidYouTubeUrl(youtubeUrls[`equipment-${equipment.id}`])}
                                  className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                    youtubeUrls[`equipment-${equipment.id}`] && isValidYouTubeUrl(youtubeUrls[`equipment-${equipment.id}`]) 
                                      ? 'bg-slate-600 hover:bg-slate-700 cursor-pointer' 
                                      : 'bg-slate-400 cursor-not-allowed'
                                  }`}
                                  data-testid={`youtube-play-equipment-${equipment.id}`}
                                >
                                  <span className="text-white text-xs">▶</span>
                                </button>
                                <Input
                                  value={youtubeUrls[`equipment-${equipment.id}`] || ''}
                                  onChange={(e) => handleYouTubeUrlChange(`equipment-${equipment.id}`, e.target.value)}
                                  placeholder="Add YouTube educational video link..."
                                  className="text-xs bg-white dark:bg-gray-800 border-slate-300 dark:border-slate-700 focus:border-slate-500 dark:focus:border-slate-400 h-7"
                                  data-testid={`youtube-input-equipment-${equipment.id}`}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open(equipment.website, '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-equipment-${equipment.id}`}
                              >
                                <span className="truncate">Shop Now</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`equipment-${equipment.id}`)}
                                data-testid={`button-benefits-equipment-${equipment.id}`}
                                aria-expanded={openBenefits.has(`equipment-${equipment.id}`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`equipment-${equipment.id}`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                            {equipment.description}
                          </p>

                          {/* Features */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {equipment.badges.map((badge, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-gray-50 border-gray-200">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Benefits Section */}
                          {openBenefits.has(`equipment-${equipment.id}`) && (
                            <div 
                              className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg border-l-4 border-slate-500 transition-all duration-300"
                              data-testid={`benefits-content-equipment-${equipment.id}`}
                            >
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Why drivers need this equipment</h4>
                              <ul className="space-y-2 text-sm text-slate-800 dark:text-slate-200 mb-4">
                                {equipment.features.map((feature, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 flex-shrink-0"></div>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Quick steps to get value</h4>
                              <ol className="space-y-1 text-sm text-slate-800 dark:text-slate-200">
                                <li>1. Research product reviews and ratings before purchasing</li>
                                <li>2. Compare prices across multiple retailers for best value</li>
                                <li>3. Follow installation instructions carefully or seek professional help</li>
                                <li>4. Test equipment regularly to ensure proper functionality</li>
                              </ol>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Curated Bundles Section */}
              {selectedCategory === "curated-bundles" && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Curated Service Bundles</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Complete packages for starting solo, adding drivers, or specializing in medical transport
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {CURATED_BUNDLES.map((bundle) => (
                      <Card 
                        key={bundle.id}
                        data-testid={`bundle-${bundle.id}`}
                        className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-100 to-emerald-200">
                                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {bundle.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="text-xs text-white bg-emerald-600 border-0">
                                    {bundle.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Estimated Cost */}
                          <div className="bg-emerald-50 rounded-lg p-3 mb-4">
                            <div className="text-sm font-semibold text-emerald-900 mb-1">Estimated Cost</div>
                            <div className="text-sm font-bold text-emerald-700">{bundle.estimatedCost}</div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Top Action Bar */}
                          <div className="space-y-2">
                            {/* Compact YouTube Educational Video */}
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded p-2 border border-emerald-200 dark:border-emerald-800">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openYouTubeVideo(`bundle-${bundle.id}`)}
                                  disabled={!youtubeUrls[`bundle-${bundle.id}`] || !isValidYouTubeUrl(youtubeUrls[`bundle-${bundle.id}`])}
                                  className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                    youtubeUrls[`bundle-${bundle.id}`] && isValidYouTubeUrl(youtubeUrls[`bundle-${bundle.id}`]) 
                                      ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer' 
                                      : 'bg-emerald-400 cursor-not-allowed'
                                  }`}
                                  data-testid={`youtube-play-bundle-${bundle.id}`}
                                >
                                  <span className="text-white text-xs">▶</span>
                                </button>
                                <Input
                                  value={youtubeUrls[`bundle-${bundle.id}`] || ''}
                                  onChange={(e) => handleYouTubeUrlChange(`bundle-${bundle.id}`, e.target.value)}
                                  placeholder="Add YouTube educational video link..."
                                  className="text-xs bg-white dark:bg-gray-800 border-emerald-300 dark:border-emerald-700 focus:border-emerald-500 dark:focus:border-emerald-400 h-7"
                                  data-testid={`youtube-input-bundle-${bundle.id}`}
                                />
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                variant="outline"
                                className="flex-1 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`bundle-${bundle.id}`)}
                                data-testid={`button-benefits-bundle-${bundle.id}`}
                                aria-expanded={openBenefits.has(`bundle-${bundle.id}`)}
                              >
                                <span className="truncate">View Bundle Details</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`bundle-${bundle.id}`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                            {bundle.description}
                          </p>

                          {/* Features */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {bundle.badges.map((badge, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-gray-50 border-gray-200">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Bundle Includes - Always Visible */}
                          <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">What's Included</h4>
                            <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
                              {bundle.includes.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Benefits Section */}
                          {openBenefits.has(`bundle-${bundle.id}`) && (
                            <div 
                              className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500 transition-all duration-300"
                              data-testid={`benefits-content-bundle-${bundle.id}`}
                            >
                              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">Why choose this bundle</h4>
                              <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200 mb-4">
                                <li className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                  Complete solution with all essential tools and services
                                </li>
                                <li className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                  Cost-effective compared to purchasing items separately
                                </li>
                                <li className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                  Curated by industry experts for maximum efficiency
                                </li>
                                <li className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                  Everything you need to get started or scale professionally
                                </li>
                              </ul>
                              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Quick steps to implement</h4>
                              <ol className="space-y-1 text-sm text-emerald-800 dark:text-emerald-200">
                                <li>1. Review the complete list of included services and tools</li>
                                <li>2. Sign up for each service using the links in this resource guide</li>
                                <li>3. Set up accounts and configure settings for your business needs</li>
                                <li>4. Keep track of all login credentials and renewal dates in one place</li>
                              </ol>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Load Boards & Freight Section */}
              {selectedCategory === "driver-loadboards" && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Load Boards & Freight</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Find loads, freight, and cargo opportunities for your vehicle
                    </p>
                  </div>
                  
                  {/* Load Board Platforms Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* DAT Load Board */}
                    <Card 
                      data-testid="load-board-dat"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Navigation className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                DAT Load Board
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-blue-600 border-0">
                                  Premium Platform
                                </Badge>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50">
                                  <span>★</span>
                                  <span>4.6</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>1M+ loads</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US/Canada</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo(`loadboard-dat`)}
                                disabled={!youtubeUrls[`loadboard-dat`] || !isValidYouTubeUrl(youtubeUrls[`loadboard-dat`])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls[`loadboard-dat`] && isValidYouTubeUrl(youtubeUrls[`loadboard-dat`]) 
                                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                                    : 'bg-blue-400 cursor-not-allowed'
                                }`}
                                data-testid={`youtube-play-loadboard-dat`}
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls[`loadboard-dat`] || ''}
                                onChange={(e) => handleYouTubeUrlChange(`loadboard-dat`, e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 h-7"
                                data-testid={`youtube-input-loadboard-dat`}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open('https://www.dat.com', '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-loadboard-dat`}
                              >
                                <span className="truncate">Browse Loads</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`loadboard-dat`)}
                                data-testid={`button-benefits-loadboard-dat`}
                                aria-expanded={openBenefits.has(`loadboard-dat`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`loadboard-dat`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                            
                            <Dialog open={openNotesDialog === "DAT Load Board"} onOpenChange={(open) => !open && handleCloseNotes()}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="w-full px-3 py-2 relative text-xs h-8"
                                  onClick={() => handleOpenNotes("DAT Load Board")}
                                >
                                  <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">Notes and Login Credentials</span>
                                  {loadBoardNotes["DAT Load Board"] && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Notes for DAT Load Board
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                    <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                      🔐 Login Credentials for DAT Load Board
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Username</label>
                                        <Input
                                          placeholder="Enter your username"
                                          value={currentUsername}
                                          onChange={(e) => setCurrentUsername(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Password</label>
                                        <Input
                                          placeholder="Enter your password"
                                          value={currentPassword}
                                          onChange={(e) => setCurrentPassword(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">📝 Personal Notes</h4>
                                    <Textarea
                                      placeholder="Add your notes, application status, contacts, or any other relevant information..."
                                      value={currentNoteText}
                                      onChange={(e) => setCurrentNoteText(e.target.value)}
                                      className="min-h-[120px] resize-none"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button variant="outline" onClick={handleCloseNotes}>Cancel</Button>
                                    <Button onClick={handleSaveNotes}>Save Notes</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Leading load board with over 1 million loads posted daily. Trusted by carriers and brokers nationwide.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Premium Loads
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Market Analytics
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Verified Brokers
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has(`loadboard-dat`) && (
                          <div 
                            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-all duration-300"
                            data-testid={`benefits-content-loadboard-dat`}
                          >
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How this helps drivers find loads</h4>
                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access to over 1 million loads posted daily from verified brokers
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Market analytics and rate trends to maximize your earnings
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Credit scores and payment history for brokers to avoid bad payers
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Mobile app for finding loads on the go
                              </li>
                            </ul>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                              <li>1. Sign up for a DAT membership and complete your carrier profile</li>
                              <li>2. Set up load preferences and search filters for your preferred routes</li>
                              <li>3. Use the mobile app to search for loads while on the road</li>
                              <li>4. Check broker credit scores before accepting loads to ensure timely payment</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Truckstop.com */}
                    <Card 
                      data-testid="load-board-truckstop"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Navigation className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                Truckstop.com
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-purple-600 border-0">
                                  Popular Choice
                                </Badge>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
                                  <span>★</span>
                                  <span>4.4</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>800K+ loads</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Nationwide</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo(`loadboard-truckstop`)}
                                disabled={!youtubeUrls[`loadboard-truckstop`] || !isValidYouTubeUrl(youtubeUrls[`loadboard-truckstop`])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls[`loadboard-truckstop`] && isValidYouTubeUrl(youtubeUrls[`loadboard-truckstop`]) 
                                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                                    : 'bg-blue-400 cursor-not-allowed'
                                }`}
                                data-testid={`youtube-play-loadboard-truckstop`}
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls[`loadboard-truckstop`] || ''}
                                onChange={(e) => handleYouTubeUrlChange(`loadboard-truckstop`, e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 h-7"
                                data-testid={`youtube-input-loadboard-truckstop`}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open('https://www.truckstop.com', '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-loadboard-truckstop`}
                              >
                                <span className="truncate">Browse Loads</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`loadboard-truckstop`)}
                                data-testid={`button-benefits-loadboard-truckstop`}
                                aria-expanded={openBenefits.has(`loadboard-truckstop`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`loadboard-truckstop`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                            
                            <Dialog open={openNotesDialog === "Truckstop.com"} onOpenChange={(open) => !open && handleCloseNotes()}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="w-full px-3 py-2 relative text-xs h-8"
                                  onClick={() => handleOpenNotes("Truckstop.com")}
                                >
                                  <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">Notes and Login Credentials</span>
                                  {loadBoardNotes["Truckstop.com"] && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Notes for Truckstop.com
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                    <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                      🔐 Login Credentials for Truckstop.com
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Username</label>
                                        <Input
                                          placeholder="Enter your username"
                                          value={currentUsername}
                                          onChange={(e) => setCurrentUsername(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Password</label>
                                        <Input
                                          placeholder="Enter your password"
                                          value={currentPassword}
                                          onChange={(e) => setCurrentPassword(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">📝 Personal Notes</h4>
                                    <Textarea
                                      placeholder="Add your notes, application status, contacts, or any other relevant information..."
                                      value={currentNoteText}
                                      onChange={(e) => setCurrentNoteText(e.target.value)}
                                      className="min-h-[120px] resize-none"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button variant="outline" onClick={handleCloseNotes}>Cancel</Button>
                                    <Button onClick={handleSaveNotes}>Save Notes</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Comprehensive platform for loads, trucks, and fuel optimization with integrated solutions.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Fuel Network
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Truck Services
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Mobile App
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has(`loadboard-truckstop`) && (
                          <div 
                            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-all duration-300"
                            data-testid={`benefits-content-loadboard-truckstop`}
                          >
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How this helps drivers find loads</h4>
                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access to 800K+ loads with comprehensive search and filtering options
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Integrated fuel network and truck services for complete trip planning
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Mobile app allows you to book loads and manage trips on the go
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                One-stop solution for loads, fuel, maintenance, and route optimization
                              </li>
                            </ul>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                              <li>1. Create a carrier profile and verify your authority and insurance</li>
                              <li>2. Set up load alerts for your preferred lanes and equipment type</li>
                              <li>3. Use their mobile app to search and book loads while on the road</li>
                              <li>4. Take advantage of their fuel network and maintenance services for cost savings</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* 123Loadboard */}
                    <Card 
                      data-testid="load-board-123"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Navigation className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                123Loadboard
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-green-600 border-0">
                                  Free Trial
                                </Badge>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
                                  <span>★</span>
                                  <span>4.2</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>200K+ loads</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo(`loadboard-123`)}
                                disabled={!youtubeUrls[`loadboard-123`] || !isValidYouTubeUrl(youtubeUrls[`loadboard-123`])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls[`loadboard-123`] && isValidYouTubeUrl(youtubeUrls[`loadboard-123`]) 
                                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                                    : 'bg-blue-400 cursor-not-allowed'
                                }`}
                                data-testid={`youtube-play-loadboard-123`}
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls[`loadboard-123`] || ''}
                                onChange={(e) => handleYouTubeUrlChange(`loadboard-123`, e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 h-7"
                                data-testid={`youtube-input-loadboard-123`}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open('https://www.123loadboard.com', '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-loadboard-123`}
                              >
                                <span className="truncate">Browse Loads</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`loadboard-123`)}
                                data-testid={`button-benefits-loadboard-123`}
                                aria-expanded={openBenefits.has(`loadboard-123`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`loadboard-123`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                            
                            <Dialog open={openNotesDialog === "123Loadboard"} onOpenChange={(open) => !open && handleCloseNotes()}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="w-full px-3 py-2 relative text-xs h-8"
                                  onClick={() => handleOpenNotes("123Loadboard")}
                                >
                                  <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">Notes and Login Credentials</span>
                                  {loadBoardNotes["123Loadboard"] && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Notes for 123Loadboard
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                    <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                      🔐 Login Credentials for 123Loadboard
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Username</label>
                                        <Input
                                          placeholder="Enter your username"
                                          value={currentUsername}
                                          onChange={(e) => setCurrentUsername(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Password</label>
                                        <Input
                                          placeholder="Enter your password"
                                          value={currentPassword}
                                          onChange={(e) => setCurrentPassword(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">📝 Personal Notes</h4>
                                    <Textarea
                                      placeholder="Add your notes, application status, contacts, or any other relevant information..."
                                      value={currentNoteText}
                                      onChange={(e) => setCurrentNoteText(e.target.value)}
                                      className="min-h-[120px] resize-none"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button variant="outline" onClick={handleCloseNotes}>Cancel</Button>
                                    <Button onClick={handleSaveNotes}>Save Notes</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Easy-to-use load board with competitive rates and straightforward interface for quick load matching.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Easy Matching
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Fair Rates
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Quick Setup
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has(`loadboard-123`) && (
                          <div 
                            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-all duration-300"
                            data-testid={`benefits-content-loadboard-123`}
                          >
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How this helps drivers find loads</h4>
                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Simple interface makes it easy to search and match loads quickly
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Competitive rates and fair pricing for all load types
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Quick setup process gets you searching for loads within minutes
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Over 200K loads available with nationwide coverage
                              </li>
                            </ul>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                              <li>1. Sign up for a free trial to test the platform's features</li>
                              <li>2. Set up your carrier profile with equipment type and service areas</li>
                              <li>3. Use the straightforward search filters to find loads in your area</li>
                              <li>4. Contact brokers directly through the platform to secure loads</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Sylectus */}
                    <Card 
                      data-testid="load-board-sylectus"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Navigation className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                Sylectus
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-red-600 border-0">
                                  Expedited Network
                                </Badge>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50">
                                  <span>★</span>
                                  <span>4.5</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>100K+ loads</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US/Canada</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo(`loadboard-sylectus`)}
                                disabled={!youtubeUrls[`loadboard-sylectus`] || !isValidYouTubeUrl(youtubeUrls[`loadboard-sylectus`])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls[`loadboard-sylectus`] && isValidYouTubeUrl(youtubeUrls[`loadboard-sylectus`]) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid={`youtube-play-loadboard-sylectus`}
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls[`loadboard-sylectus`] || ''}
                                onChange={(e) => handleYouTubeUrlChange(`loadboard-sylectus`, e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid={`youtube-input-loadboard-sylectus`}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open('https://www.sylectus.com', '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-loadboard-sylectus`}
                              >
                                <span className="truncate">Browse Loads</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`loadboard-sylectus`)}
                                data-testid={`button-benefits-loadboard-sylectus`}
                                aria-expanded={openBenefits.has(`loadboard-sylectus`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`loadboard-sylectus`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                            
                            <Dialog open={openNotesDialog === "Sylectus"} onOpenChange={(open) => !open && handleCloseNotes()}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="w-full px-3 py-2 relative text-xs h-8"
                                  onClick={() => handleOpenNotes("Sylectus")}
                                >
                                  <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">Notes and Login Credentials</span>
                                  {loadBoardNotes["Sylectus"] && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Notes for Sylectus
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                    <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                      🔐 Login Credentials for Sylectus
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Username</label>
                                        <Input
                                          placeholder="Enter your username"
                                          value={currentUsername}
                                          onChange={(e) => setCurrentUsername(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Password</label>
                                        <Input
                                          placeholder="Enter your password"
                                          value={currentPassword}
                                          onChange={(e) => setCurrentPassword(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">📝 Personal Notes</h4>
                                    <Textarea
                                      placeholder="Add your notes, application status, contacts, or any other relevant information..."
                                      value={currentNoteText}
                                      onChange={(e) => setCurrentNoteText(e.target.value)}
                                      className="min-h-[120px] resize-none"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button variant="outline" onClick={handleCloseNotes}>Cancel</Button>
                                    <Button onClick={handleSaveNotes}>Save Notes</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Expedited and time-sensitive freight network specializing in urgent deliveries and premium rates.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Expedited
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Premium Rates
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Time Critical
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has(`loadboard-sylectus`) && (
                          <div 
                            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-all duration-300"
                            data-testid={`benefits-content-loadboard-sylectus`}
                          >
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How this helps drivers find loads</h4>
                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access to expedited freight network with premium paying time-critical loads
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Higher rates for urgent deliveries and specialized expedited services
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Network covers US and Canada with 24/7 load availability
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Ideal for carriers with expedited capabilities and fast response times
                              </li>
                            </ul>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                              <li>1. Apply to join the Sylectus expedited freight network</li>
                              <li>2. Get approved based on your equipment and service capability</li>
                              <li>3. Access the load board for time-critical and premium freight</li>
                              <li>4. Build relationships with expedited brokers for consistent work</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* LoadUp */}
                    <Card 
                      data-testid="load-board-loadup"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Navigation className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                LoadUp
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-orange-600 border-0">
                                  Non-CDL Friendly
                                </Badge>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-50">
                                  <span>★</span>
                                  <span>4.0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>50K+ jobs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo(`loadboard-loadup`)}
                                disabled={!youtubeUrls[`loadboard-loadup`] || !isValidYouTubeUrl(youtubeUrls[`loadboard-loadup`])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls[`loadboard-loadup`] && isValidYouTubeUrl(youtubeUrls[`loadboard-loadup`]) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid={`youtube-play-loadboard-loadup`}
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls[`loadboard-loadup`] || ''}
                                onChange={(e) => handleYouTubeUrlChange(`loadboard-loadup`, e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid={`youtube-input-loadboard-loadup`}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open('https://www.getloadup.com', '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-loadboard-loadup`}
                              >
                                <span className="truncate">Browse Loads</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`loadboard-loadup`)}
                                data-testid={`button-benefits-loadboard-loadup`}
                                aria-expanded={openBenefits.has(`loadboard-loadup`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`loadboard-loadup`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                            
                            <Dialog open={openNotesDialog === "LoadUp"} onOpenChange={(open) => !open && handleCloseNotes()}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="w-full px-3 py-2 relative text-xs h-8"
                                  onClick={() => handleOpenNotes("LoadUp")}
                                >
                                  <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">Notes and Login Credentials</span>
                                  {loadBoardNotes["LoadUp"] && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Notes for LoadUp
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                    <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                      🔐 Login Credentials for LoadUp
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Username</label>
                                        <Input
                                          placeholder="Enter your username"
                                          value={currentUsername}
                                          onChange={(e) => setCurrentUsername(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Password</label>
                                        <Input
                                          placeholder="Enter your password"
                                          value={currentPassword}
                                          onChange={(e) => setCurrentPassword(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">📝 Personal Notes</h4>
                                    <Textarea
                                      placeholder="Add your notes, application status, contacts, or any other relevant information..."
                                      value={currentNoteText}
                                      onChange={(e) => setCurrentNoteText(e.target.value)}
                                      className="min-h-[120px] resize-none"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button variant="outline" onClick={handleCloseNotes}>Cancel</Button>
                                    <Button onClick={handleSaveNotes}>Save Notes</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Furniture and appliance removal/delivery services for pickup trucks and cargo vans.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Furniture
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Pickup Truck
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              No CDL
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has(`loadboard-loadup`) && (
                          <div 
                            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-all duration-300"
                            data-testid={`benefits-content-loadboard-loadup`}
                          >
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How this helps drivers find loads</h4>
                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Perfect for drivers with pickup trucks, cargo vans, and non-CDL vehicles
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Furniture and appliance delivery jobs with competitive pay
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Over 50K+ jobs available across the United States
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                No CDL requirement makes it accessible to more drivers
                              </li>
                            </ul>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                              <li>1. Sign up and complete your driver profile with vehicle information</li>
                              <li>2. Search for furniture and appliance delivery jobs in your area</li>
                              <li>3. Accept jobs that fit your schedule and vehicle capabilities</li>
                              <li>4. Complete deliveries and build your rating for better opportunities</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* GetLoaded */}
                    <Card 
                      data-testid="load-board-getloaded"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Navigation className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                GetLoaded
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-cyan-600 border-0">
                                  Owner Operator
                                </Badge>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
                                  <span>★</span>
                                  <span>4.1</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>75K+ loads</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo(`loadboard-getloaded`)}
                                disabled={!youtubeUrls[`loadboard-getloaded`] || !isValidYouTubeUrl(youtubeUrls[`loadboard-getloaded`])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls[`loadboard-getloaded`] && isValidYouTubeUrl(youtubeUrls[`loadboard-getloaded`]) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid={`youtube-play-loadboard-getloaded`}
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls[`loadboard-getloaded`] || ''}
                                onChange={(e) => handleYouTubeUrlChange(`loadboard-getloaded`, e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid={`youtube-input-loadboard-getloaded`}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => window.open('https://www.getloaded.com', '_blank', 'noopener,noreferrer')}
                                data-testid={`button-visit-loadboard-getloaded`}
                              >
                                <span className="truncate">Browse Loads</span>
                                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                                onClick={() => toggleBenefits(`loadboard-getloaded`)}
                                data-testid={`button-benefits-loadboard-getloaded`}
                                aria-expanded={openBenefits.has(`loadboard-getloaded`)}
                              >
                                <span className="truncate">Benefits</span>
                                <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has(`loadboard-getloaded`) ? 'rotate-180' : ''}`} />
                              </Button>
                            </div>
                            
                            <Dialog open={openNotesDialog === "GetLoaded"} onOpenChange={(open) => !open && handleCloseNotes()}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="w-full px-3 py-2 relative text-xs h-8"
                                  onClick={() => handleOpenNotes("GetLoaded")}
                                >
                                  <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">Notes and Login Credentials</span>
                                  {loadBoardNotes["GetLoaded"] && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Notes for GetLoaded
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                    <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                      🔐 Login Credentials for GetLoaded
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Username</label>
                                        <Input
                                          placeholder="Enter your username"
                                          value={currentUsername}
                                          onChange={(e) => setCurrentUsername(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-700">Password</label>
                                        <Input
                                          placeholder="Enter your password"
                                          value={currentPassword}
                                          onChange={(e) => setCurrentPassword(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">📝 Personal Notes</h4>
                                    <Textarea
                                      placeholder="Add your notes, application status, contacts, or any other relevant information..."
                                      value={currentNoteText}
                                      onChange={(e) => setCurrentNoteText(e.target.value)}
                                      className="min-h-[120px] resize-none"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button variant="outline" onClick={handleCloseNotes}>Cancel</Button>
                                    <Button onClick={handleSaveNotes}>Save Notes</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Load matching service designed specifically for owner-operators with personalized load recommendations.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Smart Matching
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Owner-Op Focus
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              Load Analytics
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has(`loadboard-getloaded`) && (
                          <div 
                            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-all duration-300"
                            data-testid={`benefits-content-loadboard-getloaded`}
                          >
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How this helps drivers find loads</h4>
                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Smart load matching algorithm designed specifically for owner-operators
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Personalized load recommendations based on your route preferences
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Load analytics and insights to help you make better business decisions
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Over 75K loads available with focus on owner-operator needs
                              </li>
                            </ul>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                              <li>1. Set up your owner-operator profile with equipment and preferences</li>
                              <li>2. Configure your preferred routes and load types</li>
                              <li>3. Use the smart matching features to find optimized load opportunities</li>
                              <li>4. Leverage load analytics to improve your business performance</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Training and Trade Associations Section */}
              {selectedCategory === "training-associations" && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Training and Trade Associations to Join</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Professional organizations, training programs, and industry associations for career development
                    </p>
                  </div>
                  
                  {/* Training Associations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* CLDA - Courier and Logistics Delivery Association */}
                    <Card 
                      data-testid="association-clda"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-green-100 to-green-200">
                              <Award className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                CLDA (Courier & Logistics Delivery)
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-green-600 border-0">
                                  Professional Network
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>2,500+ members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US/International</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo('clda')}
                                disabled={!youtubeUrls['clda'] || !isValidYouTubeUrl(youtubeUrls['clda'])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls['clda'] && isValidYouTubeUrl(youtubeUrls['clda']) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid="youtube-play-clda"
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls['clda'] || ''}
                                onChange={(e) => handleYouTubeUrlChange('clda', e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-clda"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://www.clda.org', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-clda"
                            >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('clda')}
                              data-testid="button-benefits-clda"
                              aria-expanded={openBenefits.has('clda')}
                            >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('clda') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'CLDA'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('CLDA')}
                                data-testid="button-notes-clda"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['CLDA'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for CLDA (Courier & Logistics Delivery)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for CLDA
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Premier courier and logistics association providing access to national contracts, delivery partnerships, and exclusive job boards.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🌐 National Contracts
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              💼 Exclusive Job Boards
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🤝 Delivery Partners
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('clda') && (
                          <div 
                            className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500 transition-all duration-300"
                            data-testid="benefits-content-clda"
                          >
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access to national contracts and better rates from major shippers
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                Exclusive job boards with premium delivery opportunities
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                Network to find delivery partners nationwide for route optimization
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                Mentorship from top industry professionals and successful operators
                              </li>
                            </ul>
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-green-800 dark:text-green-200">
                              <li>1. Join CLDA to access member-only job boards and contract opportunities</li>
                              <li>2. Use their network to find delivery partners in your target markets</li>
                              <li>3. Apply for contracts worth $50,000-$100,000/year through their platform</li>
                              <li>4. Connect with mentors and attend networking events for business growth</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* ECA - Express Carriers Association */}
                    <Card 
                      data-testid="association-eca"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200">
                              <Award className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                ECA (Express Carriers Association)
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-blue-600 border-0">
                                  Carrier Network
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>3,200+ carriers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>State-specific</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo('eca')}
                                disabled={!youtubeUrls['eca'] || !isValidYouTubeUrl(youtubeUrls['eca'])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls['eca'] && isValidYouTubeUrl(youtubeUrls['eca']) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid="youtube-play-eca"
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls['eca'] || ''}
                                onChange={(e) => handleYouTubeUrlChange('eca', e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-eca"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://www.expresscarriers.com', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-eca"
                            >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('eca')}
                              data-testid="button-benefits-eca"
                              aria-expanded={openBenefits.has('eca')}
                            >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('eca') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'ECA'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('ECA')}
                                data-testid="button-notes-eca"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['ECA'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for ECA (Express Carriers Association)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for ECA
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Comprehensive directory of carriers and shippers organized by state for targeted contract opportunities and partnerships.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🗺️ State Directory
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🚚 Carrier Database
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              📊 Shipper Insights
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('eca') && (
                          <div 
                            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-all duration-300"
                            data-testid="benefits-content-eca"
                          >
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                View carriers and shippers in specific states for targeted opportunities
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access regional contract opportunities and local partnerships
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Research market rates and competitive positioning by region
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Connect with carriers for potential subcontracting relationships
                              </li>
                            </ul>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                              <li>1. Search ECA database by state to find carriers and shippers in your area</li>
                              <li>2. Research local market rates and identify high-paying opportunities</li>
                              <li>3. Reach out to carriers for subcontracting or partnership opportunities</li>
                              <li>4. Use their insights to target the most profitable contracts in your region</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* A4D - Advertising for Drivers */}
                    <Card 
                      data-testid="association-a4d"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200">
                              <Award className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                A4D (Advertising for Drivers)
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-purple-600 border-0">
                                  Marketing Platform
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>10+ contractors per zip</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Zip code targeted</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo('a4d')}
                                disabled={!youtubeUrls['a4d'] || !isValidYouTubeUrl(youtubeUrls['a4d'])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls['a4d'] && isValidYouTubeUrl(youtubeUrls['a4d']) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid="youtube-play-a4d"
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls['a4d'] || ''}
                                onChange={(e) => handleYouTubeUrlChange('a4d', e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-a4d"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://www.advertising4drivers.com', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-a4d"
                            >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('a4d')}
                              data-testid="button-benefits-a4d"
                              aria-expanded={openBenefits.has('a4d')}
                            >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('a4d') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'A4D'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('A4D')}
                                data-testid="button-notes-a4d"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['A4D'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for A4D (Alliance for Driver Development)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for A4D
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Marketing and business expansion platform for drivers to create targeted ads and connect with contracting companies.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              📢 Targeted Ads
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              💰 Load Chief Integration
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🎯 Zip Code Targeting
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('a4d') && (
                          <div 
                            className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500 transition-all duration-300"
                            data-testid="benefits-content-a4d"
                          >
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                Create targeted ads to solicit work from registered contracting companies
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access Load Chief for next-day payments and multiple job acceptance
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                Market your business by placing signs on vehicles and strategic locations
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                Connect with 10+ registered contracting companies in specific zip codes
                              </li>
                            </ul>
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-purple-800 dark:text-purple-200">
                              <li>1. Create targeted ads for your specific zip code to reach local contractors</li>
                              <li>2. Set up Load Chief integration for fast payments and job management</li>
                              <li>3. Design and place vehicle signage to market your services while driving</li>
                              <li>4. Use their platform to systematically reach all contractors in your area</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* American Trucking Associations */}
                    <Card 
                      data-testid="association-ata"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Award className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                American Trucking Associations
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-blue-600 border-0">
                                  National Organization
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>50,000+ members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>National</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">▶</span>
                              </div>
                              <Input
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-ata"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105 h-8 text-sm"
                              onClick={() => window.open('https://www.trucking.org', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-ata"
                            >
                              <span>Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm"
                              onClick={() => toggleBenefits('ata')}
                              data-testid="button-benefits-ata"
                              aria-expanded={openBenefits.has('ata')}
                            >
                              <span>Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-2 transition-transform ${openBenefits.has('ata') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'ATA'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('ATA')}
                                data-testid="button-notes-ata"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['ATA'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for ATA (American Trucking Associations)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for ATA
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          The premier advocacy organization for the trucking industry, offering training, certification programs, and professional development.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🏆 Certification Programs
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              📚 Training Resources
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🤝 Networking Events
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('ata') && (
                          <div 
                            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-all duration-300"
                            data-testid="benefits-content-ata"
                          >
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access to industry training programs and certifications that enhance your professional credentials
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Stay updated on industry regulations and best practices through their resources and publications
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                Network with industry professionals and potential business partners at events and conferences
                              </li>
                            </ul>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                              <li>1. Visit their website and explore certification programs</li>
                              <li>2. Sign up for their newsletter and industry updates</li>
                              <li>3. Attend local chapter meetings and networking events</li>
                              <li>4. Complete relevant training courses to boost your qualifications</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Owner-Operator Independent Drivers Association */}
                    <Card 
                      data-testid="association-ooida"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Award className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                OOIDA (Owner-Operators)
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-green-600 border-0">
                                  Owner-Operators
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>160,000+ members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US/Canada</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo('ooida')}
                                disabled={!youtubeUrls['ooida'] || !isValidYouTubeUrl(youtubeUrls['ooida'])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls['ooida'] && isValidYouTubeUrl(youtubeUrls['ooida']) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid="youtube-play-ooida"
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls['ooida'] || ''}
                                onChange={(e) => handleYouTubeUrlChange('ooida', e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-ooida"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://www.ooida.com', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-ooida"
                            >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('ooida')}
                              data-testid="button-benefits-ooida"
                              aria-expanded={openBenefits.has('ooida')}
                            >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('ooida') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'OOIDA'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('OOIDA')}
                                data-testid="button-notes-ooida"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['OOIDA'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for OOIDA (Owner-Operator Independent Drivers)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for OOIDA
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Advocacy and support organization specifically for owner-operators and independent drivers with business resources and legal support.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              ⚖️ Legal Support
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              💼 Business Resources
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              📞 24/7 Hotline
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('ooida') && (
                          <div 
                            className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500 transition-all duration-300"
                            data-testid="benefits-content-ooida"
                          >
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                Powerful advocacy organization specifically fighting for owner-operator rights
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                Legal support and business resources tailored for independent contractors
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                24/7 hotline for emergency assistance and compliance questions
                              </li>
                            </ul>
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-green-800 dark:text-green-200">
                              <li>1. Join as a member to access legal support and advocacy</li>
                              <li>2. Use their 24/7 hotline for urgent business and compliance questions</li>
                              <li>3. Download their business guides and compliance resources</li>
                              <li>4. Stay updated on their advocacy efforts affecting owner-operators</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Women in Trucking Association */}
                    <Card 
                      data-testid="association-wita"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Award className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                Women in Trucking Association
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-purple-600 border-0">
                                  Diversity & Inclusion
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>8,000+ members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>International</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">▶</span>
                              </div>
                              <Input
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-wita"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://www.womenintrucking.org', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-wita"
                            >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('wita')}
                              data-testid="button-benefits-wita"
                              aria-expanded={openBenefits.has('wita')}
                            >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('wita') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'WITA'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('WITA')}
                                data-testid="button-notes-wita"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['WITA'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for WITA (Women In Trucking Association)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for WITA
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Dedicated to promoting women in the trucking industry through mentorship, networking, and professional development programs.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              👩‍🏫 Mentorship
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🎓 Scholarships
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🌐 Networking
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('wita') && (
                          <div 
                            className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500 transition-all duration-300"
                            data-testid="benefits-content-wita"
                          >
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access mentorship programs connecting you with experienced female drivers
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                Scholarship opportunities for professional development and training
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                Strong networking community for support and business opportunities
                              </li>
                            </ul>
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-purple-800 dark:text-purple-200">
                              <li>1. Join their online community and local chapters for networking</li>
                              <li>2. Apply for scholarships and professional development opportunities</li>
                              <li>3. Connect with a mentor through their mentorship program</li>
                              <li>4. Attend their annual conference and regional events</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* National Association of Small Trucking Companies */}
                    <Card 
                      data-testid="association-nastc"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Award className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                NASTC (Small Trucking)
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-orange-600 border-0">
                                  Small Business
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>3,000+ members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo('nastc')}
                                disabled={!youtubeUrls['nastc'] || !isValidYouTubeUrl(youtubeUrls['nastc'])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls['nastc'] && isValidYouTubeUrl(youtubeUrls['nastc']) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid="youtube-play-nastc"
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls['nastc'] || ''}
                                onChange={(e) => handleYouTubeUrlChange('nastc', e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-nastc"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://www.nastc.com', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-nastc"
                            >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('nastc')}
                              data-testid="button-benefits-nastc"
                              aria-expanded={openBenefits.has('nastc')}
                            >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('nastc') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'NASTC'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('NASTC')}
                                data-testid="button-notes-nastc"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['NASTC'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for NASTC (National Association of Small Trucking Companies)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for NASTC
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Represents and advocates for small trucking companies and independent operators, providing resources for business growth and compliance.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              📈 Business Growth
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              📋 Compliance Help
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🗣️ Industry Advocacy
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('nastc') && (
                          <div 
                            className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500 transition-all duration-300"
                            data-testid="benefits-content-nastc"
                          >
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                Resources specifically designed for small trucking operations and solo drivers
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                Industry advocacy focused on small business and independent contractor issues
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                Business growth resources and compliance assistance for expanding operations
                              </li>
                            </ul>
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-orange-800 dark:text-orange-200">
                              <li>1. Join as a member to access small business resources and advocacy</li>
                              <li>2. Use their compliance guides tailored for small operations</li>
                              <li>3. Attend their events to network with other small trucking businesses</li>
                              <li>4. Access their business growth resources if you plan to expand</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Professional Truck Driver Institute */}
                    <Card 
                      data-testid="association-ptdi"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                              <Award className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                Professional Truck Driver Institute
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-cyan-600 border-0">
                                  Training & Education
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>500+ schools</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>National</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo('ptdi')}
                                disabled={!youtubeUrls['ptdi'] || !isValidYouTubeUrl(youtubeUrls['ptdi'])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls['ptdi'] && isValidYouTubeUrl(youtubeUrls['ptdi']) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid="youtube-play-ptdi"
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls['ptdi'] || ''}
                                onChange={(e) => handleYouTubeUrlChange('ptdi', e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-ptdi"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://www.ptdi.org', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-ptdi"
                            >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('ptdi')}
                              data-testid="button-benefits-ptdi"
                              aria-expanded={openBenefits.has('ptdi')}
                          >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('ptdi') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'PTDI'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('PTDI')}
                                data-testid="button-notes-ptdi"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['PTDI'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for PTDI (Professional Truck Driver Institute)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for PTDI
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Sets standards for truck driver training and certification, ensuring quality education and professional development in the industry.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🎓 Certification Standards
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🏫 School Accreditation
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              📜 Professional Standards
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('ptdi') && (
                          <div 
                            className="mt-4 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border-l-4 border-cyan-500 transition-all duration-300"
                            data-testid="benefits-content-ptdi"
                          >
                            <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-cyan-800 dark:text-cyan-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                                Understand what makes quality driver training programs
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                                Stay current on professional development standards
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                                Find accredited schools for additional certifications
                              </li>
                            </ul>
                            <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-cyan-800 dark:text-cyan-200">
                              <li>1. Review their certification standards for professional development</li>
                              <li>2. Use their directory to find accredited training schools</li>
                              <li>3. Stay updated on industry training standards and requirements</li>
                              <li>4. Consider additional certifications to enhance your qualifications</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* National Association of Independent Truckers */}
                    <Card 
                      data-testid="association-nait"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-100 to-emerald-200">
                              <Award className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                NAIT (Independent Truckers)
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-emerald-600 border-0">
                                  Independent Drivers
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>25,000+ members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo('nait')}
                                disabled={!youtubeUrls['nait'] || !isValidYouTubeUrl(youtubeUrls['nait'])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls['nait'] && isValidYouTubeUrl(youtubeUrls['nait']) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid="youtube-play-nait"
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls['nait'] || ''}
                                onChange={(e) => handleYouTubeUrlChange('nait', e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-nait"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://www.naittrucking.org', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-nait"
                          >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('nait')}
                              data-testid="button-benefits-nait"
                              aria-expanded={openBenefits.has('nait')}
                            >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('nait') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'NAIT'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('NAIT')}
                                data-testid="button-notes-nait"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['NAIT'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for NAIT (National Association of Independent Truckers)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for NAIT
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Advocacy organization specifically for independent truckers with business resources, legal support, and industry representation.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              💼 Business Support
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              ⚖️ Legal Assistance
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🏛️ Industry Advocacy
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('nait') && (
                          <div 
                            className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500 transition-all duration-300"
                            data-testid="benefits-content-nait"
                          >
                            <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access group insurance rates that are often lower than individual coverage
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                Legal support and advocacy specifically for independent contractor issues
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                Business resources and compliance guides tailored for solo operators
                              </li>
                            </ul>
                            <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-emerald-800 dark:text-emerald-200">
                              <li>1. Join as a member to access group insurance rates</li>
                              <li>2. Download their compliance guides and business templates</li>
                              <li>3. Use their legal hotline for contractor-specific questions</li>
                              <li>4. Take advantage of partner discounts on business services</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* International Brotherhood of Teamsters */}
                    <Card 
                      data-testid="association-teamsters"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-red-100 to-red-200">
                              <Award className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                International Brotherhood of Teamsters
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-red-600 border-0">
                                  Labor Union
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>1.4M+ members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US/Canada</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo('teamsters')}
                                disabled={!youtubeUrls['teamsters'] || !isValidYouTubeUrl(youtubeUrls['teamsters'])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls['teamsters'] && isValidYouTubeUrl(youtubeUrls['teamsters']) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid="youtube-play-teamsters"
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls['teamsters'] || ''}
                                onChange={(e) => handleYouTubeUrlChange('teamsters', e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-teamsters"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://teamster.org', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-teamsters"
                            >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('teamsters')}
                              data-testid="button-benefits-teamsters"
                              aria-expanded={openBenefits.has('teamsters')}
                            >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('teamsters') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'Teamsters'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('Teamsters')}
                                data-testid="button-notes-teamsters"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['Teamsters'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for Teamsters (International Brotherhood of Teamsters)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for Teamsters
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Major transportation union providing training resources, safety advocacy, and local mentorship opportunities for drivers.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🎓 Training Programs
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🛡️ Safety Advocacy
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              👥 Local Networks
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('teamsters') && (
                          <div 
                            className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border-l-4 border-teal-500 transition-all duration-300"
                            data-testid="benefits-content-teamsters"
                          >
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-teal-800 dark:text-teal-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access comprehensive training resources and safety programs
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                                Stay informed on industry advocacy and regulatory changes
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                                Connect with local chapters for mentorship and networking
                              </li>
                            </ul>
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-red-800 dark:text-red-200">
                              <li>1. Find your local Teamsters chapter for networking opportunities</li>
                              <li>2. Access their free safety training materials and resources</li>
                              <li>3. Stay updated on their advocacy work affecting driver regulations</li>
                              <li>4. Attend local meetings to connect with experienced drivers</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Commercial Vehicle Safety Alliance */}
                    <Card 
                      data-testid="association-cvsa"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-amber-100 to-amber-200">
                              <Award className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                CVSA (Commercial Vehicle Safety)
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-amber-600 border-0">
                                  Safety Alliance
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>All jurisdictions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>North America</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo('cvsa')}
                                disabled={!youtubeUrls['cvsa'] || !isValidYouTubeUrl(youtubeUrls['cvsa'])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls['cvsa'] && isValidYouTubeUrl(youtubeUrls['cvsa']) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid="youtube-play-cvsa"
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls['cvsa'] || ''}
                                onChange={(e) => handleYouTubeUrlChange('cvsa', e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-cvsa"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://www.cvsa.org', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-cvsa"
                            >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('cvsa')}
                              data-testid="button-benefits-cvsa"
                              aria-expanded={openBenefits.has('cvsa')}
                            >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('cvsa') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'CVSA'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('CVSA')}
                                data-testid="button-notes-cvsa"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['CVSA'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for CVSA (Commercial Vehicle Safety Alliance)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for CVSA
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Alliance focused on commercial vehicle safety with inspection training, regulations updates, and safety resources.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🔍 Inspection Prep
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              📋 OOSC Handbook
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🌐 Safety Webinars
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('cvsa') && (
                          <div 
                            className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 transition-all duration-300"
                            data-testid="benefits-content-cvsa"
                          >
                            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                Master inspection procedures to avoid violations and downtime
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                Stay current on safety regulations and compliance requirements
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access training webinars and safety best practices
                              </li>
                            </ul>
                            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
                              <li>1. Download the Out-of-Service Criteria handbook</li>
                              <li>2. Align your pre-trip inspection checklist with CVSA standards</li>
                              <li>3. Attend their safety webinars and training sessions</li>
                              <li>4. Use their resources to prepare for Roadcheck inspections</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Truckload Carriers Association */}
                    <Card 
                      data-testid="association-tca"
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200">
                              <Award className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                TCA (Truckload Carriers)
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs text-white bg-indigo-600 border-0">
                                  Industry Association
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>800+ companies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>US</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Top Action Bar */}
                        <div className="space-y-2">
                          {/* Compact YouTube Educational Video */}
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 border border-teal-200 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openYouTubeVideo('tca')}
                                disabled={!youtubeUrls['tca'] || !isValidYouTubeUrl(youtubeUrls['tca'])}
                                className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  youtubeUrls['tca'] && isValidYouTubeUrl(youtubeUrls['tca']) 
                                    ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer' 
                                    : 'bg-teal-400 cursor-not-allowed'
                                }`}
                                data-testid="youtube-play-tca"
                              >
                                <span className="text-white text-xs">▶</span>
                              </button>
                              <Input
                                value={youtubeUrls['tca'] || ''}
                                onChange={(e) => handleYouTubeUrlChange('tca', e.target.value)}
                                placeholder="Add YouTube educational video link..."
                                className="text-xs bg-white dark:bg-gray-800 border-teal-300 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 h-7"
                                data-testid="youtube-input-tca"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => window.open('https://www.truckload.org', '_blank', 'noopener,noreferrer')}
                              data-testid="button-visit-tca"
                            >
                              <span className="truncate">Visit Website</span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-8 text-sm min-w-0"
                              onClick={() => toggleBenefits('tca')}
                              data-testid="button-benefits-tca"
                              aria-expanded={openBenefits.has('tca')}
                            >
                              <span className="truncate">Benefits</span>
                              <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${openBenefits.has('tca') ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>

                          {/* Notes and Login Credentials Button */}
                          <Dialog open={openNotesDialog === 'TCA'} onOpenChange={(open) => !open && handleCloseNotes()}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full px-3 py-2 relative text-xs"
                                onClick={() => handleOpenAssociationNotes('TCA')}
                                data-testid="button-notes-tca"
                              >
                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Notes and Login Credentials</span>
                                {associationNotes['TCA'] && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Notes for TCA (Truckload Carriers Association)
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {/* Login Credentials Section */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    🔐 Login Credentials for TCA
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Username
                                      </label>
                                      <Input
                                        placeholder="Enter your username"
                                        value={currentUsername}
                                        onChange={(e) => setCurrentUsername(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-blue-700">
                                        Password
                                      </label>
                                      <Input
                                        placeholder="Enter your password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="bg-white border-blue-200 focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    📝 Personal Notes
                                  </h4>
                                  <Textarea
                                    placeholder="Add your notes, membership details, contacts, or any other relevant information..."
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button 
                                    variant="outline" 
                                    onClick={handleCloseNotes}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleSaveAssociationNotes}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          Premier truckload industry association with excellent training programs, networking events, and industry best practices.
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🎓 Education Programs
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              📊 Benchmarking
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              🤝 Networking Events
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits Section */}
                        {openBenefits.has('tca') && (
                          <div 
                            className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-500 transition-all duration-300"
                            data-testid="benefits-content-tca"
                          >
                            <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3">How this helps independent drivers</h4>
                            <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200 mb-4">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                                Access high-quality training programs and certifications
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                                Benchmark your performance against industry best practices
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                                Network with industry leaders and potential business partners
                              </li>
                            </ul>
                            <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Quick steps to get value</h4>
                            <ol className="space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                              <li>1. Join as an associate member to access educational resources</li>
                              <li>2. Complete their professional development courses</li>
                              <li>3. Attend TCA conventions and regional meetings for networking</li>
                              <li>4. Use their best practice toolkits to improve operations</li>
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                  </div>
                </div>
              )}

              {/* Default content for other categories */}
              {selectedCategory && !["fuel-cards", "financial-tools", "financial-institutions", "driver-loadboards", "training-associations"].includes(selectedCategory) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {selectedCategoryData?.name} Resources
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {selectedCategoryData?.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    This category contains {selectedCategoryData?.count} resources. Content is being updated.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}