import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Plus, X } from "lucide-react";
import { RESPONSIVE_GRIDS, RESPONSIVE_FLEX, TOUCH_FRIENDLY } from "@/lib/responsive-utils";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  section?: "opportunities" | "applications" | "active";
}

const serviceVerticalOptions = [
  "Food",
  "Package Delivery", 
  "Rideshare",
  "Freight",
  "Medical",
  "Cannabis Delivery",
  "Pet Transport",
  "Child Transport",
  "Senior Services",
  "Air Transport",
  "Vehicle Transport",
  "Other"
];

const contractTypeOptions = [
  "Independent Contractor",
  "Employee",
  "Franchise",
  "Partnership",
  "Other"
];

const vehicleTypeOptions = [
  "Car",
  "SUV", 
  "Pickup Truck - Short Bed",
  "Pickup Truck - Standard Bed",
  "Pickup Truck - Long Bed",
  "Cargo Van - Small (9-10ft)",
  "Cargo Van - Standard (10-12ft)",
  "Cargo Van - Extended (12-14ft)",
  "Cargo Van - High Roof (12-14ft)",
  "Sprinter Van - Standard",
  "Sprinter Van - Extended",
  "Transit Van",
  "ProMaster Van",
  "Box Truck - 10ft",
  "Box Truck - 12ft",
  "Box Truck - 14ft",
  "Box Truck - 16ft",
  "Box Truck - 20ft",
  "Box Truck - 24ft",
  "Box Truck - 26ft",
  "Motorcycle",
  "Bicycle",
  "Walking"
];

