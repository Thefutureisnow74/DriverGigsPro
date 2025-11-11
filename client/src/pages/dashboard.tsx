import { useAuth } from "@/hooks/useAuth";
import StatsCards from "@/components/dashboard/stats-cards";
import RideshareMap from "@/components/dashboard/rideshare-map";
import BottomTabs from "@/components/dashboard/bottom-tabs";
import ModernTopBar from "@/components/layout/modern-topbar";
import ActivityFeed from "@/components/dashboard/activity-feed";
import SiderChat from "@/components/dashboard/sider-chat";
import { CONTAINER } from "@/lib/responsive-utils";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Top Bar */}
      <ModernTopBar />

      {/* Dashboard Content */}
      <div className={`${CONTAINER.default} py-4 md:py-6 space-y-4 md:space-y-6`}>
        {/* Compact Stats Row */}
        <div className="animate-fade-in-up">
          <StatsCards />
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="space-y-6 md:space-y-8">
          {/* Activity Feed */}
          <div className="animate-slide-in-left">
            <ActivityFeed />
          </div>

          {/* AI Assistant */}
          <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
            <SiderChat />
          </div>

          {/* Rideshare Map - Responsive Height */}
          <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="h-64 md:h-96">
              <RideshareMap />
            </div>
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