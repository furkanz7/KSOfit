import { useRouter } from 'expo-router';
import { ArrowLeft, RotateCcw, Timer, Trophy, Zap } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Layout } from '../../components/native/Layout';

const { width } = Dimensions.get('window');

export default function ReflexGameScreen() {
    const router = useRouter();
    const [gameState, setGameState] = useState<'IDLE' | 'WAITING' | 'READY' | 'FINISHED' | 'TOO_EARLY'>('IDLE');
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(0);
    const [bestTime, setBestTime] = useState(0);

    // Use any to bypass strict Timer type issues in some RN environments
    const timerRef = useRef<any>(null);

    const startGame = () => {
        setGameState('WAITING');
        const randomDelay = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds

        timerRef.current = setTimeout(() => {
            setGameState('READY');
            setStartTime(Date.now());
        }, randomDelay);
    };

    const handleTap = () => {
        if (gameState === 'WAITING') {
            if (timerRef.current) clearTimeout(timerRef.current);
            setGameState('TOO_EARLY');
            return;
        }

        if (gameState === 'READY') {
            const time = Date.now() - startTime;
            setReactionTime(time);
            setGameState('FINISHED');
            if (bestTime === 0 || time < bestTime) {
                setBestTime(time);
            }
        }
    };

    const resetGame = () => {
        setGameState('IDLE');
        setReactionTime(0);
    };

    const getStatusColor = () => {
        switch (gameState) {
            case 'WAITING': return '#ef4444'; // Red
            case 'READY': return '#22c55e'; // Green
            case 'TOO_EARLY': return '#f59e0b'; // Orange
            case 'FINISHED': return '#3b82f6'; // Blue
            default: return '#334155'; // Slate
        }
    };

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mind-Muscle Link</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.container}>
                {gameState === 'IDLE' ? (
                    <View style={styles.startScreen}>
                        <Zap size={64} color="#f59e0b" style={{ marginBottom: 20 }} />
                        <Text style={styles.title}>Reflex Test</Text>
                        <Text style={styles.desc}>
                            Tap when the screen turns GREEN.
                        </Text>
                        <TouchableOpacity style={styles.btnPrimary} onPress={startGame}>
                            <Text style={styles.btnText}>Start Game</Text>
                        </TouchableOpacity>

                        {bestTime > 0 && (
                            <View style={styles.bestScore}>
                                <Trophy size={20} color="#fbbf24" />
                                <Text style={styles.bestScoreText}>Best: {bestTime} ms</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.gameArea, { backgroundColor: getStatusColor() }]}
                        onPress={handleTap}
                    >
                        {gameState === 'WAITING' && (
                            <Text style={styles.gameText}>WAIT FOR GREEN...</Text>
                        )}
                        {gameState === 'READY' && (
                            <Text style={styles.gameText}>TAP NOW!</Text>
                        )}
                        {gameState === 'TOO_EARLY' && (
                            <View style={styles.resultBox}>
                                <Text style={styles.gameText}>Too early!</Text>
                                <TouchableOpacity style={styles.btnRetry} onPress={startGame}>
                                    <Text style={styles.btnTextSmall}>Try Again</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {gameState === 'FINISHED' && (
                            <View style={styles.resultBox}>
                                <View style={styles.timeContainer}>
                                    <Timer size={32} color="#fff" style={{ marginRight: 10 }} />
                                    <Text style={styles.timeText}>{reactionTime} ms</Text>
                                </View>

                                <View style={styles.rankBadge}>
                                    <Trophy size={16} color="#fbbf24" style={{ marginRight: 6 }} />
                                    <Text style={styles.rankText}>
                                        {reactionTime < 200 ? "GRANDMASTER" :
                                            reactionTime < 250 ? "ELITE" :
                                                reactionTime < 300 ? "PROFESSIONAL" :
                                                    reactionTime < 350 ? "ADVANCED" : "ROOKIE"}
                                    </Text>
                                </View>

                                <Text style={styles.comment}>
                                    {reactionTime < 200 ? "Incredible speed! Unmatched reflexes." :
                                        reactionTime < 300 ? "Excellent reaction time." : "Keep training to improve speed."}
                                </Text>
                                <TouchableOpacity style={styles.btnRetry} onPress={startGame}>
                                    <RotateCcw size={20} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.btnTextSmall}>Play Again</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnHome} onPress={resetGame}>
                                    <Text style={styles.btnHomeText}>Menu</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        // @ts-ignore
        textShadow: '0px 1px 4px rgba(0,0,0,0.5)',
    },
    container: {
        flex: 1,
    },
    startScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    desc: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 40,
    },
    btnPrimary: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 30,
        boxShadow: '0px 4px 8px rgba(59, 130, 246, 0.3)',
        elevation: 5,
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bestScore: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        padding: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    bestScoreText: {
        color: '#fbbf24',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
    },
    gameArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    resultBox: {
        alignItems: 'center',
    },
    timeText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    comment: {
        fontSize: 20,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 30,
    },
    btnRetry: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginTop: 10,
    },
    btnTextSmall: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnHome: {
        marginTop: 20,
    },
    btnHomeText: {
        color: 'rgba(255,255,255,0.6)',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    rankBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.4)',
    },
    rankText: {
        color: '#fbbf24',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    }
});
