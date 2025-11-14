import { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Building2, Search, FileText, Clock, CheckCircle, XCircle, Download, Plus, Settings } from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface Court {
  id: string;
  name: string;
  totalCases: number;
  pendingCases: number;
  activeCases: number;
  dismissedCases: number;
  location: string;
}

interface CourtsViewProps {
  user: User;
}

export function CourtsView({ user }: CourtsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [isCreateCourtOpen, setIsCreateCourtOpen] = useState(false);
  const [isManageCourtsOpen, setIsManageCourtsOpen] = useState(false);

  // Generate 26 courts with mock data
  const mockCourts: Court[] = Array.from({ length: 26 }, (_, i) => {
    const courtNumber = i + 1;
    const total = Math.floor(Math.random() * 100) + 50;
    const dismissed = Math.floor(Math.random() * 30) + 10;
    const active = Math.floor(Math.random() * 40) + 15;
    const pending = total - dismissed - active;

    return {
      id: `court-${courtNumber}`,
      name: `Court ${courtNumber}`,
      totalCases: total,
      pendingCases: Math.max(0, pending),
      activeCases: active,
      dismissedCases: dismissed,
      location: `District ${courtNumber}`,
    };
  });

  const filteredCourts = mockCourts.filter(
    (court) =>
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockCourtCases = [
    { id: '1', caseNumber: 'CR-2024-1023', title: 'State v. Johnson', status: 'Active', date: '2024-10-15' },
    { id: '2', caseNumber: 'CV-2024-8745', title: 'Smith v. Brown Corp', status: 'Pending', date: '2024-09-22' },
    { id: '3', caseNumber: 'CR-2024-1019', title: 'People v. Martinez', status: 'Dismissed', date: '2024-10-01' },
    { id: '4', caseNumber: 'CR-2024-1015', title: 'State v. Williams', status: 'Active', date: '2024-09-15' },
  ];

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ['Court Name', 'Location', 'Total Cases', 'Pending', 'Active', 'Dismissed'].join(','),
      ...filteredCourts.map(c => 
        [c.name, c.location, c.totalCases, c.pendingCases, c.activeCases, c.dismissedCases].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courts-summary-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Courts</h2>
          <p className="text-gray-500">View all courts and their case statistics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setIsManageCourtsOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Manage Courts
          </Button>
          <Button variant="outline" onClick={() => setIsCreateCourtOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Court
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search courts by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourts.map((court) => (
              <Card
                key={court.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCourt(court)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{court.name}</CardTitle>
                      <p className="text-xs text-gray-500 mt-1">{court.location}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Cases</span>
                      <Badge variant="outline">{court.totalCases}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-yellow-600" />
                        Pending
                      </span>
                      <Badge className="bg-yellow-100 text-yellow-700">{court.pendingCases}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Active
                      </span>
                      <Badge className="bg-green-100 text-green-700">{court.activeCases}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-red-600" />
                        Dismissed
                      </span>
                      <Badge className="bg-red-100 text-red-700">{court.dismissedCases}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredCourts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No courts found matching "{searchQuery}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCourt && (
        <Dialog open={!!selectedCourt} onOpenChange={() => setSelectedCourt(null)}>
          <DialogContent className="max-w-4xl max-h-[70vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                {selectedCourt.name} - {selectedCourt.location}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-1">{selectedCourt.totalCases}</div>
                    <p className="text-xs text-gray-500">Total Cases</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-1 text-yellow-600">{selectedCourt.pendingCases}</div>
                    <p className="text-xs text-gray-500">Pending</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-1 text-green-600">{selectedCourt.activeCases}</div>
                    <p className="text-xs text-gray-500">Active</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-1 text-red-600">{selectedCourt.dismissedCases}</div>
                    <p className="text-xs text-gray-500">Dismissed</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="mb-3">Cases in {selectedCourt.name}</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b grid grid-cols-12 gap-4 text-sm">
                    <div className="col-span-3">Case Number</div>
                    <div className="col-span-5">Title</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Date</div>
                  </div>
                  <div className="divide-y">
                    {mockCourtCases.map((caseItem) => (
                      <div key={caseItem.id} className="px-4 py-3 grid grid-cols-12 gap-4 items-center text-sm hover:bg-gray-50">
                        <div className="col-span-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>{caseItem.caseNumber}</span>
                        </div>
                        <div className="col-span-5">{caseItem.title}</div>
                        <div className="col-span-2">
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
                        </div>
                        <div className="col-span-2 text-gray-600">{caseItem.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedCourt(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Court Dialog */}
      <Dialog open={isCreateCourtOpen} onOpenChange={setIsCreateCourtOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Court</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Court Name</Label>
              <Input placeholder="e.g., Court 21" />
            </div>
            <div className="space-y-2">
              <Label>Location/District</Label>
              <Input placeholder="e.g., District 21" />
            </div>
            <div className="space-y-2">
              <Label>Court Type</Label>
              <Input placeholder="e.g., District Court, Supreme Court" />
            </div>
            <div className="space-y-2">
              <Label>Presiding Judge</Label>
              <Input placeholder="Enter judge name" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreateCourtOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">Create Court</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Courts Dialog */}
      <Dialog open={isManageCourtsOpen} onOpenChange={setIsManageCourtsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Manage Courts</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <div className="space-y-3">
              {mockCourts.map((court) => (
                <Card key={court.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p>{court.name}</p>
                          <p className="text-sm text-gray-500">{court.location} • {court.totalCases} cases</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                          Disable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setIsManageCourtsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}