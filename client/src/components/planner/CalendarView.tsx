import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskCard } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CardModal from "./CardModal";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    "en-US": enUS,
  },
});

interface CalendarViewProps {
  cards: TaskCard[];
  lists: any[];
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: TaskCard;
  color: string;
}

export default function CalendarView({ cards, lists }: CalendarViewProps) {
  const [selectedCard, setSelectedCard] = useState<TaskCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateCardMutation = useMutation({
    mutationFn: async ({ cardId, dueDate }: { cardId: number; dueDate: Date }) => {
      const response = await apiRequest("PUT", `/api/task-cards/${cardId}`, {
        dueDate: dueDate.toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-cards"] });
      toast({
        title: "Success",
        description: "Card due date updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update card",
        variant: "destructive",
      });
    },
  });

  const events: CalendarEvent[] = useMemo(() => {
    return cards
      .filter(card => card.dueDate)
      .map(card => {
        const dueDate = new Date(card.dueDate!);
        
        // Determine color based on priority and status
        let color = "#60a5fa"; // Default blue-400
        if (card.priority === "High") color = "#f87171"; // Red-400
        else if (card.priority === "Medium") color = "#60a5fa"; // Blue-400
        else if (card.priority === "Low") color = "#9ca3af"; // Gray-400
        
        // Check if overdue
        if (dueDate < new Date()) {
          color = "#ef4444"; // Red-500 for overdue
        }

        return {
          id: card.id,
          title: card.title,
          start: dueDate,
          end: new Date(dueDate.getTime() + 60 * 60 * 1000), // 1 hour duration
          resource: card,
          color,
        };
      });
  }, [cards]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedCard(event.resource);
    setIsModalOpen(true);
  };

  const handleEventDrop = ({ event, start }: { event: CalendarEvent; start: Date }) => {
    updateCardMutation.mutate({
      cardId: event.id,
      dueDate: start,
    });
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        borderColor: event.color,
        color: "white",
        borderRadius: "4px",
        fontSize: "12px",
        padding: "2px 6px",
      },
    };
  };

  const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    const isOverdue = event.start < new Date();
    const card = event.resource;
    
    return (
      <div className="flex items-center gap-1 text-xs">
        <div className="flex-1 truncate">
          {event.title}
        </div>
        {isOverdue && (
          <span className="bg-red-100 text-red-700 px-1 rounded text-xs">
            Overdue
          </span>
        )}
        {card.checklist && Array.isArray(card.checklist) && card.checklist.length > 0 && (
          <span className="text-xs opacity-75">
            {card.checklist.filter((item: any) => item.completed).length}/{card.checklist.length}
          </span>
        )}
      </div>
    );
  };

  const CustomToolbar = ({ label, onNavigate, onView, view }: any) => {
    return (
      <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("PREV")}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            Previous
          </button>
          <button
            onClick={() => onNavigate("TODAY")}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={() => onNavigate("NEXT")}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            Next
          </button>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
        
        <div className="flex items-center gap-1">
          {["month", "week", "day"].map((viewType) => (
            <button
              key={viewType}
              onClick={() => onView(viewType)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                view === viewType
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {viewType}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const CustomDateHeader = ({ label, date }: { label: string; date: Date }) => {
    const today = new Date();
    const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    const dayEvents = events.filter(event => 
      format(event.start, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    const overdueCount = dayEvents.filter(event => event.start < today).length;
    
    return (
      <div className="flex flex-col items-center">
        <span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>
          {label}
        </span>
        {dayEvents.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-xs">
              {dayEvents.length}
            </span>
            {overdueCount > 0 && (
              <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full text-xs">
                {overdueCount} overdue
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Calendar View</h3>
          <p className="text-sm text-gray-600">
            Drag cards to reschedule due dates. Click cards to edit details.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>High Priority / Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Low Priority</span>
          </div>
        </div>
      </div>

      <div style={{ height: "600px" }} className="bg-white rounded-lg border p-2">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent,
            toolbar: CustomToolbar,
            month: {
              dateHeader: CustomDateHeader,
            },
          }}
          draggableAccessor={() => true}
          resizable={false}
          popup={true}
          popupOffset={{ x: 30, y: 20 }}
          views={["month", "week", "day"]}
          defaultView="month"
          step={60}
          showMultiDayTimes
          tooltipAccessor={(event: CalendarEvent) => {
            const card = event.resource;
            return `${card.title}\nDue: ${format(event.start, "MMM d, h:mm a")}\nPriority: ${card.priority || "Medium"}`;
          }}
        />
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          lists={lists}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}