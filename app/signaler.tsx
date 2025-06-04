import { useNotificationStore } from '@/store/notificationStore'
import { useSignalementStore } from '@/store/signalementStore'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Image } from 'react-native'
import {
  Button,
  Form,
  Input,
  Label,
  ScrollView,
  YStack,
} from 'tamagui'



export default function AjouterScreen() {
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [location, setLocation] = useState('')

  const addSignalement = useSignalementStore(state => state.addSignalement)
  const addNotification = useNotificationStore(state => state.addNotification)
  const router = useRouter()

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleSubmit = () => {
    if (!category || !description || !image || !location) {
      alert('Tous les champs sont requis !')
      return
    }

    addSignalement({
      photo: image,
      categorie: category,
      description,
      location,
      statut: 'en attente',
      date: Date.now(),
    })

    addNotification(`Votre signalement "${category}" a été enregistré avec succès.`)
    router.push('/reports')
  }

  return (
    <ScrollView padding="$4" backgroundColor="$background" flex={1}>
      <Form onSubmit={handleSubmit} gap="$3">
        <YStack gap="$2">
          <Label htmlFor="category">Catégorie</Label>
          <Input
            id="category"
            placeholder="Ex: Nids-de-poule, Lampadaire..."
            value={category}
            onChangeText={setCategory}
          />
        </YStack>

        <YStack gap="$2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            multiline
            numberOfLines={4}
            height={100}
            textAlignVertical="top"
            placeholder="Décris le problème"
            value={description}
            onChangeText={setDescription}
          />
        </YStack>

        <YStack gap="$2">
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            placeholder="Ex: Carrefour Fouda, Yaoundé"
            value={location}
            onChangeText={setLocation}
          />
        </YStack>

        <YStack gap="$2">
          <Label>Photo</Label>
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 8,
                marginBottom: 10,
              }}
            />
          )}
          <Button theme="blue" onPress={pickImage}>
            Choisir une photo
          </Button>
        </YStack>

        <Button size="$4" theme="green" marginTop="$4" onPress={handleSubmit}>
          Envoyer le signalement
        </Button>
      </Form>
    </ScrollView>
  )
}
