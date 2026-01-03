import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, ChevronLeft, Info, Save } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/native/Button';
import { Layout } from '../../components/native/Layout';
import { getActivePlan, saveActivePlan, saveHistoryLog, updateActivePlanProgress } from '../../services/userService';

export default function WorkoutResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [customName, setCustomName] = useState('');

    // Parse the plan or load active
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            if (params.type === 'active') {
                const active = await getActivePlan('workout');
                if (active) {
                    // Check for legacy weeklySchedule
                    const planData = active.plan;
                    if (!planData.schedule && planData.weeklySchedule) {
                        planData.schedule = planData.weeklySchedule;
                    }
                    setPlan(planData);
                    setCustomName(planData.planName || "My Workout");
                    setCheckedItems(active.checkedItems || []);
                }
            } else if (params.plan) {
                try {
                    const parsed = JSON.parse(params.plan as string);
                    // Check for legacy weeklySchedule
                    if (!parsed.schedule && parsed.weeklySchedule) {
                        parsed.schedule = parsed.weeklySchedule;
                    }
                    setPlan(parsed);
                    setCustomName(parsed.planName || "My Workout");
                    saveActivePlan('workout', parsed);
                } catch (e) {
                    console.error("Failed to parse plan", e);
                }
            }
            setLoading(false);
        };
        init();
    }, [params.plan, params.type]);

    useEffect(() => {
        if (plan) {
            const planWithCustomName = { ...plan, planName: customName || plan.planName };
            saveActivePlan('workout', planWithCustomName);
            updateActivePlanProgress('workout', checkedItems);
        }
    }, [customName, checkedItems]);

    if (loading) return <Layout><View style={styles.center}><Text style={{ color: '#fff' }}>Loading plan...</Text></View></Layout>;

    if (!plan) {
        return (
            <Layout>
                <View style={styles.center}>
                    <Text style={styles.errorText}>No plan data found.</Text>
                    <Button onPress={() => router.back()}>Go Back</Button>
                </View>
            </Layout>
        )
    }

    const toggleCheck = (id: string, name: string) => {
        if (checkedItems.includes(name)) {
            setCheckedItems(checkedItems.filter(i => i !== name));
        } else {
            setCheckedItems([...checkedItems, name]);
        }
    };

    const handleFinish = async () => {
        if (checkedItems.length === 0) {
            Alert.alert("No Progress", "You haven't checked any exercises!");
            return;
        }

        setSaving(true);
        const success = await saveHistoryLog({
            id: Date.now().toString(),
            type: 'workout',
            date: new Date().toISOString(),
            displayDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            title: plan.planName || "Workout Session",
            completedItems: checkedItems
        });
        setSaving(false);

        if (success) {
            Alert.alert("Great Job!", "Workout saved to history.", [
                { text: "View History", onPress: () => router.push('/(tabs)/history') },
                { text: "OK", onPress: () => router.push('/(tabs)/dashboard') }
            ]);
        } else {
            Alert.alert("Error", "Could not save history.");
        }
    };

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.nameInputContainer}>
                    <Text style={styles.labelSmall}>PLAN NAME</Text>
                    <TextInput
                        style={styles.nameInput}
                        value={customName}
                        onChangeText={setCustomName}
                        placeholder="Name your workout..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                    />
                </View>
                <TouchableOpacity style={styles.iconButton} onPress={handleFinish}>
                    <Save size={24} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Nutrition Tips */}
                {plan.nutritionTips && (
                    <View style={styles.card}>
                        <View style={[styles.cardHeader, { borderBottomColor: '#22c55e', borderBottomWidth: 1, paddingBottom: 8 }]}>
                            <Info size={20} color="#22c55e" />
                            <Text style={[styles.cardTitle, { color: '#22c55e' }]}>Nutrition Tips</Text>
                        </View>
                        <View style={styles.cardBody}>
                            {plan.nutritionTips.map((tip: string, idx: number) => (
                                <Text key={idx} style={styles.listItem}>• {tip}</Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* Schedule */}
                {plan.schedule && plan.schedule.map((dayPlan: any, index: number) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.dayText}>{dayPlan.day}</Text>
                            <Text style={styles.focusText}>{dayPlan.focus}</Text>
                        </View>
                        <View style={styles.cardBody}>
                            {dayPlan.exercises.map((ex: any, i: number) => {
                                const isChecked = checkedItems.includes(ex.name);
                                return (
                                    <TouchableOpacity
                                        key={i}
                                        style={[styles.exerciseRow, isChecked && styles.exerciseRowChecked]}
                                        onPress={() => toggleCheck(`${index}-${i}`, ex.name)}
                                    >
                                        <View style={{ marginRight: 12 }}>
                                            <CheckCircle size={24} color={isChecked ? "#22c55e" : "#334155"} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.exName, isChecked && styles.textChecked]}>{ex.name}</Text>
                                            <Text style={[styles.exTip, isChecked && styles.textChecked]}>{ex.tips}</Text>
                                        </View>
                                        <View style={styles.exStats}>
                                            <Text style={[styles.exSets, isChecked && styles.textChecked]}>{ex.sets} x {ex.reps}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}

                <Button onPress={handleFinish} loading={saving} fullWidth style={{ marginTop: 10, marginBottom: 20 }}>
                    Finish & Save to History
                </Button>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        marginBottom: 10,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    nameInputContainer: {
        flex: 1,
        marginHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    labelSmall: {
        fontSize: 10,
        color: '#3b82f6',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    nameInput: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 0,
    },
    iconButton: {
        padding: 8,
    },
    content: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
    },
    cardBody: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    dayText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    focusText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    listItem: {
        color: '#cbd5e1',
        marginBottom: 6,
        lineHeight: 20,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    exerciseRowChecked: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.2)',
    },
    textChecked: {
        textDecorationLine: 'line-through',
        opacity: 0.6,
        color: '#94a3b8',
    },
    exName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    exTip: {
        color: '#64748b',
        fontSize: 12,
        fontStyle: 'italic',
    },
    exStats: {
        alignItems: 'flex-end',
    },
    exSets: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 15,
    }
});
