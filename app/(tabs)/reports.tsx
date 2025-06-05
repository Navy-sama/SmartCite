import {FlatList, StyleSheet, Text, View} from 'react-native';
import SignalementCard from '../../components/SignalementCard';
import {useReport} from "@/data/contexts/reports";

export default function ReportsScreen() {
    const {reports} = useReport();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mes Signalements</Text>

            <FlatList
                data={reports}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <SignalementCard signalement={item}/>}
                ListEmptyComponent={<Text>Aucun signalement pour l’instant.</Text>}
                contentContainerStyle={{margin: 20}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 15, backgroundColor: '#fff'},
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 50,
        textAlign: 'center',
        color: '#333',
    },
});
