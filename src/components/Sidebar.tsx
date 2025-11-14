import { Scale, LayoutDashboard, FolderOpen, Users, FileText, ChevronLeft, ChevronRight, Gavel, Building2 } from 'lucide-react';
import { User } from '../App';
import { ViewType } from './Dashboard';
import { Button } from './ui/button';

interface SidebarProps {
  user: User;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ user, currentView, onViewChange, isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { id: 'overview' as ViewType, label: 'Overview', icon: LayoutDashboard, roles: ['superadmin', 'admin'] },
    { id: 'cases' as ViewType, label: 'Court Cases', icon: FileText, roles: ['superadmin', 'admin'] },
    { id: 'courts' as ViewType, label: 'Courts', icon: Building2, roles: ['superadmin', 'admin'] },
    { id: 'judgement' as ViewType, label: 'Judgement', icon: Gavel, roles: ['superadmin', 'admin'] },
    { id: 'folders' as ViewType, label: 'Folders & Files', icon: FolderOpen, roles: ['superadmin', 'admin'] },
    { id: 'admins' as ViewType, label: 'Admin Management', icon: Users, roles: ['superadmin'] },
  ];

  const filteredItems = menuItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside
      className={`bg-green-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } flex flex-col relative`}
    >
      <div className="p-6 flex items-center gap-3 border-b border-green-800">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Scale className="w-6 h-6" />
        </div>
        {isOpen && <span>Court CMS</span>}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-green-700 text-white'
                  : 'text-green-100 hover:bg-green-800'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <Button
        onClick={onToggle}
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-20 bg-green-700 hover:bg-green-600 text-white rounded-full w-6 h-6 p-0"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>
    </aside>
  );
}