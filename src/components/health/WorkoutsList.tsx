/**
 * Компонент отображения списка тренировок
 */

import { BorderRadius, ColorScheme, FontSizes, FontWeights, Spacing } from '@/src/styles';
import { Workout } from '@/src/types';
import { logger } from '@/src/utils';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface WorkoutsListProps {
  workouts: Workout[];
}

export const WorkoutsList: React.FC<WorkoutsListProps> = ({ workouts }) => {
  logger.debug('Rendering workouts', { count: workouts.length });

  if (workouts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>🏃‍♂️ No workouts recorded</Text>
      </View>
    );
  }

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatDistance = (meters?: number): string => {
    if (!meters || meters === 0) return '0 m';
    const km = meters / 1000;
    return km >= 1 ? `${km.toFixed(2)} km` : `${Math.round(meters)} m`;
  };

  const formatActivityName = (name: string): string => {
    // Преобразуем CamelCase в читаемый формат
    return name
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getWorkoutIcon = (activityName?: string): string => {
    if (!activityName) return '🏋️';
    const name = activityName.toLowerCase();
    if (name.includes('running') || name.includes('run')) return '🏃';
    if (name.includes('walking') || name.includes('walk')) return '🚶';
    if (name.includes('cycling') || name.includes('bike')) return '🚴';
    if (name.includes('swimming') || name.includes('swim')) return '🏊';
    if (name.includes('yoga')) return '🧘';
    if (name.includes('strength') || name.includes('weight')) return '💪';
    if (name.includes('hiking')) return '⛰️';
    if (name.includes('rowing')) return '🚣';
    if (name.includes('stair')) return '�';
    return '🏋️';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💪 Workouts</Text>
      <ScrollView 
        style={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {workouts.map((workout, index) => {
          // Вычисляем длительность
          const durationMinutes = workout.start && workout.end
            ? (new Date(workout.end).getTime() - new Date(workout.start).getTime()) / 1000 / 60
            : 0;
          
          // Форматируем длительность
          const hours = Math.floor(durationMinutes / 60);
          const mins = Math.round(durationMinutes % 60);
          const durationText = durationMinutes < 60 
            ? `${mins} min`
            : `${hours}h ${mins}m`;

          // Форматируем название
          const activityName = (workout.activityName || 'Workout')
            .replace(/([A-Z])/g, ' $1')
            .trim();

          // Форматируем дату
          const startDate = workout.start ? new Date(workout.start) : null;
          const dateText = startDate 
            ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '';
          const timeText = startDate
            ? startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : '';

          // Иконка
          const activityLower = (workout.activityName || '').toLowerCase();
          let icon = '🏋️';
          if (activityLower.includes('cycling') || activityLower.includes('bike')) icon = '🚴';
          else if (activityLower.includes('walking') || activityLower.includes('walk')) icon = '🚶';
          else if (activityLower.includes('running') || activityLower.includes('run')) icon = '🏃';
          else if (activityLower.includes('strength') || activityLower.includes('weight')) icon = '💪';
          else if (activityLower.includes('rowing')) icon = '🚣';
          else if (activityLower.includes('stair')) icon = '🪜';

          const caloriesText = String(Math.round(workout.calories || 0));
          const distanceKm = workout.distance ? (workout.distance / 1000).toFixed(2) : null;

          return (
            <View key={workout.id || String(index)} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutIcon}>{icon}</Text>
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{activityName}</Text>
                  <Text style={styles.workoutTime}>{dateText} • {timeText}</Text>
                </View>
              </View>
              <View style={styles.workoutStats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Duration</Text>
                  <Text style={styles.statValue}>{durationText}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Calories</Text>
                  <Text style={styles.statValue}>{caloriesText}</Text>
                </View>
                {distanceKm && Number(distanceKm) > 0 && (
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>{distanceKm} km</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    color: '#333',
  },
  list: {
    maxHeight: 400,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: ColorScheme.gray,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  workoutIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: '#333',
  },
  workoutTime: {
    fontSize: FontSizes.sm,
    color: ColorScheme.gray,
    marginTop: 2,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: Spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: ColorScheme.gray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: ColorScheme.primary,
  },
});
