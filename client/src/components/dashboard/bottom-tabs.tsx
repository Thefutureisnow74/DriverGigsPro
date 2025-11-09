import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  DollarSign, 
  Play, 
  Users, 
  Copy, 
  Mail,
  Star,
  Trophy,
  Zap,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useLocation } from "wouter";

const tabs = [
  {
    id: 1,
    title: "Free Consultation",
    icon: Phone,
    gradient: "from-amber-400 to-orange-500",
    textColor: "text-amber-600",
    content: {
      title: "Schedule Your Free Consultation",
      description: "Get expert guidance from our team",
      action: "Book Now"
    }
  },
  {
    id: 2,
    title: "Money For You",
    icon: DollarSign,
    gradient: "from-green-400 to-emerald-600",
    textColor: "text-green-600",
    content: {
      title: "AI-Powered Savings",
      description: "Discover personalized money-saving opportunities",
      action: "Find Savings"
    }
  },
  {
    id: 3,
    title: "Driver Education",
    icon: Play,
    gradient: "from-red-500 to-red-700",
    textColor: "text-red-600",
    content: {
      title: "Latest Video Content",
      description: "Watch the newest driver tips and strategies",
      action: "Watch Videos"
    }
  },
  {
    id: 4,
    title: "Referral Program",
    icon: Users,
    gradient: "from-blue-500 to-blue-700",
    textColor: "text-blue-600",
    content: {
      title: "Refer & Earn",
      description: "Invite friends and earn rewards",
      action: "Start Referring"
    }
  }
];

export default function BottomTabs() {
  const [expandedTab, setExpandedTab] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  const handleTabClick = (tabId: number) => {
    setExpandedTab(expandedTab === tabId ? null : tabId);
  };

  const expandedTabData = tabs.find(tab => tab.id === expandedTab);

  return (
    <div className="space-y-4">
      {/* Tab Links */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isExpanded = expandedTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isExpanded 
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg` 
                      : `${tab.textColor} hover:bg-slate-50 border border-slate-200`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{tab.title}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expanded Content */}
      {expandedTab && expandedTabData && (
        <Card className="border border-slate-200 shadow-lg bg-white animate-slide-in-up">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${expandedTabData.gradient} flex items-center justify-center shadow-lg`}>
                <expandedTabData.icon className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {expandedTabData.content.title}
                </h3>
                <p className="text-slate-600 mb-4">
                  {expandedTabData.content.description}
                </p>
              </div>

              {/* Content based on tab type */}
              {expandedTabData.id === 1 && (
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-amber-800">📞 (214) 929-1522</p>
                        <p className="text-sm text-amber-600">Available Mon-Fri 9AM-6PM</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-amber-600 border-amber-300 hover:bg-amber-100"
                        onClick={() => navigator.clipboard.writeText("(214) 929-1522")}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {expandedTabData.id === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-800 mb-2">💰 Tax Savings</h4>
                      <p className="text-sm text-green-600">Average $2,400/year in deductions</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-800 mb-2">⛽ Fuel Optimization</h4>
                      <p className="text-sm text-green-600">Save 15-20% on gas costs</p>
                    </div>
                  </div>
                </div>
              )}

              {expandedTabData.id === 3 && (
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2">🎥 Latest Videos</h4>
                    <div className="space-y-2 text-sm text-red-600">
                      <p>• Maximizing Earnings in 2025</p>
                      <p>• Best Routes for Peak Hours</p>
                      <p>• Vehicle Maintenance Tips</p>
                    </div>
                  </div>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => setLocation("/academy")}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Go to Academy
                  </Button>
                </div>
              )}

              {expandedTabData.id === 4 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-2">🎁 Referral Rewards</h4>
                    <div className="space-y-2 text-sm text-blue-600">
                      <p>• $50 for each friend who joins</p>
                      <p>• $25 bonus after their first gig</p>
                      <p>• Unlimited referrals</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Input 
                      value="https://drivergigspro.com/ref/CFM123" 
                      readOnly 
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText("https://drivergigspro.com/ref/CFM123")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => setExpandedTab(null)}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}