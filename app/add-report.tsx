import {useNotificationStore} from '@/store/notificationStore'
import * as ImagePicker from 'expo-image-picker'
import {useRouter} from 'expo-router'
import React, {useState} from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native'
import {Button, ScrollView,} from 'tamagui'
import {Formik, FormikErrors} from "formik";
import * as Yup from "yup";
import {useProfile} from "@/data/contexts/profile";
import CustomCategoryPicker from "@/components/CustomPicker";
import {addNewReport, deleteAvatar, supabase, uploadAvatar} from "@/data/api";
import {useReport} from "@/data/contexts/reports";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ImageStyle} from "expo-image";


export default function AjouterScreen() {
    const {profile} = useProfile();
    const router = useRouter()
    const {fetchReports} = useReport()
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [image, setImage] = useState<any | null>(null)
    const addNotification = useNotificationStore(state => state.addNotification)

    interface FormValues {
        title: string;
        user_id: string;
        category: string;
        description: string;
        location: string;
        image: string | null;
        priority: number;
    }

    const initialValues: FormValues = {
        title: '',
        user_id: profile?.id || '',
        category: '',
        description: '',
        location: '',
        image: null,
        priority: 1,
    };

    const validationSchema = () =>
        Yup.object().shape({
            title: Yup.string().required('*Titre requis'),
            category: Yup.string().required('*Catégorie requis'),
            description: Yup.string().required('*Veuillez détailler votre problème svp'),
            location: Yup.string().required('*Veuillez indiquer sa localisation la plus précise svp'),
            image: Yup.string().nullable(),
        });

    const handleImagePick = async (
        values: FormValues,
        setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<any>>
    ) => {
        const options = {
            mediaType: 'photo',
            allowsEditing: true,
            quality: 1,
        };

        try {
            setIsLoadingImage(true);
            const result = await ImagePicker.launchImageLibraryAsync(options);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                if (values.image) {
                    const filePath = values.image.split('/storage/v1/object/public/')[1].split('/').slice(1).join('/');
                    await deleteAvatar(filePath)
                }
                const uri = result.assets[0].uri;
                setImage(result.assets[0]);
                const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());
                const fileExt = uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
                const path = `${profile.id}/${Date.now()}.${fileExt}`;
                const {publicUrl} = await uploadAvatar(arraybuffer, path, image); // Ensure uploadAvatar is defined
                await setFieldValue('image', publicUrl, true);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            alert('Erreur lors de la sélection de l’image');
        } finally {
            setIsLoadingImage(false);
        }
    };

    const handleSubmit = async (values: FormValues) => {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
            throw new Error('User not authenticated');
        }

        try{
            setIsLoading(true)
            const {error} = await addNewReport(values, data?.session)

            if (error) {
                throw new Error(error || 'Erreur lors de l\'envoi du signalement');
            }

            Alert.alert('Success', 'Signalement soumis avec succès');
            addNotification(`Votre signalement "${values.title}" a été enregistré avec succès.`)
            await AsyncStorage.removeItem('reports');
            await fetchReports();
            router.push('/reports')
        } catch (error) {
            console.error('Error submitting report:', error);
            Alert.alert('Error', error.message || 'Erreur lors de l\'envoi du signalement');
        } finally {
            setIsLoading(false);
        }


    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmit(values)}
            validateOnChange={true}
            validateOnBlur={true}
        >
            {({setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <ScrollView contentContainerStyle={styles.container}>
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

                    <Text style={styles.label}>Catégorie</Text>
                    <CustomCategoryPicker value={values.category} field="category" setFieldValue={setFieldValue}/>
                    {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

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
                                onPress={() => setFieldValue('priority', option.value, true)}
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
                    {errors.priority && (
                        <Text style={styles.errorText}>{errors.priority}</Text>
                    )}

                    <Text style={styles.label}>Photo</Text>
                    {values.image && <Image source={{uri: values.image}} style={styles.image}/>}
                    {touched.image && errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
                    <Button theme="blue" disabled={isLoadingImage} onPress={() => handleImagePick(values, setFieldValue)}>
                        {isLoadingImage ? 'Chargement...' : 'Charger une photo'}
                    </Button>

                    {
                        isLoadingImage && <ActivityIndicator size='large' color="#0af"/>
                    }

                    <View style={{marginVertical: 35}}>
                        <Button theme="green" onPress={handleSubmit}>
                            Envoyer
                        </Button>
                        {
                            isLoading && <ActivityIndicator size='large' color="#000000"/>
                        }
                    </View>
                </ScrollView>
            )}
        </Formik>
    );
};


const styles = {
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    } as TextStyle,
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
        color: '#000',
        padding: 10,
        borderRadius: 6,
        marginBottom: 5,
    },
    textarea: {
        height: 100,
        textAlignVertical: 'top',
    } as TextStyle,
    image: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        borderRadius: 8,
    } as ImageStyle,
    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 8,
        marginBottom: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    } as ViewStyle,
    radioButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        alignItems: 'center',
        marginHorizontal: 5,
    } as ViewStyle,
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
    } as TextStyle,
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 4,
        marginTop: 16,
    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
};