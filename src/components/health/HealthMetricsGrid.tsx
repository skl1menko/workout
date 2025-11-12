/**
 * Компонент отображения карточек с метриками здоровья
 */

import { HealthCard } from '@/src/components/ui';
import { Spacing } from '@/src/styles';
import { HealthMetrics } from '@/src/types';
import { calculateAverageHeartRate, calculateTotalSleepHours, formatNumber } from '@/src/utils';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface HealthMetricsGridProps {
  metrics: HealthMetrics;
}

export const HealthMetricsGrid: React.FC<HealthMetricsGridProps> = ({ metrics }) => {
  const avgHeartRate = calculateAverageHeartRate(metrics.heartRate);
  const sleepHours = calculateTotalSleepHours(metrics.sleep);

  return (
    <View style={styles.container}>
      <HealthCard
        icon="👟"
        value={formatNumber(metrics.steps)}
        label="Steps"
      />
      <HealthCard
        icon="🔥"
        value={Math.round(metrics.calories)}
        label="Calories"
      />
      <HealthCard
        icon="❤️"
        value={avgHeartRate || '--'}
        label="Heart Rate (avg)"
      />
      <HealthCard
        icon="😴"
        value={sleepHours || '--'}
        label="Sleep (hours)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
  },
});
