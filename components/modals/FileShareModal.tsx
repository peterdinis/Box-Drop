"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Copy, 
  Mail, 
  Users, 
  Eye, 
  Download, 
  Edit, 
  Trash2,
  Link,
  Check,
  X,
  Crown,
  Shield,
  User,
  Eye as EyeIcon
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useTeam, TeamMember } from '@/context/TeamContext';

interface FileShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileType: string;
}

const FileShareModal: React.FC<FileShareModalProps> = ({ isOpen, onClose, fileName, fileType }) => {
  const [shareEmail, setShareEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<'view' | 'download' | 'edit'>('view');
  const { teamMembers } = useTeam();
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  const generateShareLink = () => {
    const randomId = Math.random().toString(36).substr(2, 12);
    const link = `https://cloudchest.app/share/${randomId}`;
    setShareLink(link);
    setLinkGenerated(true);
    
    toast({
      title: "Share link generated",
      description: "Link copied to clipboard"
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard"
    });
  };

  const shareWithEmail = () => {
    if (!shareEmail.trim()) return;

    addNotification({
      title: 'File Shared',
      message: `"${fileName}" has been shared with ${shareEmail}`,
      type: 'success'
    });

    toast({
      title: "File shared",
      description: `${shareEmail} will receive an email notification.`
    });

    setShareEmail('');
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'editor': return <Edit className="w-4 h-4 text-green-500" />;
      case 'viewer': return <EyeIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
    }
  };

  const permissionOptions = [
    { 
      value: 'view' as const, 
      label: 'Can view', 
      description: 'Can only view the file',
      icon: <Eye className="w-4 h-4" />
    },
    { 
      value: 'download' as const, 
      label: 'Can download', 
      description: 'Can view and download the file',
      icon: <Download className="w-4 h-4" />
    },
    { 
      value: 'edit' as const, 
      label: 'Can edit', 
      description: 'Can view, download, and edit the file',
      icon: <Edit className="w-4 h-4" />
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share "{fileName}"
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="team">Team Access</TabsTrigger>
            <TabsTrigger value="email">Share by Email</TabsTrigger>
            <TabsTrigger value="link">Share Link</TabsTrigger>
          </TabsList>

          {/* Team Members Tab */}
          <TabsContent value="team" className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Team Members with Access</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-background`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{member.name}</p>
                            {getRoleIcon(member.role)}
                            <Badge variant="outline" className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {member.permissions.canView && <Eye className="w-3 h-3 text-green-500" />}
                          {member.permissions.canDownload && <Download className="w-3 h-3 text-blue-500" />}
                          {member.permissions.canEdit && <Edit className="w-3 h-3 text-purple-500" />}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Email Share Tab */}
          <TabsContent value="email" className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Share via Email</h3>
              
              {/* Permission Selection */}
              <div className="space-y-3 mb-4">
                <label className="text-sm font-medium">Permission Level</label>
                <div className="grid gap-2">
                  {permissionOptions.map((option) => (
                    <Card 
                      key={option.value}
                      className={`p-3 cursor-pointer transition-all duration-200 ${
                        selectedPermission === option.value 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedPermission(option.value)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-primary">
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{option.label}</p>
                            {selectedPermission === option.value && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Enter email address"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    type="email"
                  />
                </div>
                <Button onClick={shareWithEmail} disabled={!shareEmail.trim()}>
                  <Mail className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Link Share Tab */}
          <TabsContent value="link" className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Share Link</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Anyone with this link can access the file based on the permissions you set.
              </p>
              
              {!linkGenerated ? (
                <Button onClick={generateShareLink} className="w-full">
                  <Link className="w-4 h-4 mr-2" />
                  Generate Share Link
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input value={shareLink} readOnly />
                    <Button 
                      variant="outline"
                      onClick={() => copyToClipboard(shareLink)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Card className="p-3 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Link Settings</p>
                        <p className="text-xs text-muted-foreground">Expires in 7 days</p>
                      </div>
                      <Badge variant="outline">View Only</Badge>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileShareModal;