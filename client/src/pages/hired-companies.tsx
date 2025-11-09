import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Building, 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Plus,
  Search,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
  Star,
  User,
  Briefcase,
  Link,
  BarChart3,
  Wallet,
  Target,
  Activity,
  Settings,
  ExternalLink
} from "lucide-react";
import type { HiredJob } from "@shared/schema";

const statusConfig = {
  Active: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Currently working"
  },
  "On pause": {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    description: "Temporarily paused"
  },
  Quit: {
    color: "bg-blue-100 text-blue-800",
    icon: User,
    description: "Voluntarily left"
  },
  Fired: {
    color: "bg-red-100 text-red-800",
    icon: Activity,
    description: "Employment terminated"
  },
  Other: {
    color: "bg-gray-100 text-gray-800",
    icon: Settings,
    description: "Other status"
  }
};

const mockHiredJobs = [
  {
    id: 1,
    companyId: 1,
    company: { name: "DoorDash", serviceVertical: "Food" },
    position: "Delivery Driver",
    status: "Active",
    startDate: new Date("2024-01-01"),
    payRate: "$18-25/hour + tips",
    notes: "Great area, consistent orders during peak hours",
    contactPerson: "Sarah Johnson",
    contactPhone: "(555) 123-4567",
    contactEmail: "sarah.j@doordash.com",
    earnings: {
      daily: 127.50,
      weekly: 892.50,
      monthly: 3570.00
    },
    isConnected: true,
    accountEmail: "bonnie.andrade@gmail.com",
    lastSync: new Date("2024-01-25T08:30:00"),
    performance: {
      rating: 4.9,
      completedOrders: 1247,
      acceptanceRate: 88
    }
  },
  {
    id: 2,
    companyId: 2,
    company: { name: "Amazon Flex", serviceVertical: "Package" },
    position: "Delivery Associate",
    status: "Active",
    startDate: new Date("2023-12-15"),
    payRate: "$20-23/hour",
    notes: "4-hour blocks work well with schedule, reliable pay",
    contactPerson: "Mike Chen",
    contactPhone: "(555) 234-5678",
    contactEmail: "mike.chen@amazon.com",
    earnings: {
      daily: 92.00,
      weekly: 644.00,
      monthly: 2576.00
    },
    isConnected: true,
    accountEmail: "bonnie.andrade@gmail.com",
    lastSync: new Date("2024-01-25T09:15:00"),
    performance: {
      rating: 4.8,
      completedBlocks: 89,
      reliabilityScore: 95
    }
  },
  {
    id: 3,
    companyId: 3,
    company: { name: "Uber Eats", serviceVertical: "Food" },
    position: "Delivery Partner",
    status: "On Hold",
    startDate: new Date("2023-11-20"),
    payRate: "$15-22/hour",
    notes: "Taking break due to vehicle maintenance",
    contactPerson: "Jennifer Lee",
    contactPhone: "(555) 345-6789",
    contactEmail: "jennifer.lee@uber.com",
    earnings: {
      daily: 0,
      weekly: 0,
      monthly: 1245.00
    },
    isConnected: false,
    accountEmail: "",
    lastSync: null,
    performance: {
      rating: 4.7,
      completedTrips: 324,
      acceptanceRate: 82
    }
  },
  {
    id: 4,
    companyId: 4,
    company: { name: "Instacart", serviceVertical: "Food" },
    position: "Full Service Shopper",
    status: "Completed",
    startDate: new Date("2023-09-01"),
    payRate: "$16-20/hour + tips",
    notes: "Completed seasonal work, good experience with customers",
    contactPerson: "David Park",
    contactPhone: "(555) 456-7890",
    contactEmail: "david.park@instacart.com"
  }
];

