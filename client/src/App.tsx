import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import Sidebar, { MobileMenuTrigger } from "@/components/layout/sidebar";
import Landing from "@/pages/landing";
import AuthPage from "@/pages/auth-page";

import Dashboard from "@/pages/dashboard";
import Pricing from "@/pages/pricing";
import Academy from "@/pages/academy";
import Companies from "@/pages/companies";
import CompanyDetail from "@/pages/company-detail";
import NetworkingGroups from "@/pages/networking-groups";
import TaskManagement from "@/pages/task-management";


import Documents from "@/pages/documents";
import MyFleetNew from "@/pages/my-fleet-new";
import PersonalCredit from "@/pages/personal-credit";
import DriverResources from "@/pages/driver-resources";
import DriverGigsBoard from "@/pages/job-boards";
import JobPostingPlatforms from "@/pages/job-posting-platforms";

import BusinessDocumentStorage from "@/pages/business-document-storage";
import EditBusinessProfile from "@/pages/edit-business-profile";
import CarRentals from "@/pages/car-rentals";
import AISavings from "@/pages/ai-savings";
import FreeConsultation from "@/pages/free-consultation";

import UserProfile from "@/pages/user-profile";
import PasswordReset from "@/pages/password-reset";
import AIAssistant from "@/pages/ai-assistant";
import EnhancedAIAssistant from "@/pages/enhanced-ai-assistant";
import SharedProgress from "@/pages/shared-progress";
import RemindersPage from "@/pages/reminders";
import SearchCriteria from "@/pages/search-criteria";
import MedicalSearchCriteria from "@/pages/medical-search-criteria";
import FoodSearchCriteria from "@/pages/food-search-criteria";
import PackageSearchCriteria from "@/pages/package-search-criteria";
import EcommerceSearchCriteria from "@/pages/ecommerce-search-criteria";
import AutoPartsSearchCriteria from "@/pages/auto-parts-search-criteria";
import BusinessSearchCriteria from "@/pages/business-search-criteria";
import RetailSearchCriteria from "@/pages/retail-search-criteria";
import LogisticsSearchCriteria from "@/pages/logistics-search-criteria";
import IndustrialSearchCriteria from "@/pages/industrial-search-criteria";
import LegalSearchCriteria from "@/pages/legal-search-criteria";
import LaboratorySearchCriteria from "@/pages/laboratory-search-criteria";
import ConstructionSearchCriteria from "@/pages/construction-search-criteria";
import PersonalSearchCriteria from "@/pages/personal-search-criteria";
import SeniorServicesSearchCriteria from "@/pages/senior-services-search-criteria";
import CannabisDeliverySearchCriteria from "@/pages/cannabis-delivery-search-criteria";
import AirTransportSearchCriteria from "@/pages/air-transport-search-criteria";
import RideshareSearchCriteria from "@/pages/rideshare-search-criteria";
import FreightSearchCriteria from "@/pages/freight-search-criteria";
import PetTransportSearchCriteria from "@/pages/pet-transport-search-criteria";
import ChildTransportSearchCriteria from "@/pages/child-transport-search-criteria";
import VehicleTransportSearchCriteria from "@/pages/vehicle-transport-search-criteria";
import LuggageDeliverySearchCriteria from "@/pages/luggage-delivery-search-criteria";
import DocumentDeliverySearchCriteria from "@/pages/document-delivery-search-criteria";

import EmergencyInsuranceDateTest from "@/pages/my-fleet-emergency-fix";
import PublicTest from "@/pages/public-test";

import TraditionalLogin from "@/pages/traditional-login";
import StepByStepInstructions from "@/pages/step-by-step-instructions";

