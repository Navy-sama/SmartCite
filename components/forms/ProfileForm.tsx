import React, {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Formik, FormikErrors, FormikValues} from 'formik';
import * as Yup from 'yup';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useProfile} from "@/data/contexts/profile";
import {deleteAvatar, uploadAvatar} from "@/data/api";
import PhoneInput, {ICountry, isValidPhoneNumber} from "react-native-international-phone-number";

interface FormValues {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar: string | null; // Adjust based on whether avatar is a URL, File, or nullable
}

interface ProfileFormProps {
    onUpdate: (values: FormValues, mail: boolean) => void;
    loading?: boolean;
}

// Validation schema using Yup
const validationSchema = () =>
    Yup.object().shape({
        username: Yup.string()
            .required('Nom d\'utilisateur requis'),
        email: Yup.string()
            .email('Email invalide')
            .required('Email requis'),
        first_name: Yup.string(),
        last_name: Yup.string(),
        phone: Yup.string()
            .test(
                'is-valid-phone',
                'Numéro de téléphone invalide',
                function (value) {
                    const {selectedCountry} = this.options.context || {};
                    if (!value || !selectedCountry) return false;
                    const phoneNumber = value.replace(selectedCountry?.callingCode, '').trim();
                    console.log(phoneNumber);
                    console.log(selectedCountry);
                    return isValidPhoneNumber(phoneNumber, selectedCountry as ICountry);
                }
            ),
    });

