/**
 * Компонент навигации по датам
 */

import { ColorScheme, FontSizes, FontWeights, Spacing } from '@/src/styles';
import { isToday as checkIsToday, formatDate } from '@/src/utils';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (days: number) => void;
  onResetToToday: () => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  onDateChange,
  onResetToToday,
}) => {
  const isToday = checkIsToday(selectedDate);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => onDateChange(-1)}>
        <Text style={styles.buttonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDate(selectedDate)}</Text>
        {!isToday && (
          <TouchableOpacity onPress={onResetToToday}>
            <Text style={styles.todayButton}>Today</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, isToday && styles.buttonDisabled]}
        onPress={() => onDateChange(1)}
        disabled={isToday}
      >
        <Text style={[styles.buttonText, isToday && styles.buttonTextDisabled]}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ColorScheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: ColorScheme.lightGray,
  },
  buttonText: {
    fontSize: FontSizes.xl,
    color: '#fff',
    fontWeight: FontWeights.bold,
  },
  buttonTextDisabled: {
    color: ColorScheme.gray,
  },
  dateContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  date: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: '#333',
  },
  todayButton: {
    fontSize: FontSizes.xs,
    color: ColorScheme.primary,
    marginTop: Spacing.xs,
    fontWeight: FontWeights.semibold,
  },
});
