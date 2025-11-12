// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api'  // Development
  : 'https://your-production-api.com/api'; // Production

// Для тестирования на физическом устройстве используйте IP адрес вашего компьютера:
// export const API_BASE_URL = 'http://192.168.1.100:3001/api';
