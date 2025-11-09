import { useState, useEffect } from "react";
import { StickyNote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NotesIndicatorProps {
  companyId: number;
  companyName?: string;
}

export default function NotesIndicator({ companyId, companyName }: NotesIndicatorProps) {
  const [hasNotes, setHasNotes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notesData, setNotesData] = useState<any>(null);

  const checkForNotes = async () => {
    try {
      const response = await fetch(`/api/job-search-notes/${companyId}`);
      if (response.ok) {
        const notes = await response.json();
        // Check if any notes exist and have content
        const hasContent = notes && notes.length > 0 && notes.some((note: any) => 
          note.notes?.trim() || 
          note.conversationSummary?.trim() || 
          note.contactName?.trim() ||
          note.phoneNumber?.trim() ||
          note.emailAddress?.trim()
        );
        setHasNotes(hasContent);
        if (hasContent) {
          setNotesData(notes[0]); // Store the latest note data
        }
      }
    } catch (error) {
      console.error("Failed to check for notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkForNotes();

    // Listen for notes updates
    const handleNotesUpdate = (event: CustomEvent) => {
      if (event.detail.companyId === companyId) {
        checkForNotes();
      }
    };

    window.addEventListener('notesUpdated', handleNotesUpdate as EventListener);
    return () => {
      window.removeEventListener('notesUpdated', handleNotesUpdate as EventListener);
    };
  }, [companyId]);

  if (isLoading || !hasNotes) {
    return null;
  }

  return (
    <>
      <Badge 
        className="bg-yellow-200 text-yellow-900 font-bold text-xs px-3 py-1.5 rounded-full border-2 border-yellow-400 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-yellow-300 cursor-pointer" 
        onClick={() => setIsDialogOpen(true)}
      >
        <StickyNote className="w-3 h-3 mr-1" />
        Notes
      </Badge>

      {/* Notes Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <StickyNote className="w-5 h-5" />
              <span>Notes for {companyName || 'Company'}</span>
            </DialogTitle>
          </DialogHeader>
          
          {notesData && (
            <div className="space-y-4">
              {/* Notes & Comments */}
              {(notesData.notes || notesData.conversationSummary) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Notes & Comments</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {notesData.notes || notesData.conversationSummary}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              {(notesData.contactName || notesData.phoneNumber || notesData.emailAddress) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Contact Information</h3>
                  <div className="space-y-1">
                    {notesData.contactName && (
                      <p className="text-blue-700"><strong>Contact:</strong> {notesData.contactName}</p>
                    )}
                    {notesData.phoneNumber && (
                      <p className="text-blue-700"><strong>Phone:</strong> {notesData.phoneNumber}</p>
                    )}
                    {notesData.emailAddress && (
                      <p className="text-blue-700"><strong>Email:</strong> {notesData.emailAddress}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Reminder Information */}
              {notesData.reminderDate && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-900 mb-2">Reminder</h3>
                  <p className="text-amber-700">
                    <strong>Date:</strong> {new Date(notesData.reminderDate).toLocaleDateString()}
                  </p>
                  {notesData.reminderText && (
                    <p className="text-amber-700 mt-1">
                      <strong>Note:</strong> {notesData.reminderText}
                    </p>
                  )}
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}