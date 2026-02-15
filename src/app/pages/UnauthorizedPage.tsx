import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { ShieldAlert, Home, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function UnauthorizedPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl text-destructive">401</h1>
          <h2 className="text-2xl text-foreground">Доступ запрещен</h2>
          <p className="text-muted-foreground">
            {isAuthenticated 
              ? 'У вас недостаточно прав для доступа к этой странице. Обратитесь к администратору системы.'
              : 'Для просмотра детальной информации необходимо войти в систему.'
            }
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          {!isAuthenticated && (
            <Button onClick={() => navigate('/login')} className="gap-2 bg-destructive hover:bg-destructive/90">
              <LogIn className="w-4 h-4" />
              Войти
            </Button>
          )}
          <Button onClick={() => navigate('/')} variant={isAuthenticated ? 'default' : 'outline'} className={`gap-2 ${isAuthenticated ? 'bg-destructive hover:bg-destructive/90' : ''}`}>
            <Home className="w-4 h-4" />
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
}