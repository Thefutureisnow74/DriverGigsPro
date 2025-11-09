import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  FileText,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Upload,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle2,
  Phone,
  Globe,
  Mail,
  MapPin,
  CreditCard,
  Users,
  User,
  FileIcon,
  Building,
  Save,
  Shield,
  TrendingUp,
  Target,
  DollarSign,
  Briefcase,
  Settings,
  Award,
  Truck
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
// Utility function to calculate days until expiration
const calculateDaysUntil = (dateString: string): { days: number; isOverdue: boolean; isUpcoming: boolean } => {
  if (!dateString) return { days: 0, isOverdue: false, isUpcoming: false };
  const today = new Date();
  let expirationDate: Date;
  // Parse different date formats
  if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
    // MM-DD-YYYY format
    const [month, day, year] = dateString.split('-');
    expirationDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // YYYY-MM-DD format
    const [year, month, day] = dateString.split('-');
    expirationDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    // Fallback: try to parse as-is
    expirationDate = new Date(dateString);
  }
  const timeDiff = expirationDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return {
    days: Math.abs(daysDiff),
    isOverdue: daysDiff < 0,
    isUpcoming: daysDiff <= 30 && daysDiff > 0
  };
};
// Countdown Display Component
const CountdownDisplay = ({ label, date, icon: Icon }: { label: string; date: string; icon: any }) => {
  const [countdown, setCountdown] = useState(calculateDaysUntil(date));
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateDaysUntil(date));
    }, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(interval);
  }, [date]);
  if (!date) {
    return (
      <div className="flex items-center text-sm text-gray-400">
        <Icon size={14} className="mr-2" />
        {label}: Not set
      </div>
    );
  }
  const getColorClass = () => {
    if (countdown.isOverdue) return "text-red-600";
    if (countdown.isUpcoming) return "text-orange-600";
    return "text-green-600";
  };
  const getStatusText = () => {
    if (countdown.isOverdue) return `${countdown.days} days overdue`;
    if (countdown.isUpcoming) return `${countdown.days} days remaining`;
    return `${countdown.days} days remaining`;
  };
  // Format date for display (ensure MM-DD-YYYY format)
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    // If already in MM-DD-YYYY format, return as is
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return dateString;
    }
    // If in YYYY-MM-DD format, convert to MM-DD-YYYY
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${month}-${day}-${year}`;
    }
    return dateString;
  };
  return (
    <div className={`flex items-center text-sm font-medium ${getColorClass()}`}>
      <Icon size={14} className="mr-2" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{label}</span>
        <span>{getStatusText()}</span>
        <span className="text-xs opacity-75">{formatDisplayDate(date)}</span>
      </div>
    </div>
  );
};
// Simple section tracking
const BUSINESS_SECTIONS = ['Company', 'Agent', 'Contact', 'Finance', 'Mail/Web', 'Credit', 'Digital', 'Business'];
// Simple completion tracking
const calculateSectionCompletion = (profile: any, sectionKey: string): number => {
  if (!profile) return 0;
  const totalFields = Object.keys(profile).length;
  const filledFields = Object.values(profile).filter(value => value && value.toString().trim() !== '').length;
  return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
};
// Function to calculate completion percentage for a business profile
const calculateCompletionPercentage = (profile: any): { percentage: number; completedSections: string[]; missingSections: string[] } => {
  // Get all unique field names from the profile schema
  const allFields = [
    // Company fields
    'companyName', 'businessType', 'ein', 'stateOfOrganization', 'formationDate', 'status',
    'companyAddress', 'companyCity', 'companyState', 'companyZipCode', 'organizer', 'currentManagingMembers',
    // Agent fields
    'registeredAgent', 'registeredAgentAddress', 'registeredAgentCity', 'registeredAgentState', 'registeredAgentZipCode', 'registeredAgentPhone',
    // Contact fields
    'companyPhone', 'phoneProvider', 'email',
    // Banking/Finance fields
    'banking', 'routingNumber', 'accountNumber', 'bankName', 'bankAddress',
    'franchiseTaxFilingDate', 'franchiseTaxLogin', 'franchiseTaxNumber', 'franchiseXtNumber',
    // Mailing fields
    'mailboxProvider', 'mailboxProviderWebsite', 'mailboxProviderLogin',
    'mailboxNumber', 'mailboxAddress', 'mailboxPhone',
    // Digital/Web fields
    'website', 'websiteHost', 'websiteHostLogin', 'emailLogin', 'domainName',
    'gmailAccount', 'youtubeChannel', 'facebookPage', 'tiktokAccount', 'instagramAccount', 'linkedinProfile',
    // Business/Legal fields
    'sosFileNumber', 'sosFileLink', 'dunBradstreetNumber', 'dunBradstreetWebsite',
    'businessPlan',
    // Insurance fields
    'generalLiabilityInsurer', 'generalLiabilityPolicyNumber', 'generalLiabilityExpiry',
    'professionalLiabilityInsurer', 'professionalLiabilityPolicyNumber', 'professionalLiabilityExpiry',
    'businessLicenseNumber', 'businessLicenseType', 'businessLicenseExpiry',
    // Trademark & Branding fields
    'trademarkNumber', 'trademarkStatus', 'trademarkFilingDate', 'logoDesigner', 'logoFile', 'brandGuidelines'
  ];
  const completedSections: string[] = [];
  const missingSections: string[] = [];
  let totalFields = allFields.length;
  let completedFields = 0;
  // Count completed fields
  allFields.forEach((field: string) => {
    const value = profile[field];
    if (value && value.toString().trim() !== '' && value !== null && value !== undefined) {
      // Handle arrays specifically
      if (Array.isArray(value) && value.length > 0 && value.some(item => item && item.toString().trim() !== '')) {
        completedFields++;
      } else if (!Array.isArray(value)) {
        completedFields++;
      }
    }
  });
  const percentage = Math.round((completedFields / totalFields) * 100);
  return {
    percentage,
    completedSections,
    missingSections
  };
};
// Progress Bar Component
const ProgressBar = ({ percentage, className = "" }: { percentage: number; className?: string }) => {
  const getProgressColor = (percent: number) => {
    if (percent >= 80) return "bg-green-500";
    if (percent >= 50) return "bg-yellow-500";
    if (percent >= 25) return "bg-orange-500";
    return "bg-red-500";
  };
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
// Comprehensive business profiles with all required fields
const businessProfiles = [
  {
    id: 1,
    companyName: "Atlanta Logistics LLC",
    businessType: "Limited Liability Company",
    registeredAgent: "Georgia Corporate Services",
    registeredAgentAddress: "1234 Peachtree St NE, Atlanta, GA 30309",
    registeredAgentPhone: "(404) 555-0123",
    sosFileNumber: "21234567",
    sosFileLink: "https://drive.google.com/file/d/abc123",
    formationDate: "2023-03-15",
    age: "1 year 9 months",
    companyAddress: "5678 Commerce Dr, Atlanta, GA 30328",
    mailboxProvider: "iPostal1",
    mailboxProviderWebsite: "https://ipostal1.com",
    mailboxProviderLogin: "atlanta.logistics@ipostal1.com | Pass123!",
    companyPhone: "(470) 555-7890",
    phoneProvider: "Google Voice",
    ein: "88-1234567",
    stateOfOrganization: "Georgia",
    currentManagingMembers: ["Bonnie Andrade", "Michael Thompson"],
    banking: "Chase Business Complete Banking",
    status: "Active",
    organizer: "Bonnie Andrade",
    website: "www.atlantalogistics.com",
    websiteHost: "GoDaddy",
    websiteHostLogin: "admin@atlantalogistics.com | WebPass456",
    email: "info@atlantalogistics.com",
    emailLogin: "info@atlantalogistics.com | EmailPass789",
    franchiseTaxFilingDate: "2024-04-01",
    franchiseTaxLogin: "georgia.gov | TaxUser123 | TaxPass456",
    franchiseTaxNumber: "1234567890",
    // Expiration dates for countdown demo - realistic upcoming dates
    annualFranchiseFilingDueDate: "03-15-2025",
    websiteDomainExpirationDate: "02-28-2025",
    annualReportDueDate: "04-01-2025",
    businessFilingExpirationDate: "06-30-2025",
    annualTaxFilingDeadline: "04-15-2025",
    quarterlyTaxDeadlineQ1: "01-31-2025",
    quarterlyTaxDeadlineQ2: "04-30-2025",
    quarterlyTaxDeadlineQ3: "07-31-2025",
    quarterlyTaxDeadlineQ4: "10-31-2025",
    franchiseXtNumber: "XT-789012",
    dunBradstreetNumber: "123456789",
    dunBradstreetWebsite: "https://www.dnb.com/business-directory/company-profiles.atlanta_logistics_llc.html",
    nicis: "NICIS-456789",
    documentsCount: 18,
    // New fields from Business Formation steps
    domainName: "atlantalogistics.com",
    gmailAccount: "atlanta.logistics.llc@gmail.com",
    gmailPassword: "SecurePass123!",
    youtubeChannel: "AtlantaLogisticsTV",
    youtubeChannelUrl: "https://youtube.com/@atlantalogisticstv",
    facebookPage: "AtlantaLogisticsLLC",
    facebookPageUrl: "https://facebook.com/atlantalogisticsllc",
    tiktokUsername: "@atlantalogistics",
    tiktokUrl: "https://tiktok.com/@atlantalogistics",
    instagramAccount: "atlantalogistics_llc",
    instagramUrl: "https://instagram.com/atlantalogistics_llc",
    linkedinProfile: "atlanta-logistics-llc",
    linkedinUrl: "https://linkedin.com/company/atlanta-logistics-llc",
    trademarkNumber: "TM-2023-001234",
    trademarkStatus: "Registered",
    trademarkFilingDate: "2023-02-15",
    businessPlanDocument: "Atlanta_Logistics_Business_Plan_2023.pdf",
    generalLiabilityInsurer: "Next Insurance",
    generalLiabilityPolicyNumber: "NI-2023-567890",
    generalLiabilityExpiry: "2024-12-31",
    professionalLiabilityInsurer: "HISCOX",
    professionalLiabilityPolicyNumber: "HX-2023-123456",
    professionalLiabilityExpiry: "2024-12-31",
    businessLicenseNumber: "BL-2023-789012",
    businessLicenseType: "General Business License",
    businessLicenseExpiry: "2024-12-31",
    vehicleInsuranceProvider: "State Farm Business",
    vehicleInsurancePolicyNumber: "SF-BIZ-2023-345678",
    vehicleInsuranceExpiry: "2024-06-30",
    logoDesigner: "Professional Designs LLC",
    logoFile: "Atlanta_Logistics_Logo_Package.zip",
    brandGuidelines: "Atlanta_Logistics_Brand_Guidelines.pdf"
  },
  {
    id: 2,
    companyName: "Southern Transport Solutions Inc",
    businessType: "Corporation",
    registeredAgent: "Atlanta Registered Agent Services",
    registeredAgentAddress: "9876 Corporate Blvd, Atlanta, GA 30342",
    registeredAgentPhone: "(404) 555-0456",
    sosFileNumber: "21987654",
    sosFileLink: "https://drive.google.com/file/d/def456",
    formationDate: "2022-08-22",
    age: "2 years 4 months",
    companyAddress: "1122 Industrial Way, Marietta, GA 30062",
    mailboxProvider: "PostNet",
    mailboxProviderWebsite: "https://postnet.com",
    mailboxProviderLogin: "southern.transport@postnet.com | PostPass321",
    companyPhone: "(678) 555-3456",
    phoneProvider: "RingCentral",
    ein: "88-7654321",
    stateOfOrganization: "Georgia",
    currentManagingMembers: ["Bonnie Andrade"],
    banking: "Wells Fargo Business Choice Checking",
    status: "Active",
    organizer: "Business Formation Pro",
    website: "www.southerntransportsolutions.com",
    websiteHost: "BlueHost",
    websiteHostLogin: "admin@southerntransportsolutions.com | BluePass789",
    email: "contact@southerntransportsolutions.com",
    emailLogin: "contact@southerntransportsolutions.com | ContactPass123",
    franchiseTaxFilingDate: "2024-03-15",
    franchiseTaxLogin: "georgia.gov | CorpUser456 | CorpPass789",
    franchiseTaxNumber: "9876543210",
    // Expiration dates with different countdown states
    annualFranchiseFilingDueDate: "02-15-2025", // Upcoming
    websiteDomainExpirationDate: "01-10-2025", // Very upcoming
    annualReportDueDate: "05-15-2025", // Future
    businessFilingExpirationDate: "03-30-2025", // Upcoming
    annualTaxFilingDeadline: "04-15-2025",
    quarterlyTaxDeadlineQ1: "01-15-2025", // Very upcoming
    quarterlyTaxDeadlineQ2: "04-15-2025",
    quarterlyTaxDeadlineQ3: "07-15-2025",
    quarterlyTaxDeadlineQ4: "10-15-2025",
    franchiseXtNumber: "XT-345678",
    dunBradstreetNumber: "987654321",
    dunBradstreetWebsite: "https://www.dnb.com/business-directory/company-profiles.southern_transport_solutions_inc.html",
    nicis: "NICIS-123456",
    documentsCount: 24
  },
  {
    id: 3,
    companyName: "Express Delivery Partners LLC",
    businessType: "Limited Liability Company",
    registeredAgent: "Legal Zoom Agent Services",
    registeredAgentAddress: "3456 Legal Plaza, Atlanta, GA 30305",
    registeredAgentPhone: "(470) 555-0789",
    sosFileNumber: "21456789",
    sosFileLink: "https://drive.google.com/file/d/ghi789",
    formationDate: "2024-01-10",
    age: "11 months",
    companyAddress: "7890 Delivery Center Dr, Duluth, GA 30096",
    mailboxProvider: "UPS Store",
    mailboxProviderWebsite: "https://theupsstore.com",
    mailboxProviderLogin: "express.delivery@upsmailbox.com | UPSPass654",
    companyPhone: "(404) 555-9012",
    phoneProvider: "Vonage Business",
    ein: "88-9012345",
    stateOfOrganization: "Georgia",
    currentManagingMembers: ["Bonnie Andrade", "Sarah Johnson"],
    banking: "Bank of America Business Advantage",
    status: "Active",
    organizer: "LegalZoom Services",
    website: "www.expressdeliverypartners.com",
    websiteHost: "HostGator",
    websiteHostLogin: "admin@expressdeliverypartners.com | HostPass321",
    email: "info@expressdeliverypartners.com",
    emailLogin: "info@expressdeliverypartners.com | InfoPass987",
    franchiseTaxFilingDate: "2024-12-31",
    franchiseTaxLogin: "georgia.gov | ExpressUser789 | ExpressPass012",
    franchiseTaxNumber: "5432109876",
    franchiseXtNumber: "XT-901234",
    dunBradstreetNumber: "543210987",
    dunBradstreetWebsite: "https://www.dnb.com/business-directory/company-profiles.express_delivery_partners_llc.html",
    nicis: "NICIS-789012",
    documentsCount: 12
  }
];
const documentTypes = [
  "Business Plan", "EIN Letter", "Articles of Formation", "Operating Agreement",
  "Bank Statements", "Tax Returns", "Insurance Policies", "Contracts", "Permits", "Other"
];

// Document Upload Field Component
const DocumentUploadField = ({ 
  label, 
  documentType, 
  businessEntityId, 
  onUploadSuccess 
}: {
  label: string;
  documentType: string;
  businessEntityId: number;
  onUploadSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Query to get documents for this business entity
  const { data: documents = [] } = useQuery({
    queryKey: ["/api/business-documents"],
    select: (data: any[]) => {
      if (!Array.isArray(data)) return [];
      return data.filter((doc: any) => 
        doc.businessEntityId === businessEntityId && 
        doc.documentType === documentType &&
        doc.status === 'active'
      );
    },
    enabled: !!businessEntityId
  });

  const existingDocument = documents.length > 0 ? documents[0] : null;

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setIsUploading(true);
      const response = await fetch("/api/business-documents", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Document uploaded successfully!" });
      onUploadSuccess();
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: any) => {
      toast({ 
        title: "Upload failed", 
        description: error.message,
        variant: "destructive" 
      });
      setIsUploading(false);
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentName', file.name);
    formData.append('documentType', documentType);
    formData.append('documentCategory', documentType === 'SS4' ? 'Tax' : 'Formation');
    formData.append('businessEntityId', businessEntityId.toString());
    formData.append('notes', `${label} uploaded`);

    uploadMutation.mutate(formData);
  };

  const handleView = async (document: any) => {
    try {
      const response = await fetch(`/api/business-documents/${document.id}/view`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (error) {
      toast({ 
        title: "View failed", 
        description: "Could not open document",
        variant: "destructive" 
      });
    }
  };

  const handleDownload = async (document: any) => {
    try {
      const response = await fetch(`/api/business-documents/${document.id}/view`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = document.documentName || `${documentType}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast({ 
        title: "Download failed", 
        description: "Could not download document",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-600">{label}</Label>
      
      {existingDocument ? (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <FileText size={16} className="text-green-600" />
          <span className="text-sm text-green-800 flex-1">{existingDocument.documentName}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleView(existingDocument)}
            className="px-2 py-1 h-auto"
          >
            <Eye size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDownload(existingDocument)}
            className="px-2 py-1 h-auto"
          >
            <Download size={14} />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="hidden"
              id={`upload-${documentType}-${businessEntityId}`}
            />
            <label 
              htmlFor={`upload-${documentType}-${businessEntityId}`}
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {isUploading ? "Uploading..." : "Click to upload"}
              </span>
              <span className="text-xs text-gray-400">
                PDF, DOC, DOCX, PNG, JPG (max 10MB)
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
export default function BusinessDocumentStorage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  // Fetch business entities from database
  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["/api/business-entities"],
    retry: false,
  });
  // Keep local state for UI updates
  const [localProfiles, setLocalProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState<{[key: number]: any}>({});
  const [editingCompanyName, setEditingCompanyName] = useState<{id: number, name: string} | null>(null);
  const [newProfileData, setNewProfileData] = useState({
    companyName: '',
    businessType: '',
    state: '',
    status: 'Active',
    formationDate: '',
    ein: '',
    companyPhone: '',
    email: '',
    website: '',
    registeredAgent: '',
    registeredAgentAddress: '',
    registeredAgentCity: '',
    registeredAgentState: '',
    registeredAgentZipCode: '',
    registeredAgentPhone: '',
    sosFileNumber: '',
    sosFileLink: '',
    phoneProvider: '',
    emailProvider: '',
    businessAddress: '',
    mailingAddress: '',
    iPostalAddress: '',
    businessBankAccount: '',
    businessBankRouting: '',
    businessCreditCard: '',
    taxIdLogin: '',
    franchiseNumber: '',
    franchiseXtNumber: '',
    franchiseTaxLogin: '',
    dAndBNumber: '',
    nicisNumber: '',
    managingMember: '',
    domainName: '',
    gmailAccount: '',
    youtubeChannel: '',
    facebookPage: '',
    tiktokAccount: '',
    instagramAccount: '',
    linkedinProfile: '',
    trademarkInfo: '',
    businessPlan: '',
    generalLiabilityInsurance: '',
    professionalLiabilityInsurance: '',
    vehicleInsurance: '',
    businessLicense: '',
    logoFile: '',
    brandGuidelines: '',
    documentCount: 0
  });
  // Auto-save functionality with database persistence
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // Mutation for updating business entities
  const updateEntityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest(`/api/business-entities/${id}`, { method: "PUT", body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-entities"] });
      setLastSaved(new Date().toLocaleTimeString());
      setIsSaving(false);
      toast({
        title: "Auto-saved",
        description: "Changes saved to database",
        duration: 1500,
      });
    },
    onError: (error) => {
      setIsSaving(false);
      console.error("Failed to save profile:", error);
      toast({
        title: "Save failed",
        description: "Failed to save changes to database",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
  // Unified auto-save for individual fields with debouncing (800ms)
  const [savingFields, setSavingFields] = useState<Set<string>>(new Set());
  const fieldSaveTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const debouncedFieldSave = useCallback((profileId: number, field: string, value: string) => {
    const fieldKey = `${profileId}-${field}`;
    // Clear existing timer for this field
    if (fieldSaveTimers.current[fieldKey]) {
      clearTimeout(fieldSaveTimers.current[fieldKey]);
    }
    // Set field as saving after debounce period
    fieldSaveTimers.current[fieldKey] = setTimeout(async () => {
      setSavingFields(prev => new Set(prev).add(fieldKey));
      console.log(`\n=== FRONTEND SAVE ===`);
      console.log(`Field: ${field}`);
      console.log(`Value: ${value} (type: ${typeof value})`);
      console.log(`ProfileId: ${profileId}`);
      console.log(`Request body:`, { field, value });
      try {
        const response = await apiRequest(`/api/business-entities/${profileId}`, {
          method: "PUT",
          body: { field, value },
        });
        console.log(`Response:`, response);
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ["/api/business-entities"] });
          toast({
            title: "Saved ✓",
            description: `${field} updated successfully`,
          });
        } else {
          throw new Error('Save failed');
        }
      } catch (error: any) {
        console.error(`Error saving ${field}:`, error);
        toast({
          title: "Save failed",
          description: error.message || `Failed to update ${field}`,
          variant: "destructive",
        });
      } finally {
        setSavingFields(prev => {
          const next = new Set(prev);
          next.delete(fieldKey);
          return next;
        });
        delete fieldSaveTimers.current[fieldKey];
      }
    }, 800);
  }, [queryClient, toast]);
  // Simple auto-save to database
  const autoSave = useCallback((profile: any) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setIsSaving(true);
      console.log('Auto-saving profile to database:', profile);
      updateEntityMutation.mutate({ id: profile.id, data: profile });
    }, 1000);
  }, [updateEntityMutation]);
  // Sync profiles from server to local state
  useEffect(() => {
    if (profiles && Array.isArray(profiles) && profiles.length > 0) {
      setLocalProfiles(profiles);
    }
  }, [profiles]);
  // Save profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('businessProfiles', JSON.stringify(localProfiles));
  }, [localProfiles]);
  // Handle URL parameters to auto-open the edit page when navigating from Business Formation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['company', 'agent', 'contact', 'mail', 'finance', 'credit', 'digital', 'business'].includes(tabParam)) {
      // Auto-open the first profile for editing if we have a tab parameter
      if (localProfiles && localProfiles.length > 0) {
        setLocation(`/edit-business-profile/${localProfiles[0].id}?tab=${tabParam}`);
      }
    }
  }, [profiles, localProfiles, setLocation]);
  // Inline editing functions with database auto-save
  const handleFieldUpdate = (profileId: number, field: string, value: string) => {
    // Update local profiles array immediately for instant UI feedback (optimistic update)
    const updatedProfiles = localProfiles.map(p =>
      p.id === profileId ? { ...p, [field]: value } : p
    );
    setLocalProfiles(updatedProfiles);
    // Trigger field-based auto-save to database
    debouncedFieldSave(profileId, field, value);
    // Clear unsaved changes for this field since we're auto-saving
    setUnsavedChanges(prev => {
      const newChanges = { ...prev };
      if (newChanges[profileId]) {
        delete newChanges[profileId][field];
        if (Object.keys(newChanges[profileId]).length === 0) {
          delete newChanges[profileId];
        }
      }
      return newChanges;
    });
  };
  const EditableField = ({ profile, field, children, className = "", type = "text" }: {
    profile: any,
    field: string,
    children: React.ReactNode,
    className?: string,
    type?: string
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(profile[field] || '');
    const handleSave = () => {
      handleFieldUpdate(profile.id, field, editValue);
      setIsEditing(false);
    };
    const handleCancel = () => {
      setEditValue(profile[field] || '');
      setIsEditing(false);
    };
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            className="text-xs"
            autoFocus
            onBlur={handleSave}
          />
        </div>
      );
    }
    return (
      <span className={className}>
        {children}
      </span>
    );
  };
  const EditableSelect = ({ profile, field, children, options, className = "" }: {
    profile: any,
    field: string,
    children: React.ReactNode,
    options: { value: string, label: string }[],
    className?: string
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(profile[field] || '');
    const handleSave = (value: string) => {
      handleFieldUpdate(profile.id, field, value);
      setIsEditing(false);
    };
    if (isEditing) {
      return (
        <Select
          value={editValue}
          onValueChange={(value) => {
            setEditValue(value);
            handleSave(value);
          }}
          onOpenChange={(open) => !open && setIsEditing(false)}
        >
          <SelectTrigger className="text-xs w-auto min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    return (
      <span className={className}>
        {children}
      </span>
    );
  };
  // Mutation for creating new business entities
  const createEntityMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/business-entities", { method: "POST", body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-entities"] });
      toast({
        title: "Profile Created",
        description: "New business profile created successfully!",
      });
    },
    onError: (error) => {
      console.error("Failed to create profile:", error);
      toast({
        title: "Creation failed",
        description: "Failed to create business profile",
        variant: "destructive",
      });
    },
  });
  // Mutation for deleting business entities
  const deleteEntityMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/business-entities/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-entities"] });
      toast({
        title: "Profile Deleted",
        description: "Business profile deleted successfully!",
        variant: "destructive",
      });
    },
    onError: (error) => {
      console.error("Failed to delete profile:", error);
      toast({
        title: "Deletion failed",
        description: "Failed to delete business profile",
        variant: "destructive",
      });
    },
  });
  // Mutation for updating company name only
  const updateCompanyNameMutation = useMutation({
    mutationFn: async ({ id, companyName }: { id: number; companyName: string }) => {
      return await apiRequest(`/api/business-entities/${id}`, { method: "PUT", body: { companyName } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-entities"] });
      setEditingCompanyName(null);
      toast({
        title: "Company Name Updated",
        description: "Company name updated successfully!",
      });
    },
    onError: (error) => {
      console.error("Failed to update company name:", error);
      toast({
        title: "Update failed",
        description: "Failed to update company name",
        variant: "destructive",
      });
    },
  });
  // Create new profile function (now using database)
  const handleCreateProfile = () => {
    // Create profile data for database
    const profileData = {
      companyName: newProfileData.companyName,
      businessType: newProfileData.businessType,
      stateOfOrganization: newProfileData.state,
      formationDate: newProfileData.formationDate,
      ein: newProfileData.ein,
      companyPhone: newProfileData.companyPhone,
      email: newProfileData.email,
      website: newProfileData.website,
      registeredAgent: newProfileData.registeredAgent || null,
      registeredAgentAddress: newProfileData.registeredAgentAddress || null,
      status: newProfileData.status || "Active",
    };
    // Save to database
    createEntityMutation.mutate(profileData);
    // Reset form and close modal
    setNewProfileData({
      companyName: '',
      businessType: '',
      state: '',
      status: 'Active',
      formationDate: '',
      ein: '',
      companyPhone: '',
      email: '',
      website: '',
      registeredAgent: '',
      registeredAgentAddress: '',
      registeredAgentCity: '',
      registeredAgentState: '',
      registeredAgentZipCode: '',
      registeredAgentPhone: '',
      sosFileNumber: '',
      sosFileLink: '',
      phoneProvider: '',
      emailProvider: '',
      businessAddress: '',
      mailingAddress: '',
      iPostalAddress: '',
      businessBankAccount: '',
      businessBankRouting: '',
      businessCreditCard: '',
      taxIdLogin: '',
      franchiseNumber: '',
      franchiseXtNumber: '',
      franchiseTaxLogin: '',
      dAndBNumber: '',
      nicisNumber: '',
      managingMember: '',
      domainName: '',
      gmailAccount: '',
      youtubeChannel: '',
      facebookPage: '',
      tiktokAccount: '',
      instagramAccount: '',
      linkedinProfile: '',
      trademarkInfo: '',
      businessPlan: '',
      generalLiabilityInsurance: '',
      professionalLiabilityInsurance: '',
      vehicleInsurance: '',
      businessLicense: '',
      logoFile: '',
      brandGuidelines: '',
      documentCount: 0
    });
    setShowCreateProfile(false);
  };
  // Helper function to calculate age from formation date
  const calculateAge = (formationDate: string): string => {
    const today = new Date();
    const formation = new Date(formationDate);
    const diffTime = Math.abs(today.getTime() - formation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
    if (diffYears > 0) {
      return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
    } else {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    }
  };
  const filteredProfiles = (localProfiles || []).filter(profile =>
    profile.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const BusinessProfileDetails = ({ profile }: { profile: any }) => {
    // Fetch the comprehensive business entity data (same as 11-tab editor)
    const { data: fullProfile, isLoading: profileLoading } = useQuery({
      queryKey: [`/api/business-entities/${profile.id}`],
      enabled: !!profile.id,
    });
    if (profileLoading) {
      return (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    }

    // Use comprehensive profile data from 11-tab editor
    const displayProfile = fullProfile || profile;

    return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Company Information (from Company tab) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Company Name</Label>
            <p className="text-sm text-gray-800">{displayProfile.companyName || displayProfile.company_name}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Business Type</Label>
            <p className="text-sm text-gray-800">{displayProfile.businessType || displayProfile.business_type}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">EIN</Label>
            <p className="text-sm text-gray-800">{displayProfile.ein}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">State of Organization</Label>
            <p className="text-sm text-gray-800">{displayProfile.stateOfOrganization || displayProfile.state_of_organization}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Formation Date</Label>
            <p className="text-sm text-gray-800">{displayProfile.formationDate || displayProfile.formation_date}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Status</Label>
            <p className="text-sm text-gray-800">{displayProfile.status}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Company Address</Label>
            <p className="text-sm text-gray-800">{displayProfile.companyAddress || displayProfile.company_address}</p>
          </div>
          
        </div>
      </div>
      {/* Registered Agent */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Registered Agent</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Registered Agent</Label>
            <p className="text-sm text-gray-800">{displayProfile.registeredAgent || displayProfile.registered_agent}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Agent Phone</Label>
            <p className="text-sm text-gray-800">{displayProfile.registeredAgentPhone || displayProfile.registered_agent_phone}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-sm font-medium text-gray-600">Agent Address</Label>
            <p className="text-sm text-gray-800">{displayProfile.registeredAgentAddress || displayProfile.registered_agent_address}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">State File Number</Label>
            <p className="text-sm text-gray-800">{displayProfile.sosFileNumber || displayProfile.sos_file_number}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">State Filing Document</Label>
            {profile.sosFileLink ? (
              <a href={profile.sosFileLink} target="_blank" rel="noopener noreferrer"
                 className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                View File <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-sm text-gray-800">Not uploaded</p>
            )}
          </div>
        </div>
      </div>
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label className="text-sm font-medium text-gray-600">Company Address</Label>
            <div className="text-sm text-gray-800">
              <EditableField profile={profile} field="companyAddress">
                {profile.companyAddress || 'Click to add address'}
              </EditableField>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Company Phone</Label>
            <div className="text-sm text-gray-800">
              <EditableField profile={profile} field="companyPhone" type="tel">
                {profile.companyPhone || 'Click to add phone'}
              </EditableField>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Phone Provider</Label>
            <p className="text-sm text-gray-800">{profile.phoneProvider}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Email</Label>
            <div className="text-sm text-gray-800">
              <EditableField profile={profile} field="email" type="email">
                {profile.email || 'Click to add email'}
              </EditableField>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Email Login</Label>
            <p className="text-sm text-gray-800 font-mono bg-gray-100 p-1 rounded">{profile.emailLogin}</p>
          </div>
        </div>
      </div>
      {/* Mail Services */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Mail Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Mailbox Provider</Label>
            <p className="text-sm text-gray-800">{profile.mailboxProvider}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Provider Website</Label>
            <a href={profile.mailboxProviderWebsite} target="_blank" rel="noopener noreferrer"
               className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Visit <ExternalLink size={12} />
            </a>
          </div>
          <div className="col-span-2">
            <Label className="text-sm font-medium text-gray-600">Provider Login</Label>
            <p className="text-sm text-gray-800 font-mono bg-gray-100 p-1 rounded">{profile.mailboxProviderLogin}</p>
          </div>
        </div>
      </div>
      {/* Website Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Website Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Website</Label>
            <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer"
               className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              {profile.website} <ExternalLink size={12} />
            </a>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Domain Expiration Date</Label>
            <p className={`text-sm font-medium ${profile.websiteDomainExpirationDate ? 'text-red-600' : 'text-gray-400'}`}>
              {profile.websiteDomainExpirationDate || 'Not set'}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Website Host</Label>
            <p className="text-sm text-gray-800">{profile.websiteHost}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-sm font-medium text-gray-600">Host Login</Label>
            <p className="text-sm text-gray-800 font-mono bg-gray-100 p-1 rounded">{profile.websiteHostLogin}</p>
          </div>
        </div>
      </div>
      {/* Banking & Finance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Banking & Finance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Banking</Label>
            <p className="text-sm text-gray-800">{profile.banking}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Organizer</Label>
            <p className="text-sm text-gray-800">{profile.organizer}</p>
          </div>
        </div>
      </div>
      {/* Tax Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Tax Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Franchise Tax Filing Date</Label>
            <p className="text-sm text-gray-800">{profile.franchiseTaxFilingDate}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Annual Franchise Filing Due Date</Label>
            <p className={`text-sm font-medium ${profile.annualFranchiseFilingDueDate ? 'text-red-600' : 'text-gray-400'}`}>
              {profile.annualFranchiseFilingDueDate || 'Not set'}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Annual Report Due Date</Label>
            <p className={`text-sm font-medium ${profile.annualReportDueDate ? 'text-red-600' : 'text-gray-400'}`}>
              {profile.annualReportDueDate || 'Not set'}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Business Filing Expiration Date</Label>
            <p className={`text-sm font-medium ${profile.businessFilingExpirationDate ? 'text-red-600' : 'text-gray-400'}`}>
              {profile.businessFilingExpirationDate || 'Not set'}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Franchise Tax Number</Label>
            <p className="text-sm text-gray-800">{profile.franchiseTaxNumber}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Franchise XT Number</Label>
            <p className="text-sm text-gray-800">{profile.franchiseXtNumber}</p>
          </div>
          <div className="col-span-1">
            <Label className="text-sm font-medium text-gray-600">Tax Login & Password</Label>
            <p className="text-sm text-gray-800 font-mono bg-gray-100 p-1 rounded">{profile.franchiseTaxLogin}</p>
          </div>
        </div>
      </div>
      {/* Business Credit */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Credit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Dun & Bradstreet Number</Label>
            <p className="text-sm text-gray-800">{profile.dunBradstreetNumber}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">NICIS</Label>
            <p className="text-sm text-gray-800">{profile.nicis}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-sm font-medium text-gray-600">D&B Website</Label>
            <a href={profile.dunBradstreetWebsite} target="_blank" rel="noopener noreferrer"
               className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View Profile <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
      {/* Digital Presence */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Digital Presence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Domain Name</Label>
            <p className="text-sm text-gray-800">{profile.domainName || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Gmail Account</Label>
            <p className="text-sm text-gray-800">{profile.gmailAccount || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">YouTube Channel</Label>
            {profile.youtubeChannelUrl ? (
              <a href={profile.youtubeChannelUrl} target="_blank" rel="noopener noreferrer"
                 className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                {profile.youtubeChannel} <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-sm text-gray-800">Not specified</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Facebook Page</Label>
            {profile.facebookPageUrl ? (
              <a href={profile.facebookPageUrl} target="_blank" rel="noopener noreferrer"
                 className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                {profile.facebookPage} <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-sm text-gray-800">Not specified</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">TikTok Account</Label>
            {profile.tiktokUrl ? (
              <a href={profile.tiktokUrl} target="_blank" rel="noopener noreferrer"
                 className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                {profile.tiktokUsername} <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-sm text-gray-800">Not specified</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Instagram Account</Label>
            {profile.instagramUrl ? (
              <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer"
                 className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                {profile.instagramAccount} <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-sm text-gray-800">Not specified</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">LinkedIn Profile</Label>
            {profile.linkedinUrl ? (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                 className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                {profile.linkedinProfile} <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-sm text-gray-800">Not specified</p>
            )}
          </div>
        </div>
      </div>
      {/* Business Documentation & Insurance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Documentation & Insurance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Business Plan</Label>
            <p className="text-sm text-gray-800">{profile.businessPlanDocument || 'Not uploaded'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">General Liability Insurance</Label>
            <p className="text-sm text-gray-800">{profile.generalLiabilityInsurer || 'Not specified'}</p>
            {profile.generalLiabilityPolicyNumber && (
              <p className="text-xs text-gray-600">Policy: {profile.generalLiabilityPolicyNumber}</p>
            )}
            {profile.generalLiabilityExpiry && (
              <p className="text-xs text-gray-600">Expires: {profile.generalLiabilityExpiry}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Professional Liability Insurance</Label>
            <p className="text-sm text-gray-800">{profile.professionalLiabilityInsurer || 'Not specified'}</p>
            {profile.professionalLiabilityPolicyNumber && (
              <p className="text-xs text-gray-600">Policy: {profile.professionalLiabilityPolicyNumber}</p>
            )}
            {profile.professionalLiabilityExpiry && (
              <p className="text-xs text-gray-600">Expires: {profile.professionalLiabilityExpiry}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Business License</Label>
            <p className="text-sm text-gray-800">{profile.businessLicenseType || 'Not specified'}</p>
            {profile.businessLicenseNumber && (
              <p className="text-xs text-gray-600">Number: {profile.businessLicenseNumber}</p>
            )}
            {profile.businessLicenseExpiry && (
              <p className="text-xs text-gray-600">Expires: {profile.businessLicenseExpiry}</p>
            )}
          </div>
        </div>
      </div>
      {/* Managing Members */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Management</h3>
        <div>
          <Label className="text-sm font-medium text-gray-600">Current Managing Members</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {Array.isArray(profile.currentManagingMembers) ? (
              profile.currentManagingMembers.map((member: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {member}
                </Badge>
              ))
            ) : profile.currentManagingMembers ? (
              <Badge variant="outline" className="text-xs">
                {profile.currentManagingMembers}
              </Badge>
            ) : (
              <p className="text-sm text-gray-500">No members listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      My Business
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                      Comprehensive business profile management and document storage
                    </p>
                  </div>
                </div>
                {/* Modern Auto-save status indicator */}
                <div className="flex items-center gap-2">
                  {isSaving ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600"></div>
                      <span>Saving changes...</span>
                    </div>
                  ) : lastSaved ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50">
                      <CheckCircle2 size={16} />
                      <span>Auto-saved {lastSaved}</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCreateProfile(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl font-medium"
                >
                  <Plus size={18} className="mr-2" />
                  Create Business Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Modern Navigation Tabs */}
        <div className="mb-8">
          {/* Modern Search */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search business profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
          </div>
          {/* Business Profiles */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <div key={profile.id} className="space-y-2">
                  {/* Compact Progress Indicator */}
                  <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-800/80 dark:via-slate-900/80 dark:to-slate-800/80 backdrop-blur-lg rounded-xl p-2.5 border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {calculateCompletionPercentage(profile).percentage >= 80 ? (
                          <div className="p-1 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                            <CheckCircle2 size={14} className="text-white" />
                          </div>
                        ) : calculateCompletionPercentage(profile).percentage >= 50 ? (
                          <div className="p-1 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                            <AlertCircle size={14} className="text-white" />
                          </div>
                        ) : (
                          <div className="p-1 bg-gradient-to-br from-rose-500 to-red-600 rounded-lg">
                            <AlertCircle size={14} className="text-white" />
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {calculateCompletionPercentage(profile).percentage}%
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">Complete</span>
                        </div>
                      </div>
                      <div className="flex-1 ml-3 max-w-[120px]">
                        <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              calculateCompletionPercentage(profile).percentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                              calculateCompletionPercentage(profile).percentage >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                              'bg-gradient-to-r from-rose-500 to-red-600'
                            }`}
                            style={{ width: `${calculateCompletionPercentage(profile).percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="cursor-pointer group relative bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500/60 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 hover:scale-[1.02] transition-all duration-300 rounded-2xl overflow-hidden"
                        onClick={() => {
                          setSelectedProfile(profile);
                          setShowProfileDetails(true);
                        }}>
                  {/* Subtle Top Accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="pb-2 pt-3 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Compact Modern Icon */}
                        <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                          <Building2 className="text-white" size={20} />
                        </div>
                        
                        <div className="space-y-1">
                          <CardTitle
                            className="text-base font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCompanyName({ id: profile.id, name: profile.companyName });
                            }}
                            title="Click to edit company name"
                          >
                            {profile.companyName}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-md">
                              <EditableSelect
                                profile={profile}
                                field="businessType"
                                options={[
                                  { value: "LLC", label: "LLC" },
                                  { value: "Corporation", label: "Corporation" },
                                  { value: "Partnership", label: "Partnership" },
                                  { value: "Sole Proprietorship", label: "Sole Proprietorship" }
                                ]}
                              >
                                {profile.businessType}
                              </EditableSelect>
                            </Badge>
                            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs px-2 py-0.5 rounded-md">
                              <EditableSelect
                                profile={profile}
                                field="status"
                                options={[
                                  { value: "Active", label: "Active" },
                                  { value: "Pending", label: "Pending" },
                                  { value: "Inactive", label: "Inactive" }
                                ]}
                              >
                                {profile.status}
                              </EditableSelect>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/edit-business-profile/${profile.id}`);
                        }}
                        size="sm"
                        className="h-8 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-medium shadow-sm rounded-lg transition-all duration-200"
                      >
                        <Edit size={12} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-1 pb-3 relative z-10">
                    <div className="space-y-3">
                      {/* Compact Section Header */}
                      <div className="border-b border-slate-200 dark:border-slate-700/50 pb-2">
                        <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                          <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md">
                            <Clock size={11} className="text-white" />
                          </div>
                          Deadlines
                        </h4>
                      </div>
                      <CountdownDisplay
                        label="Franchise Filing Due"
                        date={profile.annualFranchiseFilingDueDate}
                        icon={Calendar}
                      />
                      <CountdownDisplay
                        label="Domain Expiration"
                        date={profile.websiteDomainExpirationDate}
                        icon={Globe}
                      />
                      <CountdownDisplay
                        label="Annual Report Due"
                        date={profile.annualReportDueDate}
                        icon={FileIcon}
                      />
                      <CountdownDisplay
                        label="Business Filing Expiry"
                        date={profile.businessFilingExpirationDate}
                        icon={Building}
                      />
                      <div className="border-t border-slate-200 dark:border-slate-700/50 pt-3 mt-3">
                        <h5 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                          <div className="p-1 bg-gradient-to-br from-emerald-500 to-green-600 rounded-md">
                            <DollarSign size={11} className="text-white" />
                          </div>
                          Tax Deadlines
                        </h5>
                        <CountdownDisplay
                          label="Annual Tax Filing"
                          date={profile.annualTaxFilingDeadline}
                          icon={Calendar}
                        />
                        <div className="space-y-2 mt-3">
                          <h6 className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">Quarterly</h6>
                          <CountdownDisplay
                            label="Q1 Tax Due"
                            date={profile.quarterlyTaxDeadlineQ1}
                            icon={DollarSign}
                          />
                          <CountdownDisplay
                            label="Q2 Tax Due"
                            date={profile.quarterlyTaxDeadlineQ2}
                            icon={DollarSign}
                          />
                          <CountdownDisplay
                            label="Q3 Tax Due"
                            date={profile.quarterlyTaxDeadlineQ3}
                            icon={DollarSign}
                          />
                          <CountdownDisplay
                            label="Q4 Tax Due"
                            date={profile.quarterlyTaxDeadlineQ4}
                            icon={DollarSign}
                          />
                        </div>
                      </div>
                      
                      {/* Notes Section */}
                      <div className="border-t border-slate-200 dark:border-slate-700/50 pt-3 mt-3">
                        <h5 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                          <FileText size={11} />
                          Notes
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                          {profile.notes || "No notes added yet"}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50 mt-3">
                        <div className="flex items-center justify-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full h-8 bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700/50 text-xs transition-all duration-200 rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 size={12} className="mr-1.5" />
                                Delete
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Business Profile</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-300">
                                  Are you sure you want to delete <strong>{profile.companyName}</strong>?
                                  This action cannot be undone and will permanently remove all business data and documents.
                                </p>
                                <div className="flex justify-end gap-3">
                                  <DialogTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogTrigger>
                                  <Button
                                    variant="destructive"
                                    onClick={() => deleteEntityMutation.mutate(profile.id)}
                                    disabled={deleteEntityMutation.isPending}
                                  >
                                    {deleteEntityMutation.isPending ? "Deleting..." : "Delete"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Business Profile Details Modal */}
        <Dialog open={showProfileDetails} onOpenChange={setShowProfileDetails}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building className="text-amber-600" />
                {selectedProfile?.companyName} - Complete Profile
              </DialogTitle>
              {selectedProfile && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Profile Completion</span>
                    <span>{calculateCompletionPercentage(selectedProfile).percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        calculateCompletionPercentage(selectedProfile).percentage >= 80 ? 'bg-green-500' :
                        calculateCompletionPercentage(selectedProfile).percentage >= 50 ? 'bg-yellow-500' :
                        calculateCompletionPercentage(selectedProfile).percentage >= 25 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${calculateCompletionPercentage(selectedProfile).percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </DialogHeader>
            {selectedProfile && <BusinessProfileDetails profile={selectedProfile} />}
          </DialogContent>
        </Dialog>
        {/* Create Profile Modal */}
        <Dialog open={showCreateProfile} onOpenChange={setShowCreateProfile}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="text-green-600" />
                Create New Business Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-center py-4">
                <Building2 size={64} className="mx-auto text-amber-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">Quick Setup</h3>
                <p className="text-gray-600 text-sm">
                  Enter basic information to create your business profile. You can add more details after creation.
                </p>
              </div>
              {/* Basic Information Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newCompanyName">Company Name *</Label>
                    <Input
                      id="newCompanyName"
                      value={newProfileData.companyName}
                      onChange={(e) => setNewProfileData({...newProfileData, companyName: e.target.value})}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newBusinessType">Business Type *</Label>
                    <Select value={newProfileData.businessType} onValueChange={(value) => setNewProfileData({...newProfileData, businessType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LLC">LLC</SelectItem>
                        <SelectItem value="Corporation">Corporation</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="newState">State *</Label>
                    <Select value={newProfileData.state} onValueChange={(value) => setNewProfileData({...newProfileData, state: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="AR">Arkansas</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        <SelectItem value="CT">Connecticut</SelectItem>
                        <SelectItem value="DE">Delaware</SelectItem>
                        <SelectItem value="DC">District of Columbia</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="GA">Georgia</SelectItem>
                        <SelectItem value="HI">Hawaii</SelectItem>
                        <SelectItem value="ID">Idaho</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                        <SelectItem value="IN">Indiana</SelectItem>
                        <SelectItem value="IA">Iowa</SelectItem>
                        <SelectItem value="KS">Kansas</SelectItem>
                        <SelectItem value="KY">Kentucky</SelectItem>
                        <SelectItem value="LA">Louisiana</SelectItem>
                        <SelectItem value="ME">Maine</SelectItem>
                        <SelectItem value="MD">Maryland</SelectItem>
                        <SelectItem value="MA">Massachusetts</SelectItem>
                        <SelectItem value="MI">Michigan</SelectItem>
                        <SelectItem value="MN">Minnesota</SelectItem>
                        <SelectItem value="MS">Mississippi</SelectItem>
                        <SelectItem value="MO">Missouri</SelectItem>
                        <SelectItem value="MT">Montana</SelectItem>
                        <SelectItem value="NE">Nebraska</SelectItem>
                        <SelectItem value="NV">Nevada</SelectItem>
                        <SelectItem value="NH">New Hampshire</SelectItem>
                        <SelectItem value="NJ">New Jersey</SelectItem>
                        <SelectItem value="NM">New Mexico</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="NC">North Carolina</SelectItem>
                        <SelectItem value="ND">North Dakota</SelectItem>
                        <SelectItem value="OH">Ohio</SelectItem>
                        <SelectItem value="OK">Oklahoma</SelectItem>
                        <SelectItem value="OR">Oregon</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="RI">Rhode Island</SelectItem>
                        <SelectItem value="SC">South Carolina</SelectItem>
                        <SelectItem value="SD">South Dakota</SelectItem>
                        <SelectItem value="TN">Tennessee</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="UT">Utah</SelectItem>
                        <SelectItem value="VT">Vermont</SelectItem>
                        <SelectItem value="VA">Virginia</SelectItem>
                        <SelectItem value="WA">Washington</SelectItem>
                        <SelectItem value="WV">West Virginia</SelectItem>
                        <SelectItem value="WI">Wisconsin</SelectItem>
                        <SelectItem value="WY">Wyoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="newStatus">Status *</Label>
                    <Select value={newProfileData.status} onValueChange={(value) => setNewProfileData({...newProfileData, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="newFormationDate">Formation Date</Label>
                    <Input
                      id="newFormationDate"
                      type="date"
                      value={newProfileData.formationDate}
                      onChange={(e) => setNewProfileData({...newProfileData, formationDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newEin">EIN</Label>
                    <Input
                      id="newEin"
                      value={newProfileData.ein}
                      onChange={(e) => setNewProfileData({...newProfileData, ein: e.target.value})}
                      placeholder="XX-XXXXXXX"
                    />
                    
                    {/* SS4 Document Upload Section */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-700">SS4 (EIN Assignment Letter)</h4>
                          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">i</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          Uploaded
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Federal Tax ID Assignment</p>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-gray-300 hover:bg-gray-100"
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-gray-300 hover:bg-gray-100"
                        >
                          <Download size={14} className="mr-1" />
                          Download
                        </Button>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 text-gray-700">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newPhone">Phone Number</Label>
                      <Input
                        id="newPhone"
                        value={newProfileData.companyPhone}
                        onChange={(e) => setNewProfileData({...newProfileData, companyPhone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newEmail">Email</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newProfileData.email}
                        onChange={(e) => setNewProfileData({...newProfileData, email: e.target.value})}
                        placeholder="info@company.com"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="newWebsite">Website</Label>
                      <Input
                        id="newWebsite"
                        value={newProfileData.website}
                        onChange={(e) => setNewProfileData({...newProfileData, website: e.target.value})}
                        placeholder="https://www.company.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateProfile(false);
                    // Reset form data
                    setNewProfileData({
                      companyName: '',
                      businessType: '',
                      state: '',
                      status: 'Active',
                      formationDate: '',
                      ein: '',
                      companyPhone: '',
                      email: '',
                      website: '',
                      registeredAgent: '',
                      registeredAgentAddress: '',
                      registeredAgentCity: '',
                      registeredAgentState: '',
                      registeredAgentZipCode: '',
                      registeredAgentPhone: '',
                      sosFileNumber: '',
                      sosFileLink: '',
                      phoneProvider: '',
                      emailProvider: '',
                      businessAddress: '',
                      mailingAddress: '',
                      iPostalAddress: '',
                      businessBankAccount: '',
                      businessBankRouting: '',
                      businessCreditCard: '',
                      taxIdLogin: '',
                      franchiseNumber: '',
                      franchiseXtNumber: '',
                      franchiseTaxLogin: '',
                      dAndBNumber: '',
                      nicisNumber: '',
                      managingMember: '',
                      domainName: '',
                      gmailAccount: '',
                      youtubeChannel: '',
                      facebookPage: '',
                      tiktokAccount: '',
                      instagramAccount: '',
                      linkedinProfile: '',
                      trademarkInfo: '',
                      businessPlan: '',
                      generalLiabilityInsurance: '',
                      professionalLiabilityInsurance: '',
                      vehicleInsurance: '',
                      businessLicense: '',
                      logoFile: '',
                      brandGuidelines: '',
                      documentCount: 0
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  onClick={handleCreateProfile}
                  disabled={!newProfileData.companyName || !newProfileData.businessType || !newProfileData.state}
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  Create Profile
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Create Document Modal */}
        <Dialog open={showCreateDocument} onOpenChange={setShowCreateDocument}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <Upload size={48} className="mx-auto text-amber-600 mb-4" />
              <p className="text-gray-600">
                Document upload form would be implemented here
              </p>
              <Button
                className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600"
                onClick={() => setShowCreateDocument(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Edit Company Name Dialog */}
        <Dialog open={editingCompanyName !== null} onOpenChange={(open) => !open && setEditingCompanyName(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Company Name</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={editingCompanyName?.name || ''}
                  onChange={(e) => setEditingCompanyName(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="Enter company name"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingCompanyName(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingCompanyName) {
                      updateCompanyNameMutation.mutate({
                        id: editingCompanyName.id,
                        companyName: editingCompanyName.name
                      });
                    }
                  }}
                  disabled={!editingCompanyName?.name?.trim() || updateCompanyNameMutation.isPending}
                >
                  {updateCompanyNameMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
