import {Tabs} from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useNotificationStore } from '@/store/notificationStore';
import {Colors} from '@/constants/Colors';
import {useCategory} from "@/data/contexts/category";
import {useReport} from "@/data/contexts/reports";

export default function TabLayout() {
  const hasUnread = useNotificationStore((state) => state.hasUnread());

    useCategory();
    useReport();

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
                    tabBarIcon: ({ color }) => (
                        <View style={{ position: 'relative' }}>
                            <IconSymbol size={28} name="bell.fill" color={color} />
                            {hasUnread && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: -2,
                                        right: -2,
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: 'red',
                                    }}
                                />
                            )}
                        </View>
                    ),
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
