import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Bot, Send, User, Mic, MicOff, Volume2, VolumeX, Brain, Database, Search, Globe, TrendingUp, MessageSquare, Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start(): void;
    stop(): void;
  }
  
  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionResultList {
    readonly [index: number]: SpeechRecognitionResult;
    readonly length: number;
  }
  
  interface SpeechRecognitionResult {
    readonly [index: number]: SpeechRecognitionAlternative;
    readonly isFinal: boolean;
  }
  
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
  
  interface SpeechRecognitionErrorEvent {
    error: string;
    message: string;
  }
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    toolCalls?: Array<{
      function: string;
      arguments: string;
      results?: string;
    }>;
    sources?: string[];
    processing?: boolean;
  };
}

interface Recommendation {
  company: string;
  companyId: number;
  score: number;
  why: string;
  url: string;
  breakdown: {
    regionMatch: number;
    vehicleFit: number;
    onboardingSpeed: number;
    payModel: number;
    portfolioDiversification: number;
  };
}

export default function EnhancedAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm GigBot, your comprehensive AI assistant for gig work management. I can help you with company recommendations, application tracking, expense management, vehicle maintenance, and much more. I have access to your complete profile and can perform web searches for the latest information. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionId] = useState("main");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive"
        });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [toast]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history
  const { data: chatHistory } = useQuery({
    queryKey: ['/api/gigbot/history', sessionId],
    enabled: false // Disable auto-loading for now
  });

  // Get AI recommendations
  const { data: recommendations, refetch: refetchRecommendations } = useQuery<{ recommendations: Recommendation[] }>({
    queryKey: ['/api/gigbot/recommendations'],
    enabled: false
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/gigbot/chat', {
        message,
        sessionId
      });
      return await response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: data.message,
        timestamp: new Date(),
        metadata: data.metadata
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      
      // Speak the response if TTS is enabled
      if (isSpeaking && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.message);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    const messageToSend = inputMessage.trim();
    setInputMessage("");

    chatMutation.mutate(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const toggleTextToSpeech = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const getMessageIcon = (metadata?: Message['metadata']) => {
    if (!metadata?.toolCalls) return <Bot className="h-5 w-5" />;
    
    const functions = metadata.toolCalls.map(tc => tc.function);
    if (functions.includes('tool_db_query_user') || functions.includes('tool_db_recommend_companies')) {
      return <Database className="h-5 w-5" />;
    }
    if (functions.includes('tool_web_search') || functions.includes('tool_web_fetch')) {
      return <Search className="h-5 w-5" />;
    }
    return <Brain className="h-5 w-5" />;
  };

  const renderToolCalls = (metadata?: Message['metadata']) => {
    if (!metadata?.toolCalls) return null;

    return (
      <div className="mt-3 space-y-2">
        {metadata.toolCalls.map((toolCall, index) => (
          <div key={index} className="text-xs bg-muted/30 rounded p-2">
            <div className="flex items-center gap-1 font-medium text-muted-foreground">
              {toolCall.function === 'tool_db_query_user' && <Database className="h-3 w-3" />}
              {toolCall.function === 'tool_db_recommend_companies' && <TrendingUp className="h-3 w-3" />}
              {toolCall.function === 'tool_web_search' && <Search className="h-3 w-3" />}
              {toolCall.function === 'tool_web_fetch' && <Globe className="h-3 w-3" />}
              <span>{toolCall.function.replace('tool_', '').replace('_', ' ')}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const loadRecommendations = () => {
    refetchRecommendations();
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          GigBot AI Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive AI assistant with database access, web search, and personalized recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Chat with GigBot
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleVoiceRecognition}
                    className={isListening ? "bg-red-50 border-red-200" : ""}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTextToSpeech}
                    className={isSpeaking ? "bg-green-50 border-green-200" : ""}
                  >
                    {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col gap-4 p-4">
              <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          {getMessageIcon(message.metadata)}
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {renderToolCalls(message.metadata)}
                        <div className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      {message.type === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bot className="h-5 w-5 animate-pulse" />
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">GigBot is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about gig opportunities, applications, expenses, or anything else..."
                  disabled={isProcessing}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isProcessing || !inputMessage.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Tools and Features */}
        <div className="space-y-6">
          {/* AI Capabilities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Database className="h-4 w-4 text-blue-600" />
                <span>Database Query & Analysis</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Search className="h-4 w-4 text-green-600" />
                <span>Web Search & Research</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span>Smart Recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Brain className="h-4 w-4 text-orange-600" />
                <span>Personalized Insights</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MessageSquare className="h-4 w-4 text-red-600" />
                <span>Voice Input/Output</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={loadRecommendations}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Get Company Recommendations
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setInputMessage("What's my current status?")}
              >
                <Database className="h-4 w-4 mr-2" />
                Check My Status
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setInputMessage("Find me new gig opportunities")}
              >
                <Search className="h-4 w-4 mr-2" />
                Find Opportunities
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setInputMessage("Give me earnings optimization tips")}
              >
                <Zap className="h-4 w-4 mr-2" />
                Optimize Earnings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setInputMessage("Tell me what companies I am actively working for")}
              >
                <Database className="h-4 w-4 mr-2" />
                Active Companies
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations Panel */}
          {recommendations && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations?.recommendations?.slice(0, 3).map((rec: Recommendation, index: number) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{rec.company}</h4>
                      <Badge variant="secondary">{rec.score}% match</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.why}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Region</span>
                        <span>{Math.round(rec.breakdown.regionMatch * 100)}%</span>
                      </div>
                      <Progress value={rec.breakdown.regionMatch * 100} className="h-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Usage Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Messages</span>
                <span>{messages.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>AI Tools Used</span>
                <span>{messages.filter(m => m.metadata?.toolCalls).length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Session Time</span>
                <span>Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}