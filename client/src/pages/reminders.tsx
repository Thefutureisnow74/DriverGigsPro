import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Calendar, Phone, Mail, Building, Bell, Trash2, X, ExternalLink, ClipboardList, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isToday, isTomorrow, isPast, differenceInDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface Reminder {
  id: number;
  companyId: number | null;
  companyName: string | null;
  reminderDate: string;
  reminderText: string;
  contactName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  notes?: string;
  createdAt: string;
  type: 'company' | 'task';
  cardId?: number | null;
  cardTitle?: string | null;
  dueDate?: string | null;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [overdueFilter, setOverdueFilter] = useState<'all' | 'less10' | 'more10'>('all');
  const [, setLocation] = useLocation();
  const [showNewReminderDialog, setShowNewReminderDialog] = useState(false);
  const [newReminderData, setNewReminderData] = useState({
    reminderDate: '',
    reminderTime: '',
    reminderText: '',
    contactName: '',
    phoneNumber: '',
    emailAddress: '',
    notes: ''
  });

  // Fetch companies for the dropdown
  const { data: companies = [] } = useQuery({
    queryKey: ['/api/companies'],
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch("/api/reminders");
      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      }
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewReminder = async () => {
    if (!newReminderData.reminderDate) {
      alert('Please set a reminder date.');
      return;
    }

    try {
      const reminderDateTime = newReminderData.reminderTime 
        ? new Date(`${newReminderData.reminderDate}T${newReminderData.reminderTime}`)
        : new Date(`${newReminderData.reminderDate}T09:00`);

      const response = await fetch('/api/job-search-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '38492032', // You may need to get this from auth context
          companyId: null, // No company required for general reminders
          reminderDate: reminderDateTime.toISOString(),
          reminderTime: newReminderData.reminderTime,
          reminderText: newReminderData.reminderText,
          contactName: newReminderData.contactName,
          phoneNumber: newReminderData.phoneNumber,
          emailAddress: newReminderData.emailAddress,
          notes: newReminderData.notes,
        }),
      });

      if (response.ok) {
        // Reset form
        setNewReminderData({
          reminderDate: '',
          reminderTime: '',
          reminderText: '',
          contactName: '',
          phoneNumber: '',
          emailAddress: '',
          notes: ''
        });
        setShowNewReminderDialog(false);
        
        // Refresh reminders
        fetchReminders();
        
        // Dispatch global reminder count update event
        window.dispatchEvent(new CustomEvent('reminderCountUpdated'));
        
        console.log('Reminder created successfully');
      } else {
        const errorData = await response.json();
        alert('Failed to create reminder: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to create reminder:', error);
      alert('Failed to create reminder. Please try again.');
    }
  };

  const deleteReminder = async (reminder: Reminder) => {
    try {
      let response;
      
      if (reminder.type === 'company' && reminder.companyId) {
        // Delete company reminder
        response = await fetch(`/api/job-search-notes/${reminder.companyId}/remove-reminder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } else if (reminder.type === 'task' && reminder.cardId) {
        // Delete task reminder by clearing due date and reminder days
        response = await fetch(`/api/task-cards/${reminder.cardId}/dates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startDate: null,
            dueDate: null,
            reminderDays: null
          }),
        });
      }

      if (response && response.ok) {
        // Remove from local state
        setReminders(prev => prev.filter(r => r.id !== reminder.id));
        
        // Trigger global cache refresh for reminder indicators
        if (reminder.companyId) {
          window.dispatchEvent(new CustomEvent('reminderRemoved', { 
            detail: { companyId: reminder.companyId } 
          }));
        }
        
        // Also dispatch a global reminder count update event
        window.dispatchEvent(new CustomEvent('reminderCountUpdated'));
        
        console.log(`Reminder deleted for ${reminder.reminderText}`);
      } else {
        const errorData = response ? await response.json() : { message: "Unknown error" };
        alert("Failed to delete reminder: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to delete reminder:", error);
      alert("Failed to delete reminder. Please try again.");
    }
  };

  const navigateToTask = (cardId: number, cardTitle: string) => {
    // Navigate to task management page
    setLocation('/task-management');
    
    // Wait for navigation to complete, then trigger card highlighting
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('navigateToTask', {
        detail: { cardId, cardTitle }
      }));
    }, 100);
  };

  const getRemindersForToday = () => {
    return reminders.filter(reminder => 
      isToday(new Date(reminder.reminderDate))
    );
  };

  const getRemindersForTomorrow = () => {
    return reminders.filter(reminder => 
      isTomorrow(new Date(reminder.reminderDate))
    );
  };

  const getUpcomingReminders = () => {
    return reminders.filter(reminder => {
      const reminderDate = new Date(reminder.reminderDate);
      return !isToday(reminderDate) && !isTomorrow(reminderDate) && !isPast(reminderDate);
    });
  };

  const getOverdueReminders = () => {
    const overdueReminders = reminders.filter(reminder => 
      isPast(new Date(reminder.reminderDate)) && !isToday(new Date(reminder.reminderDate))
    );

    if (overdueFilter === 'less10') {
      return overdueReminders.filter(reminder => {
        const daysOverdue = Math.abs(differenceInDays(new Date(reminder.reminderDate), new Date()));
        return daysOverdue <= 10;
      });
    } else if (overdueFilter === 'more10') {
      return overdueReminders.filter(reminder => {
        const daysOverdue = Math.abs(differenceInDays(new Date(reminder.reminderDate), new Date()));
        return daysOverdue > 10;
      });
    }
    
    return overdueReminders;
  };

  const getReminderPriority = (reminderDate: string) => {
    const date = new Date(reminderDate);
    if (isPast(date) && !isToday(date)) return "overdue";
    if (isToday(date)) return "today";
    if (isTomorrow(date)) return "tomorrow";
    return "upcoming";
  };

  const getReminderBadgeStyle = (priority: string) => {
    switch (priority) {
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "today":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "tomorrow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const formatReminderDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date)) return `${Math.abs(differenceInDays(date, new Date()))} days overdue`;
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  const navigateToCompany = (companyId: number, companyName: string, reminderId?: number) => {
    // Store company and reminder info in localStorage for navigation
    localStorage.setItem('scrollToCompanyId', companyId.toString());
    if (reminderId) {
      localStorage.setItem('highlightReminderId', reminderId.toString());
      console.log(`Navigating to company ${companyName} (ID: ${companyId}) with reminder ID: ${reminderId}`);
    } else {
      console.log(`Navigating to company ${companyName} (ID: ${companyId}) without specific reminder`);
    }
    
    // Navigate to company page
    setLocation('/companies');
  };

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => {
    const priority = getReminderPriority(reminder.reminderDate);
    
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer group">
        <div onClick={() => {
          if (reminder.type === 'company' && reminder.companyId && reminder.companyName) {
            navigateToCompany(reminder.companyId, reminder.companyName, reminder.id);
          } else if (reminder.type === 'task' && reminder.cardId && reminder.cardTitle) {
            navigateToTask(reminder.cardId, reminder.cardTitle);
          }
        }}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  {reminder.type === 'company' ? (
                    <>
                      <Building className="h-4 w-4" />
                      {reminder.companyName}
                    </>
                  ) : (
                    <>
                      <ClipboardList className="h-4 w-4" />
                      {reminder.cardTitle || reminder.reminderText}
                    </>
                  )}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {formatReminderDate(reminder.reminderDate)}
                  <Badge className={getReminderBadgeStyle(priority)}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
                      onClick={(e) => e.stopPropagation()} // Prevent card navigation when clicking delete
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this reminder for <strong>
                          {reminder.type === 'company' ? reminder.companyName : reminder.cardTitle || reminder.reminderText}
                        </strong>?
                        <br />
                        <span className="text-sm text-gray-600 mt-1 block">"{reminder.reminderText}"</span>
                        <br />
                        <span className="text-xs text-gray-500 mt-1 block">
                          {reminder.type === 'company' ? 'Company Reminder' : 'Admin Task Reminder'}
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteReminder(reminder)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Reminder
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
        </div>
        <CardContent className="pt-0">
          {reminder.reminderText && (
            <div className="mb-3">
              <p className="text-gray-700 font-medium">{reminder.reminderText}</p>
            </div>
          )}
          
          {/* Show contact info for company reminders */}
          {reminder.type === 'company' && (reminder.contactName || reminder.phoneNumber || reminder.emailAddress) && (
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
              {reminder.contactName && (
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {reminder.contactName}
                </div>
              )}
              {reminder.phoneNumber && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {reminder.phoneNumber}
                </div>
              )}
              {reminder.emailAddress && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {reminder.emailAddress}
                </div>
              )}
            </div>
          )}

          {/* Show due date info for task reminders */}
          {reminder.type === 'task' && reminder.dueDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Due: {format(new Date(reminder.dueDate), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
          )}

          {reminder.notes && (
            <div className="bg-gray-50 rounded-lg p-3 mt-3">
              <p className="text-sm text-gray-700">{reminder.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Reminders</h1>
        <div className="text-center py-8">
          <div className="animate-pulse">Loading reminders...</div>
        </div>
      </div>
    );
  }

  const todayReminders = getRemindersForToday();
  const tomorrowReminders = getRemindersForTomorrow();
  const upcomingReminders = getUpcomingReminders();
  const overdueReminders = getOverdueReminders();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Bell className="w-5 h-5" />
            {reminders.length} total reminders
          </div>
          <Dialog open={showNewReminderDialog} onOpenChange={setShowNewReminderDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Reminder</DialogTitle>
                <DialogDescription>
                  Set a personal reminder to help you stay organized and on track with important tasks.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Date and Time */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reminderDate" className="text-right">Date</Label>
                  <div className="col-span-3">
                    <Input
                      id="reminderDate"
                      type="date"
                      value={newReminderData.reminderDate}
                      onChange={(e) => setNewReminderData(prev => ({...prev, reminderDate: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reminderTime" className="text-right">Time</Label>
                  <div className="col-span-3">
                    <Input
                      id="reminderTime"
                      type="time"
                      value={newReminderData.reminderTime}
                      onChange={(e) => setNewReminderData(prev => ({...prev, reminderTime: e.target.value}))}
                      placeholder="Optional - defaults to 9:00 AM"
                    />
                  </div>
                </div>

                {/* Reminder Message */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reminderText" className="text-right">Message</Label>
                  <div className="col-span-3">
                    <Input
                      id="reminderText"
                      value={newReminderData.reminderText}
                      onChange={(e) => setNewReminderData(prev => ({...prev, reminderText: e.target.value}))}
                      placeholder="What to remind you about..."
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactName" className="text-right">Contact</Label>
                  <div className="col-span-3">
                    <Input
                      id="contactName"
                      value={newReminderData.contactName}
                      onChange={(e) => setNewReminderData(prev => ({...prev, contactName: e.target.value}))}
                      placeholder="Contact person name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
                  <div className="col-span-3">
                    <Input
                      id="phoneNumber"
                      value={newReminderData.phoneNumber}
                      onChange={(e) => setNewReminderData(prev => ({...prev, phoneNumber: e.target.value}))}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emailAddress" className="text-right">Email</Label>
                  <div className="col-span-3">
                    <Input
                      id="emailAddress"
                      type="email"
                      value={newReminderData.emailAddress}
                      onChange={(e) => setNewReminderData(prev => ({...prev, emailAddress: e.target.value}))}
                      placeholder="Email address"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
                  <div className="col-span-3">
                    <Textarea
                      id="notes"
                      value={newReminderData.notes}
                      onChange={(e) => setNewReminderData(prev => ({...prev, notes: e.target.value}))}
                      placeholder="Additional notes..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewReminderDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createNewReminder} className="bg-blue-600 hover:bg-blue-700">
                  Create Reminder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {reminders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reminders Set</h3>
            <p className="text-gray-600">
              Set reminders in your company notes to keep track of important follow-ups.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Overdue Reminders */}
          {reminders.filter(reminder => isPast(new Date(reminder.reminderDate)) && !isToday(new Date(reminder.reminderDate))).length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Overdue ({overdueReminders.length})
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant={overdueFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOverdueFilter('all')}
                    className="text-sm"
                  >
                    All Overdue
                  </Button>
                  <Button
                    variant={overdueFilter === 'less10' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOverdueFilter('less10')}
                    className="text-sm"
                  >
                    Overdue less than 10 days
                  </Button>
                  <Button
                    variant={overdueFilter === 'more10' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOverdueFilter('more10')}
                    className="text-sm"
                  >
                    Overdue more than 10 days
                  </Button>
                </div>
              </div>
              {overdueReminders
                .sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
                .map(reminder => (
                <ReminderCard key={`${reminder.type}-${reminder.id}`} reminder={reminder} />
              ))}
            </div>
          )}

          {/* Today's Reminders */}
          {todayReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-orange-700 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today ({todayReminders.length})
              </h2>
              {todayReminders
                .sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
                .map(reminder => (
                <ReminderCard key={`${reminder.type}-${reminder.id}`} reminder={reminder} />
              ))}
            </div>
          )}

          {/* Tomorrow's Reminders */}
          {tomorrowReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Tomorrow ({tomorrowReminders.length})
              </h2>
              {tomorrowReminders
                .sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
                .map(reminder => (
                <ReminderCard key={`${reminder.type}-${reminder.id}`} reminder={reminder} />
              ))}
            </div>
          )}

          {/* Upcoming Reminders */}
          {upcomingReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming ({upcomingReminders.length})
              </h2>
              {upcomingReminders
                .sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
                .map(reminder => (
                <ReminderCard key={`${reminder.type}-${reminder.id}`} reminder={reminder} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}