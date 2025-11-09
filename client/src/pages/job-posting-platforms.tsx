import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Save,
  Play,
  Edit2,
  X
} from "lucide-react";

// Specialized job posting platforms for courier and delivery work
const JOB_POSTING_PLATFORMS = [
  {
    name: "CB Driver",
    url: "https://www.cbdriver.com",
    description: "Part of Drivv/Courierboard ecosystem with 250,000+ registered drivers connecting independent contractors with professional courier companies nationwide",
    type: "Driver Platform",
    category: "specialized",
    rating: 4.5,
    jobCount: "10,000+",
    location: "US",
    features: ["🚚 Professional Courier Network", "👥 250K+ Registered Drivers", "📧 Job Alerts", "📋 Resume Builder", "🏢 Established Companies"]
  },
  {
    name: "Onfleet",
    url: "https://onfleet.com/drivers",
    description: "Leading delivery management platform for last-mile operations",
    type: "Platform",
    category: "specialized",
    rating: 4.5,
    jobCount: "3,000+",
    location: "Global",
    features: ["📦 Last-Mile Delivery", "🔗 Fleet Integration", "📱 Driver App", "🏢 Enterprise Clients"]
  },
  {
    name: "CourierGigs",
    url: "https://couriergigs.com",
    description: "Specialized platform for courier and delivery opportunities", 
    type: "Courier Focused",
    category: "specialized",
    rating: 4.6,
    jobCount: "5,000+",
    location: "US",
    features: ["🚚 Delivery Focus", "📱 Mobile Optimized", "💰 Pay Transparency", "⚡ Quick Apply"]
  },
  {
    name: "Dispatch",
    url: "https://www.dispatchit.com/drivers",
    description: "Independent contractor delivery jobs with flexible scheduling nationwide",
    type: "Delivery Network",
    category: "gig",
    rating: 4.6,
    jobCount: "10,000+",
    location: "US",
    features: ["🗓️ Flexible Schedule", "🚗 Any Vehicle", "💰 Weekly Pay", "📍 Choose Your Area"]
  },
  {
    name: "CitizenShipper",
    url: "https://www.citizenshipper.com/drivers",
    description: "Pet transport and specialty item delivery network",
    type: "Specialty Transport",
    category: "specialized",
    rating: 4.7,
    jobCount: "3,000+",
    location: "US",
    features: ["🐾 Pet Transport", "📦 Specialty Items", "💰 Premium Rates", "🛡️ Insurance Covered"]
  },
  {
    name: "Dolly",
    url: "https://dolly.com/driver/",
    description: "Moving and delivery platform for helpers and drivers",
    type: "Moving & Delivery",
    category: "specialized",
    rating: 4.2,
    jobCount: "5,000+",
    location: "US",
    features: ["📦 Moving Services", "🚛 Delivery Jobs", "💰 Earn Up To $35/hr", "📱 Easy Scheduling"]
  },
  {
    name: "Roadie",
    url: "https://www.roadie.com/drivers",
    description: "Cross-town and long-distance delivery opportunities",
    type: "Logistics Network",
    category: "gig",
    rating: 4.1,
    jobCount: "20,000+",
    location: "US",
    features: ["🛣️ Long Distance", "📦 Package Delivery", "✈️ Airport Routes", "💰 Competitive Pay"]
  },
  {
    name: "GigSmart",
    url: "https://gigsmart.com",
    description: "Flexible workforce platform connecting workers with shifts across all industries nationwide",
    type: "Flexible Shifts",
    category: "gig",
    rating: 4.2,
    jobCount: "12,000+",
    location: "US",
    features: ["⏰ Choose Your Schedule", "💼 Work Today", "💰 Get Paid Instantly", "🔄 Multiple Industries"]
  }
];

