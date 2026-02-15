import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { mockCounterparties } from '../data/mockData';
import { Counterparty } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, Filter, Download, Eye, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { rolePermissionsMap } from '../types';

const statusLabels = {
  active: 'Активен',
  inactive: 'Неактивен',
  blocked: 'Заблокирован',
};

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  blocked: 'bg-red-100 text-red-800 border-red-200',
};

const sokStatusLabels = {
  approved: 'Одобрено',
  rejected: 'Отклонено',
  manual_review: 'Требует проверки',
  null: 'Не отправлено',
};

const sokStatusColors = {
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  manual_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  null: 'bg-gray-100 text-gray-800 border-gray-200',
};

const typeLabels = {
  organization: 'Организация',
  individual: 'ИП',
};

export function CounterpartiesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const permissions = user ? rolePermissionsMap[user.role] : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [systemFilter, setSystemFilter] = useState<string>('all');
  const [sokStatusFilter, setSokStatusFilter] = useState<string>('all');

  const filteredCounterparties = useMemo(() => {
    return mockCounterparties.filter((cp) => {
      const matchesSearch =
        cp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cp.inn.includes(searchQuery) ||
        cp.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || cp.status === statusFilter;
      const matchesType = typeFilter === 'all' || cp.type === typeFilter;
      const matchesSystem = systemFilter === 'all' || cp.sourceSystem === systemFilter;
      const matchesSokStatus = sokStatusFilter === 'all' || String(cp.sokStatus) === sokStatusFilter;

      return matchesSearch && matchesStatus && matchesType && matchesSystem && matchesSokStatus;
    });
  }, [searchQuery, statusFilter, typeFilter, systemFilter, sokStatusFilter]);

  const handleExport = () => {
    // Mock export functionality
    const data = filteredCounterparties.map((cp) => ({
      Название: cp.name,
      ИНН: cp.inn,
      Тип: typeLabels[cp.type],
      Статус: statusLabels[cp.status],
      'Статус СОК': sokStatusLabels[String(cp.sokStatus) as keyof typeof sokStatusLabels],
      Телефон: cp.phone,
      Email: cp.email,
      'Источник данных': cp.sourceSystem,
    }));

    console.log('Экспорт данных:', data);
    alert('Данные экспортированы (см. консоль)');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setSystemFilter('all');
    setSokStatusFilter('all');
  };

  const handleCardClick = (id: string) => {
    if (isAuthenticated) {
      navigate(`/counterparties/${id}`);
    } else {
      navigate('/401');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary">Контрагенты</h1>
          <p className="text-muted-foreground mt-1">
            Всего записей: {filteredCounterparties.length} из {mockCounterparties.length}
          </p>
        </div>
        {isAuthenticated && permissions?.canExport && (
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Экспорт
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Фильтры и поиск</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по названию, ИНН, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="inactive">Неактивен</SelectItem>
                    <SelectItem value="blocked">Заблокирован</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="organization">Организация</SelectItem>
                    <SelectItem value="individual">ИП</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* System Filter */}
              <div>
                <Select value={systemFilter} onValueChange={setSystemFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Источник" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все источники</SelectItem>
                    <SelectItem value="1C">1C</SelectItem>
                    <SelectItem value="SAP">SAP</SelectItem>
                    <SelectItem value="СЭД">СЭД</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SOK Status Filter */}
              <div>
                <Select value={sokStatusFilter} onValueChange={setSokStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="СОК" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все СОК</SelectItem>
                    <SelectItem value="approved">Одобрено</SelectItem>
                    <SelectItem value="rejected">Отклонено</SelectItem>
                    <SelectItem value="manual_review">Требует проверки</SelectItem>
                    <SelectItem value="null">Не отправлено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || systemFilter !== 'all' || sokStatusFilter !== 'all') && (
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Counterparties List */}
      <div className="space-y-3">
        {filteredCounterparties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Контрагенты не найдены
            </CardContent>
          </Card>
        ) : (
          filteredCounterparties.map((counterparty) => (
            <Card
              key={counterparty.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick(counterparty.id)}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3 flex-wrap">
                      <h3 className="text-lg text-foreground">{counterparty.name}</h3>
                      <Badge variant="outline" className={statusColors[counterparty.status]}>
                        {statusLabels[counterparty.status]}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {typeLabels[counterparty.type]}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={sokStatusColors[String(counterparty.sokStatus) as keyof typeof sokStatusColors]}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {sokStatusLabels[String(counterparty.sokStatus) as keyof typeof sokStatusLabels]}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">ИНН: </span>
                        <span className="text-foreground">{counterparty.inn}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Телефон: </span>
                        <span className="text-foreground">{counterparty.phone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email: </span>
                        <span className="text-foreground">{counterparty.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Источник: </span>
                        <span className="text-foreground">{counterparty.sourceSystem}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="gap-2 shrink-0">
                    <Eye className="w-4 h-4" />
                    Просмотр
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}