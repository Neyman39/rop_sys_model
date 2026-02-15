import { useParams, useNavigate } from 'react-router';
import { mockCounterparties, mockActionHistory } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, History, Building2, User, Mail, Phone, MapPin, FileText, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
  manual_review: 'Требует ручной проверки',
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
  individual: 'Индивидуальный предприниматель',
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

export function CounterpartyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const counterparty = mockCounterparties.find((cp) => cp.id === id);
  const history = id ? mockActionHistory[id] || [] : [];

  if (!counterparty) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Контрагент не найден</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Вернуться к списку
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 -ml-2 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </Button>
          <h1 className="text-3xl text-primary">{counterparty.name}</h1>
          <div className="flex items-center gap-2 flex-wrap">
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
              СОК: {sokStatusLabels[String(counterparty.sokStatus) as keyof typeof sokStatusLabels]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Источник: {counterparty.sourceSystem}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Основная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">ИНН</label>
                  <p className="text-foreground mt-1">{counterparty.inn}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Тип</label>
                  <p className="text-foreground mt-1">{typeLabels[counterparty.type]}</p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Руководитель
                </label>
                <p className="text-foreground mt-1">{counterparty.director}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Контактная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Телефон
                </label>
                <p className="text-foreground mt-1">{counterparty.phone}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-foreground mt-1">{counterparty.email}</p>
              </div>

              <Separator />

              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Юридический адрес
                </label>
                <p className="text-foreground mt-1">{counterparty.legalAddress}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Фактический адрес
                </label>
                <p className="text-foreground mt-1">{counterparty.actualAddress}</p>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Системная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Источник данных</label>
                  <p className="text-foreground mt-1">{counterparty.sourceSystem}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Статус</label>
                  <p className="text-foreground mt-1">{statusLabels[counterparty.status]}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Дата создания</label>
                  <p className="text-foreground mt-1">
                    {format(new Date(counterparty.createdAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Последнее обновление</label>
                  <p className="text-foreground mt-1">
                    {format(new Date(counterparty.updatedAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                  </p>
                </div>
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
    </div>
  );
}