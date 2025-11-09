import React from "react";
import { ArrowLeft, Search, Heart, Shield, CheckCircle, XCircle, FileText, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MedicalSearchCriteria() {
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
            <Heart className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Medical Delivery Companies - Search Criteria</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-red-600" />
              <h2 className="text-lg font-semibold text-red-900">Medical Sector Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">116</div>
                <div className="text-xs text-red-700">Medical Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">36</div>
                <div className="text-xs text-green-700">Recently Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-xs text-blue-700">HIPAA Compliant</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Delivery Search Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Search className="h-5 w-5" />
              Medical Delivery Search Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical courier jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  On Demand Medical
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  On Demand Medical delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical supply delivery drivers
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Pharmacy delivery companies
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Hospital courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Specimen transport services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Lab courier companies
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Blood transport delivery companies
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Organ and tissue transport logistics
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Diagnostic courier delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Healthcare delivery specialists
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Healthcare logistics providers
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Pharmaceutical courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical supply delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Radiology courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Blood bank transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical device delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Pharmaceutical distribution
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Durable medical equipment delivery
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical logistics independent contractor
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Healthcare delivery driver jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical equipment courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Prescription delivery driver jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Non-emergency medical transportation delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  HIPAA-compliant delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Pathology courier services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Oncology drug delivery logistics
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Clinical trial logistics couriers
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Biological sample transport services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Home infusion delivery service
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Nuclear medicine courier delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Surgical instrument delivery logistics
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  STAT courier companies + city/state
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Prescription medication delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Lab specimen transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical supplies courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Nuclear medicines delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical waste transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Temperature controlled medical delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Chain of custody medical transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical logistics specialists
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Healthcare supply chain delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  HIPAA certified delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical courier compliance
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical incident-free record
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Medical logistics professionals
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Telemedicine equipment delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Remote patient monitoring delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Virtual healthcare support services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Home healthcare equipment transport
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Clinical trial specimen courier
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Veterinary medical delivery services
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Mental health therapy supply delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Telehealth device distribution
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
              Gig & Contractor Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Independent courier companies near city/state
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Independent pharmacy delivery service city/state
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  1099 medical courier jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Contractor medical delivery driver jobs
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Independent delivery contractors healthcare
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Gig courier app healthcare
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Driver subcontractor courier service
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Become a medical courier contractor
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Apply courier driver independent contractor
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
              Verification Standards
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
                    Professional website or verified Google Business Profile
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Contact information and listed service areas
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Recent press mentions or active social media
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Customer reviews and testimonials
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
                    Clearly state they hire independent contractors
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    List accepted vehicle types (cars, vans, SUVs, box trucks)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Active job postings on Indeed or Craigslist
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Ideally share pay details and requirements
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-600" />
                Medical-Specific Verification Checks
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    HIPAA compliance requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Chain-of-custody protocols for specimens
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Vendor credentialing with hospitals/labs
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Requirements for insulated bags or coolers
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Exclusions (Don't Waste Time On These)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                  Freight or trucking companies that require a CDL
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                  Inactive or defunct companies
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                  Scam or fake listings with no real driver opportunities
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                  Pure technology platforms that don't hire drivers directly
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                  Furniture-only or moving companies
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Research Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Search className="h-5 w-5" />
              Research Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Industry logistics and courier news publications
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Startup funding announcements
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Regional business directories (Chamber of Commerce, YellowPages, BBB)
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Professional networking sites like LinkedIn
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Government contractor/vendor databases
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Healthcare provider networks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Courier industry associations (CLDA)
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Hospital procurement and vendor credentialing systems
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  Pharmacy distributor and vendor lists
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}