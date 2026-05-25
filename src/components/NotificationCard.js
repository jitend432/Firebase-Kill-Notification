import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const NotificationCard = ({ item, onPress }) => {
  const { title, body, timestamp, isUnread } = item;

  return (
    <TouchableOpacity 
      style={[styles.card, isUnread && styles.unreadCard]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        {isUnread && <View style={styles.dot} />}
        
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, isUnread && styles.unreadTitle]} numberOfLines={1}>
              {title || 'Notification'}
            </Text>
            <Text style={styles.timestamp}>{timestamp || 'Just now'}</Text>
          </View>
          
          <Text style={styles.body} numberOfLines={2}>
            {body || 'No details provided.'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#F4F8FF', // Light blue tint for unread notifications
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4', // Highlight color
    paddingLeft: 12, // Offset for the border width
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4285F4',
    marginTop: 6,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  timestamp: {
    fontSize: 12,
    color: '#888888',
  },
  body: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});