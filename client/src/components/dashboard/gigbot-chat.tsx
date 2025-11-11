import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Mic, MicOff, Volume2, VolumeX, MessageSquare, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

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
}

export default function GigBotChat() {
  const { user } = useAuth();
  const userName = user?.firstName || user?.fullName?.split(' ')[0] || 'there';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hi ${userName}! I'm GigBot, your AI assistant. Ask me about gig opportunities, your applications, earnings optimization, or anything else related to your gig work!`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Update greeting when user data loads
  useEffect(() => {
    if (user && userName !== 'there') {
      setMessages(prev => {
        const updatedMessages = [...prev];
        if (updatedMessages[0]?.id === '1') {
          updatedMessages[0] = {
            ...updatedMessages[0],
            content: `Hi ${userName}! I'm GigBot, your AI assistant. Ask me about gig opportunities, your applications, earnings optimization, or anything else related to your gig work!`
          };
        }
        return updatedMessages;
      });
    }
  }, [user, userName]);

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

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Text-to-speech function with human-like voice
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Process text for more human-like speech patterns
      const humanText = text
        // Add natural breathing pauses
        .replace(/\. /g, '... ')
        .replace(/\, /g, ', ')
        .replace(/\: /g, ': ')
        .replace(/\; /g, '; ')
        .replace(/\? /g, '?... ')
        .replace(/\! /g, '!... ')
        // Make contractions more natural
        .replace(/cannot/g, "can't")
        .replace(/will not/g, "won't")
        .replace(/should not/g, "shouldn't")
        .replace(/would not/g, "wouldn't")
        .replace(/could not/g, "couldn't")
        .replace(/do not/g, "don't")
        .replace(/does not/g, "doesn't")
        .replace(/did not/g, "didn't")
        .replace(/is not/g, "isn't")
        .replace(/are not/g, "aren't")
        .replace(/was not/g, "wasn't")
        .replace(/were not/g, "weren't")
        .replace(/have not/g, "haven't")
        .replace(/has not/g, "hasn't")
        .replace(/had not/g, "hadn't")
        // Add emphasis pauses
        .replace(/\bhowever\b/gi, 'however...')
        .replace(/\bwell\b/gi, 'well...')
        .replace(/\bso\b/gi, 'so...')
        .replace(/\bnow\b/gi, 'now...');
      
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.rate = 0.8; // Even slower for more human-like speech
      utterance.pitch = 0.95; // Slightly lower, more natural pitch
      utterance.volume = 0.85; // Softer, more conversational volume
      
      // Select the most human-sounding voice available
      const voices = window.speechSynthesis.getVoices();
      const humanVoice = voices.find(voice => 
        // First priority: Premium/Neural voices
        voice.name.toLowerCase().includes('neural') ||
        voice.name.toLowerCase().includes('premium') ||
        voice.name.toLowerCase().includes('enhanced') ||
        // Second priority: High-quality named voices
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('ava') ||
        voice.name.toLowerCase().includes('serena') ||
        voice.name.toLowerCase().includes('allison') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('fiona') ||
        // Third priority: Google/Microsoft high-quality voices
        (voice.name.toLowerCase().includes('google') && voice.name.toLowerCase().includes('standard')) ||
        (voice.name.toLowerCase().includes('microsoft') && voice.name.toLowerCase().includes('zira')) ||
        // Fourth priority: Any quality female voice
        voice.name.toLowerCase().includes('susan') ||
        voice.name.toLowerCase().includes('karen')
      ) || voices.find(voice => 
        // Final fallback: any female voice
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman')
      );
      
      if (humanVoice) {
        utterance.voice = humanVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speech
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Start voice recognition
  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      try {
        recognition.start();
      } catch (error) {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not start voice recognition.",
          variant: "destructive"
        });
      }
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest(`/api/gigbot/chat`, { 
        method: 'POST',
        body: { message, sessionId: 'dashboard' }
      });
      return await response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString() + '_assistant',
        type: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response if text-to-speech is available
      if ('speechSynthesis' in window) {
        speakText(data.message);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!inputMessage.trim() || chatMutation.isPending) return;
    
    const userMessage: Message = {
      id: Date.now().toString() + '_user',
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage("");
  };

  if (!isExpanded) {
    return (
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => setIsExpanded(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="text-white text-sm" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Chat with GigBot</h3>
                <p className="text-xs text-slate-600">Ask questions, get recommendations</p>
              </div>
            </div>
            <MessageSquare className="text-slate-400 w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Bot className="text-white text-sm" />
            </div>
            GigBot Chat
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(false)}
            className="hover:bg-slate-100"
            data-testid="button-minimize-gigbot"
          >
            <Minimize2 className="w-4 h-4 mr-1" />
            Minimize
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {/* Messages Area */}
          <ScrollArea className="h-64 border rounded-lg p-3 bg-gray-50">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="text-white text-xs" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-red-500 text-white'
                        : 'bg-white border shadow-sm text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.type === 'user' && (
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="text-white text-xs" />
                    </div>
                  )}
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="text-white text-xs" />
                  </div>
                  <div className="bg-white border shadow-sm p-2 rounded-lg text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Ask GigBot anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={chatMutation.isPending}
                className="text-sm"
              />
            </div>
            
            {/* Voice Controls */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={isListening ? stopListening : startListening}
              disabled={chatMutation.isPending}
              className={`${isListening ? 'bg-red-50 border-red-200' : ''}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            {/* Speech Control */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={isSpeaking ? stopSpeaking : () => {}}
              disabled={!isSpeaking}
              className={`${isSpeaking ? 'bg-green-50 border-green-200' : ''}`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            {/* Send Button */}
            <Button
              type="submit"
              disabled={!inputMessage.trim() || chatMutation.isPending}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}