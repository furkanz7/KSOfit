import { useRouter } from 'expo-router';
import { ArrowLeft, Calculator, Dumbbell } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Layout } from '../../components/native/Layout';

export default function OneRepMaxScreen() {
    const router = useRouter();
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [result, setResult] = useState<number | null>(null);

    const calculateOneRepMax = () => {
        const w = parseFloat(weight);
        const r = parseFloat(reps);

        if (w && r) {
            // Epley Formula: 1RM = w * (1 + r / 30)
            const oneRepMax = w * (1 + r / 30);
            setResult(Math.round(oneRepMax));
        }
    };

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>1RM Calculator</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Dumbbell size={40} color="#3b82f6" />
                    </View>
                    <Text style={styles.title}>Calculate Your Strength</Text>
                    <Text style={styles.subtitle}>
                        Estimate your one-rep max based on your current lifts. Use this to track your strength gains.
                    </Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Weight Lifted (kg)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 80"
                                keyboardType="numeric"
                                placeholderTextColor="#64748b"
                                value={weight}
                                onChangeText={setWeight}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Reps Performed</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 5"
                                keyboardType="numeric"
                                placeholderTextColor="#64748b"
                                value={reps}
                                onChangeText={setReps}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={calculateOneRepMax}>
                            <Calculator size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Calculate 1RM</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {result !== null && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>Estimated 1 Rep Max</Text>
                        <Text style={styles.resultValue}>{result} kg</Text>
                        <Text style={styles.resultDesc}>
                            This is the theoretical maximum weight you can lift for one repetition with good form.
                        </Text>
                    </View>
                )}
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
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    form: {
        width: '100%',
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: '#cbd5e1',
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    button: {
        backgroundColor: '#3b82f6',
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultCard: {
        marginTop: 24,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderRadius: 24,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.2)',
        alignItems: 'center',
    },
    resultLabel: {
        color: '#4ade80',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    resultValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    resultDesc: {
        color: '#94a3b8',
        textAlign: 'center',
        fontSize: 14,
    }
});
