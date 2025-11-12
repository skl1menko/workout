import { API_BASE_URL } from '../constants/config';

export interface StepsData {
  date: string;
  count: number;
  distance?: number;
  calories?: number;
}

export interface HeartRateData {
  date: string;
  timestamp: string;
  bpm: number;
}

export interface SleepData {
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  quality?: string;
}

export interface CaloriesData {
  date: string;
  active_calories: number;
  resting_calories: number;
  total_calories: number;
}

export interface WorkoutData {
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  type: string;
  calories?: number;
  distance?: number;
}

class BackendAPI {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3001/api') {
    this.baseURL = baseURL;
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Steps endpoints
  async saveSteps(data: StepsData) {
    try {
      const response = await fetch(`${this.baseURL}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to save steps:', error);
      throw error;
    }
  }

  async getSteps(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const url = `${this.baseURL}/steps${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Failed to get steps:', error);
      throw error;
    }
  }

  // Heart rate endpoints
  async saveHeartRate(data: HeartRateData) {
    try {
      const response = await fetch(`${this.baseURL}/heart-rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to save heart rate:', error);
      throw error;
    }
  }

  async getHeartRate(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const url = `${this.baseURL}/heart-rate${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Failed to get heart rate:', error);
      throw error;
    }
  }

  // Sleep endpoints
  async saveSleep(data: SleepData) {
    try {
      const response = await fetch(`${this.baseURL}/sleep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to save sleep:', error);
      throw error;
    }
  }

  async getSleep(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const url = `${this.baseURL}/sleep${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Failed to get sleep:', error);
      throw error;
    }
  }

  // Calories endpoints
  async saveCalories(data: CaloriesData) {
    try {
      const response = await fetch(`${this.baseURL}/calories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to save calories:', error);
      throw error;
    }
  }

  async getCalories(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const url = `${this.baseURL}/calories${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Failed to get calories:', error);
      throw error;
    }
  }

  // Workouts endpoints
  async saveWorkout(data: WorkoutData) {
    try {
      const response = await fetch(`${this.baseURL}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to save workout:', error);
      throw error;
    }
  }

  async getWorkouts(startDate?: string, endDate?: string, type?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (type) params.append('type', type);
      
      const url = `${this.baseURL}/workouts${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Failed to get workouts:', error);
      throw error;
    }
  }

  // Summary endpoint
  async getDailySummary(date: string) {
    try {
      const response = await fetch(`${this.baseURL}/summary?date=${date}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get daily summary:', error);
      throw error;
    }
  }
}

export const backendAPI = new BackendAPI();
export default backendAPI;
