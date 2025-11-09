import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Star, 
  Phone, 
  DollarSign, 
  Play
} from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "Free Consultation",
    subtitle: "Get Expert Guidance",
    icon: Phone,
    gradient: "from-amber-400 to-orange-500",
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
    description: "Schedule your free 15-minute consultation",
    isHighlight: true
  },
  {
    id: 2,
    title: "Money For You",
    subtitle: "AI-Powered Savings",
    icon: DollarSign,
    gradient: "from-green-400 to-emerald-600",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
    description: "Discover personalized money-saving opportunities"
  },
  {
    id: 3,
    title: "Driver Education",
    subtitle: "Latest Video Content",
    icon: Play,
    gradient: "from-red-500 to-red-700",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    description: "Watch the newest driver tips and strategies"
  }
];

function AchievementCard({ achievement, onClick }: { achievement: typeof achievements[0], onClick: () => void }) {
  const Icon = achievement.icon;
  
  return (
    <Card 
      className={`border border-slate-200 shadow-sm bg-white hover:shadow-md hover:border-slate-300 hover:-translate-y-1 cursor-pointer group transition-all duration-300 overflow-hidden ${
        achievement.isHighlight ? 'border-amber-300 bg-amber-50/30' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-5 relative">
        {/* Sharp top border accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${achievement.gradient} group-hover:h-2 transition-all duration-300`}></div>
        
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-r ${achievement.gradient} shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {achievement.isHighlight && (
              <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="space-y-2 mb-4">
            <h3 className={`font-bold text-lg ${achievement.textColor}`}>
              {achievement.title}
            </h3>
            <p className="text-slate-600 text-sm font-medium">
              {achievement.subtitle}
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              {achievement.description}
            </p>
          </div>
          
          <Button 
            className={`w-full bg-gradient-to-r ${achievement.gradient} hover:shadow-lg text-white border-0 font-semibold`}
          >
            {achievement.id === 1 ? "Schedule Now" :
             achievement.id === 2 ? "Explore Savings" :
             "Watch Videos"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AchievementBadges() {
  const [, setLocation] = useLocation();

  const handleAchievementClick = (achievementId: number) => {
    if (achievementId === 1) { // Free Consultation
      setLocation('/free-consultation');
    } else if (achievementId === 2) { // Money For You
      setLocation('/ai-savings');
    } else if (achievementId === 3) { // Driver Education
      window.open('https://youtube.com', '_blank');
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-500" />
          Opportunities
        </CardTitle>
        <p className="text-sm text-slate-600">
          Unlock your earning potential with exclusive features
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => (
          <AchievementCard 
            key={achievement.id}
            achievement={achievement} 
            onClick={() => handleAchievementClick(achievement.id)} 
          />
        ))}
      </CardContent>
    </Card>
  );
}