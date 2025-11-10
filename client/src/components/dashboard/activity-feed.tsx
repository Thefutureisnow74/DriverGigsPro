import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import GigBotChat from "@/components/dashboard/gigbot-chat";
import { 
  TrendingUp, 
  Clock, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Music, 
  Trophy,
  Zap,
  Sun,
  Moon,
  Car,
  AlertCircle,
  X,
  Minus
} from "lucide-react";
import { GigBotAvatar } from "@/components/ui/gig-bot-avatar";

const getCurrentDay = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  return days[now.getDay()];
};

const getCurrentDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Use browser's actual timezone
  });
};

// AI-powered recommendations hook
const useAIRecommendations = () => {
  return useQuery({
    queryKey: ['/api/gigbot/recommendations'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1
  });
};

const getAgendaItems = (activeCompanyNames: string[] = [], activeCount: number = 0, recommendations: any[] = []) => [
  {
    id: 1,
    type: "gig_recommendations",
    title: "Driver Assistant's Smart Recommendations",
    description: `5 Time-Saving Opportunities Ready Now`,
    detail: "Auto-filtered for quick signup, urgent hiring, and instant earnings",
    icon: Zap,
    bgColor: "bg-gradient-to-r from-blue-50 to-purple-50",
    borderColor: "border-blue-200",
    iconBg: "bg-gradient-to-r from-blue-500 to-purple-500",
    iconColor: "text-white",
    recommendations: recommendations
  },
  {
    id: 2,
    type: "peak_hours",
    title: "Today's Optimal Hours",
    description: "11:30 AM - 1:30 PM • 5:30 PM - 9:00 PM",
    detail: "Driver Assistant analyzed demand patterns • +25% earnings potential",
    icon: TrendingUp,
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    badge: "Peak Hours",
    badgeColor: "bg-emerald-100 text-emerald-700"
  }
];

export default function ActivityFeed() {
  const [showDriverAssistantInfo, setShowDriverAssistantInfo] = useState(false);
  const [showRecommendationCriteria, setShowRecommendationCriteria] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch user's active companies
  const { data: companyActions = [] } = useQuery({
    queryKey: ['/api/company-actions'],
  });
  
  // Fetch AI-powered recommendations
  const { data: aiRecommendations, isLoading: recommendationsLoading } = useAIRecommendations();
  
  // Mutation for dismissing recommendations
  const dismissRecommendation = useMutation({
    mutationFn: async ({ companyId, companyName, reason }: { companyId: number, companyName: string, reason?: string }) => {
      // Store current recommendations before making the API call
      const currentRecs = (aiRecommendations as any)?.recommendations || [];
      
      // Show immediate dismissal message
      toast({
        title: "🗑️ Recommendation Dismissed",
        description: `${companyName} has been removed. Getting fresh recommendations...`,
        duration: 3000,
        className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-md",
      });
      
      const result = await apiRequest("/api/gigbot/recommendations/dismiss", { method: "POST", body: { companyId, companyName, reason } });
      
      // Force immediate refetch of fresh recommendations
      await queryClient.refetchQueries({ queryKey: ['/api/gigbot/recommendations'] });
      
      // Find the new company that was added
      setTimeout(() => {
        const freshRecs = queryClient.getQueryData(['/api/gigbot/recommendations']) as any;
        if (freshRecs?.recommendations) {
          const currentNames = currentRecs.map((r: any) => r.name);
          const newNames = freshRecs.recommendations.map((r: any) => r.name);
          const addedCompany = newNames.find((name: string) => !currentNames.includes(name) && name !== companyName);
          
          if (addedCompany) {
            toast({
              title: "✨ New Recommendation Added",
              description: `${addedCompany} has been added to replace ${companyName}`,
              duration: 4000,
              className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-md",
            });
          }
        }
      }, 500); // Small delay to ensure data is updated
      
      return result;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to dismiss recommendation. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      console.error("Error dismissing recommendation:", error);
    }
  });
  
  const activeCompanyNames = Array.isArray(companyActions) 
    ? (companyActions as any[])
        .filter((action: any) => action.action === 'active')
        .map((action: any) => action.companyName)
    : [];
    
  // Debug logging to help identify filtering issues
  console.log('Active company names:', activeCompanyNames);
    
  const activeCount = activeCompanyNames.length;
  const recommendations = (aiRecommendations as any)?.recommendations || [];
  // Backend already excludes dismissed recommendations, so we use them directly
  const agendaItems = getAgendaItems(activeCompanyNames, activeCount, recommendations);
  
  return (
    <>
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-800">Driver Assistant</h3>
              <p className="text-sm text-slate-600 font-medium mt-1">{getCurrentDate()}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs px-2 py-1 h-6"
              onClick={() => setShowDriverAssistantInfo(!showDriverAssistantInfo)}
            >
              ?
            </Button>
          </div>
        </div>
        
        {/* Driver Assistant Information Panel */}
        {showDriverAssistantInfo && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-blue-800 text-sm">What is Driver Assistant?</h4>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 text-xs px-1 py-0 h-5"
                onClick={() => setShowDriverAssistantInfo(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-3 text-sm text-blue-700">
              <p>
                <strong>Daily Recommendations:</strong> Driver Assistant analyzes your profile, vehicle, and location to suggest new earning opportunities that match your situation.
              </p>
              <p>
                <strong>Smart Filtering:</strong> Only shows platforms you're not already active with, saving time by avoiding duplicates.
              </p>
              <p>
                <strong>Priority Scoring:</strong> Recommendations are sorted by urgency, pay rates, and ease of signup to maximize your earning potential.
              </p>
              <p>
                <strong>Real-Time Data:</strong> Information includes current pay rates, onboarding times, and hiring status from our database of 450+ gig platforms.
              </p>
            </div>
          </div>
        )}

        {/* Recommendation Criteria Panel */}
        {showRecommendationCriteria && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-green-800 text-sm">How We Choose Recommendations</h4>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-green-600 hover:text-green-800 hover:bg-green-100 text-xs px-1 py-0 h-5"
                onClick={() => setShowRecommendationCriteria(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-4 text-sm text-green-700">
              <div>
                <h5 className="font-bold text-green-800 mb-2">📊 Scoring System (Base: 50 points)</h5>
                <ul className="space-y-1 text-xs">
                  <li><strong>🏠 Location Match:</strong> +20 points if company operates in your city</li>
                  <li><strong>🚗 Vehicle Ownership:</strong> +15 points if you have registered vehicles</li>
                  <li><strong>🏆 Popular Platforms:</strong> +10 points (Uber, Lyft, DoorDash, etc.)</li>
                  <li><strong>⚡ Quick Signup:</strong> +5 points (Roadie, Shipt, Favor, etc.)</li>
                  <li><strong>🚨 Urgent Hiring:</strong> +15 points for companies actively hiring</li>
                  <li><strong>📝 Easy Signup:</strong> +8 points for simple onboarding</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-green-800 mb-2">🚫 Exclusion Criteria</h5>
                <ul className="space-y-1 text-xs">
                  <li>Companies you're already <strong>active</strong> with</li>
                  <li>Companies you've <strong>dismissed</strong> previously</li>
                  <li>Companies not operating in your area</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-green-800 mb-2">🎯 Recommendation Priority</h5>
                <ul className="space-y-1 text-xs">
                  <li><strong>80+ points:</strong> Perfect match for your profile</li>
                  <li><strong>70+ points:</strong> Great fit based on your experience</li>
                  <li><strong>60+ points:</strong> Good opportunity to consider</li>
                  <li><strong>Top 5</strong> highest-scoring companies are shown</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-green-800 mb-2">🔄 Fresh Data</h5>
                <ul className="space-y-1 text-xs">
                  <li>Updated in real-time when you change company status</li>
                  <li>Recommendations refresh immediately after status changes</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <>
        {/* Driver Assistant Chat - Above Recommendations */}
        <div className="mb-6">
          <GigBotChat />
        </div>
        
        <div className="space-y-4">
          {agendaItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <div 
                key={item.id}
                className={`relative flex items-start space-x-4 p-5 ${item.bgColor} border ${item.borderColor} rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${item.iconBg} flex items-center justify-center rounded-full shadow-sm flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-slate-800 text-base">{item.title}</h4>
                    {item.type === "gig_recommendations" ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs px-2 py-1 h-6 border border-blue-200"
                        onClick={() => setShowRecommendationCriteria(!showRecommendationCriteria)}
                      >
                        Search criteria
                      </Button>
                    ) : (
                      item.badge && (
                        <Badge className={`text-xs font-medium ${item.badgeColor} border-0`}>
                          {item.badge}
                        </Badge>
                      )
                    )}
                  </div>
                  <p className="text-sm text-slate-700 font-semibold mb-1">{item.description}</p>
                  <p className="text-xs text-slate-600 mb-3">{item.detail}</p>
                  
                  {/* Enhanced Company Recommendations - Compact Layout */}
                  {item.type === "gig_recommendations" && item.recommendations && (
                    <div className="space-y-2 mt-2">
                      {item.recommendations.map((rec, index) => (
                        <div key={index} className="relative bg-white bg-opacity-80 p-3 rounded-lg border border-blue-150 shadow-sm hover:shadow-md transition-shadow">
                          
                          {/* Header with badges */}
                          <div className="flex items-center justify-between mb-1 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-sm">{rec.name}</span>
                              {rec.urgentHiring && (
                                <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium border">
                                  🚨 Hiring Now
                                </span>
                              )}
                              {rec.easySignup && (
                                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium border">
                                  ⚡ Quick Start
                                </span>
                              )}
                            </div>
                            
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-6"
                              onClick={() => window.open(rec.signupUrl, '_blank')}
                            >
                              {rec.autoApplyReady ? '🚀 Apply' : '📝 Sign Up'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                            <span className="font-medium">{rec.type}</span>
                            <span>•</span>
                            <span className="font-bold text-green-600">{rec.pay}</span>
                            <span>•</span>
                            <span className="text-orange-600 font-medium">{rec.estimatedOnboardingTime}</span>
                          </div>
                          
                          <p className="text-xs text-slate-500 mb-2">{rec.reason}</p>
                          
                          {/* Dismiss button at bottom */}
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-3 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-300 border-gray-200 bg-gray-50/50 transition-all duration-200 gap-1.5"
                              onClick={() => dismissRecommendation.mutate({
                                companyId: rec.companyId || Math.random(),
                                companyName: rec.name,
                                reason: "user_dismissed"
                              })}
                              disabled={dismissRecommendation.isPending}
                            >
                              <Minus className="h-3 w-3" />
                              Dismiss
                            </Button>
                          </div>

                        </div>
                      ))}
                      

                    </div>
                  )}
                </div>
                
                {/* Action indicators */}
                {item.type === "peak_hours" && (
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                )}
                
                {item.type === "events" && (
                  <div className="flex-shrink-0">
                    <div className="text-purple-600">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  </div>
                )}
                
                {item.type === "gig_recommendations" && (
                  <div className="flex-shrink-0">
                    <div className="text-blue-600">
                      <Zap className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </>
      </CardContent>
    </Card>
    </>
  );
}