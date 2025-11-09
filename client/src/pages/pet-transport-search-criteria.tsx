import React from "react";
import { ArrowLeft, Heart, FileText, Target, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PetTransportSearchCriteria() {
  const searchTerms = [
    "pet transport driver", "animal transport", "pet taxi", "pet delivery",
    "dog walking service", "pet courier", "animal chauffeur", "pet relocation",
    "veterinary transport", "pet care transport", "animal welfare transport",
    "pet boarding pickup", "grooming transport", "animal rescue transport",
    "pet sitting transport", "dog daycare pickup", "cat transport service",
    "exotic pet transport", "livestock transport", "animal shelter transport",
    "pet emergency transport", "animal medical transport", "pet boarding service",
    "animal care driver", "pet companion transport", "veterinary courier"
  ];

  const gigOpportunities = [
    "Rover - Pet sitting and dog walking services",
    "Wag - On-demand dog walking and pet care", 
    "Fetch! Pet Care - Comprehensive pet services",
    "PetSitter.com - Pet sitting marketplace",
    "Care.com Pet Care - Pet care provider platform",
    "Swifto - Dog walking and pet care services",
    "PetBacker - Pet sitting and boarding services",
    "Local Veterinary Clinics - Transport partnerships"
  ];

  const verificationStandards = [
    "Valid driver's license and clean driving record",
    "Vehicle suitable for safe pet transport",
    "Pet handling experience or certification",
    "Background check and references",
    "Basic animal first aid knowledge",
    "Pet transport insurance coverage",
    "Smartphone for communication and GPS",
    "Flexibility for emergency transport calls"
  ];

  const exclusions = [
    "Commercial livestock hauling (CDL required)",
    "Long-distance animal transport (multi-state)",
    "Exotic animal permits required positions",
    "Full-time veterinary clinic employment",
    "Animal control officer positions",
    "Breeding facility transport (employee only)",
    "Research facility animal transport",
    "Zoo or wildlife facility transport"
  ];

  const researchSources = [
    "Rover Partner Resources",
    "Wag Walker Support", 
    "Local Veterinary Associations",
    "Pet Industry Trade Groups",
    "Animal Welfare Organizations",
    "Pet Transport Facebook Groups",
    "Indeed Pet Care Jobs",
    "Care.com Provider Resources"
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
            <Heart className="h-6 w-6 text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-900">Pet Transport Services - Search Criteria</h1>
          </div>
        </div>

        {/* Overview */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">14</div>
                <div className="text-sm text-yellow-700">Active Pet Transport Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">26</div>
                <div className="text-sm text-blue-700">Search Terms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Growing</div>
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
                <Target className="h-5 w-5 text-yellow-600" />
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
                <Heart className="h-5 w-5 text-blue-600" />
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
                  <li>• Requires genuine love and understanding of animals</li>
                  <li>• Vehicle must be equipped for safe pet transport</li>
                  <li>• Emergency transport often pays premium rates</li>
                  <li>• Building relationships with local vets increases opportunities</li>
                  <li>• Pet insurance coverage recommended for liability protection</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}