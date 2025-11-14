'use client';

import { useState } from 'react';
import { User } from '../App';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import {
  Gavel,
  Search,
  Download,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface CompletedCase {
  id: string;
  caseNumber: string;
  title: string;
  court: string;
  completedDate: string;
  outcome: string;
  totalCasesInCourt: number;
}

interface JudgementViewProps {
  user: User;
}

export function JudgementView({ user }: JudgementViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('all');
  const [selectedCase, setSelectedCase] = useState<CompletedCase | null>(null);

  /* -------------------------------------------------
   *  1. All 26 courts
   * ------------------------------------------------- */
  const ALL_COURTS = Array.from({ length: 26 }, (_, i) => `Court ${i + 1}`);

  /* -------------------------------------------------
   *  2. 30+ realistic mock data
   * ------------------------------------------------- */
  const mockCompletedCases: CompletedCase[] = [
    { id: '1', caseNumber: 'CR-2024-1019', title: 'State v. Anderson', court: 'Court 1', completedDate: '2024-11-01', outcome: 'Conviction – 5 years', totalCasesInCourt: 87 },
    { id: '2', caseNumber: 'CV-2024-3421', title: 'Thompson v. Industries Inc', court: 'Court 2', completedDate: '2024-10-28', outcome: 'Settlement $450K', totalCasesInCourt: 64 },
    { id: '3', caseNumber: 'CR-2024-2156', title: 'People v. Jackson', court: 'Court 3', completedDate: '2024-10-25', outcome: 'Acquitted', totalCasesInCourt: 92 },
    { id: '4', caseNumber: 'CV-2024-7832', title: 'Davis v. County Board', court: 'Court 1', completedDate: '2024-10-22', outcome: 'Judgment for Plaintiff', totalCasesInCourt: 87 },
    { id: '5', caseNumber: 'CR-2024-5543', title: 'State v. Rodriguez', court: 'Court 5', completedDate: '2024-10-20', outcome: 'Plea Deal – Probation', totalCasesInCourt: 73 },
    { id: '6', caseNumber: 'CV-2024-9012', title: 'Miller v. Construction Co', court: 'Court 7', completedDate: '2024-10-18', outcome: 'Dismissed with Prejudice', totalCasesInCourt: 58 },
    { id: '7', caseNumber: 'CR-2024-4421', title: 'People v. Chen', court: 'Court 4', completedDate: '2024-10-15', outcome: 'Conviction – 3 years', totalCasesInCourt: 81 },
    { id: '8', caseNumber: 'CV-2024-6789', title: 'Wilson v. Medical Center', court: 'Court 10', completedDate: '2024-10-12', outcome: 'Settlement $1.2M', totalCasesInCourt: 67 },
    { id: '9', caseNumber: 'CR-2024-3312', title: 'State v. Taylor', court: 'Court 2', completedDate: '2024-10-10', outcome: 'Dismissed – Speedy Trial', totalCasesInCourt: 64 },
    { id: '10', caseNumber: 'CV-2024-8821', title: 'Brown v. Insurance Corp', court: 'Court 15', completedDate: '2024-10-08', outcome: 'Judgment for Defendant', totalCasesInCourt: 55 },
    { id: '11', caseNumber: 'CR-2024-1198', title: 'State v. Patel', court: 'Court 6', completedDate: '2024-10-05', outcome: 'Conviction – Fine $5K', totalCasesInCourt: 70 },
    { id: '12', caseNumber: 'CV-2024-5544', title: 'Lee v. Tech Solutions', court: 'Court 8', completedDate: '2024-10-03', outcome: 'Settlement $800K', totalCasesInCourt: 61 },
    { id: '13', caseNumber: 'CR-2024-2233', title: 'People v. Kim', court: 'Court 9', completedDate: '2024-09-30', outcome: 'Diversion Program', totalCasesInCourt: 75 },
    { id: '14', caseNumber: 'CV-2024-6677', title: 'Garcia v. City Transit', court: 'Court 11', completedDate: '2024-09-27', outcome: 'Judgment $300K', totalCasesInCourt: 59 },
    { id: '15', caseNumber: 'CR-2024-4455', title: 'State v. Nguyen', court: 'Court 12', completedDate: '2024-09-25', outcome: 'Acquitted', totalCasesInCourt: 68 },
    { id: '16', caseNumber: 'CV-2024-7788', title: 'Harris v. Real Estate LLC', court: 'Court 13', completedDate: '2024-09-22', outcome: 'Dismissed – Lack of Standing', totalCasesInCourt: 52 },
    { id: '17', caseNumber: 'CR-2024-8899', title: 'People v. Singh', court: 'Court 14', completedDate: '2024-09-20', outcome: 'Plea – Community Service', totalCasesInCourt: 66 },
    { id: '18', caseNumber: 'CV-2024-9900', title: 'Young v. Hospital Group', court: 'Court 16', completedDate: '2024-09-18', outcome: 'Settlement $2.1M', totalCasesInCourt: 48 },
    { id: '19', caseNumber: 'CR-2024-1122', title: 'State v. Morales', court: 'Court 17', completedDate: '2024-09-15', outcome: 'Conviction – 7 years', totalCasesInCourt: 71 },
    { id: '20', caseNumber: 'CV-2024-2233', title: 'Adams v. Bank Corp', court: 'Court 18', completedDate: '2024-09-12', outcome: 'Judgment for Plaintiff', totalCasesInCourt: 60 },
    { id: '21', caseNumber: 'CR-2024-3344', title: 'People v. Khan', court: 'Court 19', completedDate: '2024-09-10', outcome: 'Dismissed – Evidence Issue', totalCasesInCourt: 63 },
    { id: '22', caseNumber: 'CV-2024-4455', title: 'Rivera v. Logistics Inc', court: 'Court 20', completedDate: '2024-09-08', outcome: 'Settlement $600K', totalCasesInCourt: 57 },
    { id: '23', caseNumber: 'CR-2024-5566', title: 'State v. Gomez', court: 'Court 21', completedDate: '2024-09-05', outcome: 'Plea Deal – 2 years', totalCasesInCourt: 69 },
    { id: '24', caseNumber: 'CV-2024-6677', title: 'Foster v. Energy Co', court: 'Court 22', completedDate: '2024-09-03', outcome: 'Judgment $1.5M', totalCasesInCourt: 54 },
    { id: '25', caseNumber: 'CR-2024-7788', title: 'People v. Ali', court: 'Court 23', completedDate: '2024-09-01', outcome: 'Acquitted', totalCasesInCourt: 72 },
    { id: '26', caseNumber: 'CV-2024-8899', title: 'Clark v. Retail Chain', court: 'Court 24', completedDate: '2024-08-30', outcome: 'Settlement $350K', totalCasesInCourt: 50 },
    { id: '27', caseNumber: 'CR-2024-9900', title: 'State v. Rahman', court: 'Court 25', completedDate: '2024-08-28', outcome: 'Conviction – Fine', totalCasesInCourt: 65 },
    { id: '28', caseNumber: 'CV-2024-1011', title: 'White v. Pharma Inc', court: 'Court 26', completedDate: '2024-08-25', outcome: 'Judgment for Defendant', totalCasesInCourt: 53 },
    { id: '29', caseNumber: 'CR-2024-2234', title: 'People v. Diaz', court: 'Court 3', completedDate: '2024-08-22', outcome: 'Diversion', totalCasesInCourt: 92 },
    { id: '30', caseNumber: 'CV-2024-3345', title: 'King v. Auto Group', court: 'Court 5', completedDate: '2024-08-20', outcome: 'Settlement $700K', totalCasesInCourt: 73 },
  ];

  /* -------------------------------------------------
   *  3. Group cases by court (all 26 courts exist)
   * ------------------------------------------------- */
  const casesByCourt = ALL_COURTS.reduce(
    (acc, name) => {
      acc[name] = { court: name, completedCount: 0, totalCases: 0, cases: [] };
      return acc;
    },
    {} as Record<
      string,
      { court: string; completedCount: number; totalCases: number; cases: CompletedCase[] }
    >
  );

  mockCompletedCases.forEach((c) => {
    const e = casesByCourt[c.court];
    e.completedCount++;
    e.totalCases = c.totalCasesInCourt;
    e.cases.push(c);
  });

  const sortedCourtData = Object.values(casesByCourt);

  /* -------------------------------------------------
   *  4. Show only first 10 courts as buttons
   * ------------------------------------------------- */
  const VISIBLE = 10;
  const visibleCourts = sortedCourtData.slice(0, VISIBLE);
  const moreCourts = sortedCourtData.slice(VISIBLE);

  /* -------------------------------------------------
   *  5. Filtering
   * ------------------------------------------------- */
  const filteredCases = mockCompletedCases.filter((c) => {
    const matchesSearch =
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.outcome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourt = selectedCourt === 'all' || c.court === selectedCourt;
    return matchesSearch && matchesCourt;
  });

  /* -------------------------------------------------
   *  6. Export to CSV
   * ------------------------------------------------- */
  const handleExport = () => {
    const csv = [
      ['Case Number', 'Title', 'Court', 'Completed Date', 'Outcome'].join(','),
      ...filteredCases.map((c) =>
        [c.caseNumber, c.title, c.court, c.completedDate, c.outcome].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `completed-cases-${new Date()
      .toISOString()
      .split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Judgement – Completed Cases</h2>
          <p className="text-gray-500">
            View all completed cases across all courts
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* ---------- Selected Court Badge ---------- */}
      {selectedCourt !== 'all' && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            Selected:{' '}
            <span className="font-semibold ml-1">{selectedCourt}</span>
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedCourt('all')}
            className="h-6 px-2 text-xs"
          >
            Clear
          </Button>
        </div>
      )}

      {/* ---------- Court Buttons (All + 1-10) ---------- */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={selectedCourt === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCourt('all')}
          className={`w-28 ${
            selectedCourt === 'all'
              ? 'bg-green-600 hover:bg-green-700'
              : ''
          }`}
        >
          All Courts
        </Button>

        {visibleCourts.map((c) => (
          <Button
            key={c.court}
            variant={selectedCourt === c.court ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCourt(c.court)}
            className={`w-28 ${
              selectedCourt === c.court
                ? 'bg-blue-600 hover:bg-blue-700'
                : ''
            }`}
          >
            {c.court} ({c.completedCount})
          </Button>
        ))}

        {/* ---------- "More…" native select (no shadcn dropdown) ---------- */}
        {moreCourts.length > 0 && (
          <Select
            value={selectedCourt}
            onValueChange={(v) => setSelectedCourt(v)}
          >
            <SelectTrigger className="w-28 h-9">
              <SelectValue placeholder="More…" />
            </SelectTrigger>
            <SelectContent>
              {moreCourts.map((c) => (
                <SelectItem key={c.court} value={c.court}>
                  {c.court} ({c.completedCount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* ---------- Search + Global Court Filter ---------- */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by case number, title, or outcome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCourt}
              onValueChange={setSelectedCourt}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by court" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courts</SelectItem>
                {ALL_COURTS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="text-sm font-medium">
                Completed Cases ({filteredCases.length})
              </h3>
            </div>

            <div className="bg-gray-50 px-4 py-2 border-b grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-2">Case Number</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Court</div>
              <div className="col-span-2">Completed Date</div>
              <div className="col-span-2">Actions</div>
            </div>

            <div className="divide-y max-h-96 overflow-y-auto">
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  className="px-4 py-3 grid grid-cols-12 gap-4 items-center text-sm hover:bg-gray-50"
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-green-600" />
                    <span className="font-mono">{c.caseNumber}</span>
                  </div>
                  <div className="col-span-4">{c.title}</div>
                  <div className="col-span-2">
                    <Badge variant="outline">{c.court}</Badge>
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {c.completedDate}
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCase(c)}
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
                <p>No completed cases found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ---------- Details Dialog ---------- */}
      {selectedCase && (
        <Dialog
          open={!!selectedCase}
          onOpenChange={() => setSelectedCase(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-green-600" />
                Completed Case Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {selectedCase.title}
                    </h3>
                    <Badge className="bg-green-600 text-white">
                      Completed
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Case Number:</span>{' '}
                      <p className="font-mono">{selectedCase.caseNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Court:</span>{' '}
                      <p>{selectedCase.court}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Completed Date:</span>{' '}
                      <p>{selectedCase.completedDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        Total Cases in Court:
                      </span>{' '}
                      <p>{selectedCase.totalCasesInCourt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Final Outcome</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    {selectedCase.outcome}
                  </p>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCase(null)}
                >
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Judgment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}