/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  // Manually display the notification using your push notification channel
  PushNotification.localNotification({
    channelId: "default-channel-id", // Must match your channel ID in App.js
    title: remoteMessage.notification?.title || remoteMessage.data?.title || "New Notification",
    message: remoteMessage.notification?.body || remoteMessage.data?.body || "",
    playSound: true,
    soundName: "default",
  });
});

AppRegistry.registerComponent(appName, () => App);
