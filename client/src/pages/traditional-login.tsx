import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Lock, Mail, UserPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function TraditionalLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [signInForm, setSignInForm] = useState({
    username: "",
    password: ""
  });
  const [signUpForm, setSignUpForm] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: ""
  });

  const signInMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/auth/traditional-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // Force page refresh to trigger auth state update
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Sign in failed:", error);
    }
  });

  const signUpMutation = useMutation({
    mutationFn: async (userData: any) => {
      return await apiRequest("/api/auth/traditional-signup", "POST", userData);
    },
    onSuccess: () => {
      // Auto sign in after signup
      signInMutation.mutate({ 
        username: signUpForm.username, 
        password: signUpForm.password 
      });
    },
    onError: (error) => {
      console.error("Sign up failed:", error);
    }
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signInMutation.mutate(signInForm);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpForm.password !== signUpForm.confirmPassword) {
      return;
    }
    signUpMutation.mutate({
      username: signUpForm.username,
      email: signUpForm.email,
      fullName: signUpForm.fullName,
      password: signUpForm.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access DriverGigsPro</h1>
          <p className="text-gray-600">Traditional login for testing purposes</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signin-username"
                        type="text"
                        placeholder="cfmbusiness"
                        className="pl-10"
                        value={signInForm.username}
                        onChange={(e) => setSignInForm({...signInForm, username: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Driver2Million123!"
                        className="pl-10 pr-10"
                        value={signInForm.password}
                        onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {signInMutation.error && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {(signInMutation.error as any)?.message || "Sign in failed. Please check your credentials."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                    disabled={signInMutation.isPending}
                  >
                    {signInMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="Choose a username"
                        className="pl-10"
                        value={signUpForm.username}
                        onChange={(e) => setSignUpForm({...signUpForm, username: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        value={signUpForm.email}
                        onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Full Name</Label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-fullname"
                        type="text"
                        placeholder="Your full name"
                        className="pl-10"
                        value={signUpForm.fullName}
                        onChange={(e) => setSignUpForm({...signUpForm, fullName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={signUpForm.confirmPassword}
                        onChange={(e) => setSignUpForm({...signUpForm, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {signUpForm.password !== signUpForm.confirmPassword && signUpForm.confirmPassword && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Passwords do not match.
                      </AlertDescription>
                    </Alert>
                  )}

                  {signUpMutation.error && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {(signUpMutation.error as any)?.message || "Sign up failed. Please try again."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" 
                    disabled={signUpMutation.isPending || signUpForm.password !== signUpForm.confirmPassword}
                  >
                    {signUpMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-600 mb-4">Or continue with Replit OAuth</p>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => window.location.href = "/api/login"}
              >
                Continue with Replit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}