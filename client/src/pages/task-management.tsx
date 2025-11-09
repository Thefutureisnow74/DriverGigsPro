import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Calendar, Kanban, Grid3X3, Settings, Trash2, MoreHorizontal, ChevronDown, Check, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TaskBoard } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import KanbanBoard from "@/components/planner/KanbanBoard";
import CalendarView from "@/components/planner/CalendarView";

export default function TaskManagement() {
  const [activeView, setActiveView] = useState("board");
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(() => {
    // Try to restore the selected board from localStorage
    const saved = localStorage.getItem('taskManagement_selectedBoardId');
    return saved ? parseInt(saved, 10) : null;
  });
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<TaskBoard | null>(null);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState<TaskBoard | null>(null);
  const [editBoardTitle, setEditBoardTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's task boards
  const { data: boards = [], isLoading: boardsLoading } = useQuery<TaskBoard[]>({
    queryKey: ["/api/task-boards"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/task-boards");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Failed to fetch task boards:", error);
        return [];
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Auto-select board when boards load - respect saved selection or fallback to first board
  useEffect(() => {
    if (boards.length > 0) {
      // If we have a saved board ID, check if it exists in the current boards
      if (selectedBoardId !== null) {
        const savedBoardExists = boards.some(board => board.id === selectedBoardId);
        if (!savedBoardExists) {
          // Saved board doesn't exist anymore, fallback to first board
          const firstBoardId = boards[0].id;
          setSelectedBoardId(firstBoardId);
          localStorage.setItem('taskManagement_selectedBoardId', firstBoardId.toString());
        }
      } else {
        // No saved board, select the first one
        const firstBoardId = boards[0].id;
        setSelectedBoardId(firstBoardId);
        localStorage.setItem('taskManagement_selectedBoardId', firstBoardId.toString());
      }
    }
  }, [boards, selectedBoardId]);

  // Save selected board to localStorage whenever it changes
  useEffect(() => {
    if (selectedBoardId !== null) {
      localStorage.setItem('taskManagement_selectedBoardId', selectedBoardId.toString());
    }
  }, [selectedBoardId]);

  // Get the selected board or default to first board
  const currentBoard = selectedBoardId 
    ? boards.find((b) => b.id === selectedBoardId)
    : boards[0];

  // Fetch board lists for the current board
  const { data: boardLists = [], isLoading: listsLoading } = useQuery({
    queryKey: ["/api/task-boards", currentBoard?.id, "lists"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/task-boards/${currentBoard?.id}/lists`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Failed to fetch board lists:", error);
        return [];
      }
    },
    enabled: !!currentBoard,
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch all cards for current board
  const { data: allCards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ["/api/task-cards"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/task-cards");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Failed to fetch task cards:", error);
        return [];
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Filter cards for current board's lists (with safety check)
  const boardCards = Array.isArray(allCards) ? allCards.filter((card: any) => 
    boardLists.some((list: any) => list.id === card.listId)
  ) : [];

  const createBoardMutation = useMutation({
    mutationFn: async (boardData: any) => {
      const response = await apiRequest("/api/task-boards", {
        method: "POST",
        body: boardData
      });
      return response.json();
    },
    onSuccess: (newBoard) => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-boards"] });
      setSelectedBoardId(newBoard.id);
      setIsCreatingBoard(false);
      setNewBoardTitle("");
      toast({
        title: "Success",
        description: "Board created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create board",
        variant: "destructive",
      });
    },
  });

  const createListMutation = useMutation({
    mutationFn: async (listData: any) => {
      const response = await apiRequest("/api/task-lists", {
        method: "POST",
        body: listData
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-boards", currentBoard?.id, "lists"] });
      toast({
        title: "Success",
        description: "List created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create list",
        variant: "destructive",
      });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: async ({ id, title }: { id: number; title: string }) => {
      const response = await apiRequest(`/api/task-boards/${id}`, {
        method: "PUT",
        body: { title }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-boards"] });
      setIsEditingBoard(false);
      setBoardToEdit(null);
      setEditBoardTitle("");
      toast({
        title: "Success",
        description: "Board name updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update board name",
        variant: "destructive",
      });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: async (boardId: number) => {
      const response = await apiRequest(`/api/task-boards/${boardId}`, {
        method: "DELETE"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-boards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/task-cards"] });
      setShowDeleteDialog(false);
      setBoardToDelete(null);
      
      // If we deleted the current board, select another one
      if (boardToDelete && selectedBoardId === boardToDelete.id) {
        const remainingBoards = boards.filter(b => b.id !== boardToDelete.id);
        if (remainingBoards.length > 0) {
          setSelectedBoardId(remainingBoards[0].id);
        } else {
          setSelectedBoardId(null);
        }
      }
      
      toast({
        title: "Success",
        description: "Board deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete board",
        variant: "destructive",
      });
    },
  });

  const handleCreateBoard = () => {
    if (newBoardTitle.trim()) {
      createBoardMutation.mutate({
        title: newBoardTitle.trim(),
        description: "",
      });
    }
  };

  const handleCreateList = () => {
    if (currentBoard && boardLists.length < 3) {
      createListMutation.mutate({
        boardId: currentBoard.id,
        title: "",
        position: boardLists.length,
      });
    } else if (boardLists.length >= 3) {
      toast({
        title: "Limit Reached",
        description: "Maximum of 3 lists allowed per board",
        variant: "destructive",
      });
    }
  };

  const handleEditBoard = (board: TaskBoard) => {
    setBoardToEdit(board);
    setEditBoardTitle(board.title);
    setIsEditingBoard(true);
  };

  const handleUpdateBoard = () => {
    if (boardToEdit && editBoardTitle.trim()) {
      updateBoardMutation.mutate({
        id: boardToEdit.id,
        title: editBoardTitle.trim()
      });
    }
  };

  const handleDeleteBoard = (board: TaskBoard) => {
    setBoardToDelete(board);
    setShowDeleteDialog(true);
  };

  const confirmDeleteBoard = () => {
    if (boardToDelete) {
      deleteBoardMutation.mutate(boardToDelete.id);
    }
  };

  if (boardsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading your boards...</p>
        </div>
      </div>
    );
  }

  // Empty state - no boards but with consistent header
  if (boards.length === 0 && !isCreatingBoard) {
    return (
      <div className="space-y-6">
        {/* Consistent Header - Even when no boards */}
        <div className="space-y-4">
          {/* Compact Single Header Bar - Disabled when no boards */}
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border">
            {/* Left Side - View Toggle (disabled when no boards) */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" disabled className="h-8 px-3">
                <Kanban className="h-4 w-4 mr-1" />
                Board
              </Button>
              <div className="text-gray-300 mx-1">|</div>
              <Button variant="ghost" size="sm" disabled className="h-8 px-3">
                <Calendar className="h-4 w-4 mr-1" />
                Calendar
              </Button>
            </div>
            
            {/* Right Side - Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="h-8 bg-white">
                <Plus className="h-4 w-4 mr-1" />
                Add List
              </Button>
              <Button
                onClick={() => setIsCreatingBoard(true)}
                size="sm"
                className="h-8 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Board
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center py-12">
          <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Task Management</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Get organized with Trello-style boards. Create your first board to start managing tasks and projects.
          </p>
          <Button
            onClick={() => setIsCreatingBoard(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Board
          </Button>
        </div>

        {isCreatingBoard && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Create New Board</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="Enter board title"
                onKeyPress={(e) => e.key === "Enter" && handleCreateBoard()}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateBoard}
                  disabled={!newBoardTitle.trim() || createBoardMutation.isPending}
                  className="flex-1"
                >
                  Create Board
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreatingBoard(false);
                    setNewBoardTitle("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Always visible when boards exist */}
      {boards.length > 0 && (
        <div className="space-y-4">
          {/* Compact Single Header Bar */}
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border">
          {/* Left Side - View Toggle with Board Dropdown */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
            {/* Board Dropdown integrated with Board button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={activeView === "board" ? "default" : "ghost"}
                  size="sm"
                  className="h-6 px-3 text-xs"
                >
                  <Kanban className="h-3 w-3 mr-1" />
                  {currentBoard?.title || "Board"}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {boards.map((board) => (
                  <DropdownMenuItem
                    key={board.id}
                    onClick={() => {
                      setSelectedBoardId(board.id);
                      setActiveView("board");
                    }}
                    className={currentBoard?.id === board.id ? "bg-blue-50" : ""}
                  >
                    {board.title}
                    {currentBoard?.id === board.id && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant={activeView === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("calendar")}
              className="h-6 px-3 text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Calendar
            </Button>
            
            {activeView === "calendar" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setActiveView("board")}
                className="h-6 px-3 text-xs"
              >
                <Kanban className="h-3 w-3 mr-1" />
                Board
              </Button>
            )}
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCreateList}
              variant="outline"
              size="sm"
              disabled={!currentBoard || activeView !== "board" || boardLists.length >= 3}
              className="h-8 bg-white"
              title={!currentBoard ? "No board selected" : activeView !== "board" ? "Switch to board view" : boardLists.length >= 3 ? "Maximum 3 lists per board" : "Add a new list"}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add List
            </Button>
            <Button
              onClick={() => setIsCreatingBoard(true)}
              size="sm"
              className="h-8 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Board
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-white"
                  disabled={!currentBoard}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => currentBoard && handleEditBoard(currentBoard)}
                  disabled={!currentBoard}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Board Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => currentBoard && handleDeleteBoard(currentBoard)}
                  className="text-red-600 focus:text-red-600"
                  disabled={!currentBoard}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        </div>
      )}

      {/* Create Board Modal */}
      {isCreatingBoard && boards.length > 0 && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create New Board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Enter board title"
              onKeyPress={(e) => e.key === "Enter" && handleCreateBoard()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateBoard}
                disabled={!newBoardTitle.trim() || createBoardMutation.isPending}
                className="flex-1"
              >
                Create Board
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreatingBoard(false);
                  setNewBoardTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="min-h-[600px]">
        {(listsLoading || cardsLoading) ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Kanban className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading board data...</p>
            </div>
          </div>
        ) : currentBoard ? (
          <>
            {activeView === "board" && (
              <KanbanBoard 
                lists={boardLists} 
                cards={boardCards} 
                boardId={currentBoard.id}
                onAddList={handleCreateList}
              />
            )}
            {activeView === "calendar" && (
              <CalendarView 
                cards={boardCards} 
                lists={boardLists} 
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Kanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a board to view its content</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Board Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{boardToDelete?.title}"? This action cannot be undone and will permanently delete all lists and tasks in this board.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setBoardToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteBoard}
              disabled={deleteBoardMutation.isPending}
            >
              {deleteBoardMutation.isPending ? "Deleting..." : "Delete Board"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Board Dialog */}
      <Dialog open={isEditingBoard} onOpenChange={setIsEditingBoard}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Board Name</DialogTitle>
            <DialogDescription>
              Change the name of "{boardToEdit?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editBoardTitle}
              onChange={(e) => setEditBoardTitle(e.target.value)}
              placeholder="Enter new board name"
              onKeyPress={(e) => e.key === "Enter" && handleUpdateBoard()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingBoard(false);
                setBoardToEdit(null);
                setEditBoardTitle("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBoard}
              disabled={!editBoardTitle.trim() || updateBoardMutation.isPending}
            >
              {updateBoardMutation.isPending ? "Updating..." : "Update Board"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}