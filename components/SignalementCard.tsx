import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Signalement } from '../store/signalementStore';



type Props = {
  signalement: Signalement;
};

export default function SignalementCard({ signalement }: Props) {
  const getRelativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "envoyé à l'instant";
  if (minutes < 60) return `envoyé il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `envoyé il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `envoyé il y a ${days} j`;
  };
  const router = useRouter();

  const goToDetail = () => {
    router.push({
      pathname: '/detail/[id]',
      params: { id: signalement.id.toString() },
    });
  };

  return (
    <TouchableOpacity onPress={goToDetail} style={styles.card}>
      <Image source={{ uri: signalement.photo }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.label}>{signalement.categorie}</Text>

        <View style={styles.locationRow}>
          <IconSymbol name="mappin.and.ellipse" size={16} color="#555" />
          <Text style={styles.loc}>{signalement.location}</Text>
        </View>

        <Text style={styles.status}>Statut : {signalement.statut}</Text>
        <Text style={styles.time}>{getRelativeTime(signalement.date)}</Text>
      </View>

       <TouchableOpacity onPress={goToDetail} style={styles.infoIcon}>
        <Ionicons name="information-circle-outline" size={24} color="#555" />
      </TouchableOpacity>
    </TouchableOpacity>
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
  time: {
  fontSize: 12,
  color: '#999',
  marginTop: 4,
  fontStyle: 'italic',
  },
  infoIcon: {
    paddingLeft: 10,
    paddingRight: 4,
  },
});
