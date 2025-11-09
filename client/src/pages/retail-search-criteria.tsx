import React from "react";
import { ArrowLeft, Search, Store, Shield, CheckCircle, FileText, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RetailSearchCriteria() {
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
            <Store className="h-6 w-6 text-pink-600" />
            <h1 className="text-2xl font-bold text-gray-900">Retail Delivery - Search Criteria</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <Card className="mb-6 border-pink-200 bg-pink-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-pink-600" />
              <h2 className="text-lg font-semibold text-pink-900">Retail Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">33</div>
                <div className="text-xs text-pink-700">Retail Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">7</div>
                <div className="text-xs text-green-700">Recently Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-xs text-blue-700">No-CDL Required</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retail Delivery Search Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Search className="h-5 w-5" />
              Retail Delivery Search Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Retail delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Store merchandise delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Department store delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Specialty retail courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Fashion delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Electronics retail delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Home goods delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Furniture store delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Appliance delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Consumer goods courier
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Retail logistics contractors
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Store-to-door delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Same-day retail delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Customer purchase delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Gift delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Seasonal merchandise delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Luxury goods courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Personal shopping delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Retail return pickup services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Pop-up store delivery
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
              Retail Gig & Contractor Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Independent retail delivery contractors
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  1099 store delivery driver jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Freelance retail courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Contract merchandise delivery
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Retail delivery partner programs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Gig economy retail courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Fashion delivery contractor jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Same-day retail contractors
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
              Retail Research Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Retail industry publications
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Department store vendor directories
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Fashion and apparel logistics networks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Specialty retail associations
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Consumer electronics distributor lists
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Home goods and furniture delivery networks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Luxury goods logistics providers
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Regional retail chains and franchises
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}