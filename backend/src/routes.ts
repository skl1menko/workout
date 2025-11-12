import { Router } from 'express';
import {
  getSteps,
  createSteps,
  getHeartRate,
  createHeartRate,
  getSleep,
  createSleep,
  getCalories,
  createCalories,
  getWorkouts,
  createWorkout,
  getSummary,
} from './controllers';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Steps routes
router.get('/steps', getSteps);
router.post('/steps', createSteps);

// Heart rate routes
router.get('/heart-rate', getHeartRate);
router.post('/heart-rate', createHeartRate);

// Sleep routes
router.get('/sleep', getSleep);
router.post('/sleep', createSleep);

// Calories routes
router.get('/calories', getCalories);
router.post('/calories', createCalories);

// Workouts routes
router.get('/workouts', getWorkouts);
router.post('/workouts', createWorkout);

// Summary route
router.get('/summary', getSummary);

export default router;
