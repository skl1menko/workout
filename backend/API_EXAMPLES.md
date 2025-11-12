# Примеры использования API

## 1. Проверка здоровья сервера
```bash
curl http://localhost:3001/api/health
```

Ответ:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 2. Сохранение данных о шагах
```bash
curl -X POST http://localhost:3001/api/steps \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "count": 12000,
    "distance": 8.5,
    "calories": 420
  }'
```

## 3. Получение данных о шагах
```bash
# Все записи
curl http://localhost:3001/api/steps

# За период
curl "http://localhost:3001/api/steps?startDate=2024-01-01&endDate=2024-01-31"
```

## 4. Сохранение данных о пульсе
```bash
curl -X POST http://localhost:3001/api/heart-rate \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "timestamp": "2024-01-15T10:30:00Z",
    "bpm": 75
  }'
```

## 5. Сохранение данных о сне
```bash
curl -X POST http://localhost:3001/api/sleep \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "start_time": "2024-01-14T23:00:00Z",
    "end_time": "2024-01-15T07:00:00Z",
    "duration_minutes": 480,
    "quality": "good"
  }'
```

## 6. Сохранение данных о калориях
```bash
curl -X POST http://localhost:3001/api/calories \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "active_calories": 650,
    "resting_calories": 1450,
    "total_calories": 2100
  }'
```

## 7. Сохранение тренировки
```bash
curl -X POST http://localhost:3001/api/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "start_time": "2024-01-15T08:00:00Z",
    "end_time": "2024-01-15T09:00:00Z",
    "duration_minutes": 60,
    "type": "running",
    "calories": 450,
    "distance": 10.5
  }'
```

## 8. Получение сводки за день
```bash
curl "http://localhost:3001/api/summary?date=2024-01-15"
```

Ответ:
```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "steps": {
      "id": 1,
      "date": "2024-01-15",
      "count": 12000,
      "distance": 8.5,
      "calories": 420
    },
    "calories": {
      "id": 1,
      "date": "2024-01-15",
      "active_calories": 650,
      "resting_calories": 1450,
      "total_calories": 2100
    },
    "sleep": {
      "id": 1,
      "date": "2024-01-15",
      "start_time": "2024-01-14T23:00:00Z",
      "end_time": "2024-01-15T07:00:00Z",
      "duration_minutes": 480,
      "quality": "good"
    },
    "workouts": [
      {
        "id": 1,
        "date": "2024-01-15",
        "type": "running",
        "duration_minutes": 60,
        "calories": 450,
        "distance": 10.5
      }
    ],
    "heartRate": {
      "avg_bpm": 72.5,
      "min_bpm": 65,
      "max_bpm": 85
    }
  }
}
```

## Использование в React Native

```javascript
// services/api.ts
const API_BASE_URL = 'http://localhost:3001/api';

export const healthAPI = {
  // Сохранить шаги
  async saveSteps(data: { date: string; count: number; distance?: number; calories?: number }) {
    const response = await fetch(`${API_BASE_URL}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Получить шаги
  async getSteps(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await fetch(`${API_BASE_URL}/steps?${params}`);
    return response.json();
  },

  // Сохранить пульс
  async saveHeartRate(data: { date: string; timestamp: string; bpm: number }) {
    const response = await fetch(`${API_BASE_URL}/heart-rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Получить сводку за день
  async getDailySummary(date: string) {
    const response = await fetch(`${API_BASE_URL}/summary?date=${date}`);
    return response.json();
  },

  // Сохранить тренировку
  async saveWorkout(data: {
    date: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    type: string;
    calories?: number;
    distance?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Пример использования в компоненте
export async function syncHealthDataToBackend(healthData: any) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Сохраняем шаги
    if (healthData.steps) {
      await healthAPI.saveSteps({
        date: today,
        count: healthData.steps.count,
        distance: healthData.steps.distance,
        calories: healthData.steps.calories,
      });
    }

    // Сохраняем пульс
    if (healthData.heartRate && healthData.heartRate.length > 0) {
      for (const hr of healthData.heartRate) {
        await healthAPI.saveHeartRate({
          date: today,
          timestamp: hr.timestamp,
          bpm: hr.value,
        });
      }
    }

    console.log('Health data synced successfully');
  } catch (error) {
    console.error('Failed to sync health data:', error);
  }
}
```

## Автоматическая синхронизация

```javascript
// Добавьте в ваше приложение
import { useEffect } from 'react';

export function useHealthDataSync() {
  useEffect(() => {
    // Синхронизация каждые 5 минут
    const interval = setInterval(() => {
      syncHealthDataToBackend(currentHealthData);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}
```
