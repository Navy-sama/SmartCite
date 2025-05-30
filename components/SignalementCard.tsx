import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Signalement, useSignalementStore } from '../store/signalementStore';

type Props = {
  signalement: Signalement;
};

export default function SignalementCard({ signalement }: Props) {
  const deleteSignalement = useSignalementStore(state => state.deleteSignalement);
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false); 

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setImageModalVisible(true)}>
        <Image source={{ uri: signalement.photo }} style={styles.image} />
      </TouchableOpacity>

      <View style={styles.details}>
        <Text style={styles.label}>{signalement.categorie}</Text>
        <Text>{signalement.description}</Text>

        {/* ✅ Localisation avec icône */}
        <View style={styles.locationRow}>
          <IconSymbol name="mappin.and.ellipse" size={16} color="#555" />
          <Text style={styles.loc}>{signalement.location}</Text>
        </View>

        <Text style={styles.status}>Statut : {signalement.statut}</Text>
      </View>

      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Text style={styles.menuIcon}>⋮</Text>
      </TouchableOpacity>

      {/* Modal pour menu Modifier / Supprimer */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menu}>
            <Pressable onPress={() => { alert("Modifier"); setMenuVisible(false); }}>
              <Text style={styles.menuItem}>Modifier</Text>
            </Pressable>
            <Pressable onPress={() => { deleteSignalement(signalement.id); setMenuVisible(false); }}>
              <Text style={[styles.menuItem, { color: 'red' }]}>Supprimer</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Modal pour agrandir l’image */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <Pressable style={styles.imageOverlay} onPress={() => setImageModalVisible(false)}>
          <Image source={{ uri: signalement.photo }} style={styles.fullImage} />
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 6, // ou utilisez marginRight dans l'icône si gap n'est pas supporté
  },
  loc: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#555',
  },
  status: {
    color: 'blue',
    marginTop: 5,
  },
  menuIcon: {
    fontSize: 22,
    paddingHorizontal: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    width: 200,
  },
  menuItem: {
    fontSize: 16,
    padding: 10,
  },
});
