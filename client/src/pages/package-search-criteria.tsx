import React from "react";
import { ArrowLeft, Search, Package, Shield, CheckCircle, XCircle, FileText, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PackageSearchCriteria() {
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
            <Package className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Package Delivery Companies - Search Criteria</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-900">Package Delivery Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">93</div>
                <div className="text-xs text-blue-700">Package Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">20</div>
                <div className="text-xs text-green-700">Recently Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-xs text-purple-700">No-CDL Required</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package Delivery Search Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Search className="h-5 w-5" />
              Package Delivery Search Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Package delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Last mile delivery companies
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Same day package delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  E-commerce delivery partners
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Small package courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Express delivery companies
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Local courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  B2B package delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Residential package delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  On-demand package pickup
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Package courier driver jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Independent package delivery contractors
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Overnight delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Regional package delivery companies
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Amazon delivery service partners
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Third-party logistics delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  White glove delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Fragile package delivery specialists
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Time-sensitive package delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Corporate package delivery services
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gig & Contractor Opportunities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <FileText className="h-5 w-5" />
              Package Delivery Gig & Contractor Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Independent package delivery contractors
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  1099 courier driver opportunities
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Freelance package delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Contract delivery driver jobs
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Package delivery partner programs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Gig economy courier opportunities
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Express delivery contractor positions
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Same day delivery driver jobs
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Standards */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Shield className="h-5 w-5" />
              Package Delivery Verification Standards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Business Requirements
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Active client base or partnerships
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Professional tracking systems
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Insurance coverage for packages
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Clear delivery service areas
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  Driver Requirements
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Vehicle size and capacity requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Package handling training provided
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Delivery route optimization tools
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Customer service protocols
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <Search className="h-5 w-5" />
              Package Delivery Research Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  Logistics and supply chain publications
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  E-commerce industry news and reports
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  Delivery technology startup announcements
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  Regional business shipping directories
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  Third-party logistics provider networks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  Courier and messenger associations
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  Amazon delivery service partner programs
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  Local courier service directories
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}