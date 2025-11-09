import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Shield, 
  Car, 
  Camera, 
  Receipt, 
  CreditCard, 
  FileCheck, 
  UserCheck, 
  Calendar,
  Upload,
  Eye,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building
} from "lucide-react";

const documentCategories = [
  {
    id: "insurance",
    title: "Insurance Documents",
    description: "Auto insurance, commercial coverage, liability",
    icon: Shield,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    documents: [
      { name: "Auto Insurance Policy", status: "active", expiry: "2024-12-15", size: "2.3 MB" },
      { name: "Commercial Liability", status: "expiring", expiry: "2024-01-20", size: "1.8 MB" },
      { name: "Rideshare Endorsement", status: "active", expiry: "2024-12-15", size: "1.2 MB" }
    ]
  },
  {
    id: "registration",
    title: "Vehicle Registration",
    description: "Registration cards, titles, inspection certificates",
    icon: Car,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
    documents: [
      { name: "Vehicle Registration", status: "active", expiry: "2024-06-30", size: "0.8 MB" },
      { name: "Title Certificate", status: "active", expiry: "N/A", size: "1.1 MB" },
      { name: "Inspection Certificate", status: "expired", expiry: "2023-12-01", size: "0.5 MB" }
    ]
  },
  {
    id: "photos",
    title: "Vehicle Photos",
    description: "Profile pictures, vehicle photos, inspection images",
    icon: Camera,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    iconColor: "text-purple-600",
    documents: [
      { name: "Profile Photo", status: "active", expiry: "N/A", size: "0.3 MB" },
      { name: "Vehicle Exterior", status: "active", expiry: "N/A", size: "1.5 MB" },
      { name: "Vehicle Interior", status: "active", expiry: "N/A", size: "1.2 MB" },
      { name: "License Plate", status: "active", expiry: "N/A", size: "0.4 MB" }
    ]
  },
  {
    id: "receipts",
    title: "Expense Receipts",
    description: "Gas, maintenance, parking, tolls, supplies",
    icon: Receipt,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    iconColor: "text-orange-600",
    documents: [
      { name: "Gas Receipts - January", status: "active", expiry: "N/A", size: "15.2 MB" },
      { name: "Maintenance - Oil Change", status: "active", expiry: "N/A", size: "0.7 MB" },
      { name: "Parking Fees", status: "active", expiry: "N/A", size: "3.1 MB" },
      { name: "Toll Receipts", status: "active", expiry: "N/A", size: "2.4 MB" }
    ]
  },
  {
    id: "licenses",
    title: "Driver's License",
    description: "Driver's license, CDL, endorsements",
    icon: CreditCard,
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    iconColor: "text-cyan-600",
    documents: [
      { name: "Driver's License", status: "active", expiry: "2026-03-15", size: "0.6 MB" },
      { name: "CDL Certificate", status: "pending", expiry: "2024-08-20", size: "0.9 MB" }
    ]
  },
  {
    id: "background",
    title: "Background Check",
    description: "Criminal background, driving record, employment",
    icon: UserCheck,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-600",
    documents: [
      { name: "Criminal Background Check", status: "active", expiry: "2024-11-10", size: "1.3 MB" },
      { name: "Driving Record", status: "active", expiry: "2024-09-25", size: "0.8 MB" },
      { name: "Employment History", status: "active", expiry: "N/A", size: "1.1 MB" }
    ]
  },
  {
    id: "tax",
    title: "Tax Documents",
    description: "1099s, W-2s, expense reports, mileage logs",
    icon: FileCheck,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-600",
    documents: [
      { name: "1099-NEC Forms", status: "active", expiry: "N/A", size: "2.1 MB" },
      { name: "Mileage Log 2023", status: "active", expiry: "N/A", size: "4.2 MB" },
      { name: "Business Expense Report", status: "active", expiry: "N/A", size: "6.8 MB" }
    ]
  },
  {
    id: "permits",
    title: "Permits & Licenses",
    description: "Business licenses, permits, certifications",
    icon: FileText,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    iconColor: "text-indigo-600",
    documents: [
      { name: "Business License", status: "active", expiry: "2024-12-31", size: "0.9 MB" },
      { name: "Food Handler's Permit", status: "active", expiry: "2024-07-15", size: "0.4 MB" },
      { name: "Hazmat Certification", status: "expired", expiry: "2023-10-30", size: "0.6 MB" }
    ]
  },
  {
    id: "certificates",
    title: "Certificates and Accomplishments", 
    description: "Training certificates, awards, achievements, recognitions",
    icon: FileCheck,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconColor: "text-emerald-600",
    documents: []
  },
  {
    id: "business",
    title: "Business Documents",
    description: "Articles of formation, EIN letters, business plans, contracts",
    icon: Building,
    color: "from-slate-500 to-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    iconColor: "text-slate-600",
    documents: []
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "expiring":
      return "bg-yellow-100 text-yellow-800";
    case "expired":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-3 w-3" />;
    case "expiring":
      return <Clock className="h-3 w-3" />;
    case "expired":
      return <AlertTriangle className="h-3 w-3" />;
    case "pending":
      return <Clock className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
};

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    documentName: '',
    category: 'certificates',
    file: null as File | null,
    expirationDate: ''
  });

  // Business document upload state
  const [businessUploadForm, setBusinessUploadForm] = useState({
    documentName: '',
    businessEntityId: '',
    documentType: '',
    documentCategory: 'Formation',
    file: null as File | null,
    notes: ''
  });
  
  const [isBusinessUploadOpen, setIsBusinessUploadOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user documents from database
  const { data: userDocuments = [], isLoading } = useQuery({
    queryKey: ['/api/documents'],
  });

  // Fetch business entities for business documents dropdown
  const { data: businessEntities = [] } = useQuery({
    queryKey: ['/api/business-entities'],
  });

  // Fetch business documents
  const { data: businessDocuments = [] } = useQuery({
    queryKey: ['/api/business-documents'],
  });

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      setIsUploadOpen(false);
      setUploadForm({ documentName: '', category: 'certificates', file: null, expirationDate: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
  });

  // Business document upload mutation
  const businessUploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/business-documents', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Business document uploaded successfully",
      });
      setIsBusinessUploadOpen(false);
      setBusinessUploadForm({ 
        documentName: '', 
        businessEntityId: '', 
        documentType: '', 
        documentCategory: 'Formation', 
        file: null, 
        notes: '' 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/business-documents'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload business document",
        variant: "destructive",
      });
    },
  });

  // Delete business document mutation
  const deleteBusinessDocMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const response = await fetch(`/api/business-documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Business document deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/business-documents'] });
    },
  });

  const handleUpload = () => {
    if (!uploadForm.file || !uploadForm.documentName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('documentName', uploadForm.documentName);
    formData.append('category', uploadForm.category);
    if (uploadForm.expirationDate) {
      formData.append('expirationDate', uploadForm.expirationDate);
    }

    uploadMutation.mutate(formData);
  };

  const handleBusinessUpload = () => {
    if (!businessUploadForm.file || !businessUploadForm.documentName || !businessUploadForm.businessEntityId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Business Name, Document Name, and File)",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', businessUploadForm.file);
    formData.append('documentName', businessUploadForm.documentName);
    formData.append('documentType', businessUploadForm.documentType);
    formData.append('documentCategory', businessUploadForm.documentCategory);
    formData.append('businessEntityId', businessUploadForm.businessEntityId);
    if (businessUploadForm.notes) {
      formData.append('notes', businessUploadForm.notes);
    }

    businessUploadMutation.mutate(formData);
  };

  // Update document categories to show real data
  const updateCategoriesWithRealData = (categories: typeof documentCategories) => {
    return categories.map(category => {
      const categoryDocs = userDocuments.filter((doc: any) => doc.type === category.id);
      return {
        ...category,
        documents: categoryDocs.map((doc: any) => ({
          id: doc.id,
          name: doc.filename,
          status: "active", // You can add logic to determine status based on expiration
          expiry: doc.expirationDate ? new Date(doc.expirationDate).toISOString().split('T')[0] : "N/A",
          size: "Unknown" // File size not stored in current schema
        }))
      };
    });
  };

  const updatedCategories = updateCategoriesWithRealData(documentCategories);

  const totalDocuments = updatedCategories.reduce((sum, cat) => sum + cat.documents.length, 0);
  const activeDocuments = updatedCategories.reduce((sum, cat) => 
    sum + cat.documents.filter(doc => doc.status === "active").length, 0
  );
  const expiringDocuments = updatedCategories.reduce((sum, cat) => 
    sum + cat.documents.filter(doc => doc.status === "expiring").length, 0
  );
  const expiredDocuments = updatedCategories.reduce((sum, cat) => 
    sum + cat.documents.filter(doc => doc.status === "expired").length, 0
  );

  const completionPercentage = totalDocuments > 0 ? Math.round((activeDocuments / totalDocuments) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <FileText className="text-blue-600" />
              <span>Document Management</span>
            </h1>
            <p className="text-gray-600 mt-1">Organize and manage all your gig work documents</p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Document Name *</label>
                  <Input 
                    placeholder="Enter document name"
                    value={uploadForm.documentName}
                    onChange={(e) => setUploadForm({...uploadForm, documentName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                  >
                    {documentCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">File *</label>
                  <Input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Expiration Date (Optional)</label>
                  <Input 
                    type="date"
                    value={uploadForm.expirationDate}
                    onChange={(e) => setUploadForm({...uploadForm, expirationDate: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Document Stats */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{activeDocuments}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-yellow-600">{expiringDocuments}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-red-600">{expiredDocuments}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completion Progress */}
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <CardTitle>Document Completion Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-xs text-gray-600">
                {activeDocuments} of {totalDocuments} documents are up to date
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Document Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {updatedCategories.map((category) => {
            const Icon = category.icon;
            const activeCount = category.documents.filter(doc => doc.status === "active").length;
            const totalCount = category.documents.length;
            
            return (
              <Card 
                key={category.id}
                className={`${category.bgColor} ${category.borderColor} border-2 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{category.title}</h3>
                      <p className="text-xs text-gray-600">{category.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Documents</span>
                      <Badge variant="secondary">{totalCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active</span>
                      <Badge className="bg-green-100 text-green-800">{activeCount}</Badge>
                    </div>
                    {category.documents.some(doc => doc.status === "expiring" || doc.status === "expired") && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Needs attention</span>
                        <Badge className="bg-red-100 text-red-800">
                          {category.documents.filter(doc => doc.status === "expiring" || doc.status === "expired").length}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Business Documents Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
            <Building className="text-slate-600" />
            <span>Business Documents</span>
            <Dialog open={isBusinessUploadOpen} onOpenChange={setIsBusinessUploadOpen}>
              <DialogTrigger asChild>
                <Button className="ml-auto bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Business Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Business Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Business Name *</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={businessUploadForm.businessEntityId}
                      onChange={(e) => setBusinessUploadForm({...businessUploadForm, businessEntityId: e.target.value})}
                    >
                      <option value="">Select Business</option>
                      {businessEntities.map((entity: any) => (
                        <option key={entity.id} value={entity.id}>{entity.companyName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Document Name *</label>
                    <Input 
                      placeholder="Enter document name"
                      value={businessUploadForm.documentName}
                      onChange={(e) => setBusinessUploadForm({...businessUploadForm, documentName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Document Type</label>
                    <Input 
                      placeholder="e.g., Articles of Formation, EIN Letter"
                      value={businessUploadForm.documentType}
                      onChange={(e) => setBusinessUploadForm({...businessUploadForm, documentType: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={businessUploadForm.documentCategory}
                      onChange={(e) => setBusinessUploadForm({...businessUploadForm, documentCategory: e.target.value})}
                    >
                      <option value="Formation">Formation</option>
                      <option value="Tax">Tax</option>
                      <option value="Banking">Banking</option>
                      <option value="Legal">Legal</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">File *</label>
                    <Input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setBusinessUploadForm({...businessUploadForm, file: e.target.files?.[0] || null})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <Input 
                      placeholder="Additional notes about the document"
                      value={businessUploadForm.notes}
                      onChange={(e) => setBusinessUploadForm({...businessUploadForm, notes: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsBusinessUploadOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBusinessUpload} disabled={businessUploadMutation.isPending}>
                      {businessUploadMutation.isPending ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </h2>
          
          <Card className="bg-slate-50 border-slate-200 border-2">
            <CardContent className="p-6">
              {businessDocuments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No business documents uploaded yet.</p>
                  <p className="text-sm">Upload your first business document to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {businessDocuments.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-slate-600" />
                          <div>
                            <span className="font-medium">{doc.documentName}</span>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{doc.businessEntity?.companyName}</span>
                              <span>•</span>
                              <span>{doc.documentType}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {doc.documentCategory}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            window.open(`/api/business-documents/${doc.id}/view`, '_blank');
                          }}
                          title="View document"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = `/api/business-documents/${doc.id}/view`;
                            link.download = doc.documentName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          title="Download document"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteBusinessDocMutation.mutate(doc.id)}
                          disabled={deleteBusinessDocMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete document"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Document Details Modal */}
        {selectedCategory && (
          <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {updatedCategories.find(cat => cat.id === selectedCategory)?.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {updatedCategories
                  .find(cat => cat.id === selectedCategory)
                  ?.documents.map((doc, index) => (
                    <div key={doc.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(doc.status)}
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {doc.expiry !== "N/A" && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Expires: {doc.expiry}</span>
                          </div>
                        )}
                        <span>{doc.size}</span>
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              if (doc.id) {
                                window.open(`/api/documents/${doc.id}/view`, '_blank');
                              }
                            }}
                            title="View document"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              if (doc.id) {
                                const link = document.createElement('a');
                                link.href = `/api/documents/${doc.id}/view`;
                                link.download = doc.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }
                            }}
                            title="Download document"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          {doc.id && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deleteMutation.mutate(doc.id)}
                              disabled={deleteMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete document"
                            >
                              🗑️
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {updatedCategories.find(cat => cat.id === selectedCategory)?.documents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p>No documents in this category yet.</p>
                    <p className="text-sm">Upload your first document to get started!</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}