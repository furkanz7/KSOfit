import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SettingsProvider } from '../providers/SettingsContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
console.log('[Layout] JS Bundle Executing, calling preventAutoHideAsync');
//SplashScreen.preventAutoHideAsync().catch((e) => console.warn('[Layout] preventAutoHideAsync error:', e));

export default function RootLayout() {
    const [loaded, error] = useFonts({
        ...Ionicons.font,
    });

    // Debug logging
    useEffect(() => {
        console.log('[Layout] Layout mounted');
        console.log('[Layout] Fonts loaded:', loaded);
        console.log('[Layout] Font error:', error);
    }, [loaded, error]);

    useEffect(() => {
        async function prepare() {
            try {
                if (loaded || error) {
                    console.log('[Layout] Attempting to hide splash screen...');
                    await SplashScreen.hideAsync().catch((e) => console.warn('[Layout] hideAsync error:', e));
                    console.log('[Layout] Splash screen hidden request sent');
                }
            } catch (e) {
                console.warn('[Layout] prepare error:', e);
            }
        }
        prepare();
    }, [loaded, error]);

    // Safety timeout: If stuff takes too long (>5s), hide splash anyway to prevent bundling hang perception
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('[Layout] Safety timeout triggered (5s)');
            SplashScreen.hideAsync().catch((e) => console.warn('[Layout] Timeout hideAsync error:', e));
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!loaded && !error) {
        return null;
    }

    return (
        <SettingsProvider>
            <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </View>
        </SettingsProvider>
    );
}
