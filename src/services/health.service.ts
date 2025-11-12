/**
 * Сервис для работы с Apple HealthKit
 * Инкапсулирует всю логику взаимодействия с нативным модулем
 */

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
    console.warn('HealthKit is only available on iOS');
    return false;
  }
  if (!RCTAppleHealthKit) {
    console.error('Native HealthKit module not available');
    console.log('Available NativeModules:', Object.keys(NativeModules));
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
          console.error('Error checking permissions:', err);
          reject(new Error(`Error checking permissions: ${err}`));
          return;
        }

        console.log('Auth status results:', results);

        const readPermissions = permissions.permissions.read;
        
        // Проверяем, что хотя бы одно разрешение выдано
        // 0 = NotDetermined, 1 = SharingDenied, 2 = SharingAuthorized
        const hasAnyPermission = readPermissions.some(
          (perm) => results[perm] === 2
        );

        console.log('Has any permission:', hasAnyPermission);
        console.log('Permission details:', readPermissions.map(p => `${p}: ${results[p]}`));

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
        console.log('Active calories:', total);
        console.log('Calories samples count:', results.length);
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

    console.log('Fetching workouts with options:', workoutOptions);
    console.log('Available RCTAppleHealthKit methods:', Object.keys(RCTAppleHealthKit || {}));

    // Используем нативный метод напрямую
    if (!RCTAppleHealthKit) {
      console.error('RCTAppleHealthKit module not available');
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
    
    console.log('Available workout method:', availableMethod);

    if (availableMethod === 'getSamples') {
      const requestOptions = {
        ...workoutOptions,
        type: 'Workout',
        limit: 100,
      };
      console.log('Requesting workouts with:', JSON.stringify(requestOptions, null, 2));
      
      RCTAppleHealthKit.getSamples(
        requestOptions,
        (err: any, results: any[]) => {
          if (err) {
            console.error('Error fetching workouts:', err);
            resolve([]);
            return;
          }
          console.log('Workouts received:', results?.length || 0);
          if (results && results.length > 0) {
            console.log('First workout sample:', JSON.stringify(results[0], null, 2));
            console.log('Last workout sample:', JSON.stringify(results[results.length - 1], null, 2));
          } else {
            console.log('No workouts found for this period');
          }
          resolve(results || []);
        }
      );
    } else {
      console.error('No suitable method found for fetching workouts');
      console.log('Please check react-native-health documentation');
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
