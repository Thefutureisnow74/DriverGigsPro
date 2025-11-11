import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Calendar, Clock, Tag, Trash2, Edit3 } from "lucide-react";
import { TaskCard, TaskList } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import CardModal from "./CardModal";

interface KanbanBoardProps {
  lists: TaskList[];
  cards: TaskCard[];
  boardId?: number;
  onAddList?: () => void;
}

interface TaskCardProps {
  card: TaskCard;
  isDragging?: boolean;
  onClick?: () => void;
}

function TaskCardComponent({ card, isDragging, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: card.id,
    data: { type: "card", card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "border-l-red-400";
      case "Medium": return "border-l-blue-400";
      case "Low": return "border-l-gray-400";
      default: return "border-l-gray-300";
    }
  };

  const getPriorityCardStyles = (priority: string) => {
    if (priority === "High") {
      return {
        cardClass: "bg-red-500 hover:bg-red-600 text-white",
        textClass: "text-white",
        descriptionClass: "text-red-100",
        dateClass: "text-red-100",
        checklistClass: "text-red-100"
      };
    }
    return {
      cardClass: "bg-white hover:bg-gray-50 text-gray-900",
      textClass: "text-gray-900",
      descriptionClass: "text-gray-600",
      dateClass: "text-gray-500",
      checklistClass: "text-gray-500"
    };
  };

  const getLabelColor = (index: number) => {
    const colors = ["bg-blue-400", "bg-slate-400", "bg-gray-400", "bg-indigo-400", "bg-cyan-400", "bg-teal-400"];
    return colors[index % colors.length];
  };

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const isDueSoon = card.dueDate && new Date(card.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const priorityStyles = getPriorityCardStyles(card.priority || "Medium");

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(card.priority || "Medium")} ${
        isDragging || isSortableDragging ? "shadow-lg" : ""
      } ${priorityStyles.cardClass}`}
      onClick={onClick}
    >
      <CardContent className="p-3 space-y-2">
        <h4 className={`font-medium text-sm leading-tight ${priorityStyles.textClass}`}>{card.title}</h4>
        
        {card.description && (
          <p className={`text-xs line-clamp-2 ${priorityStyles.descriptionClass}`}>{card.description}</p>
        )}

        {/* Labels */}
        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.labels.slice(0, 3).map((label, index) => (
              <Badge
                key={label}
                className={`${getLabelColor(index)} text-white text-xs px-2 py-0`}
              >
                {label}
              </Badge>
            ))}
            {card.labels.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                +{card.labels.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Due Date */}
        {card.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${
            isOverdue ? "text-red-500" : isDueSoon ? "text-blue-500" : priorityStyles.dateClass
          }`}>
            <Clock className="w-3 h-3" />
            {format(new Date(card.dueDate), "MMM d")}
            {isOverdue && <span className="text-red-500 font-medium">Overdue</span>}
          </div>
        )}

        {/* Checklist Progress */}
        {card.checklist && Array.isArray(card.checklist) && card.checklist.length > 0 && (
          <div className={`flex items-center gap-2 text-xs ${priorityStyles.checklistClass}`}>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-400 h-1 rounded-full transition-all"
                style={{
                  width: `${(card.checklist.filter((item: any) => item.completed).length / card.checklist.length) * 100}%`
                }}
              />
            </div>
            <span>
              {card.checklist.filter((item: any) => item.completed).length}/{card.checklist.length}
            </span>
          </div>
        )}

        {/* Bottom row with priority and icons */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {card.priority || "Medium"}
          </Badge>
          <div className="flex items-center gap-1 text-gray-400">
            {card.comments && Array.isArray(card.comments) && card.comments.length > 0 && (
              <span className="text-xs">{card.comments.length}</span>
            )}
            {card.attachments && Array.isArray(card.attachments) && card.attachments.length > 0 && (
              <span className="text-xs">📎</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskListProps {
  list: TaskList;
  cards: TaskCard[];
  onAddCard: (listId: number) => void;
  onDeleteList: (listId: number) => void;
  onCardClick: (card: TaskCard) => void;
}

function TaskListComponent({ list, cards, onAddCard, onDeleteList, onCardClick }: TaskListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditing, setIsEditing] = useState(list.title === "");
  const [editTitle, setEditTitle] = useState(list.title || "");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: list.id,
    data: { type: "list", list },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateListMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const { data } = await apiRequest(`/api/task-lists/${list.id}`, {
        method: "PUT",
        body: updatedData
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-boards"] });
      setIsEditing(false);
    },
  });

  const addCardMutation = useMutation({
    mutationFn: async (cardData: any) => {
      const { data } = await apiRequest("/api/task-cards", {
        method: "POST",
        body: cardData
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/task-boards"] });
      setNewCardTitle("");
      setIsAddingCard(false);
    },
  });

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCardMutation.mutate({
        listId: list.id,
        title: newCardTitle.trim(),
        position: cards.length,
      });
    }
  };

  const handleUpdateTitle = () => {
    // Always save the title, even if it's empty or the same
    updateListMutation.mutate({ title: editTitle.trim() });
  };

  const listCards = cards.filter(card => card.listId === list.id).sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="w-80 flex-shrink-0 bg-gray-100 border border-gray-200"
      {...attributes}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between" {...listeners}>
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyPress={(e) => e.key === "Enter" && handleUpdateTitle()}
              placeholder="Enter list name"
              className="font-medium text-sm h-8 px-2"
              autoFocus
            />
          ) : (
            <CardTitle
              className="text-sm font-medium cursor-pointer flex-1"
              onClick={() => setIsEditing(true)}
            >
              {list.title || "Untitled List"}
            </CardTitle>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteList(list.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-2">
        {/* Add Card Section - Moved to top */}
        {isAddingCard ? (
          <div className="space-y-2 mb-3">
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter card title"
              onKeyPress={(e) => e.key === "Enter" && handleAddCard()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddCard}
                disabled={!newCardTitle.trim() || addCardMutation.isPending}
              >
                Add Card
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-500 mb-3"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add a card
          </Button>
        )}

        {/* Cards Section */}
        <div className="min-h-[200px]">
          <SortableContext items={listCards.map(card => card.id)} strategy={verticalListSortingStrategy}>
            {listCards.map(card => (
              <TaskCardComponent
                key={card.id}
                card={card}
                onClick={() => onCardClick(card)}
              />
            ))}
          </SortableContext>
          {listCards.length === 0 && (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              Drop cards here
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function KanbanBoard({ lists, cards, boardId, onAddList }: KanbanBoardProps) {
  const [activeCard, setActiveCard] = useState<TaskCard | null>(null);
  const [selectedCard, setSelectedCard] = useState<TaskCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const moveCardMutation = useMutation({
    mutationFn: async ({ cardId, targetListId, position }: { cardId: number; targetListId: number; position: number }) => {
      const { data } = await apiRequest(`/api/task-cards/${cardId}/move`, {
        method: "POST",
        body: {
          targetListId,
          position,
        }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/board-lists"] });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: async (listId: number) => {
      await apiRequest(`/api/task-lists/${listId}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      // Invalidate the specific board's lists query using the boardId prop
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ["/api/task-boards", boardId, "lists"] });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/task-boards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/task-cards"] });
      
      toast({ title: "Success", description: "List deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: "Failed to delete list. Please try again.",
        variant: "destructive" 
      });
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "card") {
      setActiveCard(event.active.data.current.card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "card") {
      const draggedCard = activeData.card;
      
      if (overData?.type === "list") {
        // Moving card to different list
        const targetList = overData.list;
        
        if (draggedCard.listId !== targetList.id) {
          const targetCards = cards.filter(c => c.listId === targetList.id);
          moveCardMutation.mutate({
            cardId: draggedCard.id,
            targetListId: targetList.id,
            position: targetCards.length,
          });
        }
      } else if (overData?.type === "card") {
        // Moving card to specific position (dropped on another card)
        const targetCard = overData.card;
        const targetListCards = cards.filter(c => c.listId === targetCard.listId);
        const targetPosition = targetListCards.findIndex(c => c.id === targetCard.id);
        
        if (draggedCard.listId !== targetCard.listId || draggedCard.id !== targetCard.id) {
          moveCardMutation.mutate({
            cardId: draggedCard.id,
            targetListId: targetCard.listId,
            position: targetPosition,
          });
        }
      }
    }
  };

  const handleCardClick = (card: TaskCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full p-4">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          <SortableContext items={lists.map(list => list.id)}>
            {lists.map(list => (
              <TaskListComponent
                key={list.id}
                list={list}
                cards={cards}
                onAddCard={(listId) => {}}
                onDeleteList={(listId) => deleteListMutation.mutate(listId)}
                onCardClick={handleCardClick}
              />
            ))}
          </SortableContext>

          {/* Add List Button - Only show if less than 3 lists */}
          {lists.length < 3 && (
            <Card className="w-80 flex-shrink-0 bg-gray-100 border-dashed">
              <CardContent className="flex items-center justify-center h-32">
                <Button 
                  variant="ghost" 
                  className="text-gray-500"
                  onClick={onAddList}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add another list
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Max Lists Message */}
          {lists.length >= 3 && (
            <Card className="w-80 flex-shrink-0 bg-gray-50 border-dashed opacity-50">
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-gray-400 text-sm text-center">
                  <p>Maximum of 3 lists reached</p>
                  <p className="text-xs mt-1">Delete a list to add another</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DragOverlay>
          {activeCard && (
            <TaskCardComponent card={activeCard} isDragging />
          )}
        </DragOverlay>
      </DndContext>

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