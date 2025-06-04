import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSignalementStore } from '@/store/signalementStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export default function DetailSignalementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isReadOnly = params.readonly === 'true';

  const { signalements, deleteSignalement } = useSignalementStore();
  const signalement = signalements.find((s) => s.id.toString() === id);

  if (!signalement) {
    return (
      <View style={styles.container}>
        <Text>Signalement introuvable.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Supprimer', 'Voulez-vous vraiment supprimer ce signalement ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          deleteSignalement(Number(signalement.id));
          router.back();
        },
      },
    ]);
  };

  const isModifiable = signalement.statut === 'en attente' && !isReadOnly;


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Détail du signalement</Text>

      <Image source={{ uri: signalement.photo }} style={styles.image} />

      <Text style={styles.label}>Catégorie</Text>
      <Text style={styles.text}>{signalement.categorie}</Text>

      <Text style={styles.label}>Description</Text>
      <Text style={styles.text}>{signalement.description}</Text>

      <Text style={styles.label}>Localisation</Text>
      <View style={styles.locationRow}>
        <IconSymbol name="mappin.and.ellipse" size={16} color="#555" />
        <Text style={styles.text}>{signalement.location}</Text>
      </View>

      <Text style={styles.label}>Statut :
        <Text style={[styles.text, getStatutStyle(signalement.statut)]}>
            {signalement.statut}
        </Text>
      </Text>

      <Text style={styles.label}>Date</Text>
      <Text style={styles.text}>
        {new Date(signalement.date).toLocaleString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>

      {isModifiable && (
        <View style={styles.buttonGroup}>
          <Button
            title="Modifier"
            onPress={() =>
                router.push({
                pathname: '/modifier/[id]',
                params: { id: signalement.id.toString() },
                })
            }
            color="black"
            />

          <Button title="Supprimer" onPress={handleDelete} color="black" />
        </View>
      )}
    </ScrollView>
  );
}

//Fonction de style externe typée pour le statut
function getStatutStyle(statut: string): TextStyle {
  return {
    color:
      statut === 'en attente'
        ? 'orange'
        : statut === 'en cours'
        ? '#007bff'
        : 'green',
    fontWeight: 'bold',
    marginTop: 4,
  };
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  } as TextStyle,
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 4,
  } as TextStyle,
  text: {
    fontSize: 15,
    color: '#333',
  } as TextStyle,
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  } as ViewStyle,
  buttonGroup: {
    marginTop: 30,
    flexDirection: 'column',
    gap: 10,
  } as ViewStyle,
});
