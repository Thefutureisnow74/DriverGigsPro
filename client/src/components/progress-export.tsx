import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Share2, 
  Download, 
  Link2, 
  FileText, 
  Database, 
  Car, 
  Briefcase,
  Eye,
  ExternalLink,
  Copy,
  Calendar,
  Users,
  Settings,
  Trash2
} from "lucide-react";
import { RESPONSIVE_GRIDS, RESPONSIVE_FLEX, TOUCH_FRIENDLY, OVERFLOW } from "@/lib/responsive-utils";

interface ExportData {
  id: number;
  title: string;
  exportType: string;
  exportFormat: string;
  isPublic: boolean;
  shareToken: string;
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
}

interface ProgressExportProps {
  completionPercentage: number;
  completedSteps: number[];
  businessData?: any;
}

export function ProgressExport({ completionPercentage, completedSteps, businessData }: ProgressExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportForm, setExportForm] = useState({
    exportType: 'business_formation',
    exportFormat: 'pdf',
    title: 'My Business Formation Progress',
    description: '',
    isPublic: false,
    allowComments: false,
    expiresAt: ''
  });
  const { toast } = useToast();

  // Fetch user's existing exports
  const { data: exports = [], refetch } = useQuery<ExportData[]>({
    queryKey: ['/api/progress/exports'],
    retry: false,
  });

  // Create export mutation
  const createExportMutation = useMutation({
    mutationFn: async (exportData: any) => {
      const response = await fetch('/api/progress/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...exportData,
          businessFormationData: {
            completionPercentage,
            completedSteps,
            businessData
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create export');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Export Created Successfully",
        description: "Your progress has been exported and is ready to share.",
      });
      setIsOpen(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Export Failed",
        description: "Unable to create export. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateExport = () => {
    createExportMutation.mutate(exportForm);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Share link has been copied.",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getExportTypeIcon = (type: string) => {
    switch (type) {
      case 'business_formation': return FileText;
      case 'full_profile': return Database;
      case 'fleet_data': return Car;
      case 'applications': return Briefcase;
      default: return FileText;
    }
  };

  const getExportTypeName = (type: string) => {
    switch (type) {
      case 'business_formation': return 'Business Formation';
      case 'full_profile': return 'Complete Profile';
      case 'fleet_data': return 'Fleet Data';
      case 'applications': return 'Applications';
      default: return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-slate-100 to-gray-100 hover:from-slate-200 hover:to-gray-200 text-slate-700 border-slate-300"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Export & Share Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-slate-600" />
            <span>Export & Share Your Progress</span>
          </DialogTitle>
          <DialogDescription>
            Share your business formation journey with others or export your data for records.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className={`w-full ${RESPONSIVE_GRIDS.twoCol}`}>
            <TabsTrigger value="create" className={TOUCH_FRIENDLY.button}>Create New Export</TabsTrigger>
            <TabsTrigger value="manage" className={TOUCH_FRIENDLY.button}>Manage Exports</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className={RESPONSIVE_GRIDS.twoCol}>
              {/* Export Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Configuration</CardTitle>
                  <CardDescription>Configure what you want to export and share</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="exportType">Export Type</Label>
                    <Select 
                      value={exportForm.exportType} 
                      onValueChange={(value) => setExportForm(prev => ({ ...prev, exportType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business_formation">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Business Formation Progress</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="full_profile">
                          <div className="flex items-center space-x-2">
                            <Database className="w-4 h-4" />
                            <span>Complete Profile</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="fleet_data">
                          <div className="flex items-center space-x-2">
                            <Car className="w-4 h-4" />
                            <span>Fleet Data</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="applications">
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4" />
                            <span>Job Applications</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="exportFormat">Export Format</Label>
                    <Select 
                      value={exportForm.exportFormat} 
                      onValueChange={(value) => setExportForm(prev => ({ ...prev, exportFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                        <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                        <SelectItem value="link">Shareable Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Export Title</Label>
                    <Input
                      id="title"
                      value={exportForm.title}
                      onChange={(e) => setExportForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Give your export a descriptive title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={exportForm.description}
                      onChange={(e) => setExportForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Add a description for your shared progress"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sharing Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sharing Options</CardTitle>
                  <CardDescription>Control who can access your exported data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Public Access</Label>
                      <p className="text-sm text-gray-600">Allow anyone with the link to view</p>
                    </div>
                    <Switch
                      checked={exportForm.isPublic}
                      onCheckedChange={(checked) => setExportForm(prev => ({ ...prev, isPublic: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Allow Comments</Label>
                      <p className="text-sm text-gray-600">Let viewers leave feedback</p>
                    </div>
                    <Switch
                      checked={exportForm.allowComments}
                      onCheckedChange={(checked) => setExportForm(prev => ({ ...prev, allowComments: checked }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                    <Input
                      id="expiresAt"
                      type="datetime-local"
                      value={exportForm.expiresAt}
                      onChange={(e) => setExportForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for permanent sharing</p>
                  </div>

                  {/* Preview Section */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Export Preview</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Type:</strong> {getExportTypeName(exportForm.exportType)}</p>
                      <p><strong>Format:</strong> {exportForm.exportFormat.toUpperCase()}</p>
                      <p><strong>Access:</strong> {exportForm.isPublic ? 'Public' : 'Private'}</p>
                      {exportForm.allowComments && <p><strong>Comments:</strong> Enabled</p>}
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateExport}
                    disabled={createExportMutation.isPending}
                    className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700"
                  >
                    {createExportMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating Export...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Share2 className="w-4 h-4" />
                        <span>Create Export</span>
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Exports</h3>
              <Badge variant="secondary">{exports.length} exports</Badge>
            </div>

            {exports.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600">No Exports Yet</h3>
                  <p className="text-gray-500 mb-4">Create your first export to share your progress</p>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                  >
                    Create Export
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {exports.map((exportItem: ExportData) => {
                  const ExportIcon = getExportTypeIcon(exportItem.exportType);
                  const shareUrl = `${window.location.origin}/shared/${exportItem.shareToken}`;
                  const downloadUrl = `${window.location.origin}/api/progress/download/${exportItem.shareToken}`;

                  return (
                    <Card key={exportItem.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                              <ExportIcon className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{exportItem.title}</h4>
                              <p className="text-sm text-gray-600">
                                {getExportTypeName(exportItem.exportType)} • {exportItem.exportFormat.toUpperCase()}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{exportItem.viewCount} views</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Download className="w-3 h-3" />
                                  <span>{exportItem.downloadCount} downloads</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(exportItem.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {exportItem.isPublic && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Public
                              </Badge>
                            )}
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(shareUrl)}
                                title="Copy share link"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(shareUrl, '_blank')}
                                title="Open shared view"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(downloadUrl, '_blank')}
                                title="Download export"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}