import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  GraduationCap, 
  Play, 
  Clock, 
  Trophy, 
  BookOpen, 
  Video, 
  CheckCircle,
  Star,
  Upload,
  Plus,
  Award,
  Users,
  FileText,
  BookMarked,
  Target,
  TrendingUp,
  Building2
} from "lucide-react";

const departments = [
  {
    id: "fundamentals",
    name: "Driver Fundamentals",
    icon: Target,
    color: "from-blue-600 to-blue-800",
    description: "Essential skills for professional drivers",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700"
  },
  {
    id: "optimization",
    name: "Earnings Optimization", 
    icon: TrendingUp,
    color: "from-emerald-600 to-emerald-800",
    description: "Advanced income maximization strategies",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700"
  },
  {
    id: "business",
    name: "Business Development",
    icon: Building2,
    color: "from-purple-600 to-purple-800", 
    description: "Independent contractor business formation",
    bgClass: "bg-purple-50",
    textClass: "text-purple-700"
  }
];

const lessons = [
  {
    id: 1,
    title: "Professional Driver Onboarding",
    department: "fundamentals",
    instructor: "Dr. Sarah Martinez",
    duration: 45,
    description: "Complete orientation for new gig economy drivers covering industry standards and best practices",
    completed: false,
    hasVideo: true,
    videoUploaded: true,
    difficulty: "Beginner",
    credits: 3
  },
  {
    id: 2,
    title: "Vehicle Optimization & Maintenance",
    department: "fundamentals", 
    instructor: "Prof. Michael Chen",
    duration: 35,
    description: "Technical vehicle setup, maintenance schedules, and performance optimization for maximum efficiency",
    completed: true,
    hasVideo: true,
    videoUploaded: true,
    difficulty: "Intermediate",
    credits: 2
  },
  {
    id: 3,
    title: "Customer Relations Excellence",
    department: "fundamentals",
    instructor: "Dr. Emily Rodriguez", 
    duration: 30,
    description: "Advanced customer service methodologies and conflict resolution for professional drivers",
    completed: false,
    hasVideo: false,
    videoUploaded: false,
    difficulty: "Beginner",
    credits: 2
  },
  {
    id: 4,
    title: "Multi-Platform Strategy & Analytics",
    department: "optimization",
    instructor: "Prof. David Kim",
    duration: 60,
    description: "Data-driven approaches to managing multiple gig platforms simultaneously for maximum revenue",
    completed: false,
    hasVideo: false,
    videoUploaded: false,
    difficulty: "Advanced",
    credits: 4
  },
  {
    id: 5,
    title: "Peak Hour Revenue Optimization",
    department: "optimization",
    instructor: "Dr. Jennifer Walsh",
    duration: 40,
    description: "Statistical analysis and strategic positioning during high-demand periods for income maximization",
    completed: false,
    hasVideo: false,
    videoUploaded: false,
    difficulty: "Intermediate", 
    credits: 3
  },
  {
    id: 6,
    title: "Tax Strategy & Financial Planning",
    department: "optimization",
    instructor: "Prof. Robert Taylor",
    duration: 50,
    description: "Advanced tax optimization strategies and financial planning for independent contractors",
    completed: false,
    hasVideo: false,
    videoUploaded: false,
    difficulty: "Advanced",
    credits: 4
  },
  {
    id: 7,
    title: "LLC Formation & Asset Protection",
    department: "business",
    instructor: "Dr. Amanda Foster",
    duration: 75,
    description: "Legal business formation, liability protection, and corporate structure optimization",
    completed: false,
    hasVideo: false,
    videoUploaded: false,
    difficulty: "Advanced",
    credits: 5
  },
  {
    id: 8,
    title: "Independent Contractor Transition",
    department: "business",
    instructor: "Prof. James Morrison",
    duration: 90,
    description: "Strategic transition from platform-dependent work to independent contractor status",
    completed: false,
    hasVideo: false,
    videoUploaded: false,
    difficulty: "Expert",
    credits: 6
  },
  {
    id: 9,
    title: "BioHazard Transport Training & Safety",
    department: "safety",
    instructor: "Dr. Sarah Martinez",
    duration: 65,
    description: "Comprehensive training on safe transport protocols, containment procedures, and regulatory compliance for biohazardous materials including medical waste and infectious specimens",
    completed: false,
    hasVideo: false,
    videoUploaded: false,
    difficulty: "Intermediate",
    credits: 4
  }
];

