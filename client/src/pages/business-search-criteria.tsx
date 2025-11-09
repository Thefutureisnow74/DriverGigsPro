import React from "react";
import { ArrowLeft, Search, Briefcase, Shield, CheckCircle, FileText, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BusinessSearchCriteria() {
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
            <Briefcase className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Business Services Delivery - Search Criteria</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <Card className="mb-6 border-indigo-200 bg-indigo-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-indigo-600" />
              <h2 className="text-lg font-semibold text-indigo-900">Business Services Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">38</div>
                <div className="text-xs text-indigo-700">Business Service Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-xs text-green-700">Recently Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-xs text-blue-700">No-CDL Required</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Services Search Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <Search className="h-5 w-5" />
              Business Services Search Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Document delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Legal document courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Financial services delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Insurance document delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Real estate document courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Contract delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Office supply delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Corporate mail services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Notary delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Confidential document transport
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Business-to-business courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Professional services delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Time-sensitive business delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Executive courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Banking delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Government contract delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Corporate event delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Archive document transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Process server delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Court filing services
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
              Business Services Gig & Contractor Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Independent business courier contractors
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  1099 legal document delivery jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Freelance document courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Contract professional delivery drivers
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Business services delivery partners
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Gig economy business courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Executive delivery contractor jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Professional services contractors
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
              Business Services Research Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Legal services directories
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Professional service associations
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Business courier networks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Corporate service provider lists
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Financial services vendor databases
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Government contractor registries
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Real estate service networks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Insurance industry directories
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}