import React from 'react';
import { ImageBackground, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Eğer expo-linear-gradient yoksa düz View overlay kullanacağız. Şimdilik düz View ile yapalım risk almamak için.

import { useSettings } from '../../providers/SettingsContext';

interface LayoutProps {
    children: React.ReactNode;
    backgroundImage?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, backgroundImage }) => {
    const { colors } = useSettings();

    const bgImage = backgroundImage
        ? { uri: backgroundImage }
        : { uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop" };

    const isCustomBg = !!backgroundImage;

    const overlayColor = isCustomBg
        ? 'rgba(0,0,0,0.7)'
        : colors.background + 'E6'; // 90% opacity

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            {/* Background Image Layer */}
            <ImageBackground
                source={bgImage}
                style={styles.backgroundImage}
                resizeMode="cover"
                blurRadius={isCustomBg ? 2 : 0}
            >
                {/* Overlay Layer */}
                <View style={[
                    styles.overlay,
                    { backgroundColor: overlayColor }
                ]} />

                {/* Content Layer */}
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.content}>
                        {children}
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a', // Slate-900 backup
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        width: '100%',
        maxWidth: 500, // Tabletlerde çok genişlememesi için
        alignSelf: 'center',
    }
});