export default function Academy() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLesson, setSelectedLesson] = useState<typeof lessons[0] | null>(null);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [isUploadVideoOpen, setIsUploadVideoOpen] = useState(false);
  const [uploadingLesson, setUploadingLesson] = useState<typeof lessons[0] | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    department: '',
    instructor: '',
    duration: '',
    description: '',
    difficulty: 'Beginner',
    credits: '1'
  });

  const { data: apiCourses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: () => api.courses.getAll(),
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ['/api/user/course-progress'],
    queryFn: () => api.courses.getUserProgress(),
  });

  const displayLessons = lessons;
  const filteredLessons = selectedDepartment === "all" 
    ? displayLessons 
    : displayLessons.filter(lesson => lesson.department === selectedDepartment);

  const completedLessons = displayLessons.filter(lesson => lesson.completed).length;
  const totalCredits = displayLessons.reduce((sum, lesson) => sum + lesson.credits, 0);
  const earnedCredits = displayLessons.filter(lesson => lesson.completed).reduce((sum, lesson) => sum + lesson.credits, 0);

  const handleCreateLesson = () => {
    if (newLesson.title.trim()) {
      const lesson = {
        ...newLesson,
        id: Date.now(),
        completed: false,
        hasVideo: false,
        videoUploaded: false,
        duration: parseInt(newLesson.duration),
        credits: parseInt(newLesson.credits)
      };
      
      console.log('Creating lesson:', lesson);
      setNewLesson({
        title: '',
        department: '',
        instructor: '',
        duration: '',
        description: '',
        difficulty: 'Beginner',
        credits: '1'
      });
      setIsCreateLessonOpen(false);
    }
  };

  const handleUploadVideo = (lesson: typeof lessons[0]) => {
    setUploadingLesson(lesson);
    setIsUploadVideoOpen(true);
  };

  const handleVideoUpload = () => {
    console.log('Uploading video for lesson:', uploadingLesson?.title);
    setIsUploadVideoOpen(false);
    setUploadingLesson(null);
  };

  const handleStartLesson = (lesson: any) => {
    setSelectedLesson(lesson);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Modern Academy Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 border-b border-slate-700 shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
                  Driver Gigs Academy
                  <span className="block text-lg font-normal text-amber-300 tracking-normal mt-1">
                    Elite Driver Professional Development Institute
                  </span>
                </h1>
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-white font-semibold">Premium Certified</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-white font-semibold">3,247+ Graduates</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-white font-semibold">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Dialog open={isCreateLessonOpen} onOpenChange={setIsCreateLessonOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm text-lg px-8 py-3">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Lesson</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Lesson Title</label>
                        <Input
                          value={newLesson.title}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter lesson title"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Department</label>
                        <Select value={newLesson.department} onValueChange={(value) => setNewLesson(prev => ({ ...prev, department: value }))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Instructor</label>
                        <Input
                          value={newLesson.instructor}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, instructor: e.target.value }))}
                          placeholder="Dr. Jane Smith"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Duration (minutes)</label>
                        <Input
                          type="number"
                          value={newLesson.duration}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="45"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Description</label>
                      <Textarea
                        value={newLesson.description}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Comprehensive lesson description..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Difficulty Level</label>
                        <Select value={newLesson.difficulty} onValueChange={(value) => setNewLesson(prev => ({ ...prev, difficulty: value }))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Credits</label>
                        <Input
                          type="number"
                          value={newLesson.credits}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, credits: e.target.value }))}
                          placeholder="3"
                          min="1"
                          max="6"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateLessonOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateLesson}>
                        Create Lesson
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Modern Progress Dashboard */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Courses Completed</p>
                  <p className="text-4xl font-black mt-2 text-slate-900">{completedLessons}</p>
                  <div className="flex items-center mt-2 text-emerald-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+12% this month</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Available Courses</p>
                  <p className="text-4xl font-black mt-2 text-slate-900">{displayLessons.length}</p>
                  <div className="flex items-center mt-2 text-blue-600">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span className="text-sm">3 new this week</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <BookMarked className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Credits Earned</p>
                  <p className="text-4xl font-black mt-2 text-slate-900">{earnedCredits}<span className="text-lg text-slate-500">/{totalCredits}</span></p>
                  <div className="flex items-center mt-2 text-purple-600">
                    <Award className="w-4 h-4 mr-1" />
                    <span className="text-sm">Professional Level</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Overall Progress</p>
                  <p className="text-4xl font-black mt-2 text-slate-900">{Math.round((earnedCredits / totalCredits) * 100)}%</p>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-amber-500 rounded-full h-2 transition-all duration-500" 
                      style={{ width: `${(earnedCredits / totalCredits) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <Star className="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Pathways */}
        <div className="mb-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Learning Pathways</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Choose your professional development track and master the skills that drive success in the gig economy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                selectedDepartment === "all" ? "border-blue-500 bg-blue-50" : "border-slate-200"
              }`}
              onClick={() => setSelectedDepartment("all")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <GraduationCap className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">All Departments</h3>
                <p className="text-slate-600 text-sm mb-3">Complete curriculum overview</p>
                <div className="text-2xl font-bold text-blue-600">{displayLessons.length}</div>
                <div className="text-sm text-slate-500">Total Lessons</div>
              </CardContent>
            </Card>
            
            {departments.map((dept) => {
              const Icon = dept.icon;
              const deptLessons = displayLessons.filter(lesson => lesson.department === dept.id);
              const deptCredits = deptLessons.reduce((sum, lesson) => sum + lesson.credits, 0);
              
              return (
                <Card 
                  key={dept.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                    selectedDepartment === dept.id ? `border-blue-500 ${dept.bgClass}` : "border-slate-200"
                  }`}
                  onClick={() => setSelectedDepartment(dept.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${dept.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <Icon className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{dept.name}</h3>
                    <p className="text-slate-600 text-sm mb-3">{dept.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{deptLessons.length}</div>
                        <div className="text-xs text-slate-500">Lessons</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{deptCredits}</div>
                        <div className="text-xs text-slate-500">Credits</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Lesson Catalog */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-900">
              {selectedDepartment === "all" ? "Course Catalog" : departments.find(d => d.id === selectedDepartment)?.name + " Curriculum"}
            </h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {filteredLessons.length} lessons available
            </Badge>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-48 bg-slate-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredLessons.map((lesson) => {
                const dept = departments.find(d => d.id === lesson.department);
                
                return (
                  <Card key={lesson.id} className="group bg-white hover:bg-gradient-to-br hover:from-white hover:to-slate-50 border-2 border-slate-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 overflow-hidden">
                    {/* Modern Header with Gradient */}
                    <div className="relative">
                      <div className={`h-32 bg-gradient-to-br ${dept?.color} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 font-semibold">
                            {dept?.name}
                          </Badge>
                          <div className="flex items-center space-x-2 text-white">
                            <Award className="w-4 h-4" />
                            <span className="font-bold text-sm">{lesson.credits}</span>
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center space-x-2 text-white/90 text-sm">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{lesson.duration} min</span>
                            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                            <span className="font-medium">{lesson.difficulty}</span>
                            {lesson.videoUploaded && (
                              <>
                                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                                <Video className="w-4 h-4" />
                              </>
                            )}
                          </div>
                        </div>
                        {lesson.completed && (
                          <div className="absolute top-4 right-4">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-800">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium mb-2">
                          {lesson.instructor}
                        </p>
                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                          {lesson.description}
                        </p>
                      </div>

                      {/* Modern Action Button */}
                      <div className="mt-6">
                        {lesson.completed ? (
                          <Button 
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                            disabled
                          >
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Course Completed
                          </Button>
                        ) : lesson.videoUploaded ? (
                          <Button 
                            className={`w-full bg-gradient-to-r ${dept?.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                            onClick={() => handleStartLesson(lesson)}
                          >
                            <Play className="mr-2 h-5 w-5" />
                            Start Course
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            className="w-full border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 group-hover:border-blue-400 transition-all duration-300"
                            onClick={() => handleUploadVideo(lesson)}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Content
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredLessons.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <GraduationCap className="mx-auto h-16 w-16 text-slate-400" />
              <h3 className="mt-4 text-xl font-medium text-slate-900">No lessons found</h3>
              <p className="mt-2 text-slate-600">
                {selectedDepartment === "all" 
                  ? "Create your first lesson to get started" 
                  : `No lessons available in ${departments.find(d => d.id === selectedDepartment)?.name} department yet`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Video Upload Modal */}
      <Dialog open={isUploadVideoOpen} onOpenChange={setIsUploadVideoOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Video - {uploadingLesson?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
              <Video className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Upload Lesson Video</h3>
              <p className="text-slate-600 mb-4">
                Drag and drop your video file here, or click to browse
              </p>
              <div className="space-y-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Video File
                </Button>
                <p className="text-xs text-slate-500">
                  Supported formats: MP4, MOV, AVI (Max size: 500MB)
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsUploadVideoOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleVideoUpload}>
                Upload & Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Detail Modal */}
      <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{(selectedLesson as any)?.title}</DialogTitle>
          </DialogHeader>
          {selectedLesson && (
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <div className={`w-20 h-20 bg-gradient-to-r ${departments.find(d => d.id === (selectedLesson as any).department)?.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <GraduationCap className="text-white w-10 h-10" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{(selectedLesson as any).title}</h2>
                  <p className="text-lg text-blue-600 font-medium mb-2">{(selectedLesson as any).instructor}</p>
                  <p className="text-slate-600 mb-4">{(selectedLesson as any).description}</p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-700 font-medium">{(selectedLesson as any).duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span className="text-slate-700 font-medium">{(selectedLesson as any).credits} Credits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <span className="text-slate-700 font-medium">{(selectedLesson as any).difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Player Area */}
              <div className="bg-slate-900 rounded-xl p-8 text-center">
                <Video className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Lesson Video</h3>
                <p className="text-slate-400 mb-6">
                  {(selectedLesson as any).videoUploaded 
                    ? "Video content will be displayed here" 
                    : "No video uploaded for this lesson yet"
                  }
                </p>
                {(selectedLesson as any).videoUploaded && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Play className="mr-2 h-4 w-4" />
                    Play Video
                  </Button>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedLesson(null)}>
                  Close
                </Button>
                {(selectedLesson as any).videoUploaded && !((selectedLesson as any).completed) && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}