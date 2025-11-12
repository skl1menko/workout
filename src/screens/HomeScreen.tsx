/**
 * Экран главной страницы приложения
 */

import { FontSizes, FontWeights, Spacing } from '@/src/styles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout App</Text>
      <Text style={styles.subtitle}>Ready to start building!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: '#666',
  },
});
