import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Zap, Send } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function SiderChat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<any>(null);

  const quickQuestions = [
    "Research current Uber driver opportunities",
    "Live earnings data for food delivery", 
    "Compare gig platforms with market data",
    "Current hiring bonuses and incentives"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse('');
    setUsage(null);

    try {
      const response = await apiRequest('/api/sider/free-chat', {
        method: 'POST',
        body: { message }
      });
      const result = await response.json();

      setResponse(result.response);
      setUsage(result.usage);
    } catch (error: any) {
      setResponse(`Error: ${error.message || 'Failed to get response'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const useQuickQuestion = (question: string) => {
    setMessage(question);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          Live Market AI Assistant
        </CardTitle>
        <CardDescription>
          Get real-time market data, company research, and current gig opportunities
        </CardDescription>
        {usage && (
          <div className="flex gap-2 pt-2">
            <Badge variant="secondary" className="text-xs">
              🔴 Live Market Data
            </Badge>
            <Badge variant="outline" className="text-xs">
              ~{usage.totalTokens} tokens
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              Free Research
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about live market data, current earnings, company research, or hiring trends..."
              className="flex-1 min-h-[80px] resize-none"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !message.trim()}
              className="self-end"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Quick Questions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Quick Questions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => useQuickQuestion(question)}
                className="text-xs h-8 justify-start"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Response Section */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-muted-foreground">Getting AI response...</p>
            </div>
          </div>
        ) : response ? (
          <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded-lg">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm font-sans text-white">{response}</pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Ask a question to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}