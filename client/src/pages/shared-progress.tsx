// import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Download, 
  ExternalLink, 
  Building2,
  Globe,
  User,
  Shield,
  CreditCard,
  TrendingUp,
  Calculator,
  Users,
  Smartphone,
  Truck,
  Database
} from "lucide-react";
// import { useEffect } from "react";

interface SharedProgressProps {
  params?: {
    token: string;
  };
}

export default function SharedProgress({ params }: SharedProgressProps) {
  const token = params?.token || 'demo-token';
  // In a real implementation, this would fetch data based on the share token
  // const { data: sharedData, isLoading } = useQuery({
  //   queryKey: [`/api/shared/${token}`],
  //   retry: false,
  // });
  const isLoading = false;
  const sharedData = null;

  // Mock data for demonstration
  const mockProgressData = {
    title: "Business Formation Journey",
    owner: "Fellow Entrepreneur",
    completionPercentage: 43,
    completedSteps: [1, 2, 3, 4, 5, 6],
    totalSteps: 14,
    lastUpdated: new Date(Date.now() - 86400000), // 1 day ago
    businessData: {
      businessName: "Urban Delivery Solutions LLC",
      businessType: "Limited Liability Company",
      state: "Texas",
      formed: "2025-01-15"
    },
    steps: [
      {
        id: 1,
        title: "Business Name & Domain",
        icon: Globe,
        completed: true,
        tasks: [
          { name: "Choose business name", completed: true },
          { name: "Check domain availability", completed: true },
          { name: "Secure Gmail account", completed: true },
          { name: "Trademark search", completed: true }
        ]
      },
      {
        id: 2,
        title: "Business Plan",
        icon: FileText,
        completed: true,
        tasks: [
          { name: "Define business model", completed: true },
          { name: "Market analysis", completed: true },
          { name: "Financial projections", completed: true }
        ]
      },
      {
        id: 3,
        title: "Business Entity Structure",
        icon: Building2,
        completed: true,
        tasks: [
          { name: "Choose LLC structure", completed: true },
          { name: "Select tax election", completed: true }
        ]
      },
      {
        id: 4,
        title: "Registered Agent & Address",
        icon: User,
        completed: true,
        tasks: [
          { name: "Select registered agent", completed: true },
          { name: "Confirm service address", completed: true }
        ]
      },
      {
        id: 5,
        title: "Articles of Formation",
        icon: Shield,
        completed: true,
        tasks: [
          { name: "File Articles with state", completed: true },
          { name: "Pay filing fees", completed: true }
        ]
      },
      {
        id: 6,
        title: "Operating Agreement",
        icon: FileText,
        completed: true,
        tasks: [
          { name: "Draft operating agreement", completed: true },
          { name: "Define member roles", completed: true }
        ]
      },
      {
        id: 7,
        title: "EIN Application",
        icon: Calculator,
        completed: false,
        tasks: [
          { name: "Apply for EIN", completed: false },
          { name: "Receive EIN letter", completed: false }
        ]
      },
      {
        id: 8,
        title: "Business Formation & Registration",
        icon: Building2,
        completed: false,
        tasks: [
          { name: "State registration", completed: false },
          { name: "Local permits", completed: false }
        ]
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading shared progress...</p>
        </div>
      </div>
    );
  }

  const progressData = sharedData || mockProgressData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{progressData.title}</h1>
            <p className="text-gray-600 mb-4">Shared by {progressData.owner}</p>
            
            {/* Overall Progress */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-slate-600">{progressData.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-slate-600 to-gray-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressData.completionPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {progressData.completedSteps.length} of {progressData.totalSteps} steps completed
              </p>
            </div>

            {/* Business Info */}
            {progressData.businessData && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg inline-block">
                <h3 className="font-semibold text-slate-800 mb-2">Business Information</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {progressData.businessData.businessName}</p>
                  <p><strong>Type:</strong> {progressData.businessData.businessType}</p>
                  <p><strong>State:</strong> {progressData.businessData.state}</p>
                  <p><strong>Formed:</strong> {new Date(progressData.businessData.formed).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressData.steps.map((step: any) => {
            const Icon = step.icon;
            const completedTasks = step.tasks.filter((task: any) => task.completed).length;
            const totalTasks = step.tasks.length;
            const stepProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return (
              <Card 
                key={step.id} 
                className={`transition-all duration-300 hover:shadow-lg ${
                  step.completed 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                    : stepProgress > 0 
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-500 text-white' 
                          : stepProgress > 0 
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{step.title}</h3>
                        <p className="text-xs text-gray-600">Step {step.id}</p>
                      </div>
                    </div>
                    {step.completed ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Complete
                      </Badge>
                    ) : stepProgress > 0 ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        In Progress
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Pending
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {step.tasks.map((task: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        {task.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={task.completed ? 'text-green-700' : 'text-gray-600'}>
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {!step.completed && stepProgress > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Step Progress</span>
                        <span className="text-xs font-semibold">{Math.round(stepProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${stepProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center p-8 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Inspired by this progress?
          </h3>
          <p className="text-gray-600 mb-6">
            Start your own business formation journey with our comprehensive step-by-step guide
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700"
            >
              Get Started
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="w-4 h-4 mr-2" />
              Save as PDF
            </Button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Progress shared on {progressData.lastUpdated.toLocaleDateString()}</p>
            <p className="mt-1">
              This shared progress is powered by <strong>DriverGigsPro Platform</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SharedProgress };