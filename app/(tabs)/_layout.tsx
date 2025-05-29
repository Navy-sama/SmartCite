import {Tabs} from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors['light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {
                        height: 60
                    },
                }),
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: '',
                    tabBarShowLabel: false,
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    title: '',
                    tabBarShowLabel: false,
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="alarm" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: '',
                    tabBarShowLabel: false,
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="note" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: '',
                    tabBarShowLabel: false,
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="person" color={color}/>,
                }}
            />
        </Tabs>
    );
}
