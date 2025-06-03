import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAllCategories} from "../api";
import {useUser} from "@/data/contexts/user";

const CategoryContext = createContext();
export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
    const {user} = useUser();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const cachedCategories = await AsyncStorage.getItem('categories');
            if (cachedCategories) {
                setCategories(JSON.parse(cachedCategories));
                setLoading(false);
                return;
            }

            // Fetch from Edge Function
            const {data, error} = await getAllCategories()

            if (error) {
                throw new Error(error);
            }
            
            const res = setCategories(data);

            await AsyncStorage.setItem('categories', JSON.stringify(data));
        } catch (err) {
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            AsyncStorage.removeItem('categories');
            return;
        }
        fetchCategories();
    }, [user]);

    return (
        <CategoryContext.Provider value={{ categories, loading, error, fetchCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};