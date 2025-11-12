/**
 * Компонент запроса разрешений на доступ к Health данным
 */

import { Button } from '@/src/components/ui';
import { BorderRadius, FontSizes, Spacing } from '@/src/styles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PermissionRequestProps {
  onRequestPress: () => void;
}

export const PermissionRequest: React.FC<PermissionRequestProps> = ({ onRequestPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Health permissions required</Text>
      <Button title="Grant Permissions" onPress={onRequestPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: Spacing.xl,
    padding: Spacing.xl,
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  text: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
});
