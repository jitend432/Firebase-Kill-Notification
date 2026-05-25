import React, { createContext, useState, useEffect, useContext } from 'react';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationStatus();
  }, []);

  const loadNotificationStatus = async () => {
    try {
      const status = notificationService.getNotificationStatus();
      setNotificationsEnabled(status);
    } catch (error) {
      console.error('Error loading notification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const killNotifications = async () => {
    setLoading(true);
    const result = await notificationService.killNotifications();
    if (result.success) {
      setNotificationsEnabled(false);
    }
    setLoading(false);
    return result;
  };

  const enableNotifications = async () => {
    setLoading(true);
    const result = await notificationService.enableNotifications();
    if (result.success) {
      setNotificationsEnabled(true);
    }
    setLoading(false);
    return result;
  };

  const sendTestNotification = (title, message) => {
    return notificationService.sendTestNotification(title, message);
  };

  const value = {
    notificationsEnabled,
    loading,
    killNotifications,
    enableNotifications,
    sendTestNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};