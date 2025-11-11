import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Car, Edit3, Trash2, ExternalLink, Upload, Download, X, Wrench, CheckCircle, Clock, AlertTriangle, Calendar, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { Vehicle, InsertVehicle, VehicleDocument } from "@shared/schema";

// Empty vehicle template - no pre-filled data
const VEHICLE_TEMPLATE = {
  nickname: "",
  year: "",
  make: "",
  model: "",
  vehicleType: "",
  color: "",
  vin: "",
  licensePlate: "",
  state: "",
  mileage: "",
  fuelType: "Gasoline",
  mpg: "",
  status: "active",
  ownerName: "",
  purchaseLocation: "",
  // Financial Information
  purchaseDate: "",
  purchasePrice: "",
  currentValue: "",
  monthlyPayment: "",
  interestRate: "",
  loanTerm: "",
  financeCompany: "",
  downPayment: "",
  loanStartDate: "",
  firstPaymentDue: "",
  finalPaymentDue: "",
  remainingBalance: "",
  loanAccountNumber: "",
  financeCompanyPhone: "",
  financeCompanyContact: "",
  // Vehicle Specifications
  vehicleWeight: "",
  exteriorLength: "",
  exteriorWidth: "",
  exteriorHeight: "",
  cargoLength: "",
  cargoWidth: "",
  cargoHeight: "",
  cargoVolume: "",
  payloadCapacity: "",
  towingCapacity: "",
  engineType: "",
  transmission: "",
  // Insurance Information
  insuranceCompanyName: "",
  insuranceType: "",
  insuranceTypeOther: "",
  insuranceMonthlyPremium: "",
  insurancePremiumDueDate: "",
  insuranceTotalCoverage: "",
  insurancePhoneNumber: "",
  insuranceRepresentativeName: "",
  insurancePolicyNumber: "",
  // Detailed Insurance Coverage Information
  bodilyInjuryCoverageLimit: "",
  bodilyInjuryPremium: "",
  bodilyInjuryDeductible: "",
  propertyDamageCoverageLimit: "",
  propertyDamagePremium: "",
  propertyDamageDeductible: "",
  personalInjuryProtectionStatus: "",
  personalInjuryProtectionLimit: "",
  personalInjuryProtectionPremium: "",
  personalInjuryProtectionDeductible: "",
  uninsuredMotoristBIStatus: "",
  uninsuredMotoristBILimit: "",
  uninsuredMotoristBIPremium: "",
  uninsuredMotoristBIDeductible: "",
  uninsuredMotoristPDStatus: "",
  uninsuredMotoristPDLimit: "",
  uninsuredMotoristPDPremium: "",
  uninsuredMotoristPDDeductible: "",
  accidentalDeathBenefitAmount: "",
  fullTermPremium: "",
  notes: ""
};

