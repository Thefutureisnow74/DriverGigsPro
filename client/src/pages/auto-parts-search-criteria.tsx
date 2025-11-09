import React from "react";
import { ArrowLeft, Search, Wrench, Shield, CheckCircle, FileText, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AutoPartsSearchCriteria() {
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
            <Wrench className="h-6 w-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Auto Parts Delivery - Search Criteria</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <Card className="mb-6 border-gray-200 bg-gray-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Auto Parts Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">42</div>
                <div className="text-xs text-gray-700">Auto Parts Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-xs text-green-700">Recently Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-xs text-blue-700">No-CDL Required</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto Parts Delivery Search Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <Search className="h-5 w-5" />
              Auto Parts Delivery Search Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Auto parts delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Automotive parts courier jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Same day auto parts delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Dealership parts delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Repair shop delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Aftermarket parts delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  OEM parts courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Emergency auto parts delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Heavy truck parts delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Fleet parts distribution
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Auto parts logistics contractors
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  B2B automotive parts delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Automotive supply chain delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Parts warehouse delivery drivers
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Specialty automotive parts courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Performance parts delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Auto body parts delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Motorcycle parts delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Tire delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Industrial parts courier jobs
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gig & Contractor Opportunities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <FileText className="h-5 w-5" />
              Auto Parts Gig & Contractor Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Independent auto parts delivery contractors
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  1099 automotive parts courier jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Freelance auto parts delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Contract automotive delivery drivers
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Auto parts delivery partner programs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Gig economy auto parts courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Emergency parts delivery contractors
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Dealership delivery contractor jobs
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Search className="h-5 w-5" />
              Auto Parts Research Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Automotive industry trade publications
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Auto parts distributor networks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Dealership service department contacts
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Auto repair shop associations
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Automotive aftermarket directories
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Fleet maintenance service providers
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Auto parts warehouse locations
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Automotive supply chain logistics companies
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}