import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/auth" component={Dashboard} />
      <Route path="/pricing" component={Pricing} />

      <Route path="/academy" component={Academy} />
      <Route path="/companies/:id" component={CompanyDetail} />
      <Route path="/companies" component={Companies} />
      <Route path="/search-criteria" component={SearchCriteria} />
      <Route path="/medical-search-criteria" component={MedicalSearchCriteria} />
      <Route path="/food-search-criteria" component={FoodSearchCriteria} />
      <Route path="/package-search-criteria" component={PackageSearchCriteria} />
      <Route path="/ecommerce-search-criteria" component={EcommerceSearchCriteria} />
      <Route path="/auto-parts-search-criteria" component={AutoPartsSearchCriteria} />
      <Route path="/business-search-criteria" component={BusinessSearchCriteria} />
      <Route path="/retail-search-criteria" component={RetailSearchCriteria} />
      <Route path="/logistics-search-criteria" component={LogisticsSearchCriteria} />
      <Route path="/industrial-search-criteria" component={IndustrialSearchCriteria} />
      <Route path="/legal-search-criteria" component={LegalSearchCriteria} />
      <Route path="/laboratory-search-criteria" component={LaboratorySearchCriteria} />
      <Route path="/construction-search-criteria" component={ConstructionSearchCriteria} />
      <Route path="/personal-search-criteria" component={PersonalSearchCriteria} />
      <Route path="/senior-services-search-criteria" component={SeniorServicesSearchCriteria} />
      <Route path="/cannabis-delivery-search-criteria" component={CannabisDeliverySearchCriteria} />
      <Route path="/air-transport-search-criteria" component={AirTransportSearchCriteria} />
      <Route path="/rideshare-search-criteria" component={RideshareSearchCriteria} />
      <Route path="/freight-search-criteria" component={FreightSearchCriteria} />
      <Route path="/pet-transport-search-criteria" component={PetTransportSearchCriteria} />
      <Route path="/child-transport-search-criteria" component={ChildTransportSearchCriteria} />
      <Route path="/vehicle-transport-search-criteria" component={VehicleTransportSearchCriteria} />
      <Route path="/luggage-delivery-search-criteria" component={LuggageDeliverySearchCriteria} />
      <Route path="/document-delivery-search-criteria" component={DocumentDeliverySearchCriteria} />
      <Route path="/networking-groups" component={NetworkingGroups} />
      <Route path="/task-management" component={TaskManagement} />

      <Route path="/documents" component={Documents} />
      <Route path="/my-fleet" component={MyFleetNew} />
      <Route path="/personal-credit" component={PersonalCredit} />
      <Route path="/driver-resources" component={DriverResources} />
      <Route path="/step-by-step-instructions" component={StepByStepInstructions} />
      <Route path="/job-boards" component={DriverGigsBoard} />
      <Route path="/job-posting-platforms" component={JobPostingPlatforms} />

      <Route path="/business-document-storage" component={BusinessDocumentStorage} />
      <Route path="/edit-business-profile" component={EditBusinessProfile} />
      <Route path="/edit-business-profile/:id" component={EditBusinessProfile} />
      <Route path="/car-rentals" component={CarRentals} />
      <Route path="/ai-savings" component={AISavings} />
      <Route path="/free-consultation" component={FreeConsultation} />

      <Route path="/user-profile" component={UserProfile} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/gigbot" component={EnhancedAIAssistant} />
      <Route path="/reminders" component={RemindersPage} />

      
      <Route path="/emergency-test" component={EmergencyInsuranceDateTest} />
      <Route path="/public-test" component={PublicTest} />

      <Route component={NotFound} />
    </Switch>
  );
}

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/login" component={TraditionalLogin} />
      <Route path="/landing" component={Landing} />
      <Route path="/password-reset" component={PasswordReset} />
      {/* Public shared progress route */}
      <Route path="/shared/:token" component={SharedProgress} />
      <Route path="/public-test" component={PublicTest} />
      <Route component={AuthPage} />
    </Switch>
  );
}



function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  
  // Check if we're on the edit business profile page
  const isEditPage = location.startsWith('/edit-business-profile');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Full-width layout for edit business profile page
    if (isEditPage) {
      return (
        <div className="h-screen overflow-hidden">
          <main className="h-full overflow-y-auto overflow-x-hidden">
            <AuthenticatedRouter />
          </main>
        </div>
      );
    }
    
    // Regular layout with sidebar for other pages
    return (
      <div className="flex h-screen overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
            <MobileMenuTrigger />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-800">DriverGigsPro</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <AuthenticatedRouter />
          </main>
        </div>
      </div>
    );
  }

  // For non-authenticated users (auth page, etc.)
  return (
    <div className="h-screen overflow-hidden">
      <main className="h-full overflow-y-auto overflow-x-hidden">
        <PublicRouter />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppLayout />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
