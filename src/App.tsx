import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { Toaster, toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin';
  permissions: {
    canViewCases: boolean;
    canCreateCases: boolean;
    canEditCases: boolean;
    canDeleteCases: boolean;
    canUploadFiles: boolean;
    canManageFolders: boolean;
  };
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Mock login - in production, this would call an API
    if (email === 'superadmin@court.gov' && password === 'admin123') {
      setCurrentUser({
        id: '1',
        name: 'Super Admin',
        email: 'superadmin@court.gov',
        role: 'superadmin',
        permissions: {
          canViewCases: true,
          canCreateCases: true,
          canEditCases: true,
          canDeleteCases: true,
          canUploadFiles: true,
          canManageFolders: true,
        },
      });
    } else if (email === 'admin@court.gov' && password === 'admin123') {
      setCurrentUser({
        id: '2',
        name: 'Admin User',
        email: 'admin@court.gov',
        role: 'admin',
        permissions: {
          canViewCases: true,
          canCreateCases: true,
          canEditCases: true,
          canDeleteCases: false,
          canUploadFiles: true,
          canManageFolders: true,
        },
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <Dashboard user={currentUser} onLogout={handleLogout} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
