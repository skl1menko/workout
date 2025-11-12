import { Request, Response } from 'express';
import dbService from './database';

// Steps Controllers
export const getSteps = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM steps';
    const params: any[] = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE date >= ?';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC';

    const steps = await dbService.all(query, params);
    res.json({ success: true, data: steps });
  } catch (error) {
    console.error('Error getting steps:', error);
    res.status(500).json({ success: false, error: 'Failed to get steps' });
  }
};

export const createSteps = async (req: Request, res: Response) => {
  try {
    const { date, count, distance, calories } = req.body;

    if (!date || count === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Date and count are required' 
      });
    }

    // Проверяем, есть ли уже запись за этот день
    const existing = await dbService.get(
      'SELECT id FROM steps WHERE date = ?',
      [date]
    );

    if (existing) {
      // Обновляем существующую запись
      await dbService.run(
        `UPDATE steps 
         SET count = ?, distance = ?, calories = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE date = ?`,
        [count, distance, calories, date]
      );
    } else {
      // Создаем новую запись
      await dbService.run(
        'INSERT INTO steps (date, count, distance, calories) VALUES (?, ?, ?, ?)',
        [date, count, distance, calories]
      );
    }

    res.json({ success: true, message: 'Steps saved successfully' });
  } catch (error) {
    console.error('Error creating steps:', error);
    res.status(500).json({ success: false, error: 'Failed to save steps' });
  }
};

// Heart Rate Controllers
export const getHeartRate = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM heart_rate';
    const params: any[] = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY timestamp DESC';

    const heartRate = await dbService.all(query, params);
    res.json({ success: true, data: heartRate });
  } catch (error) {
    console.error('Error getting heart rate:', error);
    res.status(500).json({ success: false, error: 'Failed to get heart rate' });
  }
};

export const createHeartRate = async (req: Request, res: Response) => {
  try {
    const { date, timestamp, bpm } = req.body;

    if (!date || !timestamp || !bpm) {
      return res.status(400).json({ 
        success: false, 
        error: 'Date, timestamp, and bpm are required' 
      });
    }

    await dbService.run(
      'INSERT INTO heart_rate (date, timestamp, bpm) VALUES (?, ?, ?)',
      [date, timestamp, bpm]
    );

    res.json({ success: true, message: 'Heart rate saved successfully' });
  } catch (error) {
    console.error('Error creating heart rate:', error);
    res.status(500).json({ success: false, error: 'Failed to save heart rate' });
  }
};

// Sleep Controllers
export const getSleep = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM sleep';
    const params: any[] = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY date DESC';

    const sleep = await dbService.all(query, params);
    res.json({ success: true, data: sleep });
  } catch (error) {
    console.error('Error getting sleep:', error);
    res.status(500).json({ success: false, error: 'Failed to get sleep' });
  }
};

export const createSleep = async (req: Request, res: Response) => {
  try {
    const { date, start_time, end_time, duration_minutes, quality } = req.body;

    if (!date || !start_time || !end_time || duration_minutes === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Date, start_time, end_time, and duration_minutes are required' 
      });
    }

    await dbService.run(
      'INSERT INTO sleep (date, start_time, end_time, duration_minutes, quality) VALUES (?, ?, ?, ?, ?)',
      [date, start_time, end_time, duration_minutes, quality]
    );

    res.json({ success: true, message: 'Sleep saved successfully' });
  } catch (error) {
    console.error('Error creating sleep:', error);
    res.status(500).json({ success: false, error: 'Failed to save sleep' });
  }
};

// Calories Controllers
export const getCalories = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM calories';
    const params: any[] = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY date DESC';

    const calories = await dbService.all(query, params);
    res.json({ success: true, data: calories });
  } catch (error) {
    console.error('Error getting calories:', error);
    res.status(500).json({ success: false, error: 'Failed to get calories' });
  }
};

export const createCalories = async (req: Request, res: Response) => {
  try {
    const { date, active_calories, resting_calories, total_calories } = req.body;

    if (!date || active_calories === undefined || resting_calories === undefined || total_calories === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Date, active_calories, resting_calories, and total_calories are required' 
      });
    }

    const existing = await dbService.get(
      'SELECT id FROM calories WHERE date = ?',
      [date]
    );

    if (existing) {
      await dbService.run(
        `UPDATE calories 
         SET active_calories = ?, resting_calories = ?, total_calories = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE date = ?`,
        [active_calories, resting_calories, total_calories, date]
      );
    } else {
      await dbService.run(
        'INSERT INTO calories (date, active_calories, resting_calories, total_calories) VALUES (?, ?, ?, ?)',
        [date, active_calories, resting_calories, total_calories]
      );
    }

    res.json({ success: true, message: 'Calories saved successfully' });
  } catch (error) {
    console.error('Error creating calories:', error);
    res.status(500).json({ success: false, error: 'Failed to save calories' });
  }
};

// Workouts Controllers
export const getWorkouts = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    let query = 'SELECT * FROM workouts WHERE 1=1';
    const params: any[] = [];

    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY date DESC';

    const workouts = await dbService.all(query, params);
    res.json({ success: true, data: workouts });
  } catch (error) {
    console.error('Error getting workouts:', error);
    res.status(500).json({ success: false, error: 'Failed to get workouts' });
  }
};

export const createWorkout = async (req: Request, res: Response) => {
  try {
    const { date, start_time, end_time, duration_minutes, type, calories, distance } = req.body;

    if (!date || !start_time || !end_time || duration_minutes === undefined || !type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Date, start_time, end_time, duration_minutes, and type are required' 
      });
    }

    await dbService.run(
      'INSERT INTO workouts (date, start_time, end_time, duration_minutes, type, calories, distance) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [date, start_time, end_time, duration_minutes, type, calories, distance]
    );

    res.json({ success: true, message: 'Workout saved successfully' });
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ success: false, error: 'Failed to save workout' });
  }
};

// Dashboard/Summary endpoint
export const getSummary = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const steps = await dbService.get('SELECT * FROM steps WHERE date = ?', [targetDate]);
    const calories = await dbService.get('SELECT * FROM calories WHERE date = ?', [targetDate]);
    const sleep = await dbService.get('SELECT * FROM sleep WHERE date = ?', [targetDate]);
    const workouts = await dbService.all('SELECT * FROM workouts WHERE date = ?', [targetDate]);
    
    const heartRateData = await dbService.all(
      'SELECT AVG(bpm) as avg_bpm, MIN(bpm) as min_bpm, MAX(bpm) as max_bpm FROM heart_rate WHERE date = ?',
      [targetDate]
    );

    res.json({
      success: true,
      data: {
        date: targetDate,
        steps: steps || null,
        calories: calories || null,
        sleep: sleep || null,
        workouts: workouts || [],
        heartRate: heartRateData[0] || null,
      }
    });
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({ success: false, error: 'Failed to get summary' });
  }
};
