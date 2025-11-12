/**
 * Типы данных для здоровья и фитнеса
 */

export interface HealthValue {
  value: number;
  startDate: string;
  endDate: string;
}

export interface Workout {
  id?: string;
  activityName?: string;
  activityId?: number;
  calories?: number;
  duration?: number;
  start?: string;
  end?: string;
  distance?: number;
  device?: string;
  sourceName?: string;
  sourceId?: string;
  tracked?: boolean;
  metadata?: any;
}

export interface HealthMetrics {
  steps: number;
  calories: number;
  heartRate: HealthValue[];
  sleep: HealthValue[];
  workouts: Workout[];
}

export interface HealthDataHookResult extends HealthMetrics {
  error: string | null;
  hasPermissions: boolean;
  success: boolean;
  dataTimestamp: string | null;
  onPress: () => void;
  refetch: () => void;
}

export interface HealthCardData {
  icon: string;
  value: string | number;
  label: string;
}
