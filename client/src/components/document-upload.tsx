import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Progress component implementation
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Image, 
  Shield, 
  Car, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Trash2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface DocumentUploadProps {
  userId: number;
  compact?: boolean;
}

const REQUIRED_GIG_DOCUMENTS = [
  {
    type: "drivers_license",
    name: "Driver's License",
    description: "Valid government-issued driver's license (both sides)",
    icon: FileText,
    required: true,
    category: "identification"
  },
  {
    type: "insurance",
    name: "Auto Insurance",
    description: "Current vehicle insurance card or policy",
    icon: Shield,
    required: true,
    category: "insurance"
  },
  {
    type: "vehicle_registration",
    name: "Vehicle Registration",
    description: "Current vehicle registration certificate",
    icon: FileText,
    required: true,
    category: "vehicle"
  },
  {
    type: "vehicle_photos",
    name: "Vehicle Photos",
    description: "Photos of your vehicle (front, back, sides, interior)",
    icon: Image,
    required: true,
    category: "vehicle",
    multiple: true
  },
  {
    type: "profile_photo",
    name: "Profile Photo",
    description: "Professional headshot for your driver profile",
    icon: Image,
    required: true,
    category: "identification"
  },
  {
    type: "ssn_card",
    name: "Social Security Card",
    description: "Social Security card or tax document with SSN",
    icon: FileText,
    required: false,
    category: "identification"
  },
  {
    type: "bank_statement",
    name: "Bank Statement",
    description: "Recent bank statement for direct deposit setup",
    icon: CreditCard,
    required: false,
    category: "financial"
  },
  {
    type: "background_check",
    name: "Background Check",
    description: "Background check results (if pre-obtained)",
    icon: FileText,
    required: false,
    category: "verification"
  }
];

export default function DocumentUpload({ userId, compact = false }: DocumentUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents"],
    retry: false
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('userId', userId.toString());
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document deleted",
        description: "Document has been removed successfully.",
      });
    }
  });

  const handleFileUpload = async (file: File, documentType: string) => {
    if (!file) return;

    setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[documentType] || 0;
          if (currentProgress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [documentType]: currentProgress + 10 };
        });
      }, 200);

      // Add document type and metadata to form data
      const formData = new FormData();
      formData.append('document', file);
      formData.append('userId', userId.toString());
      formData.append('type', documentType);
      formData.append('name', file.name);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      await response.json();

      setUploadProgress(prev => ({ ...prev, [documentType]: 100 }));
      
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[documentType];
          return newProgress;
        });
      }, 2000);

      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      
    } catch (error: any) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[documentType];
        return newProgress;
      });
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  const getDocumentStatus = (docType: string) => {
    const userDocs = (documents as any[])?.filter((doc: any) => doc.type === docType) || [];
    const requiredDoc = REQUIRED_GIG_DOCUMENTS.find(d => d.type === docType);
    
    if (userDocs.length === 0) {
      return requiredDoc?.required ? 'missing' : 'optional';
    }
    
    // Check if any document is expired (for time-sensitive docs)
    const hasValidDoc = userDocs.some((doc: any) => {
      if (!doc.expirationDate) return true;
      return new Date(doc.expirationDate) > new Date();
    });
    
    return hasValidDoc ? 'complete' : 'expired';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800 border-green-300';
      case 'expired': return 'bg-red-100 text-red-800 border-red-300';
      case 'missing': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      case 'missing': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const completedDocs = REQUIRED_GIG_DOCUMENTS.filter(doc => getDocumentStatus(doc.type) === 'complete').length;
  const totalRequired = REQUIRED_GIG_DOCUMENTS.filter(doc => doc.required).length;
  const completionPercentage = (completedDocs / REQUIRED_GIG_DOCUMENTS.length) * 100;

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Gig Documents
            </div>
            <Badge variant="outline">
              {completedDocs}/{REQUIRED_GIG_DOCUMENTS.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Document readiness for gig applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Progress</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{completedDocs} completed</span>
              <span>{totalRequired} required</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Document Readiness for Gig Applications
          </CardTitle>
          <CardDescription>
            Upload required documents to be eligible for gig driving opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Overall Progress</span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {completedDocs}/{REQUIRED_GIG_DOCUMENTS.length} Complete
              </Badge>
            </div>
            <Progress value={completionPercentage} className="w-full h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{totalRequired} documents required for most platforms</span>
              <span>{Math.round(completionPercentage)}% ready</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Categories */}
      {['identification', 'vehicle', 'insurance', 'financial', 'verification'].map(category => {
        const categoryDocs = REQUIRED_GIG_DOCUMENTS.filter(doc => doc.category === category);
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center">
                {category === 'identification' && <FileText className="w-5 h-5 mr-2 text-purple-600" />}
                {category === 'vehicle' && <Car className="w-5 h-5 mr-2 text-green-600" />}
                {category === 'insurance' && <Shield className="w-5 h-5 mr-2 text-blue-600" />}
                {category === 'financial' && <CreditCard className="w-5 h-5 mr-2 text-orange-600" />}
                {category === 'verification' && <CheckCircle className="w-5 h-5 mr-2 text-red-600" />}
                {categoryName} Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryDocs.map((docType) => {
                  const status = getDocumentStatus(docType.type);
                  const userDocs = (documents as any[])?.filter((doc: any) => doc.type === docType.type) || [];
                  const Icon = docType.icon;
                  const isUploading = uploadProgress[docType.type] !== undefined;

                  return (
                    <div key={docType.type} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Icon className="w-6 h-6 text-gray-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{docType.name}</h3>
                              {docType.required && (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{docType.description}</p>
                            
                            {/* Upload Progress */}
                            {isUploading && (
                              <div className="space-y-1">
                                <Progress value={uploadProgress[docType.type]} className="w-full h-2" />
                                <p className="text-xs text-blue-600">Uploading... {uploadProgress[docType.type]}%</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getStatusColor(status)}>
                            {getStatusIcon(status)}
                            <span className="ml-1 capitalize">{status}</span>
                          </Badge>
                        </div>
                      </div>

                      {/* Uploaded Documents */}
                      {userDocs.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <h4 className="font-medium text-sm text-gray-700">Uploaded Files:</h4>
                          {userDocs.map((doc: any) => (
                            <div key={doc.id} className="flex items-center justify-between bg-white p-2 rounded border">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{doc.name || doc.filename}</span>
                                {doc.expirationDate && (
                                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>Expires: {new Date(doc.expirationDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMutation.mutate(doc.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Button */}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isUploading}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = docType.type.includes('photo') || docType.type.includes('vehicle') ? 'image/*' : '*/*';
                            input.multiple = docType.multiple || false;
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                handleFileUpload(file, docType.type);
                              }
                            };
                            input.click();
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {userDocs.length > 0 ? 'Replace' : 'Upload'}
                        </Button>
                        
                        {docType.multiple && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isUploading}
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.multiple = true;
                              input.onchange = (e) => {
                                const files = Array.from((e.target as HTMLInputElement).files || []);
                                files.forEach(file => handleFileUpload(file, docType.type));
                              };
                              input.click();
                            }}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Multiple
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}