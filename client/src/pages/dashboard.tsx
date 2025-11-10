import { useAuth } from "@/hooks/useAuth";
import StatsCards from "@/components/dashboard/stats-cards";
import RideshareMap from "@/components/dashboard/rideshare-map";
import BottomTabs from "@/components/dashboard/bottom-tabs";
import ModernTopBar from "@/components/layout/modern-topbar";
import ActivityFeed from "@/components/dashboard/activity-feed";
import SiderChat from "@/components/dashboard/sider-chat";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Top Bar */}
      <ModernTopBar />

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Compact Stats Row */}
        <div className="animate-fade-in-up">
          <StatsCards />
        </div>

        {/* Main Content - Full Width */}
        <div className="space-y-8">
          {/* Activity Feed */}
          <div className="animate-slide-in-left">
            <ActivityFeed />
          </div>

          {/* AI Assistant */}
          <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
            <SiderChat />
          </div>

          {/* Rideshare Map */}
          <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
            <RideshareMap />
          </div>

          {/* Bottom Tabs */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <BottomTabs />
          </div>
        </div>
      </div>
    </div>
  );
}