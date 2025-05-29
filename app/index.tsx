import {router} from 'expo-router';
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function LogScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [login, setLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Ajoutez ici la logique pour sauvegarder les données
        console.log('Username:', username, 'Password:', password);
        router.replace("/(tabs)/home")
    };

    const handleRegister = () => {
        // Ajoutez ici la logique pour sauvegarder les données
        console.log('Username:', username, 'Password:', password, 'Confirm:', confirmPassword);
        router.replace("/(tabs)/home")
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SMART CITE</Text>
            <Text style={styles.subtitle}>Signalez, changez votre ville</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={login ? styles.signOnButton : styles.signOffButton}
                                  onPress={() => setLogin(true)}>
                    <Text style={login ? styles.signOnText : styles.signOffText}>Connexion</Text>
                </TouchableOpacity>
                <TouchableOpacity style={login ? styles.signOffButton : styles.signOnButton}
                                  onPress={() => setLogin(false)}>
                    <Text style={login ? styles.signOffText : styles.signOnText}>Inscription</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry = {showPassword}
                />
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <MaterialIcons
                        name={showPassword ? 'visibility-off' : 'visibility'}
                        size={24}
                        color="#000"
                    />
                </TouchableOpacity>
            </View>
            {!login &&
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmation du mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>
            }
            <TouchableOpacity style={styles.saveButton} onPress={login ? handleLogin : handleRegister}>
                {login ?
                    <Text style={styles.saveText}>Connectez-vous</Text> :
                    <Text style={styles.saveText}>Inscrivez-vous</Text>
                }
                <MaterialIcons
                name='login'
                size={24}
                color="#FFF"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, alignItems: 'center', paddingTop: 50, justifyContent: 'center'},
    title: {fontSize: 32, fontWeight: 'bold'},
    subtitle: {fontSize: 16, marginBottom: 20},
    inputContainer: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleButton: {
        position: 'absolute',
        right: 10,
        padding: 10,
    },
    buttonContainer: {flexDirection: 'row', marginBottom: 20},
    signOffButton: {backgroundColor: '#fff', padding: 10, width: 100, alignItems: 'center'},
    signOnButton: {backgroundColor: '#000', padding: 10, width: 100, alignItems: 'center'},
    signOffText: {color: '#000'},
    signOnText: {color: '#fff'},
    input: {width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, borderRadius: 10},
    saveButton: {backgroundColor: '#000', padding: 15, width: '50%', alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'center', gap: 5, borderRadius: 100},
    saveText: {color: '#fff', fontWeight: 'bold'},
});