export default function AddCompanyModal({ isOpen, onClose, section = "opportunities" }: AddCompanyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    serviceVertical: [] as string[],
    contractType: "Independent Contractor", 
    averagePay: "",
    vehicleTypes: [] as string[],
    areasServed: "",
    insuranceRequirements: "",
    licenseRequirements: "",
    certificationsRequired: [] as string[],
    website: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    yearEstablished: "",
    headquarters: "",
    businessModel: "",
    companyMission: "",
    targetCustomers: "",
    companyCulture: ""
  });

  const [vehicleTypeInput, setVehicleTypeInput] = useState("");
  const [serviceVerticalInput, setServiceVerticalInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");

  const createCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Submitting company data:", data);
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseData.message || 'Failed to create company'}`);
      }
      return responseData;
    },
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      
      // If adding to applications or active sections, also create the appropriate records
      if (section === "applications") {
        createApplicationMutation.mutate({
          companyId: newCompany.id,
          position: "Driver",
          status: "Interested"
        });
      } else if (section === "active") {
        createHiredJobMutation.mutate({
          companyId: newCompany.id,
          position: "Driver",
          startDate: new Date().toISOString()
        });
      }

      toast({
        title: "Company Added",
        description: `${newCompany.name} has been added successfully.`,
      });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      console.error("Company creation error:", error);
      const errorMessage = error.message || "Failed to add company. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  const createApplicationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to create application");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    }
  });

  const createHiredJobMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/hired-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to create hired job");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hired-jobs"] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      serviceVertical: [],
      contractType: "Independent Contractor",
      averagePay: "",
      vehicleTypes: [],
      areasServed: "",
      insuranceRequirements: "",
      licenseRequirements: "",
      certificationsRequired: [],
      website: "",
      contactEmail: "",
      contactPhone: "",
      description: "",
      yearEstablished: "",
      headquarters: "",
      businessModel: "",
      companyMission: "",
      targetCustomers: "",
      companyCulture: ""
    });
    setVehicleTypeInput("");
    setServiceVerticalInput("");
    setCertificationInput("");
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.serviceVertical || formData.serviceVertical.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one service vertical is required.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.contractType || formData.contractType.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Contract type is required.",
        variant: "destructive"
      });
      return;
    }

    // Prepare data for API submission
    const dataToSubmit = {
      ...formData,
      name: formData.name.trim(),
      serviceVertical: formData.serviceVertical,
      contractType: formData.contractType.trim(),
      // Convert string fields to arrays where needed
      areasServed: formData.areasServed ? formData.areasServed.split(',').map(s => s.trim()).filter(s => s) : [],
      vehicleTypes: formData.vehicleTypes,
      certificationsRequired: formData.certificationsRequired
    };

    createCompanyMutation.mutate(dataToSubmit);
  };

  const addServiceVertical = () => {
    if (serviceVerticalInput.trim() && !formData.serviceVertical.includes(serviceVerticalInput.trim())) {
      setFormData({
        ...formData,
        serviceVertical: [...formData.serviceVertical, serviceVerticalInput.trim()]
      });
      setServiceVerticalInput("");
    }
  };

  const removeServiceVertical = (vertical: string) => {
    setFormData({
      ...formData,
      serviceVertical: formData.serviceVertical.filter(v => v !== vertical)
    });
  };

  const addVehicleType = () => {
    if (vehicleTypeInput.trim() && !formData.vehicleTypes.includes(vehicleTypeInput.trim())) {
      setFormData({
        ...formData,
        vehicleTypes: [...formData.vehicleTypes, vehicleTypeInput.trim()]
      });
      setVehicleTypeInput("");
    }
  };

  const removeVehicleType = (type: string) => {
    setFormData({
      ...formData,
      vehicleTypes: formData.vehicleTypes.filter(t => t !== type)
    });
  };

  const addCertification = () => {
    if (certificationInput.trim() && !formData.certificationsRequired.includes(certificationInput.trim())) {
      setFormData({
        ...formData,
        certificationsRequired: [...formData.certificationsRequired, certificationInput.trim()]
      });
      setCertificationInput("");
    }
  };

  const removeCertification = (cert: string) => {
    setFormData({
      ...formData,
      certificationsRequired: formData.certificationsRequired.filter(c => c !== cert)
    });
  };

  const getSectionTitle = () => {
    switch (section) {
      case "applications": return "Add Company to Applications";
      case "active": return "Add Active Company";
      default: return "Add New Company";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Building2 className="w-6 h-6 mr-2" />
            {getSectionTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className={`${RESPONSIVE_GRIDS.twoCol} mt-6`}>
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Company Name *</Label>
                  <Input
                    className={TOUCH_FRIENDLY.input}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
                
                <div>
                  <Label>Service Vertical *</Label>
                  <div className="flex space-x-2">
                    <Select value={serviceVerticalInput} onValueChange={setServiceVerticalInput}>
                      <SelectTrigger className={`flex-1 ${TOUCH_FRIENDLY.select}`}>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceVerticalOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addServiceVertical} size="sm" className={TOUCH_FRIENDLY.button}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.serviceVertical.map(vertical => (
                      <div key={vertical} className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                        {vertical}
                        <button onClick={() => removeServiceVertical(vertical)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Contract Type</Label>
                  <Select value={formData.contractType} onValueChange={(value) => setFormData({...formData, contractType: value})}>
                    <SelectTrigger className={TOUCH_FRIENDLY.select}>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypeOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Average Pay</Label>
                  <Input
                    className={TOUCH_FRIENDLY.input}
                    value={formData.averagePay}
                    onChange={(e) => setFormData({...formData, averagePay: e.target.value})}
                    placeholder="e.g., $15-25/hour"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehicle Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Vehicle Types</Label>
                  <div className="flex space-x-2">
                    <Select value={vehicleTypeInput} onValueChange={setVehicleTypeInput}>
                      <SelectTrigger className={`flex-1 ${TOUCH_FRIENDLY.select}`}>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypeOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addVehicleType} size="sm" className={TOUCH_FRIENDLY.button}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.vehicleTypes.map(type => (
                      <div key={type} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                        {type}
                        <button onClick={() => removeVehicleType(type)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Requirements & Contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Areas Served</Label>
                  <Input
                    className={TOUCH_FRIENDLY.input}
                    value={formData.areasServed}
                    onChange={(e) => setFormData({...formData, areasServed: e.target.value})}
                    placeholder="e.g., Atlanta Metro, Nationwide"
                  />
                </div>

                <div>
                  <Label>Insurance Requirements</Label>
                  <Input
                    className={TOUCH_FRIENDLY.input}
                    value={formData.insuranceRequirements}
                    onChange={(e) => setFormData({...formData, insuranceRequirements: e.target.value})}
                    placeholder="e.g., Commercial Auto Insurance"
                  />
                </div>

                <div>
                  <Label>License Requirements</Label>
                  <Input
                    className={TOUCH_FRIENDLY.input}
                    value={formData.licenseRequirements}
                    onChange={(e) => setFormData({...formData, licenseRequirements: e.target.value})}
                    placeholder="e.g., Valid Driver's License, CDL"
                  />
                </div>

                <div>
                  <Label>Certifications Required</Label>
                  <div className="flex space-x-2">
                    <Input
                      className={TOUCH_FRIENDLY.input}
                      value={certificationInput}
                      onChange={(e) => setCertificationInput(e.target.value)}
                      placeholder="Enter certification"
                      onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                    />
                    <Button onClick={addCertification} size="sm" className={TOUCH_FRIENDLY.button}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.certificationsRequired.map(cert => (
                      <div key={cert} className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                        {cert}
                        <button onClick={() => removeCertification(cert)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Website</Label>
                  <Input
                    className={TOUCH_FRIENDLY.input}
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://company.com"
                  />
                </div>

                <div>
                  <Label>Contact Email</Label>
                  <Input
                    className={TOUCH_FRIENDLY.input}
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    placeholder="contact@company.com"
                  />
                </div>

                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    className={TOUCH_FRIENDLY.input}
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Company Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Company Information (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={RESPONSIVE_GRIDS.twoCol}>
              <div>
                <Label>Year Established</Label>
                <Input
                  className={TOUCH_FRIENDLY.input}
                  value={formData.yearEstablished}
                  onChange={(e) => setFormData({...formData, yearEstablished: e.target.value})}
                  placeholder="2020"
                />
              </div>
              
              <div>
                <Label>Headquarters</Label>
                <Input
                  className={TOUCH_FRIENDLY.input}
                  value={formData.headquarters}
                  onChange={(e) => setFormData({...formData, headquarters: e.target.value})}
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Business Model</Label>
                <Textarea
                  value={formData.businessModel}
                  onChange={(e) => setFormData({...formData, businessModel: e.target.value})}
                  placeholder="Describe the company's business model..."
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Company Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the company..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Approval Message */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            <span className="font-medium">Community Database:</span> Click here to send this company to admin for approval to add to the community database
          </p>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <Button variant="outline" onClick={onClose} className={TOUCH_FRIENDLY.button}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={createCompanyMutation.isPending}
            className={`bg-blue-600 hover:bg-blue-700 ${TOUCH_FRIENDLY.button}`}
          >
            {createCompanyMutation.isPending ? "Adding..." : "Add Company"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}