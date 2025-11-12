/**
 * Простая утилита для логирования
 */

const isDevelopment = __DEV__;

export const logger = {
  /**
   * Информационное сообщение
   */
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`ℹ️ ${message}`, data !== undefined ? data : '');
    }
  },

  /**
   * Сообщение об успехе
   */
  success: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`✅ ${message}`, data !== undefined ? data : '');
    }
  },

  /**
   * Предупреждение
   */
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`⚠️ ${message}`, data !== undefined ? data : '');
    }
  },

  /**
   * Ошибка
   */
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`❌ ${message}`, error !== undefined ? error : '');
    }
  },

  /**
   * Отладочная информация
   */
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`🔍 ${message}`, data !== undefined ? data : '');
    }
  },
};
