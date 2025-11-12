#!/bin/bash

# Тестирование API
echo "🧪 Testing Workout Health Data API..."
echo ""

BASE_URL="http://localhost:3001/api"

# 1. Health check
echo "1️⃣ Health check..."
curl -s $BASE_URL/health | jq '.'
echo ""
echo ""

# 2. Сохранение шагов
echo "2️⃣ Saving steps data..."
curl -s -X POST $BASE_URL/steps \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "count": 12000,
    "distance": 8.5,
    "calories": 420
  }' | jq '.'
echo ""
echo ""

# 3. Получение шагов
echo "3️⃣ Getting steps data..."
curl -s "$BASE_URL/steps" | jq '.'
echo ""
echo ""

# 4. Сохранение пульса
echo "4️⃣ Saving heart rate data..."
curl -s -X POST $BASE_URL/heart-rate \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "timestamp": "2024-01-15T10:30:00Z",
    "bpm": 75
  }' | jq '.'
echo ""
echo ""

# 5. Сохранение калорий
echo "5️⃣ Saving calories data..."
curl -s -X POST $BASE_URL/calories \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "active_calories": 650,
    "resting_calories": 1450,
    "total_calories": 2100
  }' | jq '.'
echo ""
echo ""

# 6. Сохранение сна
echo "6️⃣ Saving sleep data..."
curl -s -X POST $BASE_URL/sleep \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "start_time": "2024-01-14T23:00:00Z",
    "end_time": "2024-01-15T07:00:00Z",
    "duration_minutes": 480,
    "quality": "good"
  }' | jq '.'
echo ""
echo ""

# 7. Сохранение тренировки
echo "7️⃣ Saving workout data..."
curl -s -X POST $BASE_URL/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "start_time": "2024-01-15T08:00:00Z",
    "end_time": "2024-01-15T09:00:00Z",
    "duration_minutes": 60,
    "type": "running",
    "calories": 450,
    "distance": 10.5
  }' | jq '.'
echo ""
echo ""

# 8. Получение сводки
echo "8️⃣ Getting daily summary..."
curl -s "$BASE_URL/summary?date=2024-01-15" | jq '.'
echo ""
echo ""

echo "✅ Tests completed!"
