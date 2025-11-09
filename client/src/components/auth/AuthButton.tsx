import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User as UserIcon, LogOut, Settings, Crown, TrendingUp, TrendingDown, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";

export default function AuthButton() {
  const { user, isLoading, isAuthenticated, clearSession, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Mock subscription plan data - in production this would come from your payment system
  const getUserSubscriptionPlan = () => {
    // This could be stored in user data or fetched from payment provider
    return {
      plan: 'Lifetime Access', // Free, Premium, Professional, Lifetime Access
      price: '$495 (one-time)',
      nextBilling: null,
      canUpgrade: false,
      canDowngrade: false
    };
  };

  const subscriptionPlan = getUserSubscriptionPlan();

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Free': return Star;
      case 'Premium': return TrendingUp;
      case 'Professional': return Crown;
      case 'Lifetime Access': return Crown;
      default: return Star;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'text-gray-600';
      case 'Premium': return 'text-blue-600';
      case 'Professional': return 'text-purple-600';
      case 'Lifetime Access': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-end gap-2">
        <Button 
          onClick={() => window.location.href = '/auth'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Sign In
        </Button>
        <Button 
          onClick={() => window.location.href = '/password-reset'}
          variant="link" 
          size="sm" 
          className="text-blue-600 hover:text-blue-800 text-xs"
        >
          Forgot Password?
        </Button>
      </div>
    );
  }

  const userData = user as User;
  const initials = userData?.firstName && userData?.lastName 
    ? `${userData.firstName[0]}${userData.lastName[0]}` 
    : userData?.email?.[0]?.toUpperCase() || 'U';

  const displayName = userData?.firstName && userData?.lastName 
    ? `${userData.firstName} ${userData.lastName}` 
    : userData?.email || 'User';

  const PlanIcon = getPlanIcon(subscriptionPlan.plan);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-blue-200 hover:ring-blue-300 transition-all">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userData?.profileImageUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{displayName}</p>
            {userData?.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {userData.email}
              </p>
            )}
          </div>
        </div>
        
        {/* Subscription Plan Section */}
        <DropdownMenuSeparator />
        <div className="px-2 py-2">
          <div className="flex items-center gap-2 mb-2">
            <PlanIcon className={`h-4 w-4 ${getPlanColor(subscriptionPlan.plan)}`} />
            <span className="font-medium text-sm">{subscriptionPlan.plan} Plan</span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            {subscriptionPlan.price}
          </p>
          {subscriptionPlan.plan !== 'Lifetime Access' && (
            <p className="text-xs text-muted-foreground">
              Next billing: {subscriptionPlan.nextBilling}
            </p>
          )}
        </div>
        
        {/* Plan Management Options */}
        {subscriptionPlan.canUpgrade && (
          <DropdownMenuItem onClick={() => setLocation('/pricing-table')}>
            <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
            <span>Upgrade Plan</span>
          </DropdownMenuItem>
        )}
        {subscriptionPlan.canDowngrade && subscriptionPlan.plan !== 'Free' && (
          <DropdownMenuItem onClick={() => setLocation('/pricing-table')}>
            <TrendingDown className="mr-2 h-4 w-4 text-orange-600" />
            <span>Change Plan</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setLocation('/user-profile')}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocation('/user-profile')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {/* Emergency logout options for profile issues */}
        <DropdownMenuItem 
          onClick={() => clearSession()}
          className="text-orange-600 hover:text-orange-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Clear Session & Re-login</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}