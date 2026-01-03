import { useRouter } from 'expo-router';
import { ArrowLeft, Brain, Calculator, Target } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Layout } from '../../components/native/Layout';
import { predictNextWorkout } from '../../services/geminiService';

export default function WeightPredictorScreen() {
    const router = useRouter();
    const [exercise, setExercise] = useState('');
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handlePredict = async () => {
        if (!exercise || !weight || !reps) {
            Alert.alert("Missing Info", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const data = await predictNextWorkout(exercise, weight, reps);
            setResult(data);
        } catch (error) {
            Alert.alert("Error", "AI could not generate a prediction. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Progression</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Brain size={40} color="#8b5cf6" />
                    </View>
                    <Text style={styles.title}>Predict Your Next Lift</Text>
                    <Text style={styles.subtitle}>
                        Enter your last set details, and AI will calculate your progressive overload target.
                    </Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Exercise Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Bench Press"
                                placeholderTextColor="#64748b"
                                value={exercise}
                                onChangeText={setExercise}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Weight (kg/lbs)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="60"
                                    keyboardType="numeric"
                                    placeholderTextColor="#64748b"
                                    value={weight}
                                    onChangeText={setWeight}
                                />
                            </View>
                            <View style={{ width: 16 }} />
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Reps</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="10"
                                    keyboardType="numeric"
                                    placeholderTextColor="#64748b"
                                    value={reps}
                                    onChangeText={setReps}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handlePredict}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Calculator size={20} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.buttonText}>Calculate Next Step</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {result && (
                    <View style={styles.resultCard}>
                        <View style={styles.resultHeader}>
                            <Target size={24} color="#22c55e" />
                            <Text style={styles.resultTitle}>Recommended Target</Text>
                        </View>
                        <Text style={styles.suggestion}>{result.suggestion}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.reason}>{result.reason}</Text>
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
        paddingBottom: 10,
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
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.2)',
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
    row: {
        flexDirection: 'row',
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
        backgroundColor: '#8b5cf6',
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        boxShadow: '0px 4px 8px rgba(139, 92, 246, 0.3)',
        elevation: 4,
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
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.2)',
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    suggestion: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4ade80',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 16,
    },
    reason: {
        fontSize: 14,
        color: '#cbd5e1',
        fontStyle: 'italic',
        lineHeight: 20,
    }
});
