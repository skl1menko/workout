# 🏗️ Архитектура проекта Workout App

```
workout/
│
├── 📱 app/                          # Expo Router (навигация)
│   ├── _layout.tsx                  # Корневой layout
│   └── (tabs)/                      # Табы навигации
│       ├── _layout.tsx              # Layout табов
│       ├── index.tsx                # → импортирует HomeScreen
│       └── health.tsx               # → импортирует HealthScreen
│
├── 🎨 src/                          # Исходный код приложения
│   │
│   ├── 🧩 components/               # Компоненты
│   │   ├── ui/                      # Переиспользуемые UI компоненты
│   │   │   ├── Button.tsx           # Универсальная кнопка
│   │   │   ├── HealthCard.tsx       # Карточка метрики
│   │   │   ├── DateNavigator.tsx    # Навигация по датам
│   │   │   ├── ErrorMessage.tsx     # Сообщение об ошибке
│   │   │   ├── LoadingIndicator.tsx # Индикатор загрузки
│   │   │   └── index.ts             # Экспорты
│   │   │
│   │   ├── health/                  # Компоненты здоровья
│   │   │   ├── PermissionRequest.tsx    # Запрос разрешений
│   │   │   ├── HealthMetricsGrid.tsx    # Сетка метрик
│   │   │   └── index.ts                 # Экспорты
│   │   │
│   │   └── index.ts                 # Центральный экспорт компонентов
│   │
│   ├── 📺 screens/                  # Экраны приложения
│   │   ├── HomeScreen.tsx           # Главный экран
│   │   ├── HealthScreen.tsx         # Экран здоровья
│   │   └── index.ts                 # Экспорты
│   │
│   ├── 🔧 services/                 # Бизнес-логика и API
│   │   ├── health.service.ts        # Работа с HealthKit
│   │   └── index.ts                 # Экспорты
│   │
│   ├── 🪝 hooks/                    # Кастомные React хуки
│   │   ├── use-health-data.ts       # Хук для данных здоровья
│   │   └── index.ts                 # Экспорты
│   │
│   ├── 📝 types/                    # TypeScript типы
│   │   ├── health.types.ts          # Типы для здоровья
│   │   └── index.ts                 # Экспорты
│   │
│   ├── 🎨 styles/                   # Дизайн-система
│   │   ├── colors.ts                # Цветовая палитра
│   │   ├── typography.ts            # Шрифты и размеры
│   │   ├── spacing.ts               # Отступы и радиусы
│   │   └── index.ts                 # Экспорты
│   │
│   ├── 🛠️ utils/                    # Вспомогательные функции
│   │   ├── date.utils.ts            # Работа с датами
│   │   ├── health.utils.ts          # Расчёты метрик
│   │   └── index.ts                 # Экспорты
│   │
│   ├── index.ts                     # Главный экспорт src/
│   └── README.md                    # Документация структуры
│
├── 📦 assets/                       # Статические ресурсы
│   └── images/                      # Изображения
│
├── 🍎 ios/                          # iOS нативный код
│   └── workout/
│
├── 🤖 android/                      # Android нативный код
│   └── app/
│
├── 📄 Документация
│   ├── README.md                    # Основная документация
│   ├── REFACTORING.md              # Описание рефакторинга
│   └── QUICK_REFERENCE.md          # Быстрая справка
│
└── ⚙️ Конфигурация
    ├── package.json                 # Зависимости
    ├── tsconfig.json               # TypeScript конфиг
    ├── app.json                    # Expo конфиг
    └── eslint.config.js            # ESLint конфиг
```

## 🔄 Поток данных

```
┌─────────────────────────────────────────────────────────┐
│                        App Flow                          │
└─────────────────────────────────────────────────────────┘

User Interaction
      ↓
┌──────────────┐
│   Screens    │  (HomeScreen, HealthScreen)
└──────┬───────┘
       ↓
┌──────────────┐
│  Components  │  (Button, HealthCard, DateNavigator)
└──────┬───────┘
       ↓
┌──────────────┐
│    Hooks     │  (useHealthData)
└──────┬───────┘
       ↓
┌──────────────┐
│   Services   │  (health.service.ts)
└──────┬───────┘
       ↓
┌──────────────┐
│  HealthKit   │  (Native iOS API)
└──────────────┘
```

## 🎯 Принципы архитектуры

### 1. **Single Responsibility**
Каждый модуль отвечает за одну задачу:
- `services/` - только API взаимодействие
- `components/` - только UI
- `utils/` - только вспомогательные функции

### 2. **Separation of Concerns**
```
UI Layer (components)
    ↓
Logic Layer (hooks)
    ↓
Service Layer (services)
    ↓
API Layer (HealthKit)
```

### 3. **DRY (Don't Repeat Yourself)**
- Переиспользуемые компоненты в `components/ui/`
- Общие утилиты в `utils/`
- Централизованные стили в `styles/`

### 4. **Модульность**
Каждая папка - это модуль с:
- Собственным `index.ts` для экспорта
- Независимыми компонентами
- Минимальными зависимостями

### 5. **Типобезопасность**
- Все компоненты типизированы
- Централизованные типы в `types/`
- Интерфейсы для всех props

## 📊 Статистика проекта

- **Экраны**: 2 (Home, Health)
- **UI Компоненты**: 5 (Button, HealthCard, DateNavigator, ErrorMessage, LoadingIndicator)
- **Специализированные компоненты**: 2 (PermissionRequest, HealthMetricsGrid)
- **Сервисы**: 1 (health.service)
- **Хуки**: 1 (useHealthData)
- **Утилиты**: 2 файла (date, health)
- **Стили**: 3 файла (colors, typography, spacing)

## 🚀 Готово к расширению

Структура позволяет легко добавить:
- ✅ Новые экраны (в `screens/`)
- ✅ Новые фичи (новая папка в `components/`)
- ✅ Новые метрики (расширить `health.service`)
- ✅ Графики и аналитику
- ✅ Профиль пользователя
- ✅ Тренировки и упражнения
- ✅ Темы оформления
