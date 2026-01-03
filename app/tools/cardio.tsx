import { useRouter } from 'expo-router';
import { ArrowLeft, Flame, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Layout } from '../../components/native/Layout';

const CARDIO_TYPES = [
    { id: 'run', name: 'Running', icon: '🏃' },
    { id: 'cycle', name: 'Cycling', icon: '🚴' },
    { id: 'walk', name: 'Walking', icon: '🚶' },
    { id: 'hiit', name: 'HIIT', icon: '⚡' },
];

export default function CardioScreen() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState('run');
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleToggle = () => {
        setIsActive(!isActive);
    };

    const handleFinish = () => {
        setIsActive(false);
        Alert.alert("Great Work!", `You completed a ${formatTime(seconds)} ${CARDIO_TYPES.find(c => c.id === selectedType)?.name} session.`);
        setSeconds(0);
    };

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cardio Tracker</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Activity Selector */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                    {CARDIO_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            style={[styles.typeCard, selectedType === type.id && styles.typeCardActive]}
                            onPress={() => !isActive && setSelectedType(type.id)}
                        >
                            <Text style={{ fontSize: 24, marginBottom: 8 }}>{type.icon}</Text>
                            <Text style={[styles.typeText, selectedType === type.id && styles.typeTextActive]}>
                                {type.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Timer Display */}
                <View style={styles.timerCard}>
                    <View style={styles.timerRing}>
                        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
                        <Text style={styles.timerLabel}>DURATION</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Flame size={20} color="#f97316" />
                            <Text style={styles.statVal}>{(seconds * 0.15).toFixed(0)}</Text>
                            <Text style={styles.statLabel}>KCAL</Text>
                        </View>
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.btn, styles.btnMain, isActive && { backgroundColor: '#eab308' }]}
                        onPress={handleToggle}
                    >
                        {isActive ? (
                            <Text style={styles.btnText}>PAUSE</Text>
                        ) : (
                            <>
                                <Play size={24} color="#fff" fill="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.btnText}>START</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {(seconds > 0 && !isActive) && (
                        <TouchableOpacity style={[styles.btn, styles.btnSec]} onPress={handleFinish}>
                            <Text style={styles.btnText}>FINISH</Text>
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>
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
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    container: {
        padding: 20,
    },
    typeScroll: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    typeCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 20,
        padding: 16,
        paddingHorizontal: 24,
        marginRight: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    typeCardActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
    },
    typeText: {
        color: '#94a3b8',
        fontWeight: '600',
    },
    typeTextActive: {
        color: '#fff',
    },
    timerCard: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    timerRing: {
        width: 240,
        height: 240,
        borderRadius: 120,
        borderWidth: 8,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        fontVariant: ['tabular-nums'],
    },
    timerLabel: {
        color: '#64748b',
        fontSize: 12,
        letterSpacing: 2,
        marginTop: 8,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 24,
    },
    stat: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
    },
    statVal: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: 'bold',
    },
    controls: {
        gap: 16,
    },
    btn: {
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    btnMain: {
        backgroundColor: '#22c55e',
    },
    btnSec: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});
