import { useEffect, useCallback, useRef } from 'react';
import backendAPI from '../services/backend-api.service';
import { logger } from '../utils/logger';

interface HealthData {
  steps?: {
    count: number;
    distance?: number;
    calories?: number;
  };
  heartRate?: Array<{
    timestamp: string;
    value: number;
  }>;
  sleep?: {
    start_time: string;
    end_time: string;
    duration_minutes: number;
    quality?: string;
  };
  calories?: {
    active: number;
    resting: number;
    total: number;
  };
  workouts?: Array<{
    start_time: string;
    end_time: string;
    duration_minutes: number;
    type: string;
    calories?: number;
    distance?: number;
  }>;
}

export function useBackendSync(healthData: HealthData | null, enabled: boolean = true) {
  const lastSyncRef = useRef<number>(0);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const syncToBackend = useCallback(async () => {
    if (!healthData || !enabled) {
      return;
    }

    const now = Date.now();
    const SYNC_COOLDOWN = 5 * 60 * 1000; // 5 минут

    // Проверка cooldown
    if (now - lastSyncRef.current < SYNC_COOLDOWN) {
      logger.info('BackendSync', 'Skipping sync - cooldown period');
      return;
    }

    try {
      logger.info('BackendSync', 'Starting health data sync...');
      const today = new Date().toISOString().split('T')[0];

      // Синхронизация шагов
      if (healthData.steps) {
        await backendAPI.saveSteps({
          date: today,
          count: healthData.steps.count,
          distance: healthData.steps.distance,
          calories: healthData.steps.calories,
        });
        logger.info('BackendSync', 'Steps synced successfully');
      }

      // Синхронизация пульса
      if (healthData.heartRate && healthData.heartRate.length > 0) {
        // Синхронизируем только последние 10 измерений
        const recentHeartRate = healthData.heartRate.slice(-10);
        for (const hr of recentHeartRate) {
          await backendAPI.saveHeartRate({
            date: today,
            timestamp: hr.timestamp,
            bpm: hr.value,
          });
        }
        logger.info('BackendSync', `${recentHeartRate.length} heart rate measurements synced`);
      }

      // Синхронизация сна
      if (healthData.sleep) {
        await backendAPI.saveSleep({
          date: today,
          start_time: healthData.sleep.start_time,
          end_time: healthData.sleep.end_time,
          duration_minutes: healthData.sleep.duration_minutes,
          quality: healthData.sleep.quality,
        });
        logger.info('BackendSync', 'Sleep data synced successfully');
      }

      // Синхронизация калорий
      if (healthData.calories) {
        await backendAPI.saveCalories({
          date: today,
          active_calories: healthData.calories.active,
          resting_calories: healthData.calories.resting,
          total_calories: healthData.calories.total,
        });
        logger.info('BackendSync', 'Calories synced successfully');
      }

      // Синхронизация тренировок
      if (healthData.workouts && healthData.workouts.length > 0) {
        for (const workout of healthData.workouts) {
          await backendAPI.saveWorkout({
            date: today,
            start_time: workout.start_time,
            end_time: workout.end_time,
            duration_minutes: workout.duration_minutes,
            type: workout.type,
            calories: workout.calories,
            distance: workout.distance,
          });
        }
        logger.info('BackendSync', `${healthData.workouts.length} workouts synced`);
      }

      lastSyncRef.current = now;
      logger.success('BackendSync', 'All health data synced successfully');
    } catch (error) {
      logger.error('BackendSync', 'Failed to sync health data', error);
    }
  }, [healthData, enabled]);

  // Проверка подключения к backend
  const checkConnection = useCallback(async () => {
    try {
      const result = await backendAPI.healthCheck();
      logger.info('BackendSync', 'Backend connection OK', result);
      return true;
    } catch (error) {
      logger.error('BackendSync', 'Backend connection failed', error);
      return false;
    }
  }, []);

  // Автоматическая синхронизация
  useEffect(() => {
    if (!enabled) {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      return;
    }

    // Проверяем подключение при монтировании
    checkConnection();

    // Синхронизация каждые 10 минут
    syncIntervalRef.current = setInterval(() => {
      syncToBackend();
    }, 10 * 60 * 1000);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [enabled, syncToBackend, checkConnection]);

  return {
    syncToBackend,
    checkConnection,
    lastSync: lastSyncRef.current,
  };
}
