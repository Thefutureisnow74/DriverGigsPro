import { GigBotAvatar } from "@/components/ui/gig-bot-avatar";
import { useLocation } from "wouter";

export default function FloatingGigBotButton() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation("/enhanced-ai-assistant");
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-2xl group"
      title="Chat with GigBot - Your AI Assistant"
      data-testid="button-gigbot-float"
    >
      <div className="relative">
        <GigBotAvatar size="xl" animated={true} />
        
        {/* Hover tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-slate-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Chat with GigBot
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
