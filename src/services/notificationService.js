import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_ENABLED_KEY = '@notifications_enabled';

class NotificationService {
  constructor() {
    this.configure();
    this.isEnabled = true;
    this.loadNotificationState();
  }

  configure() {
    PushNotification.configure({
      onRegister: function(token) {
        console.log('TOKEN:', token);
      },
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function(notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  }

  async loadNotificationState() {
    try {
      const savedState = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
      if (savedState !== null) {
        this.isEnabled = JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading notification state:', error);
    }
  }

  async killNotifications() {
    try {
      this.isEnabled = false;
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, JSON.stringify(false));
      PushNotification.setApplicationIconBadgeNumber(0);
      
      // Cancel all scheduled notifications
      PushNotification.cancelAllLocalNotifications();
      
      return { success: true, message: 'Notifications disabled' };
    } catch (error) {
      console.error('Error disabling notifications:', error);
      return { success: false, error: error.message };
    }
  }

  async enableNotifications() {
    try {
      this.isEnabled = true;
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, JSON.stringify(true));
      return { success: true, message: 'Notifications enabled' };
    } catch (error) {
      console.error('Error enabling notifications:', error);
      return { success: false, error: error.message };
    }
  }

  sendTestNotification(title, message) {
    if (!this.isEnabled) {
      console.log('Notifications are currently disabled');
      return { success: false, error: 'Notifications are disabled' };
    }

    PushNotification.localNotification({
      channelId: "default-channel-id",
      title: title || "Test Notification",
      message: message || "This is a test notification",
      playSound: true,
      soundName: "default",
      vibrate: true,
      vibration: 300,
      priority: "high",
      importance: "high",
    });

    return { success: true };
  }

  getNotificationStatus() {
    return this.isEnabled;
  }
  
}

export default new NotificationService();