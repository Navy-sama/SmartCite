import AsyncStorage from '@react-native-async-storage/async-storage'
import {createClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Anon Key must be provided in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})

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

export async function signUp(email: string, password: string, username: string) {
    const {data, error} = await supabase.auth.signUp({
        email: `${email}`, // Temporary email
        password,
        options: {
            data: {username, display_name : username}, // Pass username in metadata
        },
    });
    if (error) throw new Error(error.message);
    return data;
}

export async function signIn(username: string, password: string) {
    const {data, error} = await supabase.functions.invoke('retrieve-email-by-username', {
        body: { username: username },
    })

    const email = data?.email;

    if (error) throw new Error(error);
    if (!email) throw new Error('Username not found');

    const {data: userData, error: authError} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError) throw new Error(authError.message);
    return userData;
}

export async function signOut() {
    const {error} = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return {success: true};
}

export async function updateProfile(username: string) {
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const {error} = await supabase
        .from('profiles')
        .update({display_name: username})
        .eq('id', user.id);

    if (error) throw new Error(error.message);
    return {success: true};
}