import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, Users, TrendingUp, Gavel } from 'lucide-react';

interface OverviewViewProps {
  user: User;
}

export function OverviewView({ user }: OverviewViewProps) {
  const stats = [
    { label: 'Total Cases', value: '1,247', icon: FileText, color: 'bg-blue-500' },
    { label: 'Active Cases', value: '342', icon: TrendingUp, color: 'bg-green-600' },
    { label: 'Judgement', value: '89', icon: Gavel, color: 'bg-red-500' },
    { label: 'Admin Users', value: '12', icon: Users, color: 'bg-orange-500', superAdminOnly: true },
  ];

  const filteredStats = stats.filter((stat) => !stat.superAdminOnly || user.role === 'superadmin');

  return (
    <div className="space-y-6">
      <div>
        <h2>Dashboard Overview</h2>
        <p className="text-gray-500">Quick statistics and recent activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">{stat.label}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">Updated just now</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'CR-2024-1023', title: 'State v. Johnson', date: 'Nov 10, 2024', status: 'Active' },
                { id: 'CV-2024-8745', title: 'Smith v. Brown Corp', date: 'Nov 9, 2024', status: 'Pending' },
                { id: 'CR-2024-1019', title: 'People v. Martinez', date: 'Nov 8, 2024', status: 'Active' },
              ].map((caseItem) => (
                <div key={caseItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{caseItem.id}</span>
                    </div>
                    <p className="text-sm mt-1">{caseItem.title}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded ${
                      caseItem.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {caseItem.status}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{caseItem.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(user.permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  <div className={`text-xs px-3 py-1 rounded ${
                    value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {value ? 'Granted' : 'Denied'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}