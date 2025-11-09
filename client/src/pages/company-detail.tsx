import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowLeft,
  ExternalLink,
  Car,
  Package,
  Users,
  Clock,
  StickyNote,
  Calendar
} from "lucide-react";

interface Company {
  id: number;
  name: string;
  website?: string;
  serviceVertical?: string;
  description?: string;
  vehicleTypes?: string[];
  averagePay?: string;
  contractType?: string;
  areasServed?: string[];
  insuranceRequirements?: string;
  licenseRequirements?: string;
  certificationsRequired?: string[];
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  workflowStatus?: string;
  yearEstablished?: string;
  companySize?: string;
  headquarters?: string;
  businessModel?: string;
  companyMission?: string;
  targetCustomers?: string;
  companyCulture?: string;
  isActive?: boolean;
  createdAt?: string;
}

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: company, isLoading, error } = useQuery({
    queryKey: ['/api/companies', id],
    queryFn: async () => {
      const response = await api.companies.getById(parseInt(id!));
      return response as Company;
    },
    enabled: !!id
  });

  const { data: companyActions } = useQuery({
    queryKey: ['/api/company-actions'],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h2>
          <p className="text-gray-600 mb-4">The company you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation('/companies')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  // Get current action for this company
  const currentAction = Array.isArray(companyActions) ? companyActions.find((action: any) => action.companyId === company.id)?.action : undefined;

  const getActionBadge = () => {
    switch (currentAction) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'research':
        return <Badge className="bg-blue-100 text-blue-800">Researching</Badge>;
      case 'waitinglist':
        return <Badge className="bg-purple-100 text-purple-800">Waiting List</Badge>;
      case 'other':
        return <Badge className="bg-gray-100 text-gray-800">Other</Badge>;
      default:
        return <Badge variant="secondary">Not Set</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/companies')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Companies
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              {getActionBadge()}
            </div>
            {company.serviceVertical && (
              <div className="mb-4">
                {Array.isArray(company.serviceVertical) ? (
                  <div className="flex flex-wrap gap-2">
                    {company.serviceVertical.map((vertical, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {vertical}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg text-gray-600">{company.serviceVertical}</p>
                )}
              </div>
            )}
          </div>
          
          {company.website && (
            <Button 
              onClick={() => window.open(company.website, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {company.description && (
            <Card>
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{company.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Vehicle Types */}
          {company.vehicleTypes && company.vehicleTypes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehicle Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {company.vehicleTypes.map((type, index) => (
                    <Badge key={index} variant="outline">{type}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.licenseRequirements && (
                <div>
                  <p className="font-medium text-gray-900">License Requirements</p>
                  <p className="text-gray-700">{company.licenseRequirements}</p>
                </div>
              )}
              {company.insuranceRequirements && (
                <div>
                  <p className="font-medium text-gray-900">Insurance Requirements</p>
                  <p className="text-gray-700">{company.insuranceRequirements}</p>
                </div>
              )}
              {company.certificationsRequired && company.certificationsRequired.length > 0 && (
                <div>
                  <p className="font-medium text-gray-900">Required Certifications</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {company.certificationsRequired.map((cert, index) => (
                      <Badge key={index} variant="outline">{cert}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.businessModel && (
                <div>
                  <p className="font-medium text-gray-900">Business Model</p>
                  <p className="text-gray-700">{company.businessModel}</p>
                </div>
              )}
              {company.contractType && (
                <div>
                  <p className="font-medium text-gray-900">Contract Type</p>
                  <p className="text-gray-700">{company.contractType}</p>
                </div>
              )}
              {company.companyMission && (
                <div>
                  <p className="font-medium text-gray-900">Mission</p>
                  <p className="text-gray-700">{company.companyMission}</p>
                </div>
              )}
              {company.targetCustomers && (
                <div>
                  <p className="font-medium text-gray-900">Target Customers</p>
                  <p className="text-gray-700">{company.targetCustomers}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              
              {company.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a 
                    href={`mailto:${company.contactEmail}`}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {company.contactEmail}
                  </a>
                </div>
              )}
              
              {company.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a 
                    href={`tel:${company.contactPhone}`}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {company.contactPhone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work Details */}
          <Card>
            <CardHeader>
              <CardTitle>Work Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.averagePay && (
                <div>
                  <p className="font-medium text-gray-900">Average Pay</p>
                  <p className="text-gray-600">{company.averagePay}</p>
                </div>
              )}
              
              {company.yearEstablished && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Year Established</p>
                    <p className="text-gray-600">{company.yearEstablished}</p>
                  </div>
                </div>
              )}

              {company.headquarters && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Headquarters</p>
                    <p className="text-gray-600">{company.headquarters}</p>
                  </div>
                </div>
              )}
              
              {company.areasServed && company.areasServed.length > 0 && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Areas Served</p>
                    <div className="space-y-1">
                      {company.areasServed.map((area, index) => (
                        <p key={index} className="text-gray-600">{area}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {company.companySize && (
                <div>
                  <p className="font-medium text-gray-900">Company Size</p>
                  <p className="text-gray-600">{company.companySize}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Culture */}
          {company.companyCulture && (
            <Card>
              <CardHeader>
                <CardTitle>Company Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{company.companyCulture}</p>
              </CardContent>
            </Card>
          )}

          {/* Driver Opportunities Notes */}
          <CompanyNotesDisplay companyId={company.id} companyName={company.name} />
        </div>
      </div>
    </div>
  );
}

// Component to display notes from Driver Opportunities
function CompanyNotesDisplay({ companyId, companyName }: { companyId: number; companyName: string }) {
  const queryClient = useQueryClient();
  const { data: notes, isLoading, error } = useQuery({
    queryKey: ['/api/job-search-notes', companyId],
    queryFn: async () => {
      console.log(`Fetching notes for company ID: ${companyId}`);
      const response = await fetch(`/api/job-search-notes/${companyId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Notes for company ${companyId}:`, data, 'Length:', data.length);
        return data;
      }
      console.error(`Failed to fetch notes for company ${companyId}:`, response.status);
      return [];
    },
  });

  // Listen for notes updates from the Driver Opportunities page
  useEffect(() => {
    const handleNotesUpdate = (event: CustomEvent) => {
      console.log('Notes update event received:', event.detail);
      if (event.detail.companyId === companyId) {
        console.log(`Refreshing notes for company ${companyId}`);
        // Invalidate and refetch notes for this company
        queryClient.invalidateQueries({ queryKey: ['/api/job-search-notes', companyId] });
      }
    };

    window.addEventListener('notesUpdated', handleNotesUpdate as EventListener);
    return () => {
      window.removeEventListener('notesUpdated', handleNotesUpdate as EventListener);
    };
  }, [companyId, queryClient]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <StickyNote className="w-5 h-5" />
            <span>Driver Opportunities Notes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading notes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <StickyNote className="w-5 h-5" />
            <span>Driver Opportunities Notes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading notes for this company.</p>
        </CardContent>
      </Card>
    );
  }

  // Show when no notes exist
  if (!notes || notes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <StickyNote className="w-5 h-5" />
            <span>Driver Opportunities Notes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <StickyNote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 italic mb-2">No notes saved for this company yet.</p>
            <p className="text-sm text-gray-500">Add notes from the Driver Opportunities page to see them here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestNote = notes[0]; // Get the most recent note

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StickyNote className="w-5 h-5" />
            <span>Driver Opportunities Notes</span>
          </div>
          <Button
            onClick={() => {
              console.log('Manual refresh clicked for company:', companyId);
              queryClient.invalidateQueries({ queryKey: ['/api/job-search-notes', companyId] });
            }}
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Notes */}
        {latestNote.notes && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Notes & Comments</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{latestNote.notes}</p>
          </div>
        )}

        {/* Contact Information */}
        {(latestNote.contactName || latestNote.phoneNumber || latestNote.emailAddress) && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
            <div className="bg-blue-50 p-3 rounded-lg space-y-2">
              {latestNote.contactName && (
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">Contact:</span>
                  <span className="text-blue-700">{latestNote.contactName}</span>
                </div>
              )}
              {latestNote.phoneNumber && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">Phone:</span>
                  <span className="text-blue-700">{latestNote.phoneNumber}</span>
                </div>
              )}
              {latestNote.emailAddress && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">Email:</span>
                  <span className="text-blue-700">{latestNote.emailAddress}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Important Dates */}
        {(latestNote.contactDate || latestNote.interviewDate || latestNote.followUpDate) && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Important Dates</h4>
            <div className="bg-green-50 p-3 rounded-lg space-y-2">
              {latestNote.contactDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">Contact Date:</span>
                  <span className="text-green-700">{new Date(latestNote.contactDate).toLocaleDateString()}</span>
                </div>
              )}
              {latestNote.interviewDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">Interview Date:</span>
                  <span className="text-green-700">{new Date(latestNote.interviewDate).toLocaleDateString()}</span>
                </div>
              )}
              {latestNote.followUpDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">Follow-up Date:</span>
                  <span className="text-green-700">{new Date(latestNote.followUpDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reminder Information */}
        {latestNote.reminderText && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Reminder</h4>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-yellow-800">{latestNote.reminderText}</p>
              {latestNote.reminderDate && (
                <p className="text-yellow-700 text-sm mt-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {new Date(latestNote.reminderDate).toLocaleDateString()}
                  {latestNote.reminderTime && ` at ${latestNote.reminderTime}`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          Last updated: {new Date(latestNote.updatedAt || latestNote.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}