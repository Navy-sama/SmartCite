import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNotificationStore } from '../../store/notificationStore';

export default function NotificationsScreen() {
  const { notifications } = useNotificationStore();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Aucune notification reçue.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  notification: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  message: { fontSize: 16 },
  time: { fontSize: 12, color: '#666', marginTop: 5, fontStyle: 'italic' },
});
