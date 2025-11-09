import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Search, 
  TrendingDown, 
  Shield, 
  Fuel, 
  Car, 
  Wrench, 
  Building,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  Globe,
  BarChart3,
  Clock
} from "lucide-react";

const savingsCategories = [
  {
    title: "Auto Insurance",
    icon: Shield,
    description: "Compare rates from 50+ providers based on your driving record, vehicle type, and location",
    gradient: "from-green-500 to-emerald-600",
    potentialSavings: "$800-2,400/year",
    features: ["Multi-policy discounts", "Usage-based rates", "Commercial coverage"]
  },
  {
    title: "Fuel Cards & Gas Stations",
    icon: Fuel,
    description: "Find the cheapest gas stations on your routes and best fuel card rewards programs",
    gradient: "from-blue-500 to-cyan-600", 
    potentialSavings: "$600-1,800/year",
    features: ["Real-time gas prices", "Route optimization", "Fleet discounts"]
  },
  {
    title: "Vehicle Purchases",
    icon: Car,
    description: "Get the best deals on vehicles perfect for gig work with financing options",
    gradient: "from-purple-500 to-indigo-600",
    potentialSavings: "$2,000-8,000",
    features: ["Market price analysis", "Financing comparison", "Trade-in values"]
  },
  {
    title: "Car Accessories & Parts",
    icon: Wrench,
    description: "Find discounted accessories, maintenance parts, and gig-specific equipment",
    gradient: "from-orange-500 to-red-600",
    potentialSavings: "$300-1,200/year", 
    features: ["Bulk pricing", "Professional discounts", "Quality ratings"]
  },
  {
    title: "Gig Opportunities",
    icon: Building,
    description: "Compare your current gigs against better-paying opportunities in your area",
    gradient: "from-teal-500 to-green-600",
    potentialSavings: "$3,000-12,000/year",
    features: ["Earnings comparison", "Time efficiency", "Market demand"]
  }
];

const aiFeatures = [
  {
    title: "Smart Data Collection",
    icon: Brain,
    description: "Our AI analyzes your driving patterns, expenses, and earnings to create a personalized savings profile"
  },
  {
    title: "Internet Scraping",
    icon: Search,
    description: "Continuously scans thousands of websites for deals, discounts, and opportunities specific to your needs"
  },
  {
    title: "Predictive Analytics",
    icon: BarChart3,
    description: "Forecasts market trends and price changes to help you make savings decisions at the optimal time"
  },
  {
    title: "Real-Time Monitoring",
    icon: Clock,
    description: "24/7 monitoring of prices and opportunities with instant alerts when savings become available"
  }
];

const howItWorks = [
  {
    step: 1,
    title: "Data Collection",
    description: "We securely gather your gig work data, vehicle information, and spending patterns",
    icon: Target
  },
  {
    step: 2,
    title: "AI Analysis", 
    description: "Our AI processes your data to identify spending patterns and savings opportunities",
    icon: Brain
  },
  {
    step: 3,
    title: "Market Scanning",
    description: "We scrape the internet for deals, comparing prices across thousands of providers",
    icon: Globe
  },
  {
    step: 4,
    title: "Personalized Recommendations",
    description: "You receive tailored savings recommendations with estimated dollar amounts",
    icon: DollarSign
  }
];

export default function AISavings() {
  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
          <Brain className="text-white text-3xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Money For You</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our AI-powered platform analyzes your data and scans the internet to find personalized savings opportunities 
          across insurance, fuel, vehicles, accessories, and better gig opportunities.
        </p>
        <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-green-600">
          <DollarSign className="text-3xl" />
          <span>Average Savings: $6,700-25,400/year</span>
        </div>
      </div>

      {/* How It Works */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
            <Zap className="text-blue-600" />
            <span>How Our AI Finds You Money</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    {index < howItWorks.length - 1 && (
                      <ArrowRight className="text-blue-400 hidden lg:block" />
                    )}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h3 className="font-bold text-gray-800">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">AI-Powered Intelligence</CardTitle>
          <p className="text-gray-600 text-center">Advanced technology working 24/7 to maximize your savings</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Savings Categories */} 
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Where We Find Your Savings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingsCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${category.gradient}`}></div>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-lg flex items-center justify-center`}>
                      <Icon className="text-white text-xl" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <Badge variant="secondary" className="text-green-700 bg-green-100">
                        Save {category.potentialSavings}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{category.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Key Features:</h4>
                    <ul className="space-y-1">
                      {category.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="text-green-500 w-4 h-4" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Privacy & Security */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
            <Shield className="text-green-600" />
            <span>Your Data Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700 max-w-3xl mx-auto">
            We use enterprise-grade encryption and never sell your personal data. All savings recommendations 
            are generated using secure, anonymized analysis. You maintain full control over what data is collected and how it's used.
          </p>
          <div className="flex justify-center space-x-8 mt-6">
            <div className="text-center">
              <CheckCircle className="text-green-600 w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Bank-Level Security</p>
            </div>
            <div className="text-center">
              <CheckCircle className="text-green-600 w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">No Data Selling</p>
            </div>
            <div className="text-center">
              <CheckCircle className="text-green-600 w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Full Control</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="text-center py-12 space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start Saving Money?</h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Enable AI-powered savings analysis and start receiving personalized money-saving recommendations within 24 hours.
          </p>
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg"
            >
              <Brain className="mr-2" />
              Enable AI Savings Analysis
            </Button>
            <p className="text-sm text-purple-200">
              ✓ Free analysis ✓ No commitments ✓ Instant setup
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}