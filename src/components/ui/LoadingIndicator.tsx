/**
 * Компонент индикатора загрузки
 */

import { ColorScheme, Spacing } from '@/src/styles';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'small' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={ColorScheme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    alignItems: 'center',
  },
});
