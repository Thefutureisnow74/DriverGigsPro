import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Lightbulb } from "lucide-react";

export default function SmartSuggestions() {
  // Since we removed applications, return a simple disabled message
  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg">Smart Suggestions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <Lightbulb className="h-12 w-12 text-purple-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">AI suggestions feature temporarily disabled</p>
          <p className="text-sm text-gray-500">
            Focus on managing your driver opportunities and active companies
          </p>
        </div>
      </CardContent>
    </Card>
  );
}