import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCategory } from '@/data/contexts/category';

const CustomCategoryPicker = ({ value, field, setFieldValue }) => {
    const { categories } = useCategory();
    const [selectedCategoryId, setSelectedCategoryId] = useState(value || null);
    const [modalVisible, setModalVisible] = useState(false);

    const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

    return (
        <>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={(e) => {
                    setModalVisible(true)
                }}
            >
                <Text style={[styles.text, !selectedCategory && {color: '#999'}]}>
                    {selectedCategory?.icon && <MaterialIcons name={selectedCategory.icon} size={21} />}
                    {selectedCategory ? selectedCategory.name : 'Choisissez une catégorie'}
                </Text>
            </TouchableOpacity>

            {modalVisible && <Modal
                visible={true}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSelectedCategoryId(item.id);
                                        setFieldValue(field, item.id, true); // Update Formik immediately
                                        setModalVisible(false);
                                    }}
                                >
                                    {item.icon && <MaterialIcons name={item.icon} size={24} color="#000" />}
                                    <Text style={styles.modalItemText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
    },
    pickerButton: {
        /*padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginBottom: 15,*/
    },
    text: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 8,
        maxHeight: '80%',
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    modalItemText: {
        fontSize: 16,
        marginLeft: 10,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 4,
        margin: 10,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 4,
        marginTop: 8,
    },
    retryText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default CustomCategoryPicker;