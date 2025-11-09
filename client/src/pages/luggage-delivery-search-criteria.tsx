import React from "react";
import { ArrowLeft, Luggage, FileText, Target, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LuggageDeliverySearchCriteria() {
  const searchTerms = [
    "luggage delivery", "baggage transport", "airport luggage service", "hotel luggage delivery",
    "luggage courier", "bag transport service", "travel luggage delivery", "suitcase delivery",
    "luggage pickup service", "baggage courier", "travel bag transport", "luggage logistics",
    "airport baggage delivery", "hotel bag service", "cruise luggage delivery", "resort luggage transport",
    "vacation luggage service", "travel gear delivery", "luggage forwarding", "bag delivery service",
    "lost luggage delivery", "delayed baggage service", "luggage express delivery", "baggage handling service",
    "travel equipment transport", "luggage same-day delivery"
  ];

  const gigOpportunities = [
    "LuggageForward - Travel luggage shipping",
    "Bags VIP - Airport luggage services", 
    "Send My Bag - International luggage delivery",
    "Luggage Free - Travel luggage transport",
    "Bell Hop - Hotel and airport luggage service",
    "Local Hotels - Concierge partnerships",
    "Cruise Lines - Port luggage services",
    "Private Travel Clients - Direct contracts"
  ];

  const verificationStandards = [
    "Valid driver's license with clean record",
    "Background check and security clearance",
    "Vehicle suitable for secure transport",
    "Professional appearance and demeanor",
    "Smartphone for tracking and communication",
    "Insurance coverage for transported items",
    "Reliability for time-sensitive deliveries",
    "Customer service skills for hospitality industry"
  ];

  const exclusions = [
    "Commercial freight services (CDL required)",
    "Long-haul baggage transport",
    "International shipping services",
    "Airline employee positions",
    "Airport security positions",
    "Full-time hotel employment",
    "Cruise ship crew positions",
    "Heavy cargo transport services"
  ];

  const researchSources = [
    "Travel Industry Forums",
    "Hotel Concierge Networks", 
    "Airport Service Providers",
    "Tourism Industry Associations",
    "Indeed Travel Jobs",
    "Hospitality Career Sites",
    "Local Tourism Boards",
    "Travel Service Company Websites"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/search-criteria">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search Criteria
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Luggage className="h-6 w-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-gray-900">Luggage Delivery Services - Search Criteria</h1>
          </div>
        </div>

        {/* Overview */}
        <Card className="mb-6 border-teal-200 bg-teal-50">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">7</div>
                <div className="text-sm text-teal-700">Active Luggage Delivery Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">26</div>
                <div className="text-sm text-blue-700">Search Terms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Niche</div>
                <div className="text-sm text-purple-700">Market Segment</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-teal-600" />
                Search Terms (26)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {searchTerms.map((term, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {term}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gig Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Luggage className="h-5 w-5 text-blue-600" />
                Major Gig Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {gigOpportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Verification Standards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Verification Standards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {verificationStandards.map((standard, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    {standard}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Exclusions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Search Exclusions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {exclusions.map((exclusion, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    {exclusion}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Research Sources */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-indigo-600" />
              Research Sources & Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {researchSources.map((source, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <ExternalLink className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{source}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Notes */}
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Important Notes</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Seasonal demand peaks during travel seasons</li>
                  <li>• Premium rates for time-sensitive deliveries</li>
                  <li>• Strong focus on security and item protection</li>
                  <li>• Building relationships with hotels and travel companies key</li>
                  <li>• Airport proximity often increases opportunity volume</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}