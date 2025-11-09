import React from "react";
import { ArrowLeft, Search, Utensils, Shield, CheckCircle, XCircle, FileText, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FoodSearchCriteria() {
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
            <Utensils className="h-6 w-6 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">Food Delivery Companies - Search Criteria</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-900">Food Sector Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">57</div>
                <div className="text-xs text-orange-700">Food Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-xs text-green-700">Recently Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-xs text-blue-700">No-CDL Required</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Food Delivery Search Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Search className="h-5 w-5" />
              Food Delivery Search Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Food delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Restaurant delivery drivers
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Meal delivery courier jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Ghost kitchen delivery partners
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Third-party food delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Catering delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Grocery delivery drivers
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Alcohol delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Fresh meal delivery companies
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Hot food courier services
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Local restaurant delivery jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Food logistics independent contractor
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Temperature-controlled food delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Corporate meal delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  B2B food delivery companies
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Farm-to-table delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Specialty food courier companies
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Food service delivery drivers
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  On-demand food delivery platforms
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Food distribution courier services
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
              Food Delivery Gig & Contractor Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Independent food delivery contractors
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  1099 restaurant delivery driver jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Food courier gig opportunities
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Freelance food delivery services
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Contract food delivery drivers
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Food delivery partner opportunities
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Restaurant courier contractor jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Food logistics contractor opportunities
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Standards */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Shield className="h-5 w-5" />
              Food Delivery Verification Standards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Business Presence Requirements
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Active restaurant partnerships or clients
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Professional website or app platform
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Customer reviews on food delivery platforms
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Clear service area coverage
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Driver Opportunity Requirements
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Flexible scheduling options
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Insulated bag requirements clearly stated
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Per-delivery or hourly pay structure
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Food safety training provided
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Utensils className="h-4 w-4 text-orange-600" />
                Food-Specific Verification Checks
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    Food handler's permit or certification requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    Temperature monitoring protocols
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    Food safety insurance coverage
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    Health department compliance standards
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Search className="h-5 w-5" />
              Food Delivery Research Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Restaurant industry publications and trade magazines
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Food service technology startup announcements
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Local restaurant association directories
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Food delivery app marketplaces
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Ghost kitchen operator networks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Food service contractor databases
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Restaurant vendor and supplier lists
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Food safety and delivery industry associations
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}