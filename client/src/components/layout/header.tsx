import { useAuth } from "@/hooks/useAuth";
import AuthButton from "@/components/auth/AuthButton";
import type { User } from "@shared/schema";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const getDisplayName = () => {
    if (isLoading) return "User";
    if (!isAuthenticated || !user) return "User";
    
    const userData = user as User;
    if (userData?.firstName) {
      return userData.firstName;
    }
    if (userData?.email) {
      return userData.email.split('@')[0];
    }
    return "User";
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 shadow-sm">
      <div className="px-4 py-0 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Welcome back, {getDisplayName()}! 👋</h1>
          <p className="text-gray-600 text-xs">Here's what's happening with your gig work today</p>
        </div>
        <AuthButton />
      </div>
    </header>
  );
}