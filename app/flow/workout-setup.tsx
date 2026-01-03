import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/native/Button';
import { Input } from '../../components/native/Input';
import { Layout } from '../../components/native/Layout';
import { generateWorkoutPlan } from '../../services/geminiService';

export default function WorkoutSetupScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // State
    const [stats, setStats] = useState({
        age: '25',
        weight: '75',
        height: '180',
        goal: 'Lose Weight', // Default goal
    });

    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Mapping for full names if needed by AI, but short names usually works. 
    // Let's rely on short names or map them in service if strictly needed. 
    // AI understands Mon, Tue etc.

    const goals = ['Lose Weight', 'Build Muscle', 'Get Stronger', 'Endurance', 'Flexibility'];

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleGenerate = async () => {
        if (selectedDays.length === 0) {
            Alert.alert("Missing Info", "Please select at least one workout day.");
            return;
        }

        setLoading(true);
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            const firstName = userProfile ? JSON.parse(userProfile).firstName : 'User';

            // Pass selectedDays as string array
            const fullStats = { ...stats, firstName, selectedDays };
            const plan = await generateWorkoutPlan(fullStats);
            setLoading(false);

            router.push({
                pathname: "/flow/workout-result",
                params: { plan: JSON.stringify(plan) }
            });

        } catch (error: any) {
            setLoading(false);
            console.error("Generator Error Details:", error);
            Alert.alert(
                "Generation Failed",
                `AI could not create the plan.\nReason: ${error.message || 'Unknown error'}`
            );
        }
    };

    return (
        <Layout>
            <View style={styles.header}>
                <Button variant="outline" onPress={() => router.back()} style={{ paddingVertical: 8, paddingHorizontal: 12, width: 'auto' }}>
                    <ArrowLeft size={20} color="#60a5fa" />
                </Button>
                <Text style={styles.title}>Create Workout Plan</Text>
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.sectionTitle}>Your Stats</Text>

                <View style={styles.row}>
                    <Input
                        label="Age"
                        value={stats.age}
                        onChangeText={t => setStats({ ...stats, age: t })}
                        keyboardType="numeric"
                        style={{ flex: 1, marginRight: 8 }}
                    />
                    <Input
                        label="Weight (kg)"
                        value={stats.weight}
                        onChangeText={t => setStats({ ...stats, weight: t })}
                        keyboardType="numeric"
                        style={{ flex: 1, marginLeft: 8 }}
                    />
                </View>
                <Input
                    label="Height (cm)"
                    value={stats.height}
                    onChangeText={t => setStats({ ...stats, height: t })}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Workout Days</Text>
                <View style={styles.daysContainer}>
                    {days.map((day) => (
                        <TouchableOpacity
                            key={day}
                            style={[styles.dayButton, selectedDays.includes(day) && styles.dayButtonActive]}
                            onPress={() => toggleDay(day)}
                        >
                            <Text style={[styles.dayText, selectedDays.includes(day) && styles.dayTextActive]}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={{ color: '#64748b', fontSize: 12, marginTop: 4, marginBottom: 16 }}>
                    Select the days you want to workout.
                </Text>


                <Text style={styles.label}>Your Main Goal</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                    {goals.map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[styles.chip, stats.goal === g && styles.chipActive]}
                            onPress={() => setStats({ ...stats, goal: g })}
                        >
                            <Text style={[styles.chipText, stats.goal === g && styles.chipTextActive]}>
                                {g}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>


                <View style={{ height: 20 }} />

                <Button onPress={handleGenerate} loading={loading} fullWidth>
                    Generate with AI
                </Button>

            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    form: {
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#94a3b8',
        marginBottom: 16,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    label: {
        color: '#cbd5e1',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 12,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    dayButtonActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    dayText: {
        color: '#94a3b8',
        fontWeight: '600',
        fontSize: 12,
    },
    dayTextActive: {
        color: '#fff',
    },
    chipContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    chipActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    chipText: {
        color: '#94a3b8',
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#fff',
    }
});
