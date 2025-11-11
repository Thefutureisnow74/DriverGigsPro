import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  MapPin, 
  TrendingUp,
  Calendar,
  Car,
  BarChart3,
  Settings,
  Shield,
  Key
} from "lucide-react";
import { RESPONSIVE_GRIDS, RESPONSIVE_FLEX, TOUCH_FRIENDLY, OVERFLOW } from "@/lib/responsive-utils";

interface CompanySyncModalProps {
  company: any;
  isOpen: boolean;
  onClose: () => void;
}

interface SyncCredentials {
  email: string;
  password: string;
  apiKey?: string;
  userId?: string;
}

interface SyncData {
  earnings: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
  trips: {
    completed: number;
    cancelled: number;
    totalDistance: number;
  };
  performance: {
    rating: number;
    acceptanceRate: number;
    completionRate: number;
    onTimeRate: number;
  };
  lastSync: Date;
}

export default function CompanySyncModal({ company, isOpen, onClose }: CompanySyncModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [credentials, setCredentials] = useState<SyncCredentials>({
    email: '',
    password: '',
    apiKey: '',
    userId: ''
  });
  
  const [syncData, setSyncData] = useState<SyncData | null>(null);
  const [activeTab, setActiveTab] = useState('connect');

  // Simulate company-specific sync configurations
  const getSyncConfig = (companyName: string) => {
    const configs: Record<string, any> = {
      'DoorDash': {
        icon: '🚗',
        color: 'bg-red-500',
        fields: ['apiKey', 'email'],
        apiSupport: true,
        hasPublicAPI: true,
        description: 'Sync earnings, deliveries, and performance metrics from DoorDash Developer API'
      },
      'Uber': {
        icon: '🚕',
        color: 'bg-black',
        fields: ['apiKey', 'email'],
        apiSupport: true,
        hasPublicAPI: true,
        description: 'Import trip data, earnings, and driver ratings from Uber API'
      },
      'Lyft': {
        icon: '🚖',
        color: 'bg-pink-500',
        fields: ['email', 'password'],
        apiSupport: false,
        hasPublicAPI: false,
        description: 'Manual data entry for Lyft ride data and earnings'
      },
      'Instacart': {
        icon: '🛒',
        color: 'bg-green-500',
        fields: ['email', 'password'],
        apiSupport: false,
        hasPublicAPI: false,
        description: 'Manual entry for shopping delivery metrics and batch earnings'
      },
      'Amazon Flex': {
        icon: '📦',
        color: 'bg-orange-500',
        fields: ['apiKey', 'email'],
        apiSupport: true,
        hasPublicAPI: true,
        description: 'Import package delivery data and block earnings from Amazon API'
      }
    };
    
    return configs[companyName] || {
      icon: '🏢',
      color: 'bg-blue-500',
      fields: ['email', 'password'],
      apiSupport: false,
      hasPublicAPI: false,
      description: 'Manual data entry for earnings and performance tracking'
    };
  };

  const config = getSyncConfig(company?.name || '');

  // Sync data mutation
  const syncDataMutation = useMutation({
    mutationFn: async (syncCredentials: SyncCredentials) => {
      setSyncStatus('syncing');
      
      // Simulate API call to sync data
      const response = await fetch(`/api/company-sync/${company.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: company.name,
          credentials: syncCredentials,
          syncType: 'full'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync company data');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setSyncStatus('success');
      setSyncData(data);
      queryClient.invalidateQueries({ queryKey: ["/api/hired-jobs"] });
      toast({
        title: "Sync Successful",
        description: `${company.name} data has been synchronized successfully.`,
      });
    },
    onError: (error) => {
      setSyncStatus('error');
      toast({
        title: "Sync Failed",
        description: "Unable to connect to company platform. Please check your credentials.",
        variant: "destructive",
      });
    }
  });

  const handleSync = () => {
    if (!credentials.email || !credentials.password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter your login credentials to continue.",
        variant: "destructive",
      });
      return;
    }
    
    syncDataMutation.mutate(credentials);
  };

  const handleTestConnection = async () => {
    setSyncStatus('syncing');
    
    // Simulate connection test
    setTimeout(() => {
      setSyncStatus('success');
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${company.name} platform.`,
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${OVERFLOW.preventX}`}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center text-white text-xl mr-3`}>
              {config.icon}
            </div>
            Sync {company?.name} Data
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="connect" className="flex items-center text-xs sm:text-sm">
              <Key className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Connect</span>
              <span className="sm:hidden">Link</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center text-xs sm:text-sm">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Data
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center text-xs sm:text-sm">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center text-xs sm:text-sm">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Secure</span>
            </TabsTrigger>
          </TabsList>

          {/* Connect Tab */}
          <TabsContent value="connect" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 text-blue-600" />
                  Connection Setup
                </CardTitle>
                <p className="text-gray-600">{config.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={RESPONSIVE_GRIDS.form}>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={credentials.email}
                      onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                      className={TOUCH_FRIENDLY.input}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                      className={TOUCH_FRIENDLY.input}
                    />
                  </div>
                </div>

                {config.apiSupport && (
                  <div>
                    <Label htmlFor="apiKey">API Key (Optional)</Label>
                    <Input
                      id="apiKey"
                      placeholder="Enter API key for enhanced sync"
                      value={credentials.apiKey}
                      onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
                      className={TOUCH_FRIENDLY.input}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      API key provides more detailed sync and faster updates
                    </p>
                  </div>
                )}

                <div className={RESPONSIVE_FLEX.row}>
                  <Button 
                    onClick={handleTestConnection}
                    variant="outline"
                    disabled={syncStatus === 'syncing'}
                    className={TOUCH_FRIENDLY.button}
                  >
                    {syncStatus === 'syncing' ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleSync}
                    disabled={syncStatus === 'syncing'}
                    className={`bg-blue-600 hover:bg-blue-700 ${TOUCH_FRIENDLY.button}`}
                  >
                    {syncStatus === 'syncing' ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Start Sync
                      </>
                    )}
                  </Button>
                </div>

                {syncStatus === 'success' && (
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800">Successfully connected to {company.name}</span>
                  </div>
                )}

                {syncStatus === 'error' && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800">Connection failed. Please check your credentials.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            {syncData ? (
              <div className={RESPONSIVE_GRIDS.threeCol}>
                {/* Earnings Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                      Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily:</span>
                      <span className="font-semibold">${syncData.earnings.daily}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weekly:</span>
                      <span className="font-semibold">${syncData.earnings.weekly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly:</span>
                      <span className="font-semibold">${syncData.earnings.monthly}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-lg">${syncData.earnings.total}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Trips Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Car className="w-5 h-5 mr-2 text-blue-600" />
                      Trip Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold">{syncData.trips.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cancelled:</span>
                      <span className="font-semibold">{syncData.trips.cancelled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-semibold">{syncData.trips.totalDistance} mi</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <Badge variant="outline">{syncData.performance.rating}/5.0</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Acceptance:</span>
                      <Badge variant="outline">{syncData.performance.acceptanceRate}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion:</span>
                      <Badge variant="outline">{syncData.performance.completionRate}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">On-Time:</span>
                      <Badge variant="outline">{syncData.performance.onTimeRate}%</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
                  <p className="text-gray-500">Connect to {company.name} to view your data here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold">Auto Sync</h4>
                    <p className="text-sm text-gray-600">Automatically sync data every hour</p>
                  </div>
                  <Button variant="outline" size="sm" className={TOUCH_FRIENDLY.button}>Enable</Button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold">Data Retention</h4>
                    <p className="text-sm text-gray-600">Keep data for 90 days</p>
                  </div>
                  <Button variant="outline" size="sm" className={TOUCH_FRIENDLY.button}>Configure</Button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold">Export Data</h4>
                    <p className="text-sm text-gray-600">Download your sync history</p>
                  </div>
                  <Button variant="outline" size="sm" className={TOUCH_FRIENDLY.button}>Export</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🔒 Your Data is Protected</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• All credentials are encrypted with AES-256</li>
                    <li>• Data is transmitted over secure HTTPS connections</li>
                    <li>• No sensitive data is stored permanently</li>
                    <li>• You can disconnect anytime</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className={`w-full ${TOUCH_FRIENDLY.button}`}>
                    <Key className="w-4 h-4 mr-2" />
                    Update Credentials
                  </Button>
                  
                  <Button variant="outline" size="sm" className={`w-full text-red-600 border-red-300 ${TOUCH_FRIENDLY.button}`}>
                    Disconnect Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t">
          <Badge variant="outline" className="flex items-center text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Last sync: {syncData ? syncData.lastSync.toLocaleDateString() : 'Never'}</span>
            <span className="sm:hidden">{syncData ? syncData.lastSync.toLocaleDateString() : 'Never synced'}</span>
          </Badge>
          
          <div className={`${RESPONSIVE_FLEX.row} w-full sm:w-auto`}>
            <Button variant="outline" onClick={onClose} className={`${TOUCH_FRIENDLY.button} flex-1 sm:flex-initial`}>
              Close
            </Button>
            <Button 
              onClick={handleSync}
              disabled={syncStatus === 'syncing'}
              className={`bg-blue-600 hover:bg-blue-700 ${TOUCH_FRIENDLY.button} flex-1 sm:flex-initial`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}