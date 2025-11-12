/**
 * Экран панели здоровья
 * Отображает метрики здоровья из Apple Health
 */

import {
    Button,
    DateNavigator,
    ErrorMessage,
    HealthMetricsGrid,
    LoadingIndicator,
    PermissionRequest,
    WorkoutsList,
} from '@/src/components';
import { useHealthData } from '@/src/hooks';
import { ColorScheme, FontSizes, FontWeights, Spacing } from '@/src/styles';
import { addDays, formatTime } from '@/src/utils';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export const HealthScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const {
    steps,
    calories,
    heartRate,
    sleep,
    workouts,
    error,
    hasPermissions,
    dataTimestamp,
    onPress,
    refetch,
  } = useHealthData(selectedDate);

  // Автоматическая загрузка данных при монтировании
  useEffect(() => {
    onPress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Перезагрузка данных при изменении даты
  useEffect(() => {
    if (hasPermissions) {
      setIsLoading(true);
      refetch();
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleDateChange = (days: number) => {
    const newDate = addDays(selectedDate, days);
    // Не разрешаем выбирать будущие даты
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const handleResetToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Dashboard</Text>

        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onResetToToday={handleResetToToday}
        />
      </View>

      {error && <ErrorMessage message={error} />}

      {!hasPermissions && !error && (
        <PermissionRequest onRequestPress={onPress} />
      )}

      {hasPermissions && (
        <>
          {isLoading && <LoadingIndicator />}

          <HealthMetricsGrid
            metrics={{ steps, calories, heartRate, sleep, workouts }}
          />

          <WorkoutsList workouts={workouts} />

          <Button
            title="🔄 Refresh Data"
            onPress={refetch}
            style={styles.refreshButton}
          />

          {dataTimestamp && (
            <Text style={styles.timestamp}>
              Last updated: {formatTime(new Date(dataTimestamp))}
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorScheme.lightGray,
  },
  header: {
    padding: Spacing.xl,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.lg,
  },
  refreshButton: {
    margin: Spacing.xl,
  },
  timestamp: {
    textAlign: 'center',
    color: ColorScheme.gray,
    fontSize: FontSizes.xs,
    marginBottom: Spacing.xl,
  },
});
