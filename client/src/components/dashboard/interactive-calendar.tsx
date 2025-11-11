import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  DollarSign, 

  Star,
  Briefcase,
  Wrench,
  FileText,
  StickyNote,
  Bell,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RESPONSIVE_GRIDS } from "@/lib/responsive-utils";

// Sample events for the calendar
const initialEvents = [
  {
    id: 1,
    date: new Date(2025, 0, 3), // January 3, 2025
    title: "DoorDash Shift",
    time: "5:00 PM - 10:00 PM",
    type: "work",
    location: "Downtown Atlanta",
    earnings: "$85"
  },
  {
    id: 2,
    date: new Date(2025, 0, 5), // January 5, 2025
    title: "Vehicle Inspection",
    time: "2:00 PM - 3:00 PM",
    type: "maintenance",
    location: "AutoCheck Station",
    earnings: "-$50"
  },
  {
    id: 3,
    date: new Date(2025, 0, 8), // January 8, 2025
    title: "Uber Peak Hours",
    time: "7:00 AM - 11:00 AM",
    type: "work",
    location: "Airport Area",
    earnings: "$120"
  },
  {
    id: 4,
    date: new Date(2025, 0, 10), // January 10, 2025
    title: "Insurance Renewal",
    time: "1:00 PM - 2:00 PM",
    type: "admin",
    location: "Insurance Office",
    earnings: "-$150"
  },
  {
    id: 5,
    date: new Date(2025, 0, 15), // January 15, 2025
    title: "GoShare Moving Job",
    time: "10:00 AM - 4:00 PM",
    type: "work",
    location: "Buckhead",
    earnings: "$200"
  }
];

const eventTypes = {
  work: { 
    color: "bg-green-100 text-green-800 border-green-200", 
    icon: Briefcase,
    gradient: "from-green-500 to-emerald-600"
  },
  maintenance: { 
    color: "bg-orange-100 text-orange-800 border-orange-200", 
    icon: Wrench,
    gradient: "from-orange-500 to-amber-600"
  },
  admin: { 
    color: "bg-blue-100 text-blue-800 border-blue-200", 
    icon: FileText,
    gradient: "from-blue-500 to-indigo-600"
  },
  personal: { 
    color: "bg-purple-100 text-purple-800 border-purple-200", 
    icon: Star,
    gradient: "from-purple-500 to-pink-600"
  }
};

