import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Activity, Brain, CheckCircle2, ChefHat, ChevronRight, Circle, Crown, Dumbbell, MessageSquare, Wind, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Layout } from '../../../components/native/Layout';
import { useSettings } from '../../../providers/SettingsContext';
import { getDailyFitnessTask, getDailyMotivation } from '../../../services/geminiService';
import { deleteActivePlan, getActivePlan, getCurrentUser, getUserStats, saveHistoryLog, updateActivePlanProgress } from '../../../services/userService';

const FeatureCard = ({ title, icon: Icon, color, onPress, description, variant = 'default' }: any) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.card,
            variant === 'full' && styles.cardFull,
            variant === 'premium' && styles.cardPremium
        ]}
    >
        <View style={[styles.iconBox, { backgroundColor: `${color}20`, borderColor: `${color}40` }]}>
            <Icon size={24} color={color} />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDesc}>{description}</Text>
        </View>
        <ChevronRight size={20} color="#64748b" />
    </TouchableOpacity>
);

const DailyTaskWidgetInner = ({ task, colors }: { task: string, colors: any }) => {
    const [completed, setCompleted] = useState(false);

    return (
        <TouchableOpacity
            style={[
                styles.taskCard,
                completed && styles.taskCardCompleted,
                { borderColor: completed ? colors.primary + '40' : colors.primary + '80' }
            ]}
            onPress={() => setCompleted(!completed)}
            activeOpacity={0.8}
        >
            <View style={styles.taskHeader}>
                <View style={[styles.taskBadge, { backgroundColor: colors.primary + '33' }]}>
                    <Text style={[styles.taskLabel, { color: colors.accent }]}>DAILY MISSION</Text>
                </View>
                {completed ? (
                    <CheckCircle2 size={28} color={colors.primary} />
                ) : (
                    <Circle size={28} color="#64748b" />
                )}
            </View>
            <Text style={[styles.taskText, completed && styles.taskTextCompleted]}>
                {task}
            </Text>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: completed ? '100%' : '0%', backgroundColor: colors.primary }]} />
            </View>
            <Text style={styles.progressTag}>{completed ? '100%' : '0%'} Completed</Text>
        </TouchableOpacity>
    );
};

