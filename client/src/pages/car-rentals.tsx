import { ArrowLeft, Car, MapPin, DollarSign, Shield, Clock, ExternalLink, CheckCircle, Phone, Mail, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface RentalCompany {
  name: string;
  overview: string;
  priceRange: string;
  includes: string[];
  booking: string;
  bookingUrl: string;
  availability: string;
  icon: string;
  bgColor: string;
  textColor: string;
  pros?: string[];
  phone?: string;
  email?: string;
  category: 'car' | 'truck' | 'sharing';
}

// Car and SUV Rentals for Food Delivery, Rideshare, and Courier Work
const carRentals: RentalCompany[] = [
  {
    name: "Hertz Gig Rentals",
    overview: "Approved for Uber, Lyft, DoorDash, Amazon Flex. Insurance included.",
    priceRange: "$260–$350/week",
    includes: ["Insurance", "Maintenance", "Unlimited miles", "Gig platform approval"],
    booking: "Call or visit website",
    bookingUrl: "https://hertz.com/ride",
    availability: "Nationwide",
    icon: "🚗",
    bgColor: "bg-gradient-to-br from-yellow-500 to-orange-600",
    textColor: "text-white",
    phone: "(800) 654-3131",
    email: "hertzrideshare@hertz.com",
    category: 'car'
  },
  {
    name: "HyreCar",
    overview: "Specifically for gig workers. Insurance & maintenance included.",
    priceRange: "$190–$350/week",
    includes: ["Insurance for rideshare and delivery", "Maintenance", "Gig platform ready"],
    booking: "Online platform",
    bookingUrl: "https://hyrecar.com/",
    availability: "Available in almost every U.S. city",
    icon: "🚐",
    bgColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
    textColor: "text-white",
    phone: "(213) 269-5330",
    email: "support@hyrecar.com",
    category: 'car'
  },
  {
    name: "Avis Flex",
    overview: "Month-to-month rentals for gig drivers. Reliable, nationwide.",
    priceRange: "$250–$350/week",
    includes: ["Maintenance", "Insurance options", "Flexible terms"],
    booking: "Call or visit branch",
    bookingUrl: "https://avis.com/",
    availability: "Most U.S. major cities",
    icon: "🚙",
    bgColor: "bg-gradient-to-br from-red-500 to-red-700",
    textColor: "text-white",
    phone: "(800) 352-7900",
    email: "business@avis.com",
    category: 'car'
  },
  {
    name: "Enterprise Rent-A-Car",
    overview: "Standard rentals. Some allow gig use if disclosed. Ask at branch.",
    priceRange: "$200–$300/week",
    includes: ["Standard maintenance", "Various vehicle types"],
    booking: "Call or visit local branch",
    bookingUrl: "https://enterprise.com/",
    availability: "Nationwide",
    icon: "🚗",
    bgColor: "bg-gradient-to-br from-green-500 to-green-700",
    textColor: "text-white",
    phone: "(855) 266-9289",
    category: 'car'
  },
  {
    name: "Getaround",
    overview: "Peer-to-peer car rentals. Hourly or daily. App-based.",
    priceRange: "$40–$80/day",
    includes: ["App-based booking", "Flexible timing"],
    booking: "App-based only",
    bookingUrl: "https://getaround.com/",
    availability: "Major cities",
    icon: "📱",
    bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
    textColor: "text-white",
    email: "help@getaround.com",
    category: 'car'
  },
  {
    name: "Turo (Commercial Hosts)",
    overview: "Select Commercial Host for delivery/gig work. App-based.",
    priceRange: "$250–$400/week",
    includes: ["Commercial host options", "Various vehicle types"],
    booking: "App-based platform",
    bookingUrl: "https://turo.com/",
    availability: "All 50 states",
    icon: "🚐",
    bgColor: "bg-gradient-to-br from-teal-500 to-teal-700",
    textColor: "text-white",
    email: "support@turo.com",
    category: 'car'
  },
  {
    name: "Rideshare Rental",
    overview: "Fully gig-ready. Comes with insurance. Uber, Lyft, DoorDash approved.",
    priceRange: "$235–$300/week",
    includes: ["Insurance included", "Gig platform approval", "Full support"],
    booking: "Call or online",
    bookingUrl: "https://ridesharerental.com/",
    availability: "Select markets",
    icon: "🚙",
    bgColor: "bg-gradient-to-br from-indigo-500 to-purple-600",
    textColor: "text-white",
    phone: "(949) 877-3538",
    email: "info@ridesharerental.com",
    category: 'car'
  },
  {
    name: "Splend",
    overview: "Full gig package. Car, insurance, servicing. Available in select cities.",
    priceRange: "$280–$350/week",
    includes: ["EV/Hybrid vehicles", "Insurance", "Servicing", "Full support"],
    booking: "Online application",
    bookingUrl: "https://splend.com/",
    availability: "Select cities only",
    icon: "⚡",
    bgColor: "bg-gradient-to-br from-emerald-500 to-green-600",
    textColor: "text-white",
    email: "support@us.splend.com",
    category: 'car'
  }
];

// Pickup Truck, Cargo Van, and Box Truck Rentals
const truckRentals: RentalCompany[] = [
  {
    name: "Enterprise Truck Rental",
    overview: "Best selection nationwide. Daily, weekly, monthly rentals.",
    priceRange: "$80–$200/day",
    includes: ["Various truck sizes", "Flexible terms", "Nationwide availability"],
    booking: "Call or visit local branch",
    bookingUrl: "https://enterprisetrucks.com/",
    availability: "Nationwide",
    icon: "🚛",
    bgColor: "bg-gradient-to-br from-green-600 to-emerald-700",
    textColor: "text-white",
    phone: "(888) 736-8287",
    category: 'truck'
  },
  {
    name: "Home Depot Rentals",
    overview: "Hourly & daily rentals. Very affordable for short-term needs.",
    priceRange: "$29–$80/day",
    includes: ["Hourly options", "Pickup trucks", "Cargo vans", "Flatbeds"],
    booking: "Visit local store or call",
    bookingUrl: "https://homedepot.com/tool-truck-rental",
    availability: "Most Home Depot locations",
    icon: "🏠",
    bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
    textColor: "text-white",
    phone: "(800) 466-3337",
    category: 'truck'
  },
  {
    name: "U-Haul Rentals",
    overview: "Same-day rentals. Available everywhere with great coverage.",
    priceRange: "$29.95–$150/day",
    includes: ["10-26 ft box trucks", "Cargo vans", "Pickup trucks", "Same-day availability"],
    booking: "Online or call",
    bookingUrl: "https://uhaul.com/",
    availability: "Nationwide - extensive coverage",
    icon: "📦",
    bgColor: "bg-gradient-to-br from-orange-600 to-yellow-600",
    textColor: "text-white",
    phone: "(800) 468-4285",
    email: "service@uhaul.com",
    category: 'truck'
  },
  {
    name: "Penske Truck Rental",
    overview: "Newer trucks. Good for large courier/freight operations.",
    priceRange: "$100–$250/day",
    includes: ["12-26 ft box trucks", "Cargo vans", "Newer fleet", "Commercial quality"],
    booking: "Call or online reservations",
    bookingUrl: "https://pensketruckrental.com/",
    availability: "Nationwide",
    icon: "🚚",
    bgColor: "bg-gradient-to-br from-blue-600 to-indigo-700",
    textColor: "text-white",
    phone: "(888) 996-5415",
    email: "reservations@penske.com",
    category: 'truck'
  },
  {
    name: "Budget Truck Rental",
    overview: "Affordable trucks with flexible terms for budget-conscious drivers.",
    priceRange: "$60–$180/day",
    includes: ["12-26 ft box trucks", "Cargo vans", "Flexible terms", "Budget-friendly"],
    booking: "Visit local branch or call",
    bookingUrl: "https://budgettruck.com/",
    availability: "Most major cities",
    icon: "💰",
    bgColor: "bg-gradient-to-br from-green-500 to-teal-600",
    textColor: "text-white",
    phone: "(800) 462-8343",
    category: 'truck'
  }
];

// Truck Sharing for Courier, Freight, and Gig Work
const sharingServices: RentalCompany[] = [
  {
    name: "GoShare",
    overview: "Only pay when you use. Work on GoShare gigs or personal contracts.",
    priceRange: "Per-job basis",
    includes: ["Pickup trucks", "Cargo vans", "Box trucks", "On-demand work"],
    booking: "App-based platform",
    bookingUrl: "https://goshare.co/",
    availability: "Major metropolitan areas",
    icon: "📱",
    bgColor: "bg-gradient-to-br from-blue-500 to-purple-600",
    textColor: "text-white",
    email: "support@goshare.co",
    category: 'sharing'
  },
  {
    name: "Bungii",
    overview: "Hauling gigs + your own contracts. App on-demand.",
    priceRange: "Per-delivery basis",
    includes: ["Pickup trucks", "SUV with trailer", "On-demand gigs"],
    booking: "App-based only",
    bookingUrl: "https://bungii.com/",
    availability: "Select cities",
    icon: "🚛",
    bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
    textColor: "text-white",
    email: "support@bungii.com",
    category: 'sharing'
  },
  {
    name: "Frayt",
    overview: "Courier, freight, same-day loads. Professional app-based platform.",
    priceRange: "Per-delivery basis",
    includes: ["Pickup trucks", "Cargo vans", "Box trucks", "Same-day delivery"],
    booking: "App-based platform",
    bookingUrl: "https://frayt.com/",
    availability: "Growing number of cities",
    icon: "⚡",
    bgColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
    textColor: "text-white",
    email: "support@frayt.com",
    category: 'sharing'
  },
  {
    name: "Curri",
    overview: "Construction material courier gigs. Specialized app-based work.",
    priceRange: "Per-delivery basis",
    includes: ["Cargo vans", "Pickup trucks", "Box trucks", "Flatbeds", "Construction materials"],
    booking: "App-based platform",
    bookingUrl: "https://curri.com/",
    availability: "Construction markets nationwide",
    icon: "🏗️",
    bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
    textColor: "text-white",
    email: "support@curri.com",
    category: 'sharing'
  }
];

const allRentals = [...carRentals, ...truckRentals, ...sharingServices];

const fastRentalSteps = [
  "Choose a company from the list above",
  "Go to their website or call them directly",
  "Check vehicle availability in your city",
  "Book online or over the phone",
  "Show driver's license, credit/debit card, and sometimes gig app approval",
  "Pay deposit (usually $100–$500)",
  "Pick up the vehicle—sometimes within hours",
  "Open your gig apps (Uber, DoorDash, Amazon Flex, etc.)",
  "Start making money today"
];

const checklistItems = [
  "Confirm the vehicle is approved for gig platforms (especially Uber and Lyft)",
  "Make sure rideshare insurance is included",
  "Check mileage limits — some are unlimited, others cap at certain miles",
  "Understand fuel policies (full-to-full or prepaid fuel)",
  "Look for rentals with maintenance included to avoid surprises"
];

export default function CarRentals() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/my-fleet')}
              className="flex items-center space-x-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to My Fleet</span>
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center space-x-3">
            <Car className="text-green-600" />
            <span>Where to Rent a Gig Work Car Today</span>
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Nationwide guide for renting vehicles approved for Uber, Lyft, DoorDash, Instacart, Roadie, Amazon Flex, Spark, and other gig platforms
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">


        {/* Step-by-Step Rental Guide */}
        <Card className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <span>⚡</span>
              <span>Step-by-Step: Rent a Vehicle FAST (Same-Day Possible)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-200" />
                <span className="font-semibold">Steps You Take Today:</span>
              </div>
              <ol className="space-y-2 text-white">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white text-green-600 rounded-full text-sm font-bold flex items-center justify-center">1</span>
                  <span>Choose a company from the list above</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white text-green-600 rounded-full text-sm font-bold flex items-center justify-center">2</span>
                  <span>Go to their website or call them directly</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white text-green-600 rounded-full text-sm font-bold flex items-center justify-center">3</span>
                  <span>Check vehicle availability in your city</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white text-green-600 rounded-full text-sm font-bold flex items-center justify-center">4</span>
                  <span>Book online or over the phone</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white text-green-600 rounded-full text-sm font-bold flex items-center justify-center">5</span>
                  <span>Show driver's license, credit/debit card, and sometimes gig app approval</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white text-green-600 rounded-full text-sm font-bold flex items-center justify-center">6</span>
                  <span>Pay deposit (usually $100–$500)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white text-green-600 rounded-full text-sm font-bold flex items-center justify-center">7</span>
                  <span>Pick up the vehicle—sometimes within hours</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white text-green-600 rounded-full text-sm font-bold flex items-center justify-center">8</span>
                  <span>Open your gig apps (Uber, DoorDash, Amazon Flex, etc.)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white text-green-600 rounded-full text-sm font-bold flex items-center justify-center">9</span>
                  <span>Start making money today</span>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Car and SUV Rentals Section */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <Car className="text-blue-600" />
              <span>Car, SUV, and Sedan Rentals</span>
            </CardTitle>
            <p className="text-gray-600">For Food Delivery, Rideshare, and Courier Work</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {carRentals.map((company, index) => (
                <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className={`${company.bgColor} ${company.textColor} rounded-t-lg`}>
                    <CardTitle className="flex items-center space-x-3">
                      <span className="text-2xl">{company.icon}</span>
                      <span className="text-xl">{company.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-gray-700">{company.overview}</p>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-700">{company.priceRange}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Includes:</span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-600 ml-6">
                        {company.includes.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {company.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-mono">{company.phone}</span>
                      </div>
                    )}

                    {company.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{company.email}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">{company.availability}</span>
                    </div>

                    <Button 
                      onClick={() => window.open(company.bookingUrl, '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Truck Rentals Section */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <Truck className="text-orange-600" />
              <span>Pickup Truck, Cargo Van, and Box Truck Rentals</span>
            </CardTitle>
            <p className="text-gray-600">For Delivery, Freight & Courier Work</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {truckRentals.map((company, index) => (
                <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className={`${company.bgColor} ${company.textColor} rounded-t-lg`}>
                    <CardTitle className="flex items-center space-x-3">
                      <span className="text-2xl">{company.icon}</span>
                      <span className="text-xl">{company.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-gray-700">{company.overview}</p>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-700">{company.priceRange}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Includes:</span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-600 ml-6">
                        {company.includes.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {company.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-mono">{company.phone}</span>
                      </div>
                    )}

                    {company.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{company.email}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">{company.availability}</span>
                    </div>

                    <Button 
                      onClick={() => window.open(company.bookingUrl, '_blank')}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Truck Sharing Section */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <span className="text-2xl">🚚</span>
              <span>Truck Sharing for Courier, Freight, and Gig Work</span>
            </CardTitle>
            <p className="text-gray-600">Pay by Load - Perfect for Occasional Use</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sharingServices.map((company, index) => (
                <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className={`${company.bgColor} ${company.textColor} rounded-t-lg`}>
                    <CardTitle className="flex items-center space-x-3">
                      <span className="text-2xl">{company.icon}</span>
                      <span className="text-xl">{company.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-gray-700">{company.overview}</p>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-700">{company.priceRange}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Includes:</span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-600 ml-6">
                        {company.includes.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {company.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{company.email}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">{company.availability}</span>
                    </div>

                    <Button 
                      onClick={() => window.open(company.bookingUrl, '_blank')}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>



        {/* Checklist */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" />
              <span>Things to Look For When Renting</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">🚀 Get On The Road Fast</h2>
            <p className="text-green-100">
              Choose the rental option that works best for your location and budget, and start earning today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}