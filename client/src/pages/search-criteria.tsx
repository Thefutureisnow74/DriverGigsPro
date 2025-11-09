import React from "react";
import { ArrowLeft, Search, Users, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const serviceVerticals = [
  { name: "Food", count: 57, color: "bg-orange-500" },
  { name: "Package Delivery", count: 93, color: "bg-blue-500" },
  { name: "Document Delivery", count: 15, color: "bg-cyan-500" },
  { name: "Rideshare", count: 42, color: "bg-green-500" },
  { name: "Freight", count: 21, color: "bg-purple-500" },
  { name: "Medical", count: 116, color: "bg-red-500" },
  { name: "Cannabis Delivery", count: 12, color: "bg-emerald-500" },
  { name: "Pet Transport", count: 14, color: "bg-yellow-500" },
  { name: "Child Transport", count: 6, color: "bg-pink-500" },
  { name: "Senior Services", count: 80, color: "bg-indigo-500" },
  { name: "Air Transport", count: 10, color: "bg-cyan-500" },
  { name: "Vehicle Transport", count: 2, color: "bg-slate-500" },
  { name: "Luggage Delivery", count: 7, color: "bg-teal-500" },
  { name: "Other", count: 29, color: "bg-gray-500" }
];

export default function SearchCriteria() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/companies">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Driver Opportunities
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Search Criteria & Service Verticals</h1>
          </div>
        </div>

        {/* Overview Card */}
        <Card className="mb-4 border-blue-200 bg-blue-50">
          <CardContent className="py-2">
            <div className="flex items-center gap-1 mb-2">
              <Building2 className="h-3 w-3 text-blue-600" />
              <h2 className="text-sm font-medium text-blue-900">Database Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">540</div>
                <div className="text-xs text-blue-700">Total Active Companies</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">13</div>
                <div className="text-xs text-green-700">Service Verticals</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">100%</div>
                <div className="text-xs text-purple-700">No-CDL Required</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Verticals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {serviceVerticals.map((service, index) => {
            const getHref = (serviceName: string) => {
              const routes: { [key: string]: string } = {
                'Medical': '/medical-search-criteria',
                'Food': '/food-search-criteria',
                'Package Delivery': '/package-search-criteria',
                'Document Delivery': '/document-delivery-search-criteria',
                'Rideshare': '/rideshare-search-criteria',
                'Freight': '/freight-search-criteria',
                'Pet Transport': '/pet-transport-search-criteria',
                'Child Transport': '/child-transport-search-criteria',
                'Vehicle Transport': '/vehicle-transport-search-criteria',
                'Luggage Delivery': '/luggage-delivery-search-criteria',
                'E-commerce': '/ecommerce-search-criteria',
                'Auto Parts': '/auto-parts-search-criteria',
                'Business Services': '/business-search-criteria',
                'Retail': '/retail-search-criteria',
                'Logistics': '/logistics-search-criteria',
                'Industrial': '/industrial-search-criteria',
                'Legal': '/legal-search-criteria',
                'Laboratory': '/laboratory-search-criteria',
                'Construction': '/construction-search-criteria',
                'Personal Services': '/personal-search-criteria',
                'Senior Services': '/senior-services-search-criteria',
                'Cannabis Delivery': '/cannabis-delivery-search-criteria',
                'Air Transport': '/air-transport-search-criteria'
              };
              return routes[serviceName] || null;
            };

            const href = getHref(service.name);
            const getHoverColor = (serviceName: string) => {
              const colors: { [key: string]: string } = {
                'Medical': 'hover:bg-red-50',
                'Food': 'hover:bg-orange-50',
                'Package Delivery': 'hover:bg-blue-50',
                'Document Delivery': 'hover:bg-cyan-50',
                'Rideshare': 'hover:bg-green-50',
                'Freight': 'hover:bg-purple-50',
                'Pet Transport': 'hover:bg-yellow-50',
                'Child Transport': 'hover:bg-pink-50',
                'Vehicle Transport': 'hover:bg-slate-50',
                'Luggage Delivery': 'hover:bg-teal-50',
                'E-commerce': 'hover:bg-emerald-50',
                'Auto Parts': 'hover:bg-gray-50',
                'Business Services': 'hover:bg-indigo-50',
                'Retail': 'hover:bg-pink-50',
                'Logistics': 'hover:bg-slate-50',
                'Industrial': 'hover:bg-amber-50',
                'Legal': 'hover:bg-teal-50',
                'Laboratory': 'hover:bg-violet-50',
                'Construction': 'hover:bg-yellow-50',
                'Personal Services': 'hover:bg-cyan-50',
                'Senior Services': 'hover:bg-indigo-50',
                'Cannabis Delivery': 'hover:bg-emerald-50',
                'Air Transport': 'hover:bg-cyan-50'
              };
              return colors[serviceName] || 'hover:bg-gray-50';
            };
            
            if (href) {
              return (
                <Link key={index} href={href}>
                  <Card className={`hover:shadow-md transition-shadow cursor-pointer ${getHoverColor(service.name)}`}>
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${service.color}`}></div>
                          <div>
                            <h3 className="font-medium text-sm text-gray-900">{service.name}</h3>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-sm font-bold px-2 py-0">
                          {service.count}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            }
            
            return (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${service.color}`}></div>
                      <div>
                        <h3 className="font-medium text-sm text-gray-900">{service.name}</h3>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-sm font-bold px-2 py-0">
                      {service.count}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>


      </div>
    </div>
  );
}