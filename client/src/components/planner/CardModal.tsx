import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Tag, Paperclip, MessageSquare, Bell, Trash2, Plus, X, CalendarDays } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskCard, TaskList } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { RESPONSIVE_GRIDS, RESPONSIVE_FLEX, TOUCH_FRIENDLY, OVERFLOW } from "@/lib/responsive-utils";

interface CardModalProps {
  card: TaskCard;
  lists: TaskList[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CardModal({ card, lists, isOpen, onClose }: CardModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [dueDate, setDueDate] = useState(card.dueDate ? format(new Date(card.dueDate), "yyyy-MM-dd'T'HH:mm") : "");
  const [priority, setPriority] = useState(card.priority || "Medium");
  const [labels, setLabels] = useState<string[]>(card.labels || []);
  const [newLabel, setNewLabel] = useState("");
  const [checklist, setChecklist] = useState(card.checklist || []);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [comments, setComments] = useState(card.comments || []);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(card.title);
      setDescription(card.description || "");
      setDueDate(card.dueDate ? format(new Date(card.dueDate), "yyyy-MM-dd'T'HH:mm") : "");
      setPriority(card.priority || "Medium");
      setLabels(card.labels || []);
      setChecklist(card.checklist || []);
      setComments(card.comments || []);
    }
  }, [card, isOpen]);

  const updateCardMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const response = await apiRequest(`/api/task-cards/${card.id}`, {
        method: "PUT",
        body: updatedData
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/board-lists"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update card",
        variant: "destructive",
      });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/task-cards/${card.id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/board-lists"] });
      onClose();
      toast({
        title: "Success",
        description: "Card deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete card",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const updatedCard = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority,
      labels,
      checklist,
      comments,
    };
    
    updateCardMutation.mutate(updatedCard);
  };

  const addLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      const updatedLabels = [...labels, newLabel.trim()];
      setLabels(updatedLabels);
      setNewLabel("");
      // Auto-save labels
      updateCardMutation.mutate({ labels: updatedLabels });
    }
  };

  const removeLabel = (labelToRemove: string) => {
    const updatedLabels = labels.filter(label => label !== labelToRemove);
    setLabels(updatedLabels);
    // Auto-save labels
    updateCardMutation.mutate({ labels: updatedLabels });
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false,
      };
      const updatedChecklist = [...checklist, newItem];
      setChecklist(updatedChecklist);
      setNewChecklistItem("");
      // Auto-save checklist
      updateCardMutation.mutate({ checklist: updatedChecklist });
    }
  };

  const toggleChecklistItem = (itemId: string) => {
    const updatedChecklist = checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
    // Auto-save checklist
    updateCardMutation.mutate({ checklist: updatedChecklist });
  };

  const removeChecklistItem = (itemId: string) => {
    const updatedChecklist = checklist.filter(item => item.id !== itemId);
    setChecklist(updatedChecklist);
    // Auto-save checklist
    updateCardMutation.mutate({ checklist: updatedChecklist });
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        author: "You", // In real app, this would be the current user
        timestamp: new Date().toISOString(),
      };
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      setNewComment("");
      // Auto-save comments
      updateCardMutation.mutate({ comments: updatedComments });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-400";
      case "Medium": return "bg-blue-400";
      case "Low": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getLabelColor = (index: number) => {
    const colors = ["bg-blue-400", "bg-slate-400", "bg-gray-400", "bg-indigo-400", "bg-cyan-400", "bg-teal-400"];
    return colors[index % colors.length];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                // Auto-save title on blur
                updateCardMutation.mutate({ title });
              }}
              className="text-lg font-semibold border-none shadow-none p-0 h-auto"
              placeholder="Card title"
            />
          </DialogTitle>
        </DialogHeader>

        <div className={`${RESPONSIVE_GRIDS.threeCol} lg:grid-cols-3`}>
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" />
                Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => {
                  // Auto-save description on blur
                  updateCardMutation.mutate({ description });
                }}
                placeholder="Add a more detailed description..."
                className="min-h-[100px]"
              />
            </div>

            {/* Checklist */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Checkbox className="w-4 h-4" />
                Checklist
              </Label>
              <div className="space-y-2">
                {checklist.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                    />
                    <span className={item.completed ? "line-through text-gray-500" : ""}>
                      {item.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChecklistItem(item.id)}
                      className="ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Add checklist item"
                    onKeyPress={(e) => e.key === "Enter" && addChecklistItem()}
                  />
                  <Button onClick={addChecklistItem} size="sm" className={TOUCH_FRIENDLY.button}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" />
                Comments
              </Label>
              <div className="space-y-3">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <span>{comment.timestamp ? format(new Date(comment.timestamp), "MMM d, h:mm a") : "No date"}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="min-h-[60px]"
                  />
                  <Button onClick={addComment} size="sm" className={`self-end ${TOUCH_FRIENDLY.button}`}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Actions</Label>
              <div className="space-y-2">
                <Button onClick={handleSave} className="w-full" disabled={updateCardMutation.isPending}>
                  Save Changes
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteCardMutation.mutate()}
                  className="w-full"
                  disabled={deleteCardMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Card
                </Button>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                <CalendarDays className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  // Auto-save due date
                  updateCardMutation.mutate({ 
                    dueDate: e.target.value ? new Date(e.target.value).toISOString() : null 
                  });
                }}
              />
            </div>

            {/* Priority */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Priority</Label>
              <Select value={priority} onValueChange={(value) => {
                setPriority(value);
                // Auto-save priority
                updateCardMutation.mutate({ priority: value });
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2">
                <Badge className={`${getPriorityColor(priority)} text-white`}>
                  {priority} Priority
                </Badge>
              </div>
            </div>

            {/* Labels */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4" />
                Labels
              </Label>
              <div className="flex flex-wrap gap-1 mb-2">
                {labels.map((label, index) => (
                  <Badge
                    key={label}
                    className={`${getLabelColor(index)} text-white cursor-pointer`}
                    onClick={() => removeLabel(label)}
                  >
                    {label} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Add label"
                  onKeyPress={(e) => e.key === "Enter" && addLabel()}
                />
                <Button onClick={addLabel} size="sm" className={TOUCH_FRIENDLY.button}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Move Card */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Move Card</Label>
              <Select
                value={card.listId.toString()}
                onValueChange={(value) => {
                  updateCardMutation.mutate({
                    listId: parseInt(value),
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select list" />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.id.toString()}>
                      {list.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}