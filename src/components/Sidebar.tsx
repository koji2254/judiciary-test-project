import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Building2,
} from 'lucide-react';
import { User } from '../App';
import { ViewType } from './Dashboard';
import { Button } from './ui/button';
import Logo from '../assets/images/logo-2.png';

interface SidebarProps {
  user: User;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  user,
  currentView,
  onViewChange,
  isOpen,
  onToggle,
}: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['superadmin', 'admin'] },
    { id: 'cases', label: 'Court Cases', icon: FileText, roles: ['superadmin', 'admin'] },
    { id: 'courts', label: 'Courts', icon: Building2, roles: ['superadmin', 'admin'] },
    { id: 'judgement', label: 'Judgement', icon: Gavel, roles: ['superadmin', 'admin'] },
    { id: 'folders', label: 'Folders & Files', icon: FolderOpen, roles: ['superadmin', 'admin'] },
    { id: 'admins', label: 'Admin Management', icon: Users, roles: ['superadmin'] },
    { id: 'court-session', label: 'Upload Session', icon: Users, roles: ['superadmin', 'admin'] },
  ] as const;

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <aside
      className={`h-dvh bg-green-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } flex flex-col relative`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-green-800">
        <img
          src={Logo}
          alt="Court CMS Logo"
          className="w-8 h-8 object-contain"
        />
        {isOpen && (
          <span className="font-semibold text-lg whitespace-nowrap">
            ICT DEPARTMENT
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
              <Icon className="w-5 h-5 shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-20 bg-green-700 hover:bg-green-600 text-white rounded-full w-6 h-6 p-0"
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </Button>
    </aside>
  );
}
