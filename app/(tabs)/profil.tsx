import { StyleSheet, Text, View } from 'react-native';

export default function Profil () { 

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profil</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
 
});