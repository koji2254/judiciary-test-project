import { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Gavel, Search, Building2, FileText, Download } from 'lucide-react';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface DismissedCase {
  id: string;
  caseNumber: string;
  title: string;
  court: string;
  dismissedDate: string;
  reason: string;
  totalCasesInCourt: number;
}

interface JudgementViewProps {
  user: User;
}

export function JudgementView({ user }: JudgementViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('all');
  const [selectedCase, setSelectedCase] = useState<DismissedCase | null>(null);

  // Generate dismissed cases for courts 1-20
  const mockDismissedCases: DismissedCase[] = [
    {
      id: '1',
      caseNumber: 'CR-2024-1019',
      title: 'State v. Anderson',
      court: 'Court 1',
      dismissedDate: '2024-11-01',
      reason: 'Lack of evidence',
      totalCasesInCourt: 87,
    },
    {
      id: '2',
      caseNumber: 'CV-2024-3421',
      title: 'Thompson v. Industries Inc',
      court: 'Court 2',
      dismissedDate: '2024-10-28',
      reason: 'Settlement reached',
      totalCasesInCourt: 64,
    },
    {
      id: '3',
      caseNumber: 'CR-2024-2156',
      title: 'People v. Jackson',
      court: 'Court 3',
      dismissedDate: '2024-10-25',
      reason: 'Procedural error',
      totalCasesInCourt: 92,
    },
    {
      id: '4',
      caseNumber: 'CV-2024-7832',
      title: 'Davis v. County Board',
      court: 'Court 1',
      dismissedDate: '2024-10-22',
      reason: 'Jurisdiction issue',
      totalCasesInCourt: 87,
    },
    {
      id: '5',
      caseNumber: 'CR-2024-5543',
      title: 'State v. Rodriguez',
      court: 'Court 5',
      dismissedDate: '2024-10-20',
      reason: 'Witness unavailable',
      totalCasesInCourt: 73,
    },
    {
      id: '6',
      caseNumber: 'CV-2024-9012',
      title: 'Miller v. Construction Co',
      court: 'Court 7',
      dismissedDate: '2024-10-18',
      reason: 'Settled out of court',
      totalCasesInCourt: 58,
    },
    {
      id: '7',
      caseNumber: 'CR-2024-4421',
      title: 'People v. Chen',
      court: 'Court 4',
      dismissedDate: '2024-10-15',
      reason: 'Constitutional violation',
      totalCasesInCourt: 81,
    },
    {
      id: '8',
      caseNumber: 'CV-2024-6789',
      title: 'Wilson v. Medical Center',
      court: 'Court 10',
      dismissedDate: '2024-10-12',
      reason: 'Statute of limitations',
      totalCasesInCourt: 67,
    },
    {
      id: '9',
      caseNumber: 'CR-2024-3312',
      title: 'State v. Taylor',
      court: 'Court 2',
      dismissedDate: '2024-10-10',
      reason: 'Insufficient evidence',
      totalCasesInCourt: 64,
    },
    {
      id: '10',
      caseNumber: 'CV-2024-8821',
      title: 'Brown v. Insurance Corp',
      court: 'Court 15',
      dismissedDate: '2024-10-08',
      reason: 'Plaintiff withdrew',
      totalCasesInCourt: 55,
    },
  ];

  // Get unique courts for filter and sort them numerically
  const uniqueCourts = Array.from(new Set(mockDismissedCases.map((c) => c.court)));
  const sortedCourts = uniqueCourts.sort((a, b) => {
    const numA = parseInt(a.replace('Court ', ''));
    const numB = parseInt(b.replace('Court ', ''));
    return numA - numB;
  });

  // Group dismissed cases by court
  const casesByCourt = mockDismissedCases.reduce((acc, caseItem) => {
    if (!acc[caseItem.court]) {
      acc[caseItem.court] = {
        court: caseItem.court,
        dismissedCount: 0,
        totalCases: caseItem.totalCasesInCourt,
        cases: [],
      };
    }
    acc[caseItem.court].dismissedCount++;
    acc[caseItem.court].cases.push(caseItem);
    return acc;
  }, {} as Record<string, { court: string; dismissedCount: number; totalCases: number; cases: DismissedCase[] }>);

  // Sort court data by court number
  const sortedCourtData = Object.values(casesByCourt).sort((a, b) => {
    const numA = parseInt(a.court.replace('Court ', ''));
    const numB = parseInt(b.court.replace('Court ', ''));
    return numA - numB;
  });

  const filteredCases = mockDismissedCases.filter((caseItem) => {
    const matchesSearch =
      caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourt = selectedCourt === 'all' || caseItem.court === selectedCourt;
    return matchesSearch && matchesCourt;
  });

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ['Case Number', 'Title', 'Court', 'Dismissed Date', 'Reason'].join(','),
      ...filteredCases.map(c => 
        [c.caseNumber, c.title, c.court, c.dismissedDate, c.reason].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dismissed-cases-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Judgement - Dismissed Cases</h2>
          <p className="text-gray-500">View all dismissed cases across all courts</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedCourt === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCourt('all')}
          className={selectedCourt === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          All Courts
        </Button>
        {sortedCourtData.map((courtData) => (
          <Button
            key={courtData.court}
            variant={selectedCourt === courtData.court ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCourt(courtData.court)}
            className={selectedCourt === courtData.court ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {courtData.court} ({courtData.dismissedCount})
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by case number, title, or dismissal reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCourt} onValueChange={setSelectedCourt}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by court" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courts</SelectItem>
                {sortedCourts.map((court) => (
                  <SelectItem key={court} value={court}>
                    {court}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="text-sm">Dismissed Cases ({filteredCases.length})</h3>
            </div>
            <div className="bg-gray-50 px-4 py-2 border-b grid grid-cols-12 gap-4 text-sm">
              <div className="col-span-2">Case Number</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Court</div>
              <div className="col-span-2">Dismissed Date</div>
              <div className="col-span-2">Actions</div>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {filteredCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="px-4 py-3 grid grid-cols-12 gap-4 items-center text-sm hover:bg-gray-50"
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-red-600" />
                    <span>{caseItem.caseNumber}</span>
                  </div>
                  <div className="col-span-4">{caseItem.title}</div>
                  <div className="col-span-2">
                    <Badge variant="outline">{caseItem.court}</Badge>
                  </div>
                  <div className="col-span-2 text-gray-600">{caseItem.dismissedDate}</div>
                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCase(caseItem)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {filteredCases.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Gavel className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No dismissed cases found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-red-600" />
                Dismissed Case Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Card className="bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3>{selectedCase.title}</h3>
                    <Badge className="bg-red-600">Dismissed</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Case Number:</span>
                      <p>{selectedCase.caseNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Court:</span>
                      <p>{selectedCase.court}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Dismissed Date:</span>
                      <p>{selectedCase.dismissedDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Cases in Court:</span>
                      <p>{selectedCase.totalCasesInCourt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dismissal Reason</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{selectedCase.reason}</p>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedCase(null)}>
                  Close
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Case File
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}