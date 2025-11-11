import {
  Package,
  Utensils,
  Truck,
  Baby,
  Briefcase,
  ShoppingBag,
  FileText,
  Plane,
  Car,
  Stethoscope,
  Building,
  Scale,
  Heart,
  Home,
  Wrench,
  Shirt,
  FlaskConical,
  Leaf,
  Scissors,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface SearchCriteriaConfig {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  cardColor: string;
  textColor: string;
  title: string;
  stats: {
    count: number;
    label: string;
    color: string;
  }[];
  searchTerms: string[];
  requirements: {
    title: string;
    items: string[];
  };
  insights: {
    title: string;
    items: { title: string; description: string }[];
  };
  tips: {
    title: string;
    items: string[];
  };
}

export const searchCriteriaConfigs: Record<string, SearchCriteriaConfig> = {
  package: {
    id: "package",
    icon: Package,
    iconColor: "text-blue-600",
    cardColor: "border-blue-200 bg-blue-50",
    textColor: "text-blue-700",
    title: "Package Delivery Companies",
    stats: [
      { count: 93, label: "Package Companies", color: "text-blue-600" },
      { count: 20, label: "Recently Added", color: "text-green-600" },
      { count: 100, label: "No-CDL Required", color: "text-purple-600" },
    ],
    searchTerms: [
      "Package delivery services",
      "Last mile delivery companies",
      "Same day package delivery",
      "E-commerce delivery partners",
      "Small package courier services",
      "Express delivery companies",
      "Local courier services",
      "B2B package delivery",
      "Residential package delivery",
      "On-demand package pickup",
      "Package courier driver jobs",
      "Independent package delivery contractors",
      "Overnight delivery services",
      "Regional package delivery companies",
      "Amazon delivery service partners",
      "White-glove delivery services",
      "Business package logistics",
      "Medical supply courier",
      "Document courier services",
      "Priority package delivery",
    ],
    requirements: {
      title: "Common Requirements",
      items: [
        "Valid driver's license",
        "Clean driving record",
        "Smartphone for app-based routing",
        "Background check clearance",
        "Reliable personal vehicle",
        "Physical ability to lift packages",
      ],
    },
    insights: {
      title: "Industry Insights",
      items: [
        {
          title: "High Demand Growth",
          description: "E-commerce boom continues to drive last-mile delivery demand",
        },
        {
          title: "Flexible Scheduling",
          description: "Most package delivery jobs offer part-time and flexible hours",
        },
      ],
    },
    tips: {
      title: "Application Tips",
      items: [
        "Highlight any customer service experience on your application",
        "Emphasize your reliability and time management skills",
        "Mention familiarity with GPS and routing apps",
        "Be ready to provide proof of insurance for your vehicle",
      ],
    },
  },

  food: {
    id: "food",
    icon: Utensils,
    iconColor: "text-orange-600",
    cardColor: "border-orange-200 bg-orange-50",
    textColor: "text-orange-700",
    title: "Food Delivery Companies",
    stats: [
      { count: 57, label: "Food Companies", color: "text-orange-600" },
      { count: 15, label: "Recently Added", color: "text-green-600" },
      { count: 100, label: "No-CDL Required", color: "text-blue-600" },
    ],
    searchTerms: [
      "Food delivery services",
      "Restaurant delivery drivers",
      "Meal delivery courier jobs",
      "Ghost kitchen delivery partners",
      "Third-party food delivery",
      "Catering delivery services",
      "Grocery delivery drivers",
      "Alcohol delivery services",
      "Fresh meal delivery companies",
      "Hot food courier services",
      "Local restaurant delivery jobs",
      "Food logistics independent contractor",
      "Temperature-controlled food delivery",
      "Corporate meal delivery services",
      "B2B food delivery companies",
      "On-demand food courier",
      "Cloud kitchen delivery partners",
      "Prepared meal delivery services",
      "Fast food delivery drivers",
      "App-based food delivery jobs",
    ],
    requirements: {
      title: "Common Requirements",
      items: [
        "Valid driver's license",
        "Clean driving record",
        "Insulated food delivery bag",
        "Smartphone with GPS capability",
        "Food handler's permit (some companies)",
        "Background check clearance",
      ],
    },
    insights: {
      title: "Industry Insights",
      items: [
        {
          title: "Peak Hours Matter",
          description: "Lunch (11am-2pm) and dinner (5pm-9pm) offer highest earning potential",
        },
        {
          title: "Multi-App Strategy",
          description: "Many drivers work for multiple platforms to maximize orders and income",
        },
      ],
    },
    tips: {
      title: "Application Tips",
      items: [
        "Get approved on multiple platforms for consistent work",
        "Invest in quality insulated bags to keep food fresh",
        "Maintain high customer ratings for priority access to orders",
        "Consider bicycle or scooter delivery in dense urban areas",
      ],
    },
  },

  medical: {
    id: "medical",
    icon: Stethoscope,
    iconColor: "text-red-600",
    cardColor: "border-red-200 bg-red-50",
    textColor: "text-red-700",
    title: "Medical Delivery Companies",
    stats: [
      { count: 42, label: "Medical Companies", color: "text-red-600" },
      { count: 12, label: "Recently Added", color: "text-green-600" },
      { count: 100, label: "No-CDL Required", color: "text-purple-600" },
    ],
    searchTerms: [
      "Medical courier services",
      "Prescription delivery drivers",
      "Lab specimen transport",
      "Medical equipment delivery",
      "HIPAA-compliant courier jobs",
      "Pharmacy delivery services",
      "Medical records courier",
      "Blood sample transport",
      "Medical supply delivery",
      "Healthcare logistics driver",
      "Urgent medical deliveries",
      "Hospital courier services",
      "Clinical specimen transport",
      "Pharmaceutical delivery jobs",
      "Medical document courier",
      "Diagnostic sample delivery",
      "Temperature-controlled medical transport",
      "Same-day prescription delivery",
      "Medical device courier",
      "Home health supply delivery",
    ],
    requirements: {
      title: "Common Requirements",
      items: [
        "Valid driver's license",
        "Clean background check",
        "HIPAA compliance certification (provided)",
        "Reliable vehicle with climate control",
        "Smartphone for secure tracking",
        "Professional appearance required",
      ],
    },
    insights: {
      title: "Industry Insights",
      items: [
        {
          title: "Regulatory Compliance",
          description: "Medical couriers must follow strict HIPAA privacy and safety protocols",
        },
        {
          title: "Stable Demand",
          description: "Healthcare courier services maintain consistent demand year-round",
        },
      ],
    },
    tips: {
      title: "Application Tips",
      items: [
        "Highlight any healthcare or medical office experience",
        "Emphasize attention to detail and reliability",
        "Be prepared for background checks and drug testing",
        "Consider obtaining OSHA Bloodborne Pathogens certification",
      ],
    },
  },

  freight: {
    id: "freight",
    icon: Truck,
    iconColor: "text-indigo-600",
    cardColor: "border-indigo-200 bg-indigo-50",
    textColor: "text-indigo-700",
    title: "Freight Delivery Companies",
    stats: [
      { count: 68, label: "Freight Companies", color: "text-indigo-600" },
      { count: 18, label: "Recently Added", color: "text-green-600" },
      { count: 85, label: "No-CDL Required", color: "text-purple-600" },
    ],
    searchTerms: [
      "Freight delivery services",
      "LTL carrier jobs",
      "Cargo van delivery",
      "Box truck delivery driver",
      "Freight logistics courier",
      "Small freight hauling",
      "Expedited freight delivery",
      "Regional freight driver",
      "Final mile freight",
      "Business freight delivery",
      "Non-CDL freight jobs",
      "Straight truck delivery",
      "Dock-to-dock delivery",
      "Pallet delivery services",
      "White glove freight",
      "Time-critical freight",
      "Dedicated freight routes",
      "Freight distribution driver",
      "Cross-dock delivery",
      "Intermodal freight delivery",
    ],
    requirements: {
      title: "Common Requirements",
      items: [
        "Valid driver's license",
        "Clean driving record (MVR)",
        "Box truck or cargo van",
        "Lifting ability (50-75 lbs)",
        "DOT physical (for some positions)",
        "Background check",
      ],
    },
    insights: {
      title: "Industry Insights",
      items: [
        {
          title: "Vehicle Requirements",
          description: "Most non-CDL freight jobs require 16-26 foot box trucks or cargo vans",
        },
        {
          title: "Earning Potential",
          description: "Freight delivery often pays higher rates than standard package delivery",
        },
      ],
    },
    tips: {
      title: "Application Tips",
      items: [
        "Mention any experience with large vehicles or equipment",
        "Highlight physical fitness and lifting capability",
        "Consider getting DOT medical certification even if not required",
        "Network with local freight terminals and distribution centers",
      ],
    },
  },

  // Add remaining 16 configs following the same pattern...
  // (child-transport, luggage-delivery, ecommerce, document-delivery, vehicle-transport,
  // pet-transport, logistics, rideshare, construction, air-transport, retail, laboratory,
  // cannabis-delivery, business, legal, senior-services, industrial, personal, auto-parts)
};
