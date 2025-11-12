# Logger Utility

Simple and clear logging system for the application.

## Usage

```typescript
import { logger } from '@/src/utils';

// Information
logger.info('Loading data', { userId: 123 });

// Success
logger.success('Data saved', { count: 10 });

// Warning
logger.warn('Low battery');

// Error
logger.error('Connection error', error);

// Debug
logger.debug('Component state', { state });
```

## Features

- ✅ **Emoji prefixes** for quick visual identification of message types
- ✅ **Auto-disable** in production (`__DEV__`)
- ✅ **Data support** - pass any data as second parameter
- ✅ **Simple API** - five methods for all cases

## Log Types

| Method | Emoji | When to use |
|--------|-------|-------------|
| `info` | ℹ️ | General process information |
| `success` | ✅ | Successful operation completion |
| `warn` | ⚠️ | Warnings, non-critical issues |
| `error` | ❌ | Errors and exceptions |
| `debug` | 🔍 | Debug information |

## Project Examples

```typescript
// In services
logger.debug('Fetching workouts', workoutOptions);
logger.success('Workouts retrieved', { count: workoutsCount });
logger.error('RCTAppleHealthKit module not available');

// In hooks
logger.info('Requesting HealthKit permissions');
logger.success('Health data retrieved', {
  steps: data.steps,
  calories: data.calories,
  workouts: data.workouts.length,
});

// In components
logger.debug('Rendering workouts', { count: workouts.length });
```