export const ProfileForm: React.FC<ProfileFormProps> = ({onUpdate, loading = false}) => {
    const {profile} = useProfile()
    const [isLoading, setIsLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [image, setImage] = useState({});
    const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);

    function handleSelectedCountry(country: any) {
        setSelectedCountry(country);
    }

    const initialValues = {
        username: profile?.username,
        email: profile?.email,
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        phone: profile?.phone || '',
        avatar: profile?.avatar
    }

    const handleImagePick = async (setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<FormikValues>>) => {
        const options = {
            mediaType: 'photo',
            allowsEditing: true,
            quality: 1,
        };

        try {
            setIsLoading(true);
            const response = await ImagePicker.launchImageLibraryAsync(options);

            if (!response.canceled && response.assets && response.assets.length > 0) {
                setImage(response.assets[0]);
                const uri = response.assets[0].uri
                const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer())
                const fileExt = uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
                const path = `${profile.id}/${Date.now()}.${fileExt}`;
                const {publicUrl} = await uploadAvatar(arraybuffer, path, image)
                await setFieldValue('avatar', publicUrl)
            }
        } catch (error) {
            console.error('Error picking image:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={() => {
            }}
            validateOnChange={true}
            validateOnBlur={true}
        >

            {({setFieldValue, handleChange, handleBlur, setFieldError, values, errors, touched}) => <>
                {edit ? <>
                        <TextInput
                            style={styles.headerInput}
                            placeholder="Entrez votre nom d'utilisateur"
                            value={values.username}
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            accessibilityLabel="Nom d'utilisateur"
                        />
                        <View style={styles.errorContainer}>
                            {touched.username && errors.username &&
                                <Text style={styles.errorText}>*</Text> &&
                                <Text style={styles.errorText}>{errors.username as string}</Text>}
                        </View>
                    </> :
                    <Text style={styles.header}>{values.username}</Text>
                }

                <View style={styles.profileIconContainer}>
                    {values.avatar ? <Image
                        style={styles.profileIcon}
                        source={{uri: values.avatar}}
                    /> : <MaterialIcons name="person" size={60} color="#000"/>}

                    {isLoading && <ActivityIndicator
                        style={styles.activityIndicator}
                        size="large"
                        color="#000000"
                    />}

                    {edit && <>
                        <TouchableOpacity
                            style={styles.deleteIconContainer}
                            onPress={async () => {
                                const filePath = values.avatar.split('/storage/v1/object/public/')[1].split('/').slice(1).join('/');
                                await deleteAvatar(filePath)
                                await setFieldValue('avatar', null)
                            }}
                        >
                            <MaterialIcons name="delete" size={18} color="#fff"/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.editIconContainer}
                            onPress={() => handleImagePick(setFieldValue)}
                        >
                            <MaterialIcons name="edit" size={18} color="#fff"/>
                        </TouchableOpacity>
                    </>
                    }
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="person-outline" size={24} color="#666"/>
                        {edit ?
                            <>
                                <TextInput
                                    style={styles.input}
                                    value={values?.first_name}
                                    onChangeText={handleChange('first_name')}
                                    placeholder="Nom"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={values?.last_name}
                                    onChangeText={handleChange('last_name')}
                                    placeholder="Prénom"
                                />
                            </> : (
                                values.first_name || values.last_name ?
                                    <Text style={styles.infoText}>{values.first_name} {values.last_name}</Text>
                                    :
                                    <Text style={styles.infoText}>Nom & Prénom</Text>
                            )}
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="email" size={24} color="#666"/>
                        {edit ? <>
                            <TextInput
                                style={styles.input}
                                value={values?.email}
                                onChangeText={handleChange('email')}
                                placeholder="Entrez votre email"
                            />
                        </> : <Text style={styles.infoText}>{values?.email}</Text>}
                    </View>
                    <View style={styles.errorContainer}>
                        {errors.email &&
                            <Text style={styles.errorText}>*</Text> &&
                            <Text style={styles.errorText}>{errors.email as string}</Text>}
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="phone" size={24} color="#666"/>
                        {edit ? <>
                            <PhoneInput
                                defaultCountry={'CM'}
                                value={values?.phone}
                                onChangePhoneNumber={async (phoneNumber: any) => {
                                    await setFieldValue('phone', `${selectedCountry?.callingCode} ${phoneNumber}`);
                                    if (selectedCountry && isValidPhoneNumber(phoneNumber, selectedCountry as ICountry)) {
                                        setFieldError('phone', undefined);
                                    } else {
                                        setFieldError('phone', 'Invalid phone number for the selected country');
                                    }
                                }}
                                selectedCountry={selectedCountry}
                                onChangeSelectedCountry={handleSelectedCountry}
                                phoneInputStyles={{
                                    container: {
                                        backgroundColor: '#fff',
                                        borderWidth: 1,
                                        marginLeft: 10,
                                        borderColor: '#ccc',
                                        borderRadius: 5,
                                        flex: 1,
                                        height: 32,
                                        width: '80%',
                                    },
                                    flagContainer: {
                                        borderTopLeftRadius: 5,
                                        borderBottomLeftRadius: 5,
                                        backgroundColor: '#808080',
                                        paddingHorizontal: 5
                                    },
                                    caret: {
                                        color: '#F3F3F3',
                                        fontSize: 10,
                                    },
                                    divider: {
                                        backgroundColor: '#F3F3F3',
                                        display: 'none',
                                    },
                                    callingCode: {
                                        display: 'none',
                                    },
                                    input: {
                                        fontFamily: 'SpaceMono',
                                        fontSize: 16,
                                        color: '#000',
                                        paddingHorizontal: 10,
                                        paddingVertical: 0,
                                    },
                                }}
                            />
                        </> : <Text style={styles.infoText}>{values?.phone}</Text>}
                    </View>
                    <View style={styles.errorContainer}>
                        {errors.phone &&
                            <Text style={styles.errorText}>*</Text> &&
                            <Text style={styles.errorText}>{errors.phone as string}</Text>}
                    </View>
                </View>

                <View style={styles.actionContainer}>
                    {!edit ? <TouchableOpacity style={styles.editButton} onPress={() => setEdit(true)}>
                        <Text style={styles.editButtonText}>Editer</Text>
                        <MaterialIcons
                            name='edit'
                            size={14}
                            color="#fff"
                        />
                    </TouchableOpacity> : <TouchableOpacity style={styles.editButton} onPress={async () => {
                        if (initialValues.email === values.email) {
                            onUpdate(values, false);
                        } else {
                            onUpdate(values, true);
                        }
                        setEdit(false);
                    }}>
                        <Text style={styles.editButtonText}>Valider</Text>
                    </TouchableOpacity>}
                </View>

                {
                    loading && <ActivityIndicator size='large' color="#000000"/>
                }
            </>
            }
        </Formik>
    )
        ;
};

const styles = StyleSheet.create({
    header: {fontSize: 24, fontWeight: 'bold', fontFamily: 'SpaceMono', marginBottom: 20, color: '#000'},
    headerInput: {
        fontSize: 24, fontWeight: 'bold', fontFamily: 'SpaceMono', marginBottom: 20, color: '#000', borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 15,
        borderRadius: 5,
        width: 'auto', textAlign: 'center'
    },
    profileIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative', // Ensure positioning context for edit icon
    },
    activityIndicator: {
        position: 'absolute',
    },
    profileIcon: {
        width: '100%',
        height: '100%',
        borderRadius: 50, // Make the image circular
    },
    deleteIconContainer: {
        position: 'absolute',
        bottom: 0,
        left: 5,
        backgroundColor: '#f00',
        borderRadius: '100%',
        padding: 2,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 5,
        backgroundColor: '#888',
        borderRadius: '100%',
        padding: 2,
    },
    infoContainer: {width: '80%', marginBottom: 20},
    infoRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 10},
    infoText: {marginLeft: 10, fontSize: 16, fontFamily: 'SpaceMono', color: '#000'},
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
    editButtonText: {color: '#fff', fontWeight: 'bold', fontFamily: 'SpaceMono'},
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -5,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginLeft: 35,
    },
});