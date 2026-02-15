import { Outlet, Navigate, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { LogOut, Users, Building2, LogIn } from 'lucide-react';
import { rolePermissionsMap } from '../types';

export function RootLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const permissions = user ? rolePermissionsMap[user.role] : null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl text-primary">
                Реестр организаций и предпринимателей
              </h1>
              <nav className="flex gap-1">
                <Button
                  variant={location.pathname === '/' || location.pathname.includes('/counterparties') ? 'default' : 'ghost'}
                  onClick={() => navigate('/')}
                  className={`gap-2 ${location.pathname === '/' || location.pathname.includes('/counterparties') ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                >
                  <Building2 className="w-4 h-4" />
                  Контрагенты
                </Button>
                {isAuthenticated && permissions?.canManageUsers && (
                  <Button
                    variant={location.pathname.includes('/admin') ? 'default' : 'ghost'}
                    onClick={() => navigate('/admin')}
                    className={`gap-2 ${location.pathname.includes('/admin') ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                  >
                    <Users className="w-4 h-4" />
                    Администрирование
                  </Button>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="text-right">
                    <div className="text-sm text-foreground">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Выход
                  </Button>
                </>
              ) : (
                <Button onClick={handleLogin} className="gap-2 bg-destructive hover:bg-destructive/90">
                  <LogIn className="w-4 h-4" />
                  Вход
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}