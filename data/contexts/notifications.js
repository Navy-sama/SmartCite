import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAllNotifications, getAllNotificationsById, supabase} from "../api";
import {useUser} from "./user";
import {useProfile} from "./profile";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const {user} = useUser();
    const {profile} = useProfile();
    const [reports, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
            throw new Error('User not authenticated');
        }
        setLoading(true);
        try {
            const cachedNotifications = await AsyncStorage.getItem('notifications');
            if (cachedNotifications) {
                setNotifications(JSON.parse(cachedNotifications));
                setLoading(false);
                return;
            }

            let response, error;

            if (profile.role !== "citizen") {
                ({ data: response, error } = await getAllNotifications());
            } else if (profile.role === "citizen") {
                ({ data: response, error } = await getAllNotificationsById(user.id, data.session));
            }

            if (error) {
                throw new Error(error);
            }
            setNotifications(response.data);
            await AsyncStorage.setItem('notifications', JSON.stringify(response.data));
        } catch (err) {
            setError(err.message || 'Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            AsyncStorage.removeItem('reports');
            // return;
        }
        fetchNotifications();
    }, [user]);

    return (
        <NotificationContext.Provider value={{ reports, loading, error, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};