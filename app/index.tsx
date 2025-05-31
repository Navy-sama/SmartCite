import {getCurrentProfile, getCurrentUser, signIn, signUp} from '@/data/api';
import {SignForm} from '@/components/forms/SignForm';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FormikHelpers} from 'formik';
import {useUser} from "@/data/contexts/user";
import {useProfile} from "@/data/contexts/profile";

interface FormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function LogScreen() {
    const [login, setLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const {Login} = useUser();
    const {handleSetProfile} = useProfile();

    const handleLogin = async (values: { username: string; password: string }) => {
        console.log('Username:', values.username, 'Password:', values.password);
        setIsLoading(true)
        try {
            const response = await signIn(values.username, values.password);
            if (response) {
                const user = await getCurrentUser();
                Login(user);
                const profile = await getCurrentProfile(values.username);
                handleSetProfile(profile);
                router.replace('/(tabs)/home');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false)
        }
    };

    const handleRegister = async (values: FormValues, {resetForm}: FormikHelpers<FormValues>) => {
        console.log('Username:', values.username, 'Email:', values.email, 'Password:', values.password);
        setIsLoading(true)

        try {
            const response = await signUp(values.email, values.password, values.username);
            if (response) {
                resetForm();
                if (!response.session) {
                    Alert.alert(
                        'Success',
                        'Signup successful! Please check your email to confirm your account.'
                    );
                } else {
                    const user = await getCurrentUser();
                    console.log(user);
                    router.replace('/(tabs)/home');
                }
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flexContainer}
            behavior={'padding'}
            keyboardVerticalOffset={0}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                }}
            >
                <View style={styles.container}>
                    <>
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

                        <SignForm
                            onLogin={handleLogin}
                            onRegister={handleRegister}
                            login={login}
                            loading={isLoading}
                        />

                    </>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
    },
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
    saveButton: {
        backgroundColor: '#000',
        padding: 15,
        width: '50%',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
        borderRadius: 100
    },
    saveText: {color: '#fff', fontWeight: 'bold'},
});

