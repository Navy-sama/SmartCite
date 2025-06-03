import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {MaterialIcons} from '@expo/vector-icons';
import {signOut, updateProfile, updateUser} from "@/data/api";
import {ProfileForm} from "@/components/forms/ProfileForm";
import {useUser} from "@/data/contexts/user";
import {useProfile} from "@/data/contexts/profile";

interface FormValues {
    username: any;
    first_name: any;
    last_name: any;
    email: any;
    phone: any;
    avatar: any;
}

export default function ProfileScreen() {
    const {Logout} = useUser();
    const {profile, handleClearProfile} = useProfile();
    const [isLoading, setIsLoading] = useState(false);

    const handleEditProfile = async (values: FormValues, mail: boolean) => {
        setIsLoading(true);
        console.log(values);
        console.log(mail);
        const id = profile.id;
        try {
            const response = await updateProfile(id, values);
            if (response && mail) {
                const res = await updateUser(values.email)
                console.log(res);
            }
            Alert.alert('Succès', 'Compte mis à jour avec succès');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await signOut();
            if (response) {
                Logout();
                handleClearProfile();
                router.replace('/');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>

            <ProfileForm
                onUpdate={handleEditProfile}
                loading={isLoading}
            />

            <View style={styles.actionContainer}>
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
    container: {flex: 1, alignItems: 'center', paddingTop: 20, backgroundColor: '#fff', justifyContent: 'center'},
    actionContainer: {width: '80%', alignItems: 'center', gap: 70, marginBottom: 20},
    saveButton: {
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
        borderRadius: 100
    },
    logoutText: {fontSize: 14, fontFamily: 'SpaceMono', color: '#666'},
});