import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NetworkingGroup, InsertNetworkingGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Facebook, Linkedin, MessageCircle, Globe, Hash, Edit3, Trash2, ExternalLink } from "lucide-react";

export default function NetworkingGroups() {
  const { toast } = useToast();

  // State management
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<NetworkingGroup | null>(null);
  const [groupForm, setGroupForm] = useState<Partial<InsertNetworkingGroup>>({
    groupName: '',
    platform: 'facebook',
    groupUrl: '',
    loginEmail: '',
    loginUsername: '',
    notes: '',
    isActive: true,
    joinedDate: undefined
  });

  // Fetch networking groups
  const { data: networkingGroups = [], refetch: refetchGroups } = useQuery<NetworkingGroup[]>({
    queryKey: ["/api/networking-groups"],
    refetchInterval: 30000,
  });

  // Platform icon helper
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'telegram': return <MessageCircle className="h-4 w-4" />;
      case 'discord': return <Hash className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  // Platform badge color helper
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'linkedin': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'telegram': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'discord': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Mutations
  const createGroupMutation = useMutation({
    mutationFn: (data: Partial<InsertNetworkingGroup>) => apiRequest("/api/networking-groups", { method: "POST", body: data }),
    onSuccess: () => {
      toast({
        title: "Group Added",
        description: "Networking group has been added successfully.",
      });
      setShowAddGroupForm(false);
      setGroupForm({
        groupName: '',
        platform: 'facebook',
        groupUrl: '',
        loginEmail: '',
        loginUsername: '',
        notes: '',
        isActive: true,
        joinedDate: undefined
      });
      refetchGroups();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add networking group. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<NetworkingGroup>) => apiRequest(`/api/networking-groups/${id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      toast({
        title: "Group Updated",
        description: "Networking group has been updated successfully.",
      });
      setEditingGroup(null);
      refetchGroups();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update networking group. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/networking-groups/${id}`),
    onSuccess: () => {
      toast({
        title: "Group Deleted",
        description: "Networking group has been deleted successfully.",
      });
      refetchGroups();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete networking group. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Networking Groups</h1>
          <p className="text-xs text-muted-foreground">
            Manage your professional networking communities
          </p>
        </div>
        <Button
          onClick={() => setShowAddGroupForm(true)}
          size="sm"
          className="flex items-center gap-1 h-7 px-2 text-xs"
        >
          <Plus className="h-3 w-3" />
          Add Group
        </Button>
      </div>

      {/* Add Group Form */}
      {showAddGroupForm && (
        <Card className="border-dashed border-2">
          <CardContent className="p-2">
            <form onSubmit={(e) => {
              e.preventDefault();
              createGroupMutation.mutate(groupForm);
            }} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div>
                  <Label htmlFor="groupName" className="text-xs font-medium">Name *</Label>
                  <Input
                    id="groupName"
                    value={groupForm.groupName || ''}
                    onChange={(e) => setGroupForm(prev => ({ ...prev, groupName: e.target.value }))}
                    placeholder="Driver Jobs Dallas"
                    className="h-7 text-xs"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="platform" className="text-xs font-medium">Platform *</Label>
                  <Select 
                    value={groupForm.platform} 
                    onValueChange={(value) => setGroupForm(prev => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="groupUrl" className="text-xs font-medium">URL</Label>
                  <Input
                    id="groupUrl"
                    value={groupForm.groupUrl || ''}
                    onChange={(e) => setGroupForm(prev => ({ ...prev, groupUrl: e.target.value }))}
                    placeholder="https://..."
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="loginEmail" className="text-xs font-medium">Email</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={groupForm.loginEmail || ''}
                    onChange={(e) => setGroupForm(prev => ({ ...prev, loginEmail: e.target.value }))}
                    placeholder="email@example.com"
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div>
                  <Label htmlFor="loginUsername" className="text-xs font-medium">Username</Label>
                  <Input
                    id="loginUsername"
                    value={groupForm.loginUsername || ''}
                    onChange={(e) => setGroupForm(prev => ({ ...prev, loginUsername: e.target.value }))}
                    placeholder="username"
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="joinedDate" className="text-xs font-medium">Joined</Label>
                  <Input
                    id="joinedDate"
                    type="date"
                    value={groupForm.joinedDate ? new Date(groupForm.joinedDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setGroupForm(prev => ({ 
                      ...prev, 
                      joinedDate: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
                  <Input
                    id="notes"
                    value={groupForm.notes || ''}
                    onChange={(e) => setGroupForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes..."
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 pt-1 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    setShowAddGroupForm(false);
                    setGroupForm({
                      groupName: '',
                      platform: 'facebook',
                      groupUrl: '',
                      loginEmail: '',
                      loginUsername: '',
                      notes: '',
                      isActive: true,
                      joinedDate: undefined
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-6 px-2 text-xs"
                  disabled={createGroupMutation.isPending || !groupForm.groupName}
                >
                  {createGroupMutation.isPending ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Groups List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {networkingGroups.length === 0 ? (
          <Card className="border-dashed col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-4">
              <Users className="h-6 w-6 text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">No networking groups yet</p>
            </CardContent>
          </Card>
        ) : (
          networkingGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-2">
                {editingGroup?.id === group.id ? (
                  // Edit form
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    updateGroupMutation.mutate({
                      id: group.id,
                      ...groupForm
                    });
                  }} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs font-medium">Name</Label>
                        <Input
                          value={groupForm.groupName || ''}
                          onChange={(e) => setGroupForm(prev => ({ ...prev, groupName: e.target.value }))}
                          className="h-7 text-xs"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Platform</Label>
                        <Select 
                          value={groupForm.platform} 
                          onValueChange={(value) => setGroupForm(prev => ({ ...prev, platform: value }))}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="telegram">Telegram</SelectItem>
                            <SelectItem value="discord">Discord</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs font-medium">URL</Label>
                        <Input
                          value={groupForm.groupUrl || ''}
                          onChange={(e) => setGroupForm(prev => ({ ...prev, groupUrl: e.target.value }))}
                          className="h-7 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Email</Label>
                        <Input
                          type="email"
                          value={groupForm.loginEmail || ''}
                          onChange={(e) => setGroupForm(prev => ({ ...prev, loginEmail: e.target.value }))}
                          className="h-7 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Notes</Label>
                        <Input
                          value={groupForm.notes || ''}
                          onChange={(e) => setGroupForm(prev => ({ ...prev, notes: e.target.value }))}
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 pt-1 border-t">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                        onClick={() => setEditingGroup(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="h-6 px-2 text-xs" disabled={updateGroupMutation.isPending}>
                        {updateGroupMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  // Display view - much more compact
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="font-medium text-sm truncate">{group.groupName}</h3>
                        <Badge className={`text-xs ${getPlatformColor(group.platform)} shrink-0`}>
                          <span className="flex items-center gap-1">
                            {getPlatformIcon(group.platform)}
                            <span className="hidden sm:inline">{group.platform.charAt(0).toUpperCase() + group.platform.slice(1)}</span>
                          </span>
                        </Badge>
                        {!group.isActive && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground truncate">
                        {group.groupUrl && (
                          <a 
                            href={group.groupUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline shrink-0" style={{color: '#0f3a0f'}} onMouseEnter={(e) => e.target.style.color = '#0a2e0a'} onMouseLeave={(e) => e.target.style.color = '#0f3a0f'}
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span className="hidden md:inline">Visit</span>
                          </a>
                        )}
                        {group.loginEmail && (
                          <span className="hidden lg:flex items-center gap-1 truncate">
                            <span className="font-medium">Email:</span> 
                            <span className="truncate">{group.loginEmail}</span>
                          </span>
                        )}
                        {group.loginUsername && (
                          <span className="hidden xl:flex items-center gap-1">
                            <span className="font-medium">User:</span> {group.loginUsername}
                          </span>
                        )}
                        {group.joinedDate && (
                          <span className="hidden xl:flex items-center gap-1 shrink-0">
                            <span className="font-medium">Joined:</span> {new Date(group.joinedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {group.notes && (
                        <div className="hidden lg:block text-xs text-muted-foreground truncate max-w-xs">
                          {group.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <Button
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setEditingGroup(group);
                          setGroupForm({
                            groupName: group.groupName,
                            platform: group.platform,
                            groupUrl: group.groupUrl || '',
                            loginEmail: group.loginEmail || '',
                            loginUsername: group.loginUsername || '',
                            notes: group.notes || '',
                            isActive: group.isActive,
                            joinedDate: group.joinedDate ? new Date(group.joinedDate) : undefined
                          });
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm('Delete this networking group?')) {
                            deleteGroupMutation.mutate(group.id);
                          }
                        }}
                        disabled={deleteGroupMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}