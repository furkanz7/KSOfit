import { useRouter } from 'expo-router';
import { ArrowLeft, ChefHat, Flame, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Button } from '../../components/native/Button';
import { Layout } from '../../components/native/Layout';
import { suggestChefMeal } from '../../services/geminiService';

const PieChart = ({ data }: { data: { protein: number, carbs: number, fats: number } }) => {
    const radius = 50;
    const strokeWidth = 10;
    const center = radius + strokeWidth;
    const circumference = 2 * Math.PI * radius;

    const sections = [
        { key: 'protein', value: data.protein, color: '#ef4444' },
        { key: 'carbs', value: data.carbs, color: '#3b82f6' },
        { key: 'fats', value: data.fats, color: '#eab308' },
    ];

    let startAngle = -90;

    return (
        <View style={styles.chartContainer}>
            <Svg width={center * 2} height={center * 2}>
                <G rotation={0} origin={`${center}, ${center}`}>
                    {sections.map((section) => {
                        const strokeDashoffset = circumference - (circumference * section.value) / 100;
                        const angle = (section.value / 100) * 360;
                        const currentStartAngle = startAngle;
                        startAngle += angle;

                        return (
                            <Circle
                                key={section.key}
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke={section.color}
                                strokeWidth={strokeWidth}
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                rotation={currentStartAngle + 90}
                                origin={`${center}, ${center}`}
                                strokeLinecap="round"
                            />
                        );
                    })}
                </G>
                {/* Center Text */}
                <View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ChefHat size={24} color="#fff" />
                </View>
            </Svg>

            {/* Legend - Updated with gram values if available, or just keeping % for now as per AI response */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.legendText}>Protein {data.protein}%</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
                    <Text style={styles.legendText}>Carbs {data.carbs}%</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#eab308' }]} />
                    <Text style={styles.legendText}>Fats {data.fats}%</Text>
                </View>
            </View>
        </View>
    );
};

export default function SmartChefScreen() {
    const router = useRouter();
    const [ingredients, setIngredients] = useState<{ id: string, name: string, amount: string }[]>([]);
    const [currentName, setCurrentName] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState<any>(null);

    const addIngredient = () => {
        if (!currentName.trim() || !currentAmount.trim()) {
            Alert.alert('Missing Info', 'Enter name and amount (grams).');
            return;
        }
        setIngredients([...ingredients, { id: Date.now().toString(), name: currentName, amount: currentAmount }]);
        setCurrentName('');
        setCurrentAmount('');
    };

    const removeIngredient = (id: string) => {
        setIngredients(ingredients.filter(i => i.id !== id));
    };

    const handleSuggest = async () => {
        if (ingredients.length === 0) {
            Alert.alert('Empty Basket', 'Add at least one ingredient.');
            return;
        }
        setLoading(true);
        setRecipe(null);
        try {
            const result = await suggestChefMeal(ingredients);
            setRecipe(result);
        } catch (error) {
            Alert.alert('Error', 'Failed to get a suggestion. Try again.');
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
                <Text style={styles.headerTitle}>FUR-AI</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Hero / Header Section */}
                <View style={styles.heroCard}>
                    <View style={styles.iconContainer}>
                        <ChefHat size={40} color="#f59e0b" />
                    </View>
                    <Text style={styles.title}>FUR-AI Chef</Text>
                    <Text style={styles.subtitle}>
                        Enter the ingredients you have, and let FUR-AI craft a perfect high-protein meal for you.
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Add Ingredients</Text>
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, { flex: 2 }]}
                                placeholder="e.g. Chicken Breast"
                                placeholderTextColor="#64748b"
                                value={currentName}
                                onChangeText={setCurrentName}
                            />
                            <View style={{ width: 12 }} />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Grams"
                                placeholderTextColor="#64748b"
                                keyboardType="numeric"
                                value={currentAmount}
                                onChangeText={setCurrentAmount}
                            />
                        </View>

                        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
                            <Plus size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.addButtonText}>Add to Pantry</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Ingredient List */}
                    {ingredients.length > 0 && (
                        <View style={styles.list}>
                            <Text style={styles.listLabel}>Current Pantry:</Text>
                            {ingredients.map(item => (
                                <View key={item.id} style={styles.listItem}>
                                    <Text style={styles.itemText}>{item.name}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.itemAmount}>{item.amount}g</Text>
                                        <TouchableOpacity onPress={() => removeIngredient(item.id)} style={styles.deleteBtn}>
                                            <Trash2 size={16} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={{ height: 24 }} />
                    <Button
                        onPress={handleSuggest}
                        loading={loading}
                        variant="primary"
                        fullWidth
                    >
                        Generate Meal Plan
                    </Button>
                </View>

                {/* Result Section */}
                {recipe && (
                    <View style={styles.resultCard}>
                        <View style={styles.resultHeader}>
                            <Flame size={24} color="#f59e0b" />
                            <Text style={styles.resultTitle}>Chef's Recommendation</Text>
                        </View>

                        <Text style={styles.recipeName}>{recipe.name}</Text>
                        <Text style={styles.recipeDesc}>{recipe.description}</Text>

                        <View style={styles.divider} />

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaValue}>{recipe.calories}</Text>
                                <Text style={styles.metaLabel}>Calories</Text>
                            </View>
                            <View style={styles.metaDivider} />
                            <View style={styles.metaItem}>
                                <Text style={styles.metaValue}>~25</Text>
                                <Text style={styles.metaLabel}>Minutes</Text>
                            </View>
                        </View>

                        {recipe.macros_distribution && (
                            <View style={styles.chartSection}>
                                <PieChart data={recipe.macros_distribution} />
                            </View>
                        )}

                        <View style={styles.divider} />

                        <Text style={styles.subTitle}>Instructions</Text>
                        {recipe.instructions?.map((step: string, index: number) => (
                            <View key={index} style={styles.stepRow}>
                                <View style={styles.stepNum}><Text style={styles.stepNumText}>{index + 1}</Text></View>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
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
        marginBottom: 10,
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
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    heroCard: {
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
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.2)',
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
    inputGroup: {
        width: '100%',
        gap: 12,
    },
    label: {
        color: '#cbd5e1',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    row: {
        flexDirection: 'row',
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
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        marginTop: 4,
    },
    addButtonText: {
        color: '#60a5fa',
        fontWeight: 'bold',
    },
    list: {
        width: '100%',
        marginTop: 24,
        gap: 8,
    },
    listLabel: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 1,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.02)',
    },
    itemText: { color: '#fff', fontSize: 16 },
    itemAmount: { color: '#94a3b8', fontSize: 14 },
    deleteBtn: {
        padding: 6,
        marginLeft: 12,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 8,
    },

    // Result
    resultCard: {
        marginTop: 24,
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f59e0b',
    },
    recipeName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    recipeDesc: {
        fontSize: 15,
        color: '#94a3b8',
        lineHeight: 22,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 20,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        borderRadius: 16,
        padding: 16,
    },
    metaItem: { alignItems: 'center' },
    metaValue: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    metaLabel: { color: '#64748b', fontSize: 12, marginTop: 4 },
    metaDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
    subTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
    stepRow: { flexDirection: 'row', marginBottom: 16, gap: 12 },
    stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    stepNumText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    stepText: { color: '#cbd5e1', fontSize: 15, lineHeight: 22, flex: 1 },

    // Chart
    chartSection: {
        alignItems: 'center',
        marginBottom: 10,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center horizontally
        gap: 24,
        marginTop: 16,
    },
    legend: {
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: { width: 12, height: 12, borderRadius: 6 },
    legendText: { color: '#cbd5e1', fontSize: 14 },
});
