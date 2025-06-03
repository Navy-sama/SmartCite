import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Formik, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface FormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface SignFormProps {
    onLogin: (values: { username: string; password: string }) => void;
    onRegister: (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => void;
    login?: boolean;
    loading?: boolean;
}

// Validation schema using Yup
const validationSchema = (login: boolean) =>
    Yup.object().shape({
    username: Yup.string()
        .required('Nom d\'utilisateur requis'),
    email: Yup.string()
        .email('Email invalide')
        .when({
            is: () => !login,
            then: (email) => email.required('Email requis'),
        }),
    password: Yup.string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .required('Mot de passe requis'),
    confirmPassword: Yup.string()
        .when({
            is: () => !login,
            then: (schema) =>
                schema
                    .oneOf([Yup.ref('password')], 'Les mots de passe doivent correspondre')
                    .required('Confirmation du mot de passe requise'),
        }),
});

export const SignForm: React.FC<SignFormProps> = ({onLogin, onRegister, login = true, loading = false}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Formik
            initialValues={{
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
            }}
            validationSchema={validationSchema(login)}
            onSubmit={(values, formikHelpers) => {
                if (login) {
                    onLogin({username: values.username, password: values.password});
                } else {
                    onRegister(values, formikHelpers);
                }
            }}
        >
            {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom d'utilisateur"
                            value={values.username}
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            accessibilityLabel="Nom d'utilisateur"
                        />
                    </View>

                    <View style={styles.errorContainer}>
                        {touched.username && errors.username &&
                            <Text style={styles.errorText}>*</Text> &&
                            <Text style={styles.errorText}>{errors.username}</Text>}
                    </View>

                    {!login && (
                        <>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    keyboardType="email-address"
                                    accessibilityLabel="Email"
                                />
                            </View>

                            <View style={styles.errorContainer}>
                                {touched.email && errors.email &&
                                    <Text style={styles.errorText}>*</Text> &&
                                    <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>
                        </>
                    )}

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Mot de passe"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            secureTextEntry={!showPassword}
                            accessibilityLabel="Mot de passe"
                        />
                        <TouchableOpacity style={styles.toggleButton}
                                          onPress={() => setShowPassword(!showPassword)}>
                            <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={24}
                                           color="#000"/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.errorContainer}>
                        {touched.password && errors.password &&
                            <Text style={styles.errorText}>*</Text> &&
                            <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    {!login && (
                        <>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirmation du mot de passe"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    secureTextEntry
                                    accessibilityLabel="Confirmation du mot de passe"
                                />
                            </View>

                            <View style={styles.errorContainer}>
                                {touched.confirmPassword && errors.confirmPassword &&
                                    <Text style={styles.errorText}>*</Text> &&
                                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                }
                            </View>
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={async () => {
                            handleSubmit()
                        }}
                    >
                        <Text style={styles.saveText}>{login ? 'Connectez-vous' : 'Inscrivez-vous'}</Text>
                        <MaterialIcons name="login" size={24} color="#FFF"/>
                    </TouchableOpacity>

                    {loading && <ActivityIndicator size="large" color="#000000" />}
                </>
            )
            }
        </Formik>
    )
        ;
};

const styles = StyleSheet.create({
    inputContainer: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    errorContainer: {
        width: '75%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
    },
    toggleButton: {
        position: 'absolute',
        right: 10,
        padding: 10,
    },
    saveButton: {
        backgroundColor: '#000',
        padding: 15,
        width: '50%',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
        borderRadius: 100,
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -5,
    },
});