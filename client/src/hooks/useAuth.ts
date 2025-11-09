import React, { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
  clearSession: () => Promise<void>;
  forceLogout: () => void;
  logout: () => Promise<void>;
  refetch: () => void;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
  fullName: string;
  email?: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await fetch("/api/auth/traditional-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const text = await response.text().catch(() => "Login failed");
        
        // Check if response is HTML instead of JSON
        if (text.includes('<!DOCTYPE') || text.includes('<html>')) {
          throw new Error("Server returned HTML instead of JSON. This usually means you're hitting the wrong login endpoint. Please clear your browser cache and try again.");
        }
        
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "Login failed");
        } catch (e) {
          throw new Error(text || "Login failed");
        }
      }
      
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        if (text.includes('<!DOCTYPE') || text.includes('<html>')) {
          throw new Error("Server returned HTML instead of JSON. Please clear your browser cache and refresh the page.");
        }
        throw new Error("Invalid response format");
      }
    },
    onSuccess: (data: any) => {
      // Set user data in cache
      queryClient.setQueryData(["/api/auth/user"], data.user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user?.fullName || data.user?.username || 'user'}!`,
      });
      // Force a re-render to trigger auth state change
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const response = await fetch("/api/auth/traditional-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const text = await response.text().catch(() => "Registration failed");
        
        // Check if response is HTML instead of JSON
        if (text.includes('<!DOCTYPE') || text.includes('<html>')) {
          throw new Error("Server returned HTML instead of JSON. This usually means you're hitting the wrong signup endpoint. Please clear your browser cache and try again.");
        }
        
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "Registration failed");
        } catch (e) {
          throw new Error(text || "Registration failed");
        }
      }
      
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        if (text.includes('<!DOCTYPE') || text.includes('<html>')) {
          throw new Error("Server returned HTML instead of JSON. Please clear your browser cache and refresh the page.");
        }
        throw new Error("Invalid response format");
      }
    },
    onSuccess: (data: any) => {
      // Set user data in cache
      queryClient.setQueryData(["/api/auth/user"], data.user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.user?.fullName || data.user?.username || 'user'}!`,
      });
      // Force a re-render to trigger auth state change
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/logout", {
        method: "POST"
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearSession = async () => {
    try {
      await apiRequest("/api/auth/clear-session", {
        method: "POST",
        body: {}
      });
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Error clearing session:", error);
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  const forceLogout = () => {
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Error during logout:", error);
      forceLogout();
    }
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        clearSession,
        forceLogout,
        logout,
        refetch,
      }
    },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return {
    user: context.user,
    isLoading: context.isLoading,
    isAuthenticated: !!context.user,
    error: context.error,
    clearSession: context.clearSession,
    forceLogout: context.forceLogout,
    logout: context.logout,
    refetch: context.refetch,
    loginMutation: context.loginMutation,
    registerMutation: context.registerMutation,
    logoutMutation: context.logoutMutation,
  };
}