export default function HiredCompanies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [deletedMockJobs, setDeletedMockJobs] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hiredJobs = [], isLoading } = useQuery({
    queryKey: ['/api/hired-jobs'],
    queryFn: () => api.hiredJobs.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: api.hiredJobs.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hired-jobs'] });
      toast({
        title: "Success",
        description: "Job record deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete job record",
        variant: "destructive",
      });
    },
  });

  const statusUpdateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      api.hiredJobs.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hired-jobs'] });
      toast({
        title: "Success",
        description: "Job status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to update job status",
        variant: "destructive",
      });
    },
  });

  // Use mock data if no real hired jobs, but filter out deleted ones
  const availableMockJobs = mockHiredJobs.filter(job => !deletedMockJobs.includes(job.id));
  const displayJobs = hiredJobs.length > 0 ? hiredJobs : availableMockJobs;
  
  const filteredJobs = displayJobs.filter(job => {
    const matchesSearch = job.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = Object.keys(statusConfig).reduce((acc, status) => {
    acc[status] = displayJobs.filter(job => job.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  const activeJobs = displayJobs.filter(job => job.status === "Active").length;
  const totalEarnings = "$12,450"; // This would come from real data
  const avgRating = "4.9";

  const handleDelete = (id: number) => {
    const job = displayJobs.find(j => j.id === id);
    const isRealData = hiredJobs.length > 0 && hiredJobs.find(realJob => realJob.id === id);
    
    if (window.confirm(`Are you sure you want to delete the job record for ${job?.company?.name || 'this company'}?`)) {
      if (isRealData) {
        // Delete from database for real data
        deleteMutation.mutate(id);
      } else {
        // For sample/mock data, add to deleted list
        setDeletedMockJobs(prev => [...prev, id]);
        toast({
          title: "Success",
          description: `${job?.company?.name || 'Company'} removed from your active jobs list`,
        });
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Companies That Hired Me</h1>
            <p className="text-gray-600 mt-1">Manage your active jobs and employment history</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-hover bg-gradient-to-r from-green-500 to-emerald-600 text-white overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{activeJobs}</div>
                  <div className="text-xs opacity-90">Active Jobs</div>
                </div>
                <CheckCircle className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover bg-gradient-to-r from-blue-500 to-cyan-600 text-white overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{totalEarnings}</div>
                  <div className="text-xs opacity-90">Total Earnings</div>
                </div>
                <DollarSign className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover bg-gradient-to-r from-purple-500 to-pink-600 text-white overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{avgRating}</div>
                  <div className="text-xs opacity-90">Avg Rating</div>
                </div>
                <Star className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover bg-gradient-to-r from-orange-500 to-red-600 text-white overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{displayJobs.length}</div>
                  <div className="text-xs opacity-90">Total Companies</div>
                </div>
                <Building className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Filter Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card 
            className={`card-hover cursor-pointer transition-all duration-300 ${
              statusFilter === "all" ? "ring-2 ring-emerald-500 scale-105" : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">{displayJobs.length}</div>
                  <div className="text-xs text-gray-600">All Jobs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            const count = statusCounts[status] || 0;
            
            return (
              <Card 
                key={status}
                className={`card-hover cursor-pointer transition-all duration-300 ${
                  statusFilter === status ? "ring-2 ring-emerald-500 scale-105" : ""
                }`}
                onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${config.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 bg-')} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${config.color.split(' ')[1]}`} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800">{count}</div>
                      <div className="text-xs text-gray-600 line-clamp-1">{status}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by company name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredJobs.length} job records
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const statusInfo = statusConfig[job.status as keyof typeof statusConfig];
                const StatusIcon = statusInfo?.icon || CheckCircle;
                
                // Find highest earning company (DoorDash with $3570 monthly)
                const isHighestEarning = job.company?.name === "DoorDash" && job.earnings?.monthly === 3570;
                // Find second highest earning company (Amazon Flex with $2576 monthly)
                const isSecondHighestEarning = job.company?.name === "Amazon Flex" && job.earnings?.monthly === 2576;
                
                return (
                  <Card 
                    key={job.id} 
                    className="card-hover bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    data-highest-earning={isHighestEarning}
                    data-second-highest-earning={isSecondHighestEarning}
                    onClick={() => {
                      setSelectedJob(job);
                      setEditFormData({
                        ...job,
                        earnings: job.earnings || { daily: 0, weekly: 0, monthly: 0 },
                        isConnected: job.isConnected || false,
                        accountEmail: job.accountEmail || "",
                        performance: job.performance || {}
                      });
                      setIsEditDialogOpen(true);
                    }}
                  >
                    {/* Connection Status Header */}
                    <div className={`h-2 ${job.isConnected ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <Building className="text-white text-lg" />
                            </div>
                            {job.isConnected && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <Link className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">
                              {job.company?.name || "Unknown Company"}
                            </CardTitle>
                            <p className="text-sm text-gray-600">{job.position}</p>
                            <Badge className={`mt-1 ${statusInfo?.color || "bg-gray-100 text-gray-800"} text-xs`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {job.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={job.status}
                            onValueChange={(value) => {
                              // Only allow updates for real database jobs (from hiredJobs, not mockHiredJobs)
                              if (hiredJobs.length > 0 && hiredJobs.find(realJob => realJob.id === job.id)) {
                                statusUpdateMutation.mutate({ id: job.id, status: value });
                              } else {
                                toast({
                                  title: "Info",
                                  description: "This is demo data. Add real jobs to update status.",
                                  variant: "default",
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="w-auto min-w-[120px] h-8 text-xs">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-800 rounded-full"></div>
                                  <span>Active</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="On pause">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
                                  <span>On pause</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="Quit">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                                  <span>Quit</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="Fired">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-red-800 rounded-full"></div>
                                  <span>Fired</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="Other">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                  <span>Other</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJob(job);
                              setEditFormData({
                                ...job,
                                earnings: job.earnings || { daily: 0, weekly: 0, monthly: 0 },
                                isConnected: job.isConnected || false,
                                accountEmail: job.accountEmail || "",
                                performance: job.performance || {}
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Financial Tracking */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                              Earnings
                            </h4>
                            <BarChart3 className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-700">
                                ${job.earnings?.daily?.toFixed(0) || '0'}
                              </div>
                              <div className="text-xs text-gray-600">Today</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-700">
                                ${job.earnings?.weekly?.toFixed(0) || '0'}
                              </div>
                              <div className="text-xs text-gray-600">Week</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-700">
                                ${job.earnings?.monthly?.toFixed(0) || '0'}
                              </div>
                              <div className="text-xs text-gray-600">Month</div>
                            </div>
                          </div>
                        </div>

                        {/* Account Connection Status */}
                        <div className={`rounded-xl p-3 border ${
                          job.isConnected 
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' 
                            : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                job.isConnected ? 'bg-blue-500' : 'bg-gray-400'
                              }`}>
                                {job.isConnected ? (
                                  <Link className="w-4 h-4 text-white" />
                                ) : (
                                  <ExternalLink className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {job.isConnected ? 'Connected' : 'Not Connected'}
                                </div>
                                {job.isConnected && job.lastSync && (
                                  <div className="text-xs text-gray-500">
                                    Last sync: {new Date(job.lastSync).toLocaleTimeString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={job.isConnected ? "outline" : "default"}
                              className={`text-xs px-3 py-1 ${
                                job.isConnected 
                                  ? 'border-blue-500 text-blue-600 hover:bg-blue-50' 
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: job.isConnected ? "Account Connected" : "Connect Account",
                                  description: job.isConnected 
                                    ? "Your account is already connected and syncing data"
                                    : `Connect your ${job.company?.name} account to track earnings automatically`,
                                });
                              }}
                            >
                              {job.isConnected ? 'Sync' : 'Connect'}
                            </Button>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        {job.performance && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                                <Activity className="w-4 h-4 mr-1 text-purple-600" />
                                Performance
                              </h4>
                              <Star className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex justify-between text-sm">
                              {job.performance.rating && (
                                <div className="text-center">
                                  <div className="font-bold text-purple-700">{job.performance.rating}</div>
                                  <div className="text-xs text-gray-600">Rating</div>
                                </div>
                              )}
                              {job.performance.completedOrders && (
                                <div className="text-center">
                                  <div className="font-bold text-purple-700">{job.performance.completedOrders}</div>
                                  <div className="text-xs text-gray-600">Orders</div>
                                </div>
                              )}
                              {job.performance.acceptanceRate && (
                                <div className="text-center">
                                  <div className="font-bold text-purple-700">{job.performance.acceptanceRate}%</div>
                                  <div className="text-xs text-gray-600">Accept</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Pay Rate and Start Date */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="text-sm">
                            <div className="font-semibold text-green-600">{job.payRate}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              Since {new Date(job.startDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(job.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {filteredJobs.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No job records found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add your first job record to start tracking your employment history'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <Building className="w-6 h-6 mr-2 text-blue-600" />
                Edit Company Profile
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</Label>
                      <Input
                        id="companyName"
                        value={editFormData.company?.name || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          company: { ...prev.company, name: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="position" className="text-sm font-medium text-gray-700">Position</Label>
                      <Input
                        id="position"
                        value={editFormData.position || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          position: e.target.value
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                      <Select 
                        value={editFormData.status || ''} 
                        onValueChange={(value) => setEditFormData((prev: any) => ({
                          ...prev,
                          status: value
                        }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(statusConfig).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="payRate" className="text-sm font-medium text-gray-700">Pay Rate</Label>
                      <Input
                        id="payRate"
                        value={editFormData.payRate || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          payRate: e.target.value
                        }))}
                        placeholder="e.g., $18-25/hour + tips"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                      <Textarea
                        id="notes"
                        value={editFormData.notes || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          notes: e.target.value
                        }))}
                        placeholder="Add any notes about this job..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={editFormData.contactPerson || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          contactPerson: e.target.value
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                      <Input
                        id="contactPhone"
                        value={editFormData.contactPhone || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          contactPhone: e.target.value
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">Email Address</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={editFormData.contactEmail || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          contactEmail: e.target.value
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Financial & Account */}
              <div className="space-y-6">
                {/* Financial Tracking */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                    Financial Tracking
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dailyEarnings" className="text-sm font-medium text-gray-700">Daily Earnings ($)</Label>
                      <Input
                        id="dailyEarnings"
                        type="number"
                        step="0.01"
                        value={editFormData.earnings?.daily || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          earnings: {
                            ...prev.earnings,
                            daily: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="weeklyEarnings" className="text-sm font-medium text-gray-700">Weekly Earnings ($)</Label>
                      <Input
                        id="weeklyEarnings"
                        type="number"
                        step="0.01"
                        value={editFormData.earnings?.weekly || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          earnings: {
                            ...prev.earnings,
                            weekly: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="monthlyEarnings" className="text-sm font-medium text-gray-700">Monthly Earnings ($)</Label>
                      <Input
                        id="monthlyEarnings"
                        type="number"
                        step="0.01"
                        value={editFormData.earnings?.monthly || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          earnings: {
                            ...prev.earnings,
                            monthly: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Connection */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Link className="w-5 h-5 mr-2 text-orange-600" />
                    Account Connection
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          editFormData.isConnected ? 'bg-green-500' : 'bg-gray-400'
                        }`}>
                          {editFormData.isConnected ? (
                            <Link className="w-5 h-5 text-white" />
                          ) : (
                            <ExternalLink className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {editFormData.isConnected ? 'Account Connected' : 'Account Not Connected'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {editFormData.isConnected 
                              ? 'Automatically syncing earnings data' 
                              : 'Connect to sync earnings automatically'
                            }
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={editFormData.isConnected ? "outline" : "default"}
                        size="sm"
                        onClick={() => {
                          setEditFormData((prev: any) => ({
                            ...prev,
                            isConnected: !prev.isConnected,
                            lastSync: prev.isConnected ? null : new Date()
                          }));
                          toast({
                            title: editFormData.isConnected ? "Account Disconnected" : "Account Connected",
                            description: editFormData.isConnected 
                              ? "Account has been disconnected" 
                              : "Account connected successfully"
                          });
                        }}
                      >
                        {editFormData.isConnected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                    
                    {editFormData.isConnected && (
                      <div>
                        <Label htmlFor="accountEmail" className="text-sm font-medium text-gray-700">Connected Account Email</Label>
                        <Input
                          id="accountEmail"
                          type="email"
                          value={editFormData.accountEmail || ''}
                          onChange={(e) => setEditFormData((prev: any) => ({
                            ...prev,
                            accountEmail: e.target.value
                          }))}
                          placeholder="your.email@example.com"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-cyan-600" />
                    Performance Metrics
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rating" className="text-sm font-medium text-gray-700">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editFormData.performance?.rating || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          performance: {
                            ...prev.performance,
                            rating: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="completedOrders" className="text-sm font-medium text-gray-700">Completed Orders</Label>
                      <Input
                        id="completedOrders"
                        type="number"
                        value={editFormData.performance?.completedOrders || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          performance: {
                            ...prev.performance,
                            completedOrders: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="acceptanceRate" className="text-sm font-medium text-gray-700">Acceptance Rate (%)</Label>
                      <Input
                        id="acceptanceRate"
                        type="number"
                        min="0"
                        max="100"
                        value={editFormData.performance?.acceptanceRate || ''}
                        onChange={(e) => setEditFormData((prev: any) => ({
                          ...prev,
                          performance: {
                            ...prev.performance,
                            acceptanceRate: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                disabled={false}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  // In a real app, this would save to the database
                  toast({
                    title: "Success",
                    description: "Company profile updated successfully"
                  });
                  setIsEditDialogOpen(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
