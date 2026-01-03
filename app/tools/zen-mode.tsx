import { useRouter } from 'expo-router';
import { ArrowLeft, Palette, Wind } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Layout } from '../../components/native/Layout';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.6;

const THEMES = [
    { name: 'Calm Blue', color: '#60a5fa' },
    { name: 'Nature Green', color: '#4ade80' },
    { name: 'Sunset Orange', color: '#fb923c' },
    { name: 'Lavender', color: '#a78bfa' },
];

export default function ZenModeScreen() {
    const router = useRouter();
    const [phase, setPhase] = useState('Inhale');
    const [themeIndex, setThemeIndex] = useState(0);

    // Animation Values
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0.3)).current;

    const currentTheme = THEMES[themeIndex];

    useEffect(() => {
        startBreathingCycle();
        return () => {
            scaleAnim.stopAnimation();
        };
    }, []);

    const toggleTheme = () => {
        setThemeIndex((prev) => (prev + 1) % THEMES.length);
    };

    const startBreathingCycle = () => {
        // 4-4-4 Box Breathing
        setPhase('Inhale');
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1.5,
                duration: 4000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
            })
        ]).start(() => {
            setPhase('Hold');
            setTimeout(() => {
                setPhase('Exhale');
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 0.3,
                        duration: 4000,
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    startBreathingCycle();
                });
            }, 4000);
        });
    };

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Zen Mode</Text>

                <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                    <Palette size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={styles.circleContainer}>
                    <Animated.View style={[
                        styles.breathingCircle,
                        {
                            backgroundColor: currentTheme.color,
                            transform: [{ scale: scaleAnim }],
                            opacity: fadeAnim,
                        }
                    ]}>
                        <View style={styles.innerCircle} />
                    </Animated.View>
                </View>

                <View style={styles.textContainer}>
                    <Wind size={32} color={currentTheme.color} style={{ marginBottom: 16 }} />
                    <Text style={styles.phaseText}>{phase}</Text>
                    <Text style={styles.subText}>
                        {phase === 'Inhale' ? 'Breathe in deeply...' :
                            phase === 'Hold' ? 'Hold for a moment...' :
                                'Breathe out slowly...'}
                    </Text>

                    <View style={styles.themeIndicator}>
                        <View style={[styles.dot, { backgroundColor: currentTheme.color }]} />
                        <Text style={styles.themeName}>{currentTheme.name}</Text>
                    </View>
                </View>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
    },
    themeButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleContainer: {
        height: CIRCLE_SIZE * 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    breathingCircle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        width: CIRCLE_SIZE * 0.9,
        height: CIRCLE_SIZE * 0.9,
        borderRadius: (CIRCLE_SIZE * 0.9) / 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    phaseText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subText: {
        fontSize: 18,
        color: '#94a3b8',
        marginBottom: 24,
    },
    themeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    themeName: {
        color: '#cbd5e1',
        fontSize: 12,
        fontWeight: '500',
    }
});
