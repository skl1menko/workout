# Logging System Simplification

## What Changed

Created a simple and clear logging utility with emoji prefixes for quick visual identification of message types.

## New Structure

### Logger Utility
- **File**: `src/utils/logger.ts`
- **Export**: `src/utils/index.ts`

### API

```typescript
logger.info(message, data?)    // ℹ️ Information
logger.success(message, data?) // ✅ Success
logger.warn(message, data?)    // ⚠️ Warning
logger.error(message, error?)  // ❌ Error
logger.debug(message, data?)   // 🔍 Debug
```

## File Changes

### 1. `src/utils/logger.ts` (created)
Simple utility with five logging methods

### 2. `src/services/health.service.ts`
**Before:**
```typescript
console.warn('HealthKit is only available on iOS');
console.error('Native HealthKit module not available');
console.log('Available NativeModules:', Object.keys(NativeModules));
console.error('Error checking permissions:', err);
console.log('Auth status results:', results);
// ... and many other console.log
```

**After:**
```typescript
logger.warn('HealthKit is only available on iOS');
logger.error('HealthKit module not available');
logger.debug('Permissions status', { hasAnyPermission, results });
logger.info('Calories retrieved', { total, samples: results.length });
logger.success('Workouts retrieved', { count: workoutsCount });
```

### 3. `src/hooks/use-health-data.ts`
**Before:**
```typescript
console.log('Requesting HealthKit permissions...');
console.log('Fetching health data with options:', options);
console.log('Health data received:', {...});
console.error('Error in triggerFetch:', err);
```

**After:**
```typescript
logger.info('Requesting HealthKit permissions');
logger.debug('Fetching health data', { date: date.toLocaleDateString() });
logger.success('Health data retrieved', { steps, calories, workouts, ... });
logger.error('Failed to fetch health data', err.message);
```

### 4. `src/components/health/WorkoutsList.tsx`
**Before:**
```typescript
console.log('WorkoutsList received workouts:', workouts);
```

**After:**
```typescript
logger.debug('Rendering workouts', { count: workouts.length });
```

## Benefits of the New System

### ✅ Visual Identification
Emoji prefixes allow instant identification of message type:
- ℹ️ = information
- ✅ = successful operation
- ⚠️ = warning
- ❌ = error
- 🔍 = debug

### ✅ Clean Code
Shorter and clearer calls:
```typescript
// Before
console.log('Workouts received:', results?.length || 0);

// After
logger.success('Workouts retrieved', { count: workoutsCount });
```

### ✅ Structured Data
Objects instead of long strings:
```typescript
// Before
console.log('Permission details:', readPermissions.map(p => `${p}: ${results[p]}`));

// After
logger.debug('Permissions status', { hasAnyPermission, results });
```

### ✅ Auto-disable
Logs only work in development mode (`__DEV__`)

### ✅ English Messages
Clear English messages for better understanding

## Change Statistics

- **Created**: 3 files (logger.ts, logger.README.md, export)
- **Modified**: 4 files
- **Removed logs**: ~30 console.log/error/warn
- **Added logs**: 15+ structured logger calls

## How to Use

```typescript
import { logger } from '@/src/utils';

// In any project file
logger.info('Operation started');
logger.success('Operation completed', { result: data });
logger.error('An error occurred', error);
```

## Documentation

Full documentation available in `src/utils/logger.README.md`
