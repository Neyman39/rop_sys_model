import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { mockUsersData, mockUserHistory } from '../data/mockData';
import { AuthUser, UserRole } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ArrowLeft, Edit, Trash2, History, User, Mail, Shield, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

const roleLabels = {
  admin: 'Администратор',
  user: 'Пользователь',
};

const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  user: 'bg-blue-100 text-blue-800 border-blue-200',
};

const rolePermissionsText = {
  admin: 'Полный доступ: просмотр, экспорт, управление пользователями, отправка в СОК',
  user: 'Ограниченный доступ: просмотр и экспорт данных об организациях',
};

const actionLabels = {
  created: 'Создание',
  updated: 'Обновление',
  sent_to_sok: 'Отправка в СОК',
  status_changed: 'Изменение статуса',
};

const actionColors = {
  created: 'bg-blue-50 text-blue-700 border-blue-200',
  updated: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  sent_to_sok: 'bg-purple-50 text-purple-700 border-purple-200',
  status_changed: 'bg-orange-50 text-orange-700 border-orange-200',
};

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [targetUser, setTargetUser] = useState<AuthUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('user');

  const history = id ? mockUserHistory[id] || [] : [];

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/401');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const user = mockUsersData.find((u) => u.id === id);
    if (user) {
      setTargetUser(user);
      setEditName(user.name);
      setEditEmail(user.email);
      setEditPassword(user.password);
      setEditRole(user.role);
    }
  }, [id]);

  if (!targetUser) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Пользователь не найден</p>
        <Button onClick={() => navigate('/admin')} className="mt-4">
          Вернуться к списку
        </Button>
      </div>
    );
  }

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setEditPassword(password);
  };

  const handleSaveChanges = () => {
    if (!editEmail || !editPassword) {
      toast.error('Заполните все поля');
      return;
    }

    setTargetUser({
      ...targetUser,
      name: editName,
      email: editEmail,
      password: editPassword,
      role: editRole,
    });

    setIsEditDialogOpen(false);
    toast.success('И��менения сохранены', {
      description: `Пользователь: ${editEmail}`,
    });
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
    navigate('/admin');
    toast.success('Пользователь удален');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="gap-2 -ml-2 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Назад к администрированию
          </Button>
          <h1 className="text-3xl text-primary">{targetUser.name}</h1>
          <p className="text-muted-foreground">{targetUser.email}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={roleColors[targetUser.role]}>
              {roleLabels[targetUser.role]}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsEditDialogOpen(true)} variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Редактировать
          </Button>
          {targetUser.id !== currentUser?.id && (
            <Button onClick={() => setIsDeleteDialogOpen(true)} variant="outline" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
              Удалить
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Информация о пользователе
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  ФИО
                </label>
                <p className="text-foreground mt-1">{targetUser.name}</p>
              </div>

              <Separator />

              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-foreground mt-1">{targetUser.email}</p>
              </div>

              <Separator />

              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Роль и права доступа
                </label>
                <div className="mt-2 space-y-2">
                  <Badge variant="outline" className={roleColors[targetUser.role]}>
                    {roleLabels[targetUser.role]}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{rolePermissionsText[targetUser.role]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Системная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Дата регистрации</label>
                <p className="text-foreground mt-1">
                  {format(new Date(targetUser.createdAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                </p>
              </div>

              {targetUser.lastLogin && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm text-muted-foreground">Последний вход в систему</label>
                    <p className="text-foreground mt-1">
                      {format(new Date(targetUser.lastLogin), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <label className="text-sm text-muted-foreground">ID пользователя</label>
                <p className="text-foreground mt-1 font-mono text-sm">{targetUser.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                История действий
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  История действий пуста
                </p>
              ) : (
                <div className="space-y-4">
                  {history
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((item, index) => (
                      <div key={item.id} className="relative">
                        {index !== history.length - 1 && (
                          <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-border" />
                        )}
                        <div className="flex gap-3">
                          <div className="w-4 h-4 rounded-full bg-primary shrink-0 mt-1" />
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between gap-2">
                              <Badge variant="outline" className={`text-xs ${actionColors[item.action]}`}>
                                {actionLabels[item.action]}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground mt-2">{item.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(item.timestamp), 'dd MMM yyyy, HH:mm', { locale: ru })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактирование пользователя</DialogTitle>
            <DialogDescription>Измените данные учетной записи пользователя</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">ФИО</Label>
              <Input
                id="edit-name"
                type="text"
                placeholder="Иванов Иван Иванович"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="user@registry.ru"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Пароль</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-password"
                  type="text"
                  placeholder="Пароль"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={generatePassword} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Сгенерировать
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Роль</Label>
              <Select value={editRole} onValueChange={(value) => setEditRole(value as UserRole)}>
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Пользователь</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{rolePermissionsText[editRole]}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveChanges}>Сохранить изменения</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление пользователя</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить пользователя <strong>{targetUser.email}</strong>? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}