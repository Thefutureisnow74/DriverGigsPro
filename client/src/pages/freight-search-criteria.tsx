import React from "react";
import { ArrowLeft, Truck, FileText, Target, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FreightSearchCriteria() {
  const searchTerms = [
    "freight driver", "cargo transport", "freight delivery", "box truck driver",
    "local freight", "regional freight", "freight courier", "cargo delivery",
    "freight logistics", "LTL driver", "less than truckload", "freight hauling",
    "cargo van driver", "freight expedite", "hotshot freight", "freight transport",
    "cargo courier", "freight services", "local delivery driver", "freight dispatch",
    "cargo pickup", "freight contract", "independent freight", "owner operator freight",
    "small freight", "expedited freight"
  ];

  const gigOpportunities = [
    "GoShare - On-demand freight and moving services",
    "Dolly - Moving and delivery platform", 
    "Lugg - Furniture and appliance delivery",
    "Pickup - Same-day delivery marketplace",
    "LoadUp - Junk removal and delivery",
    "CitizenShipper - Peer-to-peer shipping",
    "uShip - Freight marketplace",
    "Local Freight Companies - Direct contracts"
  ];

  const verificationStandards = [
    "Valid driver's license with clean record",
    "Box truck, cargo van, or pickup truck",
    "Commercial insurance coverage",
    "Background check and DOT compliance",
    "Lifting capability (up to 75+ lbs)",
    "Smartphone for dispatch and GPS",
    "Basic cargo handling knowledge",
    "Flexible schedule for varied delivery times"
  ];

  const exclusions = [
    "CDL required tractor-trailer positions",
    "Long-haul interstate freight (CDL)",
    "Hazardous materials transport",
    "Heavy machinery transport",
    "Oversized load transport",
    "Full-time employee only positions",
    "Company truck mandatory roles",
    "Cross-country freight hauling"
  ];

  const researchSources = [
    "DAT Load Board",
    "FreightWaves Marketplace", 
    "Freight Broker Associations",
    "Independent Contractor Forums",
    "Indeed Freight Jobs",
    "Glassdoor Driver Reviews",
    "Local Freight Companies",
    "Owner Operator Resources"
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
            <Truck className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Freight Services - Search Criteria</h1>
          </div>
        </div>

        {/* Overview */}
        <Card className="mb-6 border-purple-200 bg-purple-50">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">21</div>
                <div className="text-sm text-purple-700">Active Freight Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">26</div>
                <div className="text-sm text-blue-700">Search Terms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">High</div>
                <div className="text-sm text-green-700">Demand Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
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
                  <li>• Focus on local and regional freight (no CDL required)</li>
                  <li>• Vehicle size determines earning potential and job types</li>
                  <li>• Commercial insurance typically required for business use</li>
                  <li>• Physical demands vary by cargo type and weight</li>
                  <li>• Building relationships with freight brokers increases opportunities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}