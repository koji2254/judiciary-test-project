import { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Search, FileText, Upload, Eye, Download, MapPin, Edit, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CourtCase {
  id: string;
  caseNumber: string;
  title: string;
  type: string;
  status: 'Active' | 'Pending' | 'Closed' | 'Dismissed' | 'Completed';
  filedDate: string;
  nextHearing: string;
  folderId: string;
  filesCount: number;
  assignedCourt?: string;
  plaintiff?: string;
  defendant?: string;
  witnesses?: number;
  judge?: string;
}

interface CasesViewProps {
  user: User;
}

export function CasesView({ user }: CasesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CourtCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Pending' | 'Dismissed'>('all');
  const [isAssignCourtOpen, setIsAssignCourtOpen] = useState(false);
  const [isAddHearingOpen, setIsAddHearingOpen] = useState(false);
  const [isEditCaseOpen, setIsEditCaseOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);

  const mockCases: CourtCase[] = [
    {
      id: '1',
      caseNumber: 'CR-2024-1023',
      title: 'State v. Johnson',
      type: 'Criminal',
      status: 'Active',
      filedDate: '2024-10-15',
      nextHearing: '2024-11-20',
      folderId: 'folder-1',
      filesCount: 12,
      assignedCourt: 'Court 5',
      plaintiff: 'State Prosecutor',
      defendant: 'John Johnson',
      witnesses: 5,
      judge: 'Hon. Sarah Mitchell',
    },
    {
      id: '2',
      caseNumber: 'CV-2024-8745',
      title: 'Smith v. Brown Corporation',
      type: 'Civil',
      status: 'Pending',
      filedDate: '2024-09-22',
      nextHearing: '2024-11-18',
      folderId: 'folder-2',
      filesCount: 8,
      assignedCourt: 'Court 3',
      plaintiff: 'James Smith',
      defendant: 'Brown Corporation',
      witnesses: 3,
      judge: 'Hon. Robert Chen',
    },
    {
      id: '3',
      caseNumber: 'CR-2024-1019',
      title: 'People v. Martinez',
      type: 'Criminal',
      status: 'Active',
      filedDate: '2024-10-01',
      nextHearing: '2024-11-25',
      folderId: 'folder-3',
      filesCount: 15,
      plaintiff: 'District Attorney',
      defendant: 'Carlos Martinez',
      witnesses: 7,
    },
    {
      id: '4',
      caseNumber: 'CR-2024-1015',
      title: 'State v. Williams',
      type: 'Criminal',
      status: 'Dismissed',
      filedDate: '2024-09-15',
      nextHearing: '-',
      folderId: 'folder-4',
      filesCount: 7,
      assignedCourt: 'Court 1',
      plaintiff: 'State Prosecutor',
      defendant: 'Michael Williams',
      witnesses: 2,
    },
    {
      id: '5',
      caseNumber: 'CV-2024-3421',
      title: 'Thompson v. Industries Inc',
      type: 'Civil',
      status: 'Dismissed',
      filedDate: '2024-08-10',
      nextHearing: '-',
      folderId: 'folder-5',
      filesCount: 5,
      assignedCourt: 'Court 2',
      plaintiff: 'Alice Thompson',
      defendant: 'Industries Inc',
      witnesses: 4,
    },
  ];

  // Mock courts data
  const mockCourts = Array.from({ length: 26 }, (_, i) => ({
    id: `court-${i + 1}`,
    name: `Court ${i + 1}`,
    totalCases: Math.floor(Math.random() * 100) + 50,
    location: `District ${i + 1}`,
  }));

  const filteredCases = mockCases.filter((c) => {
    const matchesSearch =
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'Assigned') {
      matchesStatus = !!c.assignedCourt;
    } else if (statusFilter === 'Unassigned') {
      matchesStatus = !c.assignedCourt;
    } else {
      matchesStatus = c.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockCases.length,
    Active: mockCases.filter(c => c.status === 'Active').length,
    Pending: mockCases.filter(c => c.status === 'Pending').length,
    Dismissed: mockCases.filter(c => c.status === 'Dismissed').length,
    Assigned: mockCases.filter(c => !!c.assignedCourt).length,
    Unassigned: mockCases.filter(c => !c.assignedCourt).length,
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ['Case Number', 'Title', 'Type', 'Status', 'Filed Date', 'Next Hearing', 'Files Count'].join(','),
      ...filteredCases.map(c => 
        [c.caseNumber, c.title, c.type, c.status, c.filedDate, c.nextHearing, c.filesCount].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `court-cases-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Court Cases</h2>
          <p className="text-gray-500">View and manage all court case records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {user.permissions.canCreateCases && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Case
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Court Case</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Case Number</Label>
                      <Input placeholder="CR-2024-XXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Case Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="criminal">Criminal</SelectItem>
                          <SelectItem value="civil">Civil</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Case Title</Label>
                    <Input placeholder="Enter case title" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Plaintiff Name</Label>
                      <Input placeholder="Enter plaintiff name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Defendant Name</Label>
                      <Input placeholder="Enter defendant name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Filed Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Next Hearing Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Number of Witnesses</Label>
                      <Input type="number" placeholder="0" min="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Assigned Judge</Label>
                      <Input placeholder="Enter judge name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Case Description</Label>
                    <Textarea placeholder="Enter case details..." rows={4} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">Create Case</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                All Cases ({statusCounts.all})
              </Button>
              <Button
                variant={statusFilter === 'Active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Active')}
                className={statusFilter === 'Active' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Active ({statusCounts.Active})
              </Button>
              <Button
                variant={statusFilter === 'Pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Pending')}
                className={statusFilter === 'Pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                Pending ({statusCounts.Pending})
              </Button>
              <Button
                variant={statusFilter === 'Dismissed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Dismissed')}
                className={statusFilter === 'Dismissed' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Dismissed ({statusCounts.Dismissed})
              </Button>
              <Button
                variant={statusFilter === 'Assigned' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Assigned')}
                className={statusFilter === 'Assigned' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Assigned ({statusCounts.Assigned})
              </Button>
              <Button
                variant={statusFilter === 'Unassigned' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Unassigned')}
                className={statusFilter === 'Unassigned' ? 'bg-gray-600 hover:bg-gray-700' : ''}
              >
                Unassigned ({statusCounts.Unassigned})
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by case number or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCases.map((caseItem) => (
              <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{caseItem.caseNumber}</span>
                            <Badge
                              variant={
                                caseItem.status === 'Active'
                                  ? 'default'
                                  : caseItem.status === 'Pending'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className={
                                caseItem.status === 'Active'
                                  ? 'bg-green-600'
                                  : caseItem.status === 'Pending'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-100 text-red-700'
                              }
                            >
                              {caseItem.status}
                            </Badge>
                            {caseItem.assignedCourt && (
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {caseItem.assignedCourt}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1">{caseItem.title}</p>
                        </div>
                      </div>
                      <div className="ml-13 grid grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="text-gray-500">Type:</span> {caseItem.type}
                        </div>
                        <div>
                          <span className="text-gray-500">Filed:</span> {caseItem.filedDate}
                        </div>
                        <div>
                          <span className="text-gray-500">Next Hearing:</span> {caseItem.nextHearing}
                        </div>
                        <div>
                          <span className="text-gray-500">Files:</span> {caseItem.filesCount}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCase(caseItem)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {user.permissions.canUploadFiles && (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                          <Upload className="w-4 h-4 mr-1" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Case Dialog */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedCase.title}</DialogTitle>
                <div className="flex gap-2">
                  {user.permissions.canEditCases && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditCaseOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Case Number:</span>
                  <p>{selectedCase.caseNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        selectedCase.status === 'Active'
                          ? 'default'
                          : selectedCase.status === 'Pending'
                          ? 'secondary'
                          : 'outline'
                      }
                      className={
                        selectedCase.status === 'Active'
                          ? 'bg-green-600'
                          : selectedCase.status === 'Pending'
                          ? 'bg-yellow-500'
                          : 'bg-red-100 text-red-700'
                      }
                    >
                      {selectedCase.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsChangeStatusOpen(true)}
                    >
                      Change Status
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p>{selectedCase.type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Filed Date:</span>
                  <p>{selectedCase.filedDate}</p>
                </div>
                <div>
                  <span className="text-gray-500">Plaintiff:</span>
                  <p>{selectedCase.plaintiff || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Defendant:</span>
                  <p>{selectedCase.defendant || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Number of Witnesses:</span>
                  <p>{selectedCase.witnesses || 0}</p>
                </div>
                <div>
                  <span className="text-gray-500">Assigned Judge:</span>
                  <p>{selectedCase.judge || 'Not Assigned'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Assigned Court:</span>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedCase.assignedCourt ? (
                      <Badge variant="outline">{selectedCase.assignedCourt}</Badge>
                    ) : (
                      <span className="text-gray-400">Not Assigned</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAssignCourtOpen(true)}
                    >
                      {selectedCase.assignedCourt ? 'Reassign' : 'Assign Court'}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3>Hearing Sessions</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600"
                    onClick={() => setIsAddHearingOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Add Hearing
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <div>
                      <p className="text-sm">Initial Hearing</p>
                      <p className="text-xs text-gray-500">Nov 20, 2024 - 10:00 AM</p>
                    </div>
                    <Badge>Scheduled</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <div>
                      <p className="text-sm">Pre-trial Conference</p>
                      <p className="text-xs text-gray-500">Oct 15, 2024 - 2:00 PM</p>
                    </div>
                    <Badge className="bg-green-600">Completed</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2">Case Files ({selectedCase.filesCount})</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-500">File management interface would appear here</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign Court Dialog */}
      <Dialog open={isAssignCourtOpen} onOpenChange={setIsAssignCourtOpen}>
        <DialogContent className="max-w-3xl max-h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Assign Case to Court</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-3">
              {mockCourts.map((court) => (
                <Card
                  key={court.id}
                  className="hover:shadow-md transition-shadow cursor-pointer hover:border-green-600"
                  onClick={() => {
                    // Mock assign action
                    setIsAssignCourtOpen(false);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p>{court.name}</p>
                          <p className="text-xs text-gray-500">{court.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{court.totalCases} cases</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Hearing Dialog */}
      <Dialog open={isAddHearingOpen} onOpenChange={setIsAddHearingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Hearing Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Hearing Title</Label>
              <Input placeholder="e.g., Pre-trial Conference" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="Courtroom number or location" />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes..." rows={3} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAddHearingOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">Add Hearing</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Case Dialog */}
      <Dialog open={isEditCaseOpen} onOpenChange={setIsEditCaseOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Case Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Case Title</Label>
              <Input defaultValue={selectedCase?.title} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plaintiff Name</Label>
                <Input defaultValue={selectedCase?.plaintiff} />
              </div>
              <div className="space-y-2">
                <Label>Defendant Name</Label>
                <Input defaultValue={selectedCase?.defendant} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Witnesses</Label>
                <Input type="number" defaultValue={selectedCase?.witnesses} />
              </div>
              <div className="space-y-2">
                <Label>Assigned Judge</Label>
                <Input defaultValue={selectedCase?.judge} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Next Hearing Date</Label>
              <Input type="date" defaultValue={selectedCase?.nextHearing} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditCaseOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={isChangeStatusOpen} onOpenChange={setIsChangeStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Case Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Input value={selectedCase?.status} disabled />
            </div>
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Dismissed">Dismissed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason for Status Change</Label>
              <Textarea placeholder="Enter reason for changing status..." rows={3} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsChangeStatusOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">Update Status</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}