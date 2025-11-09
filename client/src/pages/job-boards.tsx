import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  ExternalLink,
  Star,
  Users,
  Briefcase,
  MapPin,
  ArrowRight,
  FileText,
  Save
} from "lucide-react";

// General job boards - major platforms for broad job searching
const JOB_BOARDS = [
  {
    name: "Indeed",
    url: "https://www.indeed.com/jobs?q=delivery+driver",
    description: "World's largest job site with comprehensive delivery opportunities",
    type: "Major Platform",
    category: "general",
    rating: 4.8,
    jobCount: "50,000+",
    location: "Global",
    features: ["🔍 Advanced Search", "📊 Salary Insights", "📝 Company Reviews", "🔔 Job Alerts"]
  },
  {
    name: "ZipRecruiter",
    url: "https://www.ziprecruiter.com/Jobs/Delivery-Driver",
    description: "AI-powered job matching for delivery and logistics positions",
    type: "AI Matching",
    category: "general",
    rating: 4.7,
    jobCount: "40,000+",
    location: "US",
    features: ["🤖 Smart Matching", "⚡ One-Click Apply", "📈 Market Insights", "💰 Salary Range"]
  },
  {
    name: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs/search/?keywords=delivery%20driver",
    description: "Professional networking with delivery and logistics opportunities",
    type: "Professional",
    category: "professional",
    rating: 4.6,
    jobCount: "30,000+",
    location: "Global",
    features: ["🤝 Networking", "🏢 Company Insights", "📋 Professional Profiles", "💼 Corporate Jobs"]
  },
  {
    name: "FlexJobs",
    url: "https://www.flexjobs.com/search?search=delivery+driver",
    description: "Flexible and remote-friendly delivery opportunities",
    type: "Flexible",
    category: "flexible",
    rating: 4.3,
    jobCount: "8,000+",
    location: "US",
    features: ["🏠 Remote Options", "⏰ Flexible Schedule", "✅ Vetted Jobs", "🔒 Scam-Free"]
  },
  {
    name: "SimplyHired", 
    url: "https://www.simplyhired.com/search?q=delivery+driver",
    description: "Job aggregation platform with comprehensive filtering",
    type: "Aggregator", 
    category: "general",
    rating: 4.2,
    jobCount: "35,000+",
    location: "Global",
    features: ["🔍 Job Aggregation", "📊 Salary Estimates", "🌍 Wide Coverage", "🎯 Local Focus"]
  },
  {
    name: "Jooble",
    url: "https://jooble.org/jobs-delivery+driver",
    description: "Global job search engine aggregating opportunities from thousands of websites",
    type: "Aggregator",
    category: "general", 
    rating: 4.3,
    jobCount: "25,000+",
    location: "Global",
    features: ["🌍 International Coverage", "🔍 Multi-Source Search", "📱 Mobile Friendly", "🎯 Location-Based Results"]
  },
  {
    name: "Monster",
    url: "https://www.monster.com/jobs/search?q=delivery-driver",
    description: "Career platform with focus on full-time delivery positions",
    type: "Established",
    category: "general",
    rating: 4.1,
    jobCount: "20,000+",
    location: "US",
    features: ["📈 Career Tools", "💼 Full-Time Focus", "🎯 Local Jobs", "📋 Resume Builder"]
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com/Job/delivery-driver-jobs-SRCH_KO0,15.htm", 
    description: "Job platform with company insights and salary transparency",
    type: "Transparent",
    category: "general",
    rating: 4.4,
    jobCount: "25,000+",
    location: "Global",
    features: ["💰 Salary Data", "🏢 Company Reviews", "📊 Market Analysis", "⭐ Employee Ratings"]
  },
  {
    name: "Craigslist",
    url: "https://craigslist.org/search/jjj?query=delivery+driver",
    description: "Local classified ads with direct employer contact",
    type: "Local",
    category: "local",
    rating: 3.8,
    jobCount: "15,000+",
    location: "US",
    features: ["📍 Local Focus", "💰 Direct Contact", "🚛 Independent Contractors", "🏪 Small Businesses"]
  },
  {
    name: "Workwheel",
    url: "https://workwheel.com",
    description: "Local delivery jobs and gig opportunities for drivers",
    type: "Local Gigs",
    category: "local",
    rating: 4.1,
    jobCount: "4,000+",
    location: "US",
    features: ["📍 Local Focus", "🚗 Personal Vehicle", "⚡ Quick Apply", "💼 Part-Time Options"]
  },
  {
    name: "FindRFP.com",
    url: "https://findrfp.com",
    description: "Government contract database for courier services, medical deliveries, and document transport",
    type: "Government Contracts",
    category: "specialized",
    rating: 4.4,
    jobCount: "1,000+",
    location: "US & Canada",
    features: ["🏛️ Government Contracts", "📋 RFP Database", "💰 Higher Pay Rates", "📊 Contract Alerts", "🔐 Security Clearance Jobs"]
  },
  {
    name: "Dice",
    url: "https://www.dice.com/jobs?q=delivery+driver&q=courier&q=logistics",
    description: "Tech-focused job platform with technology and logistics opportunities",
    type: "Tech Platform",
    category: "general",
    rating: 4.3,
    jobCount: "5,000+",
    location: "US",
    features: ["💻 Tech Focus", "📈 Career Tools", "💰 Salary Data", "🎯 Skills Matching"]
  },
  {
    name: "CareerBuilder",
    url: "https://www.careerbuilder.com/jobs?keywords=delivery+driver",
    description: "Established career platform with comprehensive delivery job listings",
    type: "Career Platform",
    category: "general",
    rating: 4.2,
    jobCount: "25,000+",
    location: "US",
    features: ["📊 Career Resources", "💼 Full-Time Focus", "📱 Mobile App", "🎯 Local Jobs"]
  },
  {
    name: "USAJobs",
    url: "https://www.usajobs.gov/Search/Results?k=delivery%20driver",
    description: "Official US government job portal for federal delivery and logistics positions",
    type: "Government",
    category: "specialized",
    rating: 4.5,
    jobCount: "2,000+",
    location: "US",
    features: ["🏛️ Federal Jobs", "💰 Government Benefits", "🔐 Security Clearance", "📊 Veteran Preference"]
  },
  {
    name: "BuiltIn",
    url: "https://builtin.com/jobs/remote/dev-engineering?f%5B%5D=logistics",
    description: "Tech startup platform with logistics and delivery technology roles",
    type: "Startup Platform",
    category: "general",
    rating: 4.1,
    jobCount: "3,000+",
    location: "US",
    features: ["🚀 Startup Focus", "💻 Tech Companies", "🌟 Innovation", "📍 City-Based"]
  },
  {
    name: "The Muse",
    url: "https://www.themuse.com/jobs?keyword=delivery+driver",
    description: "Career-focused platform with company culture insights and delivery jobs",
    type: "Career Platform",
    category: "professional",
    rating: 4.3,
    jobCount: "8,000+",
    location: "US",
    features: ["🏢 Company Culture", "📈 Career Advice", "🎯 Cultural Fit", "💼 Professional Growth"]
  },
  {
    name: "Lensa",
    url: "https://lensa.com/jobs/delivery-driver",
    description: "AI-powered job platform with personalized delivery job recommendations",
    type: "AI Platform",
    category: "general",
    rating: 4.2,
    jobCount: "15,000+",
    location: "US",
    features: ["🤖 AI Matching", "📊 Salary Insights", "⚡ Quick Apply", "🎯 Personalized Results"]
  },
  {
    name: "Nexxt",
    url: "https://www.nexxt.com/jobs?keywords=delivery+driver",
    description: "Professional networking platform with targeted delivery job opportunities",
    type: "Network Platform",
    category: "professional",
    rating: 4.0,
    jobCount: "10,000+",
    location: "US",
    features: ["🤝 Professional Network", "🎯 Targeted Jobs", "📊 Industry Focus", "💼 Career Development"]
  }
];

