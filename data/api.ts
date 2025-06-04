import AsyncStorage from '@react-native-async-storage/async-storage';
import { processLock } from "@supabase/auth-js/src/lib/locks";
import { createClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { AppState, Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY
const redirectTo = Linking.createURL('auth/callback');

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Anon Key must be provided in environment variables');
}

// Create Supabase client with platform-specific configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: Platform.OS === 'web' ? undefined : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
        lock: Platform.OS === 'web' ? undefined : processLock,
    },
})

/*export async function handleDeepLink(url: string) {
    if (!url) return null;

    // Supabase uses # for tokens in the URL fragment; convert to ? for parsing
    const accessibleUrl = url.replace('#', '?');
    const { params, errorCode } = QueryParams.getQueryParams(accessibleUrl);

    if (errorCode) {
        throw new Error(errorCode);
    }

    const { access_token, refresh_token } = params;
    if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        });
        if (error) {
            throw new Error(error.message);
        }
        return data.session; // Return the session for further use
    }
    return null;
}*/

// Only add AppState listener on native platforms
if (Platform.OS !== 'web') {
    AppState.addEventListener('change', (state) => {
        if (state === 'active') {
            supabase.auth.startAutoRefresh()
        } else {
            supabase.auth.stopAutoRefresh()
        }
    })
}

export async function signUp(email: string, password: string, username: string) {
    const {data, error} = await supabase.auth.signUp({
        email: `${email}`, // Temporary email
        password,
        options: {
            data: {username, display_name : username},
            emailRedirectTo: redirectTo,
        },
    });
    if (error) throw new Error(error.message);
    return data;
}

export async function signIn(username: string, password: string) {
    const {data, error} = await supabase.functions.invoke('get-profile', {
        body: { username: username },
    })

    const email = data?.profile?.email;

    if (error) throw new Error(error);
    if (!email) throw new Error('Username not found');

    const {data: userData, error: authError} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError) throw new Error(authError.message);
    return userData;
}

export async function getCurrentUser() {
    const {data: {user}, error} = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return user;
}

export async function getCurrentProfile(username: string) {
    const {data: {profile}, error} = await supabase.functions.invoke('get-profile', {
        body: { username: username },
    })
    if (error) throw new Error(error.message);
    return profile;
}

export async function updateUser(email: string) {
    const { data, error } = await supabase.auth.updateUser({
        email: email,
    })

    if (error) throw new Error(error.message);
    return {success: true, data: data};
}

export async function updateProfile(id: string, updates: any) {
    const {data, error} = await supabase.functions.invoke('update-profile', {
        body: { id: id, updates: updates },
    });

    if (error) throw new Error(error.message);
    return {success: true, data: data};
}

export async function uploadAvatar(arraybuffer: ArrayBuffer, path: string, image: any) {
    const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
            contentType: image.mimeType ?? 'image/jpeg',
        })
    if (uploadError) throw new Error(uploadError.message)
    const { data: avatar } = supabase.storage
        .from('avatars')
        .getPublicUrl(data?.path);
    return {publicUrl : avatar.publicUrl};
}

export async function deleteAvatar(path: string) {
    return supabase.storage
        .from('avatars')
        .remove([path]);
}

export async function signOut() {
    const {error} = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return {success: true};
}

export async function getAllCategories() {
    const { data, error } = await supabase.functions.invoke('get-all-categories')
    if (error) throw new Error(error.message);
    return {data, error};
}