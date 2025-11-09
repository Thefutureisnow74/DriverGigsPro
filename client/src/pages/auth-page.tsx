import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, User, Car, Briefcase, TrendingUp, ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("platform");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<"standard" | "cdl" | "drivergigspro" | "gigsproai">("standard");

  // Check URL parameters to determine default tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('signup') === 'true') {
      setActiveTab("register");
      setAuthDialogOpen(true);
    }
  }, []);
  
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
  });

  // Username validation states
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({
    checking: false,
    available: null,
    message: "",
  });

  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetForm, setResetForm] = useState({
    username: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  // Newsletter subscription state
  const [newsletterForm, setNewsletterForm] = useState({ email: "" });
  const [subscribedPlatform, setSubscribedPlatform] = useState<string>("");

  // Username availability check function
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: "" });
      return;
    }

    setUsernameStatus({ checking: true, available: null, message: "Checking..." });

    try {
      const response = await fetch(`/api/auth/username-available?u=${encodeURIComponent(username.trim().toLowerCase())}`);
      const data = await response.json();

      if (data.ok) {
        setUsernameStatus({
          checking: false,
          available: data.available,
          message: data.available ? "Username available!" : (data.message || "Username not available"),
        });
      } else {
        setUsernameStatus({
          checking: false,
          available: false,
          message: data.message || "Error checking username",
        });
      }
    } catch (error) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "Error checking username availability",
      });
    }
  };

  // Debounced username checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (registerForm.username) {
        checkUsernameAvailability(registerForm.username);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [registerForm.username]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      username: loginForm.username,
      password: loginForm.password,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate({
      username: registerForm.username,
      password: registerForm.password,
      fullName: registerForm.fullName,
      email: registerForm.email,
    });
  };

  // Password reset mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { username: string; newPassword: string }) => {
      const res = await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: data
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Successful",
        description: "You can now login with your new password",
      });
      setShowPasswordReset(false);
      setResetForm({ username: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (resetForm.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    resetPasswordMutation.mutate({
      username: resetForm.username,
      newPassword: resetForm.newPassword,
    });
  };

  // Newsletter subscription mutation
  const newsletterMutation = useMutation({
    mutationFn: async (data: { email: string; platform: string }) => {
      const res = await apiRequest("/api/newsletter/subscribe", {
        method: "POST",
        body: data
      });
      return await res.json();
    },
    onSuccess: (data, variables) => {
      setSubscribedPlatform(variables.platform);
      setNewsletterForm({ email: "" });
      toast({
        title: "Successfully Subscribed!",
        description: `We'll notify you when ${variables.platform} launches.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Failed",
        description: error.message.includes("already subscribed") ? "This email is already subscribed" : error.message,
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSignup = (platform: string) => {
    if (!newsletterForm.email || !/\S+@\S+\.\S+/.test(newsletterForm.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    newsletterMutation.mutate({
      email: newsletterForm.email,
      platform: platform,
    });
  };

  if (user) {
    return null; // Will redirect
  }

  if (showPasswordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordReset(false)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle>Reset Password</CardTitle>
              </div>
              <CardDescription>
                Enter your username and new password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-username">Username</Label>
                  <Input
                    id="reset-username"
                    type="text"
                    value={resetForm.username}
                    onChange={(e) =>
                      setResetForm({ ...resetForm, username: e.target.value })
                    }
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-newpassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="reset-newpassword"
                      type={showResetPassword ? "text" : "password"}
                      value={resetForm.newPassword}
                      onChange={(e) =>
                        setResetForm({ ...resetForm, newPassword: e.target.value })
                      }
                      placeholder="Enter new password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showResetPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-confirm">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="reset-confirm"
                      type={showResetConfirmPassword ? "text" : "password"}
                      value={resetForm.confirmPassword}
                      onChange={(e) =>
                        setResetForm({ ...resetForm, confirmPassword: e.target.value })
                      }
                      placeholder="Confirm new password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showResetConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {resetPasswordMutation.error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {resetPasswordMutation.error.message}
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Reset Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 lg:px-12 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">DriverGigsPro</span>
          </div>
          
          <Dialog open={authDialogOpen} onOpenChange={(open) => {
            setAuthDialogOpen(open);
            if (open) {
              // Reset to platform selection when dialog opens
              setActiveTab("platform");
              // Clear any previous registration form data and errors
              setRegisterForm({
                username: "",
                password: "",
                confirmPassword: "",
                fullName: "",
                email: "",
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                Get Started
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            <DialogHeader className="text-center pb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">Choose Your Platform</DialogTitle>
              <p className="text-gray-600 mt-2">Select the option that best fits your needs</p>
            </DialogHeader>
            
            {/* User Type Selection */}
            {activeTab === "platform" && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div 
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
                  onClick={() => setActiveTab("register")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">DriverGigsPro</h3>
                        <p className="text-gray-600 text-sm">Track applications, manage gigs & grow your income</p>
                        <p className="text-xs text-blue-600 font-medium">Ready Now - Get Started!</p>
                      </div>
                    </div>
                    <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </div>
                
                <div 
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all duration-200 group"
                  onClick={() => setActiveTab("newsletter")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">Looking for Drivers</h3>
                        <p className="text-gray-600 text-sm">Connect with pre-screened delivery professionals instantly</p>
                        <p className="text-xs text-green-600 font-medium">Coming Soon - Join Waitlist!</p>
                      </div>
                    </div>
                    <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </div>

                <div 
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all duration-200 group"
                  onClick={() => setActiveTab("newsletter")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">CDL Driver Gigs</h3>
                        <p className="text-gray-600 text-sm">High-paying truck & commercial driving careers</p>
                        <p className="text-xs text-purple-600 font-medium">Coming Soon - Join Waitlist!</p>
                      </div>
                    </div>
                    <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </div>

                <div 
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-all duration-200 group"
                  onClick={() => setActiveTab("newsletter")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">GigsProAI</h3>
                        <p className="text-gray-600 text-sm">Remote work & freelance opportunities powered by AI</p>
                        <p className="text-xs text-orange-600 font-medium">Coming Soon - Join Waitlist!</p>
                      </div>
                    </div>
                    <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center py-4">
                <p className="text-gray-600 text-sm">Already have an account?</p>
                <button 
                  onClick={() => setActiveTab("login")}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm underline mt-1"
                >
                  Sign In Here
                </button>
              </div>
            </div>
            )}
            
            {/* Newsletter Signup */}
            {activeTab === "newsletter" && (
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon!</h3>
                  <p className="text-gray-600 mb-4">
                    This platform is currently in development. Join our newsletter to stay updated 
                    and be added to our exclusive waiting list.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="w-full text-center"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Join Waiting List & Newsletter
                    </Button>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Early Access</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Launch Updates</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Beta Testing</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Exclusive Features</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setActiveTab("platform")}
                  className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  ← Back to platform selection
                </button>
              </div>
            )}

            {/* Auth Forms */}
            {(activeTab === "register" || activeTab === "login") && (
              <div className="border-t pt-6 mt-6 pb-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Access DriverGigsPro</h3>
                  <p className="text-gray-600 text-sm mt-1">The complete gig management platform is ready!</p>
                </div>
                <Tabs value={activeTab} onValueChange={(value) => {
                  setActiveTab(value);
                  // Clear any mutation errors when switching tabs
                  if (loginMutation.error) loginMutation.reset();
                  if (registerMutation.error) registerMutation.reset();
                }} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="text-sm">Sign In</TabsTrigger>
                    <TabsTrigger value="register" className="text-sm">Create Account</TabsTrigger>
                  </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        type="text"
                        value={loginForm.username}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, username: e.target.value })
                        }
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(e) =>
                            setLoginForm({ ...loginForm, password: e.target.value })
                          }
                          placeholder="Enter your password"
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {loginMutation.error && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {loginMutation.error.message}
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Sign In
                    </Button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowPasswordReset(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-fullname">Full Name</Label>
                      <Input
                        id="register-fullname"
                        type="text"
                        value={registerForm.fullName}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, fullName: e.target.value })
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        value={registerForm.username}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, username: e.target.value })
                        }
                        placeholder="Choose a username (letters, numbers, dots, dashes, underscores)"
                        required
                        className={`${usernameStatus.available === true ? 'border-green-500' : usernameStatus.available === false ? 'border-red-500' : ''}`}
                      />
                      {registerForm.username.length >= 3 && (
                        <div className="flex items-center gap-2 text-sm">
                          {usernameStatus.checking ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                              <span className="text-gray-500">Checking availability...</span>
                            </>
                          ) : usernameStatus.available === true ? (
                            <>
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-600 font-medium">{usernameStatus.message}</span>
                            </>
                          ) : usernameStatus.available === false ? (
                            <>
                              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                              <span className="text-red-600">{usernameStatus.message}</span>
                            </>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, email: e.target.value })
                        }
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showRegisterPassword ? "text" : "password"}
                          value={registerForm.password}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, password: e.target.value })
                          }
                          placeholder="Create a password"
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="register-confirm"
                          type={showRegisterConfirmPassword ? "text" : "password"}
                          value={registerForm.confirmPassword}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                          }
                          placeholder="Confirm your password"
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showRegisterConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {registerMutation.error && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {registerMutation.error.message}
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
                
                <div className="text-center mt-6">
                  <button 
                    onClick={() => setActiveTab("platform")}
                    className="text-gray-500 hover:text-gray-700 text-sm underline"
                  >
                    ← Back to platform selection
                  </button>
                </div>
            </div>
            )}
          </DialogContent>
        </Dialog>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-t bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveMainTab("standard")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeMainTab === "standard"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Looking For Drivers
              </button>
              <button
                onClick={() => setActiveMainTab("cdl")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeMainTab === "cdl"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                CDL Driver Gigs
              </button>
              <button
                onClick={() => setActiveMainTab("drivergigspro")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeMainTab === "drivergigspro"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                DriverGigsPro
              </button>
              <button
                onClick={() => setActiveMainTab("gigsproai")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeMainTab === "gigsproai"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                GigsProAI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center space-y-8">
            {activeMainTab === "standard" ? (
              <>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Connect with <span className="text-blue-600">qualified drivers</span> instantly
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Search our database of drivers both CDL and non-CDL. Access our network of 
                  pre-screened drivers ready for delivery, logistics, and transportation opportunities.
                </p>
              </>
            ) : activeMainTab === "cdl" ? (
              <>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="text-blue-600">CDL driver opportunities</span> nationwide
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Access premium commercial driving positions requiring CDL certification.
                  Higher pay, better benefits, professional growth.
                </p>
              </>
            ) : activeMainTab === "drivergigspro" ? (
              <>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  The smarter <span className="text-blue-600">non-CDL gig work</span> solution
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Find, track and manage non-CDL gig opportunities across 449+ verified companies. 
                  No CDL required, no contracts, no commitments, just results.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="text-blue-600">Non-driving gig opportunities</span> powered by AI
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Discover work-from-home, handyman, catering, laundry, tutoring, pet sitting, 
                  and other flexible opportunities that don't require intensive driving.
                </p>
              </>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              {activeMainTab === "drivergigspro" ? (
                <Button 
                  onClick={() => setAuthDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Get Started Today
                </Button>
              ) : subscribedPlatform === (activeMainTab === "standard" ? "Looking for Drivers" : activeMainTab === "cdl" ? "CDL Driver Gigs" : "GigsProAI") ? (
                <div className="text-center space-y-3">
                  <div className="bg-green-100 text-green-800 px-6 py-3 rounded-xl font-semibold">
                    ✓ Subscribed! We'll notify you when {activeMainTab === "standard" ? "Looking for Drivers" : activeMainTab === "cdl" ? "CDL Driver Gigs" : "GigsProAI"} launches.
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <p className="text-gray-700 font-medium">
                    {activeMainTab === "standard" ? "Looking for Drivers" : activeMainTab === "cdl" ? "CDL Driver Gigs" : "GigsProAI"} is coming soon! Get notified when we launch:
                  </p>
                  <div className="flex gap-2 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={newsletterForm.email}
                      onChange={(e) => setNewsletterForm({ email: e.target.value })}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => handleNewsletterSignup(activeMainTab === "standard" ? "Looking for Drivers" : activeMainTab === "cdl" ? "CDL Driver Gigs" : "GigsProAI")}
                      disabled={newsletterMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 whitespace-nowrap"
                    >
                      {newsletterMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Notify Me
                    </Button>
                  </div>
                </div>
              )}
              <Button 
                variant="outline" 
                className="px-8 py-4 text-lg rounded-xl font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {activeMainTab === "standard" ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-gray-900">10K+</h3>
                <p className="text-gray-600 text-lg mt-2">Active Drivers</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">50</h3>
                <p className="text-gray-600 text-lg mt-2">States Covered</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">24HR</h3>
                <p className="text-gray-600 text-lg mt-2">Response Time</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">99%</h3>
                <p className="text-gray-600 text-lg mt-2">Success Rate</p>
              </div>
            </div>
          ) : activeMainTab === "cdl" ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-gray-900">850+</h3>
                <p className="text-gray-600 text-lg mt-2">CDL Companies</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">$75K+</h3>
                <p className="text-gray-600 text-lg mt-2">Average Salary</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">500+</h3>
                <p className="text-gray-600 text-lg mt-2">Active Routes</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">95%</h3>
                <p className="text-gray-600 text-lg mt-2">Placement Rate</p>
              </div>
            </div>
          ) : activeMainTab === "drivergigspro" ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-gray-900">449</h3>
                <p className="text-gray-600 text-lg mt-2">Verified Companies</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">15+</h3>
                <p className="text-gray-600 text-lg mt-2">Management Tools</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">100%</h3>
                <p className="text-gray-600 text-lg mt-2">No-CDL Focus</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">24/7</h3>
                <p className="text-gray-600 text-lg mt-2">AI Assistant</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-gray-900">500+</h3>
                <p className="text-gray-600 text-lg mt-2">Non-Driving Gigs</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">WFH</h3>
                <p className="text-gray-600 text-lg mt-2">Remote Options</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">15+</h3>
                <p className="text-gray-600 text-lg mt-2">Service Categories</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">AI</h3>
                <p className="text-gray-600 text-lg mt-2">Powered Matching</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {activeMainTab === "standard" 
                ? "How do we connect you with drivers?" 
                : activeMainTab === "cdl" 
                ? "How do CDL opportunities work?"
                : activeMainTab === "drivergigspro"
                ? "How does DriverGigsPro work?"
                : "How does AI intelligence work?"}
            </h2>
          </div>
          
          {activeMainTab === "standard" ? (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">SEARCH</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse our comprehensive database of 10K+ qualified drivers. Filter by location, 
                  license type (CDL/non-CDL), and experience level to find perfect matches.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">CONNECT</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect directly with pre-screened drivers ready for delivery, logistics, 
                  and transportation roles. Fast, reliable recruitment solutions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">SCALE</h3>
                <p className="text-gray-600 leading-relaxed">
                  Expand your delivery operations quickly with access to qualified drivers 
                  nationwide. 24-hour response time with 99% success rate.
                </p>
              </div>
            </div>
          ) : activeMainTab === "cdl" ? (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">QUALIFY</h3>
                <p className="text-gray-600 leading-relaxed">
                  Verify your CDL certification and driving record. Access exclusive opportunities 
                  for licensed commercial drivers with clean records.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">MATCH</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get matched with premium trucking companies, freight carriers, and logistics 
                  firms offering competitive salaries and benefits packages.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">DRIVE</h3>
                <p className="text-gray-600 leading-relaxed">
                  Start your career with established transportation companies offering 
                  sign-on bonuses, equipment packages, and professional advancement.
                </p>
              </div>
            </div>
          ) : activeMainTab === "drivergigspro" ? (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">SEARCH</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse our comprehensive database of 449+ verified gig companies. No CDL is required - 
                  just filter by location, vehicle type, and service category.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">TRACK</h3>
                <p className="text-gray-600 leading-relaxed">
                  Manage your applications, schedule interviews, and track your progress 
                  across multiple companies with our intelligent dashboard.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">SUCCEED</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get hired faster with AI-powered insights, personalized recommendations, 
                  and comprehensive tools for managing your gig career.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">DISCOVER</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find work-from-home, handyman, catering, laundry, tutoring, pet care, 
                  cleaning, and other flexible opportunities without intensive driving.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">MATCH</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI matches your skills and availability with freelance, remote work, 
                  local services, and part-time opportunities in your area.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">THRIVE</h3>
                <p className="text-gray-600 leading-relaxed">
                  Build diverse income streams through multiple gig types - from virtual 
                  assistant work to local handyman services and creative projects.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-12">
          {activeMainTab === "standard" ? (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to scale your delivery operations?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Connect with our network of qualified drivers and expand your business reach today.
              </p>
            </>
          ) : activeMainTab === "cdl" ? (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready for professional CDL opportunities?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Connect with premium trucking companies offering competitive salaries and comprehensive benefits.
              </p>
            </>
          ) : activeMainTab === "drivergigspro" ? (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to accelerate your gig career?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of drivers who trust DriverGigsPro to find and manage their gig work opportunities.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to diversify beyond driving?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Explore hundreds of non-driving opportunities from home-based work to local services 
                and creative gigs that fit your schedule.
              </p>
            </>
          )}
          <Button 
            onClick={() => setAuthDialogOpen(true)}
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </div>
  );
}