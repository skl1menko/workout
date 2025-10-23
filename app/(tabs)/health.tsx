import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import useHealthData from '@/hooks/use-health-data';

export default function HealthScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { 
    steps, 
    calories, 
    heartRate, 
    sleep, 
    error, 
    hasPermissions, 
    success, 
    dataTimestamp,
    onPress,
    refetch 
  } = useHealthData(selectedDate);

  // Auto-fetch data on mount
  useEffect(() => {
    onPress();
  }, []);

  // Refetch when date changes
  useEffect(() => {
    if (hasPermissions) {
      setIsLoading(true);
      refetch();
      // Reset loading after a short delay
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [selectedDate]);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    // Don't allow future dates
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const resetToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // Calculate average heart rate
  const avgHeartRate = heartRate.length > 0
    ? Math.round(heartRate.reduce((sum, hr) => sum + hr.value, 0) / heartRate.length)
    : 0;

  // Calculate total sleep hours
  const totalSleepMinutes = sleep.reduce((sum, s) => {
    const start = new Date(s.startDate).getTime();
    const end = new Date(s.endDate).getTime();
    return sum + (end - start) / 1000 / 60;
  }, 0);
  const sleepHours = (totalSleepMinutes / 60).toFixed(1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Dashboard</Text>
        
        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => changeDate(-1)}
          >
            <Text style={styles.dateButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.dateContainer}>
            <Text style={styles.date}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            {!isToday && (
              <TouchableOpacity onPress={resetToToday}>
                <Text style={styles.todayButton}>Today</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.dateButton, isToday && styles.dateButtonDisabled]} 
            onPress={() => changeDate(1)}
            disabled={isToday}
          >
            <Text style={[styles.dateButtonText, isToday && styles.dateButtonTextDisabled]}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {!hasPermissions && !error && (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Health permissions required
          </Text>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Grant Permissions</Text>
          </TouchableOpacity>
        </View>
      )}

      {hasPermissions && (
        <>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          )}
          
          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Text style={styles.cardIcon}>👟</Text>
              <Text style={styles.cardValue}>{steps.toLocaleString()}</Text>
              <Text style={styles.cardLabel}>Steps</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardIcon}>🔥</Text>
              <Text style={styles.cardValue}>{Math.round(calories)}</Text>
              <Text style={styles.cardLabel}>Calories</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardIcon}>❤️</Text>
              <Text style={styles.cardValue}>{avgHeartRate || '--'}</Text>
              <Text style={styles.cardLabel}>Heart Rate (avg)</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardIcon}>😴</Text>
              <Text style={styles.cardValue}>{sleepHours || '--'}</Text>
              <Text style={styles.cardLabel}>Sleep (hours)</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.refreshButton} onPress={refetch}>
            <Text style={styles.refreshButtonText}>🔄 Refresh Data</Text>
          </TouchableOpacity>

          {dataTimestamp && (
            <Text style={styles.timestamp}>
              Last updated: {new Date(dataTimestamp).toLocaleTimeString()}
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  dateButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  dateButtonTextDisabled: {
    color: '#999',
  },
  dateContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  todayButton: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '600',
  },
  loadingOverlay: {
    padding: 10,
    alignItems: 'center',
  },
  errorContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fee',
    borderRadius: 10,
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
  },
  permissionContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  card: {
    width: '47%',
    margin: '1.5%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  refreshButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 20,
  },
});
