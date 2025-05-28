import { FlatList, StyleSheet, Text, View } from 'react-native';
import SignalementCard from '../../components/SignalementCard';
import { useSignalementStore } from '../../store/signalementStore';

export default function ReportsScreen() {
  const { signalements } = useSignalementStore();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mes Signalements</Text>

      <FlatList
        data={signalements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SignalementCard signalement={item} />}
        ListEmptyComponent={<Text>Aucun signalement pour l’instant.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
});
