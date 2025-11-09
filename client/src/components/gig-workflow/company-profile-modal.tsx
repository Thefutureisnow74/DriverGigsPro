import { useState, useEffect } from "react";
import { 
  Building2, 
  X, 
  MapPin, 
  Car, 
  Shield, 
  CreditCard, 
  Globe, 
  Phone, 
  FileText,
  DollarSign,
  Briefcase,
  Calendar,
  Edit,
  Save
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Simplified vehicle type categories
const vehicleTypes = [
  { value: "Car", label: "Car (includes Car, Sedan, Prius, EV, Hybrid)" },
  { value: "SUV", label: "SUV (includes SUV, Luxury SUV)" },
  { value: "Van", label: "Van (includes Van, Cargo Van, Minivan, Sprinter Van, Shuttle)" },
  { value: "Truck", label: "Truck (includes Truck, Pickup Truck, Box Truck, Tractor-Trailer)" },
  { value: "Bike", label: "Bike (includes Bike, Bicycle, Scooter)" },
  { value: "Other", label: "Other (includes everything else)" }
];

interface CompanyProfileModalProps {
  company: any;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedCompany: any) => void;
  isEditable?: boolean;
  showEditButton?: boolean;
}

export default function CompanyProfileModal({
  company,
  isOpen,
  onClose,
  onSave,
  isEditable = false,
  showEditButton = true
}: CompanyProfileModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedCompany, setEditedCompany] = useState(company);

  // Update editedCompany when company prop changes
  useEffect(() => {
    // Convert arrays to strings for editing
    const formattedCompany = {
      ...company,
      vehicleTypes: Array.isArray(company.vehicleTypes) 
        ? company.vehicleTypes.join(', ')
        : company.vehicleTypes || '',
      areasServed: Array.isArray(company.areasServed)
        ? company.areasServed.join(', ')
        : company.areasServed || ''
    };
    setEditedCompany(formattedCompany);
  }, [company]);

  const handleSave = () => {
    if (onSave) {
      // Transform the data before saving
      const transformedCompany = {
        ...editedCompany,
        // Convert comma-separated strings to arrays
        vehicleTypes: typeof editedCompany.vehicleTypes === 'string' 
          ? editedCompany.vehicleTypes.split(',').map((s: string) => s.trim()).filter((s: string) => s)
          : editedCompany.vehicleTypes,
        areasServed: typeof editedCompany.areasServed === 'string'
          ? editedCompany.areasServed.split(',').map((s: string) => s.trim()).filter((s: string) => s)
          : editedCompany.areasServed
      };
      onSave(transformedCompany);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedCompany(company);
    setEditMode(false);
  };

  if (!company) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="text-white w-8 h-8" />
              </div>
              <div>
                {editMode ? (
                  <Input
                    value={editedCompany.name}
                    onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })}
                    className="text-2xl font-bold border-0 p-0 h-auto bg-transparent"
                  />
                ) : (
                  <DialogTitle className="text-2xl font-bold text-gray-900">{company.name}</DialogTitle>
                )}
                {editMode ? (
                  <div className="space-y-2 mt-2">
                    <Select 
                      value={editedCompany.serviceVertical || ''}
                      onValueChange={(value) => setEditedCompany({ ...editedCompany, serviceVertical: value })}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select service vertical" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food Delivery">Food Delivery</SelectItem>
                        <SelectItem value="Package Delivery">Package Delivery</SelectItem>
                        <SelectItem value="Rideshare">Rideshare</SelectItem>
                        <SelectItem value="Freight">Freight</SelectItem>
                        <SelectItem value="Medical">Medical</SelectItem>
                        <SelectItem value="Pet Transport">Pet Transport</SelectItem>
                        <SelectItem value="Child Transport">Child Transport</SelectItem>
                        <SelectItem value="Senior Services">Senior Services</SelectItem>
                        <SelectItem value="Air Transport">🛫 Air Transport</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="text-lg text-gray-600 mt-1">{company.serviceVertical}</p>
                )}
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className="bg-green-100 text-green-800 font-semibold">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {company.averagePay || 'Contact for rates'}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {company.contractType || 'Independent Contractor'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditable && (
                <>
                  {editMode ? (
                    <>
                      <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditMode(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </>
              )}
              <Button variant="outline" onClick={onClose} size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>



        <div className="mt-6 space-y-8">
          {/* Company Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Building2 className="w-6 h-6 mr-3 text-blue-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Year Established</Label>
                    <Input
                      value={editedCompany.yearEstablished || ''}
                      onChange={(e) => setEditedCompany({ ...editedCompany, yearEstablished: e.target.value })}
                      placeholder="2015"
                      type="number"
                    />
                  </div>
                  <div>
                    <Label>Company Size</Label>
                    <Select 
                      value={editedCompany.companySize || ''}
                      onValueChange={(value) => setEditedCompany({ ...editedCompany, companySize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Startup (1-10 employees)">Startup (1-10 employees)</SelectItem>
                        <SelectItem value="Small (11-50 employees)">Small (11-50 employees)</SelectItem>
                        <SelectItem value="Medium (51-200 employees)">Medium (51-200 employees)</SelectItem>
                        <SelectItem value="Large (201-1000 employees)">Large (201-1000 employees)</SelectItem>
                        <SelectItem value="Enterprise (1000+ employees)">Enterprise (1000+ employees)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Company Headquarters</Label>
                    <Input
                      value={editedCompany.headquarters || ''}
                      onChange={(e) => setEditedCompany({ ...editedCompany, headquarters: e.target.value })}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <Label>Business Model</Label>
                    <Select 
                      value={editedCompany.businessModel || ''}
                      onValueChange={(value) => setEditedCompany({ ...editedCompany, businessModel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology Platform">Technology Platform</SelectItem>
                        <SelectItem value="Logistics & Transportation">Logistics & Transportation</SelectItem>
                        <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                        <SelectItem value="Healthcare Services">Healthcare Services</SelectItem>
                        <SelectItem value="Retail & E-commerce">Retail & E-commerce</SelectItem>
                        <SelectItem value="Financial Services">Financial Services</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Company Mission & What They Do</Label>
                    <Textarea
                      value={editedCompany.companyMission || ''}
                      onChange={(e) => setEditedCompany({ ...editedCompany, companyMission: e.target.value })}
                      placeholder="Describe the company's mission, primary services, and what they do..."
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Target Customers & Market</Label>
                    <Textarea
                      value={editedCompany.targetCustomers || ''}
                      onChange={(e) => setEditedCompany({ ...editedCompany, targetCustomers: e.target.value })}
                      placeholder="Describe who the company serves, their target market, customer demographics..."
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Company Culture & Values</Label>
                    <Textarea
                      value={editedCompany.companyCulture || ''}
                      onChange={(e) => setEditedCompany({ ...editedCompany, companyCulture: e.target.value })}
                      placeholder="Describe the company culture, values, work environment, and employee benefits..."
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Year Established</Label>
                      <p className="text-sm text-gray-900 mt-1">{company.yearEstablished || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Company Size</Label>
                      <p className="text-sm text-gray-900 mt-1">{company.companySize || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Headquarters</Label>
                      <p className="text-sm text-gray-900 mt-1">{company.headquarters || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Business Model</Label>
                      <p className="text-sm text-gray-900 mt-1">{company.businessModel || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Company Mission & What They Do</Label>
                      <p className="text-sm text-gray-900 mt-1 leading-relaxed">
                        {company.companyMission || 'Company mission and services information not available.'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Target Customers & Market</Label>
                      <p className="text-sm text-gray-900 mt-1 leading-relaxed">
                        {company.targetCustomers || 'Target customer information not available.'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Company Culture & Values</Label>
                      <p className="text-sm text-gray-900 mt-1 leading-relaxed">
                        {company.companyCulture || 'Company culture information not available.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
            {/* Vehicle Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Car className="w-5 h-5 mr-2 text-purple-600" />
                  Vehicle Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-2">
                    <Label>Vehicle Types (comma-separated)</Label>
                    <Input
                      value={editedCompany.vehicleTypes || ''}
                      onChange={(e) => setEditedCompany({ ...editedCompany, vehicleTypes: e.target.value })}
                      placeholder="Car, SUV, Van, etc."
                    />
                  </div>
                ) : (
                  company.vehicleTypes && company.vehicleTypes.length > 0 ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Accepted Vehicle Types</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {company.vehicleTypes.map((type: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No specific vehicle requirements listed</p>
                  )
                )}
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Service Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-2">
                    <Label>Service Areas (comma-separated)</Label>
                    <Textarea
                      value={editedCompany.areasServed || ''}
                      onChange={(e) => setEditedCompany({ ...editedCompany, areasServed: e.target.value })}
                      placeholder="Atlanta, Dallas, Houston, etc."
                      rows={3}
                    />
                  </div>
                ) : (
                  company.areasServed && company.areasServed.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {company.areasServed.map((area: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Service areas not specified</p>
                  )
                )}
              </CardContent>
            </Card>

            {/* Insurance Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Insurance Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-2">
                    <Label>Insurance Requirements</Label>
                    <Textarea
                      value={editedCompany.insuranceRequirements || ''}
                      onChange={(e) => setEditedCompany({ ...editedCompany, insuranceRequirements: e.target.value })}
                      placeholder="Liability insurance requirements, coverage amounts, etc."
                      rows={3}
                    />
                  </div>
                ) : (
                  company.insuranceRequirements ? (
                    <p className="text-sm text-gray-700">{company.insuranceRequirements}</p>
                  ) : (
                    <p className="text-gray-500 text-sm">Insurance requirements not specified</p>
                  )
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={editedCompany.website || ''}
                        onChange={(e) => setEditedCompany({ ...editedCompany, website: e.target.value })}
                        placeholder="company.com"
                      />
                    </div>
                    <div>
                      <Label>Contact Phone</Label>
                      <Input
                        value={editedCompany.contactPhone || ''}
                        onChange={(e) => setEditedCompany({ ...editedCompany, contactPhone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {company.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <a 
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}
                    {company.contactPhone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-green-500" />
                        <a 
                          href={`tel:${company.contactPhone}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          {company.contactPhone}
                        </a>
                      </div>
                    )}
                    {!company.website && !company.contactPhone && (
                      <p className="text-gray-500 text-sm">Contact information not available</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contract Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-600" />
                  Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Contract Type</Label>
                      <Select 
                        value={editedCompany.contractType || ''}
                        onValueChange={(value) => setEditedCompany({ ...editedCompany, contractType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Independent Contractor">Independent Contractor</SelectItem>
                          <SelectItem value="W-2 Employee">W-2 Employee</SelectItem>
                          <SelectItem value="Seasonal">Seasonal</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Average Pay</Label>
                      <Input
                        value={editedCompany.averagePay || ''}
                        onChange={(e) => setEditedCompany({ ...editedCompany, averagePay: e.target.value })}
                        placeholder="$15-25/hour or $200-500/week"
                      />
                    </div>
                    <div>
                      <Label>License Requirements</Label>
                      <Textarea
                        value={editedCompany.licenseRequirements || ''}
                        onChange={(e) => setEditedCompany({ ...editedCompany, licenseRequirements: e.target.value })}
                        placeholder="Valid driver's license, CDL, etc."
                        rows={2}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Contract Type</Label>
                      <p className="text-sm text-gray-900 mt-1">{company.contractType || 'Independent Contractor'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Average Pay</Label>
                      <p className="text-sm text-gray-900 mt-1">{company.averagePay || 'Contact company for rates'}</p>
                    </div>
                    {company.licenseRequirements && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">License Requirements</Label>
                        <p className="text-sm text-gray-900 mt-1">{company.licenseRequirements}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Additional Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                  Requirements & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Required Certifications</Label>
                      <Textarea
                        value={editedCompany.certifications || ''}
                        onChange={(e) => setEditedCompany({ ...editedCompany, certifications: e.target.value })}
                        placeholder="Food handler's permit, background check, etc."
                        rows={2}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {company.certifications && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Required Certifications</Label>
                        <p className="text-sm text-gray-900 mt-1">{company.certifications}</p>
                      </div>
                    )}
                    {!company.certifications && (
                      <p className="text-gray-500 text-sm">No specific certifications required</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}