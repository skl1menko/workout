/**
 * Переиспользуемый компонент карточки для отображения метрик
 */

import { BorderRadius, FontSizes, FontWeights, Spacing } from '@/src/styles';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface HealthCardProps {
  icon: string;
  value: string | number;
  label: string;
  style?: ViewStyle;
}

export const HealthCard: React.FC<HealthCardProps> = ({ icon, value, label, style }) => {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    margin: '1.5%',
    padding: Spacing.xl,
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  value: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: '#333',
  },
  label: {
    fontSize: FontSizes.sm,
    color: '#666',
    marginTop: Spacing.xs,
  },
});
