import React from "react";
import { ArrowLeft, Baby, FileText, Target, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ChildTransportSearchCriteria() {
  const searchTerms = [
    "child transport driver", "kids transportation", "school pickup service", "childcare transport",
    "daycare pickup", "after school transport", "child taxi service", "kids shuttle driver",
    "family transport service", "child care driver", "safe kids transport", "school shuttle",
    "children's transport", "daycare shuttle", "family chauffeur", "kid-friendly driver",
    "child passenger service", "youth transport", "minor transport service", "family driver",
    "school drop off service", "childcare shuttle", "kids ride service", "safe child transport",
    "family transportation", "child escort service"
  ];

  const gigOpportunities = [
    "HopSkipDrive - Safe rides for kids",
    "Kango - Family rideshare and childcare", 
    "Zum - School transportation services",
    "GoKid - Family carpooling network",
    "Busy Bee Transport - Children's transport",
    "Local Daycare Centers - Transport partnerships",
    "After School Programs - Pickup services",
    "Private Family Clients - Direct contracts"
  ];

  const verificationStandards = [
    "Enhanced background check and fingerprinting",
    "Valid driver's license with excellent record",
    "Child safety training certification",
    "CPR and first aid certification",
    "Vehicle equipped with appropriate car seats",
    "Professional references from families",
    "Smartphone for communication and tracking",
    "Patience and experience with children"
  ];

  const exclusions = [
    "School bus driving (CDL required)",
    "Large group transport (CDL required)",
    "Long-distance child transport",
    "Overnight transport services",
    "Special needs transport (without training)",
    "Infant transport (under age requirements)",
    "Emergency medical transport",
    "Foster care transport (specialized)"
  ];

  const researchSources = [
    "HopSkipDrive Driver Resources",
    "Kango Safety Guidelines", 
    "National Child Transport Associations",
    "Local Childcare Provider Networks",
    "Parent Facebook Groups",
    "Child Safety Organizations",
    "Indeed Childcare Jobs",
    "Care.com Family Services"
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
            <Baby className="h-6 w-6 text-pink-600" />
            <h1 className="text-2xl font-bold text-gray-900">Child Transport Services - Search Criteria</h1>
          </div>
        </div>

        {/* Overview */}
        <Card className="mb-6 border-pink-200 bg-pink-50">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">6</div>
                <div className="text-sm text-pink-700">Active Child Transport Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">26</div>
                <div className="text-sm text-blue-700">Search Terms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Specialized</div>
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
                <Target className="h-5 w-5 text-pink-600" />
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
                <Baby className="h-5 w-5 text-blue-600" />
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
                  <li>• Highest safety and background check requirements</li>
                  <li>• Premium rates due to specialized nature and liability</li>
                  <li>• Strong focus on trust-building with families</li>
                  <li>• Vehicle must meet strict safety standards for children</li>
                  <li>• Continuous training in child safety and emergency procedures</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}