import HeaderComponent from '@/components/HeaderComponent';
import { useSignalementStore } from '@/store/signalementStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  const stats = {
    total: 32,
    attente: 10,
    enCours: 12,
    resolu: 10,
  };

  const router = useRouter();
  const { signalements } = useSignalementStore();
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState<'ville' | 'categorie'>('ville');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const filtered = signalements.filter((s) =>
    (searchBy === 'ville' ? s.location : s.categorie)
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  

  return (
    <View style={{ flex: 1 }}>
      {/* MODAL DE FILTRE */}
      <Modal
        transparent
        animationType="slide"
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrer par</Text>
            <TouchableOpacity onPress={() => { setSearchBy('ville'); setFilterModalVisible(false); }}>
              <Text style={styles.modalOption}>Ville</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSearchBy('categorie'); setFilterModalVisible(false); }}>
              <Text style={styles.modalOption}>Catégorie</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <FlatList
        style={{ backgroundColor: '#fff' }}
        ListHeaderComponent={
      <HeaderComponent
        stats={stats}
        search={search}
        setSearch={setSearch}
        searchBy={searchBy}
        setFilterModalVisible={setFilterModalVisible}
        resultCount={filtered.length}
      />
    }

        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Image source={{ uri: item.photo }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <View style={styles.cardRow}>
                  <View style={[styles.dot, { backgroundColor: getStatusColor(item.statut) }]} />
                  <Text style={styles.cardTitle}>{item.categorie}</Text>
                </View>
                <Text style={styles.cardLocation}>
                  <Ionicons name="location-sharp" size={14} /> {item.location}
                </Text>
                <Text style={styles.cardStatut}>Statut : {item.statut}</Text>
              </View>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() =>
                  router.push({
                    pathname: '/detail/[id]',
                    params: {
                      id: item.id.toString(),
                      readonly: 'true', 
                    },
                  })
                }
              >
  <Ionicons name="information-circle-outline" size={24} color="#555" />
</TouchableOpacity>

            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
      />
    </View>
  );
}

function getStatusColor(statut: string) {
  if (statut === 'en attente') return 'orange';
  if (statut === 'en cours') return '#007bff';
  return 'green';
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.cardStat, { backgroundColor: color }]}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStat: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardStat: {
    width: '47%',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#000',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 6,
  },
  resultCount: {
    color: '#666',
    fontSize: 13,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardLocation: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  cardStatut: {
    fontSize: 13,
    color: '#007bff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  infoButton: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    fontSize: 14,
    paddingVertical: 8,
  },
});