export default function InteractiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState(initialEvents);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'work',
    location: '',
    earnings: ''
  });
  const [dayNotes, setDayNotes] = useState<{[key: string]: {notes: string, reminder?: {time: string, text: string}}}>({});
  const [currentNote, setCurrentNote] = useState('');
  const [currentReminder, setCurrentReminder] = useState({time: '', text: ''});
  const { toast } = useToast();

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get days in month
  const getDaysInMonth = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Check if a day has events
  const getDayEvents = (day: number) => {
    if (!day) return [];
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => 
      event.date.toDateString() === dayDate.toDateString()
    );
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    if (!day) return;
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    
    // Load existing notes for this date
    const dateKey = clickedDate.toDateString();
    const existingNote = dayNotes[dateKey];
    setCurrentNote(existingNote?.notes || '');
    setCurrentReminder(existingNote?.reminder || {time: '', text: ''});
    setIsNotesModalOpen(true);
  };



  // Handle event submission
  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const eventId = events.length + 1;
    const newEventObj = {
      id: eventId,
      date: selectedDate,
      title: newEvent.title,
      time: newEvent.time,
      type: newEvent.type as keyof typeof eventTypes,
      location: newEvent.location,
      earnings: newEvent.earnings
    };

    setEvents([...events, newEventObj]);
    setNewEvent({ title: '', time: '', type: 'work', location: '', earnings: '' });
    setIsEventModalOpen(false);
    
    toast({
      title: "Event Added",
      description: `${newEvent.title} has been added to your calendar`,
    });
  };

  // Handle notes submission
  const handleNotesSubmit = () => {
    if (!selectedDate) return;
    
    const dateKey = selectedDate.toDateString();
    const noteData: {notes: string, reminder?: {time: string, text: string}} = {
      notes: currentNote
    };
    
    if (currentReminder.time && currentReminder.text) {
      noteData.reminder = currentReminder;
    }
    
    setDayNotes({
      ...dayNotes,
      [dateKey]: noteData
    });
    
    setIsNotesModalOpen(false);
    
    toast({
      title: "Notes Saved",
      description: currentReminder.time ? "Note and reminder saved successfully" : "Note saved successfully",
    });
  };

  // Check if a day has notes
  const getDayNotes = (day: number) => {
    if (!day) return null;
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = dayDate.toDateString();
    return dayNotes[dateKey];
  };

  // Check if a day is today
  const isToday = (day: number) => {
    if (!day) return false;
    const today = new Date();
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return today.toDateString() === dayDate.toDateString();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const selectedDateEvents = selectedDate ? getDayEvents(selectedDate.getDate()) : [];

  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Schedule Overview</h2>
              <p className="text-sm text-slate-500 font-medium">Manage your gig work calendar</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="pill-button bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Title</label>
                    <Input
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="e.g., DoorDash Delivery"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  
                  <div className={RESPONSIVE_GRIDS.twoCol}>
                    <div>
                      <label className="block text-sm font-medium mb-1">Time</label>
                      <Input
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        placeholder="e.g., 2:00 PM - 6:00 PM"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="admin">Administrative</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className={RESPONSIVE_GRIDS.twoCol}>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <Input
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        placeholder="e.g., Downtown Atlanta"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Expected Earnings</label>
                      <Input
                        value={newEvent.earnings}
                        onChange={(e) => setNewEvent({...newEvent, earnings: e.target.value})}
                        placeholder="e.g., $75"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1 pill-button bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                      Add Event
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEventModalOpen(false)} className="pill-button">
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      
      {/* Notes Modal */}
      <Dialog open={isNotesModalOpen} onOpenChange={setIsNotesModalOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-blue-600" />
              Notes for {selectedDate?.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Notes Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Daily Notes</label>
              <Textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Add your notes for this date..."
                className="rounded-xl min-h-[100px] resize-none"
              />
            </div>
            
            {/* Reminder Section */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Bell className="w-4 h-4 text-yellow-600" />
                Set Reminder (Optional)
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Reminder Time</label>
                  <Input
                    type="time"
                    value={currentReminder.time}
                    onChange={(e) => setCurrentReminder({...currentReminder, time: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Reminder Message</label>
                  <Input
                    value={currentReminder.text}
                    onChange={(e) => setCurrentReminder({...currentReminder, text: e.target.value})}
                    placeholder="e.g., Call client about pickup"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleNotesSubmit} 
                className="flex-1 pill-button bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Notes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsNotesModalOpen(false)} 
                className="pill-button"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <CardContent className="p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="rounded-full hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h3 className="text-lg font-semibold text-slate-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            className="rounded-full hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {getDaysInMonth().map((day, index) => {
            const dayEvents = day ? getDayEvents(day) : [];
            const dayNote = day ? getDayNotes(day) : null;
            const isSelected = selectedDate && day === selectedDate.getDate();
            const isTodayDate = day ? isToday(day) : false;
            
            return (
              <div
                key={index}
                className={`calendar-day ${isSelected ? 'selected' : ''} ${dayEvents.length > 0 ? 'has-events' : ''} ${dayNote ? 'has-notes' : ''} ${isTodayDate ? 'today' : ''}`}
                onClick={() => day && handleDayClick(day)}
              >
                {day}
                {isTodayDate && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  </div>
                )}
                {dayNote && (
                  <div className="absolute top-1 right-1 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {dayNote.reminder && (
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              Events for {selectedDate.toLocaleDateString()}
            </h4>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map(event => {
                  const eventType = eventTypes[event.type];
                  const EventIcon = eventType.icon;
                  
                  return (
                    <div key={event.id} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-xl bg-gradient-to-r ${eventType.gradient}`}>
                            <EventIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="font-medium text-slate-800">{event.title}</h5>
                            <div className="text-sm text-slate-600 space-y-1">
                              {event.time && (
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {event.time}
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {event.location}
                                </div>
                              )}
                              {event.earnings && (
                                <div className="flex items-center">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  {event.earnings}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge className={eventType.color}>
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">
                No events scheduled for this date
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}