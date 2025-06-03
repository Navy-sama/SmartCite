import { Stack, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  const goToHome = () => {
    router.push('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Image
        source={require('../assets/logo.jpg')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>SMARTCITE</Text>
      <TouchableOpacity style={styles.button} onPress={goToHome}>
        <Text style={styles.buttonText}>Commencer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
