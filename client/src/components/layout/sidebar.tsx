import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ReminderCount } from "@/components/reminder-count";
import { 
  PieChart, 
  DollarSign, 
  ClipboardList, 
  GraduationCap, 
  Building, 
  Send, 
  CheckCircle, 
  Fuel,
  Truck,
  Briefcase,
  FolderOpen,
  Users,
  Shield,
  Bot,
  Brain,
  Bell,
  Wrench,
  CheckSquare,
  UserCircle,
  CreditCard

} from "lucide-react";


const coreNavigationItems = [
  {
    href: "/",
    label: "Dashboard",
    description: "Overview & Stats",
    icon: PieChart,
    gradient: "from-blue-500 to-blue-600",
    hoverGradient: "hover:from-blue-500 hover:to-blue-600",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    href: "/companies",
    label: "Driver Opportunities",
    description: "Job Opportunities",
    icon: Building,
    gradient: "from-cyan-500 to-cyan-600",
    hoverGradient: "hover:from-cyan-500 hover:to-cyan-600",
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600"
  },
  {
    href: "/driver-resources",
    label: "Driver Resources",
    description: "Tools & Services for Drivers",
    icon: Wrench,
    gradient: "from-green-500 to-teal-600",
    hoverGradient: "hover:from-green-500 hover:to-teal-600",
    bgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    href: "/step-by-step-instructions",
    label: "Step by Step",
    description: "Guided Setup",
    icon: ClipboardList,
    gradient: "from-amber-500 to-orange-600",
    hoverGradient: "hover:from-amber-500 hover:to-orange-600",
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600"
  },
  {
    href: "/networking-groups",
    label: "Networking Groups",
    description: "Professional Networks",
    icon: Users,
    gradient: "from-teal-500 to-cyan-600",
    hoverGradient: "hover:from-teal-500 hover:to-cyan-600",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600"
  },
  {
    href: "/task-management",
    label: "Task Management",
    description: "Project Planning",
    icon: CheckSquare,
    gradient: "from-violet-500 to-purple-600",
    hoverGradient: "hover:from-violet-500 hover:to-purple-600",
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600"
  },
  {
    href: "/reminders",
    label: "Reminders",
    description: "Upcoming Tasks & Follow-ups",
    icon: Bell,
    gradient: "from-yellow-500 to-orange-500",
    hoverGradient: "hover:from-yellow-500 hover:to-orange-500",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  {
    href: "/my-fleet",
    label: "My Fleet",
    description: "Vehicle Management",
    icon: Truck,
    gradient: "from-slate-500 to-gray-600",
    hoverGradient: "hover:from-slate-500 hover:to-gray-600",
    bgColor: "bg-slate-100",
    iconColor: "text-slate-600"
  },
  {
    href: "/personal-credit",
    label: "Personal Credit",
    description: "Credit Score & Monitoring",
    icon: CreditCard,
    gradient: "from-rose-500 to-pink-600",
    hoverGradient: "hover:from-rose-500 hover:to-pink-600",
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600"
  },
  {
    href: "/business-document-storage",
    label: "My Business",
    description: "Business Profile Management",
    icon: FolderOpen,
    gradient: "from-amber-500 to-orange-600",
    hoverGradient: "hover:from-amber-500 hover:to-orange-600",
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600"
  },
  {
    href: "/pricing",
    label: "Pricing Table",
    description: "Plans & Billing",
    icon: DollarSign,
    gradient: "from-green-500 to-green-600",
    hoverGradient: "hover:from-green-500 hover:to-green-600",
    bgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
];

const addOnServices = [
  {
    href: "/academy",
    label: "Driver Gigs Academy",
    description: "Courses & Training",
    icon: GraduationCap,
    gradient: "from-purple-500 to-purple-600",
    hoverGradient: "hover:from-purple-500 hover:to-purple-600",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600"
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <nav className="w-60 bg-white shadow-2xl border-r border-gray-200 overflow-y-auto sidebar-gradient flex-shrink-0 z-10 relative">
      <div className="p-6">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-float">
              <Truck className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">DriverGigsPro</h1>
              <p className="text-sm text-gray-500">Software Platform</p>
            </div>
          </div>
        </div>

        {/* Core Navigation Menu */}
        <div className="space-y-2">
          {coreNavigationItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "nav-item flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 group cursor-pointer hover:scale-105 hover:shadow-xl",
                  isActive 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                    : `${item.hoverGradient} hover:text-gray-800 hover:shadow-2xl hover:shadow-blue-500/25`
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                    isActive 
                      ? "bg-white bg-opacity-20 scale-110"
                      : `${item.bgColor} group-hover:bg-white group-hover:bg-opacity-30 group-hover:shadow-lg`
                  )}>
                    <Icon className={cn(
                      "text-lg transition-all duration-300 group-hover:drop-shadow-lg",
                      isActive 
                        ? "text-white"
                        : `${item.iconColor} group-hover:text-gray-700 group-hover:scale-125`
                    )} />
                  </div>
                  <div>
                    <span className={cn(
                      "font-semibold transition-all duration-300 group-hover:drop-shadow-md",
                      isActive 
                        ? "text-white"
                        : "text-gray-700 group-hover:text-gray-800 group-hover:scale-105"
                    )}>
                      {item.label}
                    </span>
                    <p className={cn(
                      "text-xs transition-all duration-300 group-hover:drop-shadow-sm",
                      isActive 
                        ? "text-blue-100"
                        : "text-gray-500 group-hover:text-gray-600 group-hover:opacity-90 group-hover:scale-105"
                    )}>
                      {item.description}
                    </p>
                  </div>
                  {item.href === "/reminders" && (
                    <ReminderCount className="ml-auto" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Add-On Services Section */}
        <div className="mt-8">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide px-4">
              Add-On Services
            </h3>
            <div className="h-px bg-gradient-to-r from-gray-300 to-transparent mt-2"></div>
          </div>
          
          <div className="space-y-2">
            {addOnServices.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "nav-item flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 group cursor-pointer hover:scale-105 hover:shadow-xl",
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                      : `${item.hoverGradient} hover:text-gray-800 hover:shadow-2xl hover:shadow-blue-500/25`
                  )}>
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                      isActive 
                        ? "bg-white bg-opacity-20 scale-110"
                        : `${item.bgColor} group-hover:bg-white group-hover:bg-opacity-30 group-hover:shadow-lg`
                    )}>
                      <Icon className={cn(
                        "text-lg transition-all duration-300 group-hover:drop-shadow-lg",
                        isActive 
                          ? "text-white"
                          : `${item.iconColor} group-hover:text-gray-700 group-hover:scale-125`
                      )} />
                    </div>
                    <div>
                      <span className={cn(
                        "font-semibold transition-all duration-300 group-hover:drop-shadow-md",
                        isActive 
                          ? "text-white"
                          : "text-gray-700 group-hover:text-gray-800 group-hover:scale-105"
                      )}>
                        {item.label}
                      </span>
                      <p className={cn(
                        "text-xs transition-all duration-300 group-hover:drop-shadow-sm",
                        isActive 
                          ? "text-blue-100"
                          : "text-gray-500 group-hover:text-gray-600 group-hover:opacity-90 group-hover:scale-105"
                      )}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>


      </div>
    </nav>
  );
}
