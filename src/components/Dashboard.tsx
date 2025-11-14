import { useState } from 'react';
import { User } from '../App';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CasesView } from './CasesView';
import { AdminManagement } from './AdminManagement';
import { FoldersView } from './FoldersView';
import { OverviewView } from './OverviewView';
import { CourtsView } from './CourtsView';
import { JudgementView } from './JudgementView';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export type ViewType = 'overview' | 'cases' | 'folders' | 'admins' | 'courts' | 'judgement';

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 p-6">
          {currentView === 'overview' && <OverviewView user={user} />}
          {currentView === 'cases' && <CasesView user={user} />}
          {currentView === 'courts' && <CourtsView user={user} />}
          {currentView === 'judgement' && <JudgementView user={user} />}
          {currentView === 'folders' && <FoldersView user={user} />}
          {currentView === 'admins' && user.role === 'superadmin' && (
            <AdminManagement user={user} />
          )}
        </main>
      </div>
    </div>
  );
}