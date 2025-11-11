import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Key,
  Zap,
  Building2
} from "lucide-react";
import { RESPONSIVE_GRIDS, RESPONSIVE_FLEX, TOUCH_FRIENDLY } from "@/lib/responsive-utils";

interface QuickSyncModalProps {
  companies: any[];
  isOpen: boolean;
  onClose: () => void;
}

interface CompanyCredentials {
  companyId: number;
  companyName: string;
  email?: string;
  password?: string;
  enabled: boolean;
}

const apiSupportedCompanies = [
  { name: 'DoorDash', icon: '🚗', color: 'bg-red-500', apiType: 'Developer API' },
  { name: 'Uber', icon: '🚕', color: 'bg-black', apiType: 'Partner API' },
  { name: 'Amazon Flex', icon: '📦', color: 'bg-orange-500', apiType: 'Logistics API' },
];

export default function QuickSyncModal({ companies, isOpen, onClose }: QuickSyncModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [companyCredentials, setCompanyCredentials] = useState<CompanyCredentials[]>([]);
  const [globalCredentials, setGlobalCredentials] = useState({
    doorDashEmail: '',
    doorDashPassword: '',
    uberEmail: '',
    uberPassword: '',
    amazonFlexEmail: '',
    amazonFlexPassword: ''
  });

  // Initialize company credentials when companies change
  useEffect(() => {
    const apiCompanies = companies.filter(company => 
      apiSupportedCompanies.some(supported => 
        company.name?.toLowerCase().includes(supported.name.toLowerCase())
      )
    );

    setCompanyCredentials(apiCompanies.map(company => ({
      companyId: company.id,
      companyName: company.name,
      enabled: true,
      email: '',
      password: ''
    })));
  }, [companies]);

  // Bulk sync mutation
  const bulkSyncMutation = useMutation({
    mutationFn: async (credentials: CompanyCredentials[]) => {
      setSyncStatus('syncing');
      
      const enabledCredentials = credentials.filter(c => c.enabled);
      const results = [];
      
      for (const cred of enabledCredentials) {
        try {
          const response = await fetch(`/api/company-sync/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              companyId: cred.companyId,
              companyName: cred.companyName,
              credentials: {
                email: cred.email || getGlobalEmail(cred.companyName),
                password: cred.password || getGlobalPassword(cred.companyName)
              }
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            results.push({ company: cred.companyName, success: true, data });
          } else {
            results.push({ company: cred.companyName, success: false, error: 'API connection failed' });
          }
        } catch (error) {
          results.push({ company: cred.companyName, success: false, error: (error as Error).message });
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      setSyncStatus('success');
      queryClient.invalidateQueries({ queryKey: ["/api/hired-jobs"] });
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      toast({
        title: "Bulk Sync Complete",
        description: `${successful} companies synced successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      });
    },
    onError: (error) => {
      setSyncStatus('error');
      toast({
        title: "Bulk Sync Failed",
        description: "Unable to complete bulk synchronization. Please check your credentials.",
        variant: "destructive",
      });
    }
  });

  const getGlobalEmail = (companyName: string): string => {
    if (companyName.toLowerCase().includes('doordash')) return globalCredentials.doorDashEmail;
    if (companyName.toLowerCase().includes('uber')) return globalCredentials.uberEmail;
    if (companyName.toLowerCase().includes('amazon')) return globalCredentials.amazonFlexEmail;
    return '';
  };

  const getGlobalPassword = (companyName: string): string => {
    if (companyName.toLowerCase().includes('doordash')) return globalCredentials.doorDashPassword;
    if (companyName.toLowerCase().includes('uber')) return globalCredentials.uberPassword;
    if (companyName.toLowerCase().includes('amazon')) return globalCredentials.amazonFlexPassword;
    return '';
  };

  const getCompanyConfig = (companyName: string) => {
    return apiSupportedCompanies.find(config => 
      companyName.toLowerCase().includes(config.name.toLowerCase())
    ) || { icon: '🏢', color: 'bg-blue-500', apiType: 'API' };
  };

  const handleBulkSync = () => {
    const enabledCompanies = companyCredentials.filter(c => c.enabled);
    
    if (enabledCompanies.length === 0) {
      toast({
        title: "No Companies Selected",
        description: "Please select at least one company to sync.",
        variant: "destructive",
      });
      return;
    }

    // Check if credentials are provided
    const missingCredentials = enabledCompanies.filter(company => {
      const hasEmail = company.email || getGlobalEmail(company.companyName);
      const hasPassword = company.password || getGlobalPassword(company.companyName);
      return !hasEmail || !hasPassword;
    });

    if (missingCredentials.length > 0) {
      toast({
        title: "Missing Credentials",
        description: `Please provide email and password for: ${missingCredentials.map(c => c.companyName).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    bulkSyncMutation.mutate(companyCredentials);
  };

  const updateCredential = (companyId: number, field: string, value: any) => {
    setCompanyCredentials(prev => 
      prev.map(cred => 
        cred.companyId === companyId 
          ? { ...cred, [field]: value }
          : cred
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Zap className="w-8 h-8 mr-3 text-purple-600" />
            Quick Sync Setup
          </DialogTitle>
          <p className="text-gray-600">Connect multiple companies at once for automatic data synchronization</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Global Login Credentials Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2 text-blue-600" />
                Login Credentials (Global Setup)
              </CardTitle>
              <p className="text-sm text-gray-600">Enter your account credentials once to use across all companies</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={RESPONSIVE_GRIDS.threeCol}>
                <div className="space-y-2">
                  <Label className="font-medium text-red-700">DoorDash Account</Label>
                  <Input
                    placeholder="Email..."
                    value={globalCredentials.doorDashEmail}
                    onChange={(e) => setGlobalCredentials(prev => ({...prev, doorDashEmail: e.target.value}))}
                    className={TOUCH_FRIENDLY.input}
                  />
                  <Input
                    type="password"
                    placeholder="Password..."
                    value={globalCredentials.doorDashPassword}
                    onChange={(e) => setGlobalCredentials(prev => ({...prev, doorDashPassword: e.target.value}))}
                    className={TOUCH_FRIENDLY.input}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium text-gray-800">Uber Account</Label>
                  <Input
                    placeholder="Email..."
                    value={globalCredentials.uberEmail}
                    onChange={(e) => setGlobalCredentials(prev => ({...prev, uberEmail: e.target.value}))}
                    className={TOUCH_FRIENDLY.input}
                  />
                  <Input
                    type="password"
                    placeholder="Password..."
                    value={globalCredentials.uberPassword}
                    onChange={(e) => setGlobalCredentials(prev => ({...prev, uberPassword: e.target.value}))}
                    className={TOUCH_FRIENDLY.input}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium text-orange-700">Amazon Flex Account</Label>
                  <Input
                    placeholder="Email..."
                    value={globalCredentials.amazonFlexEmail}
                    onChange={(e) => setGlobalCredentials(prev => ({...prev, amazonFlexEmail: e.target.value}))}
                    className={TOUCH_FRIENDLY.input}
                  />
                  <Input
                    type="password"
                    placeholder="Password..."
                    value={globalCredentials.amazonFlexPassword}
                    onChange={(e) => setGlobalCredentials(prev => ({...prev, amazonFlexPassword: e.target.value}))}
                    className={TOUCH_FRIENDLY.input}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Companies to Sync */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-green-600" />
                Companies ({companyCredentials.filter(c => c.enabled).length} selected)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {companyCredentials.map((company) => {
                const config = getCompanyConfig(company.companyName);
                return (
                  <div key={company.companyId} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 border rounded-lg">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Checkbox
                        checked={company.enabled}
                        onCheckedChange={(checked) => 
                          updateCredential(company.companyId, 'enabled', checked)
                        }
                        className={TOUCH_FRIENDLY.button}
                      />
                      
                      <div className={`w-8 h-8 flex-shrink-0 rounded-lg ${config.color} flex items-center justify-center text-white text-sm`}>
                        {config.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium">{company.companyName}</div>
                        <Badge variant="outline" className="text-xs">{config.apiType}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Input
                        placeholder="Email (optional)"
                        className={`w-full sm:w-40 ${TOUCH_FRIENDLY.input}`}
                        value={company.email}
                        onChange={(e) => 
                          updateCredential(company.companyId, 'email', e.target.value)
                        }
                        disabled={!company.enabled}
                      />
                      <Input
                        type="password"
                        placeholder="Password (optional)"
                        className={`w-full sm:w-40 ${TOUCH_FRIENDLY.input}`}
                        value={company.password}
                        onChange={(e) => 
                          updateCredential(company.companyId, 'password', e.target.value)
                        }
                        disabled={!company.enabled}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t">
          <div className="text-sm text-gray-600">
            {syncStatus === 'syncing' && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Syncing companies...
              </div>
            )}
            {syncStatus === 'success' && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Sync completed successfully
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={onClose}
              className={TOUCH_FRIENDLY.button}
            >
              Close
            </Button>
            <Button 
              onClick={handleBulkSync}
              disabled={syncStatus === 'syncing' || companyCredentials.filter(c => c.enabled).length === 0}
              className={`bg-purple-600 hover:bg-purple-700 ${TOUCH_FRIENDLY.button}`}
            >
              {syncStatus === 'syncing' ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Sync All
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}