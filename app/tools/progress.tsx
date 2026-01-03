import { useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/native/Button';
import { Input } from '../../components/native/Input';
import { Layout } from '../../components/native/Layout';

const MOCK_HISTORY = [
    { date: '2023-10-01', weight: '82.5' },
    { date: '2023-10-15', weight: '81.2' },
    { date: '2023-11-01', weight: '80.0' },
    { date: '2023-11-15', weight: '79.1' },
    { date: '2023-12-01', weight: '78.5' },
];

export default function ProgressScreen() {
    const router = useRouter();
    const [weight, setWeight] = useState('');
    const [history, setHistory] = useState(MOCK_HISTORY);

    const handleAdd = () => {
        if (weight) {
            const today = new Date().toISOString().split('T')[0];
            setHistory([{ date: today, weight }, ...history]);
            setWeight('');
        }
    }

    return (
        <Layout>
            <View style={styles.header}>
                <Button variant="outline" onPress={() => router.back()} style={{ paddingVertical: 8, paddingHorizontal: 12, width: 'auto' }}>
                    <ArrowLeft size={20} color="#60a5fa" />
                </Button>
                <Text style={styles.title}>Progress Tracker</Text>
            </View>

            <View style={styles.addBox}>
                <Text style={styles.subTitle}>Log Weight</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Input
                            label="Weight (kg)"
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                            containerStyle={{ marginBottom: 0 }}
                        />
                    </View>
                    <Button onPress={handleAdd} style={{ marginBottom: 0 }}>Add</Button>
                </View>
            </View>

            <View style={styles.historySection}>
                <Text style={styles.subTitle}>History</Text>
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    {history.map((item, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.date}>{item.date}</Text>
                            <View style={styles.weightBox}>
                                <Text style={styles.weight}>{item.weight} kg</Text>
                                <TrendingUp size={16} color="#22c55e" />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

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
    subTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: 12,
    },
    addBox: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        padding: 20,
        borderRadius: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    historySection: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    date: {
        color: '#cbd5e1',
        fontSize: 16,
    },
    weightBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    weight: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
