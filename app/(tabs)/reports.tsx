import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SignalementCard from '../../components/SignalementCard';
import {useSignalementStore} from '@/store/signalementStore';
import {MaterialIcons} from "@expo/vector-icons";
import {router} from "expo-router";

export default function ReportsScreen() {
    const {signalements} = useSignalementStore();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mes Signalements</Text>

            <FlatList
                data={signalements}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <SignalementCard signalement={item}/>}
                ListEmptyComponent={<Text>Aucun signalement pour l’instant.</Text>}
                contentContainerStyle={{margin: 20}}
            />

            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <TouchableOpacity onPress={() => router.push("../signaler")}>
                    <View style={{
                        backgroundColor: '#aaff00',
                        width: 50,
                        borderRadius: 50,
                    }}>
                        <MaterialIcons name="add" size={48} color="#666"/>
                    </View>
                </TouchableOpacity>
            </View>
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
