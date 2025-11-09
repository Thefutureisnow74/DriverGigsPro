import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface ReminderIndicatorProps {
  companyId: number;
  className?: string;
}

// Global cache for reminders to avoid multiple API calls
let globalRemindersCache: Record<number, any> | null = null;
let cachePromise: Promise<void> | null = null;

export default function ReminderIndicator({ companyId, className = "" }: ReminderIndicatorProps) {
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderText, setReminderText] = useState("");
  const [reminderDate, setReminderDate] = useState<Date | null>(null);

  useEffect(() => {
    checkReminder();
    
    // Listen for notes updates to refresh reminder status
    const handleNotesUpdate = (event: CustomEvent) => {
      if (event.detail.companyId === companyId) {
        // Clear cache and reload when specific company notes are updated
        globalRemindersCache = null;
        checkReminder();
      }
    };
    
    const handleReminderRemoved = (event: CustomEvent) => {
      if (event.detail.companyId === companyId) {
        // Clear cache and update state when reminder is removed
        globalRemindersCache = null;
        setHasReminder(false);
      }
    };
    
    window.addEventListener('notesUpdated', handleNotesUpdate as EventListener);
    window.addEventListener('reminderRemoved', handleReminderRemoved as EventListener);
    return () => {
      window.removeEventListener('notesUpdated', handleNotesUpdate as EventListener);
      window.removeEventListener('reminderRemoved', handleReminderRemoved as EventListener);
    };
  }, [companyId]);

  const loadRemindersCache = async () => {
    if (cachePromise) {
      await cachePromise;
      return;
    }

    cachePromise = (async () => {
      try {
        const response = await fetch('/api/reminders/bulk');
        if (response.ok) {
          globalRemindersCache = await response.json();
        } else {
          globalRemindersCache = {};
        }
      } catch (error) {
        console.error("Failed to load reminders cache:", error);
        globalRemindersCache = {};
      } finally {
        cachePromise = null;
      }
    })();

    await cachePromise;
  };

  const checkReminder = async () => {
    try {
      // Load cache if not available
      if (!globalRemindersCache) {
        await loadRemindersCache();
      }

      const reminder = globalRemindersCache?.[companyId];
      if (reminder && reminder.reminderDate) {
        const reminderDateTime = new Date(reminder.reminderDate);
        const now = new Date();
        
        // Only show if reminder is in the future or today
        if (reminderDateTime >= new Date(now.toDateString())) {
          setHasReminder(true);
          setReminderText(reminder.reminderText || "Reminder set");
          setReminderDate(reminderDateTime);
        } else {
          setHasReminder(false);
        }
      } else {
        setHasReminder(false);
      }
    } catch (error) {
      console.error("Failed to check reminder:", error);
      setHasReminder(false);
    }
  };

  const formatReminderDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleRemoveReminder = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(`/api/job-search-notes/${companyId}/remove-reminder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setHasReminder(false);
        window.dispatchEvent(new CustomEvent('reminderRemoved', { detail: { companyId } }));
      }
    } catch (error) {
      console.error("Failed to remove reminder:", error);
    }
  };

  if (!hasReminder) return null;

  return (
    <Badge 
      data-reminder-id={globalRemindersCache?.[companyId]?.id}
      className={`bg-red-700 text-white border-red-800 hover:bg-red-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 group cursor-pointer transition-all duration-300 ${className}`}
      title={`${reminderText} - ${reminderDate ? formatReminderDate(reminderDate) : ''}`}
    >
      <Bell className="w-2.5 h-2.5" />
      Reminder
      <button
        onClick={handleRemoveReminder}
        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-200"
        title="Remove reminder"
      >
        ×
      </button>
    </Badge>
  );
}