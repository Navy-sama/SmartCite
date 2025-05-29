import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const [username, setUsername] = useState('Navy-sama');
    const [password, setPassword] = useState('PASSWORD');
    const [edit, setEdit] = useState(false);
    const [editedUsername, setEditedUsername] = useState('');
    const [editedPassword, setEditedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleEditProfile = (user?: string) => {
        if (!edit) {
            setEdit(true);
            setEditedUsername(username);
            setEditedPassword(password);
            return;
        }
        if (edit) {
            if (user) {
                setUsername(user);
            }
            if (editedUsername) setUsername(editedUsername)
            if (editedPassword) setPassword(editedPassword);
            setEdit(false);
        }
        console.log('Navigating to Edit Profile', { username, password });
    };

    const handleLogout = () => {
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>

            <View style={styles.profileIconContainer}>
                <MaterialIcons name="person" size={60} color="#000" style={styles.profileIcon} />
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <MaterialIcons name="person-outline" size={24} color="#666" />
                    {edit ? (
                        <TextInput
                            style={styles.input}
                            value={editedUsername}
                            onChangeText={setEditedUsername}
                            placeholder="Enter username"
                        />
                    ) : (
                        <Text style={styles.infoText}>{username}</Text>
                    )}
                </View>

                <View style={styles.infoRow}>
                    <MaterialIcons name="lock-outline" size={24} color="#666" />
                    {edit ? ( <>
                        <TextInput
                            style={styles.input}
                            value={editedPassword}
                            onChangeText={setEditedPassword}
                            placeholder="Enter password"
                            secureTextEntry={showPassword}
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
                    </>
                    ) : (
                        <Text style={styles.infoText}>{password}</Text>
                    )}
                </View>
            </View>

            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditProfile()}>
                    {!edit ? (
                        <>
                            <Text style={styles.editButtonText}>Editer</Text>
                            <MaterialIcons
                                name='edit'
                                size={14}
                                color="#fff"
                            />
                        </>
                    ) : (
                        <Text style={styles.editButtonText}>Valider</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Déconnexion?</Text>
                    <MaterialIcons
                            name='logout'
                            size={14}
                            color="#666"
                        />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 20, backgroundColor: '#fff', justifyContent: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', fontFamily: 'SpaceMono', marginBottom: 20, color: '#000' },
    profileIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileIcon: {},
    infoContainer: { width: '80%', marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    infoText: { marginLeft: 10, fontSize: 16, fontFamily: 'SpaceMono', color: '#000' },
    actionContainer: {width: '80%', alignItems: 'center', gap: 70, marginBottom: 20},
    input: {
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        borderRadius: 5,
        fontFamily: 'SpaceMono',
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    toggleButton: {
        position: 'absolute',
        right: 10,
        padding: 10,
    },
    editButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
        gap: 5,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    saveButton: {alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'center', gap: 5, borderRadius: 100},
    editButtonText: { color: '#fff', fontWeight: 'bold', fontFamily: 'SpaceMono' },
    logoutText: { fontSize: 14, fontFamily: 'SpaceMono', color: '#666' },
});