/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import { NotificationProvider } from './src/contexts/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import authService from './src/services/authService';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

// Create default channel for Android
PushNotification.createChannel(
  {
    channelId: "default-channel-id",
    channelName: "Default Channel",
    channelDescription: "A default channel for notifications",
    playSound: true,
    soundName: "default",
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`createChannel returned '${created}'`)
);

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // --- Start of FCM and Permission Integration ---
    const checkAndRequestPermission = async () => {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Android Notification Permission Granted');
            getFCMToken();
          } else {
            console.log('Android Notification Permission Denied');
          }
        } else {
          getFCMToken();
        }
      }
    };

    const getFCMToken = async () => {
      try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        if (token) {
          console.log('\n========= ANDROID FCM TOKEN =========\n');
          console.log(token);
          console.log('\n==========================================\n');
        } else {
          console.log('Failed to get FCM token: Token is null');
        }
      } catch (error) {
        console.log('Error fetching FCM token:', error);
      }
    };

    checkAndRequestPermission();
    // --- End of FCM and Permission Integration ---
    const subscriber = authService.onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return subscriber;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <NotificationProvider>
      <AppNavigator />
    </NotificationProvider>
  );
};

export default App;