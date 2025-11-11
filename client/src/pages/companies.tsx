import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, Building2, Eye, ChevronDown, Bot, Sparkles, BookOpen, UserPlus, CheckCircle, RefreshCw, HelpCircle, Clock, ExternalLink, Briefcase, MapPin, Users, Facebook, Linkedin, MessageCircle, Globe, Hash, Edit3, Trash2, Download } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Company } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import CompanyCard from "@/components/gig-workflow/company-card";
import CompanyProfileModal from "@/components/gig-workflow/company-profile-modal";
import AddCompanyModal from "@/components/add-company-modal";
import { RESPONSIVE_GRIDS, RESPONSIVE_FLEX, TOUCH_FRIENDLY, CONTAINER } from "@/lib/responsive-utils";



export default function Companies() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Force invalidate cache on mount to ensure fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
    queryClient.invalidateQueries({ queryKey: ["/api/company-actions"] });
  }, [queryClient]);

  // Handle URL parameters for filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');

    if (filterParam) {
      switch (filterParam) {
        case 'research':
          setActiveTab('research');
          break;
        case 'applied':
          setActiveTab('applied');
          break;
        case 'waiting':
          setActiveTab('waitinglist');
          break;
        case 'other':
          setActiveTab('other');
          break;
        case 'active':
          setActiveTab('active');
          break;
        default:
          setActiveTab('all');
      }
    }
  }, []);

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [profileCompany, setProfileCompany] = useState<any>(null);
  const [isAISearching, setIsAISearching] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [foundCompanies, setFoundCompanies] = useState<any[]>([]);
  const [showFoundCompaniesModal, setShowFoundCompaniesModal] = useState(false);
  const [selectedFoundCompanies, setSelectedFoundCompanies] = useState<any[]>([]);
  const [showCompanyListModal, setShowCompanyListModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<any>(null);
  const [isCleaningDuplicates, setIsCleaningDuplicates] = useState(false);
  const [showRecommendationCriteria, setShowRecommendationCriteria] = useState(false);

  // Auto-suggest functionality
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);




  // Filter states
  const [selectedServiceVertical, setSelectedServiceVertical] = useState<string>("");
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("");
  const [selectedContractType, setSelectedContractType] = useState<string>("");

  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>("");
  const [locationSearchTerm, setLocationSearchTerm] = useState<string>("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  // Sort state
  const [sortBy, setSortBy] = useState<string>("");

  // Tab state for filtering by action selections
  const [activeTab, setActiveTab] = useState<string>("all");

  // Track company actions with persistent storage
  const [companyActionsState, setCompanyActionsState] = useState<Record<number, string>>({});


  // US States list (moved up for filtering)
  const usStates = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
    { value: "DC", label: "Washington D.C." },
    { value: "NATIONWIDE", label: "Nationwide" }
  ];

  // Countries list for international opportunities (moved up for filtering)
  const countries = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "MX", label: "Mexico" },
    { value: "GB", label: "United Kingdom" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "IT", label: "Italy" },
    { value: "ES", label: "Spain" },
    { value: "NL", label: "Netherlands" },
    { value: "BE", label: "Belgium" },
    { value: "CH", label: "Switzerland" },
    { value: "AT", label: "Austria" },
    { value: "SE", label: "Sweden" },
    { value: "NO", label: "Norway" },
    { value: "DK", label: "Denmark" },
    { value: "FI", label: "Finland" },
    { value: "IE", label: "Ireland" },
    { value: "PT", label: "Portugal" },
    { value: "JP", label: "Japan" },
    { value: "KR", label: "South Korea" },
    { value: "SG", label: "Singapore" },
    { value: "HK", label: "Hong Kong" },
    { value: "NZ", label: "New Zealand" },
    { value: "BR", label: "Brazil" },
    { value: "CL", label: "Chile" },
    { value: "AR", label: "Argentina" },
    { value: "CO", label: "Colombia" },
    { value: "OTHER", label: "Other Country" }
  ];

  // Fetch companies data
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
    staleTime: 0, // Force fresh data to fix cannabis filter
    gcTime: 0 // Don't cache old data
  });

  // Fetch company actions for the tabs
  const { data: companyActions = [] } = useQuery({
    queryKey: ["/api/company-actions"],
  });


  // Group companies by service type for the list modal
  const groupedCompanies = companies.reduce((acc: any, company: Company) => {
    if (company.isActive !== false) {
      const serviceVerticals = Array.isArray(company.serviceVertical) ? company.serviceVertical : [company.serviceVertical || 'Other'];
      serviceVerticals.forEach(service => {
        if (!acc[service]) {
          acc[service] = [];
        }
        acc[service].push(company);
      });
    }
    return acc;
  }, {});

  // Sort service types and companies within each type
  const sortedServiceTypes = Object.keys(groupedCompanies).sort();
  sortedServiceTypes.forEach(service => {
    groupedCompanies[service].sort((a: Company, b: Company) => a.name.localeCompare(b.name));
  });



  // Mutations




  const deleteCompanyMutation = useMutation({
    mutationFn: async (companyId: number) => {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete company");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Company Deleted",
        description: "Company has been removed from the directory.",
      });
    }
  });

  const whitelistCompanyMutation = useMutation({
    mutationFn: async ({ companyId, companyName, reason, notes }: {
      companyId: number;
      companyName: string;
      reason?: string;
      notes?: string;
    }) => {
      const response = await fetch("/api/whitelist-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId,
          companyName,
          reason,
          notes
        }),
      });
      if (!response.ok) throw new Error("Failed to whitelist company");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Company Whitelisted",
        description: "Company has been permanently removed and blocked from re-entry.",
        variant: "destructive"
      });
    }
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ companyId, data }: { companyId: number; data: any }) => {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update company");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Company Updated",
        description: "Company profile has been updated successfully.",
      });
    }
  });

  // Delete handlers
  const handleDeleteClick = (company: any) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const handlePermanentDelete = () => {
    if (companyToDelete) {
      deleteCompanyMutation.mutate(companyToDelete.id);
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleChangeStatusToInactive = () => {
    if (companyToDelete) {
      updateCompanyMutation.mutate({
        companyId: companyToDelete.id,
        data: { isActive: false }
      });
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
      toast({
        title: "Company Status Changed",
        description: "Company has been marked as inactive instead of deleted.",
      });
    }
  };

  const handleWhitelistCompany = () => {
    if (companyToDelete) {
      whitelistCompanyMutation.mutate({
        companyId: companyToDelete.id,
        companyName: companyToDelete.name,
        reason: "fake_company",
        notes: "Company identified as fake/fraudulent during manual review"
      });
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };



  // FIXED FILTERING - Separate search from dropdown filters
  const filteredCompanies = (companies || []).filter((company: any) => {
    const searchLower = searchTerm.toLowerCase().trim();

    // STEP 1: Apply search filter (if any)
    let matchesSearch = true;
    if (searchLower) {
      matchesSearch = false;

      // Name/vertical matches
      if (company.name?.toLowerCase().includes(searchLower) || 
          (Array.isArray(company.serviceVertical) ? 
            company.serviceVertical.some((sv: string) => sv?.toLowerCase().includes(searchLower)) :
            company.serviceVertical?.toLowerCase().includes(searchLower))) {
        matchesSearch = true;
      }

      // State searches
      const usStates = ['alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','new hampshire','new jersey','new mexico','new york','north carolina','north dakota','ohio','oklahoma','oregon','pennsylvania','rhode island','south carolina','south dakota','tennessee','texas','utah','vermont','virginia','washington','west virginia','wisconsin','wyoming'];

      if (usStates.includes(searchLower)) {
        const areas = String(company.areasServed || '').toLowerCase();

        if (areas.includes(searchLower) || 
            (searchLower === 'texas' && areas.includes('tx')) ||
            (searchLower === 'california' && areas.includes('ca')) ||
            (searchLower === 'florida' && areas.includes('fl')) ||
            (searchLower === 'new york' && areas.includes('ny')) ||
            areas.includes('nationwide') || areas.includes('united states') || 
            areas.includes('national') || areas.includes('us') || areas.includes('global') ||
            areas.includes('all 50') || areas.includes('america') || areas.includes('country') ||
            areas.includes('metro') || areas.includes('major') || areas.includes('select') ||
            areas.includes('multiple') || areas.includes('various') || areas.includes('several') ||
            areas.includes('wide') || areas.includes('coast') || areas.includes('state')) {
          matchesSearch = true;
        }
      } else {
        // Generic location search
        if (String(company.areasServed || '').toLowerCase().includes(searchLower)) {
          matchesSearch = true;
        }
      }
    }

    if (!matchesSearch) return false;

    // STEP 2: Apply dropdown filters
    if (selectedServiceVertical) {
      const serviceVerticals = Array.isArray(company.serviceVertical) ? company.serviceVertical : [company.serviceVertical];

      // Special handling for rideshare - include both "Rideshare" and "Taxi/Rideshare"
      if (selectedServiceVertical === 'Rideshare') {
        const isRideshareMatch = serviceVerticals.includes('Rideshare') || 
                                serviceVerticals.includes('Taxi/Rideshare') ||
                                // Include companies by name if service vertical is missing/wrong
                                company.name?.toLowerCase().includes('uber') ||
                                company.name?.toLowerCase().includes('lyft') ||
                                company.name?.toLowerCase().includes('rideshare');


        if (!isRideshareMatch) return false;
      } 
      // Special handling for luggage delivery - include companies with primary service or those offering it as secondary service
      else if (selectedServiceVertical === 'Luggage Delivery') {
        const hasLuggageService = serviceVerticals.includes('Luggage Delivery') || 
                                 (company.description && (
                                   company.description.toLowerCase().includes('luggage') ||
                                   company.description.toLowerCase().includes('baggage') ||
                                   company.description.toLowerCase().includes('lost luggage') ||
                                   company.description.toLowerCase().includes('bag delivery')
                                 ));
        if (!hasLuggageService) return false;
      } 
      else if (!serviceVerticals.includes(selectedServiceVertical)) {
        return false;
      }
    }
    if (selectedVehicleType && (!company.vehicleTypes || !company.vehicleTypes.includes(selectedVehicleType))) {
      // For rideshare companies, assume they support common vehicle types if data is missing
      const isRideshareCompany = company.serviceVertical?.includes?.('Rideshare') || 
                                company.name?.toLowerCase().includes('uber') ||
                                company.name?.toLowerCase().includes('lyft') ||
                                company.name?.toLowerCase().includes('rideshare');

      const assumeCommonVehicles = isRideshareCompany && ['Car', 'SUV'].includes(selectedVehicleType);


      if (!assumeCommonVehicles) return false;
    }
    if (selectedContractType && company.contractType !== selectedContractType) return false;

    // Employment type filtering - handle missing contractType for rideshare companies
    if (selectedEmploymentType && selectedEmploymentType !== "Both") {
      // For rideshare companies, assume Independent Contractor if contractType is missing
      const isRideshareCompany = company.serviceVertical?.includes?.('Rideshare') || 
                                company.name?.toLowerCase().includes('uber') ||
                                company.name?.toLowerCase().includes('lyft') ||
                                company.name?.toLowerCase().includes('rideshare');

      const effectiveContractType = company.contractType || (isRideshareCompany ? 'Independent Contractor' : null);


      if (effectiveContractType !== selectedEmploymentType) return false;
    }
    if (selectedLocation && company.areasServed && !JSON.stringify(company.areasServed).includes(selectedLocation)) return false;

    // State filtering - check if company serves the selected state
    if (selectedState) {
      const stateLabel = usStates.find(s => s.value === selectedState)?.label;
      const areasServedStr = JSON.stringify(company.areasServed).toLowerCase();

      const hasStateMatch = company.areasServed && (
        // Direct state code or name match
        JSON.stringify(company.areasServed).includes(selectedState) ||
        (stateLabel && JSON.stringify(company.areasServed).includes(stateLabel)) ||
        // Nationwide patterns (should match ANY state selection)
        areasServedStr.includes("all 50 states") ||
        areasServedStr.includes("all states") ||
        areasServedStr.includes("nationwide") ||
        areasServedStr.includes("united states") ||
        areasServedStr.includes("national") ||
        areasServedStr.includes("us") ||
        areasServedStr.includes("global") ||
        areasServedStr.includes("countries") ||
        (selectedState === "NATIONWIDE" && (
          areasServedStr.includes("nationwide") ||
          areasServedStr.includes("all states") ||
          areasServedStr.includes("united states")
        ))
      );

      if (company.name === 'Uber') {
        console.log('UBER - State Filtering Check:');
        console.log('  selectedState:', selectedState);
        console.log('  stateLabel:', stateLabel);
        console.log('  areasServedStr:', areasServedStr);
        console.log('  hasStateMatch:', hasStateMatch);
      }

      if (!hasStateMatch) return false;
    }

    // Country filtering - check if company operates in selected country
    if (selectedCountry) {
      const countryLabel = countries.find(c => c.value === selectedCountry)?.label;
      const hasCountryMatch = company.areasServed && (
        (countryLabel && JSON.stringify(company.areasServed).includes(countryLabel)) ||
        (selectedCountry === "US" && (
          JSON.stringify(company.areasServed).toLowerCase().includes("united states") ||
          JSON.stringify(company.areasServed).toLowerCase().includes("usa") ||
          !JSON.stringify(company.areasServed).toLowerCase().includes("canada") // Assume US if no specific country mentioned
        )) ||
        (selectedCountry === "CA" && JSON.stringify(company.areasServed).toLowerCase().includes("canada"))
      );
      if (!hasCountryMatch) return false;
    }

    // STEP 3: Apply action tab filter
    if (activeTab !== "all") {
      const companyAction = companyActionsState[company.id];
      if (activeTab === "research" && companyAction !== "research") return false;
      if (activeTab === "applied" && companyAction !== "apply") return false;
      if (activeTab === "waitinglist" && companyAction !== "waitinglist") return false;
      if (activeTab === "active" && companyAction !== "active") return false;
      if (activeTab === "other" && companyAction !== "other") return false;
      if (activeTab === "no-action" && companyAction) return false;
    }

    return true;
  });

  // Apply sorting if selected
  const sortedAndFilteredCompanies = [...filteredCompanies];
  if (sortBy === "pay-high-to-low") {
    // Create a pay ranking based on service vertical and known pay patterns
    const getPayRanking = (company: any) => {
      const serviceVertical = company.serviceVertical;
      const serviceType = Array.isArray(serviceVertical) 
        ? serviceVertical.join(' ').toLowerCase() 
        : (serviceVertical?.toLowerCase() || '');
      const companyName = company.name?.toLowerCase() || '';

      // High-paying categories (score 90-100)
      if (serviceType.includes('freight') || serviceType.includes('medical') || 
          companyName.includes('fedex') || companyName.includes('ups') || 
          companyName.includes('amazon logistics') || companyName.includes('dhl')) {
        return 95;
      }

      // Medium-high paying (score 70-89)
      if (serviceType.includes('air transport') || serviceType.includes('vehicle transport') ||
          companyName.includes('roadie') || companyName.includes('deliverr') || 
          companyName.includes('gopuff') || companyName.includes('instacart')) {
        return 80;
      }

      // Medium paying (score 50-69)
      if (serviceType.includes('package delivery') || serviceType.includes('rideshare') ||
          companyName.includes('uber') || companyName.includes('lyft') || 
          companyName.includes('doordash') || companyName.includes('grubhub')) {
        return 60;
      }

      // Lower paying (score 30-49)
      if (serviceType.includes('food') || serviceType.includes('pet transport') ||
          companyName.includes('postmates') || companyName.includes('caviar')) {
        return 40;
      }

      // Default/unknown (score 25)
      return 25;
    };

    sortedAndFilteredCompanies.sort((a, b) => getPayRanking(b) - getPayRanking(a));
  }

  // Enhanced debug output for filtering issues
  const searchLower = searchTerm.toLowerCase().trim();
  if (['texas','california','florida','new york','georgia'].includes(searchLower)) {
    console.log(`${searchLower.toUpperCase()}: ${sortedAndFilteredCompanies.length} companies`);
    if (selectedServiceVertical === 'Rideshare') {
      const rideshareCompanies = sortedAndFilteredCompanies.filter(c => {
        const serviceVerticals = Array.isArray(c.serviceVertical) ? c.serviceVertical : [c.serviceVertical];
        return serviceVerticals.includes('Rideshare');
      });
      console.log(`Rideshare companies in ${searchLower}: ${rideshareCompanies.length}`);
      console.log('Rideshare names:', rideshareCompanies.map(c => c.name));
    }
  }

  // Service vertical categories from database + consolidated rideshare
  const serviceVerticals = [
    "Food",
    "Package Delivery", 
    "Document Delivery",
    "Rideshare", // This will include both "Rideshare" and "Taxi/Rideshare"
    "Freight",
    "Medical",
    "Cannabis Delivery",
    "Pet Transport",
    "Child Transport",
    "Senior Services",
    "Air Transport",
    "Vehicle Transport",
    "Luggage Delivery",
    "Other"
  ];

  // Calculate counts for each service vertical
  const getServiceVerticalCounts = () => {
    const counts: Record<string, number> = {};

    serviceVerticals.forEach(vertical => {
      counts[vertical] = companies.filter(company => {
        if (!company.isActive) return false;

        // Handle array format from database
        const serviceVerticals = Array.isArray(company.serviceVertical) ? company.serviceVertical : [company.serviceVertical];

        if (vertical === 'Rideshare') {
          return serviceVerticals.includes('Rideshare') || serviceVerticals.includes('Taxi/Rideshare');
        } else if (vertical === 'Luggage Delivery') {
          return serviceVerticals.includes('Luggage Delivery') || 
                 (company.description && (
                   company.description.toLowerCase().includes('luggage') ||
                   company.description.toLowerCase().includes('baggage') ||
                   company.description.toLowerCase().includes('lost luggage') ||
                   company.description.toLowerCase().includes('bag delivery')
                 ));
        } else {
          return serviceVerticals.includes(vertical);
        }
      }).length;
    });

    return counts;
  };

  const serviceVerticalCounts = getServiceVerticalCounts();

  // Simplified vehicle type categories - 6 main categories with descriptions
  const vehicleTypes = [
    { value: "Car", label: "Car (includes Car, Sedan, Prius, EV, Hybrid)" },
    { value: "SUV", label: "SUV (includes SUV, Luxury SUV)" },
    { value: "Van", label: "Van (includes Van, Cargo Van, Minivan, Sprinter Van, Shuttle)" },
    { value: "Truck", label: "Truck (includes Truck, Pickup Truck, Box Truck, Tractor-Trailer)" },
    { value: "Bike", label: "Bike (includes Bike, Bicycle, Scooter)" },
    { value: "Other", label: "Other (includes everything else)" }
  ];

  // Employment type options
  const employmentTypes = [
    { value: "Independent Contractor", label: "Independent Contractor (1099)" },
    { value: "Employee", label: "Employee (W-2)" },
    { value: "Both", label: "Both" }
  ];

  // Contract type options for filtering dedicated routes
  const contractTypeOptions = [
    { value: "Dedicated Routes", label: "Dedicated Routes", count: 13 },
    { value: "Contract Routes", label: "Contract Routes", count: 7 },
    { value: "Scheduled Routes", label: "Scheduled Routes", count: 5 },
    { value: "Independent Contractor", label: "Independent Contractor", count: 427 },
    { value: "Employee", label: "Employee (W-2)", count: 29 }
  ];



  // Dynamic location list from companies' areas served
  const locations = Array.from(new Set((companies || [])
    .flatMap(c => {
      if (!c.areasServed) return [];
      return Array.isArray(c.areasServed) ? c.areasServed : [c.areasServed];
    })
    .filter(Boolean)
    .sort()
  ));

  // Filter locations based on search term
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(locationSearchTerm.toLowerCase())
  ).slice(0, 10); // Limit to 10 suggestions for performance

  const contractTypes = Array.from(new Set((companies || []).map(c => c.contractType).filter(Boolean)));

  // Calculate tab counts - use "apply" to match backend storage
  const tabCounts = {
    all: sortedAndFilteredCompanies.length,
    research: companies.filter(c => companyActionsState[c.id] === "research").length,
    applied: companies.filter(c => companyActionsState[c.id] === "apply").length,
    waitinglist: companies.filter(c => companyActionsState[c.id] === "waitinglist").length,
    active: companies.filter(c => companyActionsState[c.id] === "active").length,
    other: companies.filter(c => companyActionsState[c.id] === "other").length,
    "no-action": companies.filter(c => !companyActionsState[c.id]).length,
  };



  const handleViewProfile = (company: any) => {
    setProfileCompany(company);
    setShowCompanyProfile(true);
  };

  const handleSaveCompanyProfile = (updatedCompany: any) => {
    updateCompanyMutation.mutate({ 
      companyId: updatedCompany.id, 
      data: updatedCompany 
    });
    setShowCompanyProfile(false);
  };

  // Load saved actions into state
  useEffect(() => {
    if (companyActions && Array.isArray(companyActions)) {
      const actionsMap: Record<number, string> = {};
      companyActions.forEach((action: any) => {
        actionsMap[action.companyId] = action.action;
      });
      setCompanyActionsState(actionsMap);
    }
  }, [companyActions]);

  // Generate smart auto-suggestions
  useEffect(() => {
    if (searchTerm.length >= 1 && companies.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      const suggestionSet = new Set<string>();

      // Company name suggestions - prioritize companies that start with the search term
      const companiesStartingWith = companies.filter(company => 
        company.name.toLowerCase().startsWith(searchLower)
      );
      const companiesContaining = companies.filter(company => 
        company.name.toLowerCase().includes(searchLower) && 
        !company.name.toLowerCase().startsWith(searchLower)
      );

      // Add companies that start with search term first
      companiesStartingWith.forEach(company => {
        suggestionSet.add(company.name);
      });

      // Then add companies that contain the search term
      companiesContaining.slice(0, 5).forEach(company => {
        suggestionSet.add(company.name);
      });

      // Service vertical suggestions
      const allServiceVerticals = new Set<string>();
      companies.forEach(company => {
        if (Array.isArray(company.serviceVertical)) {
          company.serviceVertical.forEach(sv => allServiceVerticals.add(sv));
        } else if (company.serviceVertical) {
          allServiceVerticals.add(company.serviceVertical);
        }
      });

      allServiceVerticals.forEach(vertical => {
        if (vertical.toLowerCase().includes(searchLower)) {
          suggestionSet.add(vertical);
        }
      });

      // Location suggestions (states and major areas)
      const locationSuggestions = [
        'Texas', 'California', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 
        'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'Nationwide', 'United States'
      ];

      locationSuggestions.forEach(location => {
        if (location.toLowerCase().includes(searchLower)) {
          suggestionSet.add(location);
        }
      });

      // Popular search terms
      const popularTerms = [
        'Amazon', 'Uber', 'DoorDash', 'Instacart', 'Lyft', 'Grubhub', 'UberEats', 
        'Shipt', 'Postmates', 'Food delivery', 'Package delivery', 'Rideshare', 'Medical'
      ];

      popularTerms.forEach(term => {
        if (term.toLowerCase().includes(searchLower)) {
          suggestionSet.add(term);
        }
      });

      const sortedSuggestions = Array.from(suggestionSet)
        .slice(0, 8) // Limit to 8 suggestions
        .map(suggestion => ({
          text: suggestion,
          type: companies.some(c => c.name === suggestion) ? 'company' : 
                allServiceVerticals.has(suggestion) ? 'service' : 'location'
        }))
        .sort((a, b) => {
          // Sort companies that start with search term first
          const aStartsWith = a.text.toLowerCase().startsWith(searchLower);
          const bStartsWith = b.text.toLowerCase().startsWith(searchLower);

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          // Then sort by type priority: company > service > location
          const typeOrder: { [key: string]: number } = { company: 0, service: 1, location: 2 };
          if (typeOrder[a.type] !== typeOrder[b.type]) {
            return typeOrder[a.type] - typeOrder[b.type];
          }

          // Finally sort alphabetically
          return a.text.localeCompare(b.text);
        });

      setSuggestions(sortedSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [searchTerm, companies]);

  // Auto-scroll to company if navigated from reminders
  useEffect(() => {
    const scrollToCompanyId = localStorage.getItem('scrollToCompanyId');
    const highlightReminderId = localStorage.getItem('highlightReminderId');

    if (scrollToCompanyId && companies.length > 0) {
      const companyId = parseInt(scrollToCompanyId);
      const companyElement = document.getElementById(`company-${companyId}`);

      if (companyElement) {
        setTimeout(() => {
          if (highlightReminderId) {
            // First, scroll to the company card
            companyElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });

            // Try to find and highlight the reminder element on the main page first
            const findAndHighlightReminder = () => {
              const reminderElement = document.querySelector(`[data-reminder-id="${highlightReminderId}"]`);
              console.log(`Looking for reminder element with ID: ${highlightReminderId}`, reminderElement);
              if (reminderElement) {
                console.log('Found reminder element, highlighting it');
                // Scroll to the reminder specifically
                reminderElement.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
                // Add bright yellow highlight for the specific reminder
                reminderElement.classList.add('ring-4', 'ring-yellow-400', 'ring-opacity-90', 'bg-yellow-100', 'shadow-lg');
                setTimeout(() => {
                  reminderElement.classList.remove('ring-4', 'ring-yellow-400', 'ring-opacity-90', 'bg-yellow-100', 'shadow-lg');
                }, 6000); // Keep highlight longer for better visibility
                return true;
              } else {
                console.log('Reminder element not found on main page');
              }
              return false;
            };

            // Try to find reminder immediately
            if (!findAndHighlightReminder()) {
              // If not found on main page, try opening the company modal
              const company = companies.find(c => c.id === companyId);
              if (company) {
                setSelectedCompany(company);
                // Wait for modal to open, then try again
                setTimeout(() => {
                  findAndHighlightReminder();
                }, 800);
              }
            }
          } else {
            // Just scroll to the company card with blue highlight
            companyElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            companyElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
            setTimeout(() => {
              companyElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
            }, 3000);
          }
        }, 100);
      }

      localStorage.removeItem('scrollToCompanyId');
      localStorage.removeItem('highlightReminderId');
    }
  }, [companies]);

  // Save company action mutation
  const saveActionMutation = useMutation({
    mutationFn: async ({ companyId, action }: { companyId: number; action: string }) => {
      return await apiRequest("/api/company-actions", { method: "POST", body: { companyId, action } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-actions"] });
      // Invalidate recommendations cache to reflect company action changes immediately
      queryClient.invalidateQueries({ queryKey: ["/api/gigbot/recommendations"] });
    },
  });



  const handleAction = (companyId: number, action: string) => {
    // Update local state to show action immediately
    setCompanyActionsState(prev => ({ ...prev, [companyId]: action || '' }));

    // Save to database
    saveActionMutation.mutate({ companyId, action });

    if (action === 'research') {
      toast({
        title: "Researching Company",
        description: "Company marked for research. Setting saved permanently.",
      });
    } else if (action === 'apply') {
      toast({
        title: "Ready to Apply", 
        description: "Company marked as ready to apply. Setting saved permanently.",
      });
    } else if (action === 'active') {
      toast({
        title: "Status Updated",
        description: "Company marked as active. Setting saved permanently.",
      });
    } else if (action === '' || action === null) {
      toast({
        title: "Action Reset",
        description: "Company returned to neutral state.",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedServiceVertical("");
    setSelectedVehicleType("");
    setSelectedContractType("");
    setSelectedLocation("");
    setSelectedEmploymentType("");
    setLocationSearchTerm("");
    setShowLocationSuggestions(false);
    setSelectedState("");
    setSelectedCountry("");
    setSortBy("");
  };

  const handleLocationInputChange = (value: string) => {
    setLocationSearchTerm(value);
    setSelectedLocation(value);
    setShowLocationSuggestions(value.length > 0);
  };

  const handleLocationSuggestionClick = (location: string) => {
    setLocationSearchTerm(location);
    setSelectedLocation(location);
    setShowLocationSuggestions(false);
  };

  const handleLocationInputFocus = () => {
    if (locationSearchTerm.length > 0) {
      setShowLocationSuggestions(true);
    }
  };

  const handleLocationInputBlur = () => {
    // Delay hiding to allow click on suggestions
    setTimeout(() => {
      setShowLocationSuggestions(false);
    }, 200);
  };

  // Download Companies List as HTML/PDF
  const handleDownloadCompaniesList = () => {
    const activeCompanies = companies.filter(c => c.isActive !== false);
    const grouped = activeCompanies.reduce((acc: { [key: string]: Company[] }, company) => {
      const serviceType = company.serviceVertical || 'Other';
      if (!acc[serviceType]) {
        acc[serviceType] = [];
      }
      acc[serviceType].push(company);
      return acc;
    }, {});

    const sortedTypes = Object.keys(grouped).sort();

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete List of Gig Opportunities - DriverGigsPro</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #f9fafb;
    }
    h1 {
      font-size: 32px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 3px solid #3b82f6;
    }
    .subtitle {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 30px;
    }
    .service-section {
      background: white;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      page-break-inside: avoid;
    }
    .service-header {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .company-count {
      font-size: 14px;
      color: #6b7280;
      font-weight: 400;
    }
    .companies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .company-card {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 12px;
      background: #fafafa;
      page-break-inside: avoid;
    }
    .company-name {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }
    .company-detail {
      font-size: 13px;
      color: #4b5563;
      margin-bottom: 4px;
    }
    .company-detail strong {
      color: #1f2937;
      font-weight: 600;
    }
    .company-website {
      font-size: 12px;
      color: #3b82f6;
      word-break: break-all;
      margin-top: 6px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    @media print {
      body { background: white; padding: 20px; }
      .service-section { box-shadow: none; page-break-inside: avoid; }
      .company-card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>Complete List of Gig Opportunities</h1>
  <p class="subtitle">
    ${activeCompanies.length} verified companies organized by service type
  </p>

  ${sortedTypes.map(serviceType => `
    <div class="service-section">
      <div class="service-header">
        ${serviceType}
        <span class="company-count">(${grouped[serviceType].length} companies)</span>
      </div>
      <div class="companies-grid">
        ${grouped[serviceType].map(company => `
          <div class="company-card">
            <div class="company-name">${company.name}</div>
            ${company.contractType ? `<div class="company-detail"><strong>Contract:</strong> ${company.contractType}</div>` : ''}
            ${company.vehicleTypes ? `<div class="company-detail"><strong>Vehicles:</strong> ${Array.isArray(company.vehicleTypes) ? company.vehicleTypes.join(', ') : company.vehicleTypes}</div>` : ''}
            ${company.averagePay ? `<div class="company-detail"><strong>Pay:</strong> ${company.averagePay}</div>` : ''}
            ${company.employmentType ? `<div class="company-detail"><strong>Type:</strong> ${company.employmentType}</div>` : ''}
            ${company.operatingLocations ? `<div class="company-detail"><strong>Locations:</strong> ${Array.isArray(company.operatingLocations) ? company.operatingLocations.slice(0, 3).join(', ') : company.operatingLocations}</div>` : ''}
            ${company.website ? `<div class="company-website">${company.website}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')}

  <div class="footer">
    <p><strong>DriverGigsPro</strong> - Complete Gig Economy Management Platform</p>
    <p style="margin-top: 8px; font-size: 12px;">
      To save as PDF: Use your browser's Print function (Ctrl+P / Cmd+P) and select "Save as PDF"
    </p>
  </div>
</body>
</html>`;

    // Create download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DriverGigsPro_Companies_List_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Open the HTML file and use your browser's Print-to-PDF feature to save as PDF.",
    });
  };

  // AI Assistant Search function
  const handleAIAssistantSearch = async () => {
    setIsAISearching(true);

    // Show initial message explaining what the AI is doing
    toast({
      title: "AI Research Started", 
      description: "AI Assistant is researching legitimate gig companies and will show you found companies for approval.",
      duration: 5000,
    });

    try {
      const response = await fetch('/api/ai-assistant/search-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'Research and find new gig work companies that are not currently in our database with complete information including contact details, service types, and requirements.' 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to search for companies');
      }

      const result = await response.json();

      if (result.success && result.foundCompanies && result.foundCompanies.length > 0) {
        setFoundCompanies(result.foundCompanies);
        setSelectedFoundCompanies(result.foundCompanies); // Select all by default
        setShowFoundCompaniesModal(true);

        toast({
          title: "Companies Found",
          description: `AI found ${result.foundCompanies.length} new companies. Review and approve to add them.`,
        });
      } else {
        toast({
          title: "No New Companies",
          description: "AI didn't find any new companies that aren't already in your database.",
        });
      }

    } catch (error) {
      console.error('AI search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to complete AI search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAISearching(false);
    }
  };

  // Add approved companies function
  const handleAddApprovedCompanies = async () => {
    if (selectedFoundCompanies.length === 0) {
      toast({
        title: "No Companies Selected",
        description: "Please select at least one company to add.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/ai-assistant/add-approved-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          approvedCompanies: selectedFoundCompanies
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add approved companies');
      }

      const result = await response.json();

      // Refresh companies list to show new additions
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });

      // Close modal and reset state
      setShowFoundCompaniesModal(false);
      setFoundCompanies([]);
      setSelectedFoundCompanies([]);

      toast({
        title: "Companies Added",
        description: `Successfully added ${result.companiesAdded} companies: ${result.addedCompanies?.join(', ')}`,
      });

    } catch (error) {
      console.error('Add companies error:', error);
      toast({
        title: "Failed to Add Companies",
        description: "Unable to add selected companies. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle duplicate cleanup
  const handleCleanupDuplicates = async () => {
    setIsCleaningDuplicates(true);

    toast({
      title: "Starting Cleanup",
      description: "Analyzing database for duplicate companies...",
      duration: 3000,
    });

    try {
      const response = await fetch('/api/companies/cleanup-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to cleanup duplicates');
      }

      const result = await response.json();

      // Refresh companies list to show changes
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });

      toast({
        title: "Cleanup Complete",
        description: `${result.mergedGroups} duplicate groups cleaned up, ${result.deletedCompanies} companies removed`,
      });

    } catch (error) {
      console.error('Cleanup error:', error);
      toast({
        title: "Cleanup Failed",
        description: "Unable to cleanup duplicates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCleaningDuplicates(false);
    }
  };

  return (
    <div className={`${CONTAINER.wide} py-4 md:py-6`}>
      {/* Header Section */}
      <div className="mb-4 md:mb-6">
        {/* Top right Search Criteria button */}
        <div className="flex justify-end mb-2">
          <Link href="/search-criteria">
            <Button
              className={`bg-gray-600 hover:bg-gray-700 text-white ${TOUCH_FRIENDLY.button}`}
              size="sm"
              data-testid="button-search-criteria"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Criteria
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
              <Building2 className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-600" />
              Driver Opportunities
            </h1>
            <div className="mt-2 flex items-center">
              <div className="bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
                <p className="text-lg font-semibold text-blue-800 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  {filteredCompanies.length} opportunities available
                </p>
              </div>
            </div>
          </div>

          <div className={RESPONSIVE_FLEX.wrap}>
            {/* Primary action buttons */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <Button
                onClick={() => setShowCompanyListModal(true)}
                className={`bg-blue-600 hover:bg-blue-700 text-white ${TOUCH_FRIENDLY.button} flex-1 sm:flex-none`}
                size="sm"
                data-testid="button-company-list"
              >
                <Building2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">List of Opportunities</span>
                <span className="sm:hidden">List</span>
              </Button>
              <Button
                onClick={() => setShowAddCompanyModal(true)}
                className={`bg-green-600 hover:bg-green-700 text-white ${TOUCH_FRIENDLY.button} flex-1 sm:flex-none`}
                size="sm"
                data-testid="button-add-company"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add Company</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>

            {/* Secondary action buttons */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <Button
                onClick={() => setShowRecommendationCriteria(!showRecommendationCriteria)}
                className={`bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white ${TOUCH_FRIENDLY.button} flex-1 sm:flex-none`}
                size="sm"
                data-testid="button-recommendation-criteria"
              >
                📋 <span className="hidden sm:inline ml-1">Criteria</span>
              </Button>
              <Button
                onClick={handleCleanupDuplicates}
                disabled={isCleaningDuplicates}
                className={`bg-orange-600 hover:bg-orange-700 text-white ${TOUCH_FRIENDLY.button} flex-1 sm:flex-none`}
                size="sm"
                data-testid="button-cleanup-duplicates"
              >
                {isCleaningDuplicates ? (
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-1" />
                )}
                <span className="hidden sm:inline">{isCleaningDuplicates ? "Cleaning..." : "Remove Duplicates"}</span>
                <span className="sm:hidden">{isCleaningDuplicates ? "..." : "Clean"}</span>
              </Button>
              <Button
                variant={showDeleted ? "default" : "outline"}
                onClick={() => setShowDeleted(!showDeleted)}
                className={`${TOUCH_FRIENDLY.button} flex-1 sm:flex-none`}
                size="sm"
                data-testid="button-toggle-deleted"
              >
                {showDeleted ? "Active" : "Deleted"}
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-3 md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {/* Search with Auto-Suggest */}
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search companies, services, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 1 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className={`pl-10 ${TOUCH_FRIENDLY.input} text-sm`}
                  data-testid="input-search-companies"
                />

                {/* Auto-suggest dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                    <div className="py-1 max-h-64 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                          onClick={() => {
                            setSearchTerm(suggestion.text);
                            setShowSuggestions(false);

                            // If it's a company suggestion, find and select the company
                            if (suggestion.type === 'company') {
                              const company = companies.find(c => c.name === suggestion.text);
                              if (company) {
                                setSelectedCompany(company);
                              }
                            }
                          }}
                        >
                          <span className="flex items-center">
                            {suggestion.type === 'company' && (
                              <Building2 className="w-3 h-3 mr-2 text-blue-500" />
                            )}
                            {suggestion.type === 'service' && (
                              <Briefcase className="w-3 h-3 mr-2 text-green-500" />
                            )}
                            {suggestion.type === 'location' && (
                              <MapPin className="w-3 h-3 mr-2 text-orange-500" />
                            )}
                            {suggestion.text}
                          </span>
                          <span className="text-xs text-gray-400 capitalize">
                            {suggestion.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Service Vertical Filter */}
            <Select value={selectedServiceVertical} onValueChange={setSelectedServiceVertical}>
              <SelectTrigger className={`${TOUCH_FRIENDLY.select} text-sm min-w-0`} data-testid="select-service-vertical">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                {serviceVerticals.map(vertical => (
                  <SelectItem key={vertical} value={vertical}>
                    <div className="flex justify-between items-center w-full">
                      <span>{vertical}</span>
                      <span className="text-xs text-gray-500 ml-2">{serviceVerticalCounts[vertical]}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Vehicle Type Filter */}
            <Select value={selectedVehicleType} onValueChange={setSelectedVehicleType}>
              <SelectTrigger className={`${TOUCH_FRIENDLY.select} text-sm min-w-0`}>
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Employment Type Filter */}
            <Select value={selectedEmploymentType} onValueChange={setSelectedEmploymentType}>
              <SelectTrigger className={`${TOUCH_FRIENDLY.select} text-sm min-w-0`}>
                <SelectValue placeholder="Employment Type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Contract Type Filter */}
            <Select value={selectedContractType} onValueChange={setSelectedContractType}>
              <SelectTrigger className={`${TOUCH_FRIENDLY.select} text-sm min-w-0`}>
                <SelectValue placeholder="Contract Type" />
              </SelectTrigger>
              <SelectContent>
                {contractTypeOptions.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex justify-between items-center w-full">
                      <span>{type.label}</span>
                      <span className="text-xs text-gray-500 ml-2">{type.count}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={`${TOUCH_FRIENDLY.select} text-sm min-w-0`}>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pay-high-to-low">Highest Paid to Lowest</SelectItem>
              </SelectContent>
            </Select>

            {/* State Filter */}
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className={`${TOUCH_FRIENDLY.select} text-sm min-w-0`} data-testid="select-state">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {usStates.map(state => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Country Filter */}
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className={`${TOUCH_FRIENDLY.select} text-sm min-w-0`} data-testid="select-country">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button variant="outline" onClick={clearFilters} className={`${TOUCH_FRIENDLY.button} text-sm`} data-testid="button-clear-filters">
              Clear
            </Button>
          </div>
        </Card>

        {/* Action Filter Tabs */}
        <Card className="p-2 mb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap shrink-0">Status:</span>
            {[
              { key: "all", label: "All", icon: Building2, color: "blue" },
              { key: "research", label: "Researching", icon: RefreshCw, color: "yellow" },
              { key: "applied", label: "Applied", icon: UserPlus, color: "blue" },
              { key: "waitinglist", label: "Wait List", icon: Clock, color: "orange" },
              { key: "active", label: "Active", icon: CheckCircle, color: "green" },
              { key: "other", label: "Other", icon: HelpCircle, color: "purple" },
            ].map((tab) => {
              const getActiveStyles = () => {
                switch(tab.key) {
                  case "research":
                    return "bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 border-amber-700 text-white";
                  case "applied":
                    return "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border-blue-500 text-white";
                  case "waitinglist":
                    return "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-orange-500 text-white";
                  case "active":
                    return "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-green-700 text-white shadow-md";
                  case "other":
                    return "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-purple-500 text-white";
                  default:
                    return "bg-blue-600 hover:bg-blue-700 text-white";
                }
              };

              const getInactiveHoverStyles = () => {
                switch(tab.key) {
                  case "research":
                    return "hover:bg-amber-50 hover:text-amber-800 hover:border-amber-400";
                  case "applied":
                    return "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300";
                  case "waitinglist":
                    return "hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300";
                  case "active":
                    return "hover:bg-green-50 hover:text-green-700 hover:border-green-300";
                  case "other":
                    return "hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300";
                  default:
                    return "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300";
                }
              };

              const getBadgeStyles = () => {
                if (activeTab === tab.key) {
                  // For active state, use semi-transparent white for all badges
                  return "bg-white/20 text-white";
                }
                // For inactive state, match the button's theme color
                switch(tab.key) {
                  case "research":
                    return "bg-amber-100 text-amber-800";
                  case "applied":
                    return "bg-blue-100 text-blue-700";
                  case "waitinglist":
                    return "bg-orange-100 text-orange-700";
                  case "active":
                    return "bg-green-100 text-green-700";
                  case "other":
                    return "bg-purple-100 text-purple-700";
                  default:
                    return "bg-blue-100 text-blue-700";
                }
              };

              return (
              <Button
                key={tab.key}
                variant="outline"
                size="sm"
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap h-7 px-2 text-xs shrink-0 snap-start ${
                  activeTab === tab.key
                    ? getActiveStyles()
                    : `bg-white border-gray-300 text-gray-700 ${getInactiveHoverStyles()}`
                }`}
              >
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.label}
                <Badge 
                  variant="secondary" 
                  className={`ml-1 px-1 text-xs h-4 ${getBadgeStyles()}`}
                >
                  {tabCounts[tab.key as keyof typeof tabCounts]}
                </Badge>
              </Button>
            );
            })}
          </div>
        </Card>
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedAndFilteredCompanies.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedServiceVertical || selectedVehicleType 
              ? "Try adjusting your search criteria or filters"
              : "No companies available at this time"
            }
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 max-w-full overflow-hidden px-2 sm:px-0">
          {sortedAndFilteredCompanies.map((company: any) => {
            // Add current action state to company
            const companyWithAction = {
              ...company,
              currentAction: companyActionsState[company.id] || null
            };

            return (
              <div key={company.id} id={`company-${company.id}`}>
                <CompanyCard
                  company={companyWithAction}
                  onView={() => setSelectedCompany(company)}
                  onViewProfile={() => handleViewProfile(company)}
                  onDelete={() => handleDeleteClick(company)}
                  showActionDropdown={true}
                  onAction={(action) => handleAction(company.id, action)}
                  className={showDeleted && company.isDeleted ? "opacity-60 border-red-200" : ""}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Company Detail Modal */}
      {selectedCompany && (
        <CompanyProfileModal
          company={selectedCompany}
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}

      {/* Company Profile Modal */}
      {profileCompany && (
        <CompanyProfileModal
          company={profileCompany}
          isOpen={showCompanyProfile}
          onClose={() => setShowCompanyProfile(false)}
          onSave={handleSaveCompanyProfile}
          isEditable={true}
          showEditButton={true}
        />
      )}

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={showAddCompanyModal}
        onClose={() => setShowAddCompanyModal(false)}
        section="opportunities"
      />

      {/* Found Companies Approval Modal */}
      <Dialog open={showFoundCompaniesModal} onOpenChange={setShowFoundCompaniesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-purple-600" />
              <span>AI Found {foundCompanies.length} New Companies</span>
            </DialogTitle>
            <DialogDescription>
              Review the companies found by AI and select which ones to add to your database.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Select All/None Controls */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFoundCompanies(foundCompanies)}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFoundCompanies([])}
                >
                  Select None
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {selectedFoundCompanies.length} of {foundCompanies.length} selected
              </div>
            </div>

            {/* Companies List */}
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {foundCompanies.map((company, index) => (
                <div key={index} className="border rounded-lg p-5 space-y-3 hover:border-purple-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedFoundCompanies.includes(company)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFoundCompanies(prev => [...prev, company]);
                          } else {
                            setSelectedFoundCompanies(prev => prev.filter(c => c !== company));
                          }
                        }}
                        className="mt-1"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{company.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">{company.serviceVertical}</Badge>
                          <Badge variant="outline" className="border-green-300 text-green-700">{company.averagePay}</Badge>
                          {company.contractType && (
                            <Badge variant="outline" className="border-blue-300 text-blue-700">{company.contractType}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 ml-6">
                    {/* Basic Company Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {company.headquarters && (
                        <div><span className="font-medium">HQ:</span> {company.headquarters}</div>
                      )}
                      {company.website && (
                        <div><span className="font-medium">Website:</span> {company.website}</div>
                      )}
                      {company.contractType && (
                        <div><span className="font-medium">Contract:</span> {company.contractType}</div>
                      )}
                      {company.yearEstablished && (
                        <div><span className="font-medium">Founded:</span> {company.yearEstablished}</div>
                      )}
                    </div>

                    {/* Driver Requirements */}
                    <div className="border-t border-gray-200 pt-3">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        What Type of Drivers They Hire
                      </h4>
                      <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                        {company.vehicleTypes && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="font-medium text-blue-800">Vehicles:</span>
                            <span className="text-blue-700">{Array.isArray(company.vehicleTypes) ? company.vehicleTypes.join(', ') : company.vehicleTypes}</span>
                          </div>
                        )}
                        {company.licenseRequirements && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="font-medium text-blue-800">License:</span>
                            <span className="text-blue-700">{company.licenseRequirements}</span>
                          </div>
                        )}
                        {company.insuranceRequirements && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="font-medium text-blue-800">Insurance:</span>
                            <span className="text-blue-700">{company.insuranceRequirements}</span>
                          </div>
                        )}
                        {company.certificationsRequired && company.certificationsRequired.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="font-medium text-blue-800">Certifications:</span>
                            <span className="text-blue-700">{Array.isArray(company.certificationsRequired) ? company.certificationsRequired.join(', ') : company.certificationsRequired}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Company Profile */}
                    {(company.businessModel || company.companyMission || company.targetCustomers || company.companyCulture) && (
                      <div className="border-t border-gray-200 pt-3">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Company Profile
                        </h4>
                        <div className="bg-green-50 rounded-lg p-3 space-y-2">
                          {company.businessModel && (
                            <div className="text-sm">
                              <span className="font-medium text-green-800">Business Model:</span>
                              <span className="text-green-700 ml-1">{company.businessModel}</span>
                            </div>
                          )}
                          {company.companyMission && (
                            <div className="text-sm">
                              <span className="font-medium text-green-800">Mission:</span>
                              <span className="text-green-700 ml-1">{company.companyMission}</span>
                            </div>
                          )}
                          {company.targetCustomers && (
                            <div className="text-sm">
                              <span className="font-medium text-green-800">Target Market:</span>
                              <span className="text-green-700 ml-1">{company.targetCustomers}</span>
                            </div>
                          )}
                          {company.companyCulture && (
                            <div className="text-sm">
                              <span className="font-medium text-green-800">Culture:</span>
                              <span className="text-green-700 ml-1">{company.companyCulture}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Service Areas */}
                    {company.areasServed && (
                      <div className="border-t pt-2">
                        <h4 className="font-medium text-gray-700 mb-2">Service Areas</h4>
                        <div className="text-sm text-gray-600">
                          {Array.isArray(company.areasServed) ? company.areasServed.join(', ') : company.areasServed}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setShowFoundCompaniesModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddApprovedCompanies}
                disabled={selectedFoundCompanies.length === 0}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Add {selectedFoundCompanies.length} Companies
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Company List Modal */}
      <Dialog open={showCompanyListModal} onOpenChange={setShowCompanyListModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Complete List of Gig Opportunities
                </DialogTitle>
                <DialogDescription>
                  All {companies.filter(c => c.isActive !== false).length} companies organized by service types
                </DialogDescription>
              </div>
              <Button
                onClick={handleDownloadCompaniesList}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                data-testid="button-download-companies-list"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh] space-y-6">
            {sortedServiceTypes.map(serviceType => (
              <div key={serviceType} className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    {serviceType}
                  </h3>
                  <Badge variant="outline" className="ml-3">
                    {groupedCompanies[serviceType].length} companies
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupedCompanies[serviceType].map((company: Company) => (
                    <div
                      key={company.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setProfileCompany(company);
                        setShowCompanyProfile(true);
                        setShowCompanyListModal(false);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {company.name}
                          </h4>
                          <div className="space-y-1">
                            {company.contractType && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Contract:</span> {company.contractType}
                              </div>
                            )}
                            {company.vehicleTypes && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Vehicles:</span> {Array.isArray(company.vehicleTypes) ? company.vehicleTypes.slice(0, 2).join(', ') : company.vehicleTypes}
                                {Array.isArray(company.vehicleTypes) && company.vehicleTypes.length > 2 && '...'}
                              </div>
                            )}
                            {company.averagePay && (
                              <div className="text-xs text-green-600 font-medium">
                                {company.averagePay}
                              </div>
                            )}
                          </div>
                        </div>
                        <Eye className="w-4 h-4 text-blue-600 ml-2 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowCompanyListModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recommendation Criteria Modal */}
      <Dialog open={showRecommendationCriteria} onOpenChange={setShowRecommendationCriteria}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-800">📋 How We Choose Recommendations</DialogTitle>
            <DialogDescription>
              Understanding the criteria behind our smart recommendation system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-green-700">
            <div>
              <h5 className="font-bold text-green-800 mb-2">📊 Scoring System (Base: 50 points)</h5>
              <ul className="space-y-1 text-xs pl-2">
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
              <ul className="space-y-1 text-xs pl-2">
                <li>Companies you're already <strong>active</strong> with</li>
                <li>Companies you've <strong>dismissed</strong> previously</li>
                <li>Companies not operating in your area</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-green-800 mb-2">🎯 Recommendation Priority</h5>
              <ul className="space-y-1 text-xs pl-2">
                <li><strong>80+ points:</strong> Perfect match for your profile</li>
                <li><strong>70+ points:</strong> Great fit based on your experience</li>
                <li><strong>60+ points:</strong> Good opportunity to consider</li>
                <li><strong>Top 5</strong> highest-scoring companies are shown</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-green-800 mb-2">🔄 Fresh Data</h5>
              <ul className="space-y-1 text-xs pl-2">
                <li>Updated in real-time when you change company status</li>
                <li>Recommendations refresh immediately after status changes</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Warning Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white max-w-md">
          <AlertDialogHeader className="bg-white">
            <AlertDialogTitle className="text-red-600 bg-white">⚠️ Warning: Permanent Deletion</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 bg-white">
              <p className="bg-white">
                You are about to <strong>permanently delete</strong> "{companyToDelete?.name}" from the entire system. 
                This action cannot be undone.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800 font-medium">
                  💡 Consider instead: 
                  <br />• Change to "Inactive" to hide it while keeping data intact
                  <br />• Use "Whitelist" if this company is fake/fraudulent (prevents future re-entry)
                </p>
              </div>

              <p className="text-sm text-gray-600 bg-white">
                What would you like to do?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="outline"
              onClick={handleChangeStatusToInactive}
              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300"
            >
              Change to Inactive (Recommended)
            </Button>
            <Button
              variant="outline"
              onClick={handleWhitelistCompany}
              className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-300"
            >
              🚫 Mark as a Fake Company
            </Button>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Permanently Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}