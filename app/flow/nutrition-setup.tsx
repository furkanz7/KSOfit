import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/native/Button';
import { Input } from '../../components/native/Input';
import { Layout } from '../../components/native/Layout';
import { generateNutritionPlan } from '../../services/geminiService';

export default function NutritionSetupScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        age: '25',
        weight: '75',
        height: '180',
        gender: 'Male',
        goal: 'Lose Weight',
        daysPerWeek: 'Moderate',
        mealsPerDay: '3',
        foodPreferences: '',
    });

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            const firstName = userProfile ? JSON.parse(userProfile).firstName : 'User';

            // foodPreferences string to array logic if needed
            const fullStats = { ...stats, firstName, foodPreferences: stats.foodPreferences.split(',') };

            const plan = await generateNutritionPlan(fullStats);
            setLoading(false);

            router.push({
                pathname: "/flow/nutrition-result",
                params: { plan: JSON.stringify(plan) }
            });

        } catch (error) {
            setLoading(false);
            Alert.alert("Error", "Failed to generate plan. Please try again.");
            console.error(error);
        }
    };

    return (
        <Layout>
            <View style={styles.header}>
                <Button variant="outline" onPress={() => router.back()} style={{ paddingVertical: 8, paddingHorizontal: 12, width: 'auto' }}>
                    <ArrowLeft size={20} color="#60a5fa" />
                </Button>
                <Text style={styles.title}>Nutrition Plan</Text>
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <View style={styles.row}>
                    <Input
                        label="Age"
                        value={stats.age}
                        onChangeText={t => setStats({ ...stats, age: t })}
                        keyboardType="numeric"
                        style={{ flex: 1, marginRight: 8 }}
                    />
                    <Input
                        label="Gender"
                        value={stats.gender}
                        onChangeText={t => setStats({ ...stats, gender: t })}
                        style={{ flex: 1, marginLeft: 8 }}
                    />
                </View>

                <View style={styles.row}>
                    <Input
                        label="Weight (kg)"
                        value={stats.weight}
                        onChangeText={t => setStats({ ...stats, weight: t })}
                        keyboardType="numeric"
                        style={{ flex: 1, marginRight: 8 }}
                    />
                    <Input
                        label="Height (cm)"
                        value={stats.height}
                        onChangeText={t => setStats({ ...stats, height: t })}
                        keyboardType="numeric"
                        style={{ flex: 1, marginLeft: 8 }}
                    />
                </View>

                <Text style={styles.label}>Activity Intensity</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                    {['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'].map((level) => (
                        <TouchableOpacity
                            key={level}
                            style={[styles.chip, stats.daysPerWeek === level && styles.chipActive]}
                            onPress={() => setStats({ ...stats, daysPerWeek: level })}
                        >
                            <Text style={[styles.chipText, stats.daysPerWeek === level && styles.chipTextActive]}>
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.label}>Meals Per Day</Text>
                <View style={styles.chipContainer}>
                    {['3', '4', '5', '6'].map((count) => (
                        <TouchableOpacity
                            key={count}
                            style={[styles.chip, stats.mealsPerDay === count && styles.chipActive]}
                            onPress={() => setStats({ ...stats, mealsPerDay: count })}
                        >
                            <Text style={[styles.chipText, stats.mealsPerDay === count && styles.chipTextActive]}>
                                {count} Meals
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Goal</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                    {['Lose Weight', 'Build Muscle', 'Maintain', 'Healthy Eating'].map((g) => (
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

                <Text style={styles.label}>Diet Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                    {['Balanced', 'Ketogenic', 'Vegan', 'Paleo', 'High Protein'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.chip, stats.foodPreferences.includes(type) && styles.chipActive]}
                            onPress={() => setStats({ ...stats, foodPreferences: type })}
                        >
                            <Text style={[styles.chipText, stats.foodPreferences.includes(type) && styles.chipTextActive]}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Input
                    label="Allergies / Dislikes"
                    placeholder="e.g. No dairy, Gluten-free"
                    value={stats.foodPreferences}
                    onChangeText={t => setStats({ ...stats, foodPreferences: t })}
                />

                <View style={{ height: 20 }} />

                <Button onPress={handleGenerate} loading={loading} fullWidth>
                    Generate Nutrition Plan
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
