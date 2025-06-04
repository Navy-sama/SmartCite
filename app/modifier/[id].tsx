import { useSignalementStore } from '@/store/signalementStore';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ModifierSignalementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { signalements, updateSignalement } = useSignalementStore();

  const signalement = signalements.find((s) => s.id.toString() === id);

  // 🛡️ Gestion sécurisée si signalement est undefined
  const [categorie, setCategorie] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (signalement) {
      setCategorie(signalement.categorie);
      setDescription(signalement.description);
      setLocation(signalement.location);
      setImage(signalement.photo);
    }
  }, [signalement]);

  if (!signalement) {
    return (
      <View style={styles.container}>
        <Text>Signalement introuvable.</Text>
      </View>
    );
  }

  if (signalement.statut !== 'en attente') {
    return (
      <View style={styles.container}>
        <Text>
          Ce signalement ne peut plus être modifié (statut = {signalement.statut}).
        </Text>
      </View>
    );
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = () => {
    if (!categorie || !description || !location || !image) {
      Alert.alert('Tous les champs sont requis !');
      return;
    }

    updateSignalement(signalement.id, {
      ...signalement,
      categorie,
      description,
      location,
      photo: image,
    });

    Alert.alert('Succès', 'Signalement modifié avec succès.');
    router.push('/reports');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier le signalement</Text>

      <Text style={styles.label}>Catégorie</Text>
      <TextInput
        style={styles.input}
        value={categorie}
        onChangeText={setCategorie}
        placeholder="Ex: Nids-de-poule, Lampadaire..."
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Décris le problème"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Localisation</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Ex: Carrefour Fouda, Yaoundé"
      />

      <Text style={styles.label}>Photo</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Choisir une photo" onPress={pickImage} />

      <View style={{ marginVertical: 20 }}>
        <Button title="Enregistrer les modifications" onPress={handleUpdate} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    color: '#000',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
});