export default function JobPostingPlatforms() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [jobBoardNotes, setJobBoardNotes] = useState<{[key: string]: string}>({});
  const [jobBoardCredentials, setJobBoardCredentials] = useState<{[key: string]: {username: string, password: string}}>({});
  const [isSaving, setIsSaving] = useState<{[key: string]: boolean}>({});
  const [openNotesDialog, setOpenNotesDialog] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [platformVideoUrls, setPlatformVideoUrls] = useState<{[key: string]: string}>({});
  const [isEditingVideo, setIsEditingVideo] = useState<{[key: string]: boolean}>({});
  const [videoUrl, setVideoUrl] = useState<string>("");
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
      return await apiRequest("/api/job-board-notes", { method: "PUT", body: { jobBoardName, notes } });
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

  // Video URL management functions
  const handleEditVideo = (platformName: string) => {
    setVideoUrl(platformVideoUrls[platformName] || '');
    setIsEditingVideo(prev => ({ ...prev, [platformName]: true }));
  };

  const handleCancelVideoEdit = (platformName: string) => {
    setIsEditingVideo(prev => ({ ...prev, [platformName]: false }));
    setVideoUrl('');
  };

  const handleSaveVideo = async (platformName: string) => {
    try {
      // Store video URL in local state for now (since these are static platforms)
      setPlatformVideoUrls(prev => ({ ...prev, [platformName]: videoUrl }));
      setIsEditingVideo(prev => ({ ...prev, [platformName]: false }));
      toast({
        title: "Video URL saved",
        description: `Video URL for ${platformName} has been saved`,
        duration: 1500,
      });
    } catch (error) {
      console.error('Failed to save video URL:', error);
      toast({
        title: "Save failed",
        description: "Failed to save video URL",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 bg-green-50";
    if (rating >= 4.0) return "text-blue-600 bg-blue-50";
    if (rating >= 3.5) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getCategoryColor = (type: string) => {
    const colors: Record<string, string> = {
      "Driver Platform": "bg-violet-500",
      "Courier Focused": "bg-teal-500", 
      "Platform": "bg-indigo-500",
      "Government Contracts": "bg-red-500",
      "Courier Load Board": "bg-teal-600",
      "International Courier": "bg-blue-600",
      "Van & Truck Jobs": "bg-green-600",
      "Delivery Network": "bg-purple-600",
      "Specialty Transport": "bg-rose-600",
      "Moving & Delivery": "bg-orange-600",
      "Logistics Network": "bg-gray-600",
      "Flexible Shifts": "bg-cyan-500"
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Simple Header */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Posting Platforms</h1>
          <div className="text-sm text-gray-600">
            <span>💾 Notes auto-save to database</span>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Specialized platforms for courier, delivery, and gig work opportunities with direct employer connections
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Job Posting Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {JOB_POSTING_PLATFORMS.map((platform, index) => (
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
                        {platform.name}
                      </CardTitle>
                      
                      {/* Video Link Display */}
                      <div className="mt-2">
                        {!isEditingVideo[platform.name] ? (
                          <div className="flex items-center gap-2">
                            {platformVideoUrls[platform.name] ? (
                              <a
                                href={platformVideoUrls[platform.name]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Play className="w-3 h-3" />
                                <span>Video Link</span>
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">No video link</span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                              onClick={() => handleEditVideo(platform.name)}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Enter video URL..."
                              value={videoUrl}
                              onChange={(e) => setVideoUrl(e.target.value)}
                              className="h-7 text-xs flex-1"
                            />
                            <Button
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleSaveVideo(platform.name)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => handleCancelVideoEdit(platform.name)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={`text-xs text-white ${getCategoryColor(platform.type)} border-0`}
                        >
                          {platform.type}
                        </Badge>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(platform.rating)}`}>
                          <Star className="w-3 h-3 fill-current" />
                          <span>{platform.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{platform.jobCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{platform.location}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {platform.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {platform.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-gray-50 border-gray-200">
                        {feature}
                      </Badge>
                    ))}
                    {platform.features.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                        +{platform.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105"
                    onClick={() => window.open(platform.url, '_blank')}
                  >
                    <span>Browse Jobs</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Dialog open={openNotesDialog === platform.name} onOpenChange={(open) => !open && handleCloseNotes()}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full px-3 py-2 relative text-xs"
                        onClick={() => handleOpenNotes(platform.name)}
                      >
                        <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Notes and Login Credentials</span>
                        {jobBoardNotes[platform.name] && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Notes for {platform.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {/* Login Credentials Section */}
                        <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                          <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                            🔐 Login Credentials for {platform.name}
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