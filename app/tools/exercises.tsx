import { useRouter } from 'expo-router';
import { Activity, ArrowLeft, CheckCircle2, Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { Button } from '../../components/native/Button';
import { Input } from '../../components/native/Input';
import { Layout } from '../../components/native/Layout';

const PI = Math.PI;

const MusclePieChart = ({ data, size = 200 }: { data: { name: string, pct: number }[], size?: number }) => {
    const radius = size / 2.5;
    const center = size / 2;
    let currentAngle = -PI / 2;

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Svg width={size} height={size}>
                <G>
                    {data.map((item, i) => {
                        const angle = (item.pct / 100) * (2 * PI);
                        const x1 = center + radius * Math.cos(currentAngle);
                        const y1 = center + radius * Math.sin(currentAngle);
                        const x2 = center + radius * Math.cos(currentAngle + angle);
                        const y2 = center + radius * Math.sin(currentAngle + angle);

                        const largeArcFlag = angle > PI ? 1 : 0;
                        const d = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                        const labelAngle = currentAngle + angle / 2;
                        const lx = center + (radius * 1.3) * Math.cos(labelAngle);
                        const ly = center + (radius * 1.3) * Math.sin(labelAngle);

                        const color = colors[i % colors.length];
                        const path = (
                            <React.Fragment key={i}>
                                <Path d={d} fill={color} stroke="#1e293b" strokeWidth="2" />
                            </React.Fragment>
                        );
                        currentAngle += angle;
                        return path;
                    })}
                    {/* Inner circle for Donut effect */}
                    <Path
                        d={`M ${center} ${center - radius / 2} A ${radius / 2} ${radius / 2} 0 1 1 ${center} ${center + radius / 2} A ${radius / 2} ${radius / 2} 0 1 1 ${center} ${center - radius / 2}`}
                        fill="#1e293b"
                    />
                </G>
            </Svg>
            <View style={styles.legendContainer}>
                {data.map((item, i) => (
                    <View key={i} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: colors[i % colors.length] }]} />
                        <Text style={styles.legendText}>{item.name} ({item.pct}%)</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const EXERCISE_DATA = [
    // --- CHEST ---
    { id: '1', name: 'Bench Press', muscle: 'Chest', difficulty: 'Intermediate', activation: [{ name: 'Chest', pct: 85 }, { name: 'Shoulders', pct: 10 }, { name: 'Triceps', pct: 5 }] },
    { id: '4', name: 'Push Up', muscle: 'Chest', difficulty: 'Beginner', activation: [{ name: 'Chest', pct: 75 }, { name: 'Triceps', pct: 15 }, { name: 'Core', pct: 10 }] },
    { id: '15', name: 'Incline Bench Press', muscle: 'Chest', difficulty: 'Intermediate', activation: [{ name: 'Upper Chest', pct: 70 }, { name: 'Shoulders', pct: 20 }, { name: 'Triceps', pct: 10 }] },
    { id: '16', name: 'Dumbbell Flys', muscle: 'Chest', difficulty: 'Beginner', activation: [{ name: 'Chest', pct: 90 }, { name: 'Shoulders', pct: 10 }] },
    { id: '17', name: 'Chest Press Machine', muscle: 'Chest', difficulty: 'Beginner', activation: [{ name: 'Chest', pct: 80 }, { name: 'Triceps', pct: 20 }] },
    { id: '18', name: 'Decline Press', muscle: 'Chest', difficulty: 'Intermediate', activation: [{ name: 'Lower Chest', pct: 75 }, { name: 'Triceps', pct: 25 }] },
    { id: '19', name: 'Cable Crossover', muscle: 'Chest', difficulty: 'Intermediate', activation: [{ name: 'Chest', pct: 85 }, { name: 'Core', pct: 15 }] },

    // --- BACK ---
    { id: '3', name: 'Deadlift', muscle: 'Back', difficulty: 'Advanced', activation: [{ name: 'Lower Back', pct: 40 }, { name: 'Glutes', pct: 30 }, { name: 'Hamstrings', pct: 20 }, { name: 'Back', pct: 10 }] },
    { id: '5', name: 'Pull Up', muscle: 'Back', difficulty: 'Intermediate', activation: [{ name: 'Back', pct: 70 }, { name: 'Biceps', pct: 20 }, { name: 'Shoulders', pct: 10 }] },
    { id: '14', name: 'Lat Pulldown', muscle: 'Back', difficulty: 'Beginner', activation: [{ name: 'Back', pct: 65 }, { name: 'Biceps', pct: 25 }, { name: 'Shoulders', pct: 10 }] },
    { id: '20', name: 'Bent Over Row', muscle: 'Back', difficulty: 'Intermediate', activation: [{ name: 'Mid Back', pct: 60 }, { name: 'Biceps', pct: 20 }, { name: 'Lats', pct: 20 }] },
    { id: '21', name: 'Seated Cable Row', muscle: 'Back', difficulty: 'Beginner', activation: [{ name: 'Mid Back', pct: 70 }, { name: 'Biceps', pct: 30 }] },
    { id: '22', name: 'T-Bar Row', muscle: 'Back', difficulty: 'Intermediate', activation: [{ name: 'Back', pct: 65 }, { name: 'Biceps', pct: 25 }, { name: 'Rear Delts', pct: 10 }] },
    { id: '23', name: 'Back Extension', muscle: 'Back', difficulty: 'Beginner', activation: [{ name: 'Lower Back', pct: 80 }, { name: 'Glutes', pct: 20 }] },
    { id: '24', name: 'Single Arm DB Row', muscle: 'Back', difficulty: 'Beginner', activation: [{ name: 'Lats', pct: 75 }, { name: 'Biceps', pct: 25 }] },

    // --- LEGS ---
    { id: '2', name: 'Squat', muscle: 'Legs', difficulty: 'Advanced', activation: [{ name: 'Quads', pct: 60 }, { name: 'Glutes', pct: 25 }, { name: 'Core', pct: 15 }] },
    { id: '9', name: 'Lunges', muscle: 'Legs', difficulty: 'Beginner', activation: [{ name: 'Quads', pct: 50 }, { name: 'Glutes', pct: 40 }, { name: 'Hamstrings', pct: 10 }] },
    { id: '12', name: 'Leg Press', muscle: 'Legs', difficulty: 'Beginner', activation: [{ name: 'Quads', pct: 70 }, { name: 'Glutes', pct: 20 }, { name: 'Hamstrings', pct: 10 }] },
    { id: '25', name: 'Romanian Deadlift', muscle: 'Legs', difficulty: 'Intermediate', activation: [{ name: 'Hamstrings', pct: 60 }, { name: 'Glutes', pct: 30 }, { name: 'Lower Back', pct: 10 }] },
    { id: '26', name: 'Leg Extension', muscle: 'Legs', difficulty: 'Beginner', activation: [{ name: 'Quads', pct: 100 }] },
    { id: '27', name: 'Leg Curl', muscle: 'Legs', difficulty: 'Beginner', activation: [{ name: 'Hamstrings', pct: 100 }] },
    { id: '28', name: 'Calf Raise', muscle: 'Legs', difficulty: 'Beginner', activation: [{ name: 'Calves', pct: 100 }] },
    { id: '29', name: 'Bulgarian Split Squat', muscle: 'Legs', difficulty: 'Advanced', activation: [{ name: 'Quads', pct: 55 }, { name: 'Glutes', pct: 35 }, { name: 'Core', pct: 10 }] },
    { id: '30', name: 'Goblet Squat', muscle: 'Legs', difficulty: 'Beginner', activation: [{ name: 'Quads', pct: 60 }, { name: 'Glutes', pct: 20 }, { name: 'Core', pct: 20 }] },

    // --- SHOULDERS ---
    { id: '8', name: 'Shoulder Press', muscle: 'Shoulders', difficulty: 'Intermediate', activation: [{ name: 'Shoulders', pct: 60 }, { name: 'Triceps', pct: 25 }, { name: 'Upper Chest', pct: 15 }] },
    { id: '11', name: 'Lateral Raise', muscle: 'Shoulders', difficulty: 'Intermediate', activation: [{ name: 'Lateral Delts', pct: 90 }, { name: 'Traps', pct: 10 }] },
    { id: '13', name: 'Face Pull', muscle: 'Shoulders', difficulty: 'Intermediate', activation: [{ name: 'Rear Delts', pct: 50 }, { name: 'Traps', pct: 30 }, { name: 'Shoulders', pct: 20 }] },
    { id: '31', name: 'Front Raise', muscle: 'Shoulders', difficulty: 'Beginner', activation: [{ name: 'Front Delts', pct: 85 }, { name: 'Upper Chest', pct: 15 }] },
    { id: '32', name: 'Arnold Press', muscle: 'Shoulders', difficulty: 'Intermediate', activation: [{ name: 'Shoulders', pct: 70 }, { name: 'Triceps', pct: 30 }] },
    { id: '33', name: 'Upright Row', muscle: 'Shoulders', difficulty: 'Intermediate', activation: [{ name: 'Traps', pct: 50 }, { name: 'Lateral Delts', pct: 40 }, { name: 'Biceps', pct: 10 }] },
    { id: '34', name: 'Reverse Fly', muscle: 'Shoulders', difficulty: 'Beginner', activation: [{ name: 'Rear Delts', pct: 80 }, { name: 'Traps', pct: 20 }] },

    // --- ARMS ---
    { id: '6', name: 'Dumbbell Curl', muscle: 'Arms', difficulty: 'Beginner', activation: [{ name: 'Biceps', pct: 90 }, { name: 'Forearms', pct: 10 }] },
    { id: '7', name: 'Tricep Extension', muscle: 'Arms', difficulty: 'Beginner', activation: [{ name: 'Triceps', pct: 100 }] },
    { id: '35', name: 'Hammer Curl', muscle: 'Arms', difficulty: 'Beginner', activation: [{ name: 'Biceps', pct: 60 }, { name: 'Forearms', pct: 40 }] },
    { id: '36', name: 'Dips', muscle: 'Arms', difficulty: 'Intermediate', activation: [{ name: 'Triceps', pct: 60 }, { name: 'Chest', pct: 30 }, { name: 'Shoulders', pct: 10 }] },
    { id: '37', name: 'Preacher Curl', muscle: 'Arms', difficulty: 'Intermediate', activation: [{ name: 'Biceps', pct: 100 }] },
    { id: '38', name: 'Skull Crusher', muscle: 'Arms', difficulty: 'Intermediate', activation: [{ name: 'Triceps', pct: 100 }] },
    { id: '39', name: 'Cable Pushdown', muscle: 'Arms', difficulty: 'Beginner', activation: [{ name: 'Triceps', pct: 100 }] },
    { id: '40', name: 'Concentration Curl', muscle: 'Arms', difficulty: 'Beginner', activation: [{ name: 'Biceps', pct: 100 }] },

    // --- CORE ---
    { id: '10', name: 'Plank', muscle: 'Core', difficulty: 'Beginner', activation: [{ name: 'Abs', pct: 60 }, { name: 'Obliques', pct: 40 }] },
    { id: '41', name: 'Crunch', muscle: 'Core', difficulty: 'Beginner', activation: [{ name: 'Abs', pct: 100 }] },
    { id: '42', name: 'Leg Raise', muscle: 'Core', difficulty: 'Beginner', activation: [{ name: 'Lower Abs', pct: 80 }, { name: 'Hip Flexors', pct: 20 }] },
    { id: '43', name: 'Russian Twist', muscle: 'Core', difficulty: 'Intermediate', activation: [{ name: 'Obliques', pct: 70 }, { name: 'Abs', pct: 30 }] },
    { id: '44', name: 'Mountain Climber', muscle: 'Core', difficulty: 'Beginner', activation: [{ name: 'Abs', pct: 50 }, { name: 'Shoulders', pct: 30 }, { name: 'Core', pct: 20 }] },
    { id: '45', name: 'Bicycle Crunch', muscle: 'Core', difficulty: 'Beginner', activation: [{ name: 'Abs', pct: 50 }, { name: 'Obliques', pct: 50 }] },

    // --- CARDIO & OTHER ---
    { id: '46', name: 'Burpee', muscle: 'Full Body', difficulty: 'Advanced', activation: [{ name: 'Heart Rate', pct: 40 }, { name: 'Quads', pct: 20 }, { name: 'Chest', pct: 20 }, { name: 'Abs', pct: 20 }] },
    { id: '47', name: 'Jumping Jacks', muscle: 'Full Body', difficulty: 'Beginner', activation: [{ name: 'Heart Rate', pct: 100 }] },
    { id: '48', name: 'Box Jump', muscle: 'Legs', difficulty: 'Intermediate', activation: [{ name: 'Quads', pct: 50 }, { name: 'Calves', pct: 30 }, { name: 'Explosiveness', pct: 20 }] },
    { id: '49', name: 'Kettlebell Swing', muscle: 'Full Body', difficulty: 'Intermediate', activation: [{ name: 'Glutes', pct: 40 }, { name: 'Hamstrings', pct: 30 }, { name: 'Lower Back', pct: 30 }] },
    { id: '50', name: 'Battle Ropes', muscle: 'Full Body', difficulty: 'Intermediate', activation: [{ name: 'Shoulders', pct: 40 }, { name: 'Back', pct: 30 }, { name: 'Arms', pct: 30 }] },
    { id: '51', name: 'Push Press', muscle: 'Shoulders', difficulty: 'Advanced', activation: [{ name: 'Shoulders', pct: 50 }, { name: 'Legs', pct: 30 }, { name: 'Triceps', pct: 20 }] },
    { id: '52', name: 'Pull Side Plank', muscle: 'Core', difficulty: 'Intermediate', activation: [{ name: 'Obliques', pct: 90 }, { name: 'Shoulders', pct: 10 }] }
];

export default function ExercisesScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [viewingExercise, setViewingExercise] = useState<any>(null);

    const filtered = EXERCISE_DATA.filter(ex =>
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.muscle.toLowerCase().includes(search.toLowerCase())
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getAggregateAnalysis = () => {
        const aggregate: Record<string, number> = {};
        let totalPoints = 0;

        selectedIds.forEach(id => {
            const ex = EXERCISE_DATA.find(e => e.id === id);
            if (ex) {
                ex.activation.forEach(act => {
                    aggregate[act.name] = (aggregate[act.name] || 0) + act.pct;
                    totalPoints += act.pct;
                });
            }
        });

        return Object.entries(aggregate).map(([name, val]) => ({
            name,
            pct: Math.round((val / totalPoints) * 100)
        })).sort((a, b) => b.pct - a.pct);
    };

    const analysisData = showAnalysis ? getAggregateAnalysis() : (viewingExercise ? viewingExercise.activation : []);

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color="#60a5fa" />
                </TouchableOpacity>
                <Text style={styles.title}>Exercise Library</Text>
            </View>

            <View style={styles.searchBox}>
                <Search size={20} color="#94a3b8" style={{ marginRight: 8 }} />
                <Input
                    placeholder="Search exercise or muscle..."
                    value={search}
                    onChangeText={setSearch}
                    containerStyle={{ marginBottom: 0, flex: 1 }}
                    style={{ borderWidth: 0, backgroundColor: 'transparent', paddingVertical: 8 }}
                />
            </View>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {filtered.map(ex => {
                    const isSelected = selectedIds.includes(ex.id);
                    return (
                        <TouchableOpacity
                            key={ex.id}
                            style={[styles.card, isSelected && styles.cardSelected]}
                            onPress={() => toggleSelect(ex.id)}
                            onLongPress={() => setViewingExercise(ex)}
                        >
                            <View style={styles.cardContent}>
                                <Text style={styles.exName}>{ex.name}</Text>
                                <View style={styles.tags}>
                                    <Text style={styles.tag}>{ex.muscle}</Text>
                                    <Text style={[styles.tag, { backgroundColor: '#334155' }]}>{ex.difficulty}</Text>
                                </View>
                            </View>
                            <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                                {isSelected && <CheckCircle2 size={20} color="#fff" />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {selectedIds.length > 0 && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setShowAnalysis(true)}
                >
                    <Activity size={24} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.fabText}>Analyze {selectedIds.length}</Text>
                </TouchableOpacity>
            )}

            <Modal
                transparent
                visible={showAnalysis || !!viewingExercise}
                animationType="slide"
                onRequestClose={() => {
                    setShowAnalysis(false);
                    setViewingExercise(null);
                }}
            >
                <Pressable style={styles.modalOverlay} onPress={() => {
                    setShowAnalysis(false);
                    setViewingExercise(null);
                }}>
                    <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {showAnalysis ? "Aggregate Analysis" : viewingExercise?.name}
                            </Text>
                            <TouchableOpacity onPress={() => {
                                setShowAnalysis(false);
                                setViewingExercise(null);
                            }}>
                                <X size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.subtitle}>Muscle Activation</Text>

                        {analysisData.length > 0 && (
                            <MusclePieChart data={analysisData} />
                        )}

                        <Button
                            onPress={() => {
                                setShowAnalysis(false);
                                setViewingExercise(null);
                            }}
                        >
                            Close
                        </Button>
                    </Pressable>
                </Pressable>
            </Modal>
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
    backBtn: {
        padding: 8,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    list: {
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardSelected: {
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#64748b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    cardContent: {
        flex: 1,
    },
    exName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    tags: {
        flexDirection: 'row',
        gap: 8,
    },
    tag: {
        color: '#94a3b8',
        fontSize: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#3b82f6',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    fabText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1e293b',
        width: '100%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: '#334155',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#94a3b8',
        textAlign: 'center',
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginTop: 20,
        marginBottom: 30,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        color: '#cbd5e1',
        fontSize: 12,
    }
});
