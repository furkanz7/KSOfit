import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Save, Utensils } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/native/Button';
import { Layout } from '../../components/native/Layout';
import { getActivePlan, saveActivePlan, saveHistoryLog, updateActivePlanProgress } from '../../services/userService';

export default function NutritionResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [customName, setCustomName] = useState('');
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    useEffect(() => {
        const init = async () => {
            if (params.type === 'active') {
                const active = await getActivePlan('nutrition');
                if (active) {
                    setPlan(active.plan);
                    setCustomName(active.plan.planName || "My Nutrition");
                    setCheckedItems(active.checkedItems || []);
                }
            } else if (params.plan) {
                try {
                    const parsed = JSON.parse(params.plan as string);
                    setPlan(parsed);
                    setCustomName(parsed.planName || "My Nutrition");
                    saveActivePlan('nutrition', parsed);
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
            saveActivePlan('nutrition', { ...plan, planName: customName });
            updateActivePlanProgress('nutrition', checkedItems);
        }
    }, [customName, checkedItems]);

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

    const toggleCheck = (name: string) => {
        if (checkedItems.includes(name)) {
            setCheckedItems(checkedItems.filter(i => i !== name));
        } else {
            setCheckedItems([...checkedItems, name]);
        }
    };

    const handleFinish = async () => {
        if (checkedItems.length === 0) {
            Alert.alert("No Progress", "You haven't checked any meals!");
            return;
        }

        const success = await saveHistoryLog({
            id: Date.now().toString(),
            type: 'nutrition',
            date: new Date().toISOString(),
            displayDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            title: customName || "Nutrition Day",
            completedItems: checkedItems
        });

        if (success) {
            Alert.alert("Good Eating!", "Nutrition log saved to history.", [
                { text: "View History", onPress: () => router.push('/(tabs)/history') },
                { text: "OK", onPress: () => router.push('/(tabs)/dashboard') }
            ]);
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
                        placeholder="Name your diet..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                    />
                </View>
                <TouchableOpacity style={styles.iconButton} onPress={handleFinish}>
                    <Save size={24} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Macros Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.totalCalories}>{plan.dailyCalories || "0"} Kcal</Text>
                    <Text style={styles.summaryLabel}>Daily Target</Text>

                    <View style={styles.macroRow}>
                        <View style={styles.macroBox}>
                            <Text style={[styles.macroVal, { color: '#3b82f6' }]}>{plan.macroTargets?.protein || 0}g</Text>
                            <Text style={styles.macroLabel}>Protein</Text>
                        </View>
                        <View style={[styles.vertLine, { backgroundColor: '#3b82f6' }]} />
                        <View style={styles.macroBox}>
                            <Text style={[styles.macroVal, { color: '#22c55e' }]}>{plan.macroTargets?.carbs || 0}g</Text>
                            <Text style={styles.macroLabel}>Carbs</Text>
                        </View>
                        <View style={[styles.vertLine, { backgroundColor: '#22c55e' }]} />
                        <View style={styles.macroBox}>
                            <Text style={[styles.macroVal, { color: '#eab308' }]}>{plan.macroTargets?.fats || 0}g</Text>
                            <Text style={styles.macroLabel}>Fats</Text>
                        </View>
                    </View>
                </View>

                {/* Meals */}
                {plan.meals && plan.meals.map((meal: any, index: number) => {
                    const isChecked = checkedItems.includes(meal.name);
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.card, isChecked && styles.cardChecked]}
                            onPress={() => toggleCheck(meal.name)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.cardHeader}>
                                <Utensils size={18} color={isChecked ? "#64748b" : "#94a3b8"} />
                                <Text style={[styles.mealName, isChecked && styles.textChecked]}>{meal.name}</Text>
                                <View style={[styles.checkbox, isChecked && { backgroundColor: '#10b981', borderColor: 'transparent' }]}>
                                    {isChecked && <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>}
                                </View>
                            </View>
                            <View style={styles.cardBody}>
                                <Text style={[styles.mealCals, isChecked && styles.textChecked]}>{meal.calories} kcal • {meal.macros}</Text>
                                <View style={styles.ingredientsBox}>
                                    <Text style={[styles.ingTitle, isChecked && styles.textChecked]}>Ingredients:</Text>
                                    {meal.ingredients && meal.ingredients.map((ing: string, i: number) => (
                                        <Text key={i} style={[styles.ingItem, isChecked && styles.textChecked]}>• {ing}</Text>
                                    ))}
                                </View>
                                {meal.prepInstructions && (
                                    <View style={{ marginTop: 12 }}>
                                        <Text style={[styles.ingTitle, isChecked && styles.textChecked]}>Prep:</Text>
                                        <Text style={[styles.ingItem, isChecked && styles.textChecked]}>{meal.prepInstructions}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}

                <View style={{ padding: 20 }}>
                    <Button onPress={handleFinish} variant="primary">Complete & Save Session</Button>
                </View>

                <Button onPress={() => router.push('/(tabs)/dashboard')} variant="outline" style={{ marginTop: 20 }}>
                    Return to Dashboard
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
        color: '#10b981',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    nameInput: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 0,
    },
    content: {
        paddingBottom: 40,
    },
    summaryCard: {
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    totalCalories: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    summaryLabel: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 20,
    },
    macroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
    },
    macroBox: {
        alignItems: 'center',
    },
    vertLine: {
        width: 1,
        height: 24,
        opacity: 0.3,
    },
    macroVal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    macroLabel: {
        color: '#64748b',
        fontSize: 12,
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
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
    },
    mealName: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    mealCals: {
        color: '#94a3b8',
        fontSize: 14,
    },
    cardBody: {
        padding: 16,
    },
    cardChecked: {
        borderColor: 'rgba(34, 197, 94, 0.3)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
    },
    textChecked: {
        textDecorationLine: 'line-through',
        color: '#64748b',
        opacity: 0.6,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    iconButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
    },
    macroDetail: {
        color: '#60a5fa',
        fontSize: 14,
        marginBottom: 12,
    },
    ingredientsBox: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 12,
        borderRadius: 12,
    },
    ingTitle: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    ingItem: {
        color: '#e2e8f0',
        fontSize: 14,
        marginBottom: 4,
    }
});
