import { useState, useEffect } from "react";

interface ReminderCountProps {
  className?: string;
}

export function ReminderCount({ className = "" }: ReminderCountProps) {
  const [count, setCount] = useState(0);

  const fetchReminderCount = async () => {
    try {
      const response = await fetch('/api/reminders');
      if (response.ok) {
        const reminders = await response.json();
        console.log("Fetched reminders for count:", reminders.length, reminders);
        setCount(reminders.length);
      }
    } catch (error) {
      console.error("Failed to fetch reminder count:", error);
    }
  };

  useEffect(() => {
    fetchReminderCount();
    
    // Listen for reminder updates
    const handleReminderUpdate = () => {
      fetchReminderCount();
    };
    
    const handleReminderRemoved = (event: any) => {
      console.log("ReminderCount: reminderRemoved event received", event.detail);
      fetchReminderCount();
    };

    const handleReminderCountUpdated = () => {
      console.log("ReminderCount: global reminder count update triggered");
      fetchReminderCount();
    };
    
    window.addEventListener('notesUpdated', handleReminderUpdate);
    window.addEventListener('reminderRemoved', handleReminderRemoved);
    window.addEventListener('reminderCountUpdated', handleReminderCountUpdated);
    
    return () => {
      window.removeEventListener('notesUpdated', handleReminderUpdate);
      window.removeEventListener('reminderRemoved', handleReminderRemoved);
      window.removeEventListener('reminderCountUpdated', handleReminderCountUpdated);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full ${className}`}>
      {count}
    </span>
  );
}