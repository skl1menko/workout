/**
 * Утилиты для работы с данными о здоровье
 */

import { HealthValue } from '@/src/types';

/**
 * Вычисляет средний сердечный ритм из массива замеров
 */
export const calculateAverageHeartRate = (heartRate: HealthValue[]): number => {
  if (heartRate.length === 0) return 0;
  
  const sum = heartRate.reduce((acc, hr) => acc + hr.value, 0);
  return Math.round(sum / heartRate.length);
};

/**
 * Вычисляет общее время сна в часах
 */
export const calculateTotalSleepHours = (sleep: HealthValue[]): string => {
  const totalMinutes = sleep.reduce((sum, s) => {
    const start = new Date(s.startDate).getTime();
    const end = new Date(s.endDate).getTime();
    return sum + (end - start) / 1000 / 60;
  }, 0);
  
  return (totalMinutes / 60).toFixed(1);
};

/**
 * Форматирует большие числа для отображения
 */
export const formatNumber = (num: number): string => {
  return Math.round(num).toLocaleString();
};
