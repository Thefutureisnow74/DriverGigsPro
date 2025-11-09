import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface ResetRequest {
  email: string;
}

interface ResetPassword {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordReset() {
  const { toast } = useToast();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [emailSent, setEmailSent] = useState(false);

  // Request password reset
  const requestResetMutation = useMutation({
    mutationFn: async (data: ResetRequest) => {
      return await apiRequest({
        url: "/api/auth/password-reset/request",
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      setEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Reset password with token
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPassword) => {
      return await apiRequest({
        url: "/api/auth/password-reset/confirm",
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. You can now sign in.",
      });
      // Redirect to sign in
      window.location.href = '/auth';
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reset password. Please check your token and try again.",
        variant: "destructive",
      });
    },
  });

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    requestResetMutation.mutate({ email });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Token Required",
        description: "Please enter the reset token from your email.",
        variant: "destructive",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    resetPasswordMutation.mutate({
      token,
      newPassword: passwords.newPassword,
      confirmPassword: passwords.confirmPassword,
    });
  };

  // Get reset token from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');
  if (urlToken && step === 'request') {
    setToken(urlToken);
    setStep('reset');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Password Reset</h1>
          <p className="text-gray-600 mt-2">
            {step === 'request' 
              ? "Enter your email to receive reset instructions"
              : "Enter your new password"
            }
          </p>
        </div>

        {/* Step 1: Request Reset */}
        {step === 'request' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Request Password Reset
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!emailSent ? (
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={requestResetMutation.isPending}
                  >
                    {requestResetMutation.isPending ? "Sending..." : "Send Reset Email"}
                  </Button>

                  <div className="text-center">
                    <Link href="/auth">
                      <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Sign In
                      </Button>
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Sent!</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We've sent password reset instructions to <strong>{email}</strong>
                    </p>
                  </div>
                  
                  <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertDescription>
                      Check your email and click the reset link, or copy the token and use the form below.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={() => setStep('reset')}
                    variant="outline"
                    className="w-full"
                  >
                    I have a reset token
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Reset Password */}
        {step === 'reset' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Reset Your Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="token">Reset Token</Label>
                  <Input
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter the token from your email"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Copy the token from the reset email you received
                  </p>
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter your new password"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your new password"
                    required
                    minLength={8}
                  />
                </div>

                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    Password must be at least 8 characters long
                  </AlertDescription>
                </Alert>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </Button>

                <div className="text-center space-y-2">
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setStep('request');
                      setEmailSent(false);
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Request New Token
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Additional Help */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-sm">Need Help?</h3>
              <p className="text-xs text-gray-600">
                If you continue to have trouble accessing your account, please contact support.
              </p>
              <Link href="/api/login">
                <Button variant="outline" size="sm">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}