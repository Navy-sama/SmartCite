// components/HeaderComponent.tsx
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

interface ReportStats {
    total: number;
    pending: number;
    inTreatment: number;
    resolved: number;
}

export default function HeaderComponent({
                                            filter,
                                            stats,
                                            search,
                                            setSearch,
                                            searchBy,
                                            setFilterModalVisible,
                                            setFilterOptionsModalVisible,
                                            resultCount,
                                        }: {
    filter: string;
    stats: ReportStats;
    search: string;
    setSearch: (text: string) => void;
    searchBy: 'Ville' | 'Categorie' | 'Urgence' | null;
    setFilterModalVisible: (visible: boolean) => void;
    setFilterOptionsModalVisible: (visible: boolean) => void;
    resultCount: number;
}) {
    const router = useRouter();
    const [isFocused, setIsFocused] = useState(false);


    return (
        <View style={styles.containerStat}>
            <Text style={styles.title}>Statistiques générales</Text>
            <View style={styles.grid}>
                <StatCard label="Total" value={stats.total} color="black"/>
                <StatCard label="En attente" value={stats.pending} color="black"/>
                <StatCard label="En cours" value={stats.inTreatment} color="black"/>
                <StatCard label="Résolus" value={stats.resolved} color="black"/>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-report')}>
                <Text style={styles.addButtonText}>Ajouter</Text>
            </TouchableOpacity>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#555" style={{marginRight: 8}}/>
                <TextInput
                    style={[
                        styles.searchInput,
                        isFocused && {borderColor: 'transparent'}
                    ]}
                    value={search}
                    onChangeText={setSearch}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Rechercher..."
                    placeholderTextColor="#888"
                />


            </View>

            <View style={styles.filterRow}>
                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                    <Text style={{marginRight: 4}}>
                        Filtrer par
                        : {searchBy === 'Ville' ? 'Ville'
                        : searchBy === "Categorie" ? 'Catégorie'
                            : searchBy === 'Urgence' ? 'Urgence' : 'Tous'}
                    </Text>
                    <Ionicons name="chevron-down" size={16}/>
                </TouchableOpacity>

                {searchBy !== null && <TouchableOpacity style={styles.filterButton} onPress={() => setFilterOptionsModalVisible(true)}>
                    <Text style={{marginRight: 4}}>
                        {filter}
                    </Text>
                    <Ionicons name="chevron-down" size={16}/>
                </TouchableOpacity>}

                <Text style={styles.resultCount}>{resultCount} résultat(s)</Text>
            </View>

            <Text style={styles.sectionTitle}>Liste des signalements récents</Text>
        </View>
    );
}

function StatCard({label, value, color}: { label: string; value: number; color: string }) {
    return (
        <View style={[styles.cardStat, {backgroundColor: color}]}>
            <Text style={styles.cardValue}>{value}</Text>
            <Text style={styles.cardLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    containerStat: {
        padding: 20,
        backgroundColor: '#fff',
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
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 8,
        paddingHorizontal: 12,
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
});
