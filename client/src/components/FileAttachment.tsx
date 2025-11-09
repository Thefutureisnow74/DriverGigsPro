import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileAttachmentProps {
  messageId?: number;
  onFileUploaded?: (attachment: any) => void;
  allowUpload?: boolean;
  attachments?: any[];
}

export function FileAttachment({ 
  messageId, 
  onFileUploaded, 
  allowUpload = false, 
  attachments = [] 
}: FileAttachmentProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !messageId) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/assistant-messages/${messageId}/attachments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const attachment = await response.json();
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      onFileUploaded?.(attachment);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDownload = async (attachmentId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/assistant-attachments/${attachmentId}/download`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (attachmentId: number) => {
    try {
      const response = await fetch(`/api/assistant-attachments/${attachmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      // Refresh attachments
      window.location.reload();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      {/* Upload Button */}
      {allowUpload && messageId && (
        <div className="flex items-center gap-2">
          <label htmlFor={`file-upload-${messageId}`}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              className="cursor-pointer"
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-1" />
                {uploading ? 'Uploading...' : 'Upload File'}
              </span>
            </Button>
          </label>
          <input
            id={`file-upload-${messageId}`}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.txt,.csv,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.gif"
          />
        </div>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-1">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <File className="h-4 w-4 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {attachment.originalName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.fileSize)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(attachment.id, attachment.originalName)}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(attachment.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}