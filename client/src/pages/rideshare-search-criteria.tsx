import React from "react";
import { ArrowLeft, Car, FileText, Target, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RideshareSearchCriteria() {
  const searchTerms = [
    "rideshare driver", "uber driver", "lyft driver", "rideshare opportunities",
    "passenger transport", "ride sharing", "taxi driver", "car service driver",
    "transportation driver", "ride service", "driver partner", "ride hailing",
    "mobility driver", "on-demand rides", "passenger pickup", "ride app driver",
    "transport service", "vehicle for hire", "chauffeur driver", "ride platform",
    "independent driver", "gig driver rideshare", "peer to peer transport",
    "shared mobility", "ride booking", "passenger service"
  ];

  const gigOpportunities = [
    "Uber - Peak hour bonuses and surge pricing",
    "Lyft - Weekly driver bonuses and ride challenges", 
    "Via - Shared ride premium rates",
    "Juno - Higher commission rates for drivers",
    "Curb - Taxi and rideshare hybrid platform",
    "Gett - Corporate ride services",
    "Wingz - Scheduled ride services to airports",
    "GoKid - Family-focused ride sharing"
  ];

  const verificationStandards = [
    "Valid driver's license (minimum 1 year)",
    "Vehicle registration and insurance",
    "Background check and driving record",
    "Vehicle inspection and age requirements",
    "Smartphone with GPS capability",
    "Minimum age requirement (21+ for most platforms)",
    "Clean driving record (no major violations)",
    "Vehicle meets platform specifications"
  ];

  const exclusions = [
    "Commercial driver's license (CDL) required positions",
    "Company-owned vehicle mandatory roles",
    "Full-time employee only positions",
    "Motorcycle or bicycle delivery services",
    "Long-haul or interstate driving",
    "Heavy vehicle or truck driving",
    "School bus or transit bus driving",
    "Emergency or medical transport"
  ];

  const researchSources = [
    "Uber Partner Dashboard",
    "Lyft Driver Hub", 
    "Indeed Rideshare Jobs",
    "Glassdoor Driver Reviews",
    "Reddit r/ridesharedrivers",
    "Facebook Driver Groups",
    "Local Transportation Authority",
    "Insurance Company Resources"
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
            <Car className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Rideshare Services - Search Criteria</h1>
          </div>
        </div>

        {/* Overview */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">42</div>
                <div className="text-sm text-green-700">Active Rideshare Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">26</div>
                <div className="text-sm text-blue-700">Search Terms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">High</div>
                <div className="text-sm text-purple-700">Demand Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
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
                <Car className="h-5 w-5 text-blue-600" />
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
                  <li>• Focus on independent contractor positions with flexible scheduling</li>
                  <li>• Most platforms require personal vehicle ownership or lease</li>
                  <li>• Earnings vary significantly by location and time of day</li>
                  <li>• Consider fuel costs, vehicle maintenance, and insurance</li>
                  <li>• Multiple platform registration often maximizes earnings potential</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}