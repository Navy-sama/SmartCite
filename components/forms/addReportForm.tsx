import {Formik, FormikErrors} from "formik";
import {Button, Image, Text, TextInput, TouchableOpacity, View} from "react-native";
import CustomCategoryPicker from "@/components/CustomPicker";
import React, {useState} from "react";
import {useProfile} from "@/data/contexts/profile";
import * as ImagePicker from "expo-image-picker";
import {uploadAvatar} from "@/data/api";
import * as Yup from "yup";

export default function AddReportScreen() {
    const {profile} = useProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState({});

    const initialValues: FormValues = {
        title: '',
        user_id: profile?.id || '',
        category: '',
        description: '',
        location: '',
        image: null,
        priority: 1,
    };

    const handleImagePick = async (
        setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<any>>
    ) => {
        const options = {
            mediaType: 'photo',
            allowsEditing: true,
            quality: 1,
        };

        try {
            setIsLoading(true);
            const result = await ImagePicker.launchImageLibraryAsync(options);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                setImage(result.assets[0]);
                const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());
                const fileExt = uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
                const path = `${profile.id}/${Date.now()}.${fileExt}`;
                const {publicUrl} = await uploadAvatar(arraybuffer, path, result.assets[0]); // Ensure uploadAvatar is defined
                await setFieldValue('image', publicUrl, true);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            alert('Erreur lors de la sélection de l’image');
        } finally {
            setIsLoading(false);
        }
    };

    interface FormValues {
        title: string;
        user_id: string;
        category: string;
        description: string;
        location: string;
        image: string | null;
        priority: number;
    }

    const validationSchema = () =>
        Yup.object().shape({
            title: Yup.string().required('*Titre requis'),
            category: Yup.string().required('*Catégorie requis'),
            description: Yup.string().required('*Veuillez détailler votre problème svp'),
            location: Yup.string().required('*Veuillez indiquer sa localisation la plus précise svp'),
            image: Yup.string().nullable(),
        });


    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, {resetForm}) => {
            }}
            validateOnChange={true}
            validateOnBlur={true}
        >
            {({setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <View style={styles.container}>
                    <Text style={styles.label}>Titre</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Titre du signalement"
                        placeholderTextColor="#999"
                        value={values.title}
                        onChangeText={handleChange('title')}
                        onBlur={handleBlur('title')}
                    />
                    {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textarea]}
                        placeholder="Décris le problème"
                        placeholderTextColor="#999"
                        value={values.description}
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        multiline
                        numberOfLines={7}
                    />
                    {errors.description && (
                        <Text style={styles.errorText}>{errors.description}</Text>
                    )}

                    <Text style={styles.label}>Localisation</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Carrefour Fouda, Yaoundé"
                        placeholderTextColor="#999"
                        value={values.location}
                        onChangeText={handleChange('location')}
                        onBlur={handleBlur('location')}
                    />
                    {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

                    <Text style={styles.label}>Catégorie</Text>
                    <CustomCategoryPicker value={values.category} field="category" setFieldValue={setFieldValue}/>
                    {touched.category && errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

                    <Text style={styles.label}>Priorité</Text>
                    <View style={styles.radioContainer}>
                        {[
                            {label: 'Basse', value: 1, color: "#070"},
                            {label: 'Moyenne', value: 2, color: "#fa0"},
                            {label: 'Urgent', value: 3, color: "#f00"},
                        ].map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.radioButton,
                                    values.priority === option.value && {backgroundColor: option.color},
                                ]}
                                onPress={(e) => {
                                    setFieldValue('priority', option.value, true)
                                }}
                            >
                                <Text
                                    style={[
                                        styles.radioText,
                                        values.priority === option.value && styles.radioTextSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {touched.priority && errors.priority && (
                        <Text style={styles.errorText}>{errors.priority}</Text>
                    )}

                    <Text style={styles.label}>Photo</Text>
                    {values.image && <Image source={{uri: values.image}} style={styles.image}/>}
                    {touched.image && errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
                    <Button
                        title={isLoading ? 'Chargement...' : 'Charger une photo'}
                        onPress={(e) => {
                            handleImagePick(setFieldValue)
                        }}
                        disabled={isLoading}
                    />

                    <View style={{marginVertical: 20}}>
                        <Button
                            title="Envoyer"
                            onPress={() => handleSubmit()}
                            disabled={isLoading || Object.keys(errors).length > 0}
                        />
                    </View>
                </View>
            )}
        </Formik>
    );
};

const styles = {
    container: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 5,
        backgroundColor: '#f9f9f9',
    },
    textarea: {
        height: 100,
        textAlignVertical: 'top',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 8,
        marginBottom: 15,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    radioButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    radioButtonSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    radioText: {
        color: '#000',
        fontSize: 14,
    },
    radioTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
};