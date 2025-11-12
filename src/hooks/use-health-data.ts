/**
 * Хук для работы с данными о здоровье из HealthKit
 */

import {
    getAllHealthData,
    isHealthKitAvailable,
    requestPermissions
} from '@/src/services';
import { HealthDataHookResult, HealthValue, Workout } from '@/src/types';
import { getEndOfDay, getStartOfDay } from '@/src/utils';
import { useState } from 'react';
import { HealthInputOptions } from 'react-native-health';

export const useHealthData = (date: Date): HealthDataHookResult => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState<HealthValue[]>([]);
  const [sleep, setSleep] = useState<HealthValue[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dataTimestamp, setDataTimestamp] = useState<string | null>(null);

  /**
   * Проверяет и запрашивает разрешения, затем загружает данные
   */
  const triggerFetch = async () => {
    setSuccess(false);
    setError(null);

    // Проверяем доступность HealthKit
    if (!isHealthKitAvailable()) {
      setError('HealthKit is not available on this device');
      return;
    }

    try {
      // Сначала пытаемся запросить разрешения
      console.log('Requesting HealthKit permissions...');
      await requestPermissions();
      
      // После показа диалога считаем что разрешения есть
      // iOS не даёт точно узнать выбор пользователя по соображениям приватности
      setHasPermissions(true);
      
      // Небольшая задержка для применения разрешений
      await new Promise(resolve => setTimeout(resolve, 500));

      // Формируем опции для запроса данных
      const options: HealthInputOptions = {
        date: date.toISOString(),
        startDate: getStartOfDay(date).toISOString(),
        endDate: getEndOfDay(date).toISOString(),
      };

      console.log('Fetching health data with options:', options);

      // Загружаем все данные
      const data = await getAllHealthData(options);

      console.log('Health data received:', {
        steps: data.steps,
        calories: data.calories,
        heartRateCount: data.heartRate.length,
        sleepCount: data.sleep.length,
        workoutsCount: data.workouts.length,
      });

      setSteps(data.steps);
      setCalories(data.calories);
      setHeartRate(data.heartRate);
      setSleep(data.sleep);
      setWorkouts(data.workouts);
      setSuccess(true);
      setDataTimestamp(new Date().toISOString());
    } catch (err: any) {
      console.error('Error in triggerFetch:', err);
      setError(err.message || 'Failed to fetch health data');
    }
  };

  return {
    steps,
    calories,
    heartRate,
    sleep,
    workouts,
    error,
    hasPermissions,
    success,
    dataTimestamp,
    onPress: triggerFetch,
    refetch: triggerFetch,
  };
};
