import {IconSymbol} from '@/components/ui/IconSymbol';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Alert, Button, Image, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle,} from 'react-native';
import {useReport} from "@/data/contexts/reports";
import {useCategory} from "@/data/contexts/category";
import {deleteAvatar, deleteReport, supabase} from "@/data/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailSignalementScreen() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const params = useLocalSearchParams();
    const isReadOnly = params.readonly === 'true';
    const {categories} = useCategory()
    const {reports, fetchReports} = useReport();
    const signalement = reports.find((report: any) => report.id === id);

    if (!signalement) {
        return (
            <View style={styles.container}>
                <Text>Signalement introuvable.</Text>
            </View>
        );
    }

    const handleDelete = () => {
            Alert.alert('Supprimer', 'Voulez-vous vraiment supprimer ce signalement ?', [
                {text: 'Annuler', style: 'cancel'},
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        const {data} = await supabase.auth.getSession();
                        if (!data?.session) {
                            throw new Error('User not authenticated');
                        }

                        try {
                            const filePath = signalement.image.split('/storage/v1/object/public/')[1].split('/').slice(1).join('/');
                            const {error} = await deleteReport(signalement.id, data?.session);
                            if (error) throw new Error(error || 'Erreur lors de la suppression du signalement');
                            await deleteAvatar(filePath)
                            Alert.alert('Success', 'Signalement supprimé avec succès');
                            await AsyncStorage.removeItem('reports');
                            await fetchReports();
                            router.back();
                        } catch (error) {
                            console.error('Error submitting report:', error);
                            Alert.alert('Error', error.message || 'Erreur lors de la mise à jour du signalement');
                        }
                    }
                }
            ]);
        };

    const isModifiable = signalement.status === 'pending' && !isReadOnly;


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{signalement.title}</Text>

            <Image source={{uri: signalement.image}} style={styles.image}/>

            <Text style={styles.label}>Catégorie</Text>
            <Text style={styles.text}>
                {categories.find((cat: {
                    id: any;
                }) => cat.id === signalement.category)?.name || 'Catégorie inconnue'}</Text>

            <Text style={styles.label}>Description</Text>
            <Text style={styles.text}>{signalement.description}</Text>

            <Text style={styles.label}>Localisation</Text>
            <View style={styles.locationRow}>
                <IconSymbol name="mappin.and.ellipse" size={16} color="#555"/>
                <Text style={styles.text}>{signalement.location}</Text>
            </View>

            <Text style={styles.label}>Statut :
                <Text style={[styles.text, getStatutStyle(signalement.status)]}>
                    {signalement.status === 'pending' ? "En attente" : signalement.status === 'in treatment' ? "En cours" : "Résolu"}
                </Text>
            </Text>

            <Text style={styles.label}>Date</Text>
            <Text style={styles.text}>
                {new Date(signalement.created_at).toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </Text>

            {isModifiable && (
                <View style={styles.buttonGroup}>
                    <Button
                        title="Modifier"
                        onPress={() =>
                            router.push({
                                pathname: '/modifier/[id]',
                                params: {id: signalement.id},
                            })
                        }
                        color="#09f"
                    />

                    <Button title="Supprimer" onPress={handleDelete} color="red"/>
                </View>
            )}
        </ScrollView>
    );
}

//Fonction de style externe typée pour le statut
function getStatutStyle(statut: string): TextStyle {
    return {
        color:
            statut === 'pending'
                ? 'orange'
                : statut === 'in treatment'
                    ? '#007bff'
                    : 'green',
        fontWeight: 'bold',
        marginTop: 4,
    };
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    } as ViewStyle,
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    } as TextStyle,
    image: {
        width: '100%',
        height: 220,
        borderRadius: 10,
        marginBottom: 20,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 15,
        marginBottom: 4,
    } as TextStyle,
    text: {
        fontSize: 15,
        color: '#333',
    } as TextStyle,
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    } as ViewStyle,
    buttonGroup: {
        marginTop: 30,
        flexDirection: 'column',
        gap: 10,
    } as ViewStyle,
});
