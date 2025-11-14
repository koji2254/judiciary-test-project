import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Logo from '../assets/images/logo-2.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          {/* Logo */}
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-green-100">
            <img src={Logo} alt="Court CMS Logo" className="w-full h-full object-cover" />
          </div>

          <CardTitle>Court Case Management System</CardTitle>
          <CardDescription>
            Sign in to access case records and management tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@court.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Sign In
            </Button>
            <div className="text-sm text-gray-500 space-y-1 p-3 bg-gray-50 rounded">
              <p>Demo Credentials:</p>
              <p>Super Admin: superadmin@court.gov / admin123</p>
              <p>Admin: admin@court.gov / admin123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
