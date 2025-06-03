import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config'; // ← import du fichier que tu viens de créer

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import UserProvider from "@/data/contexts/user";
import ProfileProvider from "@/data/contexts/profile";
import {CategoryProvider} from "@/data/contexts/category";

export default function RootLayout() {

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        // TwemojiMozilla: require('../assets/fonts/TwemojiMozilla.woff2'),
    });

  if (!loaded) {
    return null
  }

    return (
        <TamaguiProvider config={config}>
            <ThemeProvider value={DefaultTheme}>
                <UserProvider>
                    <ProfileProvider>
                        <CategoryProvider>
                            <Stack>
                                <Stack.Screen name="index" options={{headerShown: false}}/>
                                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                                <Stack.Screen name="+not-found"/>
                                <Stack.Screen name="signaler" options={{ headerShown: true, title: 'Ajouter un signalement' }}/>
                            </Stack>
                            <StatusBar style="auto"/>
                        </CategoryProvider>
                    </ProfileProvider>
                </UserProvider>
            </ThemeProvider>
        </TamaguiProvider>
    );
}
