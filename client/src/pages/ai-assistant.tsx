import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Mic, MicOff, Volume2, VolumeX, Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

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
    webSearch?: boolean;
    appData?: boolean;
    sources?: string[];
    processing?: boolean;
  };
}

interface VoiceRecognition {
  recognition: SpeechRecognition | null;
  isListening: boolean;
  isSupported: boolean;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm GigBot, your AI assistant for DriverGigsPro. I can help you with:\n\n• **Company Research** - Find and add new gig opportunities\n• **Database Management** - Search, update, and organize your data\n• **Application Tracking** - Manage your job applications and interviews\n• **Business Insights** - Analyze your gig work performance\n• **Document Processing** - Extract data from PDFs and files\n\nHow can I help you today?",
      timestamp: new Date(),
      metadata: { processing: false }
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voice, setVoice] = useState<VoiceRecognition>({
    recognition: null,
    isListening: false,
    isSupported: false
  });
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch user data
  const { data: applications } = useQuery({ queryKey: ["/api/applications"] });
  const { data: vehicles } = useQuery({ queryKey: ["/api/vehicles"] });
  const { data: companies } = useQuery({ queryKey: ["/api/companies"] });
  const { data: userStats } = useQuery({ queryKey: ["/api/user/stats"] });

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        sendMessage(transcript, true);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoice(prev => ({ ...prev, isListening: false }));
      };

      recognition.onend = () => {
        setVoice(prev => ({ ...prev, isListening: false }));
      };

      setVoice({
        recognition,
        isListening: false,
        isSupported: true
      });
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startVoiceRecognition = () => {
    if (voice.recognition) {
      voice.recognition.start();
      setVoice(prev => ({ ...prev, isListening: true }));
    }
  };

  const stopVoiceRecognition = () => {
    if (voice.recognition) {
      voice.recognition.stop();
      setVoice(prev => ({ ...prev, isListening: false }));
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && ttsEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const processDocument = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('document', uploadedFile);

    try {
      const response = await fetch('/api/ai-assistant/process-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: `📄 **Document Processed Successfully**\n\n${data.content}\n\n${data.summary || ''}`,
          timestamp: new Date(),
          metadata: { processing: false }
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Failed to process document');
      }
    } catch (error) {
      console.error('Document processing error:', error);
      toast({
        title: "Upload Error",
        description: "Failed to process document. Please try again.",
        variant: "destructive",
      });
    }

    setIsUploading(false);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async (messageText?: string, wasVoiceInput = false) => {
    const messageToSend = messageText || inputMessage.trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Add processing message
    const processingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: "Processing your request...",
      timestamp: new Date(),
      metadata: { processing: true }
    };
    setMessages(prev => [...prev, processingMessage]);

    try {
      const response = await fetch("/api/ai-assistant/advanced-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: messageToSend,
          userContext: {
            applications: applications || [],
            vehicles: vehicles || [],
            companies: companies || [],
            userStats: userStats || {}
          }
        })
      });

      const data = await response.json();

      // Remove processing message
      setMessages(prev => prev.filter(msg => !msg.metadata?.processing));

      let assistantContent;
      if (data.error === 'MISSING_API_KEY') {
        assistantContent = `🚨 **OpenAI API Key Required**\n\nI need an OpenAI API key to provide intelligent responses. Please contact your administrator to configure the OPENAI_API_KEY environment variable.`;
        
        toast({
          title: "OpenAI API Key Required",
          description: "AI Assistant functionality is limited without an OpenAI API key.",
          variant: "destructive",
          duration: 8000,
        });
      } else if (data.response && typeof data.response === 'string' && data.response.trim() !== "") {
        assistantContent = data.response;
      } else {
        assistantContent = "I apologize, but I couldn't generate a proper response. Please try again.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        metadata: {
          webSearch: data.metadata?.webSearch || false,
          appData: data.metadata?.appData || false,
          sources: data.metadata?.sources || [],
          processing: false
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak response if it was a voice input
      if (wasVoiceInput && ttsEnabled && assistantContent) {
        speakText(assistantContent);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Remove processing message
      setMessages(prev => prev.filter(msg => !msg.metadata?.processing));
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        metadata: { processing: false }
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get response from AI Assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Clean Header */}
        <div className="mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">GigBot</h1>
                  <p className="text-gray-600">Your AI assistant for DriverGigsPro</p>
                </div>
              </div>

              {/* Simple Controls */}
              <div className="flex items-center gap-2">
                {voice.isSupported && (
                  <Button
                    variant={voice.isListening ? "destructive" : "outline"}
                    size="sm"
                    onClick={voice.isListening ? stopVoiceRecognition : startVoiceRecognition}
                  >
                    {voice.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {voice.isListening ? "Stop" : "Voice"}
                  </Button>
                )}
                
                <Button
                  variant={ttsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Audio
                </Button>

                {isSpeaking && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={stopSpeaking}
                  >
                    Stop Speaking
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col shadow-sm bg-white/70 backdrop-blur-sm border border-gray-200/50">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="flex items-center justify-between">
              <span className="text-gray-800">Chat</span>
              {isLoading && (
                <Badge variant="secondary" className="text-blue-600">
                  Processing...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[85%] ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-blue-500' 
                        : message.metadata?.processing
                          ? 'bg-yellow-500 animate-pulse'
                          : 'bg-purple-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`rounded-lg p-3 shadow-sm ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.metadata?.processing
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-gray-100 border border-gray-200'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>

                      {/* Metadata */}
                      {message.metadata && !message.metadata.processing && (
                        <div className="flex items-center gap-2 mt-2">
                          {message.metadata.webSearch && (
                            <Badge variant="outline" className="text-xs">
                              Web Search
                            </Badge>
                          )}
                          {message.metadata.appData && (
                            <Badge variant="outline" className="text-xs">
                              App Data
                            </Badge>
                          )}
                          {message.metadata.sources && message.metadata.sources.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {message.metadata.sources.length} Sources
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-200/50 p-4">
            {/* File Upload Section */}
            {uploadedFile && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">{uploadedFile.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={processDocument}
                      disabled={isUploading}
                    >
                      {isUploading ? "Processing..." : "Process"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Input Controls */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.txt,.csv,.doc,.docx"
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
              </Button>
              
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your gig work..."
                disabled={isLoading}
                className="flex-1"
              />
              
              <Button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}