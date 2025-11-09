import React from "react";
import { ArrowLeft, Search, Users, Shield, CheckCircle, FileText, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SeniorServicesSearchCriteria() {
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
            <Users className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Senior Services Delivery - Search Criteria</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <Card className="mb-6 border-indigo-200 bg-indigo-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-indigo-600" />
              <h2 className="text-lg font-semibold text-indigo-900">Senior Services Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">80</div>
                <div className="text-xs text-indigo-700">Senior Service Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">16</div>
                <div className="text-xs text-green-700">Recently Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-xs text-blue-700">No-CDL Required</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Senior Services Search Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <Search className="h-5 w-5" />
              Senior Services Search Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Senior meal delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Elderly grocery delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Senior prescription delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Adult day care transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Senior medical transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Elderly shopping services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Senior care supply delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Home health aide delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Senior companion transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Assisted living delivery
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Senior mobility services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Elderly appointment transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Senior specialized delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Nursing home supply delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Senior wellness delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Elderly equipment delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Senior social services transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Memory care delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Senior emergency delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Elderly concierge services
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
              Senior Services Gig & Contractor Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Independent senior service contractors
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  1099 elderly care delivery jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Freelance senior transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Contract senior delivery drivers
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Senior services delivery partners
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Gig economy elderly care courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Senior companion driver jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Assisted living contractor positions
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
              Senior Services Research Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Area Agency on Aging directories
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Senior care service associations
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Home healthcare networks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Assisted living facility contacts
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Senior service provider networks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Elder care industry associations
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Medicare/Medicaid transport providers
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Senior community service organizations
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}