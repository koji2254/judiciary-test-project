import { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, UserCog, Search, Clock, Activity } from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  status: 'active' | 'inactive';
  permissions: {
    canViewCases: boolean;
    canCreateCases: boolean;
    canEditCases: boolean;
    canDeleteCases: boolean;
    canUploadFiles: boolean;
    canManageFolders: boolean;
  };
  createdDate: string;
  lastLogin?: string;
  activityLogs: ActivityLog[];
}

interface AdminManagementProps {
  user: User;
}

export function AdminManagement({ user }: AdminManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const mockAdmins: Admin[] = [
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@court.gov',
      role: 'admin',
      status: 'active',
      permissions: {
        canViewCases: true,
        canCreateCases: true,
        canEditCases: true,
        canDeleteCases: false,
        canUploadFiles: true,
        canManageFolders: true,
      },
      createdDate: '2024-01-15',
      lastLogin: '2024-11-14 09:23 AM',
      activityLogs: [
        { id: '1', action: 'Logged In', timestamp: '2024-11-14 09:23 AM', details: 'Successful login from IP 192.168.1.100' },
        { id: '2', action: 'Created Case', timestamp: '2024-11-14 09:45 AM', details: 'Created case CR-2024-1023' },
        { id: '3', action: 'Uploaded File', timestamp: '2024-11-14 10:15 AM', details: 'Uploaded evidence.pdf to case CV-2024-8745' },
        { id: '4', action: 'Updated Case', timestamp: '2024-11-14 11:30 AM', details: 'Updated case status for CR-2024-1019' },
        { id: '5', action: 'Logged Out', timestamp: '2024-11-14 05:00 PM', details: 'Session ended' },
      ],
    },
    {
      id: '3',
      name: 'Sarah Williams',
      email: 'sarah.williams@court.gov',
      role: 'admin',
      status: 'active',
      permissions: {
        canViewCases: true,
        canCreateCases: true,
        canEditCases: false,
        canDeleteCases: false,
        canUploadFiles: true,
        canManageFolders: false,
      },
      createdDate: '2024-02-20',
      lastLogin: '2024-11-13 02:15 PM',
      activityLogs: [
        { id: '1', action: 'Logged In', timestamp: '2024-11-13 02:15 PM', details: 'Successful login from IP 192.168.1.101' },
        { id: '2', action: 'Viewed Case', timestamp: '2024-11-13 02:30 PM', details: 'Accessed case CV-2024-8745' },
        { id: '3', action: 'Created Case', timestamp: '2024-11-13 03:00 PM', details: 'Created case CR-2024-1025' },
        { id: '4', action: 'Logged Out', timestamp: '2024-11-13 06:00 PM', details: 'Session ended' },
      ],
    },
    {
      id: '4',
      name: 'Michael Chen',
      email: 'michael.chen@court.gov',
      role: 'admin',
      status: 'inactive',
      permissions: {
        canViewCases: true,
        canCreateCases: false,
        canEditCases: false,
        canDeleteCases: false,
        canUploadFiles: false,
        canManageFolders: false,
      },
      createdDate: '2024-03-10',
      lastLogin: '2024-10-25 10:00 AM',
      activityLogs: [
        { id: '1', action: 'Logged In', timestamp: '2024-10-25 10:00 AM', details: 'Successful login from IP 192.168.1.102' },
        { id: '2', action: 'Viewed Cases', timestamp: '2024-10-25 10:15 AM', details: 'Accessed multiple case files' },
        { id: '3', action: 'Logged Out', timestamp: '2024-10-25 12:00 PM', details: 'Session ended' },
      ],
    },
  ];

  const filteredAdmins = mockAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Admin Management</h2>
          <p className="text-gray-500">Manage administrator accounts and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Enter admin name" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" placeholder="admin@court.gov" />
              </div>
              <div className="space-y-2">
                <Label>Initial Password</Label>
                <Input type="password" placeholder="Enter temporary password" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">Create Admin</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search administrators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAdmins.map((admin) => {
              const initials = admin.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();

              return (
                <Card key={admin.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-green-600 text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p>{admin.name}</p>
                            <Badge
                              variant={admin.status === 'active' ? 'default' : 'secondary'}
                              className={admin.status === 'active' ? 'bg-green-600' : ''}
                            >
                              {admin.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-gray-400">
                              Created: {admin.createdDate}
                            </p>
                            {admin.lastLogin && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Last login: {admin.lastLogin}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAdmin(admin)}
                      >
                        <UserCog className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedAdmin && (
        <Dialog open={!!selectedAdmin} onOpenChange={() => setSelectedAdmin(null)}>
          <DialogContent className="max-w-4xl max-h-[70vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Manage Admin: {selectedAdmin.name}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="permissions" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="logs">Activity Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="permissions" className="flex-1 overflow-y-auto">
                <div className="space-y-6 py-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p>{selectedAdmin.name}</p>
                      <p className="text-sm text-gray-500">{selectedAdmin.email}</p>
                      {selectedAdmin.lastLogin && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last login: {selectedAdmin.lastLogin}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={selectedAdmin.status === 'active' ? 'default' : 'secondary'}
                      className={selectedAdmin.status === 'active' ? 'bg-green-600' : ''}
                    >
                      {selectedAdmin.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="mb-4">Access Permissions</h3>
                    <div className="space-y-4">
                      {Object.entries(selectedAdmin.permissions).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <Label htmlFor={key} className="cursor-pointer">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                              {key === 'canViewCases' && 'Allow viewing all court cases'}
                              {key === 'canCreateCases' && 'Allow creating new court cases'}
                              {key === 'canEditCases' && 'Allow editing existing cases'}
                              {key === 'canDeleteCases' && 'Allow deleting court cases'}
                              {key === 'canUploadFiles' && 'Allow uploading files and documents'}
                              {key === 'canManageFolders' && 'Allow creating and managing folders'}
                            </p>
                          </div>
                          <Switch id={key} checked={value} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-between pt-4 border-t">
                    <Button variant="destructive" size="sm">
                      Deactivate Account
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setSelectedAdmin(null)}>
                        Cancel
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="flex-1 overflow-y-auto">
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Activity className="w-4 h-4" />
                    <span>Activity history for {selectedAdmin.name}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedAdmin.activityLogs.map((log) => (
                      <Card key={log.id} className="hover:bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Activity className="w-4 h-4 text-green-600" />
                                <span className="font-medium">{log.action}</span>
                              </div>
                              <p className="text-sm text-gray-600 ml-6">{log.details}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {log.timestamp}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {selectedAdmin.activityLogs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No activity logs available</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}