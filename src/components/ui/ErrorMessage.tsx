/**
 * Компонент для отображения сообщений об ошибках
 */

import { BorderRadius, FontSizes, Spacing } from '@/src/styles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚠️ {message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: '#fee',
    borderRadius: BorderRadius.md,
  },
  text: {
    color: '#c00',
    fontSize: FontSizes.sm,
  },
});
