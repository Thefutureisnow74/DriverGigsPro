import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RESPONSIVE_GRIDS, RESPONSIVE_FLEX } from "@/lib/responsive-utils";
import { 
  Building2, 
  Edit, 
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  Users,
  FileText,
  Shield,
  Award,
  DollarSign,
  User,
  Target,
  TrendingUp,
  Monitor,
  CreditCard,
  Briefcase,
  ExternalLink,
  Eye,
  Download,
  Trash2,
  Upload,
  File,
  FileX,
  CheckCircle,
  Calendar,
  Building
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, uploadFiles } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useLocation, useRoute } from "wouter";

export default function EditBusinessProfile() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/edit-business-profile/:id");
  const profileId = params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to user's primary entity if no ID provided
  useEffect(() => {
    async function loadPrimaryEntity() {
      if (!profileId) {
        try {
          const primaryEntity = await apiRequest('/api/business-entities/me/primary');
          setLocation(`/edit-business-profile/${primaryEntity.id}`);
        } catch (err) {
          console.error('Error loading primary entity:', err);
          setLocation('/business-document-storage');
        }
      }
    }
    loadPrimaryEntity();
  }, [profileId, setLocation]);

  // State
  const [profile, setProfile] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [franchiseTaxReminderDialogOpen, setFranchiseTaxReminderDialogOpen] = useState(false);
  const [publicInfoReminderDialogOpen, setPublicInfoReminderDialogOpen] = useState(false);
  const [annualReportDueReminderDialogOpen, setAnnualReportDueReminderDialogOpen] = useState(false);
  const [businessFilingExpiryReminderDialogOpen, setBusinessFilingExpiryReminderDialogOpen] = useState(false);
  const [domainExpirationReminderDialogOpen, setDomainExpirationReminderDialogOpen] = useState(false);
  const [annualTaxFilingReminderDialogOpen, setAnnualTaxFilingReminderDialogOpen] = useState(false);
  const [q1TaxDueReminderDialogOpen, setQ1TaxDueReminderDialogOpen] = useState(false);
  const [q2TaxDueReminderDialogOpen, setQ2TaxDueReminderDialogOpen] = useState(false);
  const [q3TaxDueReminderDialogOpen, setQ3TaxDueReminderDialogOpen] = useState(false);
  const [q4TaxDueReminderDialogOpen, setQ4TaxDueReminderDialogOpen] = useState(false);

  // Helper function to generate pie chart data based on score
  const generatePieData = (score: number, maxScore: number = 100) => {
    const normalizedScore = Math.min(Math.max(score || 0, 0), maxScore);
    const percentage = (normalizedScore / maxScore) * 100;
    
    return [
      { name: 'Score', value: percentage, color: getScoreColor(percentage) },
      { name: 'Remaining', value: 100 - percentage, color: '#e5e7eb' }
    ];
  };

  // Helper function to get vibrant colors based on score percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#16a34a'; // vibrant green
    if (percentage >= 60) return '#2563eb'; // vibrant blue
    if (percentage >= 40) return '#dc2626'; // vibrant red
    return '#7c3aed'; // vibrant purple
  };

  // Helper function to get gradient colors for charts
  const getChartColors = (chartType: 'experian' | 'dun' | 'equifax') => {
    switch (chartType) {
      case 'experian':
        return {
          primary: '#3b82f6', // blue
          secondary: '#1d4ed8', // darker blue
          background: '#e0f2fe'
        };
      case 'dun':
        return {
          primary: '#059669', // green
          secondary: '#047857', // darker green
          background: '#ecfdf5'
        };
      case 'equifax':
        return {
          primary: '#dc2626', // red
          secondary: '#b91c1c', // darker red
          background: '#fef2f2'
        };
      default:
        return {
          primary: '#6366f1',
          secondary: '#4f46e5',
          background: '#f0f9ff'
        };
    }
  };

  // Load business entity data
  const { data: entityData, isLoading: profileLoading, error: entityError } = useQuery({
    queryKey: [`/api/business-entities/${profileId}`],
    enabled: !!profileId,
    retry: false, // Don't retry on 403/404 errors
  });

  // Handle authorization errors by redirecting to user's own entity
  useEffect(() => {
    async function handleAuthError() {
      if (entityError) {
        const errorResponse = entityError as any;
        // On 403 or 404, fetch user's primary entity and redirect
        if (errorResponse?.status === 403 || errorResponse?.status === 404) {
          try {
            const primaryEntity = await apiRequest('/api/business-entities/me/primary');
            toast({
              title: "Redirected",
              description: "Loaded your business profile",
              duration: 3000,
            });
            setLocation(`/edit-business-profile/${primaryEntity.id}`);
          } catch (err) {
            console.error('Error fetching primary entity:', err);
            toast({
              title: "Error",
              description: "Redirecting to Business Document Storage...",
              variant: "destructive",
              duration: 3000,
            });
            setTimeout(() => setLocation('/business-document-storage'), 1000);
          }
        }
      }
    }
    handleAuthError();
  }, [entityError, setLocation, toast]);

  // Fetch business documents for this entity
  const { data: businessDocuments = [], refetch: refetchDocuments } = useQuery<any[]>({
    queryKey: ["/api/business-documents"],
    enabled: !!profile?.id,
  });

  // Fetch custom document names
  const { data: customDocumentNames = [], refetch: refetchCustomNames } = useQuery<any[]>({
    queryKey: [`/api/custom-document-names/${profileId}`],
    enabled: !!profileId,
  });

  // Fetch business tradelines
  const { data: tradelines = [], isLoading: tradelinesLoading } = useQuery<any[]>({
    queryKey: [`/api/business-tradelines`, profileId],
    enabled: !!profileId,
  });

  // Helper function to get custom name for slot number
  const getCustomDocumentName = (slotNumber: number) => {
    const customName = customDocumentNames.find(cn => cn.slotNumber === slotNumber);
    return customName?.customName || `Custom Document ${slotNumber}`;
  };

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsSaving(true);
      return apiRequest(`/api/business-entities/${profileId}`, {
        method: 'PUT',
        body: data,
      });
    },
    onSuccess: (savedData) => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
      // Update local state with saved data to ensure consistency
      if (savedData) {
        setProfile(savedData);
      }
      // Delay query invalidation to prevent race conditions
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [`/api/business-entities/${profileId}`] });
      }, 100);
      toast({
        title: "Saved",
        description: "Changes saved successfully",
        duration: 1500,
      });
    },
    onError: () => {
      setIsSaving(false);
      toast({
        title: "Save failed",
        description: "Failed to save changes",
        variant: "destructive",
      });
    },
  });

  // Custom document name save mutation
  const saveCustomNameMutation = useMutation({
    mutationFn: async ({ slotNumber, customName }: { slotNumber: number, customName: string }) => {
      return apiRequest('/api/custom-document-names', {
        method: 'POST',
        body: {
          businessEntityId: profileId,
          slotNumber,
          customName
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/custom-document-names/${profileId}`] });
      toast({
        title: "Saved",
        description: "Custom document name saved successfully",
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: "Save failed", 
        description: "Failed to save custom document name",
        variant: "destructive",
      });
    },
  });

  // Tradeline mutations
  const saveTradelineMutation = useMutation({
    mutationFn: async (tradelineData: any) => {
      const existingTradeline = tradelines.find((t: any) => 
        t.tradelineType === tradelineData.tradelineType && 
        t.slotNumber === tradelineData.slotNumber
      );

      if (existingTradeline) {
        return apiRequest(`/api/business-tradelines/${existingTradeline.id}`, {
          method: 'PUT',
          body: tradelineData,
        });
      } else {
        return apiRequest('/api/business-tradelines', {
          method: 'POST',
          body: {
            ...tradelineData,
            businessEntityId: parseInt(profileId as string),
          },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/business-tradelines`, profileId] });
      toast({
        title: "Saved",
        description: "Tradeline saved successfully",
        duration: 1500,
      });
    },
    onError: (error) => {
      console.error('Tradeline save error:', error);
      toast({
        title: "Save failed",
        description: "Failed to save tradeline",
        variant: "destructive",
      });
    },
  });

  // Initialize profile data
  useEffect(() => {
    if (entityData && !isSaving) {
      setProfile(entityData);
    }
  }, [entityData, isSaving]);

  // Handle field changes with debouncing (separate timeout per field)
  const handleFieldChange = (() => {
    const timeouts: { [key: string]: NodeJS.Timeout } = {};
    
    return (field: string, value: any) => {
      // Update local state immediately for responsive UI
      const updatedProfile = { ...profile, [field]: value };
      setProfile(updatedProfile);
      
      // Clear previous timeout for THIS specific field only
      if (timeouts[field]) {
        clearTimeout(timeouts[field]);
      }
      
      // Set new timeout for auto-save (only this field)
      timeouts[field] = setTimeout(() => {
        updateMutation.mutate({ [field]: value });
      }, 1000); // Reduced from 2500ms to 1000ms for faster saves
    };
  })();

  // Handle tradeline field changes with debouncing
  const handleTradelineChange = (() => {
    const timeouts: { [key: string]: NodeJS.Timeout } = {};
    
    return (tradelineType: 'loan' | 'credit_card', slotNumber: number, field: string, value: any) => {
      const key = `${tradelineType}-${slotNumber}`;
      
      // Clear previous timeout for this specific tradeline
      if (timeouts[key]) {
        clearTimeout(timeouts[key]);
      }
      
      // Set new timeout for auto-save
      timeouts[key] = setTimeout(() => {
        const tradelineData = {
          tradelineType,
          slotNumber,
          [field]: value,
        };
        
        // Get existing tradeline data
        const existing = tradelines.find((t: any) => 
          t.tradelineType === tradelineType && t.slotNumber === slotNumber
        );
        
        if (existing) {
          // Merge with existing data
          saveTradelineMutation.mutate({ ...existing, ...tradelineData });
        } else {
          // Create new tradeline with this field
          saveTradelineMutation.mutate(tradelineData);
        }
      }, 2500);
    };
  })();

  // Helper to get tradeline value
  const getTradelineValue = (tradelineType: 'loan' | 'credit_card', slotNumber: number, field: string) => {
    const tradeline = tradelines.find((t: any) => 
      t.tradelineType === tradelineType && t.slotNumber === slotNumber
    );
    return tradeline?.[field] || '';
  };

  if (!match) {
    return <div>Invalid profile ID</div>;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/70 rounded-2xl"></div>
            <div className="h-96 bg-white/70 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
          <Button onClick={() => setLocation("/business-document-storage")}>
            <ArrowLeft size={16} className="mr-2" />
            Return to Business Profiles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => setLocation("/business-document-storage")}
                    className="p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <Edit className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                      Edit Business Profile
                    </h1>
                    <p className="text-slate-600 text-lg font-medium">
                      {profile.companyName || profile.company_name || 'Business Profile'}
                    </p>
                  </div>
                </div>
                
                {/* Auto-save status */}
                <div className="flex items-center gap-2">
                  {isSaving ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600"></div>
                      <span>Saving changes...</span>
                    </div>
                  ) : lastSaved ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100/80 text-emerald-700 rounded-full text-sm font-medium backdrop-blur-sm border border-emerald-200/50">
                      <CheckCircle2 size={16} />
                      <span>Auto-saved {lastSaved}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
          <Tabs defaultValue="company" className="w-full">
            <TabsList className={`${RESPONSIVE_FLEX.tabStrip} w-full p-2 bg-transparent`}>
              <TabsTrigger value="company" className="text-xs flex flex-col items-center py-3 h-auto min-w-[80px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Company</span>
              </TabsTrigger>
              <TabsTrigger value="agent" className="text-xs flex flex-col items-center py-3 h-auto min-w-[80px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Registered</span>
                <span>Agent</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-xs flex flex-col items-center py-3 h-auto min-w-[80px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Contact</span>
              </TabsTrigger>
              <TabsTrigger value="mailweb" className="text-xs flex flex-col items-center py-3 h-auto min-w-[80px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Mail/Web</span>
              </TabsTrigger>
              <TabsTrigger value="finance" className="text-xs flex flex-col items-center py-3 h-auto min-w-[80px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Banking and</span>
                <span>Finance</span>
              </TabsTrigger>
              <TabsTrigger value="credit" className="text-xs flex flex-col items-center py-3 h-auto min-w-[80px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Business</span>
                <span>Credit</span>
              </TabsTrigger>
              <TabsTrigger value="tradelines" className="text-xs flex flex-col items-center py-3 h-auto min-w-[100px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Business Loans</span>
                <span>and Credit Cards</span>
              </TabsTrigger>
              <TabsTrigger value="digital" className="text-xs flex flex-col items-center py-3 h-auto min-w-[80px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Social</span>
                <span>Media</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="text-xs flex flex-col items-center py-3 h-auto min-w-[80px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Business</span>
                <span>Plan</span>
              </TabsTrigger>
              <TabsTrigger value="codes" className="text-xs flex flex-col items-center py-3 h-auto min-w-[100px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>NAICA Codes and</span>
                <span>Bus. Certifications</span>
              </TabsTrigger>
              <TabsTrigger value="tax" className="text-xs flex flex-col items-center py-3 h-auto min-w-[80px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Tax</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs flex flex-col items-center py-3 h-auto min-w-[80px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition-colors snap-start">
                <span>Documents</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-8">
              {/* Company Tab */}
              <TabsContent value="company" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="text-blue-600" size={20} />
                  <h4 className="text-base font-semibold text-blue-700">Company Information</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={profile.companyName || profile.company_name || ''}
                      onChange={(e) => handleFieldChange('companyName', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select 
                      value={profile.businessType || profile.business_type || ''} 
                      onValueChange={(value) => handleFieldChange('businessType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LLC">Limited Liability Company (LLC)</SelectItem>
                        <SelectItem value="Parent Limited Liability Company">Parent Limited Liability Company</SelectItem>
                        <SelectItem value="Series LLC (child)">Series LLC (child)</SelectItem>
                        <SelectItem value="Corporation">Corporation</SelectItem>
                        <SelectItem value="Sub S Corporation">Sub S Corporation</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ein">EIN</Label>
                    <Input
                      id="ein"
                      value={profile.ein || ''}
                      onChange={(e) => handleFieldChange('ein', e.target.value)}
                      placeholder="12-3456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stateOfOrganization">State of Organization</Label>
                    <Select 
                      value={profile.stateOfOrganization || profile.state_of_organization || ''} 
                      onValueChange={(value) => handleFieldChange('stateOfOrganization', value)}
                    >
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
                        <SelectItem value="DC">District of Columbia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="formationDate">Formation Date</Label>
                    <Input
                      id="formationDate"
                      type="date"
                      value={profile.formationDate || profile.formation_date || ''}
                      onChange={(e) => handleFieldChange('formationDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyAge">Age</Label>
                    <Input
                      id="companyAge"
                      value={profile.formationDate ? (() => {
                        const formation = new Date(profile.formationDate);
                        const now = new Date();
                        const years = now.getFullYear() - formation.getFullYear();
                        const months = now.getMonth() - formation.getMonth();
                        const totalMonths = years * 12 + months;
                        if (totalMonths < 12) return `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
                        const displayYears = Math.floor(totalMonths / 12);
                        const displayMonths = totalMonths % 12;
                        return displayMonths > 0 ? `${displayYears} year${displayYears !== 1 ? 's' : ''}, ${displayMonths} month${displayMonths !== 1 ? 's' : ''}` : `${displayYears} year${displayYears !== 1 ? 's' : ''}`;
                      })() : ''}
                      disabled
                      className="bg-gray-50"
                      placeholder="Calculated from formation date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={profile.status || ''} 
                      onValueChange={(value) => handleFieldChange('status', value)}
                    >
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
                  <div className="md:col-span-2">
                    <Label htmlFor="companyAddress">Street Address</Label>
                    <Input
                      id="companyAddress"
                      value={profile.companyAddress || profile.company_address || ''}
                      onChange={(e) => handleFieldChange('companyAddress', e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyCity">City</Label>
                    <Input
                      id="companyCity"
                      value={profile.companyCity || profile.company_city || ''}
                      onChange={(e) => handleFieldChange('companyCity', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyState">State</Label>
                    <Select 
                      value={profile.companyState || profile.company_state || ''} 
                      onValueChange={(value) => handleFieldChange('companyState', value)}
                    >
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
                        <SelectItem value="DC">District of Columbia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="companyZipCode">ZIP Code</Label>
                    <Input
                      id="companyZipCode"
                      value={profile.companyZipCode || profile.company_zip_code || ''}
                      onChange={(e) => handleFieldChange('companyZipCode', e.target.value)}
                      placeholder="30309"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Business Formation & Licensing Section */}
                <div className="border-t pt-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Business Formation & Licensing</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="operatingAgreement">Operating Agreement</Label>
                      <Input
                        id="operatingAgreement"
                        value={profile.operatingAgreement || profile.operating_agreement || ''}
                        onChange={(e) => handleFieldChange('operatingAgreement', e.target.value)}
                        placeholder="Link or status"
                      />
                    </div>
                    <div>
                      <Label htmlFor="operatingAgreementDate">Operating Agreement Date</Label>
                      <Input
                        id="operatingAgreementDate"
                        type="date"
                        value={profile.operatingAgreementDate || profile.operating_agreement_date || ''}
                        onChange={(e) => handleFieldChange('operatingAgreementDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="articlesOfFormation">Articles of Formation</Label>
                      <Input
                        id="articlesOfFormation"
                        value={profile.articlesOfFormation || profile.articles_of_formation || ''}
                        onChange={(e) => handleFieldChange('articlesOfFormation', e.target.value)}
                        placeholder="Link or status"
                      />
                    </div>
                    <div>
                      <Label htmlFor="articlesOfFormationDate">Articles of Formation Date</Label>
                      <Input
                        id="articlesOfFormationDate"
                        type="date"
                        value={profile.articlesOfFormationDate || profile.articles_of_formation_date || ''}
                        onChange={(e) => handleFieldChange('articlesOfFormationDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessLicenseNumber">Business License Number</Label>
                      <Input
                        id="businessLicenseNumber"
                        value={profile.businessLicenseNumber || profile.business_license_number || ''}
                        onChange={(e) => handleFieldChange('businessLicenseNumber', e.target.value)}
                        placeholder=""
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessLicenseType">Business License Type</Label>
                      <Input
                        id="businessLicenseType"
                        value={profile.businessLicenseType || profile.business_license_type || ''}
                        onChange={(e) => handleFieldChange('businessLicenseType', e.target.value)}
                        placeholder="General, Professional, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessLicenseExpirationDate">License Expiration Date</Label>
                      <Input
                        id="businessLicenseExpirationDate"
                        type="date"
                        value={profile.businessLicenseExpirationDate || profile.business_license_expiration_date || ''}
                        onChange={(e) => handleFieldChange('businessLicenseExpirationDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="listing411">411 Directory Listing</Label>
                      <Input
                        id="listing411"
                        value={profile.listing411 || profile.listing_411 || ''}
                        onChange={(e) => handleFieldChange('listing411', e.target.value)}
                        placeholder="Phone number listed in 411 directory"
                      />
                    </div>
                    <div>
                      <Label htmlFor="listing411Status">411 Listing Status</Label>
                      <Select 
                        value={profile.listing411Status || profile.listing_411_status || ''} 
                        onValueChange={(value) => handleFieldChange('listing411Status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Not Listed">Not Listed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* DBA and Business Names Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">DBA (Doing Business As)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dba">DBA Name</Label>
                      <Input
                        id="dba"
                        value={profile.dba || ''}
                        onChange={(e) => handleFieldChange('dba', e.target.value)}
                        placeholder="Doing Business As name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dbaFilingDate">DBA Filing Date</Label>
                      <Input
                        id="dbaFilingDate"
                        type="date"
                        value={profile.dbaFilingDate || profile.dba_filing_date || ''}
                        onChange={(e) => handleFieldChange('dbaFilingDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dbaExpirationDate">DBA Expiration Date</Label>
                      <Input
                        id="dbaExpirationDate"
                        type="date"
                        value={profile.dbaExpirationDate || profile.dba_expiration_date || ''}
                        onChange={(e) => handleFieldChange('dbaExpirationDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Certificate of Good Standing Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Certificate of Good Standing</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="certificateOfGoodStanding">Certificate Status</Label>
                      <Input
                        id="certificateOfGoodStanding"
                        value={profile.certificateOfGoodStanding || profile.certificate_of_good_standing || ''}
                        onChange={(e) => handleFieldChange('certificateOfGoodStanding', e.target.value)}
                        placeholder="Active, Pending, or document link"
                      />
                    </div>
                    <div>
                      <Label htmlFor="certificateOfGoodStandingDate">Certificate Date</Label>
                      <Input
                        id="certificateOfGoodStandingDate"
                        type="date"
                        value={profile.certificateOfGoodStandingDate || profile.certificate_of_good_standing_date || ''}
                        onChange={(e) => handleFieldChange('certificateOfGoodStandingDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="certificateOfGoodStandingExpirationDate">Certificate Expiration Date</Label>
                      <Input
                        id="certificateOfGoodStandingExpirationDate"
                        type="date"
                        value={profile.certificateOfGoodStandingExpirationDate || profile.certificate_of_good_standing_expiration_date || ''}
                        onChange={(e) => handleFieldChange('certificateOfGoodStandingExpirationDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Foreign Qualification Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Foreign Qualification</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="foreignQualification">Foreign Qualification Details</Label>
                      <Textarea
                        id="foreignQualification"
                        value={profile.foreignQualification || profile.foreign_qualification || ''}
                        onChange={(e) => handleFieldChange('foreignQualification', e.target.value)}
                        placeholder="States where qualified to do business"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="foreignQualificationStatus">Qualification Status</Label>
                      <Select 
                        value={profile.foreignQualificationStatus || profile.foreign_qualification_status || ''} 
                        onValueChange={(value) => handleFieldChange('foreignQualificationStatus', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Qualified">Qualified</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Not Qualified">Not Qualified</SelectItem>
                          <SelectItem value="Not Required">Not Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* S Corporation Election Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">S Corporation Election</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="sCorpElection">S Corp Election Status</Label>
                      <Select 
                        value={profile.sCorpElection || profile.s_corp_election || ''} 
                        onValueChange={(value) => handleFieldChange('sCorpElection', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Elected">Elected</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Not Elected">Not Elected</SelectItem>
                          <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sCorpElectionDate">Election Date</Label>
                      <Input
                        id="sCorpElectionDate"
                        type="date"
                        value={profile.sCorpElectionDate || profile.s_corp_election_date || ''}
                        onChange={(e) => handleFieldChange('sCorpElectionDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sCorpElectionForm">Form 2553 Reference</Label>
                      <Input
                        id="sCorpElectionForm"
                        value={profile.sCorpElectionForm || profile.s_corp_election_form || ''}
                        onChange={(e) => handleFieldChange('sCorpElectionForm', e.target.value)}
                        placeholder="Form reference or document link"
                      />
                    </div>
                  </div>
                </div>

                {/* LLC/Corporate Kit Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">LLC/Corporate Kit</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="llcKitOrdered">Kit Ordered</Label>
                      <Select 
                        value={profile.llcKitOrdered ? 'true' : 'false'} 
                        onValueChange={(value) => handleFieldChange('llcKitOrdered', value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="llcKitOrderDate">Order Date</Label>
                      <Input
                        id="llcKitOrderDate"
                        type="date"
                        value={profile.llcKitOrderDate || profile.llc_kit_order_date || ''}
                        onChange={(e) => handleFieldChange('llcKitOrderDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="llcKitVendor">Vendor</Label>
                      <Input
                        id="llcKitVendor"
                        value={profile.llcKitVendor || profile.llc_kit_vendor || ''}
                        onChange={(e) => handleFieldChange('llcKitVendor', e.target.value)}
                        placeholder="Vendor name"
                      />
                    </div>
                  </div>
                </div>

                {/* Amendment and Name Change Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Amendments & Name Changes</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="amendmentStatus">Amendment Status</Label>
                      <Input
                        id="amendmentStatus"
                        value={profile.amendmentStatus || profile.amendment_status || ''}
                        onChange={(e) => handleFieldChange('amendmentStatus', e.target.value)}
                        placeholder="Pending, Filed, None"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amendmentDate">Amendment Date</Label>
                      <Input
                        id="amendmentDate"
                        type="date"
                        value={profile.amendmentDate || profile.amendment_date || ''}
                        onChange={(e) => handleFieldChange('amendmentDate', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="amendmentDetails">Amendment Details</Label>
                      <Textarea
                        id="amendmentDetails"
                        value={profile.amendmentDetails || profile.amendment_details || ''}
                        onChange={(e) => handleFieldChange('amendmentDetails', e.target.value)}
                        placeholder="Description of amendments"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyNameChange">Previous Company Names</Label>
                      <Input
                        id="companyNameChange"
                        value={profile.companyNameChange || profile.company_name_change || ''}
                        onChange={(e) => handleFieldChange('companyNameChange', e.target.value)}
                        placeholder="Previous names (if any)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyNameChangeDate">Name Change Date</Label>
                      <Input
                        id="companyNameChangeDate"
                        type="date"
                        value={profile.companyNameChangeDate || profile.company_name_change_date || ''}
                        onChange={(e) => handleFieldChange('companyNameChangeDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Contract Templates Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Contract Templates</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="contractTemplatesSource">Templates Source</Label>
                      <Input
                        id="contractTemplatesSource"
                        value={profile.contractTemplatesSource || profile.contract_templates_source || ''}
                        onChange={(e) => handleFieldChange('contractTemplatesSource', e.target.value)}
                        placeholder="e.g., RocketLawyer, LegalZoom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contractTemplatesLink">Templates Link</Label>
                      <Input
                        id="contractTemplatesLink"
                        value={profile.contractTemplatesLink || profile.contract_templates_link || ''}
                        onChange={(e) => handleFieldChange('contractTemplatesLink', e.target.value)}
                        placeholder="URL to templates"
                      />
                    </div>
                  </div>
                </div>

                {/* Annual Report Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Annual Report</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="annualReportStatus">Report Status</Label>
                      <Select 
                        value={profile.annualReportStatus || profile.annual_report_status || ''} 
                        onValueChange={(value) => handleFieldChange('annualReportStatus', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Filed">Filed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                          <SelectItem value="Not Due">Not Due</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="annualReportLastFiled">Last Filed Date</Label>
                      <Input
                        id="annualReportLastFiled"
                        type="date"
                        value={profile.annualReportLastFiled || profile.annual_report_last_filed || ''}
                        onChange={(e) => handleFieldChange('annualReportLastFiled', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Tax Consultant Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Tax Consultant</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="taxConsultant">Consultant Name/Firm</Label>
                      <Input
                        id="taxConsultant"
                        value={profile.taxConsultant || profile.tax_consultant || ''}
                        onChange={(e) => handleFieldChange('taxConsultant', e.target.value)}
                        placeholder="CPA or tax firm name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxConsultantPhone">Consultant Phone</Label>
                      <Input
                        id="taxConsultantPhone"
                        value={profile.taxConsultantPhone || profile.tax_consultant_phone || ''}
                        onChange={(e) => handleFieldChange('taxConsultantPhone', e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxConsultantEmail">Consultant Email</Label>
                      <Input
                        id="taxConsultantEmail"
                        type="email"
                        value={profile.taxConsultantEmail || profile.tax_consultant_email || ''}
                        onChange={(e) => handleFieldChange('taxConsultantEmail', e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastTaxConsultation">Last Consultation Date</Label>
                      <Input
                        id="lastTaxConsultation"
                        type="date"
                        value={profile.lastTaxConsultation || profile.last_tax_consultation || ''}
                        onChange={(e) => handleFieldChange('lastTaxConsultation', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Dissolution and Reinstatement Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Dissolution & Reinstatement</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dissolutionStatus">Dissolution Status</Label>
                      <Select 
                        value={profile.dissolutionStatus || profile.dissolution_status || ''} 
                        onValueChange={(value) => handleFieldChange('dissolutionStatus', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Dissolved">Dissolved</SelectItem>
                          <SelectItem value="Reinstated">Reinstated</SelectItem>
                          <SelectItem value="In Process">In Process</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dissolutionDate">Dissolution Date</Label>
                      <Input
                        id="dissolutionDate"
                        type="date"
                        value={profile.dissolutionDate || profile.dissolution_date || ''}
                        onChange={(e) => handleFieldChange('dissolutionDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reinstatementDate">Reinstatement Date</Label>
                      <Input
                        id="reinstatementDate"
                        type="date"
                        value={profile.reinstatementDate || profile.reinstatement_date || ''}
                        onChange={(e) => handleFieldChange('reinstatementDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reinstatementStatus">Reinstatement Status</Label>
                      <Input
                        id="reinstatementStatus"
                        value={profile.reinstatementStatus || profile.reinstatement_status || ''}
                        onChange={(e) => handleFieldChange('reinstatementStatus', e.target.value)}
                        placeholder="Complete, Pending, N/A"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Card and Branding Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Business Cards & Branded Merchandise</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessCardDesign">Business Card Design</Label>
                      <Input
                        id="businessCardDesign"
                        value={profile.businessCardDesign || profile.business_card_design || ''}
                        onChange={(e) => handleFieldChange('businessCardDesign', e.target.value)}
                        placeholder="File or link to design"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessCardPrintVendor">Print Vendor</Label>
                      <Input
                        id="businessCardPrintVendor"
                        value={profile.businessCardPrintVendor || profile.business_card_print_vendor || ''}
                        onChange={(e) => handleFieldChange('businessCardPrintVendor', e.target.value)}
                        placeholder="e.g., Vistaprint, MOO"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brandedMerchandise">Branded Merchandise</Label>
                      <Input
                        id="brandedMerchandise"
                        value={profile.brandedMerchandise || profile.branded_merchandise || ''}
                        onChange={(e) => handleFieldChange('brandedMerchandise', e.target.value)}
                        placeholder="Shirts, hats, pens, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="brandedMerchandiseVendor">Merchandise Vendor</Label>
                      <Input
                        id="brandedMerchandiseVendor"
                        value={profile.brandedMerchandiseVendor || profile.branded_merchandise_vendor || ''}
                        onChange={(e) => handleFieldChange('brandedMerchandiseVendor', e.target.value)}
                        placeholder="Vendor name"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="companyNotes">Notes</Label>
                    <Textarea
                      id="companyNotes"
                      value={profile.companyNotes || ''}
                      onChange={(e) => handleFieldChange('companyNotes', e.target.value)}
                      placeholder="Add notes for company information..."
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Agent Tab */}
              <TabsContent value="agent" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="text-purple-600" size={20} />
                  <h4 className="text-base font-semibold text-purple-700">Registered Agent</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="registeredAgent">Registered Agent</Label>
                    <Input
                      id="registeredAgent"
                      value={profile.registeredAgent || profile.registered_agent || ''}
                      onChange={(e) => handleFieldChange('registeredAgent', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="registeredAgentPhone">Agent Phone</Label>
                    <Input
                      id="registeredAgentPhone"
                      value={profile.registeredAgentPhone || profile.registered_agent_phone || ''}
                      onChange={(e) => handleFieldChange('registeredAgentPhone', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="registeredAgentAddress">Agent Street Address</Label>
                    <Input
                      id="registeredAgentAddress"
                      value={profile.registeredAgentAddress || profile.registered_agent_address || ''}
                      onChange={(e) => handleFieldChange('registeredAgentAddress', e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <Label htmlFor="registeredAgentCity">Agent City</Label>
                    <Input
                      id="registeredAgentCity"
                      value={profile.registeredAgentCity || profile.registered_agent_city || ''}
                      onChange={(e) => handleFieldChange('registeredAgentCity', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="registeredAgentZipCode">Agent ZIP Code</Label>
                    <Input
                      id="registeredAgentZipCode"
                      value={profile.registeredAgentZipCode || profile.registered_agent_zip_code || ''}
                      onChange={(e) => handleFieldChange('registeredAgentZipCode', e.target.value)}
                      placeholder="30309"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sosFileLink">State</Label>
                    <Input
                      id="sosFileLink"
                      value={profile.sosFileLink || profile.sos_file_link || ''}
                      onChange={(e) => handleFieldChange('sosFileLink', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="agentNotes">Notes</Label>
                    <Textarea
                      id="agentNotes"
                      value={profile.agentNotes || ''}
                      onChange={(e) => handleFieldChange('agentNotes', e.target.value)}
                      placeholder="Add notes for registered agent information..."
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="text-green-600" size={20} />
                  <h4 className="text-base font-semibold text-green-700">Contact Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input
                      id="companyPhone"
                      value={profile.companyPhone || profile.company_phone || ''}
                      onChange={(e) => handleFieldChange('companyPhone', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Business Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneProvider">Phone Provider</Label>
                    <Input
                      id="phoneProvider"
                      value={profile.phoneProvider || profile.phone_provider || ''}
                      onChange={(e) => handleFieldChange('phoneProvider', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailLogin">Email Login</Label>
                    <Input
                      id="emailLogin"
                      value={profile.emailLogin || profile.email_login || ''}
                      onChange={(e) => handleFieldChange('emailLogin', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentManagingMembers">Managing Members</Label>
                    <Input
                      id="currentManagingMembers"
                      value={profile.currentManagingMembers || profile.current_managing_members || ''}
                      onChange={(e) => handleFieldChange('currentManagingMembers', e.target.value)}
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Company Physical Address Section */}
                <div className="border-t pt-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Company Physical Address</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="companyAddress">Street Address</Label>
                      <Input
                        id="companyAddress"
                        value={profile.companyAddress || profile.company_address || ''}
                        onChange={(e) => handleFieldChange('companyAddress', e.target.value)}
                        placeholder="123 Business Street"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyCity">City</Label>
                      <Input
                        id="companyCity"
                        value={profile.companyCity || profile.company_city || ''}
                        onChange={(e) => handleFieldChange('companyCity', e.target.value)}
                        placeholder="City name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyState">State</Label>
                      <Input
                        id="companyState"
                        value={profile.companyState || profile.company_state || ''}
                        onChange={(e) => handleFieldChange('companyState', e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyZipCode">ZIP Code</Label>
                      <Input
                        id="companyZipCode"
                        value={profile.companyZipCode || profile.company_zip_code || ''}
                        onChange={(e) => handleFieldChange('companyZipCode', e.target.value)}
                        placeholder="12345"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                {/* Mailing Address Section */}
                <div className="border-t pt-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Mailing Address</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="mailingAddress">Mailing Street Address</Label>
                      <Input
                        id="mailingAddress"
                        value={profile.mailingAddress || profile.mailing_address || ''}
                        onChange={(e) => handleFieldChange('mailingAddress', e.target.value)}
                        placeholder="P.O. Box 123 or Street Address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mailingCity">Mailing City</Label>
                      <Input
                        id="mailingCity"
                        value={profile.mailingCity || profile.mailing_city || ''}
                        onChange={(e) => handleFieldChange('mailingCity', e.target.value)}
                        placeholder="City name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mailingState">Mailing State</Label>
                      <Input
                        id="mailingState"
                        value={profile.mailingState || profile.mailing_state || ''}
                        onChange={(e) => handleFieldChange('mailingState', e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mailingZipCode">Mailing ZIP Code</Label>
                      <Input
                        id="mailingZipCode"
                        value={profile.mailingZipCode || profile.mailing_zip_code || ''}
                        onChange={(e) => handleFieldChange('mailingZipCode', e.target.value)}
                        placeholder="12345"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Personnel Section */}
                <div className="border-t pt-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Company Personnel</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="primaryContactName">Primary Contact Name</Label>
                      <Input
                        id="primaryContactName"
                        value={profile.primaryContactName || profile.primary_contact_name || ''}
                        onChange={(e) => handleFieldChange('primaryContactName', e.target.value)}
                        placeholder="Full name of primary contact"
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryContactTitle">Primary Contact Title</Label>
                      <Input
                        id="primaryContactTitle"
                        value={profile.primaryContactTitle || profile.primary_contact_title || ''}
                        onChange={(e) => handleFieldChange('primaryContactTitle', e.target.value)}
                        placeholder="CEO, President, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryContactPhone">Primary Contact Phone</Label>
                      <Input
                        id="primaryContactPhone"
                        value={profile.primaryContactPhone || profile.primary_contact_phone || ''}
                        onChange={(e) => handleFieldChange('primaryContactPhone', e.target.value)}
                        placeholder="Direct phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryContactEmail">Primary Contact Email</Label>
                      <Input
                        id="primaryContactEmail"
                        type="email"
                        value={profile.primaryContactEmail || profile.primary_contact_email || ''}
                        onChange={(e) => handleFieldChange('primaryContactEmail', e.target.value)}
                        placeholder="contact@company.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="primaryContactAddress">Primary Contact Address</Label>
                      <Input
                        id="primaryContactAddress"
                        value={profile.primaryContactAddress || profile.primary_contact_address || ''}
                        onChange={(e) => handleFieldChange('primaryContactAddress', e.target.value)}
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryContactCity">Primary Contact City</Label>
                      <Input
                        id="primaryContactCity"
                        value={profile.primaryContactCity || profile.primary_contact_city || ''}
                        onChange={(e) => handleFieldChange('primaryContactCity', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryContactState">Primary Contact State</Label>
                      <Input
                        id="primaryContactState"
                        value={profile.primaryContactState || profile.primary_contact_state || ''}
                        onChange={(e) => handleFieldChange('primaryContactState', e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryContactZip">Primary Contact ZIP Code</Label>
                      <Input
                        id="primaryContactZip"
                        value={profile.primaryContactZip || profile.primary_contact_zip || ''}
                        onChange={(e) => handleFieldChange('primaryContactZip', e.target.value)}
                        placeholder="12345"
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryContactName">Secondary Contact Name</Label>
                      <Input
                        id="secondaryContactName"
                        value={profile.secondaryContactName || profile.secondary_contact_name || ''}
                        onChange={(e) => handleFieldChange('secondaryContactName', e.target.value)}
                        placeholder="Backup contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryContactTitle">Secondary Contact Title</Label>
                      <Input
                        id="secondaryContactTitle"
                        value={profile.secondaryContactTitle || profile.secondary_contact_title || ''}
                        onChange={(e) => handleFieldChange('secondaryContactTitle', e.target.value)}
                        placeholder="Manager, Assistant, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryContactPhone">Secondary Contact Phone</Label>
                      <Input
                        id="secondaryContactPhone"
                        value={profile.secondaryContactPhone || profile.secondary_contact_phone || ''}
                        onChange={(e) => handleFieldChange('secondaryContactPhone', e.target.value)}
                        placeholder="Alternate phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryContactEmail">Secondary Contact Email</Label>
                      <Input
                        id="secondaryContactEmail"
                        type="email"
                        value={profile.secondaryContactEmail || profile.secondary_contact_email || ''}
                        onChange={(e) => handleFieldChange('secondaryContactEmail', e.target.value)}
                        placeholder="backup@company.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="secondaryContactAddress">Secondary Contact Address</Label>
                      <Input
                        id="secondaryContactAddress"
                        value={profile.secondaryContactAddress || profile.secondary_contact_address || ''}
                        onChange={(e) => handleFieldChange('secondaryContactAddress', e.target.value)}
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryContactCity">Secondary Contact City</Label>
                      <Input
                        id="secondaryContactCity"
                        value={profile.secondaryContactCity || profile.secondary_contact_city || ''}
                        onChange={(e) => handleFieldChange('secondaryContactCity', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryContactState">Secondary Contact State</Label>
                      <Input
                        id="secondaryContactState"
                        value={profile.secondaryContactState || profile.secondary_contact_state || ''}
                        onChange={(e) => handleFieldChange('secondaryContactState', e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryContactZip">Secondary Contact ZIP Code</Label>
                      <Input
                        id="secondaryContactZip"
                        value={profile.secondaryContactZip || profile.secondary_contact_zip || ''}
                        onChange={(e) => handleFieldChange('secondaryContactZip', e.target.value)}
                        placeholder="12345"
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                      <Input
                        id="emergencyContactName"
                        value={profile.emergencyContactName || profile.emergency_contact_name || ''}
                        onChange={(e) => handleFieldChange('emergencyContactName', e.target.value)}
                        placeholder="Emergency contact person"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                      <Input
                        id="emergencyContactPhone"
                        value={profile.emergencyContactPhone || profile.emergency_contact_phone || ''}
                        onChange={(e) => handleFieldChange('emergencyContactPhone', e.target.value)}
                        placeholder="Emergency phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="emergencyContactAddress">Emergency Contact Address</Label>
                      <Input
                        id="emergencyContactAddress"
                        value={profile.emergencyContactAddress || profile.emergency_contact_address || ''}
                        onChange={(e) => handleFieldChange('emergencyContactAddress', e.target.value)}
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactCity">Emergency Contact City</Label>
                      <Input
                        id="emergencyContactCity"
                        value={profile.emergencyContactCity || profile.emergency_contact_city || ''}
                        onChange={(e) => handleFieldChange('emergencyContactCity', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactState">Emergency Contact State</Label>
                      <Input
                        id="emergencyContactState"
                        value={profile.emergencyContactState || profile.emergency_contact_state || ''}
                        onChange={(e) => handleFieldChange('emergencyContactState', e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactZip">Emergency Contact ZIP Code</Label>
                      <Input
                        id="emergencyContactZip"
                        value={profile.emergencyContactZip || profile.emergency_contact_zip || ''}
                        onChange={(e) => handleFieldChange('emergencyContactZip', e.target.value)}
                        placeholder="12345"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                {/* Asset Protection Section */}
                <div className="border-t pt-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Asset Protection</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="assetProtectionAttorney">Asset Protection Attorney/Company</Label>
                      <Input
                        id="assetProtectionAttorney"
                        value={profile.assetProtectionAttorney || profile.asset_protection_attorney || ''}
                        onChange={(e) => handleFieldChange('assetProtectionAttorney', e.target.value)}
                        placeholder="Attorney or company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assetProtectionAttorneyPhone">Attorney Phone</Label>
                      <Input
                        id="assetProtectionAttorneyPhone"
                        value={profile.assetProtectionAttorneyPhone || profile.asset_protection_attorney_phone || ''}
                        onChange={(e) => handleFieldChange('assetProtectionAttorneyPhone', e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assetProtectionAttorneyEmail">Attorney Email</Label>
                      <Input
                        id="assetProtectionAttorneyEmail"
                        type="email"
                        value={profile.assetProtectionAttorneyEmail || profile.asset_protection_attorney_email || ''}
                        onChange={(e) => handleFieldChange('assetProtectionAttorneyEmail', e.target.value)}
                        placeholder="email@lawfirm.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="contactNotes">Notes</Label>
                  <Textarea
                    id="contactNotes"
                    value={profile.contactNotes || ''}
                    onChange={(e) => handleFieldChange('contactNotes', e.target.value)}
                    placeholder="Add notes for contact information..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              {/* Mail/Web Tab */}
              <TabsContent value="mailweb" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="text-orange-600" size={20} />
                  <h4 className="text-base font-semibold text-orange-700">Mail & Web Services</h4>
                </div>

                {/* Virtual Address Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Virtual Address Service</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="virtualAddressProvider">Provider</Label>
                      <Input
                        id="virtualAddressProvider"
                        value={profile.virtualAddressProvider || profile.virtual_address_provider || ''}
                        onChange={(e) => handleFieldChange('virtualAddressProvider', e.target.value)}
                        placeholder="e.g., Earth Class Mail, Anytime Mailbox"
                      />
                    </div>
                    <div>
                      <Label htmlFor="virtualAddressService">Service Details</Label>
                      <Input
                        id="virtualAddressService"
                        value={profile.virtualAddressService || profile.virtual_address_service || ''}
                        onChange={(e) => handleFieldChange('virtualAddressService', e.target.value)}
                        placeholder="Service type or plan"
                      />
                    </div>
                    <div>
                      <Label htmlFor="virtualAddressLogin">Login Credentials</Label>
                      <Input
                        id="virtualAddressLogin"
                        value={profile.virtualAddressLogin || profile.virtual_address_login || ''}
                        onChange={(e) => handleFieldChange('virtualAddressLogin', e.target.value)}
                        placeholder="Username/email and password"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profile.website || ''}
                      onChange={(e) => handleFieldChange('website', e.target.value)}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="websiteHost">Website Host</Label>
                    <Input
                      id="websiteHost"
                      value={profile.websiteHost || profile.website_host || ''}
                      onChange={(e) => handleFieldChange('websiteHost', e.target.value)}
                      placeholder="Hosting provider"
                    />
                  </div>
                  <div>
                    <Label htmlFor="websiteHostLogin">Website Host Login</Label>
                    <Input
                      id="websiteHostLogin"
                      value={profile.websiteHostLogin || profile.website_host_login || ''}
                      onChange={(e) => handleFieldChange('websiteHostLogin', e.target.value)}
                      placeholder="Hosting login credentials"
                    />
                  </div>
                  <div>
                    <Label htmlFor="domainName">Domain Name</Label>
                    <Input
                      id="domainName"
                      value={profile.domainName || profile.domain_name || ''}
                      onChange={(e) => handleFieldChange('domainName', e.target.value)}
                      placeholder="yourcompany.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="domainRenewalDate">Domain Renewal Date</Label>
                    <Input
                      id="domainRenewalDate"
                      type="date"
                      value={profile.domainRenewalDate || profile.domain_renewal_date || ''}
                      onChange={(e) => handleFieldChange('domainRenewalDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="websiteHostRenewalDate">Website Host Annual Renewal Date</Label>
                    <Input
                      id="websiteHostRenewalDate"
                      type="date"
                      value={profile.websiteHostRenewalDate || profile.website_host_renewal_date || ''}
                      onChange={(e) => handleFieldChange('websiteHostRenewalDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mailboxProvider">Mailbox Provider</Label>
                    <Input
                      id="mailboxProvider"
                      value={profile.mailboxProvider || profile.mailbox_provider || ''}
                      onChange={(e) => handleFieldChange('mailboxProvider', e.target.value)}
                      placeholder="Mail service provider"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mailboxRenewalDate">Mailbox Renewal Date</Label>
                    <Input
                      id="mailboxRenewalDate"
                      type="date"
                      value={profile.mailboxRenewalDate || profile.mailbox_renewal_date || ''}
                      onChange={(e) => handleFieldChange('mailboxRenewalDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mailboxProviderAddress">Mailbox Provider Address</Label>
                    <Input
                      id="mailboxProviderAddress"
                      value={profile.mailboxProviderAddress || profile.mailbox_provider_address || ''}
                      onChange={(e) => handleFieldChange('mailboxProviderAddress', e.target.value)}
                      placeholder="123 Provider Street"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mailboxMonthlyCost">Mailbox Monthly Cost</Label>
                    <Input
                      id="mailboxMonthlyCost"
                      value={profile.mailboxMonthlyCost || profile.mailbox_monthly_cost || ''}
                      onChange={(e) => handleFieldChange('mailboxMonthlyCost', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="mailboxProviderCity">Mailbox Provider City</Label>
                    <Input
                      id="mailboxProviderCity"
                      value={profile.mailboxProviderCity || profile.mailbox_provider_city || ''}
                      onChange={(e) => handleFieldChange('mailboxProviderCity', e.target.value)}
                      placeholder="City name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mailboxProviderState">Mailbox Provider State</Label>
                    <Input
                      id="mailboxProviderState"
                      value={profile.mailboxProviderState || profile.mailbox_provider_state || ''}
                      onChange={(e) => handleFieldChange('mailboxProviderState', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mailboxProviderZip">Mailbox Provider ZIP</Label>
                    <Input
                      id="mailboxProviderZip"
                      value={profile.mailboxProviderZip || profile.mailbox_provider_zip || ''}
                      onChange={(e) => handleFieldChange('mailboxProviderZip', e.target.value)}
                      placeholder="12345"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mailboxPhone">Mailbox Phone</Label>
                    <Input
                      id="mailboxPhone"
                      value={profile.mailboxPhone || profile.mailbox_phone || ''}
                      onChange={(e) => handleFieldChange('mailboxPhone', e.target.value)}
                      placeholder="Mailbox contact phone"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="mailwebNotes">Notes</Label>
                    <Textarea
                      id="mailwebNotes"
                      value={profile.mailwebNotes || ''}
                      onChange={(e) => handleFieldChange('mailwebNotes', e.target.value)}
                      placeholder="Add notes for mail and web services..."
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Banking and Finance Tab */}
              <TabsContent value="finance" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="text-emerald-600" size={20} />
                  <h4 className="text-base font-semibold text-emerald-700">Banking and Finance</h4>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label htmlFor="bankName">Primary Bank Name</Label>
                    <Input
                      id="bankName"
                      value={profile.bankName || profile.bank_name || ''}
                      onChange={(e) => handleFieldChange('bankName', e.target.value)}
                      placeholder="Name of primary bank"
                    />
                  </div>
                  <div>
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      value={profile.routingNumber || profile.routing_number || ''}
                      onChange={(e) => handleFieldChange('routingNumber', e.target.value)}
                      placeholder="Bank routing number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={profile.accountNumber || profile.account_number || ''}
                      onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
                      placeholder="Bank account number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankAddress">Bank Address</Label>
                    <Input
                      id="bankAddress"
                      value={profile.bankAddress || profile.bank_address || ''}
                      onChange={(e) => handleFieldChange('bankAddress', e.target.value)}
                      placeholder="Bank branch address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank2Name">Secondary Bank Name</Label>
                    <Input
                      id="bank2Name"
                      value={profile.bank2Name || profile.bank2_name || ''}
                      onChange={(e) => handleFieldChange('bank2Name', e.target.value)}
                      placeholder="Second bank name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank2RoutingNumber">Secondary Routing Number</Label>
                    <Input
                      id="bank2RoutingNumber"
                      value={profile.bank2RoutingNumber || profile.bank2_routing_number || ''}
                      onChange={(e) => handleFieldChange('bank2RoutingNumber', e.target.value)}
                      placeholder="Second bank routing"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank2AccountNumber">Secondary Account Number</Label>
                    <Input
                      id="bank2AccountNumber"
                      value={profile.bank2AccountNumber || profile.bank2_account_number || ''}
                      onChange={(e) => handleFieldChange('bank2AccountNumber', e.target.value)}
                      placeholder="Second bank account"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank2Address">Secondary Bank Address</Label>
                    <Input
                      id="bank2Address"
                      value={profile.bank2Address || profile.bank2_address || ''}
                      onChange={(e) => handleFieldChange('bank2Address', e.target.value)}
                      placeholder="Second bank address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="banking">Banking Notes</Label>
                    <Textarea
                      id="banking"
                      value={profile.banking || ''}
                      onChange={(e) => handleFieldChange('banking', e.target.value)}
                      placeholder="Additional banking information"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="financeNotes">Notes</Label>
                    <Textarea
                      id="financeNotes"
                      value={profile.financeNotes || ''}
                      onChange={(e) => handleFieldChange('financeNotes', e.target.value)}
                      placeholder="Add notes for banking and finance information..."
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Business Credit Tab */}
              <TabsContent value="credit" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-indigo-600" size={20} />
                  <h4 className="text-base font-semibold text-indigo-700">Business Credit</h4>
                </div>
                
                {/* Credit Score Visualization */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-6">Credit Score Overview</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Experian Chart */}
                    <div className="text-center">
                      <div className="h-40 relative mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { 
                                  name: 'Score', 
                                  value: parseInt(profile.experianIntelliscoreScore || profile.experian_intelliscore_score) || 0, 
                                  color: '#3b82f6' 
                                },
                                { 
                                  name: 'Remaining', 
                                  value: 100 - (parseInt(profile.experianIntelliscoreScore || profile.experian_intelliscore_score) || 0), 
                                  color: '#e2e8f0' 
                                }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={75}
                              dataKey="value"
                              startAngle={90}
                              endAngle={450}
                            >
                              <Cell fill="#3b82f6" />
                              <Cell fill="#e2e8f0" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-3xl font-bold text-blue-700">
                              {parseInt(profile.experianIntelliscoreScore || profile.experian_intelliscore_score) || '0'}
                            </span>
                            <div className="text-sm text-blue-600 font-medium">1-100</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <h6 className="font-bold text-blue-700 text-lg">Experian</h6>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.experian.com/business/', '_blank')}
                          className="p-1 h-6 w-6 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <ExternalLink size={14} />
                        </Button>
                      </div>
                      <p className="text-blue-600 text-sm">Intelliscore Plus</p>
                      <Input
                        value={profile.experianIntelliscoreScore || profile.experian_intelliscore_score || ''}
                        onChange={(e) => handleFieldChange('experianIntelliscoreScore', e.target.value)}
                        placeholder="Enter score (0-100)"
                        className="text-center text-lg font-semibold border-2 border-blue-200 focus:border-blue-400"
                        type="number"
                        min="0"
                        max="100"
                      />
                      <Input
                        value={profile.experianIntelliscoreScoreDate || ''}
                        onChange={(e) => handleFieldChange('experianIntelliscoreScoreDate', e.target.value)}
                        placeholder="Score date"
                        className="text-center text-sm mt-2 border border-blue-200 focus:border-blue-400"
                        type="date"
                      />
                    </div>

                    {/* D&B Paydex Chart */}
                    <div className="text-center">
                      <div className="h-40 relative mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { 
                                  name: 'Score', 
                                  value: parseInt(profile.dunBradstreetPaydexScore || profile.dun_bradstreet_paydex_score) || 0, 
                                  color: '#059669' 
                                },
                                { 
                                  name: 'Remaining', 
                                  value: 100 - (parseInt(profile.dunBradstreetPaydexScore || profile.dun_bradstreet_paydex_score) || 0), 
                                  color: '#e2e8f0' 
                                }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={75}
                              dataKey="value"
                              startAngle={90}
                              endAngle={450}
                            >
                              <Cell fill="#059669" />
                              <Cell fill="#e2e8f0" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-3xl font-bold text-green-700">
                              {parseInt(profile.dunBradstreetPaydexScore || profile.dun_bradstreet_paydex_score) || '0'}
                            </span>
                            <div className="text-sm text-green-600 font-medium">1-100</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <h6 className="font-bold text-green-700 text-lg">D&B</h6>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.dnb.com/business-directory.html', '_blank')}
                          className="p-1 h-6 w-6 text-green-600 hover:text-green-800 hover:bg-green-50"
                        >
                          <ExternalLink size={14} />
                        </Button>
                      </div>
                      <p className="text-green-600 text-sm">Paydex Score</p>
                      <Input
                        value={profile.dunBradstreetPaydexScore || profile.dun_bradstreet_paydex_score || ''}
                        onChange={(e) => handleFieldChange('dunBradstreetPaydexScore', e.target.value)}
                        placeholder="Enter score (0-100)"
                        className="text-center text-lg font-semibold border-2 border-green-200 focus:border-green-400"
                        type="number"
                        min="0"
                        max="100"
                      />
                      <Input
                        value={profile.dunBradstreetPaydexScoreDate || ''}
                        onChange={(e) => handleFieldChange('dunBradstreetPaydexScoreDate', e.target.value)}
                        placeholder="Score date"
                        className="text-center text-sm mt-2 border border-green-200 focus:border-green-400"
                        type="date"
                      />
                    </div>

                    {/* Equifax Chart */}
                    <div className="text-center">
                      <div className="h-40 relative mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { 
                                  name: 'Score', 
                                  value: Math.min(((parseInt(profile.equifaxBusinessScore || profile.equifax_business_score) || 101) - 101) / (992 - 101) * 100, 100), 
                                  color: '#ea580c' 
                                },
                                { 
                                  name: 'Remaining', 
                                  value: Math.max(100 - ((parseInt(profile.equifaxBusinessScore || profile.equifax_business_score) || 101) - 101) / (992 - 101) * 100, 0), 
                                  color: '#e2e8f0' 
                                }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={75}
                              dataKey="value"
                              startAngle={90}
                              endAngle={450}
                            >
                              <Cell fill="#ea580c" />
                              <Cell fill="#e2e8f0" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-3xl font-bold text-orange-700">
                              {parseInt(profile.equifaxBusinessScore || profile.equifax_business_score) || '600'}
                            </span>
                            <div className="text-sm text-orange-600 font-medium">101-992</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <h6 className="font-bold text-orange-700 text-lg">Equifax</h6>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.equifax.com/business/', '_blank')}
                          className="p-1 h-6 w-6 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                        >
                          <ExternalLink size={14} />
                        </Button>
                      </div>
                      <p className="text-orange-600 text-sm">Business Score</p>
                      <Input
                        value={profile.equifaxBusinessScore || profile.equifax_business_score || ''}
                        onChange={(e) => handleFieldChange('equifaxBusinessScore', e.target.value)}
                        placeholder="Enter score (101-992)"
                        className="text-center text-lg font-semibold border-2 border-orange-200 focus:border-orange-400"
                        type="number"
                        min="101"
                        max="992"
                      />
                      <Input
                        value={profile.equifaxBusinessScoreDate || ''}
                        onChange={(e) => handleFieldChange('equifaxBusinessScoreDate', e.target.value)}
                        placeholder="Score date"
                        className="text-center text-sm mt-2 border border-orange-200 focus:border-orange-400"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Business Credit Scores Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Business Credit Scores</h5>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="experianIntelliscoreScore">Experian Intelliscore Score</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.experian.com/business/', '_blank')}
                          className="p-1 h-6 w-6 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </div>
                      <Input
                        id="experianIntelliscoreScore"
                        value={profile.experianIntelliscoreScore || profile.experian_intelliscore_score || ''}
                        onChange={(e) => handleFieldChange('experianIntelliscoreScore', e.target.value)}
                        placeholder="Experian business credit score"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="dunBradstreetPaydexScore">D&B Paydex Score</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.dnb.com/business-directory.html', '_blank')}
                          className="p-1 h-6 w-6 text-green-600 hover:text-green-800 hover:bg-green-50"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </div>
                      <Input
                        id="dunBradstreetPaydexScore"
                        value={profile.dunBradstreetPaydexScore || profile.dun_bradstreet_paydex_score || ''}
                        onChange={(e) => handleFieldChange('dunBradstreetPaydexScore', e.target.value)}
                        placeholder="Dun & Bradstreet Paydex score"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="equifaxBusinessScore">Equifax Business Score</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.equifax.com/business/', '_blank')}
                          className="p-1 h-6 w-6 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </div>
                      <Input
                        id="equifaxBusinessScore"
                        value={profile.equifaxBusinessScore || profile.equifax_business_score || ''}
                        onChange={(e) => handleFieldChange('equifaxBusinessScore', e.target.value)}
                        placeholder="Equifax business credit score"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="ficoSmallBusinessScore">FICO Small Business Score</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.myfico.com/credit-education/small-business', '_blank')}
                          className="p-1 h-6 w-6 text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </div>
                      <Input
                        id="ficoSmallBusinessScore"
                        value={profile.ficoSmallBusinessScore || profile.fico_small_business_score || ''}
                        onChange={(e) => handleFieldChange('ficoSmallBusinessScore', e.target.value)}
                        placeholder="FICO small business scoring service"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Credit Information Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Business Credit Information</h5>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="dunBradstreetNumber">D&B Number</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.dnb.com/business-directory.html', '_blank')}
                          className="p-1 h-6 w-6 text-green-600 hover:text-green-800 hover:bg-green-50"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </div>
                      <Input
                        id="dunBradstreetNumber"
                        value={profile.dunBradstreetNumber || profile.dun_bradstreet_number || ''}
                        onChange={(e) => handleFieldChange('dunBradstreetNumber', e.target.value)}
                        placeholder="Dun & Bradstreet number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dunBradstreetWebsite">Dun and Bradstreet Website</Label>
                      <Input
                        id="dunBradstreetWebsite"
                        value={profile.dunBradstreetWebsite || profile.dun_bradstreet_website || ''}
                        onChange={(e) => handleFieldChange('dunBradstreetWebsite', e.target.value)}
                        placeholder="https://www.dnb.com/your-profile"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="nicisNumber">NICIS Number</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.nicis.com/', '_blank')}
                          className="p-1 h-6 w-6 text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </div>
                      <Input
                        id="nicisNumber"
                        value={profile.nicisNumber || profile.nicis_number || ''}
                        onChange={(e) => handleFieldChange('nicisNumber', e.target.value)}
                        placeholder="NICIS credit number"
                      />
                    </div>
                  </div>
                </div>

                {/* NAV Credit Health Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">NAV Credit Health</h5>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="navCreditHealth">NAV Credit Score</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.nav.com/', '_blank')}
                          className="p-1 h-6 w-6 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </div>
                      <Input
                        id="navCreditHealth"
                        value={profile.navCreditHealth || profile.nav_credit_health || ''}
                        onChange={(e) => handleFieldChange('navCreditHealth', e.target.value)}
                        placeholder="NAV credit health score"
                      />
                    </div>
                  </div>
                </div>

                {/* Credit Monitoring Tools Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Credit Monitoring Tools</h5>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="creditMonitor1Name">Primary Credit Monitor</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.nav.com/', '_blank')}
                          className="p-1 h-6 w-6 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          title="NAV"
                        >
                          <ExternalLink size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('https://www.creditsignal.com/', '_blank')}
                          className="p-1 h-6 w-6 text-green-600 hover:text-green-800 hover:bg-green-50"
                          title="CreditSignal"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </div>
                      <Input
                        id="creditMonitor1Name"
                        value={profile.creditMonitor1Name || profile.credit_monitor_1_name || ''}
                        onChange={(e) => handleFieldChange('creditMonitor1Name', e.target.value)}
                        placeholder="NAV, CreditSignal, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="creditMonitor1Link">Primary Monitor Login</Label>
                      <Input
                        id="creditMonitor1Link"
                        value={profile.creditMonitor1Link || profile.credit_monitor_1_link || ''}
                        onChange={(e) => handleFieldChange('creditMonitor1Link', e.target.value)}
                        placeholder=""
                      />
                    </div>
                    <div>
                      <Label htmlFor="creditMonitor2Name">Secondary Credit Monitor</Label>
                      <Input
                        id="creditMonitor2Name"
                        value={profile.creditMonitor2Name || profile.credit_monitor_2_name || ''}
                        onChange={(e) => handleFieldChange('creditMonitor2Name', e.target.value)}
                        placeholder="Additional monitoring service"
                      />
                    </div>
                    <div>
                      <Label htmlFor="creditMonitor2Link">Secondary Monitor Login</Label>
                      <Input
                        id="creditMonitor2Link"
                        value={profile.creditMonitor2Link || profile.credit_monitor_2_link || ''}
                        onChange={(e) => handleFieldChange('creditMonitor2Link', e.target.value)}
                        placeholder=""
                      />
                    </div>
                    <div>
                      <Label htmlFor="creditMonitor3Name">Third Credit Monitor</Label>
                      <Input
                        id="creditMonitor3Name"
                        value={profile.creditMonitor3Name || profile.credit_monitor_3_name || ''}
                        onChange={(e) => handleFieldChange('creditMonitor3Name', e.target.value)}
                        placeholder="Additional monitoring service"
                      />
                    </div>
                    <div>
                      <Label htmlFor="creditMonitor3Link">Third Monitor Login</Label>
                      <Input
                        id="creditMonitor3Link"
                        value={profile.creditMonitor3Link || profile.credit_monitor_3_link || ''}
                        onChange={(e) => handleFieldChange('creditMonitor3Link', e.target.value)}
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="creditNotes">Notes</Label>
                  <Textarea
                    id="creditNotes"
                    value={profile.creditNotes || ''}
                    onChange={(e) => handleFieldChange('creditNotes', e.target.value)}
                    placeholder="Add notes for business credit information..."
                    rows={4}
                  />
                </div>

              </TabsContent>

              {/* Business Loans and Credit Cards Tab */}
              <TabsContent value="tradelines" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-purple-600" size={20} />
                  <h4 className="text-base font-semibold text-purple-700">Business Loans and Credit Cards</h4>
                </div>

                {/* Tradeline Tracking Section */}
                <div>
                  <h5 className="text-lg font-semibold text-slate-700 mb-2">Tradeline Tracking</h5>
                  <p className="text-sm text-slate-500 mb-6">Business Loans and Credit Cards</p>
                  
                  {/* Loans Section */}
                  <div className="border-b pb-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="text-blue-600" size={20} />
                      <h6 className="text-base font-semibold text-blue-700">Business Loans</h6>
                    </div>
                    
                    {tradelinesLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-300 border-t-blue-600 mx-auto"></div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((slotNumber) => (
                          <div key={`loan-${slotNumber}`} className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex items-center gap-2 mb-4">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Loan #{slotNumber}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor={`loan-${slotNumber}-issuingCompany`}>Issuing Company</Label>
                                <Input
                                  id={`loan-${slotNumber}-issuingCompany`}
                                  data-testid={`input-loan-${slotNumber}-issuing-company`}
                                  value={getTradelineValue('loan', slotNumber, 'issuingCompany')}
                                  onChange={(e) => handleTradelineChange('loan', slotNumber, 'issuingCompany', e.target.value)}
                                  placeholder="Bank or lender name"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`loan-${slotNumber}-accountType`}>Account Type</Label>
                                <Input
                                  id={`loan-${slotNumber}-accountType`}
                                  data-testid={`input-loan-${slotNumber}-account-type`}
                                  value={getTradelineValue('loan', slotNumber, 'accountType')}
                                  onChange={(e) => handleTradelineChange('loan', slotNumber, 'accountType', e.target.value)}
                                  placeholder="e.g., Business Line of Credit, Term Loan"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`loan-${slotNumber}-accountNumber`}>Account Number (Last 4)</Label>
                                <Input
                                  id={`loan-${slotNumber}-accountNumber`}
                                  data-testid={`input-loan-${slotNumber}-account-number`}
                                  value={getTradelineValue('loan', slotNumber, 'accountNumber')}
                                  onChange={(e) => handleTradelineChange('loan', slotNumber, 'accountNumber', e.target.value)}
                                  placeholder="Last 4 digits"
                                  maxLength={4}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`loan-${slotNumber}-dateOpened`}>Date Opened</Label>
                                <Input
                                  id={`loan-${slotNumber}-dateOpened`}
                                  data-testid={`input-loan-${slotNumber}-date-opened`}
                                  type="date"
                                  value={getTradelineValue('loan', slotNumber, 'dateOpened')}
                                  onChange={(e) => handleTradelineChange('loan', slotNumber, 'dateOpened', e.target.value)}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`loan-${slotNumber}-originalAmount`}>Original Amount ($)</Label>
                                <Input
                                  id={`loan-${slotNumber}-originalAmount`}
                                  data-testid={`input-loan-${slotNumber}-original-amount`}
                                  type="number"
                                  step="0.01"
                                  value={getTradelineValue('loan', slotNumber, 'originalAmount')}
                                  onChange={(e) => handleTradelineChange('loan', slotNumber, 'originalAmount', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`loan-${slotNumber}-currentBalance`}>Current Balance ($)</Label>
                                <Input
                                  id={`loan-${slotNumber}-currentBalance`}
                                  data-testid={`input-loan-${slotNumber}-current-balance`}
                                  type="number"
                                  step="0.01"
                                  value={getTradelineValue('loan', slotNumber, 'currentBalance')}
                                  onChange={(e) => handleTradelineChange('loan', slotNumber, 'currentBalance', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`loan-${slotNumber}-interestRate`}>Interest Rate (%)</Label>
                                <Input
                                  id={`loan-${slotNumber}-interestRate`}
                                  data-testid={`input-loan-${slotNumber}-interest-rate`}
                                  type="number"
                                  step="0.01"
                                  value={getTradelineValue('loan', slotNumber, 'interestRate')}
                                  onChange={(e) => handleTradelineChange('loan', slotNumber, 'interestRate', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`loan-${slotNumber}-monthlyPayment`}>Monthly Payment ($)</Label>
                                <Input
                                  id={`loan-${slotNumber}-monthlyPayment`}
                                  data-testid={`input-loan-${slotNumber}-monthly-payment`}
                                  type="number"
                                  step="0.01"
                                  value={getTradelineValue('loan', slotNumber, 'monthlyPayment')}
                                  onChange={(e) => handleTradelineChange('loan', slotNumber, 'monthlyPayment', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`loan-${slotNumber}-paymentDueDate`}>Payment Due Date (Day of Month)</Label>
                                <Input
                                  id={`loan-${slotNumber}-paymentDueDate`}
                                  data-testid={`input-loan-${slotNumber}-payment-due-date`}
                                  type="number"
                                  min="1"
                                  max="31"
                                  value={getTradelineValue('loan', slotNumber, 'paymentDueDate')}
                                  onChange={(e) => handleTradelineChange('loan', slotNumber, 'paymentDueDate', e.target.value)}
                                  placeholder="1-31"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`loan-${slotNumber}-accountStatus`}>Account Status</Label>
                                <Select
                                  value={getTradelineValue('loan', slotNumber, 'accountStatus')}
                                  onValueChange={(value) => handleTradelineChange('loan', slotNumber, 'accountStatus', value)}
                                >
                                  <SelectTrigger id={`loan-${slotNumber}-accountStatus`} data-testid={`select-loan-${slotNumber}-account-status`}>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="paid_off">Paid Off</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="md:col-span-3">
                                <Label htmlFor={`loan-${slotNumber}-notes`}>Notes</Label>
                                <Textarea
                                  id={`loan-${slotNumber}-notes`}
                                  data-testid={`textarea-loan-${slotNumber}-notes`}
                                  value={getTradelineValue('loan', slotNumber, 'notes')}
                                  onChange={(e) => handleTradelineChange('loan', slotNumber, 'notes', e.target.value)}
                                  placeholder="Additional notes about this loan"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Credit Cards Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="text-indigo-600" size={20} />
                      <h6 className="text-base font-semibold text-indigo-700">Business Credit and Debit Cards</h6>
                    </div>
                    
                    {tradelinesLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-300 border-t-indigo-600 mx-auto"></div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((slotNumber) => (
                          <div key={`cc-${slotNumber}`} className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex items-center gap-2 mb-4">
                              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                Credit Card #{slotNumber}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-issuingCompany`}>Company Name & Number</Label>
                                <Input
                                  id={`cc-${slotNumber}-issuingCompany`}
                                  data-testid={`input-cc-${slotNumber}-issuing-company`}
                                  value={getTradelineValue('credit_card', slotNumber, 'issuingCompany')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'issuingCompany', e.target.value)}
                                  placeholder="e.g., Chase, Account #12345"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-website`}>Website</Label>
                                <Input
                                  id={`cc-${slotNumber}-website`}
                                  data-testid={`input-cc-${slotNumber}-website`}
                                  value={getTradelineValue('credit_card', slotNumber, 'website')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'website', e.target.value)}
                                  placeholder="https://www.chase.com"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-cardTypeCategory`}>Type of Card</Label>
                                <Select
                                  value={getTradelineValue('credit_card', slotNumber, 'cardTypeCategory')}
                                  onValueChange={(value) => handleTradelineChange('credit_card', slotNumber, 'cardTypeCategory', value)}
                                >
                                  <SelectTrigger id={`cc-${slotNumber}-cardTypeCategory`} data-testid={`select-cc-${slotNumber}-card-type-category`}>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="credit">Credit</SelectItem>
                                    <SelectItem value="debit">Debit</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-accountType`}>Credit Card Name</Label>
                                <Input
                                  id={`cc-${slotNumber}-accountType`}
                                  data-testid={`input-cc-${slotNumber}-account-type`}
                                  value={getTradelineValue('credit_card', slotNumber, 'accountType')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'accountType', e.target.value)}
                                  placeholder="e.g., Chase Ink Business Preferred"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-accountNumber`}>Last Four Digits</Label>
                                <Input
                                  id={`cc-${slotNumber}-accountNumber`}
                                  data-testid={`input-cc-${slotNumber}-account-number`}
                                  value={getTradelineValue('credit_card', slotNumber, 'accountNumber')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'accountNumber', e.target.value)}
                                  placeholder="1234"
                                  maxLength={4}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-expiration`}>Expiration</Label>
                                <Input
                                  id={`cc-${slotNumber}-expiration`}
                                  data-testid={`input-cc-${slotNumber}-expiration`}
                                  value={getTradelineValue('credit_card', slotNumber, 'expiration')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'expiration', e.target.value)}
                                  placeholder="MM/YY"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-secCode`}>Sec Code (CVV)</Label>
                                <Input
                                  id={`cc-${slotNumber}-secCode`}
                                  data-testid={`input-cc-${slotNumber}-sec-code`}
                                  value={getTradelineValue('credit_card', slotNumber, 'secCode')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'secCode', e.target.value)}
                                  placeholder="123"
                                  maxLength={4}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-monitor`}>Monitor</Label>
                                <Input
                                  id={`cc-${slotNumber}-monitor`}
                                  data-testid={`input-cc-${slotNumber}-monitor`}
                                  value={getTradelineValue('credit_card', slotNumber, 'monitor')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'monitor', e.target.value)}
                                  placeholder="Monitoring service"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-originalAmount`}>Credit Limit ($)</Label>
                                <Input
                                  id={`cc-${slotNumber}-originalAmount`}
                                  data-testid={`input-cc-${slotNumber}-credit-limit`}
                                  type="number"
                                  step="0.01"
                                  value={getTradelineValue('credit_card', slotNumber, 'originalAmount')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'originalAmount', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-currentBalance`}>Balance Due ($)</Label>
                                <Input
                                  id={`cc-${slotNumber}-currentBalance`}
                                  data-testid={`input-cc-${slotNumber}-current-balance`}
                                  type="number"
                                  step="0.01"
                                  value={getTradelineValue('credit_card', slotNumber, 'currentBalance')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'currentBalance', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-paymentDueDate`}>Due Date</Label>
                                <Input
                                  id={`cc-${slotNumber}-paymentDueDate`}
                                  data-testid={`input-cc-${slotNumber}-payment-due-date`}
                                  type="number"
                                  min="1"
                                  max="31"
                                  value={getTradelineValue('credit_card', slotNumber, 'paymentDueDate')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'paymentDueDate', e.target.value)}
                                  placeholder="Day of month (1-31)"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-internalLateDate`}>Internal Late Date</Label>
                                <Input
                                  id={`cc-${slotNumber}-internalLateDate`}
                                  data-testid={`input-cc-${slotNumber}-internal-late-date`}
                                  type="number"
                                  min="1"
                                  max="31"
                                  value={getTradelineValue('credit_card', slotNumber, 'internalLateDate')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'internalLateDate', e.target.value)}
                                  placeholder="Day of month (1-31)"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-officialLateDate`}>Official Late Date</Label>
                                <Input
                                  id={`cc-${slotNumber}-officialLateDate`}
                                  data-testid={`input-cc-${slotNumber}-official-late-date`}
                                  type="number"
                                  min="1"
                                  max="31"
                                  value={getTradelineValue('credit_card', slotNumber, 'officialLateDate')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'officialLateDate', e.target.value)}
                                  placeholder="Day of month (1-31)"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-reportDate`}>Report Date / Settlement Date</Label>
                                <Input
                                  id={`cc-${slotNumber}-reportDate`}
                                  data-testid={`input-cc-${slotNumber}-report-date`}
                                  type="date"
                                  value={getTradelineValue('credit_card', slotNumber, 'reportDate')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'reportDate', e.target.value)}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-login`}>Login</Label>
                                <Input
                                  id={`cc-${slotNumber}-login`}
                                  data-testid={`input-cc-${slotNumber}-login`}
                                  value={getTradelineValue('credit_card', slotNumber, 'login')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'login', e.target.value)}
                                  placeholder="Username or email"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-password`}>Password</Label>
                                <Input
                                  id={`cc-${slotNumber}-password`}
                                  data-testid={`input-cc-${slotNumber}-password`}
                                  type="password"
                                  value={getTradelineValue('credit_card', slotNumber, 'password')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'password', e.target.value)}
                                  placeholder="••••••••"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-monthlyPayment`}>Payment ($)</Label>
                                <Input
                                  id={`cc-${slotNumber}-monthlyPayment`}
                                  data-testid={`input-cc-${slotNumber}-monthly-payment`}
                                  type="number"
                                  step="0.01"
                                  value={getTradelineValue('credit_card', slotNumber, 'monthlyPayment')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'monthlyPayment', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-interestRate`}>Interest Rate (%)</Label>
                                <Input
                                  id={`cc-${slotNumber}-interestRate`}
                                  data-testid={`input-cc-${slotNumber}-interest-rate`}
                                  type="number"
                                  step="0.01"
                                  value={getTradelineValue('credit_card', slotNumber, 'interestRate')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'interestRate', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-autoPay`}>AUTO PAY</Label>
                                <Select
                                  value={getTradelineValue('credit_card', slotNumber, 'autoPay')}
                                  onValueChange={(value) => handleTradelineChange('credit_card', slotNumber, 'autoPay', value)}
                                >
                                  <SelectTrigger id={`cc-${slotNumber}-autoPay`} data-testid={`select-cc-${slotNumber}-auto-pay`}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-autoPayAcct`}>AutoPay Acct</Label>
                                <Input
                                  id={`cc-${slotNumber}-autoPayAcct`}
                                  data-testid={`input-cc-${slotNumber}-auto-pay-acct`}
                                  value={getTradelineValue('credit_card', slotNumber, 'autoPayAcct')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'autoPayAcct', e.target.value)}
                                  placeholder="Bank account for autopay"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-dateOpened`}>Date Opened</Label>
                                <Input
                                  id={`cc-${slotNumber}-dateOpened`}
                                  data-testid={`input-cc-${slotNumber}-date-opened`}
                                  type="date"
                                  value={getTradelineValue('credit_card', slotNumber, 'dateOpened')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'dateOpened', e.target.value)}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`cc-${slotNumber}-accountStatus`}>Account Status</Label>
                                <Select
                                  value={getTradelineValue('credit_card', slotNumber, 'accountStatus')}
                                  onValueChange={(value) => handleTradelineChange('credit_card', slotNumber, 'accountStatus', value)}
                                >
                                  <SelectTrigger id={`cc-${slotNumber}-accountStatus`} data-testid={`select-cc-${slotNumber}-account-status`}>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="paid_off">Paid Off</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="md:col-span-3">
                                <Label htmlFor={`cc-${slotNumber}-notes`}>Notes</Label>
                                <Textarea
                                  id={`cc-${slotNumber}-notes`}
                                  data-testid={`textarea-cc-${slotNumber}-notes`}
                                  value={getTradelineValue('credit_card', slotNumber, 'notes')}
                                  onChange={(e) => handleTradelineChange('credit_card', slotNumber, 'notes', e.target.value)}
                                  placeholder="Additional notes about this credit card"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Social Media Tab */}
              <TabsContent value="digital" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Monitor className="text-cyan-600" size={20} />
                  <h4 className="text-base font-semibold text-cyan-700">Social Media</h4>
                </div>

                {/* Social Media Manager Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Social Media Management Tool</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="socialMediaManager">Management Tool</Label>
                      <Input
                        id="socialMediaManager"
                        value={profile.socialMediaManager || profile.social_media_manager || ''}
                        onChange={(e) => handleFieldChange('socialMediaManager', e.target.value)}
                        placeholder="e.g., Solo-to, Hootsuite, Buffer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="socialMediaManagerWebsite">Tool Website</Label>
                      <Input
                        id="socialMediaManagerWebsite"
                        value={profile.socialMediaManagerWebsite || profile.social_media_manager_website || ''}
                        onChange={(e) => handleFieldChange('socialMediaManagerWebsite', e.target.value)}
                        placeholder="https://solo-to.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="socialMediaManagerLogin">Login Credentials</Label>
                      <Input
                        id="socialMediaManagerLogin"
                        value={profile.socialMediaManagerLogin || profile.social_media_manager_login || ''}
                        onChange={(e) => handleFieldChange('socialMediaManagerLogin', e.target.value)}
                        placeholder="Username/email and password"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Label htmlFor="instagramAccount" className="text-lg font-semibold">Instagram Account</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open('https://www.instagram.com/', '_blank')}
                        className="p-1 h-6 w-6 text-pink-600 hover:text-pink-800 hover:bg-pink-50"
                      >
                        <ExternalLink size={12} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="instagramAccount">Account Handle/URL</Label>
                        <Input
                          id="instagramAccount"
                          value={profile.instagramAccount || profile.instagram_account || ''}
                          onChange={(e) => handleFieldChange('instagramAccount', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagramManagerName">Manager Name</Label>
                        <Input
                          id="instagramManagerName"
                          value={profile.instagramManagerName || ''}
                          onChange={(e) => handleFieldChange('instagramManagerName', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagramManagerCompany">Manager Company</Label>
                        <Input
                          id="instagramManagerCompany"
                          value={profile.instagramManagerCompany || ''}
                          onChange={(e) => handleFieldChange('instagramManagerCompany', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagramManagerPhone">Manager Phone</Label>
                        <Input
                          id="instagramManagerPhone"
                          value={profile.instagramManagerPhone || ''}
                          onChange={(e) => handleFieldChange('instagramManagerPhone', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagramManagerEmail">Manager Email</Label>
                        <Input
                          id="instagramManagerEmail"
                          value={profile.instagramManagerEmail || ''}
                          onChange={(e) => handleFieldChange('instagramManagerEmail', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagramManagerAddress">Manager Address</Label>
                        <Input
                          id="instagramManagerAddress"
                          value={profile.instagramManagerAddress || ''}
                          onChange={(e) => handleFieldChange('instagramManagerAddress', e.target.value)}
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Label htmlFor="facebookPage" className="text-lg font-semibold">Facebook Page</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open('https://www.facebook.com/', '_blank')}
                        className="p-1 h-6 w-6 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <ExternalLink size={12} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="facebookPage">Page URL</Label>
                        <Input
                          id="facebookPage"
                          value={profile.facebookPage || profile.facebook_page || ''}
                          onChange={(e) => handleFieldChange('facebookPage', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebookManagerName">Manager Name</Label>
                        <Input
                          id="facebookManagerName"
                          value={profile.facebookManagerName || ''}
                          onChange={(e) => handleFieldChange('facebookManagerName', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebookManagerCompany">Manager Company</Label>
                        <Input
                          id="facebookManagerCompany"
                          value={profile.facebookManagerCompany || ''}
                          onChange={(e) => handleFieldChange('facebookManagerCompany', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebookManagerPhone">Manager Phone</Label>
                        <Input
                          id="facebookManagerPhone"
                          value={profile.facebookManagerPhone || ''}
                          onChange={(e) => handleFieldChange('facebookManagerPhone', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebookManagerEmail">Manager Email</Label>
                        <Input
                          id="facebookManagerEmail"
                          value={profile.facebookManagerEmail || ''}
                          onChange={(e) => handleFieldChange('facebookManagerEmail', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebookManagerAddress">Manager Address</Label>
                        <Input
                          id="facebookManagerAddress"
                          value={profile.facebookManagerAddress || ''}
                          onChange={(e) => handleFieldChange('facebookManagerAddress', e.target.value)}
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Label htmlFor="xAccount" className="text-lg font-semibold">X (Twitter) Account</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open('https://x.com/', '_blank')}
                        className="p-1 h-6 w-6 text-black hover:text-gray-700 hover:bg-gray-50"
                      >
                        <ExternalLink size={12} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="xAccount">Account Handle/URL</Label>
                        <Input
                          id="xAccount"
                          value={profile.xAccount || profile.x_account || ''}
                          onChange={(e) => handleFieldChange('xAccount', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="xManagerName">Manager Name</Label>
                        <Input
                          id="xManagerName"
                          value={profile.xManagerName || ''}
                          onChange={(e) => handleFieldChange('xManagerName', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="xManagerCompany">Manager Company</Label>
                        <Input
                          id="xManagerCompany"
                          value={profile.xManagerCompany || ''}
                          onChange={(e) => handleFieldChange('xManagerCompany', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="xManagerPhone">Manager Phone</Label>
                        <Input
                          id="xManagerPhone"
                          value={profile.xManagerPhone || ''}
                          onChange={(e) => handleFieldChange('xManagerPhone', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="xManagerEmail">Manager Email</Label>
                        <Input
                          id="xManagerEmail"
                          value={profile.xManagerEmail || ''}
                          onChange={(e) => handleFieldChange('xManagerEmail', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="xManagerAddress">Manager Address</Label>
                        <Input
                          id="xManagerAddress"
                          value={profile.xManagerAddress || ''}
                          onChange={(e) => handleFieldChange('xManagerAddress', e.target.value)}
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Label htmlFor="linkedinProfile" className="text-lg font-semibold">LinkedIn Profile</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open('https://www.linkedin.com/', '_blank')}
                        className="p-1 h-6 w-6 text-blue-700 hover:text-blue-900 hover:bg-blue-50"
                      >
                        <ExternalLink size={12} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedinProfile">Profile URL</Label>
                        <Input
                          id="linkedinProfile"
                          value={profile.linkedinProfile || profile.linkedin_profile || ''}
                          onChange={(e) => handleFieldChange('linkedinProfile', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedinManagerName">Manager Name</Label>
                        <Input
                          id="linkedinManagerName"
                          value={profile.linkedinManagerName || ''}
                          onChange={(e) => handleFieldChange('linkedinManagerName', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedinManagerCompany">Manager Company</Label>
                        <Input
                          id="linkedinManagerCompany"
                          value={profile.linkedinManagerCompany || ''}
                          onChange={(e) => handleFieldChange('linkedinManagerCompany', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedinManagerPhone">Manager Phone</Label>
                        <Input
                          id="linkedinManagerPhone"
                          value={profile.linkedinManagerPhone || ''}
                          onChange={(e) => handleFieldChange('linkedinManagerPhone', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedinManagerEmail">Manager Email</Label>
                        <Input
                          id="linkedinManagerEmail"
                          value={profile.linkedinManagerEmail || ''}
                          onChange={(e) => handleFieldChange('linkedinManagerEmail', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedinManagerAddress">Manager Address</Label>
                        <Input
                          id="linkedinManagerAddress"
                          value={profile.linkedinManagerAddress || ''}
                          onChange={(e) => handleFieldChange('linkedinManagerAddress', e.target.value)}
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Label htmlFor="youtubeChannel" className="text-lg font-semibold">YouTube Channel</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open('https://www.youtube.com/', '_blank')}
                        className="p-1 h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <ExternalLink size={12} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="youtubeChannel">Channel URL</Label>
                        <Input
                          id="youtubeChannel"
                          value={profile.youtubeChannel || profile.youtube_channel || ''}
                          onChange={(e) => handleFieldChange('youtubeChannel', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="youtubeManagerName">Manager Name</Label>
                        <Input
                          id="youtubeManagerName"
                          value={profile.youtubeManagerName || ''}
                          onChange={(e) => handleFieldChange('youtubeManagerName', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="youtubeManagerCompany">Manager Company</Label>
                        <Input
                          id="youtubeManagerCompany"
                          value={profile.youtubeManagerCompany || ''}
                          onChange={(e) => handleFieldChange('youtubeManagerCompany', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="youtubeManagerPhone">Manager Phone</Label>
                        <Input
                          id="youtubeManagerPhone"
                          value={profile.youtubeManagerPhone || ''}
                          onChange={(e) => handleFieldChange('youtubeManagerPhone', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="youtubeManagerEmail">Manager Email</Label>
                        <Input
                          id="youtubeManagerEmail"
                          value={profile.youtubeManagerEmail || ''}
                          onChange={(e) => handleFieldChange('youtubeManagerEmail', e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <Label htmlFor="youtubeManagerAddress">Manager Address</Label>
                        <Input
                          id="youtubeManagerAddress"
                          value={profile.youtubeManagerAddress || ''}
                          onChange={(e) => handleFieldChange('youtubeManagerAddress', e.target.value)}
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="tiktokAccount">TikTok Account</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open('https://www.tiktok.com/', '_blank')}
                        className="p-1 h-6 w-6 text-black hover:text-gray-700 hover:bg-gray-50"
                      >
                        <ExternalLink size={12} />
                      </Button>
                    </div>
                    <Input
                      id="tiktokAccount"
                      value={profile.tiktokAccount || profile.tiktok_account || ''}
                      onChange={(e) => handleFieldChange('tiktokAccount', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="snapchatAccount">Snapchat Account</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open('https://www.snapchat.com/', '_blank')}
                        className="p-1 h-6 w-6 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                      >
                        <ExternalLink size={12} />
                      </Button>
                    </div>
                    <Input
                      id="snapchatAccount"
                      value={profile.snapchatAccount || profile.snapchat_account || ''}
                      onChange={(e) => handleFieldChange('snapchatAccount', e.target.value)}
                      placeholder="Username or profile URL"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="pinterestAccount">Pinterest Account</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open('https://www.pinterest.com/', '_blank')}
                        className="p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <ExternalLink size={12} />
                      </Button>
                    </div>
                    <Input
                      id="pinterestAccount"
                      value={profile.pinterestAccount || profile.pinterest_account || ''}
                      onChange={(e) => handleFieldChange('pinterestAccount', e.target.value)}
                      placeholder="Profile URL"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="threadsAccount">Threads Account</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open('https://www.threads.net/', '_blank')}
                        className="p-1 h-6 w-6 text-black hover:text-gray-700 hover:bg-gray-50"
                      >
                        <ExternalLink size={12} />
                      </Button>
                    </div>
                    <Input
                      id="threadsAccount"
                      value={profile.threadsAccount || profile.threads_account || ''}
                      onChange={(e) => handleFieldChange('threadsAccount', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="digitalNotes">Notes</Label>
                    <Textarea
                      id="digitalNotes"
                      value={profile.digitalNotes || ''}
                      onChange={(e) => handleFieldChange('digitalNotes', e.target.value)}
                      placeholder="Add notes for social media information..."
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Business Plan Tab */}
              <TabsContent value="business" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="text-slate-600" size={20} />
                  <h4 className="text-base font-semibold text-slate-700">Business Plan & Strategy</h4>
                </div>
                
                {/* Executive Summary */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Executive Summary</h5>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label htmlFor="executiveSummary">Executive Summary</Label>
                      <Textarea
                        id="executiveSummary"
                        value={profile.executiveSummary || profile.executive_summary || ''}
                        onChange={(e) => handleFieldChange('executiveSummary', e.target.value)}
                        placeholder=""
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="missionStatement">Mission Statement</Label>
                        <Textarea
                          id="missionStatement"
                          value={profile.missionStatement || profile.mission_statement || ''}
                          onChange={(e) => handleFieldChange('missionStatement', e.target.value)}
                          placeholder=""
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="visionStatement">Vision Statement</Label>
                        <Textarea
                          id="visionStatement"
                          value={profile.visionStatement || profile.vision_statement || ''}
                          onChange={(e) => handleFieldChange('visionStatement', e.target.value)}
                          placeholder=""
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Description */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Business Description</h5>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label htmlFor="businessDescription">Business Description</Label>
                      <Textarea
                        id="businessDescription"
                        value={profile.businessDescription || profile.business_description || ''}
                        onChange={(e) => handleFieldChange('businessDescription', e.target.value)}
                        placeholder=""
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="targetMarket">Target Market</Label>
                        <Textarea
                          id="targetMarket"
                          value={profile.targetMarket || profile.target_market || ''}
                          onChange={(e) => handleFieldChange('targetMarket', e.target.value)}
                          placeholder=""
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
                        <Textarea
                          id="competitiveAdvantage"
                          value={profile.competitiveAdvantage || profile.competitive_advantage || ''}
                          onChange={(e) => handleFieldChange('competitiveAdvantage', e.target.value)}
                          placeholder=""
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Model & Financial Projections */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Revenue Model & Financials</h5>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label htmlFor="revenueModel">Revenue Model</Label>
                      <Textarea
                        id="revenueModel"
                        value={profile.revenueModel || profile.revenue_model || ''}
                        onChange={(e) => handleFieldChange('revenueModel', e.target.value)}
                        placeholder=""
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="financialProjections">Financial Projections</Label>
                        <Textarea
                          id="financialProjections"
                          value={profile.financialProjections || profile.financial_projections || ''}
                          onChange={(e) => handleFieldChange('financialProjections', e.target.value)}
                          placeholder=""
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fundingRequirements">Funding Requirements</Label>
                        <Textarea
                          id="fundingRequirements"
                          value={profile.fundingRequirements || profile.funding_requirements || ''}
                          onChange={(e) => handleFieldChange('fundingRequirements', e.target.value)}
                          placeholder=""
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing & Sales Strategy */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Marketing & Sales Strategy</h5>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="marketingStrategy">Marketing Strategy</Label>
                        <Textarea
                          id="marketingStrategy"
                          value={profile.marketingStrategy || profile.marketing_strategy || ''}
                          onChange={(e) => handleFieldChange('marketingStrategy', e.target.value)}
                          placeholder="How you plan to reach and attract customers"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="salesStrategy">Sales Strategy</Label>
                        <Textarea
                          id="salesStrategy"
                          value={profile.salesStrategy || profile.sales_strategy || ''}
                          onChange={(e) => handleFieldChange('salesStrategy', e.target.value)}
                          placeholder="Your approach to converting leads into customers"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operations & Management */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Operations & Management</h5>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="operationsPlan">Operations Plan</Label>
                        <Textarea
                          id="operationsPlan"
                          value={profile.operationsPlan || profile.operations_plan || ''}
                          onChange={(e) => handleFieldChange('operationsPlan', e.target.value)}
                          placeholder="How your business will operate day-to-day"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="managementStructure">Management Structure</Label>
                        <Textarea
                          id="managementStructure"
                          value={profile.managementStructure || profile.management_structure || ''}
                          onChange={(e) => handleFieldChange('managementStructure', e.target.value)}
                          placeholder="Leadership team and organizational structure"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="keyPersonnel">Key Personnel</Label>
                      <Textarea
                        id="keyPersonnel"
                        value={profile.keyPersonnel || profile.key_personnel || ''}
                        onChange={(e) => handleFieldChange('keyPersonnel', e.target.value)}
                        placeholder="Key team members, their roles, and qualifications"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Risk Analysis & Additional Info */}
                <div>
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Risk Analysis & Additional Information</h5>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label htmlFor="riskAnalysis">Risk Analysis</Label>
                      <Textarea
                        id="riskAnalysis"
                        value={profile.riskAnalysis || profile.risk_analysis || ''}
                        onChange={(e) => handleFieldChange('riskAnalysis', e.target.value)}
                        placeholder="Potential risks and challenges facing your business and mitigation strategies"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="exitStrategy">Exit Strategy</Label>
                        <Textarea
                          id="exitStrategy"
                          value={profile.exitStrategy || profile.exit_strategy || ''}
                          onChange={(e) => handleFieldChange('exitStrategy', e.target.value)}
                          placeholder=""
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="organizer">Business Organizer</Label>
                        <Input
                          id="organizer"
                          value={profile.organizer || ''}
                          onChange={(e) => handleFieldChange('organizer', e.target.value)}
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Retirement Planning Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Retirement Planning</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="retirementPlan401k">401(K) Provider</Label>
                      <Input
                        id="retirementPlan401k"
                        value={profile.retirementPlan401k || profile.retirement_plan_401k || ''}
                        onChange={(e) => handleFieldChange('retirementPlan401k', e.target.value)}
                        placeholder="Provider name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="retirementPlan401kAccountNumber">401(K) Account Number</Label>
                      <Input
                        id="retirementPlan401kAccountNumber"
                        value={profile.retirementPlan401kAccountNumber || profile.retirement_plan_401k_account_number || ''}
                        onChange={(e) => handleFieldChange('retirementPlan401kAccountNumber', e.target.value)}
                        placeholder="Account number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="retirementPlan401kWebsite">401(K) Website</Label>
                      <Input
                        id="retirementPlan401kWebsite"
                        value={profile.retirementPlan401kWebsite || profile.retirement_plan_401k_website || ''}
                        onChange={(e) => handleFieldChange('retirementPlan401kWebsite', e.target.value)}
                        placeholder="https://provider.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Insurance Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Business Insurance</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessInsuranceProvider">Insurance Provider</Label>
                      <Input
                        id="businessInsuranceProvider"
                        value={profile.businessInsuranceProvider || profile.business_insurance_provider || ''}
                        onChange={(e) => handleFieldChange('businessInsuranceProvider', e.target.value)}
                        placeholder="e.g., Next Insurance"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessInsurancePolicyNumber">Policy Number</Label>
                      <Input
                        id="businessInsurancePolicyNumber"
                        value={profile.businessInsurancePolicyNumber || profile.business_insurance_policy_number || ''}
                        onChange={(e) => handleFieldChange('businessInsurancePolicyNumber', e.target.value)}
                        placeholder="Policy number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessInsuranceWebsite">Insurance Website</Label>
                      <Input
                        id="businessInsuranceWebsite"
                        value={profile.businessInsuranceWebsite || profile.business_insurance_website || ''}
                        onChange={(e) => handleFieldChange('businessInsuranceWebsite', e.target.value)}
                        placeholder="https://provider.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessInsuranceRenewalDate">Renewal Date</Label>
                      <Input
                        id="businessInsuranceRenewalDate"
                        type="date"
                        value={profile.businessInsuranceRenewalDate || profile.business_insurance_renewal_date || ''}
                        onChange={(e) => handleFieldChange('businessInsuranceRenewalDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Business Credit Cards Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Business Credit Cards</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <h6 className="text-sm font-semibold text-slate-600 mb-3">Credit Card 1 (e.g., DIVVY)</h6>
                    </div>
                    <div>
                      <Label htmlFor="businessCreditCard1">Card Provider</Label>
                      <Input
                        id="businessCreditCard1"
                        value={profile.businessCreditCard1 || profile.business_credit_card_1 || ''}
                        onChange={(e) => handleFieldChange('businessCreditCard1', e.target.value)}
                        placeholder="e.g., DIVVY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessCreditCard1Limit">Credit Limit</Label>
                      <Input
                        id="businessCreditCard1Limit"
                        value={profile.businessCreditCard1Limit || profile.business_credit_card_1_limit || ''}
                        onChange={(e) => handleFieldChange('businessCreditCard1Limit', e.target.value)}
                        placeholder="$10,000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessCreditCard1Website">Card Website</Label>
                      <Input
                        id="businessCreditCard1Website"
                        value={profile.businessCreditCard1Website || profile.business_credit_card_1_website || ''}
                        onChange={(e) => handleFieldChange('businessCreditCard1Website', e.target.value)}
                        placeholder="https://divvy.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <h6 className="text-sm font-semibold text-slate-600 mb-3 mt-4">Credit Card 2 (e.g., FundBox)</h6>
                    </div>
                    <div>
                      <Label htmlFor="businessCreditCard2">Card Provider</Label>
                      <Input
                        id="businessCreditCard2"
                        value={profile.businessCreditCard2 || profile.business_credit_card_2 || ''}
                        onChange={(e) => handleFieldChange('businessCreditCard2', e.target.value)}
                        placeholder="e.g., FundBox"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessCreditCard2Limit">Credit Limit</Label>
                      <Input
                        id="businessCreditCard2Limit"
                        value={profile.businessCreditCard2Limit || profile.business_credit_card_2_limit || ''}
                        onChange={(e) => handleFieldChange('businessCreditCard2Limit', e.target.value)}
                        placeholder="$25,000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessCreditCard2Website">Card Website</Label>
                      <Input
                        id="businessCreditCard2Website"
                        value={profile.businessCreditCard2Website || profile.business_credit_card_2_website || ''}
                        onChange={(e) => handleFieldChange('businessCreditCard2Website', e.target.value)}
                        placeholder="https://fundbox.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="businessNotes">Notes</Label>
                  <Textarea
                    id="businessNotes"
                    value={profile.businessNotes || ''}
                    onChange={(e) => handleFieldChange('businessNotes', e.target.value)}
                    placeholder="Add notes for business plan and strategy..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              {/* Codes Tab */}
              <TabsContent value="codes" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="text-teal-600" size={20} />
                  <h4 className="text-base font-semibold text-teal-700">NAICA Codes and Business Certifications</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="naics">NAICS Code</Label>
                    <Input
                      id="naics"
                      value={profile.naics || ''}
                      onChange={(e) => handleFieldChange('naics', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="sic">SIC Code</Label>
                    <Input
                      id="sic"
                      value={profile.sic || ''}
                      onChange={(e) => handleFieldChange('sic', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="duns">DUNS Number</Label>
                    <Input
                      id="duns"
                      value={profile.duns || ''}
                      onChange={(e) => handleFieldChange('duns', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="nicis">NICIS Code</Label>
                    <Input
                      id="nicis"
                      value={profile.nicis || ''}
                      onChange={(e) => handleFieldChange('nicis', e.target.value)}
                      placeholder=""
                    />
                  </div>
                </div>
                
                {/* Business Certifications Section */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="text-green-600" size={20} />
                    <h4 className="text-base font-semibold text-green-700">Business Certifications for Drivers & Trucking</h4>
                  </div>
                  
                  {/* Informational Alert */}
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Why Certifications Matter:</strong> Federal and state certifications like DBE, 8(a), WOSB, SDVOSB, and HUBZone materially increase your chances of winning transportation contracts and subcontracts that fund equipment purchases. Down-payment assistance and low-interest loans often require certification status.
                    </p>
                  </div>

                  {/* Federal SBA Certifications */}
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Federal SBA Certifications</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="sbaStatus">SBA Certification Status</Label>
                        <select
                          id="sbaStatus"
                          value={profile.sbaStatus || ''}
                          onChange={(e) => handleFieldChange('sbaStatus', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select SBA Status</option>
                          <option value="none">None</option>
                          <option value="8a">8(a) Business Development - For socially/economically disadvantaged owners</option>
                          <option value="hubzone">HUBZone Certified - Location-based, requires 35%+ employees in HUBZone</option>
                          <option value="wosb">Women-Owned Small Business (WOSB) - 51%+ women-owned</option>
                          <option value="edwosb">Economically Disadvantaged WOSB (EDWOSB)</option>
                          <option value="vosb">Veteran-Owned Small Business (VOSB)</option>
                          <option value="sdvosb">Service-Disabled Veteran-Owned Small Business (SDVOSB)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Apply via <a href="https://www.uschamber.com/co/run/business-financing/small-business-certifications" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SBA Certifications Guide</a>
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="sbaCertificationNumber">SBA Certification Number</Label>
                        <Input
                          id="sbaCertificationNumber"
                          value={profile.sbaCertificationNumber || ''}
                          onChange={(e) => handleFieldChange('sbaCertificationNumber', e.target.value)}
                          placeholder="Enter certification number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* USDOT Transportation Certifications */}
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h5 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-3">USDOT Transportation Certifications</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="dbeStatus">DBE/ACDBE Status (Disadvantaged Business Enterprise)</Label>
                        <select
                          id="dbeStatus"
                          value={profile.dbeStatus || ''}
                          onChange={(e) => handleFieldChange('dbeStatus', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select DBE Status</option>
                          <option value="none">Not Certified</option>
                          <option value="dbe">DBE - Road/Bridge/Freight/Port work</option>
                          <option value="acdbe">ACDBE - Airport Concession DBE</option>
                          <option value="txdot-dbe">TxDOT DBE (Texas-specific)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          For road, bridge, freight, port, airport work. Apply via your state DOT. <a href="https://gov.texas.gov/business/page/veteran-minority-women-owned-business-resources" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Texas Resources</a>
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="dbeCertificationNumber">DBE Certification Number</Label>
                        <Input
                          id="dbeCertificationNumber"
                          value={profile.dbeCertificationNumber || ''}
                          onChange={(e) => handleFieldChange('dbeCertificationNumber', e.target.value)}
                          placeholder="Enter DBE number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Private Diversity Certifications */}
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Private Sector Diversity Certifications</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Large shippers, 3PLs, and retailers require third-party certification to onboard diverse carriers. <a href="https://www.suppliergateway.com/supplier-diversity/understanding-supplier-diversity-certifications" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Learn more</a></p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="nmsdcStatus">NMSDC (National Minority Supplier Development Council)</Label>
                        <select
                          id="nmsdcStatus"
                          value={profile.nmsdcStatus || ''}
                          onChange={(e) => handleFieldChange('nmsdcStatus', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select Status</option>
                          <option value="none">Not Certified</option>
                          <option value="mbe">MBE Certified</option>
                          <option value="pending">Application Pending</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Apply at <a href="https://nmsdc.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">nmsdc.org</a>
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="nmsdcNumber">NMSDC Certification Number</Label>
                        <Input
                          id="nmsdcNumber"
                          value={profile.nmsdcNumber || ''}
                          onChange={(e) => handleFieldChange('nmsdcNumber', e.target.value)}
                          placeholder="MBE number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wbencStatus">WBENC (Women's Business Enterprise National Council)</Label>
                        <select
                          id="wbencStatus"
                          value={profile.wbencStatus || ''}
                          onChange={(e) => handleFieldChange('wbencStatus', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select Status</option>
                          <option value="none">Not Certified</option>
                          <option value="wbe">WBE Certified</option>
                          <option value="pending">Application Pending</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Apply at <a href="https://www.wbenc.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">wbenc.org</a>
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="wbencNumber">WBENC Certification Number</Label>
                        <Input
                          id="wbencNumber"
                          value={profile.wbencNumber || ''}
                          onChange={(e) => handleFieldChange('wbencNumber', e.target.value)}
                          placeholder="WBE number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nglccStatus">NGLCC (National LGBT Chamber of Commerce)</Label>
                        <select
                          id="nglccStatus"
                          value={profile.nglccStatus || ''}
                          onChange={(e) => handleFieldChange('nglccStatus', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select Status</option>
                          <option value="none">Not Certified</option>
                          <option value="lgbtbe">LGBTBE Certified</option>
                          <option value="pending">Application Pending</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Apply at <a href="https://nglcc.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">nglcc.org</a>
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="nglccNumber">NGLCC Certification Number</Label>
                        <Input
                          id="nglccNumber"
                          value={profile.nglccNumber || ''}
                          onChange={(e) => handleFieldChange('nglccNumber', e.target.value)}
                          placeholder="LGBTBE number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="disabilityInStatus">Disability:IN (DOBE - Disability-Owned Business)</Label>
                        <select
                          id="disabilityInStatus"
                          value={profile.disabilityInStatus || ''}
                          onChange={(e) => handleFieldChange('disabilityInStatus', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select Status</option>
                          <option value="none">Not Certified</option>
                          <option value="dobe">DOBE Certified</option>
                          <option value="pending">Application Pending</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Apply at <a href="https://disabilityin.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">disabilityin.org</a>
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="disabilityInNumber">Disability:IN Certification Number</Label>
                        <Input
                          id="disabilityInNumber"
                          value={profile.disabilityInNumber || ''}
                          onChange={(e) => handleFieldChange('disabilityInNumber', e.target.value)}
                          placeholder="DOBE number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* General Business Certifications */}
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">General Business Information</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="minorityBusinessStatus">Primary Certification Type</Label>
                        <select
                          id="minorityBusinessStatus"
                          value={profile.minorityBusinessStatus || ''}
                          onChange={(e) => handleFieldChange('minorityBusinessStatus', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select Primary Type</option>
                          <option value="none">Not Certified</option>
                          <option value="mbe">Minority Business Enterprise (MBE)</option>
                          <option value="wbe">Women Business Enterprise (WBE)</option>
                          <option value="dbe">Disadvantaged Business Enterprise (DBE)</option>
                          <option value="mwbe">Minority & Women Business Enterprise (MWBE)</option>
                          <option value="vbe">Veteran Business Enterprise (VBE)</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="mbeCertificationNumber">Primary Certification Number</Label>
                        <Input
                          id="mbeCertificationNumber"
                          value={profile.mbeCertificationNumber || ''}
                          onChange={(e) => handleFieldChange('mbeCertificationNumber', e.target.value)}
                          placeholder="Enter certification number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="professionalLicenses">Professional Licenses</Label>
                        <Input
                          id="professionalLicenses"
                          value={profile.professionalLicenses || ''}
                          onChange={(e) => handleFieldChange('professionalLicenses', e.target.value)}
                          placeholder="e.g., CDL, Medical Transport License"
                        />
                      </div>
                      <div>
                        <Label htmlFor="industryCertifications">Industry Certifications</Label>
                        <Input
                          id="industryCertifications"
                          value={profile.industryCertifications || ''}
                          onChange={(e) => handleFieldChange('industryCertifications', e.target.value)}
                          placeholder="e.g., HAZMAT, OSHA, HIPAA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bondingCapacity">Bonding Capacity</Label>
                        <Input
                          id="bondingCapacity"
                          value={profile.bondingCapacity || ''}
                          onChange={(e) => handleFieldChange('bondingCapacity', e.target.value)}
                          placeholder="e.g., $500,000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="insuranceCoverage">Insurance Coverage</Label>
                        <Input
                          id="insuranceCoverage"
                          value={profile.insuranceCoverage || ''}
                          onChange={(e) => handleFieldChange('insuranceCoverage', e.target.value)}
                          placeholder="e.g., $1M General Liability, $300K Auto"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resource Links */}
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📚 Certification Resources</h5>
                    <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• <a href="https://gov.texas.gov/business/page/veteran-minority-women-owned-business-resources" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Texas Governor's Veteran, Minority & Women-Owned Business Resources</a></li>
                      <li>• <a href="https://www.uschamber.com/co/run/business-financing/small-business-certifications" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">U.S. Chamber of Commerce - SBA Certifications Guide</a></li>
                      <li>• <a href="https://www.suppliergateway.com/supplier-diversity/understanding-supplier-diversity-certifications" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Understanding Supplier Diversity Certifications</a></li>
                      <li>• <a href="https://comptroller.texas.gov/purchasing/vendor/hub/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Texas HUB Certification Program</a></li>
                      <li>• <strong>Note:</strong> While legitimate free vehicle programs are extremely rare, these certifications increase access to down-payment assistance, low-interest loans, and contracts that fund equipment purchases.</li>
                    </ul>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="codesNotes">Notes</Label>
                  <Textarea
                    id="codesNotes"
                    value={profile.codesNotes || ''}
                    onChange={(e) => handleFieldChange('codesNotes', e.target.value)}
                    placeholder="Add notes for industry codes and certifications..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              {/* Tax Tab */}
              <TabsContent value="tax" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-red-600" size={20} />
                  <h4 className="text-base font-semibold text-red-700">Tax Information</h4>
                </div>
                
                {/* Basic Tax Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="franchiseTaxNumber">Franchise Tax Number</Label>
                    <Input
                      id="franchiseTaxNumber"
                      value={profile.franchiseTaxNumber || profile.franchise_tax_number || ''}
                      onChange={(e) => handleFieldChange('franchiseTaxNumber', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="franchiseXtNumber">Franchise XT Number</Label>
                    <Input
                      id="franchiseXtNumber"
                      value={profile.franchiseXtNumber || profile.franchise_xt_number || ''}
                      onChange={(e) => handleFieldChange('franchiseXtNumber', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="franchiseTaxLogin">Franchise Tax Login & Password</Label>
                    <Input
                      id="franchiseTaxLogin"
                      value={profile.franchiseTaxLogin || profile.franchise_tax_login || ''}
                      onChange={(e) => handleFieldChange('franchiseTaxLogin', e.target.value)}
                      placeholder="Username/email and password"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="franchiseTaxFilingDate">Franchise Tax Filing Date</Label>
                      <Input
                        id="franchiseTaxFilingDate"
                        type="date"
                        value={profile.franchiseTaxFilingDate || profile.franchise_tax_filing_date || ''}
                        onChange={(e) => handleFieldChange('franchiseTaxFilingDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Reminder Settings</Label>
                      <Dialog open={franchiseTaxReminderDialogOpen} onOpenChange={setFranchiseTaxReminderDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                            {profile.franchiseTaxReminderMethod ? (
                              <span className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">{profile.franchiseTaxReminderMethod}</Badge>
                                {profile.franchiseTaxReminderDate && <span className="text-xs text-gray-500">• {new Date(profile.franchiseTaxReminderDate).toLocaleDateString()}</span>}
                              </span>
                            ) : (
                              <span className="text-gray-500">Configure reminder...</span>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Configure Franchise Tax Reminder</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="franchiseTaxReminderMethod">Reminder Method</Label>
                              <Select 
                                value={profile.franchiseTaxReminderMethod || ''} 
                                onValueChange={(value) => handleFieldChange('franchiseTaxReminderMethod', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose how to receive reminders" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Email">✉️ Email</SelectItem>
                                  <SelectItem value="SMS">📱 SMS</SelectItem>
                                  <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                                  <SelectItem value="This App">📲 This App</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {profile.franchiseTaxReminderMethod === 'Email' && (
                              <div>
                                <Label htmlFor="franchiseTaxReminderEmails">Email Addresses (comma-separated)</Label>
                                <Textarea
                                  id="franchiseTaxReminderEmails"
                                  value={profile.franchiseTaxReminderEmails || ''}
                                  onChange={(e) => handleFieldChange('franchiseTaxReminderEmails', e.target.value)}
                                  placeholder="email1@example.com, email2@example.com"
                                  rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter multiple email addresses separated by commas</p>
                              </div>
                            )}

                            {(profile.franchiseTaxReminderMethod === 'SMS' || profile.franchiseTaxReminderMethod === 'Phone Call') && (
                              <div>
                                <Label htmlFor="franchiseTaxReminderPhones">Phone Numbers (comma-separated)</Label>
                                <Textarea
                                  id="franchiseTaxReminderPhones"
                                  value={profile.franchiseTaxReminderPhones || ''}
                                  onChange={(e) => handleFieldChange('franchiseTaxReminderPhones', e.target.value)}
                                  placeholder="+1234567890, +0987654321"
                                  rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter phone numbers with country code, separated by commas</p>
                              </div>
                            )}

                            {profile.franchiseTaxReminderMethod && (
                              <>
                                <div>
                                  <Label htmlFor="franchiseTaxReminderDate">Reminder Date</Label>
                                  <Input
                                    id="franchiseTaxReminderDate"
                                    type="date"
                                    value={profile.franchiseTaxReminderDate || ''}
                                    onChange={(e) => handleFieldChange('franchiseTaxReminderDate', e.target.value)}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="franchiseTaxReminderFrequency">Frequency</Label>
                                  <Select 
                                    value={profile.franchiseTaxReminderFrequency || ''} 
                                    onValueChange={(value) => handleFieldChange('franchiseTaxReminderFrequency', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="How often to remind" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Once">Once</SelectItem>
                                      <SelectItem value="Daily">Daily</SelectItem>
                                      <SelectItem value="Weekly">Weekly</SelectItem>
                                      <SelectItem value="Monthly">Monthly</SelectItem>
                                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                                      <SelectItem value="Yearly">Yearly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="franchiseTaxReminderLeadDays">Lead Time (days before)</Label>
                                  <Input
                                    id="franchiseTaxReminderLeadDays"
                                    type="number"
                                    min="0"
                                    value={profile.franchiseTaxReminderLeadDays || ''}
                                    onChange={(e) => handleFieldChange('franchiseTaxReminderLeadDays', parseInt(e.target.value) || 0)}
                                    placeholder="e.g., 30 days before filing date"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">How many days before the filing date to send reminder</p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                  <Button variant="outline" onClick={() => setFranchiseTaxReminderDialogOpen(false)}>
                                    Close
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="taxYear">Tax Year</Label>
                    <Input
                      id="taxYear"
                      value={profile.taxYear || profile.tax_year || ''}
                      onChange={(e) => handleFieldChange('taxYear', e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="publicInfoReport">Public Information Report</Label>
                      <Input
                        id="publicInfoReport"
                        value={profile.publicInfoReport || ''}
                        onChange={(e) => handleFieldChange('publicInfoReport', e.target.value)}
                        placeholder="Report status or notes"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="publicInfoReportFilingDate">Public Information Report Filing Date</Label>
                      <Input
                        id="publicInfoReportFilingDate"
                        type="date"
                        value={profile.publicInfoReportFilingDate || ''}
                        onChange={(e) => handleFieldChange('publicInfoReportFilingDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Reminder Settings</Label>
                      <Dialog open={publicInfoReminderDialogOpen} onOpenChange={setPublicInfoReminderDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                            {profile.publicInfoReportReminderMethod ? (
                              <span className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">{profile.publicInfoReportReminderMethod}</Badge>
                                {profile.publicInfoReportReminderDate && <span className="text-xs text-gray-500">• {new Date(profile.publicInfoReportReminderDate).toLocaleDateString()}</span>}
                              </span>
                            ) : (
                              <span className="text-gray-500">Configure reminder...</span>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Configure Public Information Report Reminder</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="publicInfoReportReminderMethod">Reminder Method</Label>
                              <Select 
                                value={profile.publicInfoReportReminderMethod || ''} 
                                onValueChange={(value) => handleFieldChange('publicInfoReportReminderMethod', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose how to receive reminders" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Email">✉️ Email</SelectItem>
                                  <SelectItem value="SMS">📱 SMS</SelectItem>
                                  <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                                  <SelectItem value="This App">📲 This App</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {profile.publicInfoReportReminderMethod === 'Email' && (
                              <div>
                                <Label htmlFor="publicInfoReportReminderEmails">Email Addresses (comma-separated)</Label>
                                <Textarea
                                  id="publicInfoReportReminderEmails"
                                  value={profile.publicInfoReportReminderEmails || ''}
                                  onChange={(e) => handleFieldChange('publicInfoReportReminderEmails', e.target.value)}
                                  placeholder="email1@example.com, email2@example.com"
                                  rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter multiple email addresses separated by commas</p>
                              </div>
                            )}

                            {(profile.publicInfoReportReminderMethod === 'SMS' || profile.publicInfoReportReminderMethod === 'Phone Call') && (
                              <div>
                                <Label htmlFor="publicInfoReportReminderPhones">Phone Numbers (comma-separated)</Label>
                                <Textarea
                                  id="publicInfoReportReminderPhones"
                                  value={profile.publicInfoReportReminderPhones || ''}
                                  onChange={(e) => handleFieldChange('publicInfoReportReminderPhones', e.target.value)}
                                  placeholder="+1234567890, +0987654321"
                                  rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter phone numbers with country code, separated by commas</p>
                              </div>
                            )}

                            {profile.publicInfoReportReminderMethod && (
                              <>
                                <div>
                                  <Label htmlFor="publicInfoReportReminderDate">Reminder Date</Label>
                                  <Input
                                    id="publicInfoReportReminderDate"
                                    type="date"
                                    value={profile.publicInfoReportReminderDate || ''}
                                    onChange={(e) => handleFieldChange('publicInfoReportReminderDate', e.target.value)}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="publicInfoReportReminderFrequency">Frequency</Label>
                                  <Select 
                                    value={profile.publicInfoReportReminderFrequency || ''} 
                                    onValueChange={(value) => handleFieldChange('publicInfoReportReminderFrequency', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="How often to remind" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Once">Once</SelectItem>
                                      <SelectItem value="Daily">Daily</SelectItem>
                                      <SelectItem value="Weekly">Weekly</SelectItem>
                                      <SelectItem value="Monthly">Monthly</SelectItem>
                                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                                      <SelectItem value="Yearly">Yearly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="publicInfoReportReminderLeadDays">Lead Time (days before)</Label>
                                  <Input
                                    id="publicInfoReportReminderLeadDays"
                                    type="number"
                                    min="0"
                                    value={profile.publicInfoReportReminderLeadDays || ''}
                                    onChange={(e) => handleFieldChange('publicInfoReportReminderLeadDays', parseInt(e.target.value) || 0)}
                                    placeholder="e.g., 30 days before filing date"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">How many days before the filing date to send reminder</p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                  <Button variant="outline" onClick={() => setPublicInfoReminderDialogOpen(false)}>
                                    Close
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accountingMethod">Accounting Method</Label>
                    <Select 
                      value={profile.accountingMethod || profile.accounting_method || ''} 
                      onValueChange={(value) => handleFieldChange('accountingMethod', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Accrual">Accrual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sosFileNumber">State SOS File Number</Label>
                    <Input
                      id="sosFileNumber"
                      value={profile.sosFileNumber || ''}
                      onChange={(e) => handleFieldChange('sosFileNumber', e.target.value)}
                      placeholder="e.g., 0801487585"
                    />
                  </div>
                  <div>
                    <Label htmlFor="effectiveSosDate">Effective SOS Registration Date</Label>
                    <Input
                      id="effectiveSosDate"
                      type="date"
                      value={profile.effectiveSosDate || ''}
                      onChange={(e) => handleFieldChange('effectiveSosDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rightToTransactStatus">Right to Transact Business</Label>
                    <Select 
                      value={profile.rightToTransactStatus || ''} 
                      onValueChange={(value) => handleFieldChange('rightToTransactStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sosRegistrationStatus">SOS Registration Status</Label>
                    <Select 
                      value={profile.sosRegistrationStatus || ''} 
                      onValueChange={(value) => handleFieldChange('sosRegistrationStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Forfeited">Forfeited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Important Deadlines */}
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-slate-700">Important Deadlines</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-gray-500" size={20} />
                      <div className="flex-1">
                        <Label htmlFor="franchiseFilingDue" className="text-sm">Franchise Filing Due:</Label>
                        <Input
                          id="franchiseFilingDue"
                          type="date"
                          value={profile.franchiseTaxFilingDate || profile.franchise_tax_filing_date || ''}
                          onChange={(e) => handleFieldChange('franchiseTaxFilingDate', e.target.value)}
                          className="mt-1"
                          placeholder=""
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Globe className="text-gray-500" size={20} />
                        <div className="flex-1">
                          <Label htmlFor="domainExpiration" className="text-sm">Domain Expiration:</Label>
                          <Input
                            id="domainExpiration"
                            type="date"
                            value={profile.websiteDomainExpirationDate || profile.website_domain_expiration_date || ''}
                            onChange={(e) => handleFieldChange('websiteDomainExpirationDate', e.target.value)}
                            className="mt-1"
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="ml-8">
                        <Label className="text-xs text-gray-600 mb-1 block">Reminder Settings</Label>
                        <Dialog open={domainExpirationReminderDialogOpen} onOpenChange={setDomainExpirationReminderDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                              {profile.domainExpirationReminderMethod ? (
                                <span className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">{profile.domainExpirationReminderMethod}</Badge>
                                  {profile.domainExpirationReminderDate && <span className="text-xs text-gray-500">• {new Date(profile.domainExpirationReminderDate).toLocaleDateString()}</span>}
                                </span>
                              ) : (
                                <span className="text-gray-500">Configure reminder...</span>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Configure Domain Expiration Reminder</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="domainExpirationReminderMethod">Reminder Method</Label>
                                <Select 
                                  value={profile.domainExpirationReminderMethod || ''} 
                                  onValueChange={(value) => handleFieldChange('domainExpirationReminderMethod', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose how to receive reminders" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Email">✉️ Email</SelectItem>
                                    <SelectItem value="SMS">📱 SMS</SelectItem>
                                    <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                                    <SelectItem value="This App">📲 This App</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {profile.domainExpirationReminderMethod === 'Email' && (
                                <div>
                                  <Label htmlFor="domainExpirationReminderEmails">Email Addresses (comma-separated)</Label>
                                  <Textarea
                                    id="domainExpirationReminderEmails"
                                    value={profile.domainExpirationReminderEmails || ''}
                                    onChange={(e) => handleFieldChange('domainExpirationReminderEmails', e.target.value)}
                                    placeholder="email1@example.com, email2@example.com"
                                    rows={3}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Enter multiple email addresses separated by commas</p>
                                </div>
                              )}

                              {(profile.domainExpirationReminderMethod === 'SMS' || profile.domainExpirationReminderMethod === 'Phone Call') && (
                                <div>
                                  <Label htmlFor="domainExpirationReminderPhones">Phone Numbers (comma-separated)</Label>
                                  <Textarea
                                    id="domainExpirationReminderPhones"
                                    value={profile.domainExpirationReminderPhones || ''}
                                    onChange={(e) => handleFieldChange('domainExpirationReminderPhones', e.target.value)}
                                    placeholder="+1234567890, +0987654321"
                                    rows={3}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Enter phone numbers with country code, separated by commas</p>
                                </div>
                              )}

                              {profile.domainExpirationReminderMethod && (
                                <>
                                  <div>
                                    <Label htmlFor="domainExpirationReminderDate">Reminder Date</Label>
                                    <Input
                                      id="domainExpirationReminderDate"
                                      type="date"
                                      value={profile.domainExpirationReminderDate || ''}
                                      onChange={(e) => handleFieldChange('domainExpirationReminderDate', e.target.value)}
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="domainExpirationReminderFrequency">Frequency</Label>
                                    <Select 
                                      value={profile.domainExpirationReminderFrequency || ''} 
                                      onValueChange={(value) => handleFieldChange('domainExpirationReminderFrequency', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="How often to remind" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Once">Once</SelectItem>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                                        <SelectItem value="Yearly">Yearly</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor="domainExpirationReminderLeadDays">Lead Time (days before)</Label>
                                    <Input
                                      id="domainExpirationReminderLeadDays"
                                      type="number"
                                      min="0"
                                      value={profile.domainExpirationReminderLeadDays || ''}
                                      onChange={(e) => handleFieldChange('domainExpirationReminderLeadDays', parseInt(e.target.value) || 0)}
                                      placeholder="e.g., 30 days before expiry date"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">How many days before the expiry date to send reminder</p>
                                  </div>

                                  <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setDomainExpirationReminderDialogOpen(false)}>
                                      Close
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FileText className="text-gray-500" size={20} />
                        <div className="flex-1">
                          <Label htmlFor="annualReportDue" className="text-sm">Annual Report Due:</Label>
                          <Input
                            id="annualReportDue"
                            type="date"
                            value={profile.annualReportDue || profile.annual_report_due || ''}
                            onChange={(e) => handleFieldChange('annualReportDue', e.target.value)}
                            className="mt-1"
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="ml-8">
                        <Label className="text-xs text-gray-600 mb-1 block">Reminder Settings</Label>
                        <Dialog open={annualReportDueReminderDialogOpen} onOpenChange={setAnnualReportDueReminderDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                              {profile.annualReportDueReminderMethod ? (
                                <span className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">{profile.annualReportDueReminderMethod}</Badge>
                                  {profile.annualReportDueReminderDate && <span className="text-xs text-gray-500">• {new Date(profile.annualReportDueReminderDate).toLocaleDateString()}</span>}
                                </span>
                              ) : (
                                <span className="text-gray-500">Configure reminder...</span>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Configure Annual Report Due Reminder</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="annualReportDueReminderMethod">Reminder Method</Label>
                                <Select 
                                  value={profile.annualReportDueReminderMethod || ''} 
                                  onValueChange={(value) => handleFieldChange('annualReportDueReminderMethod', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose how to receive reminders" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Email">✉️ Email</SelectItem>
                                    <SelectItem value="SMS">📱 SMS</SelectItem>
                                    <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                                    <SelectItem value="This App">📲 This App</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {profile.annualReportDueReminderMethod === 'Email' && (
                                <div>
                                  <Label htmlFor="annualReportDueReminderEmails">Email Addresses (comma-separated)</Label>
                                  <Textarea
                                    id="annualReportDueReminderEmails"
                                    value={profile.annualReportDueReminderEmails || ''}
                                    onChange={(e) => handleFieldChange('annualReportDueReminderEmails', e.target.value)}
                                    placeholder="email1@example.com, email2@example.com"
                                    rows={3}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Enter multiple email addresses separated by commas</p>
                                </div>
                              )}

                              {(profile.annualReportDueReminderMethod === 'SMS' || profile.annualReportDueReminderMethod === 'Phone Call') && (
                                <div>
                                  <Label htmlFor="annualReportDueReminderPhones">Phone Numbers (comma-separated)</Label>
                                  <Textarea
                                    id="annualReportDueReminderPhones"
                                    value={profile.annualReportDueReminderPhones || ''}
                                    onChange={(e) => handleFieldChange('annualReportDueReminderPhones', e.target.value)}
                                    placeholder="+1234567890, +0987654321"
                                    rows={3}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Enter phone numbers with country code, separated by commas</p>
                                </div>
                              )}

                              {profile.annualReportDueReminderMethod && (
                                <>
                                  <div>
                                    <Label htmlFor="annualReportDueReminderDate">Reminder Date</Label>
                                    <Input
                                      id="annualReportDueReminderDate"
                                      type="date"
                                      value={profile.annualReportDueReminderDate || ''}
                                      onChange={(e) => handleFieldChange('annualReportDueReminderDate', e.target.value)}
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="annualReportDueReminderFrequency">Frequency</Label>
                                    <Select 
                                      value={profile.annualReportDueReminderFrequency || ''} 
                                      onValueChange={(value) => handleFieldChange('annualReportDueReminderFrequency', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="How often to remind" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Once">Once</SelectItem>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                                        <SelectItem value="Yearly">Yearly</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor="annualReportDueReminderLeadDays">Lead Time (days before)</Label>
                                    <Input
                                      id="annualReportDueReminderLeadDays"
                                      type="number"
                                      min="0"
                                      value={profile.annualReportDueReminderLeadDays || ''}
                                      onChange={(e) => handleFieldChange('annualReportDueReminderLeadDays', parseInt(e.target.value) || 0)}
                                      placeholder="e.g., 30 days before filing date"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">How many days before the due date to send reminder</p>
                                  </div>

                                  <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setAnnualReportDueReminderDialogOpen(false)}>
                                      Close
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building className="text-gray-500" size={20} />
                        <div className="flex-1">
                          <Label htmlFor="businessFilingExpiry" className="text-sm">Business Filing Expiry:</Label>
                          <Input
                            id="businessFilingExpiry"
                            type="date"
                            value={profile.businessFilingExpiry || profile.business_filing_expiry || ''}
                            onChange={(e) => handleFieldChange('businessFilingExpiry', e.target.value)}
                            className="mt-1"
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="ml-8">
                        <Label className="text-xs text-gray-600 mb-1 block">Reminder Settings</Label>
                        <Dialog open={businessFilingExpiryReminderDialogOpen} onOpenChange={setBusinessFilingExpiryReminderDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                              {profile.businessFilingExpiryReminderMethod ? (
                                <span className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">{profile.businessFilingExpiryReminderMethod}</Badge>
                                  {profile.businessFilingExpiryReminderDate && <span className="text-xs text-gray-500">• {new Date(profile.businessFilingExpiryReminderDate).toLocaleDateString()}</span>}
                                </span>
                              ) : (
                                <span className="text-gray-500">Configure reminder...</span>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Configure Business Filing Expiry Reminder</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="businessFilingExpiryReminderMethod">Reminder Method</Label>
                                <Select 
                                  value={profile.businessFilingExpiryReminderMethod || ''} 
                                  onValueChange={(value) => handleFieldChange('businessFilingExpiryReminderMethod', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose how to receive reminders" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Email">✉️ Email</SelectItem>
                                    <SelectItem value="SMS">📱 SMS</SelectItem>
                                    <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                                    <SelectItem value="This App">📲 This App</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {profile.businessFilingExpiryReminderMethod === 'Email' && (
                                <div>
                                  <Label htmlFor="businessFilingExpiryReminderEmails">Email Addresses (comma-separated)</Label>
                                  <Textarea
                                    id="businessFilingExpiryReminderEmails"
                                    value={profile.businessFilingExpiryReminderEmails || ''}
                                    onChange={(e) => handleFieldChange('businessFilingExpiryReminderEmails', e.target.value)}
                                    placeholder="email1@example.com, email2@example.com"
                                    rows={3}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Enter multiple email addresses separated by commas</p>
                                </div>
                              )}

                              {(profile.businessFilingExpiryReminderMethod === 'SMS' || profile.businessFilingExpiryReminderMethod === 'Phone Call') && (
                                <div>
                                  <Label htmlFor="businessFilingExpiryReminderPhones">Phone Numbers (comma-separated)</Label>
                                  <Textarea
                                    id="businessFilingExpiryReminderPhones"
                                    value={profile.businessFilingExpiryReminderPhones || ''}
                                    onChange={(e) => handleFieldChange('businessFilingExpiryReminderPhones', e.target.value)}
                                    placeholder="+1234567890, +0987654321"
                                    rows={3}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Enter phone numbers with country code, separated by commas</p>
                                </div>
                              )}

                              {profile.businessFilingExpiryReminderMethod && (
                                <>
                                  <div>
                                    <Label htmlFor="businessFilingExpiryReminderDate">Reminder Date</Label>
                                    <Input
                                      id="businessFilingExpiryReminderDate"
                                      type="date"
                                      value={profile.businessFilingExpiryReminderDate || ''}
                                      onChange={(e) => handleFieldChange('businessFilingExpiryReminderDate', e.target.value)}
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="businessFilingExpiryReminderFrequency">Frequency</Label>
                                    <Select 
                                      value={profile.businessFilingExpiryReminderFrequency || ''} 
                                      onValueChange={(value) => handleFieldChange('businessFilingExpiryReminderFrequency', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="How often to remind" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Once">Once</SelectItem>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                                        <SelectItem value="Yearly">Yearly</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor="businessFilingExpiryReminderLeadDays">Lead Time (days before)</Label>
                                    <Input
                                      id="businessFilingExpiryReminderLeadDays"
                                      type="number"
                                      min="0"
                                      value={profile.businessFilingExpiryReminderLeadDays || ''}
                                      onChange={(e) => handleFieldChange('businessFilingExpiryReminderLeadDays', parseInt(e.target.value) || 0)}
                                      placeholder="e.g., 30 days before expiry date"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">How many days before the expiry date to send reminder</p>
                                  </div>

                                  <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setBusinessFilingExpiryReminderDialogOpen(false)}>
                                      Close
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Deadlines */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-green-600" size={20} />
                    <h5 className="text-lg font-semibold text-green-700">Tax Deadlines</h5>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-gray-500" size={20} />
                        <div className="flex-1">
                          <Label htmlFor="annualTaxFiling" className="text-sm">Annual Tax Filing:</Label>
                          <Input
                            id="annualTaxFiling"
                            type="date"
                            value={profile.annualTaxFiling || profile.annual_tax_filing || ''}
                            onChange={(e) => handleFieldChange('annualTaxFiling', e.target.value)}
                            className="mt-1"
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="ml-8">
                        <Label className="text-xs text-gray-600 mb-1 block">Reminder Settings</Label>
                        <Dialog open={annualTaxFilingReminderDialogOpen} onOpenChange={setAnnualTaxFilingReminderDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                              {profile.annualTaxFilingReminderMethod ? (
                                <span className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">{profile.annualTaxFilingReminderMethod}</Badge>
                                  {profile.annualTaxFilingReminderDate && <span className="text-xs text-gray-500">• {new Date(profile.annualTaxFilingReminderDate).toLocaleDateString()}</span>}
                                </span>
                              ) : (
                                <span className="text-gray-500">Configure reminder...</span>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Configure Annual Tax Filing Reminder</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="annualTaxFilingReminderMethod">Reminder Method</Label>
                                <Select 
                                  value={profile.annualTaxFilingReminderMethod || ''} 
                                  onValueChange={(value) => handleFieldChange('annualTaxFilingReminderMethod', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose how to receive reminders" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Email">✉️ Email</SelectItem>
                                    <SelectItem value="SMS">📱 SMS</SelectItem>
                                    <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                                    <SelectItem value="This App">📲 This App</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {profile.annualTaxFilingReminderMethod === 'Email' && (
                                <div>
                                  <Label htmlFor="annualTaxFilingReminderEmails">Email Addresses (comma-separated)</Label>
                                  <Textarea
                                    id="annualTaxFilingReminderEmails"
                                    value={profile.annualTaxFilingReminderEmails || ''}
                                    onChange={(e) => handleFieldChange('annualTaxFilingReminderEmails', e.target.value)}
                                    placeholder="email1@example.com, email2@example.com"
                                    rows={3}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Enter multiple email addresses separated by commas</p>
                                </div>
                              )}

                              {(profile.annualTaxFilingReminderMethod === 'SMS' || profile.annualTaxFilingReminderMethod === 'Phone Call') && (
                                <div>
                                  <Label htmlFor="annualTaxFilingReminderPhones">Phone Numbers (comma-separated)</Label>
                                  <Textarea
                                    id="annualTaxFilingReminderPhones"
                                    value={profile.annualTaxFilingReminderPhones || ''}
                                    onChange={(e) => handleFieldChange('annualTaxFilingReminderPhones', e.target.value)}
                                    placeholder="+1234567890, +0987654321"
                                    rows={3}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Enter phone numbers with country code, separated by commas</p>
                                </div>
                              )}

                              {profile.annualTaxFilingReminderMethod && (
                                <>
                                  <div>
                                    <Label htmlFor="annualTaxFilingReminderDate">Reminder Date</Label>
                                    <Input
                                      id="annualTaxFilingReminderDate"
                                      type="date"
                                      value={profile.annualTaxFilingReminderDate || ''}
                                      onChange={(e) => handleFieldChange('annualTaxFilingReminderDate', e.target.value)}
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="annualTaxFilingReminderFrequency">Frequency</Label>
                                    <Select 
                                      value={profile.annualTaxFilingReminderFrequency || ''} 
                                      onValueChange={(value) => handleFieldChange('annualTaxFilingReminderFrequency', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="How often to remind" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Once">Once</SelectItem>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                                        <SelectItem value="Yearly">Yearly</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor="annualTaxFilingReminderLeadDays">Lead Time (days before)</Label>
                                    <Input
                                      id="annualTaxFilingReminderLeadDays"
                                      type="number"
                                      min="0"
                                      value={profile.annualTaxFilingReminderLeadDays || ''}
                                      onChange={(e) => handleFieldChange('annualTaxFilingReminderLeadDays', parseInt(e.target.value) || 0)}
                                      placeholder="e.g., 30 days before filing date"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">How many days before the filing date to send reminder</p>
                                  </div>

                                  <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setAnnualTaxFilingReminderDialogOpen(false)}>
                                      Close
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="text-md font-medium text-slate-600 mb-3">Quarterly Deadlines</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Q1 Tax Due */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <DollarSign className="text-gray-500" size={18} />
                          <div className="flex-1">
                            <Label htmlFor="q1TaxDue" className="text-sm">Q1 Tax Due:</Label>
                            <Input
                              id="q1TaxDue"
                              type="date"
                              value={profile.q1TaxDue || profile.q1_tax_due || ''}
                              onChange={(e) => handleFieldChange('q1TaxDue', e.target.value)}
                              className="mt-1"
                              placeholder=""
                            />
                          </div>
                        </div>
                        <div className="ml-7">
                          <Label className="text-xs text-gray-600 mb-1 block">Reminder Settings</Label>
                          <Dialog open={q1TaxDueReminderDialogOpen} onOpenChange={setQ1TaxDueReminderDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full h-9 justify-start text-left font-normal text-xs">
                                {profile.q1TaxDueReminderMethod ? (
                                  <span className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">{profile.q1TaxDueReminderMethod}</Badge>
                                    {profile.q1TaxDueReminderDate && <span className="text-xs text-gray-500">• {new Date(profile.q1TaxDueReminderDate).toLocaleDateString()}</span>}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">Configure reminder...</span>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Configure Q1 Tax Due Reminder</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label htmlFor="q1TaxDueReminderMethod">Reminder Method</Label>
                                  <Select 
                                    value={profile.q1TaxDueReminderMethod || ''} 
                                    onValueChange={(value) => handleFieldChange('q1TaxDueReminderMethod', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose how to receive reminders" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Email">✉️ Email</SelectItem>
                                      <SelectItem value="SMS">📱 SMS</SelectItem>
                                      <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                                      <SelectItem value="This App">📲 This App</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {profile.q1TaxDueReminderMethod === 'Email' && (
                                  <div>
                                    <Label htmlFor="q1TaxDueReminderEmails">Email Addresses (comma-separated)</Label>
                                    <Textarea
                                      id="q1TaxDueReminderEmails"
                                      value={profile.q1TaxDueReminderEmails || ''}
                                      onChange={(e) => handleFieldChange('q1TaxDueReminderEmails', e.target.value)}
                                      placeholder="email1@example.com, email2@example.com"
                                      rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter multiple email addresses separated by commas</p>
                                  </div>
                                )}

                                {(profile.q1TaxDueReminderMethod === 'SMS' || profile.q1TaxDueReminderMethod === 'Phone Call') && (
                                  <div>
                                    <Label htmlFor="q1TaxDueReminderPhones">Phone Numbers (comma-separated)</Label>
                                    <Textarea
                                      id="q1TaxDueReminderPhones"
                                      value={profile.q1TaxDueReminderPhones || ''}
                                      onChange={(e) => handleFieldChange('q1TaxDueReminderPhones', e.target.value)}
                                      placeholder="+1234567890, +0987654321"
                                      rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter phone numbers with country code, separated by commas</p>
                                  </div>
                                )}

                                {profile.q1TaxDueReminderMethod && (
                                  <>
                                    <div>
                                      <Label htmlFor="q1TaxDueReminderDate">Reminder Date</Label>
                                      <Input
                                        id="q1TaxDueReminderDate"
                                        type="date"
                                        value={profile.q1TaxDueReminderDate || ''}
                                        onChange={(e) => handleFieldChange('q1TaxDueReminderDate', e.target.value)}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="q1TaxDueReminderFrequency">Frequency</Label>
                                      <Select 
                                        value={profile.q1TaxDueReminderFrequency || ''} 
                                        onValueChange={(value) => handleFieldChange('q1TaxDueReminderFrequency', value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="How often to remind" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Once">Once</SelectItem>
                                          <SelectItem value="Daily">Daily</SelectItem>
                                          <SelectItem value="Weekly">Weekly</SelectItem>
                                          <SelectItem value="Monthly">Monthly</SelectItem>
                                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                                          <SelectItem value="Yearly">Yearly</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <Label htmlFor="q1TaxDueReminderLeadDays">Lead Time (days before)</Label>
                                      <Input
                                        id="q1TaxDueReminderLeadDays"
                                        type="number"
                                        min="0"
                                        value={profile.q1TaxDueReminderLeadDays || ''}
                                        onChange={(e) => handleFieldChange('q1TaxDueReminderLeadDays', parseInt(e.target.value) || 0)}
                                        placeholder="e.g., 14 days before due date"
                                      />
                                      <p className="text-xs text-gray-500 mt-1">How many days before the due date to send reminder</p>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                      <Button variant="outline" onClick={() => setQ1TaxDueReminderDialogOpen(false)}>
                                        Close
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      
                      {/* Q2 Tax Due */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <DollarSign className="text-gray-500" size={18} />
                          <div className="flex-1">
                            <Label htmlFor="q2TaxDue" className="text-sm">Q2 Tax Due:</Label>
                            <Input
                              id="q2TaxDue"
                              type="date"
                              value={profile.q2TaxDue || profile.q2_tax_due || ''}
                              onChange={(e) => handleFieldChange('q2TaxDue', e.target.value)}
                              className="mt-1"
                              placeholder=""
                            />
                          </div>
                        </div>
                        <div className="ml-7">
                          <Label className="text-xs text-gray-600 mb-1 block">Reminder Settings</Label>
                          <Dialog open={q2TaxDueReminderDialogOpen} onOpenChange={setQ2TaxDueReminderDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full h-9 justify-start text-left font-normal text-xs">
                                {profile.q2TaxDueReminderMethod ? (
                                  <span className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">{profile.q2TaxDueReminderMethod}</Badge>
                                    {profile.q2TaxDueReminderDate && <span className="text-xs text-gray-500">• {new Date(profile.q2TaxDueReminderDate).toLocaleDateString()}</span>}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">Configure reminder...</span>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Configure Q2 Tax Due Reminder</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label htmlFor="q2TaxDueReminderMethod">Reminder Method</Label>
                                  <Select 
                                    value={profile.q2TaxDueReminderMethod || ''} 
                                    onValueChange={(value) => handleFieldChange('q2TaxDueReminderMethod', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose how to receive reminders" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Email">✉️ Email</SelectItem>
                                      <SelectItem value="SMS">📱 SMS</SelectItem>
                                      <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                                      <SelectItem value="This App">📲 This App</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {profile.q2TaxDueReminderMethod === 'Email' && (
                                  <div>
                                    <Label htmlFor="q2TaxDueReminderEmails">Email Addresses (comma-separated)</Label>
                                    <Textarea
                                      id="q2TaxDueReminderEmails"
                                      value={profile.q2TaxDueReminderEmails || ''}
                                      onChange={(e) => handleFieldChange('q2TaxDueReminderEmails', e.target.value)}
                                      placeholder="email1@example.com, email2@example.com"
                                      rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter multiple email addresses separated by commas</p>
                                  </div>
                                )}

                                {(profile.q2TaxDueReminderMethod === 'SMS' || profile.q2TaxDueReminderMethod === 'Phone Call') && (
                                  <div>
                                    <Label htmlFor="q2TaxDueReminderPhones">Phone Numbers (comma-separated)</Label>
                                    <Textarea
                                      id="q2TaxDueReminderPhones"
                                      value={profile.q2TaxDueReminderPhones || ''}
                                      onChange={(e) => handleFieldChange('q2TaxDueReminderPhones', e.target.value)}
                                      placeholder="+1234567890, +0987654321"
                                      rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter phone numbers with country code, separated by commas</p>
                                  </div>
                                )}

                                {profile.q2TaxDueReminderMethod && (
                                  <>
                                    <div>
                                      <Label htmlFor="q2TaxDueReminderDate">Reminder Date</Label>
                                      <Input
                                        id="q2TaxDueReminderDate"
                                        type="date"
                                        value={profile.q2TaxDueReminderDate || ''}
                                        onChange={(e) => handleFieldChange('q2TaxDueReminderDate', e.target.value)}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="q2TaxDueReminderFrequency">Frequency</Label>
                                      <Select 
                                        value={profile.q2TaxDueReminderFrequency || ''} 
                                        onValueChange={(value) => handleFieldChange('q2TaxDueReminderFrequency', value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="How often to remind" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Once">Once</SelectItem>
                                          <SelectItem value="Daily">Daily</SelectItem>
                                          <SelectItem value="Weekly">Weekly</SelectItem>
                                          <SelectItem value="Monthly">Monthly</SelectItem>
                                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                                          <SelectItem value="Yearly">Yearly</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <Label htmlFor="q2TaxDueReminderLeadDays">Lead Time (days before)</Label>
                                      <Input
                                        id="q2TaxDueReminderLeadDays"
                                        type="number"
                                        min="0"
                                        value={profile.q2TaxDueReminderLeadDays || ''}
                                        onChange={(e) => handleFieldChange('q2TaxDueReminderLeadDays', parseInt(e.target.value) || 0)}
                                        placeholder="e.g., 14 days before due date"
                                      />
                                      <p className="text-xs text-gray-500 mt-1">How many days before the due date to send reminder</p>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                      <Button variant="outline" onClick={() => setQ2TaxDueReminderDialogOpen(false)}>
                                        Close
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      
                      {/* Q3 Tax Due */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <DollarSign className="text-gray-500" size={18} />
                          <div className="flex-1">
                            <Label htmlFor="q3TaxDue" className="text-sm">Q3 Tax Due:</Label>
                            <Input
                              id="q3TaxDue"
                              type="date"
                              value={profile.q3TaxDue || profile.q3_tax_due || ''}
                              onChange={(e) => handleFieldChange('q3TaxDue', e.target.value)}
                              className="mt-1"
                              placeholder=""
                            />
                          </div>
                        </div>
                        <div className="ml-7">
                          <Label className="text-xs text-gray-600 mb-1 block">Reminder Settings</Label>
                          <Dialog open={q3TaxDueReminderDialogOpen} onOpenChange={setQ3TaxDueReminderDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full h-9 justify-start text-left font-normal text-xs">
                                {profile.q3TaxDueReminderMethod ? (
                                  <span className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">{profile.q3TaxDueReminderMethod}</Badge>
                                    {profile.q3TaxDueReminderDate && <span className="text-xs text-gray-500">• {new Date(profile.q3TaxDueReminderDate).toLocaleDateString()}</span>}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">Configure reminder...</span>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Configure Q3 Tax Due Reminder</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label htmlFor="q3TaxDueReminderMethod">Reminder Method</Label>
                                  <Select 
                                    value={profile.q3TaxDueReminderMethod || ''} 
                                    onValueChange={(value) => handleFieldChange('q3TaxDueReminderMethod', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose how to receive reminders" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Email">✉️ Email</SelectItem>
                                      <SelectItem value="SMS">📱 SMS</SelectItem>
                                      <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                                      <SelectItem value="This App">📲 This App</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {profile.q3TaxDueReminderMethod === 'Email' && (
                                  <div>
                                    <Label htmlFor="q3TaxDueReminderEmails">Email Addresses (comma-separated)</Label>
                                    <Textarea
                                      id="q3TaxDueReminderEmails"
                                      value={profile.q3TaxDueReminderEmails || ''}
                                      onChange={(e) => handleFieldChange('q3TaxDueReminderEmails', e.target.value)}
                                      placeholder="email1@example.com, email2@example.com"
                                      rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter multiple email addresses separated by commas</p>
                                  </div>
                                )}

                                {(profile.q3TaxDueReminderMethod === 'SMS' || profile.q3TaxDueReminderMethod === 'Phone Call') && (
                                  <div>
                                    <Label htmlFor="q3TaxDueReminderPhones">Phone Numbers (comma-separated)</Label>
                                    <Textarea
                                      id="q3TaxDueReminderPhones"
                                      value={profile.q3TaxDueReminderPhones || ''}
                                      onChange={(e) => handleFieldChange('q3TaxDueReminderPhones', e.target.value)}
                                      placeholder="+1234567890, +0987654321"
                                      rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter phone numbers with country code, separated by commas</p>
                                  </div>
                                )}

                                {profile.q3TaxDueReminderMethod && (
                                  <>
                                    <div>
                                      <Label htmlFor="q3TaxDueReminderDate">Reminder Date</Label>
                                      <Input
                                        id="q3TaxDueReminderDate"
                                        type="date"
                                        value={profile.q3TaxDueReminderDate || ''}
                                        onChange={(e) => handleFieldChange('q3TaxDueReminderDate', e.target.value)}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="q3TaxDueReminderFrequency">Frequency</Label>
                                      <Select 
                                        value={profile.q3TaxDueReminderFrequency || ''} 
                                        onValueChange={(value) => handleFieldChange('q3TaxDueReminderFrequency', value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="How often to remind" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Once">Once</SelectItem>
                                          <SelectItem value="Daily">Daily</SelectItem>
                                          <SelectItem value="Weekly">Weekly</SelectItem>
                                          <SelectItem value="Monthly">Monthly</SelectItem>
                                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                                          <SelectItem value="Yearly">Yearly</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <Label htmlFor="q3TaxDueReminderLeadDays">Lead Time (days before)</Label>
                                      <Input
                                        id="q3TaxDueReminderLeadDays"
                                        type="number"
                                        min="0"
                                        value={profile.q3TaxDueReminderLeadDays || ''}
                                        onChange={(e) => handleFieldChange('q3TaxDueReminderLeadDays', parseInt(e.target.value) || 0)}
                                        placeholder="e.g., 14 days before due date"
                                      />
                                      <p className="text-xs text-gray-500 mt-1">How many days before the due date to send reminder</p>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                      <Button variant="outline" onClick={() => setQ3TaxDueReminderDialogOpen(false)}>
                                        Close
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      
                      {/* Q4 Tax Due */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <DollarSign className="text-gray-500" size={18} />
                          <div className="flex-1">
                            <Label htmlFor="q4TaxDue" className="text-sm">Q4 Tax Due:</Label>
                            <Input
                              id="q4TaxDue"
                              type="date"
                              value={profile.q4TaxDue || profile.q4_tax_due || ''}
                              onChange={(e) => handleFieldChange('q4TaxDue', e.target.value)}
                              className="mt-1"
                              placeholder=""
                            />
                          </div>
                        </div>
                        <div className="ml-7">
                          <Label className="text-xs text-gray-600 mb-1 block">Reminder Settings</Label>
                          <Dialog open={q4TaxDueReminderDialogOpen} onOpenChange={setQ4TaxDueReminderDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full h-9 justify-start text-left font-normal text-xs">
                                {profile.q4TaxDueReminderMethod ? (
                                  <span className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">{profile.q4TaxDueReminderMethod}</Badge>
                                    {profile.q4TaxDueReminderDate && <span className="text-xs text-gray-500">• {new Date(profile.q4TaxDueReminderDate).toLocaleDateString()}</span>}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">Configure reminder...</span>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Configure Q4 Tax Due Reminder</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label htmlFor="q4TaxDueReminderMethod">Reminder Method</Label>
                                  <Select 
                                    value={profile.q4TaxDueReminderMethod || ''} 
                                    onValueChange={(value) => handleFieldChange('q4TaxDueReminderMethod', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose how to receive reminders" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Email">✉️ Email</SelectItem>
                                      <SelectItem value="SMS">📱 SMS</SelectItem>
                                      <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                                      <SelectItem value="This App">📲 This App</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {profile.q4TaxDueReminderMethod === 'Email' && (
                                  <div>
                                    <Label htmlFor="q4TaxDueReminderEmails">Email Addresses (comma-separated)</Label>
                                    <Textarea
                                      id="q4TaxDueReminderEmails"
                                      value={profile.q4TaxDueReminderEmails || ''}
                                      onChange={(e) => handleFieldChange('q4TaxDueReminderEmails', e.target.value)}
                                      placeholder="email1@example.com, email2@example.com"
                                      rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter multiple email addresses separated by commas</p>
                                  </div>
                                )}

                                {(profile.q4TaxDueReminderMethod === 'SMS' || profile.q4TaxDueReminderMethod === 'Phone Call') && (
                                  <div>
                                    <Label htmlFor="q4TaxDueReminderPhones">Phone Numbers (comma-separated)</Label>
                                    <Textarea
                                      id="q4TaxDueReminderPhones"
                                      value={profile.q4TaxDueReminderPhones || ''}
                                      onChange={(e) => handleFieldChange('q4TaxDueReminderPhones', e.target.value)}
                                      placeholder="+1234567890, +0987654321"
                                      rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter phone numbers with country code, separated by commas</p>
                                  </div>
                                )}

                                {profile.q4TaxDueReminderMethod && (
                                  <>
                                    <div>
                                      <Label htmlFor="q4TaxDueReminderDate">Reminder Date</Label>
                                      <Input
                                        id="q4TaxDueReminderDate"
                                        type="date"
                                        value={profile.q4TaxDueReminderDate || ''}
                                        onChange={(e) => handleFieldChange('q4TaxDueReminderDate', e.target.value)}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="q4TaxDueReminderFrequency">Frequency</Label>
                                      <Select 
                                        value={profile.q4TaxDueReminderFrequency || ''} 
                                        onValueChange={(value) => handleFieldChange('q4TaxDueReminderFrequency', value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="How often to remind" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Once">Once</SelectItem>
                                          <SelectItem value="Daily">Daily</SelectItem>
                                          <SelectItem value="Weekly">Weekly</SelectItem>
                                          <SelectItem value="Monthly">Monthly</SelectItem>
                                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                                          <SelectItem value="Yearly">Yearly</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <Label htmlFor="q4TaxDueReminderLeadDays">Lead Time (days before)</Label>
                                      <Input
                                        id="q4TaxDueReminderLeadDays"
                                        type="number"
                                        min="0"
                                        value={profile.q4TaxDueReminderLeadDays || ''}
                                        onChange={(e) => handleFieldChange('q4TaxDueReminderLeadDays', parseInt(e.target.value) || 0)}
                                        placeholder="e.g., 14 days before due date"
                                      />
                                      <p className="text-xs text-gray-500 mt-1">How many days before the due date to send reminder</p>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                      <Button variant="outline" onClick={() => setQ4TaxDueReminderDialogOpen(false)}>
                                        Close
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Tax Permit Section */}
                <div className="border-b pb-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-4">Sales Tax Permit</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="salesTaxPermit">Sales Tax Permit Number</Label>
                      <Input
                        id="salesTaxPermit"
                        value={profile.salesTaxPermit || profile.sales_tax_permit || ''}
                        onChange={(e) => handleFieldChange('salesTaxPermit', e.target.value)}
                        placeholder="Permit number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salesTaxPermitStatus">Permit Status</Label>
                      <Select 
                        value={profile.salesTaxPermitStatus || profile.sales_tax_permit_status || ''} 
                        onValueChange={(value) => handleFieldChange('salesTaxPermitStatus', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                          <SelectItem value="Not Required">Not Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="salesTaxPermitExpirationDate">Permit Expiration Date</Label>
                      <Input
                        id="salesTaxPermitExpirationDate"
                        type="date"
                        value={profile.salesTaxPermitExpirationDate || profile.sales_tax_permit_expiration_date || ''}
                        onChange={(e) => handleFieldChange('salesTaxPermitExpirationDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="taxNotes">Notes</Label>
                  <Textarea
                    id="taxNotes"
                    value={profile.taxNotes || ''}
                    onChange={(e) => handleFieldChange('taxNotes', e.target.value)}
                    placeholder="Add notes for tax information..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <File className="text-purple-600" size={20} />
                  <h4 className="text-base font-semibold text-purple-700">Business Documents</h4>
                </div>

                {/* Logo Upload Section */}
                <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎨</span>
                    <div>
                      <h5 className="font-semibold text-blue-900 dark:text-blue-100">Business Logo</h5>
                      <p className="text-sm text-blue-600 dark:text-blue-300">Upload your company logo</p>
                    </div>
                  </div>

                  {profile.logoUrl ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-md">
                        <div className="flex items-center gap-4">
                          <img 
                            src={profile.logoUrl} 
                            alt="Business Logo" 
                            className="h-20 w-20 object-contain rounded border border-gray-200 dark:border-gray-700"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-gray-100">Logo uploaded</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Click to view full size or replace
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(profile.logoUrl, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Full Size
                        </Button>
                        <input
                          type="file"
                          id="logo-replace-upload"
                          className="hidden"
                          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            try {
                              const response = await uploadFiles(`/api/business-entities/${profile.id}/logo`, [file], 'logo');
                              
                              if (response.ok) {
                                const data = await response.json();
                                handleFieldChange('logoUrl', data.logoUrl);
                                toast({
                                  title: "Logo updated successfully!",
                                  description: "Your business logo has been updated",
                                });
                              } else {
                                toast({
                                  title: "Upload failed",
                                  description: "Please try again",
                                  variant: "destructive"
                                });
                              }
                            } catch (error) {
                              console.error('Logo upload error:', error);
                              toast({
                                title: "Upload error",
                                description: "Something went wrong",
                                variant: "destructive"
                              });
                            }
                            
                            e.target.value = '';
                          }}
                        />
                        <label htmlFor="logo-replace-upload" className="flex-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            type="button"
                            asChild
                          >
                            <span className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-1" />
                              Replace Logo
                            </span>
                          </Button>
                        </label>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete the logo?')) {
                              try {
                                await apiRequest(`/api/business-entities/${profile.id}/logo`, {
                                  method: 'DELETE'
                                });
                                handleFieldChange('logoUrl', '');
                                toast({
                                  title: "Logo deleted",
                                  description: "Your business logo has been removed",
                                });
                              } catch (error) {
                                toast({
                                  title: "Delete error",
                                  description: "Something went wrong",
                                  variant: "destructive"
                                });
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-6 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-gray-800/50 text-center">
                        <FileX className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">No logo uploaded yet</p>
                        <input
                          type="file"
                          id="logo-upload"
                          className="hidden"
                          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            try {
                              const response = await uploadFiles(`/api/business-entities/${profile.id}/logo`, [file], 'logo');
                              
                              if (response.ok) {
                                const data = await response.json();
                                handleFieldChange('logoUrl', data.logoUrl);
                                toast({
                                  title: "Logo uploaded successfully!",
                                  description: "Your business logo has been added",
                                });
                              } else {
                                toast({
                                  title: "Upload failed",
                                  description: "Please try again",
                                  variant: "destructive"
                                });
                              }
                            } catch (error) {
                              console.error('Logo upload error:', error);
                              toast({
                                title: "Upload error",
                                description: "Something went wrong",
                                variant: "destructive"
                              });
                            }
                            
                            e.target.value = '';
                          }}
                        />
                        <label htmlFor="logo-upload">
                          <Button 
                            variant="default" 
                            size="sm"
                            type="button"
                            asChild
                          >
                            <span className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Logo
                            </span>
                          </Button>
                        </label>
                      </div>
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Supported formats: PNG, JPG, JPEG, SVG, WEBP
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 1, name: "Operating Agreement", category: "Legal", icon: "📝" },
                    { id: 2, name: "Bylaws", category: "Legal", icon: "📃" },
                    { id: 3, name: "Articles of Formation/Incorporation", category: "Formation", icon: "📋" },
                    { id: 4, name: "Certificate of Formation", category: "Legal", icon: "📄" },
                    { id: 5, name: "Certificate of Filing", category: "Formation", icon: "📋" },
                    { id: 6, name: "EIN Letter", category: "Tax", icon: "🏛️" },
                    { id: 7, name: "Business Insurance Policy", category: "Insurance", icon: "🛡️" },
                    { id: 8, name: "Bank Account Documents", category: "Banking", icon: "🏦" },
                    { id: 9, name: "Commercial Vehicle Registration", category: "Vehicles", icon: "🚛" },
                    { id: 10, name: "DOT Authority Documentation", category: "Transportation", icon: "🚚" },
                    { id: 11, name: "Business Plan", category: "Planning", icon: "📊" },
                    { id: 12, name: "Financial Statements", category: "Finance", icon: "💰" },
                    { id: 13, name: "Contracts & Agreements", category: "Legal", icon: "🤝" },
                    { id: 14, name: "Permits & Certifications", category: "Compliance", icon: "✅" },
                    { id: 15, name: "Tax Returns", category: "Tax", icon: "📈" },
                    { id: 16, name: "Custom Document 1", category: "Custom", icon: "📁", isCustom: true, slotNumber: 1 },
                    { id: 17, name: "Custom Document 2", category: "Custom", icon: "📁", isCustom: true, slotNumber: 2 },
                    { id: 18, name: "Custom Document 3", category: "Custom", icon: "📁", isCustom: true, slotNumber: 3 },
                    { id: 19, name: "Custom Document 4", category: "Custom", icon: "📁", isCustom: true, slotNumber: 4 }
                  ].map((documentSlot) => {
                    const existingDoc = businessDocuments.find((doc: any) => 
                      doc.businessEntityId === profile.id && 
                      doc.documentType === documentSlot.name &&
                      doc.status === 'active'
                    );
                    
                    return (
                    <div key={documentSlot.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{documentSlot.icon}</span>
                        <div className="flex-1">
                          {documentSlot.isCustom ? (
                            <input
                              type="text"
                              defaultValue={getCustomDocumentName(documentSlot.slotNumber)}
                              className="font-medium text-gray-900 dark:text-gray-100 bg-transparent border-0 border-b border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none w-full"
                              placeholder="Enter document name..."
                              onBlur={(e) => {
                                const customName = e.target.value.trim();
                                if (customName && customName !== getCustomDocumentName(documentSlot.slotNumber)) {
                                  saveCustomNameMutation.mutate({
                                    slotNumber: documentSlot.slotNumber,
                                    customName
                                  });
                                }
                              }}
                            />
                          ) : (
                            <h5 className="font-medium text-gray-900 dark:text-gray-100">{documentSlot.name}</h5>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400">{documentSlot.category}</p>
                        </div>
                        {existingDoc && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      
                      {existingDoc ? (
                        <div className="space-y-2">
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm">
                              <File className="h-4 w-4" />
                              <span className="font-medium">{existingDoc.documentName}</span>
                            </div>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              Uploaded {new Date(existingDoc.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/business-documents/${existingDoc.id}/view`);
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
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/business-documents/${existingDoc.id}/view`);
                                  if (response.ok) {
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = existingDoc.documentName || `${documentSlot.name}.pdf`;
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
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete ${existingDoc.documentName}?`)) {
                                  try {
                                    await apiRequest(`/api/business-documents/${existingDoc.id}`, {
                                      method: 'DELETE'
                                    });
                                    toast({
                                      title: "Document deleted",
                                      description: `${existingDoc.documentName} has been deleted`,
                                    });
                                    refetchDocuments();
                                  } catch (error) {
                                    toast({
                                      title: "Delete error",
                                      description: "Something went wrong",
                                      variant: "destructive"
                                    });
                                  }
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <input
                              type="file"
                              id={`upload-${documentSlot.id}`}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                
                                try {
                                  const response = await uploadFiles(
                                    '/api/business-documents',
                                    [file],
                                    'file',
                                    {
                                      documentName: documentSlot.name,
                                      documentType: documentSlot.name,
                                      documentCategory: documentSlot.category,
                                      businessEntityId: profile.id.toString(),
                                      notes: `Uploaded via business profile - ${documentSlot.category}`
                                    }
                                  );
                                  
                                  if (response.ok) {
                                    toast({
                                      title: "Document uploaded successfully!",
                                      description: `${documentSlot.name} has been uploaded`,
                                    });
                                    refetchDocuments();
                                  } else {
                                    toast({
                                      title: "Upload failed",
                                      description: "Please try again",
                                      variant: "destructive"
                                    });
                                  }
                                } catch (error) {
                                  console.error('Upload error:', error);
                                  toast({
                                    title: "Upload error",
                                    description: "Something went wrong",
                                    variant: "destructive"
                                  });
                                }
                                
                                e.target.value = '';
                              }}
                            />
                            <label 
                              htmlFor={`upload-${documentSlot.id}`}
                              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 h-8 px-3 py-1 cursor-pointer text-sm"
                            >
                              <Upload className="h-3 w-3" />
                              <span>Replace Document</span>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800/50 text-center">
                            <FileX className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No document uploaded</p>
                            
                            <input
                              type="file"
                              id={`upload-${documentSlot.id}`}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                
                                try {
                                  const response = await uploadFiles(
                                    '/api/business-documents',
                                    [file],
                                    'file',
                                    {
                                      documentName: documentSlot.name,
                                      documentType: documentSlot.name,
                                      documentCategory: documentSlot.category,
                                      businessEntityId: profile.id.toString(),
                                      notes: `Uploaded via business profile - ${documentSlot.category}`
                                    }
                                  );
                                  
                                  if (response.ok) {
                                    toast({
                                      title: "Document uploaded successfully!",
                                      description: `${documentSlot.name} has been uploaded`,
                                    });
                                    refetchDocuments();
                                  } else {
                                    toast({
                                      title: "Upload failed",
                                      description: "Please try again",
                                      variant: "destructive"
                                    });
                                  }
                                } catch (error) {
                                  console.error('Upload error:', error);
                                  toast({
                                    title: "Upload error",
                                    description: "Something went wrong",
                                    variant: "destructive"
                                  });
                                }
                                
                                e.target.value = '';
                              }}
                            />
                            <label 
                              htmlFor={`upload-${documentSlot.id}`}
                              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Upload Document</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="documentsNotes">Notes</Label>
                  <Textarea
                    id="documentsNotes"
                    value={profile.documentsNotes || ''}
                    onChange={(e) => handleFieldChange('documentsNotes', e.target.value)}
                    placeholder="Add notes for business documents..."
                    rows={4}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}