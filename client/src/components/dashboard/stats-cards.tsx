import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { 
  Briefcase, 
  DollarSign, 
  Building2, 
  Car, 
  ArrowUp, 
  ArrowDown,
  TrendingUp,
  AlertTriangle,
  Plus,
  Users,
  ExternalLink
} from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  icon: React.ElementType;
  gradient: string;
  delay?: number;
  clickable?: boolean;
  onClick?: () => void;
  isModal?: boolean;
}

function StatCard({ title, value, change, changeType, icon: Icon, gradient, delay = 0, clickable = false, onClick, isModal = false }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Animate numbers
      if (typeof value === 'number') {
        let start = 0;
        const end = value;
        const duration = 1000;
        const increment = end / (duration / 16);
        
        const counter = setInterval(() => {
          start += increment;
          if (start >= end) {
            setAnimatedValue(end);
            clearInterval(counter);
          } else {
            setAnimatedValue(Math.floor(start));
          }
        }, 16);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const getChangeIcon = () => {
    if (changeType === "increase") return <ArrowUp className="w-3 h-3" />;
    if (changeType === "decrease") return <ArrowDown className="w-3 h-3" />;
    return <TrendingUp className="w-3 h-3" />;
  };

  const getChangeColor = () => {
    if (changeType === "increase") return "text-green-600 bg-green-100";
    if (changeType === "decrease") return "text-red-600 bg-red-100";
    return "text-blue-600 bg-blue-100";
  };

  return (
    <Card 
      className={`border border-slate-200 shadow-sm bg-white hover:shadow-md hover:border-slate-300 transition-all duration-300 group overflow-hidden ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} ${clickable ? 'cursor-pointer hover:-translate-y-1' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={clickable ? onClick : undefined}
    >
      <CardContent className="p-2 relative">
        {/* Sharp left border accent */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient} group-hover:w-2 transition-all duration-300`}></div>
        
        <div className="relative flex items-center gap-2">
          <div className={`p-1 bg-gradient-to-r ${gradient} shadow-sm rounded`}>
            <Icon className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase truncate">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                {typeof value === 'number' ? animatedValue.toLocaleString() : value}
              </h3>
              {change && (
                <span className={`inline-flex items-center px-1 py-0.5 text-xs font-bold ${getChangeColor()} border rounded`}>
                  {getChangeIcon()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/user/stats'],
    queryFn: () => api.user.getStats(),
  });

  // Fetch vehicles data from My Fleet
  const { data: vehicles } = useQuery({
    queryKey: ['/api/vehicles'],
    queryFn: () => fetch('/api/vehicles').then(res => {
      if (!res.ok) return [];
      return res.json();
    }),
    retry: false,
  });

  // Fetch companies data to track new additions
  const { data: companies } = useQuery({
    queryKey: ['/api/companies'],
    queryFn: () => fetch('/api/companies').then(res => res.json()),
  });

  // Fetch company actions to calculate active count (same logic as Driver Opportunities)
  const { data: companyActions } = useQuery({
    queryKey: ['/api/company-actions'],
    queryFn: () => fetch('/api/company-actions').then(res => res.json()),
    retry: false,
  });

  // Calculate new gigs added in the last 24 hours and get the companies
  const getNewGigsData = () => {
    if (!companies || !Array.isArray(companies) || companies.length === 0) {
      return { count: 0, message: "No new gigs yet", companies: [] };
    }

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const newCompanies = companies.filter((company: any) => {
      const createdAt = new Date(company.createdAt || company.dateAdded);
      return createdAt > yesterday;
    });

    if (newCompanies.length === 0) {
      return { count: companies.length, message: `${companies.length} total gigs available`, companies: [] };
    }

    return { 
      count: newCompanies.length, 
      message: `${newCompanies.length} new ${newCompanies.length === 1 ? 'gig' : 'gigs'} added today!`,
      companies: newCompanies
    };
  };

  const newGigsData = getNewGigsData();

  // Vehicle alerts calculation using real fleet data
  const getVehicleAlerts = (): { count: number; status: "good" | "warning" | "critical" } => {
    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) return { count: 0, status: "good" };
    
    const today = new Date();
    let alertCount = 0;
    let criticalAlerts = 0;

    vehicles.forEach((vehicle: any) => {
      // Check insurance expiry
      if (vehicle.insuranceExpiry) {
        const expiryDate = new Date(vehicle.insuranceExpiry);
        const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 30) {
          alertCount++;
          if (daysLeft <= 7) criticalAlerts++;
        }
      }

      // Check registration expiry
      if (vehicle.registrationExpiry) {
        const regDate = new Date(vehicle.registrationExpiry);
        const daysLeft = Math.ceil((regDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 30) {
          alertCount++;
          if (daysLeft <= 7) criticalAlerts++;
        }
      }
    });

    return {
      count: alertCount,
      status: criticalAlerts > 0 ? "critical" : alertCount > 0 ? "warning" : "good"
    };
  };

  const vehicleAlerts = getVehicleAlerts();

  // Calculate active companies count and get list using same logic as Driver Opportunities page
  const getActiveCompaniesData = () => {
    if (!companyActions || !Array.isArray(companyActions) || !companies || !Array.isArray(companies)) return { count: 0, companies: [] };
    
    const actionsMap: Record<number, string> = {};
    companyActions.forEach((action: any) => {
      actionsMap[action.companyId] = action.action;
    });
    
    const activeCompanies = companies.filter((c: any) => actionsMap[c.id] === "active");
    return { count: activeCompanies.length, companies: activeCompanies };
  };

  const activeCompaniesData = getActiveCompaniesData();
  const activeCount = activeCompaniesData.count;

  // Calculate counts for other action types using EXACT same logic as Driver Opportunities page
  const getActionCounts = () => {
    if (!companyActions || !Array.isArray(companyActions) || !companies || !Array.isArray(companies)) return { research: 0, applied: 0, waiting: 0, other: 0 };
    
    const actionsMap: Record<number, string> = {};
    companyActions.forEach((action: any) => {
      actionsMap[action.companyId] = action.action;
    });
    
    // Count only companies that exist in the companies array AND have the action - matching Driver Opportunities logic exactly
    const research = companies.filter((c: any) => actionsMap[c.id] === "research").length;
    const applied = companies.filter((c: any) => actionsMap[c.id] === "apply").length;
    const waiting = companies.filter((c: any) => actionsMap[c.id] === "waitinglist").length;
    const other = companies.filter((c: any) => actionsMap[c.id] === "other").length;
    
    return { research, applied, waiting, other };
  };

  const actionCounts = getActionCounts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg bg-white">
            <CardContent className="p-2">
              <div className="animate-pulse">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-slate-200 rounded"></div>
                  <div className="h-2 bg-slate-200 rounded w-16"></div>
                </div>
                <div className="h-5 bg-slate-200 rounded w-12"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }



  // Get companies for each status
  const getCompaniesByStatus = (status: string) => {
    if (!companyActions || !Array.isArray(companyActions) || !companies || !Array.isArray(companies)) return [];
    
    const actionsMap: Record<number, string> = {};
    companyActions.forEach((action: any) => {
      actionsMap[action.companyId] = action.action;
    });
    
    return companies.filter((c: any) => actionsMap[c.id] === status);
  };

  const researchingCompanies = getCompaniesByStatus("research");
  const appliedCompanies = getCompaniesByStatus("apply");
  const waitingCompanies = getCompaniesByStatus("waitinglist");
  const otherCompanies = getCompaniesByStatus("other");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      {/* Active Companies Card */}
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <StatCard
              title="Active Companies"
              value={activeCount}
              change={activeCount > 0 ? `${activeCount} tracked` : "None"}
              changeType="increase"
              icon={Building2}
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              delay={0}
              clickable={true}
              isModal={true}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Active Companies ({activeCount})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {activeCompaniesData.companies.length > 0 ? (
              <div className="space-y-3">
                {activeCompaniesData.companies.map((company: any) => (
                  <div 
                    key={company.id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <h3 
                            className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => window.location.href = `/companies/${company.id}`}
                          >
                            {company.name || 'Unnamed Company'}
                          </h3>
                          <p className="text-sm text-gray-600">{company.serviceVertical || 'Service Type Not Specified'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">Active</span>
                      {company.website && (
                        <button
                          onClick={() => window.open(company.website, '_blank')}
                          className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border-t">
                  <p className="text-sm text-gray-600 text-center">
                    <button
                      onClick={() => window.location.href = '/companies?filter=active'}
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      View all in Driver Opportunities →
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No active companies yet</p>
                <p className="text-sm text-gray-500 mt-1">Companies you mark as "Active" will appear here</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Opportunities Card */}
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <StatCard
              title="New Opportunities"
              value={newGigsData.count}
              change={newGigsData.count > 0 ? "Added" : "None"}
              changeType={newGigsData.count > 0 ? "increase" : "neutral"}
              icon={Plus}
              gradient="bg-gradient-to-br from-purple-500 to-purple-600"
              delay={0.1}
              clickable={true}
              isModal={true}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Opportunities ({newGigsData.count})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {newGigsData.companies.length > 0 ? (
              <div className="space-y-3">
                {newGigsData.companies.map((company: any) => (
                  <div 
                    key={company.id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div>
                          <h3 
                            className="font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
                            onClick={() => window.location.href = `/companies/${company.id}`}
                          >
                            {company.name || 'Unnamed Company'}
                          </h3>
                          <p className="text-sm text-gray-600">{company.serviceVertical || 'Service Type Not Specified'}</p>
                          <p className="text-xs text-gray-500">
                            Added: {new Date(company.createdAt || company.dateAdded).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">New</span>
                      {company.website && (
                        <button
                          onClick={() => window.open(company.website, '_blank')}
                          className="p-1 hover:bg-purple-100 rounded-full transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border-t">
                  <p className="text-sm text-gray-600 text-center">
                    <button
                      onClick={() => window.location.href = '/companies'}
                      className="text-purple-600 hover:text-purple-800 font-medium underline"
                    >
                      View all companies in Driver Opportunities →
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No new companies added recently</p>
                <p className="text-sm text-gray-500 mt-1">New companies added in the last 24 hours will appear here</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Researching Card */}
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <StatCard
              title="RESEARCHING"
              value={actionCounts.research}
              change={actionCounts.research > 0 ? `${actionCounts.research} companies` : "None"}
              changeType={actionCounts.research > 0 ? "increase" : "neutral"}
              icon={TrendingUp}
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              delay={0.2}
              clickable={true}
              isModal={true}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Researching Companies ({actionCounts.research})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {researchingCompanies.length > 0 ? (
              <div className="space-y-3">
                {researchingCompanies.map((company: any) => (
                  <div 
                    key={company.id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <h3 
                            className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => window.location.href = `/companies/${company.id}`}
                          >
                            {company.name || 'Unnamed Company'}
                          </h3>
                          <p className="text-sm text-gray-600">{company.serviceVertical || 'Service Type Not Specified'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">Research</span>
                      {company.website && (
                        <button
                          onClick={() => window.open(company.website, '_blank')}
                          className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border-t">
                  <p className="text-sm text-gray-600 text-center">
                    <button
                      onClick={() => window.location.href = '/companies?filter=research'}
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      View all in Driver Opportunities →
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No companies being researched</p>
                <p className="text-sm text-gray-500 mt-1">Companies you mark as "Research" will appear here</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Applied Card */}
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <StatCard
              title="APPLIED"
              value={actionCounts.applied}
              change={actionCounts.applied > 0 ? `${actionCounts.applied} companies` : "None"}
              changeType={actionCounts.applied > 0 ? "increase" : "neutral"}
              icon={Users}
              gradient="bg-gradient-to-br from-green-500 to-green-600"
              delay={0.25}
              clickable={true}
              isModal={true}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Applied Companies ({actionCounts.applied})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {appliedCompanies.length > 0 ? (
              <div className="space-y-3">
                {appliedCompanies.map((company: any) => (
                  <div 
                    key={company.id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <h3 
                            className="font-semibold text-gray-900 cursor-pointer hover:text-green-600 transition-colors"
                            onClick={() => window.location.href = `/companies/${company.id}`}
                          >
                            {company.name || 'Unnamed Company'}
                          </h3>
                          <p className="text-sm text-gray-600">{company.serviceVertical || 'Service Type Not Specified'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">Applied</span>
                      {company.website && (
                        <button
                          onClick={() => window.open(company.website, '_blank')}
                          className="p-1 hover:bg-green-100 rounded-full transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border-t">
                  <p className="text-sm text-gray-600 text-center">
                    <button
                      onClick={() => window.location.href = '/companies?filter=applied'}
                      className="text-green-600 hover:text-green-800 font-medium underline"
                    >
                      View all in Driver Opportunities →
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No applications submitted</p>
                <p className="text-sm text-gray-500 mt-1">Companies you mark as "Applied" will appear here</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Waiting List Card */}
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <StatCard
              title="WAITING LIST"
              value={actionCounts.waiting}
              change={actionCounts.waiting > 0 ? `${actionCounts.waiting} companies` : "None"}
              changeType={actionCounts.waiting > 0 ? "increase" : "neutral"}
              icon={Users}
              gradient="bg-gradient-to-br from-purple-500 to-purple-600"
              delay={0.3}
              clickable={true}
              isModal={true}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Waiting List Companies ({actionCounts.waiting})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {waitingCompanies.length > 0 ? (
              <div className="space-y-3">
                {waitingCompanies.map((company: any) => (
                  <div 
                    key={company.id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div>
                          <h3 
                            className="font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
                            onClick={() => window.location.href = `/companies/${company.id}`}
                          >
                            {company.name || 'Unnamed Company'}
                          </h3>
                          <p className="text-sm text-gray-600">{company.serviceVertical || 'Service Type Not Specified'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">Waiting</span>
                      {company.website && (
                        <button
                          onClick={() => window.open(company.website, '_blank')}
                          className="p-1 hover:bg-purple-100 rounded-full transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border-t">
                  <p className="text-sm text-gray-600 text-center">
                    <button
                      onClick={() => window.location.href = '/companies?filter=waiting'}
                      className="text-purple-600 hover:text-purple-800 font-medium underline"
                    >
                      View all in Driver Opportunities →
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No companies on waiting list</p>
                <p className="text-sm text-gray-500 mt-1">Companies you mark as "Waiting List" will appear here</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Other Card */}
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <StatCard
              title="OTHER"
              value={actionCounts.other}
              change={actionCounts.other > 0 ? `${actionCounts.other} companies` : "None"}
              changeType={actionCounts.other > 0 ? "increase" : "neutral"}
              icon={Building2}
              gradient="bg-gradient-to-br from-gray-500 to-gray-600"
              delay={0.4}
              clickable={true}
              isModal={true}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Other Companies ({actionCounts.other})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {otherCompanies.length > 0 ? (
              <div className="space-y-3">
                {otherCompanies.map((company: any) => (
                  <div 
                    key={company.id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200 hover:from-gray-100 hover:to-slate-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div>
                          <h3 
                            className="font-semibold text-gray-900 cursor-pointer hover:text-gray-600 transition-colors"
                            onClick={() => window.location.href = `/companies/${company.id}`}
                          >
                            {company.name || 'Unnamed Company'}
                          </h3>
                          <p className="text-sm text-gray-600">{company.serviceVertical || 'Service Type Not Specified'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">Other</span>
                      {company.website && (
                        <button
                          onClick={() => window.open(company.website, '_blank')}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border-t">
                  <p className="text-sm text-gray-600 text-center">
                    <button
                      onClick={() => window.location.href = '/companies?filter=other'}
                      className="text-gray-600 hover:text-gray-800 font-medium underline"
                    >
                      View all in Driver Opportunities →
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No other companies</p>
                <p className="text-sm text-gray-500 mt-1">Companies you mark as "Other" will appear here</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <StatCard
        title="Vehicle Alerts"
        value={vehicleAlerts.count}
        change={vehicleAlerts.status === "good" ? "Good" : 
               vehicleAlerts.status === "warning" ? "Warning" : "Urgent"}
        changeType={vehicleAlerts.status === "good" ? "neutral" as const :
                   vehicleAlerts.status === "warning" ? "decrease" as const : "decrease" as const}
        icon={vehicleAlerts.status === "critical" ? AlertTriangle : Car}
        gradient={vehicleAlerts.status === "good" ? "bg-gradient-to-br from-slate-500 to-gray-600" :
                  vehicleAlerts.status === "warning" ? "bg-gradient-to-br from-orange-500 to-orange-600" :
                  "bg-gradient-to-br from-red-500 to-red-600"}
        delay={0.7}
      />
    </div>
  );
}