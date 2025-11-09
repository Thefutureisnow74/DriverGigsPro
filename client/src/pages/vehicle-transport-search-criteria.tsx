import React from "react";
import { ArrowLeft, Truck, FileText, Target, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VehicleTransportSearchCriteria() {
  const searchTerms = [
    "car transport driver", "auto transport", "vehicle delivery", "car hauler driver",
    "auto auction transport", "dealership delivery", "rental car driver", "car carrier",
    "automobile transport", "vehicle relocation", "car shuttle driver", "auto logistics",
    "car delivery service", "vehicle courier", "automotive transport", "car moving service",
    "auto dealership driver", "vehicle pickup service", "car transport courier",
    "automobile delivery", "vehicle shuttle", "car relocation service", "auto delivery driver",
    "vehicle logistics", "car carrier service", "automotive courier"
  ];

  const gigOpportunities = [
    "Manheim Auto Auctions - Vehicle transport services",
    "Enterprise Holdings - Car rental relocations", 
    "HyreCar - Peer-to-peer car sharing transport",
    "Carvana - Vehicle delivery services",
    "Vroom - Online car sales delivery",
    "CarMax - Vehicle transport between locations",
    "Local Auto Dealerships - Delivery contracts",
    "Turo - Car sharing platform transport"
  ];

  const verificationStandards = [
    "Valid driver's license with clean record",
    "Experience driving various vehicle types",
    "Background check and employment verification",
    "Basic automotive knowledge preferred",
    "Smartphone for route tracking and communication",
    "Flexible schedule for delivery timeframes",
    "Professional appearance and customer service skills",
    "Ability to handle vehicle inspection reports"
  ];

  const exclusions = [
    "Commercial auto hauler trucks (CDL required)",
    "Multi-car transport trailers (CDL required)",
    "Heavy-duty towing services",
    "Long-haul interstate transport (CDL)",
    "Specialized vehicle transport (RV, boats)",
    "Auction house employee positions",
    "Full-time dealership employment",
    "Insurance claim vehicle recovery"
  ];

  const researchSources = [
    "Manheim Dealer Resources",
    "Enterprise Fleet Management", 
    "Auto Dealer Trade Publications",
    "Vehicle Transport Industry Groups",
    "Indeed Automotive Jobs",
    "Glassdoor Driver Reviews",
    "Local Auto Dealer Associations",
    "Car Rental Company Careers"
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
            <Truck className="h-6 w-6 text-slate-600" />
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Transport Services - Search Criteria</h1>
          </div>
        </div>

        {/* Overview */}
        <Card className="mb-6 border-slate-200 bg-slate-50">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600">2</div>
                <div className="text-sm text-slate-700">Active Vehicle Transport Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">26</div>
                <div className="text-sm text-blue-700">Search Terms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Stable</div>
                <div className="text-sm text-purple-700">Market Demand</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-slate-600" />
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
                <Truck className="h-5 w-5 text-blue-600" />
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
                  <li>• Focus on single-vehicle transport (no CDL required)</li>
                  <li>• Local and regional delivery opportunities preferred</li>
                  <li>• Vehicle inspection and condition documentation required</li>
                  <li>• Customer service skills important for dealership relationships</li>
                  <li>• Flexible scheduling often required for pickup/delivery coordination</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}