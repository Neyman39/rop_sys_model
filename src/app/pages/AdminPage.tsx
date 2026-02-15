import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { mockUsersData } from '../data/mockData';
import { AuthUser, UserRole } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Eye, UserPlus, RefreshCw, Trash2, Edit, Search, X } from 'lucide-react';
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
  admin: 'Полный доступ ко всем функциям системы',
  user: 'Просмотр и экспорт данных об организациях',
};

export function AdminPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>(mockUsersData);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Create user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('user');

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/401');
    }
  }, [currentUser, navigate]);

  // Filter users based on search and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const generateEmail = () => {
    const randomNum = Math.floor(Math.random() * 10000);
    setNewUserEmail(`user${randomNum}@registry.ru`);
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewUserPassword(password);
  };

  const handleCreateUser = () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    const newUser: AuthUser = {
      id: String(users.length + 1),
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('user');
    toast.success('Пользователь успешно создан', {
      description: `${newUser.name} (${newUser.email})`,
    });
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    setUsers(users.filter((u) => u.id !== userToDelete));
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
    toast.success('Пользователь ��дален');
  };

  const openDeleteDialog = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary">Администрирование</h1>
          <p className="text-muted-foreground mt-1">Управление пользователями системы</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Создать пользователя
        </Button>
      </div>

      {/* Role Permissions Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className={roleColors.admin}>
                Администратор
              </Badge>
              <p className="text-sm text-foreground flex-1">{rolePermissionsText.admin}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className={roleColors.user}>
                Пользователь
              </Badge>
              <p className="text-sm text-foreground flex-1">{rolePermissionsText.user}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-primary">Пользователи ({filteredUsers.length})</h2>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm mb-2 block">Поиск</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Поиск по ФИО или email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <Label htmlFor="roleFilter" className="text-sm mb-2 block">Фильтр по роли</Label>
                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as 'all' | UserRole)}>
                  <SelectTrigger id="roleFilter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все роли</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="user">Пользователь</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || roleFilter !== 'all') && (
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="gap-2">
                    <X className="w-4 h-4" />
                    Сбросить
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Пользователи не найдены</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Сбросить фильтры
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg text-foreground">{user.name}</h3>
                      <Badge variant="outline" className={roleColors[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email: </span>
                        <span className="text-foreground">{user.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Создан: </span>
                        <span className="text-foreground">
                          {format(new Date(user.createdAt), 'dd.MM.yyyy', { locale: ru })}
                        </span>
                      </div>
                      {user.lastLogin && (
                        <div>
                          <span className="text-muted-foreground">Последний вход: </span>
                          <span className="text-foreground">
                            {format(new Date(user.lastLogin), 'dd.MM.yyyy HH:mm', { locale: ru })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Просмотр
                    </Button>
                    {user.id !== currentUser?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(user.id)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Удалить
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Создание нового пользователя</DialogTitle>
            <DialogDescription>Заполните данные для создания учетной записи</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО</Label>
              <Input
                id="name"
                type="text"
                placeholder="Иванов Иван Иванович"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="user@registry.ru"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={generateEmail} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Генерировать
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  placeholder="Пароль"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={generatePassword} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Генерировать
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Роль</Label>
              <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Пользователь</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{rolePermissionsText[newUserRole]}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateUser}>Создать пользователя</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление пользователя</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}