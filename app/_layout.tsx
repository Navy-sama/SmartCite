import {DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import UserProvider from "@/data/contexts/user";
import ProfileProvider from "@/data/contexts/profile";

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <ThemeProvider value={DefaultTheme}>
            <UserProvider>
                <ProfileProvider>
                    <Stack>
                        <Stack.Screen name="index" options={{headerShown: false}}/>
                        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                        <Stack.Screen name="+not-found"/>
                    </Stack>
                    <StatusBar style="auto"/>
                </ProfileProvider>
            </UserProvider>
        </ThemeProvider>
    );
}