const ActivePlanWidget = ({ colors, router }: { colors: any, router: any }) => {
    const [activeTab, setActiveTab] = useState<'workout' | 'nutrition'>('workout');
    const [planData, setPlanData] = useState<any>(null);
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const loadActivePlan = async () => {
        setLoading(true);
        const data = await getActivePlan(activeTab);
        if (data) {
            setPlanData(data.plan);
            setCheckedItems(data.checkedItems || []);
        } else {
            setPlanData(null);
            setCheckedItems([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadActivePlan();
    }, [activeTab]);

    const toggleItem = (name: string) => {
        const newChecked = checkedItems.includes(name)
            ? checkedItems.filter(i => i !== name)
            : [...checkedItems, name];
        setCheckedItems(newChecked);
        updateActivePlanProgress(activeTab, newChecked);
    };

    const getItems = () => {
        if (!planData) return [];
        if (activeTab === 'workout') {
            return planData.schedule?.flatMap((d: any) => d.exercises.map((ex: any) => ex.name)) || [];
        } else {
            return planData.meals || [];
        }
    };

    const items = getItems();
    const progress = items.length > 0 ? (checkedItems.length / items.length) * 100 : 0;

    const handleComplete = async () => {
        if (checkedItems.length === 0) return;

        // 1. Save to History
        const success = await saveHistoryLog({
            id: Date.now().toString(),
            type: activeTab,
            date: new Date().toISOString(),
            displayDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            title: planData.planName || (activeTab === 'workout' ? "Workout Session" : "Nutrition Day"),
            completedItems: checkedItems
        });

        if (success) {
            // 2. Filter remaining items
            let remainingItems: any[] = [];
            const newPlanData = { ...planData };

            if (activeTab === 'workout') {
                // For workouts, each day has exercises. Filter out checked ones from ALL days.
                newPlanData.schedule = planData.schedule.map((day: any) => ({
                    ...day,
                    exercises: day.exercises.filter((ex: any) => !checkedItems.includes(ex.name))
                })).filter((day: any) => day.exercises.length > 0);

                remainingItems = newPlanData.schedule.flatMap((d: any) => d.exercises);
            } else {
                // For nutrition, it's a flat list of meals
                newPlanData.meals = planData.meals.filter((meal: any) => !checkedItems.includes(meal.name || meal));
                remainingItems = newPlanData.meals;
            }

            // 3. Update or Delete plan
            if (remainingItems.length === 0) {
                await deleteActivePlan(activeTab);
                Alert.alert("Bravo!", `You finished the whole ${activeTab} plan!`);
            } else {
                // Pass full object structure expected by saveActivePlan
                const activePlanData = await getActivePlan(activeTab);
                const updatedStore = {
                    ...activePlanData,
                    plan: newPlanData,
                    checkedItems: [] // Clear checkboxes for remaining
                };

                // We need to use core save logic to overwrite the file
                const user = await getCurrentUser();
                const key = activeTab === 'workout' ? `active_workout_${user.id}` : `active_nutrition_${user.id}`;
                await AsyncStorage.setItem(key, JSON.stringify(updatedStore));

                Alert.alert("Logged", `${checkedItems.length} items saved. Remaining items are still active!`);
            }

            // 4. Reload UI
            loadActivePlan();
        }
    };

    if (loading) return null;

    return (
        <View style={styles.activePlanContainer}>
            <View style={styles.tabHeader}>
                <TouchableOpacity
                    onPress={() => setActiveTab('workout')}
                    style={[styles.miniTab, activeTab === 'workout' && { backgroundColor: colors.primary + '33', borderColor: colors.primary }]}
                >
                    <Text style={[styles.miniTabText, activeTab === 'workout' && { color: colors.accent }]}>Workout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('nutrition')}
                    style={[styles.miniTab, activeTab === 'nutrition' && { backgroundColor: colors.primary + '33', borderColor: colors.primary }]}
                >
                    <Text style={[styles.miniTabText, activeTab === 'nutrition' && { color: colors.accent }]}>Nutrition</Text>
                </TouchableOpacity>
            </View>

            {planData ? (
                <View style={styles.planCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={[styles.planTitle, { flex: 1 }]}>{planData.planName}</Text>
                        <TouchableOpacity
                            onPress={() => router.push({
                                pathname: activeTab === 'workout' ? '/flow/workout-result' : '/flow/nutrition-result',
                                params: { type: 'active' }
                            })}
                            style={styles.showButton}
                        >
                            <Text style={styles.showButtonText}>Show</Text>
                            <ChevronRight size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.progressRow}>
                        <View style={styles.miniProgressBG}>
                            <View style={[styles.miniProgressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
                        </View>
                        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                    </View>

                    <View style={styles.itemList}>
                        {items.slice(0, 5).map((item: any, idx: number) => {
                            const itemName = typeof item === 'string' ? item : item.name;
                            const isChecked = checkedItems.includes(itemName);
                            return (
                                <TouchableOpacity key={idx} style={styles.itemRow} onPress={() => toggleItem(itemName)}>
                                    <View style={[styles.checkbox, isChecked && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                                        {isChecked && <CheckCircle2 size={12} color="#fff" />}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.itemName, isChecked && styles.itemChecked]}>{itemName}</Text>
                                        {activeTab === 'nutrition' && (item.calories || item.macros) && (
                                            <Text style={styles.itemSubText}>
                                                {item.calories ? `${item.calories} kcal` : ''}
                                                {item.calories && item.macros ? ' • ' : ''}
                                                {item.macros || ''}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    {checkedItems.length > 0 && (
                        <TouchableOpacity style={[styles.completeBtn, { backgroundColor: colors.primary }]} onPress={handleComplete}>
                            <Text style={styles.completeBtnText}>Complete & Save</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <View style={styles.emptyPlan}>
                    <Text style={styles.emptyPlanText}>No active {activeTab} plan.</Text>
                    <TouchableOpacity onPress={() => router.push(activeTab === 'workout' ? '/flow/workout-setup' : '/flow/nutrition-setup')}>
                        <Text style={{ color: colors.primary, fontWeight: 'bold', marginTop: 4 }}>Generate with FUR-AI</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default function DashboardScreen() {
    const router = useRouter();
    const { t, colors } = useSettings();
    const [user, setUser] = useState({ firstName: 'User' });
    const [motivation, setMotivation] = useState("Loading...");
    const [dailyTask, setDailyTask] = useState("Loading task...");
    const [stats, setStats] = useState({ calories: 0, minutes: 0 });

    useEffect(() => {
        getCurrentUser().then(p => {
            if (p) setUser(p);
        });

        getUserStats().then(s => setStats({ calories: s.totalCalories, minutes: s.totalMinutes }));

        const loadAIContent = async () => {
            const quote = await getDailyMotivation();
            setMotivation(quote || "Stay hard.");

            const task = await getDailyFitnessTask();
            setDailyTask(task || "Do 20 Pushups");
        };
        loadAIContent();
    }, []);

    return (
        <Layout>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{t('greeting')}</Text>
                        <Text style={styles.username}>{user.firstName}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/profile')}
                        style={[styles.avatar, { backgroundColor: colors.primary, borderColor: colors.accent }]}
                    >
                        <Text style={styles.avatarText}>{user.firstName?.[0]}</Text>
                    </TouchableOpacity>
                </View>

                {/* Daily Task Widget */}
                <DailyTaskWidgetInner task={dailyTask} colors={colors} />

                {/* Active Plans Tracking */}
                <ActivePlanWidget colors={colors} router={router} />


                {/* Workout Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('workout')}</Text>
                    <View style={styles.grid}>
                        <FeatureCard
                            title="Workout Plan"
                            description="Generate new"
                            icon={Dumbbell}
                            color="#3b82f6"
                            onPress={() => router.push('/flow/workout-setup')}
                        />
                        <FeatureCard
                            title="Exercises"
                            description="Library"
                            icon={Dumbbell}
                            color="#60a5fa"
                            onPress={() => router.push('/tools/exercises')}
                        />
                        <FeatureCard
                            title="Zen Mode"
                            description="Breathing & Recovery"
                            icon={Wind}
                            color="#22c55e"
                            onPress={() => router.push('/tools/zen-mode')}
                        />
                        <FeatureCard
                            title="Reflex Game"
                            description="Reaction Test"
                            icon={Zap}
                            color="#ef4444"
                            onPress={() => router.push('/tools/reflex-game')}
                        />
                        <FeatureCard
                            title="Nutrition Plan"
                            description="Meal Generator"
                            icon={ChefHat}
                            color="#eab308"
                            onPress={() => router.push('/flow/nutrition-setup')}
                        />
                        <FeatureCard
                            title="Cardio"
                            description="Live Tracker"
                            icon={Activity}
                            color="#06b6d4"
                            onPress={() => router.push('/tools/cardio')}
                        />
                    </View>
                </View>

                {/* Premium / Smart Features */}
                <View style={[styles.section, styles.premiumSection]}>
                    <View style={styles.premiumHeader}>
                        <Crown size={20} color="#f59e0b" style={{ marginRight: 8 }} />
                        <Text style={styles.premiumTitle}>{t('premium')}</Text>
                    </View>
                    <FeatureCard
                        title="Smart Chef"
                        description="AI Recipe Generator"
                        icon={ChefHat}
                        color="#f59e0b"
                        onPress={() => router.push('/tools/smart-chef')}
                        variant="full"
                    />
                    <View style={{ height: 12 }} />
                    <FeatureCard
                        title="AI Predictor"
                        description="Next Weight Calculator"
                        icon={Brain}
                        color="#8b5cf6"
                        onPress={() => router.push('/tools/predictor')}
                        variant="full"
                    />
                </View>

                {/* AI Coach at Bottom */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.coachCard}
                        onPress={() => router.push('/tools/ai-coach')}
                    >
                        <View style={styles.coachHeader}>
                            <View style={styles.coachIcon}>
                                <MessageSquare size={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.coachTitle}>FUR-AI PT CHAT</Text>
                                <Text style={styles.coachDesc}>Discipline & Results Only</Text>
                            </View>
                        </View>
                        <View style={styles.coachBubble}>
                            <Text style={styles.coachQuote}>"{motivation}"</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 150,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    greeting: { color: '#94a3b8', fontSize: 16, fontFamily: 'System' },
    username: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
    avatar: {
        width: 48, height: 48, borderRadius: 16, backgroundColor: '#3b82f6',
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#60a5fa',
    },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

    // Daily Task
    taskCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
    },
    taskCardCompleted: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.2)',
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    taskBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    taskLabel: {
        color: '#60a5fa',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    taskText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    taskTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#64748b',
    },
    progressContainer: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#3b82f6',
        borderRadius: 4,
    },
    progressTag: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '500',
    },

    section: { marginBottom: 24 },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        marginLeft: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 20,
        padding: 16,
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardFull: {
        width: '100%',
    },
    cardPremium: {
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
    },
    iconBox: {
        width: 44, height: 44, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1,
    },
    cardTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    cardDesc: { color: '#94a3b8', fontSize: 12 },

    // Coach Card
    coachCard: {
        backgroundColor: '#6366f1',
        borderRadius: 24,
        padding: 20,
        boxShadow: '0px 8px 16px rgba(99, 102, 241, 0.3)',
        elevation: 10,
    },
    coachHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    coachIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    coachTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    coachDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
    coachBubble: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 12,
        borderRadius: 12,
    },
    coachQuote: {
        color: '#fff',
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    premiumSection: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
        borderRadius: 24,
        padding: 16,
        marginTop: 8,
    },
    premiumHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    premiumTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f59e0b',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // Active Plan Widget Styles
    activePlanContainer: {
        marginBottom: 24,
    },
    tabHeader: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    miniTab: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    miniTabText: {
        color: '#94a3b8',
        fontSize: 13,
        fontWeight: '600',
    },
    planCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    planTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    miniProgressBG: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    miniProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 'bold',
        width: 35,
    },
    itemList: {
        gap: 10,
        marginBottom: 16,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemName: {
        color: '#cbd5e1',
        fontSize: 14,
    },
    itemSubText: {
        color: '#64748b',
        fontSize: 11,
        marginTop: 2,
    },
    itemChecked: {
        textDecorationLine: 'line-through',
        color: '#64748b',
        opacity: 0.6,
    },
    completeBtn: {
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    completeBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    emptyPlan: {
        backgroundColor: 'rgba(30, 41, 59, 0.2)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderStyle: 'dashed',
    },
    emptyPlanText: {
        color: '#64748b',
        fontSize: 14,
    },
    showButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    showButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 2,
    }
});
