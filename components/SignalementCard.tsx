import {IconSymbol} from '@/components/ui/IconSymbol';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Signalement} from '@/store/signalementStore';
import {useCategory} from "@/data/contexts/category";


type Props = {
    signalement: Signalement;
};

export default function SignalementCard({signalement}: Props) {
    const router = useRouter();
    const {categories} = useCategory()

    const getRelativeTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return "envoyé à l'instant";
        if (minutes < 60) return `envoyé il y a ${minutes} min`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `envoyé il y a ${hours} h`;

        const days = Math.floor(hours / 24);
        return `envoyé il y a ${days} j`;
    };

    function getStatusColor(statut: string) {
        if (statut === 'pending') return 'orange';
        if (statut === 'in treatment') return '#007bff';
        return 'green';
    }

    const goToDetail = () => {
        router.push({
            pathname: "/detail/[id]" as const,
            params: {
                id: signalement.id,
            }
        });
    };

    return (
        <TouchableOpacity onPress={goToDetail} style={styles.card}>
            <Image source={{uri: signalement.image}} style={styles.image}/>

            <View style={styles.details}>
                <Text style={styles.label}>{signalement.title}</Text>
                <Text style={styles.label}>
                    {categories.find((cat: { id: any; }) => cat.id === signalement.category)?.name || 'Catégorie inconnue'}
                </Text>

                <View style={styles.locationRow}>
                    <IconSymbol name="mappin.and.ellipse" size={16} color="#555"/>
                    <Text style={styles.loc}>{signalement.location}</Text>
                </View>

                <Text style={[styles.status, {color: getStatusColor(signalement.status)}]}>
                    Statut : {signalement.status === "pending" &&  "En attente" || signalement.status === "resolved" && "Résolu" || "En cours"}
                </Text>
                <Text style={styles.time}>{getRelativeTime(signalement.created_at)}</Text>
            </View>

            <TouchableOpacity onPress={goToDetail} style={styles.infoIcon}>
                <Ionicons name="information-circle-outline" size={24} color="#555"/>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        marginBottom: 10,
        paddingVertical: 10,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    details: {
        flex: 1,
        marginLeft: 10,
    },
    label: {
        fontWeight: 'bold',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        gap: 6, // ou utilisez marginRight dans l'icône si gap n'est pas supporté
    },
    loc: {
        fontSize: 12,
        color: '#555',
    },
    status: {
        color: 'blue',
        marginTop: 5,
    },
    menuIcon: {
        fontSize: 22,
        paddingHorizontal: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageOverlay: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '70%',
        borderRadius: 10,
        resizeMode: 'contain',
    },
    menu: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        width: 200,
    },
    menuItem: {
        fontSize: 16,
        padding: 10,
    },
    time: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        fontStyle: 'italic',
    },
    infoIcon: {
        paddingLeft: 10,
        paddingRight: 4,
    },
});