import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAllReports, getAllReportsById, supabase} from "../api";
import {useUser} from "./user";
import {useProfile} from "./profile";

const ReportContext = createContext();
export const useReport = () => useContext(ReportContext);

export const ReportProvider = ({children}) => {
    const {user} = useUser();
    const {profile} = useProfile();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        const {data} = await supabase.auth.getSession();
        if (!data?.session) {
            throw new Error('User not authenticated');
        }
        setLoading(true);
        try {
            const cachedReports = await AsyncStorage.getItem('reports');
            if (cachedReports) {
                setReports(JSON.parse(cachedReports));
                setLoading(false);
                return;
            }

            let response, res, error;

            if (profile.role !== "citizen") {
                ({data: response, error} = await getAllReports());
            } else if (profile.role === "citizen") {
                ({res, error} = await getAllReportsById(user.id, data.session))
                response = res.data
            }

            if (error) {
                throw new Error(error);
            }
            setReports(response);
            await AsyncStorage.setItem('reports', JSON.stringify(response));
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
        fetchReports();
    }, [user]);

    return (
        <ReportContext.Provider value={{reports, loading, error, fetchReports}}>
            {children}
        </ReportContext.Provider>
    );
};