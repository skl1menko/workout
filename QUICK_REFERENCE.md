# 📋 Краткая справка по структуре проекта

## 🗂️ Где что находится

| Что нужно | Где искать |
|-----------|-----------|
| UI компоненты (Button, Card) | `src/components/ui/` |
| Экраны | `src/screens/` |
| Логика работы с API | `src/services/` |
| Хуки | `src/hooks/` |
| TypeScript типы | `src/types/` |
| Цвета, шрифты, отступы | `src/styles/` |
| Вспомогательные функции | `src/utils/` |

## 🎨 Использование стилей

```typescript
import { ColorScheme, Spacing, FontSizes, BorderRadius } from '@/src/styles';

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorScheme.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  text: {
    fontSize: FontSizes.md,
  },
});
```

## 🧩 Создание нового компонента

1. Создайте файл в `src/components/ui/` или `src/components/[feature]/`
2. Используйте TypeScript типы
3. Добавьте экспорт в `index.ts`

```typescript
// src/components/ui/MyComponent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSizes } from '@/src/styles';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.lg,
  },
});
```

```typescript
// src/components/ui/index.ts
export { MyComponent } from './MyComponent';
```

## 🎯 Создание нового экрана

1. Создайте файл в `src/screens/`
2. Используйте существующие компоненты
3. Добавьте в роутинг

```typescript
// src/screens/MyScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/src/components';

export const MyScreen: React.FC = () => {
  return (
    <View>
      <Text>My Screen</Text>
      <Button title="Click me" onPress={() => {}} />
    </View>
  );
};
```

## 🔧 Создание сервиса

1. Создайте файл в `src/services/`
2. Экспортируйте функции
3. Добавьте в `index.ts`

```typescript
// src/services/my-service.ts
export const fetchData = async (): Promise<any> => {
  // логика
};

export const postData = async (data: any): Promise<void> => {
  // логика
};
```

## 🪝 Создание хука

1. Создайте файл в `src/hooks/`
2. Префикс `use-`
3. Экспортируйте через `index.ts`

```typescript
// src/hooks/use-my-hook.ts
import { useState } from 'react';

export const useMyHook = () => {
  const [data, setData] = useState(null);
  
  const fetchData = async () => {
    // логика
  };
  
  return { data, fetchData };
};
```

## 📦 Импорты

```typescript
// ✅ Правильно - короткие импорты
import { Button, HealthCard } from '@/src/components';
import { ColorScheme, Spacing } from '@/src/styles';
import { useHealthData } from '@/src/hooks';

// ❌ Неправильно - длинные пути
import { Button } from '@/src/components/ui/Button';
import { ColorScheme } from '@/src/styles/colors';
```

## 🎨 Дизайн-система

### Цвета
```typescript
ColorScheme.primary    // #007AFF
ColorScheme.secondary  // #5856D6
ColorScheme.success    // #34C759
ColorScheme.warning    // #FF9500
ColorScheme.error      // #FF3B30
ColorScheme.gray       // #8E8E93
```

### Отступы
```typescript
Spacing.xs    // 4
Spacing.sm    // 8
Spacing.md    // 12
Spacing.lg    // 16
Spacing.xl    // 20
Spacing.xxl   // 24
Spacing.xxxl  // 32
```

### Размеры шрифта
```typescript
FontSizes.xs    // 12
FontSizes.sm    // 14
FontSizes.md    // 16
FontSizes.lg    // 18
FontSizes.xl    // 24
FontSizes.xxl   // 28
FontSizes.xxxl  // 32
```

### Радиусы скругления
```typescript
BorderRadius.sm    // 8
BorderRadius.md    // 10
BorderRadius.lg    // 15
BorderRadius.xl    // 20
BorderRadius.round // 999
```

## 🚀 Команды

```bash
# Запуск проекта
npm start

# Линтер
npm run lint

# iOS
npm run ios

# Android
npm run android
```

## 📝 Соглашения

- **Компоненты**: PascalCase (`MyComponent.tsx`)
- **Утилиты**: kebab-case (`my-utils.ts`)
- **Хуки**: kebab-case с префиксом `use-` (`use-my-hook.ts`)
- **Константы**: SCREAMING_SNAKE_CASE
- **Переменные**: camelCase
