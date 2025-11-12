/**
 * Сервис для работы с Apple HealthKit
 * Инкапсулирует всю логику взаимодействия с нативным модулем
 */

import { logger } from '@/src/utils';
import { NativeModules, Platform } from 'react-native';
import AppleHealthKit, {
    HealthInputOptions,
    HealthKitPermissions,
    HealthValue,
} from 'react-native-health';

const RCTAppleHealthKit = NativeModules.RCTAppleHealthKit;

// Permissions mapping
const PERMISSIONS = AppleHealthKit.Constants?.Permissions ?? {
  ActiveEnergyBurned: 'ActiveEnergyBurned',
  Steps: 'Steps',
  HeartRate: 'HeartRate',
  SleepAnalysis: 'SleepAnalysis',
  Workout: 'Workout',
};

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      PERMISSIONS.ActiveEnergyBurned,
      PERMISSIONS.Steps,
      PERMISSIONS.HeartRate,
      PERMISSIONS.SleepAnalysis,
      PERMISSIONS.Workout,
    ],
    write: [],
  },
};

/**
 * Проверяет доступность HealthKit на устройстве
 */
export const isHealthKitAvailable = (): boolean => {
  if (Platform.OS !== 'ios') {
    logger.warn('HealthKit is only available on iOS');
    return false;
  }
  if (!RCTAppleHealthKit) {
    logger.error('HealthKit module not available');
    return false;
  }
  return true;
};

/**
 * Проверяет статус разрешений HealthKit
 */
export const checkPermissions = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!isHealthKitAvailable()) {
      reject(new Error('HealthKit not available'));
      return;
    }

    RCTAppleHealthKit.getAuthStatus(
      permissions,
      (err: string, results: any) => {
        if (err) {
          logger.error('Permission check failed', err);
          reject(new Error(`Error checking permissions: ${err}`));
          return;
        }

        const readPermissions = permissions.permissions.read;
        
        // Проверяем, что хотя бы одно разрешение выдано
        // 0 = NotDetermined, 1 = SharingDenied, 2 = SharingAuthorized
        const hasAnyPermission = readPermissions.some(
          (perm) => results[perm] === 2
        );

        logger.debug('Permissions status', { hasAnyPermission, results });

        // Считаем, что разрешения есть, если хотя бы одно выдано
        resolve(hasAnyPermission);
      }
    );
  });
};

/**
 * Запрашивает разрешения на доступ к HealthKit
 */
export const requestPermissions = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isHealthKitAvailable()) {
      reject(new Error('HealthKit not available'));
      return;
    }

    RCTAppleHealthKit.initHealthKit(permissions, (err: string) => {
      if (err) {
        reject(new Error(`Error initializing HealthKit: ${err}`));
        return;
      }
      resolve();
    });
  });
};

/**
 * Получает количество шагов за указанный период
 */
export const getSteps = (options: HealthInputOptions): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!isHealthKitAvailable()) {
      reject(new Error('HealthKit not available'));
      return;
    }

    RCTAppleHealthKit.getStepCount(options, (err: any, results: any) => {
      if (err) {
        reject(new Error(`Error fetching steps: ${err}`));
        return;
      }
      resolve(results.value);
    });
  });
};

/**
 * Получает количество сожженных калорий за указанный период
 */
export const getCalories = (options: HealthInputOptions): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!isHealthKitAvailable()) {
      reject(new Error('HealthKit not available'));
      return;
    }

    RCTAppleHealthKit.getActiveEnergyBurned(
      options,
      (err: any, results: any[]) => {
        if (err) {
          reject(new Error(`Error fetching calories: ${err}`));
          return;
        }
        const total = results.reduce((sum, sample) => sum + sample.value, 0);
        logger.info('Calories retrieved', { total, samples: results.length });
        resolve(total);
      }
    );
  });
};

/**
 * Получает замеры сердечного ритма за указанный период
 */
export const getHeartRate = (
  options: HealthInputOptions
): Promise<HealthValue[]> => {
  return new Promise((resolve, reject) => {
    if (!isHealthKitAvailable()) {
      reject(new Error('HealthKit not available'));
      return;
    }

    RCTAppleHealthKit.getHeartRateSamples(
      options,
      (err: any, results: HealthValue[]) => {
        if (err) {
          reject(new Error(`Error fetching heart rate: ${err}`));
          return;
        }
        resolve(results);
      }
    );
  });
};

/**
 * Получает данные о сне за указанный период
 */
export const getSleep = (
  options: HealthInputOptions
): Promise<HealthValue[]> => {
  return new Promise((resolve, reject) => {
    if (!isHealthKitAvailable()) {
      reject(new Error('HealthKit not available'));
      return;
    }

    RCTAppleHealthKit.getSleepSamples(
      options,
      (err: any, results: HealthValue[]) => {
        if (err) {
          reject(new Error(`Error fetching sleep: ${err}`));
          return;
        }
        resolve(results);
      }
    );
  });
};

/**
 * Получает тренировки за указанный период
 */
export const getWorkouts = (options: HealthInputOptions): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!isHealthKitAvailable()) {
      reject(new Error('HealthKit not available'));
      return;
    }

    // Используем переданные опции для запроса тренировок за выбранный день
    const workoutOptions = {
      startDate: options.startDate,
      endDate: options.endDate || new Date().toISOString(),
    };

    logger.debug('Fetching workouts', workoutOptions);

    // Используем нативный метод напрямую
    if (!RCTAppleHealthKit) {
      logger.error('RCTAppleHealthKit module not available');
      resolve([]);
      return;
    }

    // Пробуем разные варианты методов
    const possibleMethods = [
      'getSamples',
      'getWorkoutSamples', 
      'getWorkout',
      'queryWorkoutSamples'
    ];

    const availableMethod = possibleMethods.find(method => typeof RCTAppleHealthKit[method] === 'function');
    
    if (!availableMethod) {
      logger.error('Workout fetch method not found');
      resolve([]);
      return;
    }

    logger.debug('Using method', availableMethod);

    if (availableMethod === 'getSamples') {
      const requestOptions = {
        ...workoutOptions,
        type: 'Workout',
        limit: 100,
      };
      
      RCTAppleHealthKit.getSamples(
        requestOptions,
        (err: any, results: any[]) => {
          if (err) {
            logger.error('Failed to fetch workouts', err);
            resolve([]);
            return;
          }
          
          const workoutsCount = results?.length || 0;
          if (workoutsCount > 0) {
            logger.success('Workouts retrieved', { count: workoutsCount });
          } else {
            logger.info('No workouts found for this period');
          }
          
          resolve(results || []);
        }
      );
    } else {
      logger.error('getSamples method not available');
      resolve([]);
    }
  });
};

/**
 * Получает все данные о здоровье за указанный период
 */
export const getAllHealthData = async (options: HealthInputOptions) => {
  try {
    const [steps, calories, heartRate, sleep, workouts] = await Promise.all([
      getSteps(options),
      getCalories(options),
      getHeartRate(options),
      getSleep(options),
      getWorkouts(options),
    ]);

    return {
      steps,
      calories,
      heartRate,
      sleep,
      workouts,
    };
  } catch (error) {
    throw error;
  }
};
