# Backend Integration Guide

## 🚀 Быстрый старт

### 1. Запуск backend сервера

```bash
cd backend
npm install
npm run dev
```

Сервер запустится на `http://localhost:3001`

### 2. Проверка работоспособности

```bash
curl http://localhost:3001/api/health
```

## 📱 Использование в React Native приложении

### Автоматическая синхронизация

Добавьте в ваш главный компонент:

```typescript
import { useHealthData, useBackendSync } from './src/hooks';

export function HealthScreen() {
  const { healthData, loading, error } = useHealthData();
  
  // Автоматическая синхронизация с backend каждые 10 минут
  const { syncToBackend, checkConnection } = useBackendSync(healthData, true);

  // Ручная синхронизация
  const handleManualSync = async () => {
    await syncToBackend();
    alert('Данные синхронизированы!');
  };

  return (
    <View>
      {/* Ваш UI */}
      <Button title="Синхронизировать" onPress={handleManualSync} />
    </View>
  );
}
```

### Использование API напрямую

```typescript
import { backendAPI } from './src/services';

// Сохранить шаги
await backendAPI.saveSteps({
  date: '2024-01-15',
  count: 12000,
  distance: 8.5,
  calories: 420
});

// Получить данные за период
const steps = await backendAPI.getSteps('2024-01-01', '2024-01-31');

// Получить сводку за день
const summary = await backendAPI.getDailySummary('2024-01-15');
```

## 🔧 Конфигурация

### Изменение URL backend

Отредактируйте файл `src/constants/config.ts`:

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api'  // Development
  : 'https://your-api.com/api';  // Production
```

### Тестирование на физическом устройстве

Найдите IP адрес вашего компьютера:

```bash
# macOS
ipconfig getifaddr en0

# Windows
ipconfig
```

Обновите `config.ts`:

```typescript
export const API_BASE_URL = 'http://192.168.1.100:3001/api';
```

## 📊 Доступные данные

Backend сохраняет следующие типы данных:

- ✅ **Шаги** - количество, дистанция, калории
- ✅ **Пульс** - BPM по времени
- ✅ **Сон** - продолжительность, качество
- ✅ **Калории** - активные, пассивные, общие
- ✅ **Тренировки** - тип, продолжительность, калории, дистанция

## 🗄️ База данных

SQLite база данных создается автоматически в `backend/data/health.db`

### Просмотр данных

```bash
cd backend
sqlite3 data/health.db

# Примеры запросов
SELECT * FROM steps;
SELECT * FROM heart_rate WHERE date = '2024-01-15';
SELECT * FROM workouts ORDER BY date DESC LIMIT 10;
```

## 🔐 Безопасность

### Production настройки

Для production добавьте:

1. **Аутентификацию** (JWT tokens)
2. **Rate limiting**
3. **HTTPS**
4. **Валидацию данных**

Пример с JWT:

```typescript
// backend/src/middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## 📈 Мониторинг

### Логи

Логи сохраняются в консоли. Для production используйте:

- Winston
- Pino
- Morgan (уже установлен)

### Метрики

Добавьте endpoint для метрик:

```typescript
router.get('/metrics', async (req, res) => {
  const stats = {
    totalSteps: await dbService.get('SELECT COUNT(*) as count FROM steps'),
    totalWorkouts: await dbService.get('SELECT COUNT(*) as count FROM workouts'),
    // ... другие метрики
  };
  res.json(stats);
});
```

## 🐛 Отладка

### Проверка соединения

```typescript
import { backendAPI } from './src/services';

const checkBackend = async () => {
  try {
    const result = await backendAPI.healthCheck();
    console.log('Backend OK:', result);
  } catch (error) {
    console.error('Backend Error:', error);
  }
};
```

### Просмотр логов backend

```bash
cd backend
npm run dev  # Логи в консоли
```

## 📦 Экспорт данных

Экспорт данных в JSON:

```bash
cd backend
sqlite3 data/health.db ".mode json" ".output export.json" "SELECT * FROM steps;"
```

## 🚢 Деплой

### Heroku

```bash
cd backend
heroku create workout-api
git push heroku main
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

```bash
docker build -t workout-backend .
docker run -p 3001:3001 workout-backend
```

## 🔄 Обновления

### Добавление нового типа данных

1. Создайте таблицу в `backend/src/database.ts`
2. Добавьте контроллеры в `backend/src/controllers.ts`
3. Добавьте маршруты в `backend/src/routes.ts`
4. Добавьте методы в `src/services/backend-api.service.ts`

## 💡 Советы

- ✅ Синхронизируйте данные в фоне
- ✅ Обрабатывайте ошибки сети
- ✅ Кешируйте данные локально
- ✅ Используйте оптимистичные обновления
- ✅ Добавьте индикатор синхронизации в UI

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи backend
2. Проверьте логи React Native
3. Проверьте соединение с сетью
4. Проверьте URL в config.ts
