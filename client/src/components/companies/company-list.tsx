import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, DollarSign, MapPin, Truck, FileText, Star, Eye, Heart } from "lucide-react";
import type { Company } from "@shared/schema";
import { RESPONSIVE_GRIDS, RESPONSIVE_FLEX, TOUCH_FRIENDLY } from "@/lib/responsive-utils";

interface CompanyListProps {
  companies: Company[];
  onViewDetails?: (company: Company) => void;
  onApply?: (company: Company) => void;
  onFavorite?: (company: Company) => void;
  showActions?: boolean;
  layout?: "grid" | "list";
}

const getVerticalColor = (vertical: string) => {
  const colors: Record<string, string> = {
    'Food': 'bg-orange-100 text-orange-800',
    'Package': 'bg-blue-100 text-blue-800',
    'Document Delivery': 'bg-cyan-100 text-cyan-800',
    'Rideshare': 'bg-purple-100 text-purple-800',
    'Freight': 'bg-green-100 text-green-800',
    'Medical': 'bg-red-100 text-red-800',
    'Moving': 'bg-yellow-100 text-yellow-800',
    'Personal': 'bg-pink-100 text-pink-800',
    'Luggage Delivery': 'bg-indigo-100 text-indigo-800',
  };
  return colors[vertical] || 'bg-gray-100 text-gray-800';
};

const getVerticalGradient = (vertical: string) => {
  const gradients: Record<string, string> = {
    'Food': 'from-orange-400 to-red-500',
    'Package': 'from-blue-400 to-cyan-500',
    'Document Delivery': 'from-cyan-400 to-teal-500',
    'Rideshare': 'from-purple-400 to-pink-500',
    'Freight': 'from-green-400 to-emerald-500',
    'Medical': 'from-red-400 to-pink-500',
    'Moving': 'from-yellow-400 to-orange-500',
    'Personal': 'from-pink-400 to-rose-500',
    'Luggage Delivery': 'from-indigo-400 to-blue-500',
  };
  return gradients[vertical] || 'from-gray-400 to-gray-600';
};

export default function CompanyList({
  companies,
  onViewDetails,
  onApply,
  onFavorite,
  showActions = true,
  layout = "grid"
}: CompanyListProps) {
  if (layout === "list") {
    return (
      <div className="space-y-4">
        {companies.map((company) => (
          <Card key={company.id} className="card-hover bg-white rounded-xl shadow-lg border border-gray-100">
            <CardContent className="p-6">
              <div className={`${RESPONSIVE_FLEX.row} items-start sm:items-center justify-between`}>
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getVerticalGradient(Array.isArray(company.serviceVertical) ? company.serviceVertical[0] : company.serviceVertical)} rounded-xl flex items-center justify-center`}>
                    <Building className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{company.name}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      {Array.isArray(company.serviceVertical) ? (
                        <div className="flex flex-wrap gap-1">
                          {company.serviceVertical.map((vertical, index) => (
                            <Badge key={index} className={`${getVerticalColor(vertical)} text-xs`}>
                              {vertical}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge className={`${getVerticalColor(company.serviceVertical)} text-xs`}>
                          {company.serviceVertical}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {company.contractType}
                      </Badge>
                      {company.averagePay && (
                        <span className="text-sm text-green-600 font-semibold">
                          {company.averagePay}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {showActions && (
                  <div className={`${RESPONSIVE_FLEX.wrap} flex-shrink-0`}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onFavorite?.(company)}
                      className={`${TOUCH_FRIENDLY.button} border-pink-500 text-pink-600 hover:bg-pink-50`}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails?.(company)}
                      className={`${TOUCH_FRIENDLY.button} border-blue-500 text-blue-600 hover:bg-blue-50`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onApply?.(company)}
                      className={`${TOUCH_FRIENDLY.button} bg-gradient-to-r ${getVerticalGradient(Array.isArray(company.serviceVertical) ? company.serviceVertical[0] : company.serviceVertical)} text-white hover:shadow-lg transition-all duration-300`}
                    >
                      Apply Now
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={RESPONSIVE_GRIDS.threeCol}>
      {companies.map((company) => (
        <Card key={company.id} className="card-hover bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${getVerticalGradient(Array.isArray(company.serviceVertical) ? company.serviceVertical[0] : company.serviceVertical)} rounded-xl flex items-center justify-center animate-float`}>
                  <Building className="text-white text-xl" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">
                    {company.name}
                  </CardTitle>
                  {Array.isArray(company.serviceVertical) ? (
                    <div className="flex flex-wrap gap-1">
                      {company.serviceVertical.map((vertical, index) => (
                        <Badge key={index} className={`${getVerticalColor(vertical)} text-xs`}>
                          {vertical}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Badge className={`${getVerticalColor(company.serviceVertical)} text-xs`}>
                      {company.serviceVertical}
                    </Badge>
                  )}
                </div>
              </div>
              {showActions && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onFavorite?.(company)}
                  className={`${TOUCH_FRIENDLY.button} text-pink-600 hover:text-pink-700 hover:bg-pink-50`}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Average Pay */}
              <div className="flex items-center space-x-2">
                <DollarSign className="text-green-600 h-4 w-4" />
                <span className="text-sm text-gray-600">
                  {company.averagePay || 'Pay not specified'}
                </span>
              </div>

              {/* Contract Type */}
              <div className="flex items-center space-x-2">
                <FileText className="text-blue-600 h-4 w-4" />
                <Badge variant="outline" className="text-xs">
                  {company.contractType}
                </Badge>
              </div>

              {/* Vehicle Types */}
              {company.vehicleTypes && company.vehicleTypes.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Truck className="text-purple-600 h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {company.vehicleTypes.slice(0, 2).map((type, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                    {company.vehicleTypes.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{company.vehicleTypes.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Areas Served */}
              {company.areasServed && company.areasServed.length > 0 && (
                <div className="flex items-center space-x-2">
                  <MapPin className="text-red-600 h-4 w-4" />
                  <span className="text-sm text-gray-600 line-clamp-1">
                    {company.areasServed.join(', ')}
                  </span>
                </div>
              )}

              {/* Description */}
              {company.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {company.description}
                </p>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className={`mt-4 ${RESPONSIVE_FLEX.row}`}>
                <Button 
                  size="sm" 
                  onClick={() => onApply?.(company)}
                  className={`${TOUCH_FRIENDLY.button} flex-1 bg-gradient-to-r ${getVerticalGradient(company.serviceVertical)} text-white hover:shadow-lg transition-all duration-300`}
                >
                  <Star className="mr-1 h-3 w-3" />
                  Apply Now
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onViewDetails?.(company)}
                  className={`${TOUCH_FRIENDLY.button} flex-1 border-blue-500 text-blue-600 hover:bg-blue-50`}
                >
                  View Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