const CATEGORIES = [
  { id: "all", name: "All Platforms", count: JOB_BOARDS.length },
  { id: "general", name: "Major Platforms", count: JOB_BOARDS.filter(b => b.category === 'general').length },
  { id: "flexible", name: "Flexible Work", count: JOB_BOARDS.filter(b => b.category === 'flexible').length },
  { id: "professional", name: "Professional", count: JOB_BOARDS.filter(b => b.category === 'professional').length },
  { id: "local", name: "Local & Direct", count: JOB_BOARDS.filter(b => b.category === 'local').length }
];

export default function DriverGigsBoard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [jobBoardNotes, setJobBoardNotes] = useState<{[key: string]: string}>({});
  const [jobBoardCredentials, setJobBoardCredentials] = useState<{[key: string]: {username: string, password: string}}>({});
  const [isSaving, setIsSaving] = useState<{[key: string]: boolean}>({});
  const [openNotesDialog, setOpenNotesDialog] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const debounceRef = useRef<{[key: string]: NodeJS.Timeout}>({});
  
  // Fetch notes from database
  const { data: savedNotes = [] } = useQuery({
    queryKey: ["/api/job-board-notes"],
    retry: false,
  });
  
  // Convert saved notes array to object for easier access
  useEffect(() => {
    if (Array.isArray(savedNotes) && savedNotes.length > 0) {
      const notesObject = (savedNotes as any[]).reduce((acc: any, note: any) => {
        acc[note.jobBoardName] = note.notes || '';
        return acc;
      }, {});
      setJobBoardNotes(notesObject);
    }
  }, [savedNotes]);
  
  // Mutation to save notes to database
  const saveNoteMutation = useMutation({
    mutationFn: async ({ jobBoardName, notes }: { jobBoardName: string; notes: string }) => {
      return await apiRequest("/api/job-board-notes", {
        method: "PUT",
        body: { jobBoardName, notes }
      });
    },
    onSuccess: (_, { jobBoardName }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-board-notes"] });
      setIsSaving(prev => ({ ...prev, [jobBoardName]: false }));
      toast({
        title: "Notes saved",
        description: `Notes for ${jobBoardName} saved to database`,
        duration: 1500,
      });
    },
    onError: (error, { jobBoardName }) => {
      setIsSaving(prev => ({ ...prev, [jobBoardName]: false }));
      console.error('Failed to save note:', error);
      toast({
        title: "Save failed",
        description: "Failed to save notes to database",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
  
  // Auto-save notes with debouncing
  const debouncedSave = useCallback((boardName: string, notes: string) => {
    if (debounceRef.current[boardName]) {
      clearTimeout(debounceRef.current[boardName]);
    }
    
    setIsSaving(prev => ({ ...prev, [boardName]: true }));
    
    debounceRef.current[boardName] = setTimeout(() => {
      saveNoteMutation.mutate({ jobBoardName: boardName, notes });
    }, 1000);
  }, [saveNoteMutation]);
  
  // Handle notes change
  const handleNotesChange = (boardName: string, value: string) => {
    setJobBoardNotes(prev => ({ ...prev, [boardName]: value }));
    debouncedSave(boardName, value);
  };
  
  // Handle opening notes dialog
  const handleOpenNotes = (boardName: string) => {
    setCurrentNoteText(jobBoardNotes[boardName] || '');
    const credentials = jobBoardCredentials[boardName];
    setCurrentUsername(credentials?.username || '');
    setCurrentPassword(credentials?.password || '');
    setOpenNotesDialog(boardName);
  };
  
  // Handle saving notes from dialog
  const handleSaveNotes = () => {
    if (openNotesDialog) {
      handleNotesChange(openNotesDialog, currentNoteText);
      // Save credentials to local state (displayed in plain text as requested)
      setJobBoardCredentials(prev => ({
        ...prev,
        [openNotesDialog]: {
          username: currentUsername,
          password: currentPassword
        }
      }));
      setOpenNotesDialog(null);
    }
  };
  
  // Handle closing dialog without saving
  const handleCloseNotes = () => {
    setOpenNotesDialog(null);
    setCurrentNoteText('');
    setCurrentUsername('');
    setCurrentPassword('');
  };

  // Filter boards based on category
  const filteredBoards = selectedCategory === "all" 
    ? JOB_BOARDS
    : JOB_BOARDS.filter(board => board.category === selectedCategory);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 bg-green-50";
    if (rating >= 4.0) return "text-blue-600 bg-blue-50";
    if (rating >= 3.5) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getCategoryColor = (type: string) => {
    const colors: Record<string, string> = {
      "Major Platform": "bg-blue-500",
      "AI Matching": "bg-violet-500", 
      "Professional": "bg-indigo-500",
      "Flexible": "bg-green-500",
      "Aggregator": "bg-gray-500",
      "Established": "bg-orange-500",
      "Transparent": "bg-teal-500",
      "Local": "bg-rose-500",
      "Local Gigs": "bg-cyan-500"
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Simple Header */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Boards</h1>
          <div className="text-sm text-gray-600">
            <span>💾 Notes auto-save to database</span>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Browse major job platforms like Indeed, ZipRecruiter, LinkedIn, and more for delivery and driving opportunities
        </p>
      </div>

      {/* Categories Filter */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full ${
                selectedCategory === category.id 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              <span>{category.name}</span>
              <Badge 
                variant="secondary" 
                className={`ml-2 text-xs ${
                  selectedCategory === category.id 
                    ? "bg-white/20 text-white border-0" 
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Job Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBoards.map((board, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                      <Briefcase className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {board.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={`text-xs text-white ${getCategoryColor(board.type)} border-0`}
                        >
                          {board.type}
                        </Badge>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(board.rating)}`}>
                          <Star className="w-3 h-3 fill-current" />
                          <span>{board.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{board.jobCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{board.location}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {board.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {board.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-gray-50 border-gray-200">
                        {feature}
                      </Badge>
                    ))}
                    {board.features.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                        +{board.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105"
                    onClick={() => window.open(board.url, '_blank')}
                  >
                    <span>Browse Jobs</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Dialog open={openNotesDialog === board.name} onOpenChange={(open) => !open && handleCloseNotes()}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full px-3 py-2 relative text-xs"
                        onClick={() => handleOpenNotes(board.name)}
                      >
                        <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Notes and Login Credentials</span>
                        {jobBoardNotes[board.name] && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Notes for {board.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {/* Login Credentials Section */}
                        <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                          <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                            🔐 Login Credentials for {board.name}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-blue-700">
                                Username
                              </label>
                              <Input
                                placeholder="Enter your username"
                                value={currentUsername}
                                onChange={(e) => setCurrentUsername(e.target.value)}
                                className="bg-white border-blue-200 focus:border-blue-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-blue-700">
                                Password
                              </label>
                              <Input
                                placeholder="Enter your password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="bg-white border-blue-200 focus:border-blue-400"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Notes Section */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            📝 Personal Notes
                          </h4>
                          <Textarea
                            placeholder="Add your notes, application status, contacts, or any other relevant information..."
                            value={currentNoteText}
                            onChange={(e) => setCurrentNoteText(e.target.value)}
                            className="min-h-[120px] resize-none"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <Button 
                            variant="outline" 
                            onClick={handleCloseNotes}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSaveNotes}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Notes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}