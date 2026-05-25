import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNotification } from '../contexts/NotificationContext';
import authService from '../services/authService';
import NotificationCard from '../components/NotificationCard';

const HomeScreen = ({ navigation }) => {
  const {
    notificationsEnabled,
    loading,
    killNotifications,
    enableNotifications,
    sendTestNotification,
  } = useNotification();

  const [user, setUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleKillNotifications = () => {
    Alert.alert(
      'Kill Notifications',
      'Are you sure you want to disable all notifications? You can enable them again anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Kill Notifications',
          style: 'destructive',

        onPress: async () => {
  try {
    setActionLoading(true); // 👈 Show loading spinner during action
    const result = await killNotifications();
    if (result && result.success) {
      Alert.alert('Success', 'Notifications have been disabled');
    } else {
      Alert.alert('Error', result?.error || 'Failed to disable notifications');
    }
  } catch (err) { // 👈 Prevents app crash if network/permission fails
    Alert.alert('Error', 'Something went wrong');
  } finally {
    setActionLoading(false); // 👈 Hide loading spinner
  }
},
        },
      ]
    );
  };

  const handleEnableNotifications = () => {
    Alert.alert(
      'Enable Notifications',
      'Enable notifications to receive updates from the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enable',
          onPress: async () => {
            const result = await enableNotifications();
            if (result.success) {
              Alert.alert('Success', 'Notifications have been enabled');
            } else {
              Alert.alert('Error', 'Failed to enable notifications');
            }
          },
        },
      ]
    );
  };

const handleSendTestNotification = async () => { // 👈 Added async
  if (!notificationsEnabled) {
    Alert.alert(
      'Notifications Disabled',
      'Please enable notifications first before sending test notifications.'
    );
    return;
  }

  try {
    setActionLoading(true);
    // 👈 Added await here to handle the asynchronous native bridge call
    const result = await sendTestNotification(
      'Test Notification',
      'This is a test notification from Kill Notifications app!'
    );

    if (result && result.success) {
      Alert.alert('Success', 'Test notification sent!');
    } else {
      Alert.alert('Error', result?.error || 'Failed to send notification');
    }
  } catch (err) {
    Alert.alert('Error', 'An unexpected error occurred.');
  } finally {
    setActionLoading(false);
  }
};

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await authService.signOut();
            if (result.success) {
              navigation.replace('Login');
            } else {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>
              {user?.displayName || user?.email || 'User'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Notification Status</Text>
            <View style={[styles.statusBadge, notificationsEnabled ? styles.statusEnabled : styles.statusDisabled]}>
              <Text style={styles.statusBadgeText}>
                {notificationsEnabled ? 'ACTIVE' : 'KILLED'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.statusDescription}>
            {notificationsEnabled
              ? 'Notifications are currently enabled. You will receive all app notifications.'
              : 'Notifications have been killed. You will not receive any notifications until you enable them again.'}
          </Text>
        </View>

        <View style={styles.controlsCard}>
          <Text style={styles.sectionTitle}>Control Center</Text>
          
          {notificationsEnabled ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.killButton]}
              onPress={handleKillNotifications}
            >
              <Text style={styles.actionButtonText}>🔕 Kill All Notifications</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.enableButton]}
              onPress={handleEnableNotifications}
            >
              <Text style={styles.actionButtonText}>🔔 Enable Notifications</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.testButton]}
            onPress={handleSendTestNotification}
          >
            <Text style={styles.actionButtonText}>📱 Send Test Notification</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>What happens when you kill notifications?</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• No more annoying push notifications</Text>
            <Text style={styles.infoItem}>• Clean notification drawer</Text>
            <Text style={styles.infoItem}>• Zero interruptions from the app</Text>
            <Text style={styles.infoItem}>• You can re-enable anytime</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ff4444',
    borderRadius: 6,
  },
  signOutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusEnabled: {
    backgroundColor: '#4CAF50',
  },
  statusDisabled: {
    backgroundColor: '#f44336',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  controlsCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  killButton: {
    backgroundColor: '#f44336',
  },
  enableButton: {
    backgroundColor: '#4CAF50',
  },
  testButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoList: {
    marginTop: 10,
  },
  infoItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    lineHeight: 20,
  },
});

export default HomeScreen;