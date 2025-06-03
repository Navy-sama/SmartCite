import { useNotificationStore } from '@/store/notificationStore';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import { useSignalementStore } from '@/store/signalementStore';

export default function AjouterScreen() {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');

  const addSignalement = useSignalementStore(state => state.addSignalement);
  const addNotification = useNotificationStore(state => state.addNotification);

  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
  if (!category || !description || !image || !location) {
    Alert.alert("Tous les champs sont requis !");
    return;
  }


    addSignalement({
      photo: image,
      categorie: category,
      description,
      location,
      statut: 'en attente',
    });

    addNotification(`Votre signalement "${category}" a été enregistré avec succès.`);

    router.push('/reports');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Catégorie</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Nids-de-poule, Lampadaire..."
        placeholderTextColor="#999"
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Décris le problème"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Localisation</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Carrefour Fouda, Yaoundé"
        placeholderTextColor="#999"
        value={location}
        onChangeText={setLocation}
      />



      <Text style={styles.label}>Photo</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Choisir une photo" onPress={pickImage} />

      <View style={{ marginVertical: 20 }}>
        <Button title="Envoyer le signalement" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
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
