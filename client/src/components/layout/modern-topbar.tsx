import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Crown, ChevronDown, User, Settings, LogOut } from "lucide-react";
import WeatherForecast from "../weather/WeatherForecast";

export default function ModernTopBar() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
      <div className="px-4 lg:px-8 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Left section - Weather Forecast + Time */}
          <div className="flex items-center gap-4">
            <WeatherForecast />
            <div className="bg-white/80 border border-slate-200/50 px-3 py-2 rounded-lg shadow-sm backdrop-blur-sm">
              <div className="text-sm font-bold text-slate-900">{formatTime(currentTime)}</div>
              <div className="text-xs text-slate-600 font-medium">Local Time</div>
            </div>
          </div>

          {/* Right section - Profile */}
          <div className="flex items-center">
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-2xl px-3 py-2 h-auto hover:bg-slate-100/80 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profileImageUrl || "/api/placeholder/32/32"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                        {user?.fullName ? getInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-semibold text-slate-800 flex items-center">
                        {user?.fullName || 'User'}
                        {user?.isAdmin && <Crown className="w-3 h-3 text-purple-500 ml-1" />}
                      </div>
                      <div className="text-xs text-slate-500">{user?.isAdmin ? 'Admin Access' : 'Member'}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 rounded-2xl shadow-xl border-slate-200/50 bg-white/95 backdrop-blur-md"
              >
                <div className="p-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user?.profileImageUrl || "/api/placeholder/48/48"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {user?.fullName ? getInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center">
                        {user?.fullName || 'User'}
                        {user?.isAdmin && <Crown className="w-3 h-3 text-purple-500 ml-1" />}
                      </div>
                      <div className="text-sm text-slate-500">{user?.email || 'No email'}</div>
                      <Badge variant="secondary" className="text-xs mt-1 bg-purple-100 text-purple-700">
                        {user?.isAdmin ? 'Admin Access' : 'Member'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="rounded-xl mx-2 my-1 cursor-pointer"
                  onClick={() => setLocation("/user-profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="rounded-xl mx-2 my-1 cursor-pointer"
                  onClick={() => setLocation("/user-profile")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="rounded-xl mx-2 my-1 text-red-600 hover:bg-red-50 cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}