export default function MyFleetNew() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleDocuments, setVehicleDocuments] = useState<VehicleDocument[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  
  // Maintenance checklist state
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [selectedVehicleForMaintenance, setSelectedVehicleForMaintenance] = useState<number | null>(null);
  const [maintenanceItems, setMaintenanceItems] = useState<any[]>([]);
  const [isAddMaintenanceItemOpen, setIsAddMaintenanceItemOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('maintenance');
  const [newMaintenanceItem, setNewMaintenanceItem] = useState({
    itemName: '',
    category: 'maintenance',
    description: '',
    notes: '',
    dueDate: '',
    priority: 'medium',
    cost: '',
    serviceProvider: '',
    reminderEnabled: false,
    reminderDays: 7
  });
  
  // Fetch vehicles with forced refresh
  const { data: vehicles = [], isLoading, refetch } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Fetch maintenance items for selected vehicle
  const { data: maintenanceItemsData = [], isLoading: isLoadingMaintenanceItems } = useQuery({
    queryKey: [`/api/vehicles/${selectedVehicleForMaintenance}/maintenance-items`],
    enabled: !!selectedVehicleForMaintenance,
  });

  // Maintenance mutations
  const createMaintenanceItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      return await apiRequest(`/api/vehicles/${selectedVehicleForMaintenance}/maintenance-items`, { method: "POST", body: itemData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${selectedVehicleForMaintenance}/maintenance-items`] });
      setIsAddMaintenanceItemOpen(false);
      setNewMaintenanceItem({
        itemName: '',
        category: 'maintenance',
        description: '',
        notes: '',
        dueDate: '',
        priority: 'medium',
        cost: '',
        serviceProvider: '',
        reminderEnabled: false,
        reminderDays: 7
      });
    }
  });

  const updateMaintenanceItemMutation = useMutation({
    mutationFn: async ({ itemId, updates }: { itemId: number; updates: any }) => {
      return await apiRequest(`/api/vehicles/${selectedVehicleForMaintenance}/maintenance-items/${itemId}`, { method: "PUT", body: updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${selectedVehicleForMaintenance}/maintenance-items`] });
    }
  });

  const deleteMaintenanceItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await apiRequest(`/api/vehicles/${selectedVehicleForMaintenance}/maintenance-items/${itemId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${selectedVehicleForMaintenance}/maintenance-items`] });
    }
  });

  // Force refresh when component mounts
  React.useEffect(() => {
    console.log('MyFleet: Forcing data refresh...');
    refetch();
  }, [refetch]);

  // Debug logging
  React.useEffect(() => {
    console.log('MyFleet: Current vehicles data:', vehicles);
    console.log('MyFleet: Is loading:', isLoading);
    console.log('MyFleet: Vehicles length:', vehicles?.length);
  }, [vehicles, isLoading]);

  // Fetch documents when editing a vehicle
  const fetchVehicleDocuments = async (vehicleId: number) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/documents`);
      if (response.ok) {
        const documents: VehicleDocument[] = await response.json();
        setVehicleDocuments(documents);
      } else {
        setVehicleDocuments([]);
      }
    } catch (error) {
      console.error("Failed to fetch vehicle documents:", error);
      setVehicleDocuments([]);
    }
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList, vehicleId: number, documentCategory: string) => {
    if (!files || files.length === 0) return;

    const uploadKey = `${vehicleId}-${documentCategory}`;
    setUploadingFiles(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('documentCategory', documentCategory);

      const response = await fetch(`/api/vehicles/${vehicleId}/documents`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      toast({
        title: "Success",
        description: result.message,
      });

      // Refresh documents
      await fetchVehicleDocuments(vehicleId);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingFiles(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId: number) => {
    try {
      await apiRequest(`/api/vehicles/documents/${documentId}`, { method: "DELETE" });
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      // Refresh documents
      if (selectedVehicle) {
        await fetchVehicleDocuments(selectedVehicle.id);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add vehicle mutation
  const addVehicleMutation = useMutation({
    mutationFn: async (vehicleData: InsertVehicle) => {
      return await apiRequest("/api/vehicles", { method: "POST", body: vehicleData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      });
      console.error("Add vehicle error:", error);
    },
  });

  // Update vehicle mutation
  const updateVehicleMutation = useMutation({
    mutationFn: async (vehicleData: any) => {
      return await apiRequest(`/api/vehicles/${selectedVehicle?.id}`, { method: "PUT", body: vehicleData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      setShowEditDialog(false);
      setSelectedVehicle(null);
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive",
      });
      console.error("Update vehicle error:", error);
    },
  });

  // Delete vehicle mutation
  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/vehicles/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive",
      });
      console.error("Delete vehicle error:", error);
    },
  });

  const handleAddVehicle = (formData: FormData) => {
    if (!user?.id) return;
    
    const vehicleData: InsertVehicle = {
      userId: user.id.toString(),
      nickname: formData.get('nickname') as string,
      year: formData.get('year') as string,
      make: formData.get('make') as string,
      model: formData.get('model') as string,
      vehicleType: formData.get('vehicleType') as string,
      color: formData.get('color') as string,
      vin: formData.get('vin') as string,
      licensePlate: formData.get('licensePlate') as string,
      state: formData.get('state') as string,
      mileage: parseInt(formData.get('mileage') as string) || 0,
      fuelType: formData.get('fuelType') as string || 'Gasoline',
      mpg: parseInt(formData.get('mpg') as string) || 0,
      status: formData.get('status') as string || 'active',
      // Financial Information
      purchaseDate: formData.get('purchaseDate') ? new Date(formData.get('purchaseDate') as string) : undefined,
      purchasePrice: (() => {
        const priceValue = formData.get('purchasePrice') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return priceValue ? priceValue.replace(/[^\d.]/g, '') : '';
      })(),
      currentValue: (() => {
        const valueValue = formData.get('currentValue') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return valueValue ? valueValue.replace(/[^\d.]/g, '') : '';
      })(),
      monthlyPayment: (() => {
        const paymentValue = formData.get('monthlyPayment') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return paymentValue ? paymentValue.replace(/[^\d.]/g, '') : '';
      })(),
      interestRate: formData.get('interestRate') as string,
      loanTerm: parseInt(formData.get('loanTerm') as string) || undefined,
      financeCompany: formData.get('financeCompany') as string,
      downPayment: (() => {
        const downValue = formData.get('downPayment') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return downValue ? downValue.replace(/[^\d.]/g, '') : '';
      })(),
      loanStartDate: formData.get('loanStartDate') ? new Date(formData.get('loanStartDate') as string) : undefined,
      firstPaymentDue: formData.get('firstPaymentDue') ? new Date(formData.get('firstPaymentDue') as string) : undefined,
      finalPaymentDue: formData.get('finalPaymentDue') ? new Date(formData.get('finalPaymentDue') as string) : undefined,
      remainingBalance: (() => {
        const balanceValue = formData.get('remainingBalance') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return balanceValue ? balanceValue.replace(/[^\d.]/g, '') : '';
      })(),
      loanAccountNumber: formData.get('loanAccountNumber') as string,
      financeCompanyPhone: formData.get('financeCompanyPhone') as string,
      financeCompanyContact: formData.get('financeCompanyContact') as string,
      // Vehicle Specifications
      vehicleWeight: parseInt(formData.get('vehicleWeight') as string) || undefined,
      exteriorLength: formData.get('exteriorLength') as string,
      exteriorWidth: formData.get('exteriorWidth') as string,
      exteriorHeight: formData.get('exteriorHeight') as string,
      cargoLength: formData.get('cargoLength') as string,
      cargoWidth: formData.get('cargoWidth') as string,
      cargoHeight: formData.get('cargoHeight') as string,
      cargoVolume: formData.get('cargoVolume') as string,
      payloadCapacity: parseInt(formData.get('payloadCapacity') as string) || undefined,
      towingCapacity: parseInt(formData.get('towingCapacity') as string) || undefined,
      engineType: formData.get('engineType') as string,
      transmission: formData.get('transmission') as string,
      // Insurance Information
      insuranceCompanyName: formData.get('insuranceCompanyName') as string,
      insuranceType: formData.get('insuranceType') as string,
      insuranceTypeOther: formData.get('insuranceTypeOther') as string,
      insuranceMonthlyPremium: (() => {
        const premiumValue = formData.get('insuranceMonthlyPremium') as string;
        // Extract raw numeric value from formatted string  
        return premiumValue ? premiumValue.replace(/[^\d.]/g, '') : '';
      })(),
      insurancePremiumDueDate: formData.get('insurancePremiumDueDate') ? new Date(formData.get('insurancePremiumDueDate') as string) : undefined,
      insuranceTotalCoverage: (() => {
        const coverageValue = formData.get('insuranceTotalCoverage') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return coverageValue ? coverageValue.replace(/[^\d]/g, '') : '';
      })(),
      insurancePhoneNumber: formData.get('insurancePhoneNumber') as string,
      insuranceRepresentativeName: formData.get('insuranceRepresentativeName') as string,
      insurancePolicyNumber: formData.get('insurancePolicyNumber') as string,
      // CRITICAL FIX: Insurance Start and Expiration Date fields
      insuranceStartDate: formData.get('insuranceStartDate') ? new Date(formData.get('insuranceStartDate') as string) : undefined,
      insuranceExpiry: formData.get('insuranceExpiry') ? new Date(formData.get('insuranceExpiry') as string) : undefined,
      // Detailed Insurance Coverage Information
      bodilyInjuryCoverageLimit: formData.get('bodilyInjuryCoverageLimit') as string,
      bodilyInjuryPremium: formData.get('bodilyInjuryPremium') as string,
      bodilyInjuryDeductible: formData.get('bodilyInjuryDeductible') as string,
      propertyDamageCoverageLimit: formData.get('propertyDamageCoverageLimit') as string,
      propertyDamagePremium: formData.get('propertyDamagePremium') as string,
      propertyDamageDeductible: formData.get('propertyDamageDeductible') as string,
      personalInjuryProtectionStatus: formData.get('personalInjuryProtectionStatus') as string,
      personalInjuryProtectionLimit: formData.get('personalInjuryProtectionLimit') as string,
      personalInjuryProtectionPremium: formData.get('personalInjuryProtectionPremium') as string,
      personalInjuryProtectionDeductible: formData.get('personalInjuryProtectionDeductible') as string,
      uninsuredMotoristBIStatus: formData.get('uninsuredMotoristBIStatus') as string,
      uninsuredMotoristBILimit: formData.get('uninsuredMotoristBILimit') as string,
      uninsuredMotoristBIPremium: formData.get('uninsuredMotoristBIPremium') as string,
      uninsuredMotoristBIDeductible: formData.get('uninsuredMotoristBIDeductible') as string,
      uninsuredMotoristPDStatus: formData.get('uninsuredMotoristPDStatus') as string,
      uninsuredMotoristPDLimit: formData.get('uninsuredMotoristPDLimit') as string,
      uninsuredMotoristPDPremium: formData.get('uninsuredMotoristPDPremium') as string,
      uninsuredMotoristPDDeductible: formData.get('uninsuredMotoristPDDeductible') as string,
      accidentalDeathBenefitAmount: formData.get('accidentalDeathBenefitAmount') as string,
      fullTermPremium: formData.get('fullTermPremium') as string,
      notes: formData.get('notes') as string,
    };
    
    addVehicleMutation.mutate(vehicleData);
  };

  const handleUpdateVehicle = (formData: FormData) => {
    if (!selectedVehicle) return;
    
    // Prepare vehicle data for API - use raw form values and let backend handle conversion
    const vehicleData = {
      nickname: formData.get('nickname') as string,
      year: formData.get('year') as string,
      make: formData.get('make') as string,
      model: formData.get('model') as string,
      vehicleType: formData.get('vehicleType') as string,
      color: formData.get('color') as string,
      vin: formData.get('vin') as string,
      licensePlate: formData.get('licensePlate') as string,
      state: formData.get('state') as string,
      mileage: parseInt(formData.get('mileage') as string) || selectedVehicle.mileage,
      fuelType: formData.get('fuelType') as string || selectedVehicle.fuelType,
      mpg: parseInt(formData.get('mpg') as string) || selectedVehicle.mpg,
      status: formData.get('status') as string || selectedVehicle.status,
      // Financial Information - keep as strings for API
      purchaseDate: formData.get('purchaseDate') as string || null,
      purchasePrice: (() => {
        const priceValue = formData.get('purchasePrice') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return priceValue ? priceValue.replace(/[^\d.]/g, '') : selectedVehicle.purchasePrice;
      })(),
      currentValue: (() => {
        const valueValue = formData.get('currentValue') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return valueValue ? valueValue.replace(/[^\d.]/g, '') : selectedVehicle.currentValue;
      })(),
      monthlyPayment: (() => {
        const paymentValue = formData.get('monthlyPayment') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return paymentValue ? paymentValue.replace(/[^\d.]/g, '') : selectedVehicle.monthlyPayment;
      })(),
      interestRate: formData.get('interestRate') as string || selectedVehicle.interestRate,
      loanTerm: parseInt(formData.get('loanTerm') as string) || selectedVehicle.loanTerm,
      financeCompany: formData.get('financeCompany') as string || selectedVehicle.financeCompany,
      downPayment: (() => {
        const downValue = formData.get('downPayment') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return downValue ? downValue.replace(/[^\d.]/g, '') : selectedVehicle.downPayment;
      })(),
      loanStartDate: formData.get('loanStartDate') as string || null,
      firstPaymentDue: formData.get('firstPaymentDue') as string || null,
      finalPaymentDue: formData.get('finalPaymentDue') as string || null,
      remainingBalance: (() => {
        const balanceValue = formData.get('remainingBalance') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return balanceValue ? balanceValue.replace(/[^\d.]/g, '') : selectedVehicle.remainingBalance;
      })(),
      loanAccountNumber: formData.get('loanAccountNumber') as string || selectedVehicle.loanAccountNumber,
      financeCompanyPhone: formData.get('financeCompanyPhone') as string || selectedVehicle.financeCompanyPhone,
      financeCompanyContact: formData.get('financeCompanyContact') as string || selectedVehicle.financeCompanyContact,
      // Vehicle Specifications
      vehicleWeight: parseInt(formData.get('vehicleWeight') as string) || selectedVehicle.vehicleWeight,
      exteriorLength: formData.get('exteriorLength') as string || selectedVehicle.exteriorLength,
      exteriorWidth: formData.get('exteriorWidth') as string || selectedVehicle.exteriorWidth,
      exteriorHeight: formData.get('exteriorHeight') as string || selectedVehicle.exteriorHeight,
      cargoLength: formData.get('cargoLength') as string || selectedVehicle.cargoLength,
      cargoWidth: formData.get('cargoWidth') as string || selectedVehicle.cargoWidth,
      cargoHeight: formData.get('cargoHeight') as string || selectedVehicle.cargoHeight,
      cargoVolume: formData.get('cargoVolume') as string || selectedVehicle.cargoVolume,
      payloadCapacity: parseInt(formData.get('payloadCapacity') as string) || selectedVehicle.payloadCapacity,
      towingCapacity: parseInt(formData.get('towingCapacity') as string) || selectedVehicle.towingCapacity,
      engineType: formData.get('engineType') as string || selectedVehicle.engineType,
      transmission: formData.get('transmission') as string || selectedVehicle.transmission,
      // Insurance Information
      insuranceCompanyName: formData.get('insuranceCompanyName') as string || selectedVehicle.insuranceCompanyName,
      insuranceType: formData.get('insuranceType') as string || selectedVehicle.insuranceType,
      insuranceTypeOther: formData.get('insuranceTypeOther') as string || selectedVehicle.insuranceTypeOther,
      insuranceMonthlyPremium: (() => {
        const premiumValue = formData.get('insuranceMonthlyPremium') as string;
        // Extract raw numeric value from formatted string
        return premiumValue ? premiumValue.replace(/[^\d.]/g, '') : selectedVehicle.insuranceMonthlyPremium;
      })(),
      insurancePremiumDueDate: formData.get('insurancePremiumDueDate') as string || selectedVehicle.insurancePremiumDueDate,
      insuranceTotalCoverage: (() => {
        const coverageValue = formData.get('insuranceTotalCoverage') as string;
        // Extract raw numeric value from formatted string (remove commas and other formatting)
        return coverageValue ? coverageValue.replace(/[^\d]/g, '') : selectedVehicle.insuranceTotalCoverage;
      })(),
      insurancePhoneNumber: formData.get('insurancePhoneNumber') as string || selectedVehicle.insurancePhoneNumber,
      insuranceRepresentativeName: formData.get('insuranceRepresentativeName') as string || selectedVehicle.insuranceRepresentativeName,
      insurancePolicyNumber: formData.get('insurancePolicyNumber') as string || selectedVehicle.insurancePolicyNumber,
      // CRITICAL FIX: Insurance Start and Expiration Date fields
      insuranceStartDate: formData.get('insuranceStartDate') as string || null,
      insuranceExpiry: formData.get('insuranceExpiry') as string || null,
      // Detailed Insurance Coverage Information
      bodilyInjuryCoverageLimit: formData.get('bodilyInjuryCoverageLimit') as string || selectedVehicle.bodilyInjuryCoverageLimit,
      bodilyInjuryPremium: formData.get('bodilyInjuryPremium') as string || selectedVehicle.bodilyInjuryPremium,
      bodilyInjuryDeductible: formData.get('bodilyInjuryDeductible') as string || selectedVehicle.bodilyInjuryDeductible,
      propertyDamageCoverageLimit: formData.get('propertyDamageCoverageLimit') as string || selectedVehicle.propertyDamageCoverageLimit,
      propertyDamagePremium: formData.get('propertyDamagePremium') as string || selectedVehicle.propertyDamagePremium,
      propertyDamageDeductible: formData.get('propertyDamageDeductible') as string || selectedVehicle.propertyDamageDeductible,
      personalInjuryProtectionStatus: formData.get('personalInjuryProtectionStatus') as string || selectedVehicle.personalInjuryProtectionStatus,
      personalInjuryProtectionLimit: formData.get('personalInjuryProtectionLimit') as string || selectedVehicle.personalInjuryProtectionLimit,
      personalInjuryProtectionPremium: formData.get('personalInjuryProtectionPremium') as string || selectedVehicle.personalInjuryProtectionPremium,
      personalInjuryProtectionDeductible: formData.get('personalInjuryProtectionDeductible') as string || selectedVehicle.personalInjuryProtectionDeductible,
      uninsuredMotoristBIStatus: formData.get('uninsuredMotoristBIStatus') as string || selectedVehicle.uninsuredMotoristBIStatus,
      uninsuredMotoristBILimit: formData.get('uninsuredMotoristBILimit') as string || selectedVehicle.uninsuredMotoristBILimit,
      uninsuredMotoristBIPremium: formData.get('uninsuredMotoristBIPremium') as string || selectedVehicle.uninsuredMotoristBIPremium,
      uninsuredMotoristBIDeductible: formData.get('uninsuredMotoristBIDeductible') as string || selectedVehicle.uninsuredMotoristBIDeductible,
      uninsuredMotoristPDStatus: formData.get('uninsuredMotoristPDStatus') as string || selectedVehicle.uninsuredMotoristPDStatus,
      uninsuredMotoristPDLimit: formData.get('uninsuredMotoristPDLimit') as string || selectedVehicle.uninsuredMotoristPDLimit,
      uninsuredMotoristPDPremium: formData.get('uninsuredMotoristPDPremium') as string || selectedVehicle.uninsuredMotoristPDPremium,
      uninsuredMotoristPDDeductible: formData.get('uninsuredMotoristPDDeductible') as string || selectedVehicle.uninsuredMotoristPDDeductible,
      accidentalDeathBenefitAmount: formData.get('accidentalDeathBenefitAmount') as string || selectedVehicle.accidentalDeathBenefitAmount,
      fullTermPremium: formData.get('fullTermPremium') as string || selectedVehicle.fullTermPremium,
      notes: formData.get('notes') as string || selectedVehicle.notes,
    };
    
    console.log('Updating vehicle with data:', vehicleData);
    updateVehicleMutation.mutate(vehicleData);
  };

  const handleDeleteVehicle = (id: number) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicleMutation.mutate(id);
    }
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditDialog(true);
    // Fetch documents when opening edit dialog
    fetchVehicleDocuments(vehicle.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Fleet</h1>
          <p className="text-muted-foreground">Manage your vehicles and track their details</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => window.open('https://www.cargurus.com', '_blank')}
            variant="outline"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 hover:from-purple-600 hover:to-purple-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Where to Buy a Vehicle
          </Button>
          <Button 
            onClick={() => window.open('/car-rentals', '_blank')}
            variant="outline"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 hover:from-green-600 hover:to-green-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Where to Rent A Vehicle
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <DialogTitle>Add New Vehicle</DialogTitle>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" form="add-vehicle-form" disabled={addVehicleMutation.isPending}>
                    {addVehicleMutation.isPending ? 'Adding...' : 'Add Vehicle'}
                  </Button>
                </div>
              </DialogHeader>
              <form id="add-vehicle-form" onSubmit={(e) => {
                e.preventDefault();
                handleAddVehicle(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Vehicle Nickname *</Label>
                    <Input id="nickname" name="nickname" defaultValue={VEHICLE_TEMPLATE.nickname} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" name="year" type="text" defaultValue={VEHICLE_TEMPLATE.year} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="make">Make *</Label>
                    <Input id="make" name="make" defaultValue={VEHICLE_TEMPLATE.make} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input id="model" name="model" defaultValue={VEHICLE_TEMPLATE.model} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select name="vehicleType" defaultValue={VEHICLE_TEMPLATE.vehicleType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80 overflow-y-auto">
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Pickup Truck Short Bed: 5 - 6 ft">Pickup Truck Short Bed: 5 - 6 ft</SelectItem>
                        <SelectItem value="Pickup Truck Standard Bed: 6 - 6.75 ft">Pickup Truck Standard Bed: 6 - 6.75 ft</SelectItem>
                        <SelectItem value="Pickup Truck Long Bed: 8 - 8.5 ft">Pickup Truck Long Bed: 8 - 8.5 ft</SelectItem>
                        <SelectItem value="Small Cargo Van: 9 - 10 ft">Small Cargo Van: 9 - 10 ft</SelectItem>
                        <SelectItem value="Standard Cargo Van: 10 - 12 ft">Standard Cargo Van: 10 - 12 ft</SelectItem>
                        <SelectItem value="Extended Cargo Van: 12 - 14 ft">Extended Cargo Van: 12 - 14 ft</SelectItem>
                        <SelectItem value="High Roof Cargo Van: 12 - 14 ft (taller interior)">High Roof Cargo Van: 12 - 14 ft (taller interior)</SelectItem>
                        <SelectItem value="Sprinter Van Standard: 12 - 14 ft">Sprinter Van Standard: 12 - 14 ft</SelectItem>
                        <SelectItem value="Sprinter Van Extended: 14 - 16 ft">Sprinter Van Extended: 14 - 16 ft</SelectItem>
                        <SelectItem value="Transit Van: 10 - 14 ft">Transit Van: 10 - 14 ft</SelectItem>
                        <SelectItem value="ProMaster Van: 10 - 14 ft">ProMaster Van: 10 - 14 ft</SelectItem>
                        <SelectItem value="10 ft Box Truck: 10 ft">10 ft Box Truck: 10 ft</SelectItem>
                        <SelectItem value="12 ft Box Truck: 12 ft">12 ft Box Truck: 12 ft</SelectItem>
                        <SelectItem value="14 ft Box Truck: 14 ft">14 ft Box Truck: 14 ft</SelectItem>
                        <SelectItem value="16 ft Box Truck: 16 ft">16 ft Box Truck: 16 ft</SelectItem>
                        <SelectItem value="18 ft Box Truck: 18 ft">18 ft Box Truck: 18 ft</SelectItem>
                        <SelectItem value="20 ft Box Truck: 20 ft">20 ft Box Truck: 20 ft</SelectItem>
                        <SelectItem value="22 ft Box Truck: 22 ft">22 ft Box Truck: 22 ft</SelectItem>
                        <SelectItem value="24 ft Box Truck: 24 ft">24 ft Box Truck: 24 ft</SelectItem>
                        <SelectItem value="26 ft Box Truck: 26 ft (most common dock height box truck)">26 ft Box Truck: 26 ft (most common dock height box truck)</SelectItem>
                        <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" name="color" defaultValue={VEHICLE_TEMPLATE.color} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vin">VIN</Label>
                    <Input id="vin" name="vin" defaultValue={VEHICLE_TEMPLATE.vin} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <Input id="licensePlate" name="licensePlate" defaultValue={VEHICLE_TEMPLATE.licensePlate} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" defaultValue={VEHICLE_TEMPLATE.state} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input id="mileage" name="mileage" type="number" defaultValue={VEHICLE_TEMPLATE.mileage} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select name="fuelType" defaultValue={VEHICLE_TEMPLATE.fuelType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gasoline">Gasoline</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mpg">MPG</Label>
                    <Input id="mpg" name="mpg" type="number" defaultValue={VEHICLE_TEMPLATE.mpg} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name(s)</Label>
                    <Input id="ownerName" name="ownerName" defaultValue={VEHICLE_TEMPLATE.ownerName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseLocation">Purchase Location</Label>
                    <Input id="purchaseLocation" name="purchaseLocation" defaultValue={VEHICLE_TEMPLATE.purchaseLocation} />
                  </div>
                </div>
                
                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600">Financial Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchaseDate">Purchase Date</Label>
                      <Input id="purchaseDate" name="purchaseDate" type="date" defaultValue={VEHICLE_TEMPLATE.purchaseDate} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          id="purchasePrice" 
                          name="purchasePrice" 
                          type="text" 
                          placeholder="14,000.00" 
                          className="pl-6"
                          defaultValue={VEHICLE_TEMPLATE.purchasePrice ? parseFloat(VEHICLE_TEMPLATE.purchasePrice).toLocaleString('en-US', {minimumFractionDigits: 2}) : ''} 
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d.]/g, '');
                            if (value && !isNaN(parseFloat(value))) {
                              e.target.value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2});
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentValue">Current Value ($)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          id="currentValue" 
                          name="currentValue" 
                          type="text" 
                          placeholder="12,000.00" 
                          className="pl-6"
                          defaultValue={VEHICLE_TEMPLATE.currentValue ? parseFloat(VEHICLE_TEMPLATE.currentValue).toLocaleString('en-US', {minimumFractionDigits: 2}) : ''} 
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d.]/g, '');
                            if (value && !isNaN(parseFloat(value))) {
                              e.target.value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2});
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyPayment">Monthly Payment ($)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          id="monthlyPayment" 
                          name="monthlyPayment" 
                          type="text" 
                          placeholder="333.00" 
                          className="pl-6"
                          defaultValue={VEHICLE_TEMPLATE.monthlyPayment ? parseFloat(VEHICLE_TEMPLATE.monthlyPayment).toLocaleString('en-US', {minimumFractionDigits: 2}) : ''} 
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d.]/g, '');
                            if (value && !isNaN(parseFloat(value))) {
                              e.target.value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2});
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest Rate (%)</Label>
                      <Input id="interestRate" name="interestRate" type="number" step="0.01" defaultValue={VEHICLE_TEMPLATE.interestRate} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loanTerm">Loan Term (months)</Label>
                      <Input id="loanTerm" name="loanTerm" type="number" defaultValue={VEHICLE_TEMPLATE.loanTerm} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="financeCompany">Finance Company</Label>
                      <Input id="financeCompany" name="financeCompany" defaultValue={VEHICLE_TEMPLATE.financeCompany} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="downPayment">Down Payment ($)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          id="downPayment" 
                          name="downPayment" 
                          type="text" 
                          placeholder="4,500.00" 
                          className="pl-6"
                          defaultValue={VEHICLE_TEMPLATE.downPayment ? parseFloat(VEHICLE_TEMPLATE.downPayment).toLocaleString('en-US', {minimumFractionDigits: 2}) : ''} 
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d.]/g, '');
                            if (value && !isNaN(parseFloat(value))) {
                              e.target.value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2});
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loanStartDate">Loan Start Date</Label>
                      <Input id="loanStartDate" name="loanStartDate" type="date" defaultValue={VEHICLE_TEMPLATE.loanStartDate} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstPaymentDue">First Payment Due</Label>
                      <Input id="firstPaymentDue" name="firstPaymentDue" type="date" defaultValue={VEHICLE_TEMPLATE.firstPaymentDue} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="finalPaymentDue">Final Payment Due</Label>
                      <Input id="finalPaymentDue" name="finalPaymentDue" type="date" defaultValue={VEHICLE_TEMPLATE.finalPaymentDue} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remainingBalance">Remaining Balance ($)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          id="remainingBalance" 
                          name="remainingBalance" 
                          type="text" 
                          placeholder="12,000.00" 
                          className="pl-6"
                          defaultValue={VEHICLE_TEMPLATE.remainingBalance ? parseFloat(VEHICLE_TEMPLATE.remainingBalance).toLocaleString('en-US', {minimumFractionDigits: 2}) : ''} 
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d.]/g, '');
                            if (value && !isNaN(parseFloat(value))) {
                              e.target.value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2});
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loanAccountNumber">Loan Account Number</Label>
                      <Input id="loanAccountNumber" name="loanAccountNumber" defaultValue={VEHICLE_TEMPLATE.loanAccountNumber} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="financeCompanyPhone">Finance Company Phone</Label>
                      <Input id="financeCompanyPhone" name="financeCompanyPhone" type="tel" defaultValue={VEHICLE_TEMPLATE.financeCompanyPhone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="financeCompanyContact">Finance Company Contact</Label>
                      <Input id="financeCompanyContact" name="financeCompanyContact" defaultValue={VEHICLE_TEMPLATE.financeCompanyContact} />
                    </div>
                  </div>
                </div>

                {/* Vehicle Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600">Vehicle Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleWeight">Vehicle Weight (lbs)</Label>
                      <Input id="vehicleWeight" name="vehicleWeight" type="number" defaultValue={VEHICLE_TEMPLATE.vehicleWeight} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exteriorLength">Exterior Length (ft)</Label>
                      <Input id="exteriorLength" name="exteriorLength" type="number" step="0.1" defaultValue={VEHICLE_TEMPLATE.exteriorLength} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exteriorWidth">Exterior Width (ft)</Label>
                      <Input id="exteriorWidth" name="exteriorWidth" type="number" step="0.1" defaultValue={VEHICLE_TEMPLATE.exteriorWidth} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exteriorHeight">Exterior Height (ft)</Label>
                      <Input id="exteriorHeight" name="exteriorHeight" type="number" step="0.1" defaultValue={VEHICLE_TEMPLATE.exteriorHeight} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargoLength">Cargo Length (ft)</Label>
                      <Input id="cargoLength" name="cargoLength" type="number" step="0.1" defaultValue={VEHICLE_TEMPLATE.cargoLength} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargoWidth">Cargo Width (ft)</Label>
                      <Input id="cargoWidth" name="cargoWidth" type="number" step="0.1" defaultValue={VEHICLE_TEMPLATE.cargoWidth} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargoHeight">Cargo Height (ft)</Label>
                      <Input id="cargoHeight" name="cargoHeight" type="number" step="0.1" defaultValue={VEHICLE_TEMPLATE.cargoHeight} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargoVolume">Cargo Volume (cu ft)</Label>
                      <Input id="cargoVolume" name="cargoVolume" type="number" step="0.1" defaultValue={VEHICLE_TEMPLATE.cargoVolume} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payloadCapacity">Payload Capacity (lbs)</Label>
                      <Input id="payloadCapacity" name="payloadCapacity" type="number" defaultValue={VEHICLE_TEMPLATE.payloadCapacity} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="towingCapacity">Towing Capacity (lbs)</Label>
                      <Input id="towingCapacity" name="towingCapacity" type="number" defaultValue={VEHICLE_TEMPLATE.towingCapacity} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engineType">Engine Type</Label>
                      <Input id="engineType" name="engineType" placeholder="e.g., V6 3.5L Turbo" defaultValue={VEHICLE_TEMPLATE.engineType} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmission</Label>
                      <Input id="transmission" name="transmission" placeholder="e.g., 10-Speed Automatic" defaultValue={VEHICLE_TEMPLATE.transmission} />
                    </div>
                  </div>
                </div>

                {/* Insurance Information - CLEAN REBUILD */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                    🛡️ Insurance Information
                  </h3>
                  
                  {/* Row 1: Company and Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceCompanyName">Insurance Company Name</Label>
                      <Input 
                        id="insuranceCompanyName" 
                        name="insuranceCompanyName" 
                        placeholder="Enter insurance company name" 
                        defaultValue={VEHICLE_TEMPLATE.insuranceCompanyName} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceType">Insurance Type</Label>
                      <Select name="insuranceType" defaultValue={VEHICLE_TEMPLATE.insuranceType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select insurance type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="liability">Liability Only</SelectItem>
                          <SelectItem value="Full Coverage">Full Coverage</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive</SelectItem>
                          <SelectItem value="collision">Collision</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 2: Premium and Due Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceMonthlyPremium">Monthly Premium ($)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          id="insuranceMonthlyPremium" 
                          name="insuranceMonthlyPremium" 
                          type="text" 
                          placeholder="71.00" 
                          className="pl-6"
                          defaultValue={VEHICLE_TEMPLATE.insuranceMonthlyPremium ? parseFloat(VEHICLE_TEMPLATE.insuranceMonthlyPremium).toFixed(2) : ''} 
                          onChange={(e) => {
                            // Remove all non-digit and non-decimal characters, then reformat
                            const value = e.target.value.replace(/[^\d.]/g, '');
                            if (value && !isNaN(parseFloat(value))) {
                              e.target.value = parseFloat(value).toFixed(2);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurancePremiumDueDate">Premium Due Date</Label>
                      <Select name="insurancePremiumDueDate" defaultValue={VEHICLE_TEMPLATE.insurancePremiumDueDate || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select billing frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Once per month">Once per month</SelectItem>
                          <SelectItem value="Every six months">Every six months</SelectItem>
                          <SelectItem value="Yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 3: NEW CRITICAL FIELDS - Insurance Start and Expiration Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceStartDate" className="text-green-800 font-medium">
                        🟢 Insurance Start Date
                      </Label>
                      <Input 
                        id="insuranceStartDate" 
                        name="insuranceStartDate" 
                        type="date" 
                        className="border-green-300 focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceExpiry" className="text-green-800 font-medium">
                        🟢 Insurance Expiration Date
                      </Label>
                      <Input 
                        id="insuranceExpiry" 
                        name="insuranceExpiry" 
                        type="date" 
                        className="border-green-300 focus:border-green-500"
                      />
                    </div>
                  </div>

                  {/* Row 4: Coverage and Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceTotalCoverage">Total Coverage Amount ($)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          id="insuranceTotalCoverage" 
                          name="insuranceTotalCoverage" 
                          type="text" 
                          placeholder="30,000" 
                          className="pl-6"
                          defaultValue={VEHICLE_TEMPLATE.insuranceTotalCoverage ? parseInt(VEHICLE_TEMPLATE.insuranceTotalCoverage).toLocaleString() : ''} 
                          onChange={(e) => {
                            // Remove all non-digits and reformat
                            const value = e.target.value.replace(/[^\d]/g, '');
                            if (value) {
                              e.target.value = parseInt(value).toLocaleString();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurancePhoneNumber">Insurance Phone Number</Label>
                      <Input 
                        id="insurancePhoneNumber" 
                        name="insurancePhoneNumber" 
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        defaultValue={VEHICLE_TEMPLATE.insurancePhoneNumber} 
                      />
                    </div>
                  </div>

                  {/* Row 5: Representative and Policy */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceRepresentativeName">Representative Name</Label>
                      <Input 
                        id="insuranceRepresentativeName" 
                        name="insuranceRepresentativeName" 
                        placeholder="Representative name" 
                        defaultValue={VEHICLE_TEMPLATE.insuranceRepresentativeName} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                      <Input 
                        id="insurancePolicyNumber" 
                        name="insurancePolicyNumber" 
                        placeholder="Policy number" 
                        defaultValue={VEHICLE_TEMPLATE.insurancePolicyNumber} 
                      />
                    </div>
                  </div>

                  {/* DETAILED INSURANCE COVERAGE INFORMATION */}
                  <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4">Detailed Coverage Information</h4>
                    
                    {/* Bodily Injury Coverage */}
                    <div className="mb-6">
                      <h5 className="text-md font-medium text-gray-800 mb-3">Bodily Injury</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bodilyInjuryCoverageLimit">Coverage Limit</Label>
                          <Input 
                            id="bodilyInjuryCoverageLimit" 
                            name="bodilyInjuryCoverageLimit" 
                            placeholder="30000/person 60000/accident" 
                            defaultValue={VEHICLE_TEMPLATE.bodilyInjuryCoverageLimit || "30000/person 60000/accident"} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bodilyInjuryPremium">Premium ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="bodilyInjuryPremium" 
                              name="bodilyInjuryPremium" 
                              type="text" 
                              placeholder="395.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.bodilyInjuryPremium || "395.00"} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bodilyInjuryDeductible">Deductible ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="bodilyInjuryDeductible" 
                              name="bodilyInjuryDeductible" 
                              type="text" 
                              placeholder="0.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.bodilyInjuryDeductible || "0.00"} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property Damage Coverage */}
                    <div className="mb-6">
                      <h5 className="text-md font-medium text-gray-800 mb-3">Property Damage</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="propertyDamageCoverageLimit">Coverage Limit</Label>
                          <Input 
                            id="propertyDamageCoverageLimit" 
                            name="propertyDamageCoverageLimit" 
                            placeholder="25000/accident" 
                            defaultValue={VEHICLE_TEMPLATE.propertyDamageCoverageLimit || "25000/accident"} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="propertyDamagePremium">Premium ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="propertyDamagePremium" 
                              name="propertyDamagePremium" 
                              type="text" 
                              placeholder="256.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.propertyDamagePremium || "256.00"} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="propertyDamageDeductible">Deductible ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="propertyDamageDeductible" 
                              name="propertyDamageDeductible" 
                              type="text" 
                              placeholder="0.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.propertyDamageDeductible || "0.00"} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personal Injury Protection */}
                    <div className="mb-6">
                      <h5 className="text-md font-medium text-gray-800 mb-3">Personal Injury Protection (PIP)</h5>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="personalInjuryProtectionStatus">Status</Label>
                          <Select name="personalInjuryProtectionStatus" defaultValue={VEHICLE_TEMPLATE.personalInjuryProtectionStatus || "REJECTED BY INSURED"}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                              <SelectItem value="REJECTED BY INSURED">REJECTED BY INSURED</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="personalInjuryProtectionLimit">Coverage Limit</Label>
                          <Input 
                            id="personalInjuryProtectionLimit" 
                            name="personalInjuryProtectionLimit" 
                            placeholder="N/A" 
                            defaultValue={VEHICLE_TEMPLATE.personalInjuryProtectionLimit || ""} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="personalInjuryProtectionPremium">Premium ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="personalInjuryProtectionPremium" 
                              name="personalInjuryProtectionPremium" 
                              type="text" 
                              placeholder="0.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.personalInjuryProtectionPremium || "0.00"} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="personalInjuryProtectionDeductible">Deductible ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="personalInjuryProtectionDeductible" 
                              name="personalInjuryProtectionDeductible" 
                              type="text" 
                              placeholder="0.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.personalInjuryProtectionDeductible || "0.00"} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Uninsured/Underinsured Motorist - Bodily Injury */}
                    <div className="mb-6">
                      <h5 className="text-md font-medium text-gray-800 mb-3">Uninsured/Underinsured Motorist - Bodily Injury</h5>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="uninsuredMotoristBIStatus">Status</Label>
                          <Select name="uninsuredMotoristBIStatus" defaultValue={VEHICLE_TEMPLATE.uninsuredMotoristBIStatus || "REJECTED BY INSURED"}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                              <SelectItem value="REJECTED BY INSURED">REJECTED BY INSURED</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uninsuredMotoristBILimit">Coverage Limit</Label>
                          <Input 
                            id="uninsuredMotoristBILimit" 
                            name="uninsuredMotoristBILimit" 
                            placeholder="N/A" 
                            defaultValue={VEHICLE_TEMPLATE.uninsuredMotoristBILimit || ""} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uninsuredMotoristBIPremium">Premium ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="uninsuredMotoristBIPremium" 
                              name="uninsuredMotoristBIPremium" 
                              type="text" 
                              placeholder="0.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.uninsuredMotoristBIPremium || "0.00"} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uninsuredMotoristBIDeductible">Deductible ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="uninsuredMotoristBIDeductible" 
                              name="uninsuredMotoristBIDeductible" 
                              type="text" 
                              placeholder="0.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.uninsuredMotoristBIDeductible || "0.00"} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Uninsured/Underinsured Motorist - Property Damage */}
                    <div className="mb-6">
                      <h5 className="text-md font-medium text-gray-800 mb-3">Uninsured/Underinsured Motorist - Property Damage</h5>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="uninsuredMotoristPDStatus">Status</Label>
                          <Select name="uninsuredMotoristPDStatus" defaultValue={VEHICLE_TEMPLATE.uninsuredMotoristPDStatus || "REJECTED BY INSURED"}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                              <SelectItem value="REJECTED BY INSURED">REJECTED BY INSURED</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uninsuredMotoristPDLimit">Coverage Limit</Label>
                          <Input 
                            id="uninsuredMotoristPDLimit" 
                            name="uninsuredMotoristPDLimit" 
                            placeholder="N/A" 
                            defaultValue={VEHICLE_TEMPLATE.uninsuredMotoristPDLimit || ""} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uninsuredMotoristPDPremium">Premium ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="uninsuredMotoristPDPremium" 
                              name="uninsuredMotoristPDPremium" 
                              type="text" 
                              placeholder="0.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.uninsuredMotoristPDPremium || "0.00"} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uninsuredMotoristPDDeductible">Deductible ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="uninsuredMotoristPDDeductible" 
                              name="uninsuredMotoristPDDeductible" 
                              type="text" 
                              placeholder="0.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.uninsuredMotoristPDDeductible || "0.00"} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accidental Death Benefit & Full Term Premium */}
                    <div className="mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="accidentalDeathBenefitAmount">Accidental Death Benefit ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="accidentalDeathBenefitAmount" 
                              name="accidentalDeathBenefitAmount" 
                              type="text" 
                              placeholder="1,000 (Included)" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.accidentalDeathBenefitAmount || "1000"} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fullTermPremium">Full Term Premium ($)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="fullTermPremium" 
                              name="fullTermPremium" 
                              type="text" 
                              placeholder="65.00" 
                              className="pl-6"
                              defaultValue={VEHICLE_TEMPLATE.fullTermPremium || "65.00"} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document and Photo Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600">Documents & Photos</h3>
                  
                  {/* Vehicle Photos */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Vehicle Photos</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Upload Vehicle Photos</p>
                          <p className="text-xs text-gray-500">Exterior, interior, engine bay, etc.</p>
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          id="vehicle-photos"
                          onChange={(e) => {
                            if (e.target.files) {
                              // For Add Vehicle, we'll handle uploads after vehicle creation
                              // For now, just store file references
                              toast({
                                title: "Files Selected",
                                description: `${e.target.files.length} photo(s) ready to upload after vehicle is created`,
                              });
                            }
                          }}
                        />
                        <label htmlFor="vehicle-photos" className="inline-flex items-center px-3 py-2 border border-purple-300 rounded-md text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Photos
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Documents */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Insurance Documents</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">Insurance Policy</span>
                          </div>
                          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="insurance-policy" />
                          <label htmlFor="insurance-policy" className="block w-full text-center py-2 px-3 border border-blue-300 rounded text-xs text-blue-700 hover:bg-blue-50 cursor-pointer">
                            Upload Files
                          </label>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">Insurance Cards</span>
                          </div>
                          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="insurance-cards" />
                          <label htmlFor="insurance-cards" className="block w-full text-center py-2 px-3 border border-blue-300 rounded text-xs text-blue-700 hover:bg-blue-50 cursor-pointer">
                            Upload Files
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration & Title */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Registration & Title Documents</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">Registration</span>
                          </div>
                          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="registration" />
                          <label htmlFor="registration" className="block w-full text-center py-2 px-3 border border-green-300 rounded text-xs text-green-700 hover:bg-green-50 cursor-pointer">
                            Upload Files
                          </label>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">Title</span>
                          </div>
                          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="title" />
                          <label htmlFor="title" className="block w-full text-center py-2 px-3 border border-green-300 rounded text-xs text-green-700 hover:bg-green-50 cursor-pointer">
                            Upload Files
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warranty Information */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Warranty Information</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">Vehicle Warranty</span>
                          </div>
                          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="vehicle-warranty" />
                          <label htmlFor="vehicle-warranty" className="block w-full text-center py-2 px-3 border border-orange-300 rounded text-xs text-orange-700 hover:bg-orange-50 cursor-pointer">
                            Upload Files
                          </label>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">Tire Warranty</span>
                          </div>
                          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="tire-warranty" />
                          <label htmlFor="tire-warranty" className="block w-full text-center py-2 px-3 border border-orange-300 rounded text-xs text-orange-700 hover:bg-orange-50 cursor-pointer">
                            Upload Files
                          </label>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">Parts Warranty</span>
                          </div>
                          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="parts-warranty" />
                          <label htmlFor="parts-warranty" className="block w-full text-center py-2 px-3 border border-orange-300 rounded text-xs text-orange-700 hover:bg-orange-50 cursor-pointer">
                            Upload Files
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Documents */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Additional Documents</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">Maintenance Records</span>
                          </div>
                          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="maintenance-records" />
                          <label htmlFor="maintenance-records" className="block w-full text-center py-2 px-3 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">
                            Upload Files
                          </label>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">Other Documents</span>
                          </div>
                          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="other-documents" />
                          <label htmlFor="other-documents" className="block w-full text-center py-2 px-3 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">
                            Upload Files
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" rows={3} />
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle: Vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow min-h-[400px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-lg">{vehicle.nickname || 'Untitled Vehicle'}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => openEditDialog(vehicle)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                  {vehicle.status || 'Active'}
                </Badge>
                <Badge variant="outline">{vehicle.vehicleType || 'Vehicle'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="min-h-[20px]">
                  <span className="font-medium">Year:</span> {vehicle.year || 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Make:</span> {vehicle.make || 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Model:</span> {vehicle.model || 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Color:</span> {vehicle.color || 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Mileage:</span> {vehicle.mileage?.toLocaleString() || 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Fuel:</span> {vehicle.fuelType || 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Purchase Price:</span> {vehicle.purchasePrice ? `$${parseFloat(vehicle.purchasePrice).toLocaleString('en-US', {minimumFractionDigits: 2})}` : 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Current Value:</span> {vehicle.currentValue ? `$${parseFloat(vehicle.currentValue).toLocaleString('en-US', {minimumFractionDigits: 2})}` : 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Monthly Payment:</span> {vehicle.monthlyPayment ? `$${parseFloat(vehicle.monthlyPayment).toLocaleString('en-US', {minimumFractionDigits: 2})}` : 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Weight:</span> {vehicle.vehicleWeight ? `${vehicle.vehicleWeight?.toLocaleString()} lbs` : 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Insurance Expiration:</span> {vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toLocaleDateString() : 'N/A'}
                </div>
                <div className="min-h-[20px]">
                  <span className="font-medium">Days Until Expiry:</span> {vehicle.insuranceExpiry ? (() => {
                    const today = new Date();
                    const expiryDate = new Date(vehicle.insuranceExpiry);
                    const diffTime = expiryDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays > 0 ? `${diffDays} days` : diffDays === 0 ? 'Today' : `Expired ${Math.abs(diffDays)} days ago`;
                  })() : 'N/A'}
                </div>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground min-h-[20px]">
                <span className="font-medium">Notes:</span> {vehicle.notes || 'No notes added'}
              </div>
              
              {/* Vehicle Maintenance & Accessory Checklist Button */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg h-auto py-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVehicleForMaintenance(vehicle.id);
                    setShowMaintenanceDialog(true);
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center mb-1">
                      <Wrench className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Vehicle Maintenance &</span>
                    </div>
                    <span className="text-sm font-medium">Accessory Checklist</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {vehicles.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Car className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No vehicles yet</h3>
            <p className="text-muted-foreground mb-4">Add your first vehicle to get started</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <DialogTitle>Edit Vehicle</DialogTitle>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" form="edit-vehicle-form" disabled={updateVehicleMutation.isPending}>
                {updateVehicleMutation.isPending ? 'Updating...' : 'Update Vehicle'}
              </Button>
            </div>
          </DialogHeader>
          {selectedVehicle && (
            <form id="edit-vehicle-form" onSubmit={(e) => {
              e.preventDefault();
              handleUpdateVehicle(new FormData(e.currentTarget));
            }} className="space-y-4">
              <input type="hidden" name="id" value={selectedVehicle.id} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nickname">Vehicle Nickname *</Label>
                  <Input id="edit-nickname" name="nickname" defaultValue={selectedVehicle.nickname} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Year</Label>
                  <Input id="edit-year" name="year" type="text" defaultValue={selectedVehicle.year} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-make">Make *</Label>
                  <Input id="edit-make" name="make" defaultValue={selectedVehicle.make} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-model">Model *</Label>
                  <Input id="edit-model" name="model" defaultValue={selectedVehicle.model} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vehicleType">Vehicle Type</Label>
                  <Select name="vehicleType" defaultValue={selectedVehicle.vehicleType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Pickup Truck Short Bed: 5 - 6 ft">Pickup Truck Short Bed: 5 - 6 ft</SelectItem>
                      <SelectItem value="Pickup Truck Standard Bed: 6 - 6.75 ft">Pickup Truck Standard Bed: 6 - 6.75 ft</SelectItem>
                      <SelectItem value="Pickup Truck Long Bed: 8 - 8.5 ft">Pickup Truck Long Bed: 8 - 8.5 ft</SelectItem>
                      <SelectItem value="Small Cargo Van: 9 - 10 ft">Small Cargo Van: 9 - 10 ft</SelectItem>
                      <SelectItem value="Standard Cargo Van: 10 - 12 ft">Standard Cargo Van: 10 - 12 ft</SelectItem>
                      <SelectItem value="Extended Cargo Van: 12 - 14 ft">Extended Cargo Van: 12 - 14 ft</SelectItem>
                      <SelectItem value="High Roof Cargo Van: 12 - 14 ft (taller interior)">High Roof Cargo Van: 12 - 14 ft (taller interior)</SelectItem>
                      <SelectItem value="Sprinter Van Standard: 12 - 14 ft">Sprinter Van Standard: 12 - 14 ft</SelectItem>
                      <SelectItem value="Sprinter Van Extended: 14 - 16 ft">Sprinter Van Extended: 14 - 16 ft</SelectItem>
                      <SelectItem value="Transit Van: 10 - 14 ft">Transit Van: 10 - 14 ft</SelectItem>
                      <SelectItem value="ProMaster Van: 10 - 14 ft">ProMaster Van: 10 - 14 ft</SelectItem>
                      <SelectItem value="10 ft Box Truck: 10 ft">10 ft Box Truck: 10 ft</SelectItem>
                      <SelectItem value="12 ft Box Truck: 12 ft">12 ft Box Truck: 12 ft</SelectItem>
                      <SelectItem value="14 ft Box Truck: 14 ft">14 ft Box Truck: 14 ft</SelectItem>
                      <SelectItem value="16 ft Box Truck: 16 ft">16 ft Box Truck: 16 ft</SelectItem>
                      <SelectItem value="18 ft Box Truck: 18 ft">18 ft Box Truck: 18 ft</SelectItem>
                      <SelectItem value="20 ft Box Truck: 20 ft">20 ft Box Truck: 20 ft</SelectItem>
                      <SelectItem value="22 ft Box Truck: 22 ft">22 ft Box Truck: 22 ft</SelectItem>
                      <SelectItem value="24 ft Box Truck: 24 ft">24 ft Box Truck: 24 ft</SelectItem>
                      <SelectItem value="26 ft Box Truck: 26 ft (most common dock height box truck)">26 ft Box Truck: 26 ft (most common dock height box truck)</SelectItem>
                      <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Color</Label>
                  <Input id="edit-color" name="color" defaultValue={selectedVehicle.color || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vin">VIN</Label>
                  <Input id="edit-vin" name="vin" defaultValue={selectedVehicle.vin || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-licensePlate">License Plate</Label>
                  <Input id="edit-licensePlate" name="licensePlate" defaultValue={selectedVehicle.licensePlate || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input id="edit-state" name="state" defaultValue={selectedVehicle.state || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mileage">Mileage</Label>
                  <Input id="edit-mileage" name="mileage" type="number" defaultValue={selectedVehicle.mileage || 0} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-fuelType">Fuel Type</Label>
                  <Select name="fuelType" defaultValue={selectedVehicle.fuelType || 'Gasoline'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mpg">MPG</Label>
                  <Input id="edit-mpg" name="mpg" type="number" defaultValue={selectedVehicle.mpg || 0} />
                </div>
              </div>
              
              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600">Financial Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-purchaseDate">Purchase Date</Label>
                    <Input 
                      id="edit-purchaseDate" 
                      name="purchaseDate" 
                      type="date" 
                      defaultValue={selectedVehicle.purchaseDate ? new Date(selectedVehicle.purchaseDate).toISOString().split('T')[0] : ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-purchasePrice">Purchase Price ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        id="edit-purchasePrice" 
                        name="purchasePrice" 
                        type="text" 
                        placeholder="14,000.00" 
                        className="pl-6"
                        defaultValue={selectedVehicle.purchasePrice ? parseFloat(selectedVehicle.purchasePrice).toLocaleString('en-US', {minimumFractionDigits: 2}) : ''} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.]/g, '');
                          if (value && !isNaN(parseFloat(value))) {
                            e.target.value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2});
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-currentValue">Current Value ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        id="edit-currentValue" 
                        name="currentValue" 
                        type="text" 
                        placeholder="12,000.00" 
                        className="pl-6"
                        defaultValue={selectedVehicle.currentValue ? parseFloat(selectedVehicle.currentValue).toLocaleString('en-US', {minimumFractionDigits: 2}) : ''} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.]/g, '');
                          if (value && !isNaN(parseFloat(value))) {
                            e.target.value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2});
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-monthlyPayment">Monthly Payment ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        id="edit-monthlyPayment" 
                        name="monthlyPayment" 
                        type="text" 
                        placeholder="333.00" 
                        className="pl-6"
                        defaultValue={selectedVehicle.monthlyPayment ? parseFloat(selectedVehicle.monthlyPayment).toLocaleString('en-US', {minimumFractionDigits: 2}) : ''} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.]/g, '');
                          if (value && !isNaN(parseFloat(value))) {
                            e.target.value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2});
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-interestRate">Interest Rate (%)</Label>
                    <Input 
                      id="edit-interestRate" 
                      name="interestRate" 
                      type="number" 
                      step="0.01" 
                      defaultValue={selectedVehicle.interestRate || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-loanTerm">Loan Term (months)</Label>
                    <Input 
                      id="edit-loanTerm" 
                      name="loanTerm" 
                      type="number" 
                      defaultValue={selectedVehicle.loanTerm || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-financeCompany">Finance Company</Label>
                    <Input 
                      id="edit-financeCompany" 
                      name="financeCompany" 
                      defaultValue={selectedVehicle.financeCompany || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-downPayment">Down Payment ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        id="edit-downPayment" 
                        name="downPayment" 
                        type="text" 
                        placeholder="4,500.00" 
                        className="pl-6"
                        defaultValue={selectedVehicle.downPayment ? parseFloat(selectedVehicle.downPayment).toLocaleString('en-US', {minimumFractionDigits: 2}) : ''} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.]/g, '');
                          if (value && !isNaN(parseFloat(value))) {
                            e.target.value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2});
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-loanStartDate">Loan Start Date</Label>
                    <Input 
                      id="edit-loanStartDate" 
                      name="loanStartDate" 
                      type="date" 
                      defaultValue={selectedVehicle.loanStartDate ? new Date(selectedVehicle.loanStartDate).toISOString().split('T')[0] : ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-firstPaymentDue">First Payment Due</Label>
                    <Input 
                      id="edit-firstPaymentDue" 
                      name="firstPaymentDue" 
                      type="date" 
                      defaultValue={selectedVehicle.firstPaymentDue ? new Date(selectedVehicle.firstPaymentDue).toISOString().split('T')[0] : ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-finalPaymentDue">Final Payment Due</Label>
                    <Input 
                      id="edit-finalPaymentDue" 
                      name="finalPaymentDue" 
                      type="date" 
                      defaultValue={selectedVehicle.finalPaymentDue ? new Date(selectedVehicle.finalPaymentDue).toISOString().split('T')[0] : ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-remainingBalance">Remaining Balance ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        id="edit-remainingBalance" 
                        name="remainingBalance" 
                        type="text" 
                        placeholder="12,000.00" 
                        className="pl-6"
                        defaultValue={selectedVehicle.remainingBalance ? parseFloat(selectedVehicle.remainingBalance).toLocaleString('en-US', {minimumFractionDigits: 2}) : ''} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.]/g, '');
                          if (value && !isNaN(parseFloat(value))) {
                            e.target.value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2});
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-loanAccountNumber">Loan Account Number</Label>
                    <Input 
                      id="edit-loanAccountNumber" 
                      name="loanAccountNumber" 
                      placeholder="e.g., ACC-123456789" 
                      defaultValue={selectedVehicle.loanAccountNumber || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-financeCompanyPhone">Finance Company Phone</Label>
                    <Input 
                      id="edit-financeCompanyPhone" 
                      name="financeCompanyPhone" 
                      type="tel" 
                      placeholder="(555) 123-4567" 
                      defaultValue={selectedVehicle.financeCompanyPhone || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-financeCompanyContact">Finance Company Contact</Label>
                    <Input 
                      id="edit-financeCompanyContact" 
                      name="financeCompanyContact" 
                      placeholder="e.g., John Smith" 
                      defaultValue={selectedVehicle.financeCompanyContact || ''} 
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-600">Vehicle Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-vehicleWeight">Vehicle Weight (lbs)</Label>
                    <Input 
                      id="edit-vehicleWeight" 
                      name="vehicleWeight" 
                      type="number" 
                      defaultValue={selectedVehicle.vehicleWeight || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-exteriorLength">Exterior Length (ft)</Label>
                    <Input 
                      id="edit-exteriorLength" 
                      name="exteriorLength" 
                      type="number" 
                      step="0.1" 
                      defaultValue={selectedVehicle.exteriorLength || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-exteriorWidth">Exterior Width (ft)</Label>
                    <Input 
                      id="edit-exteriorWidth" 
                      name="exteriorWidth" 
                      type="number" 
                      step="0.1" 
                      defaultValue={selectedVehicle.exteriorWidth || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-exteriorHeight">Exterior Height (ft)</Label>
                    <Input 
                      id="edit-exteriorHeight" 
                      name="exteriorHeight" 
                      type="number" 
                      step="0.1" 
                      defaultValue={selectedVehicle.exteriorHeight || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cargoLength">Cargo Length (ft)</Label>
                    <Input 
                      id="edit-cargoLength" 
                      name="cargoLength" 
                      type="number" 
                      step="0.1" 
                      defaultValue={selectedVehicle.cargoLength || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cargoWidth">Cargo Width (ft)</Label>
                    <Input 
                      id="edit-cargoWidth" 
                      name="cargoWidth" 
                      type="number" 
                      step="0.1" 
                      defaultValue={selectedVehicle.cargoWidth || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cargoHeight">Cargo Height (ft)</Label>
                    <Input 
                      id="edit-cargoHeight" 
                      name="cargoHeight" 
                      type="number" 
                      step="0.1" 
                      defaultValue={selectedVehicle.cargoHeight || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cargoVolume">Cargo Volume (cu ft)</Label>
                    <Input 
                      id="edit-cargoVolume" 
                      name="cargoVolume" 
                      type="number" 
                      step="0.1" 
                      defaultValue={selectedVehicle.cargoVolume || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-payloadCapacity">Payload Capacity (lbs)</Label>
                    <Input 
                      id="edit-payloadCapacity" 
                      name="payloadCapacity" 
                      type="number" 
                      defaultValue={selectedVehicle.payloadCapacity || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-towingCapacity">Towing Capacity (lbs)</Label>
                    <Input 
                      id="edit-towingCapacity" 
                      name="towingCapacity" 
                      type="number" 
                      defaultValue={selectedVehicle.towingCapacity || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-engineType">Engine Type</Label>
                    <Input 
                      id="edit-engineType" 
                      name="engineType" 
                      placeholder="e.g., V6 3.5L Turbo" 
                      defaultValue={selectedVehicle.engineType || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-transmission">Transmission</Label>
                    <Input 
                      id="edit-transmission" 
                      name="transmission" 
                      placeholder="e.g., 10-Speed Automatic" 
                      defaultValue={selectedVehicle.transmission || ''} 
                    />
                  </div>
                </div>
              </div>

              {/* Insurance Information - CLEAN REBUILD */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                  🛡️ Insurance Information
                </h3>
                
                {/* Row 1: Company and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-insuranceCompanyName">Insurance Company Name</Label>
                    <Input 
                      id="edit-insuranceCompanyName" 
                      name="insuranceCompanyName" 
                      placeholder="Enter insurance company name" 
                      defaultValue={selectedVehicle.insuranceCompanyName || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-insuranceType">Insurance Type</Label>
                    <Select name="insuranceType" defaultValue={selectedVehicle.insuranceType || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="liability">Liability Only</SelectItem>
                        <SelectItem value="Full Coverage">Full Coverage</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                        <SelectItem value="collision">Collision</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Premium and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-insuranceMonthlyPremium">Monthly Premium ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        id="edit-insuranceMonthlyPremium" 
                        name="insuranceMonthlyPremium" 
                        type="text" 
                        placeholder="71.00" 
                        className="pl-6"
                        defaultValue={selectedVehicle.insuranceMonthlyPremium ? parseFloat(selectedVehicle.insuranceMonthlyPremium.toString()).toFixed(2) : ''} 
                        onChange={(e) => {
                          // Remove all non-digit and non-decimal characters, then reformat
                          const value = e.target.value.replace(/[^\d.]/g, '');
                          if (value && !isNaN(parseFloat(value))) {
                            e.target.value = parseFloat(value).toFixed(2);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-insurancePremiumDueDate">Premium Due Date</Label>
                    <Select name="insurancePremiumDueDate" defaultValue={typeof selectedVehicle.insurancePremiumDueDate === 'string' ? selectedVehicle.insurancePremiumDueDate : ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Once per month">Once per month</SelectItem>
                        <SelectItem value="Every six months">Every six months</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 3: NEW CRITICAL FIELDS - Insurance Start and Expiration Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="edit-insuranceStartDate" className="text-green-800 font-medium">
                      🟢 Insurance Start Date
                    </Label>
                    <Input 
                      id="edit-insuranceStartDate" 
                      name="insuranceStartDate" 
                      type="date" 
                      className="border-green-300 focus:border-green-500"
                      defaultValue={selectedVehicle.insuranceStartDate ? new Date(selectedVehicle.insuranceStartDate).toISOString().split('T')[0] : ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-insuranceExpiry" className="text-green-800 font-medium">
                      🟢 Insurance Expiration Date
                    </Label>
                    <Input 
                      id="edit-insuranceExpiry" 
                      name="insuranceExpiry" 
                      type="date" 
                      className="border-green-300 focus:border-green-500"
                      defaultValue={selectedVehicle.insuranceExpiry ? new Date(selectedVehicle.insuranceExpiry).toISOString().split('T')[0] : ''} 
                    />
                  </div>
                </div>

                {/* Row 4: Coverage and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-insuranceTotalCoverage">Total Coverage Amount ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        id="edit-insuranceTotalCoverage" 
                        name="insuranceTotalCoverage" 
                        type="text" 
                        placeholder="30,000" 
                        className="pl-6"
                        defaultValue={selectedVehicle.insuranceTotalCoverage ? parseInt(selectedVehicle.insuranceTotalCoverage.toString()).toLocaleString() : ''} 
                        onChange={(e) => {
                          // Remove all non-digits and reformat
                          const value = e.target.value.replace(/[^\d]/g, '');
                          if (value) {
                            e.target.value = parseInt(value).toLocaleString();
                          }
                        }}
                        onBlur={(e) => {
                          // Store the raw number value for form submission
                          const rawValue = e.target.value.replace(/[^\d]/g, '');
                          e.target.setAttribute('data-raw-value', rawValue);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-insurancePhoneNumber">Insurance Phone Number</Label>
                    <Input 
                      id="edit-insurancePhoneNumber" 
                      name="insurancePhoneNumber" 
                      type="tel" 
                      placeholder="(555) 123-4567" 
                      defaultValue={selectedVehicle.insurancePhoneNumber || ''} 
                    />
                  </div>
                </div>

                {/* Row 5: Representative and Policy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-insuranceRepresentativeName">Representative Name</Label>
                    <Input 
                      id="edit-insuranceRepresentativeName" 
                      name="insuranceRepresentativeName" 
                      placeholder="Representative name" 
                      defaultValue={selectedVehicle.insuranceRepresentativeName || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-insurancePolicyNumber">Policy Number</Label>
                    <Input 
                      id="edit-insurancePolicyNumber" 
                      name="insurancePolicyNumber" 
                      placeholder="Policy number" 
                      defaultValue={selectedVehicle.insurancePolicyNumber || ''} 
                    />
                  </div>
                </div>

                {/* DETAILED INSURANCE COVERAGE INFORMATION - EDIT MODE */}
                <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">Detailed Coverage Information</h4>
                  
                  {/* Bodily Injury Coverage */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-800 mb-3">Bodily Injury</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-bodilyInjuryCoverageLimit">Coverage Limit</Label>
                        <Input 
                          id="edit-bodilyInjuryCoverageLimit" 
                          name="bodilyInjuryCoverageLimit" 
                          placeholder="30000/person 60000/accident" 
                          defaultValue={selectedVehicle.bodilyInjuryCoverageLimit || "30000/person 60000/accident"} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-bodilyInjuryPremium">Premium ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-bodilyInjuryPremium" 
                            name="bodilyInjuryPremium" 
                            type="text" 
                            placeholder="395.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.bodilyInjuryPremium || "395.00"} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-bodilyInjuryDeductible">Deductible ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-bodilyInjuryDeductible" 
                            name="bodilyInjuryDeductible" 
                            type="text" 
                            placeholder="0.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.bodilyInjuryDeductible || "0.00"} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Damage Coverage */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-800 mb-3">Property Damage</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-propertyDamageCoverageLimit">Coverage Limit</Label>
                        <Input 
                          id="edit-propertyDamageCoverageLimit" 
                          name="propertyDamageCoverageLimit" 
                          placeholder="25000/accident" 
                          defaultValue={selectedVehicle.propertyDamageCoverageLimit || "25000/accident"} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-propertyDamagePremium">Premium ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-propertyDamagePremium" 
                            name="propertyDamagePremium" 
                            type="text" 
                            placeholder="256.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.propertyDamagePremium || "256.00"} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-propertyDamageDeductible">Deductible ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-propertyDamageDeductible" 
                            name="propertyDamageDeductible" 
                            type="text" 
                            placeholder="0.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.propertyDamageDeductible || "0.00"} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Injury Protection */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-800 mb-3">Personal Injury Protection (PIP)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-personalInjuryProtectionStatus">Status</Label>
                        <Select name="personalInjuryProtectionStatus" defaultValue={selectedVehicle.personalInjuryProtectionStatus || "REJECTED BY INSURED"}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                            <SelectItem value="REJECTED BY INSURED">REJECTED BY INSURED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-personalInjuryProtectionLimit">Coverage Limit</Label>
                        <Input 
                          id="edit-personalInjuryProtectionLimit" 
                          name="personalInjuryProtectionLimit" 
                          placeholder="N/A" 
                          defaultValue={selectedVehicle.personalInjuryProtectionLimit || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-personalInjuryProtectionPremium">Premium ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-personalInjuryProtectionPremium" 
                            name="personalInjuryProtectionPremium" 
                            type="text" 
                            placeholder="0.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.personalInjuryProtectionPremium || "0.00"} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-personalInjuryProtectionDeductible">Deductible ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-personalInjuryProtectionDeductible" 
                            name="personalInjuryProtectionDeductible" 
                            type="text" 
                            placeholder="0.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.personalInjuryProtectionDeductible || "0.00"} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Uninsured/Underinsured Motorist - Bodily Injury */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-800 mb-3">Uninsured/Underinsured Motorist - Bodily Injury</h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-uninsuredMotoristBIStatus">Status</Label>
                        <Select name="uninsuredMotoristBIStatus" defaultValue={selectedVehicle.uninsuredMotoristBIStatus || "REJECTED BY INSURED"}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                            <SelectItem value="REJECTED BY INSURED">REJECTED BY INSURED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-uninsuredMotoristBILimit">Coverage Limit</Label>
                        <Input 
                          id="edit-uninsuredMotoristBILimit" 
                          name="uninsuredMotoristBILimit" 
                          placeholder="N/A" 
                          defaultValue={selectedVehicle.uninsuredMotoristBILimit || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-uninsuredMotoristBIPremium">Premium ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-uninsuredMotoristBIPremium" 
                            name="uninsuredMotoristBIPremium" 
                            type="text" 
                            placeholder="0.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.uninsuredMotoristBIPremium || "0.00"} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-uninsuredMotoristBIDeductible">Deductible ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-uninsuredMotoristBIDeductible" 
                            name="uninsuredMotoristBIDeductible" 
                            type="text" 
                            placeholder="0.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.uninsuredMotoristBIDeductible || "0.00"} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Uninsured/Underinsured Motorist - Property Damage */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-800 mb-3">Uninsured/Underinsured Motorist - Property Damage</h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-uninsuredMotoristPDStatus">Status</Label>
                        <Select name="uninsuredMotoristPDStatus" defaultValue={selectedVehicle.uninsuredMotoristPDStatus || "REJECTED BY INSURED"}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                            <SelectItem value="REJECTED BY INSURED">REJECTED BY INSURED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-uninsuredMotoristPDLimit">Coverage Limit</Label>
                        <Input 
                          id="edit-uninsuredMotoristPDLimit" 
                          name="uninsuredMotoristPDLimit" 
                          placeholder="N/A" 
                          defaultValue={selectedVehicle.uninsuredMotoristPDLimit || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-uninsuredMotoristPDPremium">Premium ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-uninsuredMotoristPDPremium" 
                            name="uninsuredMotoristPDPremium" 
                            type="text" 
                            placeholder="0.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.uninsuredMotoristPDPremium || "0.00"} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-uninsuredMotoristPDDeductible">Deductible ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-uninsuredMotoristPDDeductible" 
                            name="uninsuredMotoristPDDeductible" 
                            type="text" 
                            placeholder="0.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.uninsuredMotoristPDDeductible || "0.00"} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accidental Death Benefit & Full Term Premium */}
                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-accidentalDeathBenefitAmount">Accidental Death Benefit ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-accidentalDeathBenefitAmount" 
                            name="accidentalDeathBenefitAmount" 
                            type="text" 
                            placeholder="1,000 (Included)" 
                            className="pl-6"
                            defaultValue={selectedVehicle.accidentalDeathBenefitAmount || "1000"} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-fullTermPremium">Full Term Premium ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="edit-fullTermPremium" 
                            name="fullTermPremium" 
                            type="text" 
                            placeholder="65.00" 
                            className="pl-6"
                            defaultValue={selectedVehicle.fullTermPremium || "65.00"} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document and Photo Upload - Edit Mode */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-600">Documents & Photos</h3>
                
                {/* Vehicle Photos */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Vehicle Photos</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                    <div className="space-y-2">
                      <div className="mx-auto w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Update Vehicle Photos</p>
                        <p className="text-xs text-gray-500">Exterior, interior, engine bay, etc.</p>
                      </div>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        id="edit-vehicle-photos"
                        onChange={(e) => {
                          if (e.target.files && selectedVehicle) {
                            handleFileUpload(e.target.files, selectedVehicle.id, 'Vehicle Photos');
                            e.target.value = ''; // Reset input after upload
                          }
                        }}
                      />
                      <label htmlFor="edit-vehicle-photos" className="inline-flex items-center px-3 py-1 border border-purple-300 rounded text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 cursor-pointer">
                        {uploadingFiles[`${selectedVehicle?.id}-Vehicle Photos`] ? (
                          <>
                            <Upload className="w-4 h-4 mr-1 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-1" />
                            Choose Photos
                          </>
                        )}
                      </label>
                      
                      {/* Display uploaded photos */}
                      {vehicleDocuments && Array.isArray(vehicleDocuments) && vehicleDocuments.filter(doc => doc.documentCategory === 'Vehicle Photos').length > 0 && (
                        <div className="mt-2 space-y-1">
                          {vehicleDocuments
                            .filter(doc => doc.documentCategory === 'Vehicle Photos')
                            .map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                                <span className="truncate">{doc.originalName}</span>
                                <div className="flex items-center space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => window.open(`/api/vehicles/documents/${doc.id}/view`, '_blank')}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="View Image"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => window.open(`/api/vehicles/documents/${doc.id}/download`, '_blank')}
                                    className="text-green-600 hover:text-green-800"
                                    title="Download Image"
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Insurance Documents */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Insurance Documents</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">Insurance Policy</span>
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          className="hidden" 
                          id="edit-insurance-policy"
                          onChange={(e) => {
                            if (e.target.files && selectedVehicle) {
                              handleFileUpload(e.target.files, selectedVehicle.id, 'Insurance Policy');
                              e.target.value = '';
                            }
                          }}
                        />
                        <label htmlFor="edit-insurance-policy" className="block w-full text-center py-1 px-2 border border-blue-300 rounded text-xs text-blue-700 hover:bg-blue-50 cursor-pointer">
                          {uploadingFiles[`${selectedVehicle?.id}-Insurance Policy`] ? 'Uploading...' : 'Upload Files'}
                        </label>
                        {vehicleDocuments && Array.isArray(vehicleDocuments) && vehicleDocuments.filter(doc => doc.documentCategory === 'Insurance Policy').length > 0 && (
                          <div className="mt-1 space-y-1">
                            {vehicleDocuments
                              .filter(doc => doc.documentCategory === 'Insurance Policy')
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                  <span className="truncate">{doc.originalName}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/view`, '_blank')}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View Document"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/download`, '_blank')}
                                      className="text-green-600 hover:text-green-800"
                                      title="Download Document"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">Insurance Cards</span>
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          className="hidden" 
                          id="edit-insurance-cards"
                          onChange={(e) => {
                            if (e.target.files && selectedVehicle) {
                              handleFileUpload(e.target.files, selectedVehicle.id, 'Insurance Cards');
                              e.target.value = '';
                            }
                          }}
                        />
                        <label htmlFor="edit-insurance-cards" className="block w-full text-center py-1 px-2 border border-blue-300 rounded text-xs text-blue-700 hover:bg-blue-50 cursor-pointer">
                          {uploadingFiles[`${selectedVehicle?.id}-Insurance Cards`] ? 'Uploading...' : 'Upload Files'}
                        </label>
                        {vehicleDocuments && Array.isArray(vehicleDocuments) && vehicleDocuments.filter(doc => doc.documentCategory === 'Insurance Cards').length > 0 && (
                          <div className="mt-1 space-y-1">
                            {vehicleDocuments
                              .filter(doc => doc.documentCategory === 'Insurance Cards')
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                  <span className="truncate">{doc.originalName}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/view`, '_blank')}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View Document"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/download`, '_blank')}
                                      className="text-green-600 hover:text-green-800"
                                      title="Download Document"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration & Title */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Registration & Title Documents</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">Registration</span>
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          className="hidden" 
                          id="edit-registration"
                          onChange={(e) => {
                            if (e.target.files && selectedVehicle) {
                              handleFileUpload(e.target.files, selectedVehicle.id, 'Vehicle Registration');
                              e.target.value = '';
                            }
                          }}
                        />
                        <label htmlFor="edit-registration" className="block w-full text-center py-1 px-2 border border-green-300 rounded text-xs text-green-700 hover:bg-green-50 cursor-pointer">
                          {uploadingFiles[`${selectedVehicle?.id}-Vehicle Registration`] ? 'Uploading...' : 'Upload Files'}
                        </label>
                        {vehicleDocuments && Array.isArray(vehicleDocuments) && vehicleDocuments.filter(doc => doc.documentCategory === 'Vehicle Registration').length > 0 && (
                          <div className="mt-1 space-y-1">
                            {vehicleDocuments
                              .filter(doc => doc.documentCategory === 'Vehicle Registration')
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                  <span className="truncate">{doc.originalName}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/view`, '_blank')}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View Document"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/download`, '_blank')}
                                      className="text-green-600 hover:text-green-800"
                                      title="Download Document"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">Title</span>
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          className="hidden" 
                          id="edit-title"
                          onChange={(e) => {
                            if (e.target.files && selectedVehicle) {
                              handleFileUpload(e.target.files, selectedVehicle.id, 'Vehicle Title');
                              e.target.value = '';
                            }
                          }}
                        />
                        <label htmlFor="edit-title" className="block w-full text-center py-1 px-2 border border-green-300 rounded text-xs text-green-700 hover:bg-green-50 cursor-pointer">
                          {uploadingFiles[`${selectedVehicle?.id}-Vehicle Title`] ? 'Uploading...' : 'Upload Files'}
                        </label>
                        {vehicleDocuments && Array.isArray(vehicleDocuments) && vehicleDocuments.filter(doc => doc.documentCategory === 'Vehicle Title').length > 0 && (
                          <div className="mt-1 space-y-1">
                            {vehicleDocuments
                              .filter(doc => doc.documentCategory === 'Vehicle Title')
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                  <span className="truncate">{doc.originalName}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/view`, '_blank')}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View Document"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/download`, '_blank')}
                                      className="text-green-600 hover:text-green-800"
                                      title="Download Document"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warranty Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Warranty Information</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="border border-gray-200 rounded-lg p-2 hover:border-orange-300 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">Vehicle</span>
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          className="hidden" 
                          id="edit-vehicle-warranty"
                          onChange={(e) => {
                            if (e.target.files && selectedVehicle) {
                              handleFileUpload(e.target.files, selectedVehicle.id, 'Vehicle Warranty');
                              e.target.value = '';
                            }
                          }}
                        />
                        <label htmlFor="edit-vehicle-warranty" className="block w-full text-center py-1 px-1 border border-orange-300 rounded text-xs text-orange-700 hover:bg-orange-50 cursor-pointer">
                          {uploadingFiles[`${selectedVehicle?.id}-Vehicle Warranty`] ? '...' : 'Upload'}
                        </label>
                        {vehicleDocuments && Array.isArray(vehicleDocuments) && vehicleDocuments.filter(doc => doc.documentCategory === 'Vehicle Warranty').length > 0 && (
                          <div className="mt-1 space-y-1">
                            {vehicleDocuments
                              .filter(doc => doc.documentCategory === 'Vehicle Warranty')
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                  <span className="truncate">{doc.originalName}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/view`, '_blank')}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View Document"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/download`, '_blank')}
                                      className="text-green-600 hover:text-green-800"
                                      title="Download Document"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-2 hover:border-orange-300 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">Tires</span>
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          className="hidden" 
                          id="edit-tire-warranty"
                          onChange={(e) => {
                            if (e.target.files && selectedVehicle) {
                              handleFileUpload(e.target.files, selectedVehicle.id, 'Tire Warranty');
                              e.target.value = '';
                            }
                          }}
                        />
                        <label htmlFor="edit-tire-warranty" className="block w-full text-center py-1 px-1 border border-orange-300 rounded text-xs text-orange-700 hover:bg-orange-50 cursor-pointer">
                          {uploadingFiles[`${selectedVehicle?.id}-Tire Warranty`] ? '...' : 'Upload'}
                        </label>
                        {vehicleDocuments && Array.isArray(vehicleDocuments) && vehicleDocuments.filter(doc => doc.documentCategory === 'Tire Warranty').length > 0 && (
                          <div className="mt-1 space-y-1">
                            {vehicleDocuments
                              .filter(doc => doc.documentCategory === 'Tire Warranty')
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                  <span className="truncate">{doc.originalName}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/view`, '_blank')}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View Document"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/download`, '_blank')}
                                      className="text-green-600 hover:text-green-800"
                                      title="Download Document"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-2 hover:border-orange-300 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">Parts</span>
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          className="hidden" 
                          id="edit-parts-warranty"
                          onChange={(e) => {
                            if (e.target.files && selectedVehicle) {
                              handleFileUpload(e.target.files, selectedVehicle.id, 'Parts Warranty');
                              e.target.value = '';
                            }
                          }}
                        />
                        <label htmlFor="edit-parts-warranty" className="block w-full text-center py-1 px-1 border border-orange-300 rounded text-xs text-orange-700 hover:bg-orange-50 cursor-pointer">
                          {uploadingFiles[`${selectedVehicle?.id}-Parts Warranty`] ? '...' : 'Upload'}
                        </label>
                        {vehicleDocuments && Array.isArray(vehicleDocuments) && vehicleDocuments.filter(doc => doc.documentCategory === 'Parts Warranty').length > 0 && (
                          <div className="mt-1 space-y-1">
                            {vehicleDocuments
                              .filter(doc => doc.documentCategory === 'Parts Warranty')
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                  <span className="truncate">{doc.originalName}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/view`, '_blank')}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View Document"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/download`, '_blank')}
                                      className="text-green-600 hover:text-green-800"
                                      title="Download Document"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Documents */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Additional Documents</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">Maintenance Records</span>
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          className="hidden" 
                          id="edit-maintenance-records"
                          onChange={(e) => {
                            if (e.target.files && selectedVehicle) {
                              handleFileUpload(e.target.files, selectedVehicle.id, 'Maintenance Records');
                              e.target.value = '';
                            }
                          }}
                        />
                        <label htmlFor="edit-maintenance-records" className="block w-full text-center py-1 px-2 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">
                          {uploadingFiles[`${selectedVehicle?.id}-Maintenance Records`] ? 'Uploading...' : 'Upload Files'}
                        </label>
                        {vehicleDocuments && Array.isArray(vehicleDocuments) && vehicleDocuments.filter(doc => doc.documentCategory === 'Maintenance Records').length > 0 && (
                          <div className="mt-1 space-y-1">
                            {vehicleDocuments
                              .filter(doc => doc.documentCategory === 'Maintenance Records')
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                  <span className="truncate">{doc.originalName}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/view`, '_blank')}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View Document"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/download`, '_blank')}
                                      className="text-green-600 hover:text-green-800"
                                      title="Download Document"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">Other Documents</span>
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.csv,.txt,.mp4,.zip" 
                          className="hidden" 
                          id="edit-other-documents"
                          onChange={(e) => {
                            if (e.target.files && selectedVehicle) {
                              handleFileUpload(e.target.files, selectedVehicle.id, 'Other Documents');
                              e.target.value = '';
                            }
                          }}
                        />
                        <label htmlFor="edit-other-documents" className="block w-full text-center py-1 px-2 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">
                          {uploadingFiles[`${selectedVehicle?.id}-Other Documents`] ? 'Uploading...' : 'Upload Files'}
                        </label>
                        {vehicleDocuments && Array.isArray(vehicleDocuments) && vehicleDocuments.filter(doc => doc.documentCategory === 'Other Documents').length > 0 && (
                          <div className="mt-1 space-y-1">
                            {vehicleDocuments
                              .filter(doc => doc.documentCategory === 'Other Documents')
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                  <span className="truncate">{doc.originalName}</span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/view`, '_blank')}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View Document"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => window.open(`/api/vehicles/documents/${doc.id}/download`, '_blank')}
                                      className="text-green-600 hover:text-green-800"
                                      title="Download Document"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea id="edit-notes" name="notes" rows={3} defaultValue={selectedVehicle.notes || ''} />
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Maintenance Dialog */}
      <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🚗</span>
                <span className="text-lg font-bold">Vehicle Maintenance & Accessory Checklist</span>
              </div>
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Professional tracker for {vehicles.find(v => v.id === selectedVehicleForMaintenance)?.nickname || 'your vehicle'} - 
              Keep your gig work vehicle in top condition
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Stats & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-blue-50 to-amber-50 p-4 rounded-lg border">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${maintenanceItemsData.reduce((sum: number, item: any) => sum + (parseFloat(item.cost) || 0), 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Monthly Budget Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {maintenanceItemsData.filter((item: any) => !item.isCompleted && item.dueDate && new Date(item.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-gray-600">Due This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {maintenanceItemsData.filter((item: any) => item.isCompleted).length}
                </div>
                <div className="text-sm text-gray-600">Completed Tasks</div>
              </div>
            </div>

            {/* Tabbed Sections */}
            <div className="border rounded-lg">
              <div className="border-b bg-gray-50">
                <div className="flex space-x-0">
                  <button 
                    className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                      activeTab === 'maintenance' 
                        ? 'border-blue-600 text-blue-600 bg-white' 
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('maintenance')}
                  >
                    🔧 Vehicle Maintenance
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                      activeTab === 'accessories' 
                        ? 'border-amber-600 text-amber-600 bg-white' 
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('accessories')}
                  >
                    🧰 Accessories & Emergency Essentials
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'maintenance' && (
                  <div className="space-y-4">
                    {/* Pre-loaded Maintenance Tasks */}
                    <div className="grid gap-3">
                      {[
                        { name: 'Oil Change', frequency: 'Every 3,000-5,000 mi', cost: 60, notes: 'Add shop info & upload receipt' },
                        { name: 'Tire Rotation/Replacement', frequency: 'Every 6 months', cost: 400, notes: 'Track tire brand & mileage' },
                        { name: 'Brake Inspection', frequency: 'Every 12 months', cost: 100, notes: 'Front & rear brakes' },
                        { name: 'Windshield Wiper Replacement', frequency: 'Every 6 months', cost: 20, notes: 'Front + rear blades' },
                        { name: 'Monthly Car Wash Membership', frequency: 'Monthly', cost: 30, notes: 'Interior/Exterior service' },
                        { name: 'AAA Membership', frequency: 'Annually', cost: 80, notes: 'Include sign-up link' },
                        { name: 'Insurance Payment', frequency: 'Monthly', cost: 150, notes: 'Add provider & policy no.' },
                        { name: 'Vehicle Registration', frequency: 'Annually', cost: 75, notes: 'Add VIN, plate no., and exp. date' },
                        { name: 'Heater & AC Functionality Check', frequency: 'Bi-annually', cost: 0, notes: 'Manual or shop visit' },
                        { name: 'Dash Cam Maintenance & Storage', frequency: 'Monthly', cost: 10, notes: 'Check recording, SD card, cable wear' },
                        { name: 'Light Bulb Check', frequency: 'Monthly', cost: 10, notes: 'Check high beams, blinkers, brakes' },
                        { name: 'Alignment Check', frequency: 'Annually', cost: 120, notes: 'Protects tire investment' }
                      ].map((task, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                              <div>
                                <div className="font-medium text-gray-900">{task.name}</div>
                                <div className="text-sm text-gray-600">{task.frequency} • Est. ${task.cost}</div>
                                <div className="text-xs text-gray-500 mt-1">{task.notes}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">📅 Set Due Date</Button>
                              <Button size="sm" variant="outline">💰 Log Cost</Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setNewMaintenanceItem({
                                    itemName: task.name,
                                    category: 'maintenance',
                                    description: task.notes,
                                    notes: '',
                                    dueDate: '',
                                    priority: 'medium',
                                    cost: task.cost.toString(),
                                    serviceProvider: '',
                                    reminderEnabled: true,
                                    reminderDays: 7
                                  });
                                  setIsAddMaintenanceItemOpen(true);
                                }}
                              >
                                + Add to My List
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'accessories' && (
                  <div className="space-y-4">
                    {/* Pre-loaded Accessory Items */}
                    <div className="grid gap-3">
                      {[
                        { name: 'Cell Phone Holder', interval: 'Replace yearly', cost: 15, notes: 'Required for safe GPS navigation' },
                        { name: 'Air Freshener', interval: 'Monthly', cost: 5, notes: 'Keep ride fresh & professional' },
                        { name: 'Tissue Box', interval: 'Monthly', cost: 3, notes: 'Keep in glove box' },
                        { name: 'Napkins or Paper Towels', interval: 'Bi-weekly', cost: 4, notes: 'Quick cleanup' },
                        { name: 'Rubber Floor Mats', interval: 'Replace yearly', cost: 30, notes: 'Protect carpet & improve resale' },
                        { name: 'Vehicle Glass Cleaner & Wipes', interval: 'Monthly', cost: 8, notes: 'Spot cleaning between trips' },
                        { name: 'Box of Disposable Face Masks', interval: 'Monthly', cost: 10, notes: 'For health & hygiene' },
                        { name: 'Cleaning Gloves (Latex/Nitrile)', interval: 'As needed', cost: 6, notes: 'For mess or sick passenger cleanup' },
                        { name: 'Mini First Aid Kit w/ Band-Aids', interval: 'Quarterly', cost: 10, notes: 'Include antiseptic & gloves' },
                        { name: 'Extra Pair of Prescription Glasses', interval: 'Annually', cost: 0, notes: 'Backup in case of loss/break' },
                        { name: 'Dash Cam (device)', interval: 'One-time + Check', cost: 90, notes: 'Protect from disputes, store video to cloud' },
                        { name: 'Fire Extinguisher (small car-safe)', interval: 'Every 5 years', cost: 20, notes: 'Optional but recommended' },
                        { name: 'Emergency LED Flashlight', interval: 'Check batteries quarterly', cost: 10, notes: 'Keep in glove or console' },
                        { name: 'Umbrella/Rain Poncho', interval: 'Optional', cost: 10, notes: 'Protect yourself on delivery' },
                        { name: 'Seat Cushion for Comfort', interval: 'Replace as needed', cost: 25, notes: 'Especially for long shifts' }
                      ].map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input type="checkbox" className="w-5 h-5 text-amber-600 rounded" />
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-600">{item.interval} • Est. ${item.cost}</div>
                                <div className="text-xs text-gray-500 mt-1">{item.notes}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">📅 Set Reminder</Button>
                              <Button size="sm" variant="outline">💰 Log Cost</Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setNewMaintenanceItem({
                                    itemName: item.name,
                                    category: 'accessory',
                                    description: item.notes,
                                    notes: '',
                                    dueDate: '',
                                    priority: 'medium',
                                    cost: item.cost.toString(),
                                    serviceProvider: '',
                                    reminderEnabled: true,
                                    reminderDays: 7
                                  });
                                  setIsAddMaintenanceItemOpen(true);
                                }}
                              >
                                + Add to My List
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* My Personal List Section */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">📋 My Personal Checklist</h3>
                    <Button
                      onClick={() => setIsAddMaintenanceItemOpen(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Custom Item
                    </Button>
                  </div>

                  {/* Personal Items List */}
                  {isLoadingMaintenanceItems ? (
                    <div className="text-center py-8">
                      <div className="text-sm text-gray-500">Loading your personal checklist...</div>
                    </div>
                  ) : maintenanceItemsData.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-medium mb-2">No personal items yet!</p>
                      <p className="text-gray-400 text-sm">Click "+ Add to My List" on any item above to start your personal tracker</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {maintenanceItemsData.map((item: any) => (
                        <div key={item.id} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <input 
                                type="checkbox" 
                                checked={item.isCompleted}
                                onChange={() => {
                                  updateMaintenanceItemMutation.mutate({
                                    itemId: item.id,
                                    updates: { isCompleted: !item.isCompleted }
                                  });
                                }}
                                className="w-5 h-5 text-blue-600 rounded"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className={`font-medium ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {item.itemName}
                                  </span>
                                  <Badge variant={item.category === 'maintenance' ? 'default' : 'secondary'}>
                                    {item.category === 'maintenance' ? '🔧' : '🧰'} {item.category}
                                  </Badge>
                                  {item.priority === 'high' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                                  {item.dueDate && (
                                    <span className="flex items-center space-x-1">
                                      <Calendar className="w-3 h-3" />
                                      <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                    </span>
                                  )}
                                  {item.cost && <span>💰 ${item.cost}</span>}
                                  {item.serviceProvider && <span>🏪 {item.serviceProvider}</span>}
                                </div>
                                {item.notes && (
                                  <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                                    📝 {item.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 ml-4">
                              <Button size="sm" variant="outline">📅</Button>
                              <Button size="sm" variant="outline">💰</Button>
                              <Button size="sm" variant="outline">📸</Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (confirm('Remove this item from your checklist?')) {
                                    deleteMaintenanceItemMutation.mutate(item.id);
                                  }
                                }}
                              >
                                🗑️
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Item Form */}
                {isAddMaintenanceItemOpen && (
                  <div className="mt-6 bg-white p-6 rounded-lg border-2 border-blue-200 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Add Custom Item</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Item Name *</label>
                        <Input
                          value={newMaintenanceItem.itemName}
                          onChange={(e) => setNewMaintenanceItem({...newMaintenanceItem, itemName: e.target.value})}
                          placeholder="e.g., Custom air freshener"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <Select
                          value={newMaintenanceItem.category}
                          onValueChange={(value) => setNewMaintenanceItem({...newMaintenanceItem, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                            <SelectItem value="accessory">🧰 Accessory</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Input
                        value={newMaintenanceItem.description}
                        onChange={(e) => setNewMaintenanceItem({...newMaintenanceItem, description: e.target.value})}
                        placeholder="Brief description"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Due Date</label>
                        <Input
                          type="date"
                          value={newMaintenanceItem.dueDate}
                          onChange={(e) => setNewMaintenanceItem({...newMaintenanceItem, dueDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Priority</label>
                        <Select
                          value={newMaintenanceItem.priority}
                          onValueChange={(value) => setNewMaintenanceItem({...newMaintenanceItem, priority: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">🟢 Low</SelectItem>
                            <SelectItem value="medium">🟡 Medium</SelectItem>
                            <SelectItem value="high">🔴 High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Estimated Cost</label>
                        <Input
                          type="number"
                          value={newMaintenanceItem.cost}
                          onChange={(e) => setNewMaintenanceItem({...newMaintenanceItem, cost: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Service Provider</label>
                        <Input
                          value={newMaintenanceItem.serviceProvider}
                          onChange={(e) => setNewMaintenanceItem({...newMaintenanceItem, serviceProvider: e.target.value})}
                          placeholder="e.g., AutoZone, Local Shop"
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <input 
                          type="checkbox" 
                          checked={newMaintenanceItem.reminderEnabled}
                          onChange={(e) => setNewMaintenanceItem({...newMaintenanceItem, reminderEnabled: e.target.checked})}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label className="text-sm text-gray-700">🔔 Enable reminder alerts</label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Notes</label>
                      <Textarea
                        value={newMaintenanceItem.notes}
                        onChange={(e) => setNewMaintenanceItem({...newMaintenanceItem, notes: e.target.value})}
                        placeholder="Additional notes or details..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddMaintenanceItemOpen(false);
                          setNewMaintenanceItem({
                            itemName: '',
                            category: 'maintenance',
                            description: '',
                            notes: '',
                            dueDate: '',
                            priority: 'medium',
                            cost: '',
                            serviceProvider: '',
                            reminderEnabled: false,
                            reminderDays: 7
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (newMaintenanceItem.itemName.trim()) {
                            createMaintenanceItemMutation.mutate(newMaintenanceItem);
                          }
                        }}
                        disabled={!newMaintenanceItem.itemName.trim() || createMaintenanceItemMutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {createMaintenanceItemMutation.isPending ? 'Adding...' : '✅ Add to My List'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Helpful Integrations & Actions */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔗 Helpful Integrations & Tools</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center space-y-1">
                  <span>📱</span>
                  <span className="text-xs">Sync Calendar</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center space-y-1">
                  <span>🏪</span>
                  <span className="text-xs">Find Auto Shops</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center space-y-1">
                  <span>🛡️</span>
                  <span className="text-xs">AAA Membership</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center space-y-1">
                  <span>📄</span>
                  <span className="text-xs">Export PDF</span>
                </Button>
              </div>
            </div>

            {/* Emergency Mode Button */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
                onClick={() => {
                  // Emergency mode functionality
                  window.open('https://www.google.com/maps/search/emergency+services+near+me', '_blank');
                }}
              >
                🚨 EMERGENCY MODE - Find Nearby Help
              </Button>
              <p className="text-xs text-red-600 text-center mt-2">
                Opens nearby hospitals, police stations, and repair shops
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-center pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowMaintenanceDialog(false)}
                className="px-8"
              >
                Close Maintenance Tracker
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}