import HeaderComponent from '@/components/HeaderComponent';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {useEffect, useState} from 'react';
import {FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useReport} from "@/data/contexts/reports";
import {useCategory} from "@/data/contexts/category";

export default function HomeScreen() {
    const urgences = [
        {label: 'Basse', value: 1, color: "#070"},
        {label: 'Moyenne', value: 2, color: "#fa0"},
        {label: 'Urgent', value: 3, color: "#f00"},
    ]
    const {categories} = useCategory();
    const router = useRouter();
    const {reports} = useReport();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<string>('');
    const [searchBy, setSearchBy] = useState<'Ville' | 'Categorie' | 'Urgence' | null>(null);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterOptionsModalVisible, setFilterOptionsModalVisible] = useState(false);
    const [filtered, setFiltered] = useState(reports);

    useEffect(() => {
        if(reports?.length === 0) {
            setFiltered([])
            return
        }
        !searchBy && setFiltered(reports);
    }, [reports]);

    interface ReportStats {
        total: number;
        pending: number;
        inTreatment: number;
        resolved: number;
    }

    const calculateStats = (reports: { status: string }[]): ReportStats => {
        return {
            total: reports?.length,
            pending: reports?.filter((report: { status: string; }) => report.status === 'pending').length,
            inTreatment: reports?.filter((report: { status: string; }) => report.status === 'in treatment').length,
            resolved: reports?.filter((report: { status: string; }) => report.status === 'resolved').length
        };
    };

// Utilisation dans le composant
    const stats = calculateStats(reports);



    return (
        <View style={{flex: 1}}>
            <Modal
                transparent
                animationType="slide"
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filtrer par</Text>
                        <TouchableOpacity onPress={() => {
                            setSearchBy(null);
                            setFilter("Tous");
                            setFiltered(reports);
                            setFilterModalVisible(false);
                        }}>
                            <Text style={styles.modalOption}>Tous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setSearchBy('Ville');
                            setFilter("Tous");
                            setFiltered(reports);
                            setFilterModalVisible(false);
                        }}>
                            <Text style={styles.modalOption}>Ville</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setSearchBy('Categorie');
                            setFilter("Tous");
                            setFiltered(reports);
                            setFilterModalVisible(false);
                        }}>
                            <Text style={styles.modalOption}>Catégorie</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setSearchBy('Urgence');
                            setFilter("Tous");
                            setFiltered(reports);
                            setFilterModalVisible(false);
                        }}>
                            <Text style={styles.modalOption}>Urgence</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            <Modal
                transparent
                animationType="slide"
                visible={filterOptionsModalVisible}
                onRequestClose={() => setFilterOptionsModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setFilterOptionsModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            onPress={() => {
                                setFiltered(reports);
                                setFilter("Tous");
                                setFilterOptionsModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalOption}>Tous</Text>
                        </TouchableOpacity>

                        {searchBy === 'Categorie' && (
                            <>
                                {categories.map((category: { id: string; name: string }) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        onPress={() => {
                                            const filteredReports = reports.filter((report: { category: string; }) => report.category === category.id);
                                            setFiltered(filteredReports);
                                            setFilter(category.name);
                                            setFilterOptionsModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.modalOption}>{category.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}

                        {searchBy === 'Urgence' && (
                            <>
                                {urgences.map((urgence) => (
                                    <TouchableOpacity
                                        key={urgence.value}
                                        onPress={() => {
                                            const filteredReports = reports.filter((report: { priority: number; }) => report.priority === urgence.value);
                                            setFiltered(filteredReports);
                                            setFilter(urgence.label);
                                            setFilterOptionsModalVisible(false);
                                        }}
                                    >
                                        <Text style={[styles.modalOption, {color: urgence.color}]}>
                                            {urgence.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}

                        {searchBy === 'Ville' && (
                            <>
                                {/* Créer une liste unique des villes */}
                                {[...new Set(reports.map((report: { location: string; }) => report.location))].map((location : any, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            const filteredReports = reports.filter((report: { location: string; }) => report.location === location);
                                            setFiltered(filteredReports);
                                            setFilter(location);
                                            setFilterOptionsModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.modalOption}>{location}</Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}
                    </View>
                </Pressable>
            </Modal>

            <FlatList
                style={{backgroundColor: '#fff'}}
                ListHeaderComponent={
                    <HeaderComponent
                        filter={filter}
                        stats={stats}
                        search={search}
                        setSearch={setSearch}
                        searchBy={searchBy}
                        setFilterModalVisible={setFilterModalVisible}
                        setFilterOptionsModalVisible={setFilterOptionsModalVisible}
                        resultCount={filtered?.length}
                    />
                }

                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Image source={{uri: item.image}} style={styles.cardImage}/>
                            <View style={styles.cardInfo}>
                                <View style={styles.cardRow}>
                                    <View style={[styles.dot, {backgroundColor: getStatusColor(item.status)}]}/>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                </View>
                                <Text style={styles.cardTitle}>
                                    {categories.find((cat: { id: any; }) => cat.id === item.category)?.name || 'Catégorie inconnue'}
                                </Text>
                                <Text style={styles.cardLocation}>
                                    <Ionicons name="location-sharp" size={14}/> {item.location}
                                </Text>
                                <Text style={styles.cardStatut}>Statut : {item.status === 'pending' ? "En attente" : item.status === 'in treatment' ? "En cours" : "Résolu"}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.infoButton}
                                onPress={() =>
                                    router.push({
                                        pathname: '/detail/[id]',
                                        params: {
                                            id: item.id.toString(),
                                            readonly: 'true',
                                        },
                                    })
                                }
                            >
                                <Ionicons name="information-circle-outline" size={24} color="#555"/>
                            </TouchableOpacity>

                        </View>
                    </View>
                )}
                contentContainerStyle={{padding: 16, paddingBottom: 30}}
            />
        </View>
    );
}

function getStatusColor(statut: string) {
    if (statut === 'pending') return 'orange';
    if (statut === 'in treatment') return '#007bff';
    return 'green';
}

/*function StatCard({label, value, color}: { label: string; value: number; color: string }) {
    return (
        <View style={[styles.cardStat, {backgroundColor: color}]}>
            <Text style={styles.cardValue}>{value}</Text>
            <Text style={styles.cardLabel}>{label}</Text>
        </View>
    );
}*/

const styles = StyleSheet.create({
    containerStat: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardStat: {
        width: '47%',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardLabel: {
        fontSize: 14,
        color: '#fff',
        marginTop: 4,
    },
    addButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 15,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        color: '#000',
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 8,
        borderRadius: 6,
    },
    resultCount: {
        color: '#666',
        fontSize: 13,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 15,
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    cardLocation: {
        fontSize: 13,
        color: '#555',
        marginBottom: 4,
    },
    cardStatut: {
        fontSize: 13,
        color: '#007bff',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    cardInfo: {
        flex: 1,
    },
    infoButton: {
        padding: 6,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 40,
        padding: 20,
        borderRadius: 10,
        elevation: 4,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalOption: {
        fontSize: 14,
        paddingVertical: 8,
    },
});