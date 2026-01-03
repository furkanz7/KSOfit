import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/native/Button';
import { Input } from '../../components/native/Input';
import { Layout } from '../../components/native/Layout';

export default function BMICalculatorScreen() {
    const router = useRouter();
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState<string | null>(null);

    const calculateBMI = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height) / 100; // cm to m
        if (w && h) {
            const val = (w / (h * h)).toFixed(1);
            setBmi(val);
        }
    };

    return (
        <Layout>
            <View style={styles.header}>
                <Button variant="outline" onPress={() => router.back()} style={{ paddingVertical: 8, paddingHorizontal: 12, width: 'auto' }}>
                    <ArrowLeft size={20} color="#60a5fa" />
                </Button>
                <Text style={styles.title}>BMI Calculator</Text>
            </View>

            <View style={styles.content}>
                <Input
                    label="Weight (kg)"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                />
                <Input
                    label="Height (cm)"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                />

                <Button onPress={calculateBMI} style={{ marginTop: 20 }}>Calculate</Button>

                {bmi && (
                    <View style={styles.resultBox}>
                        <Text style={styles.resultLabel}>Your BMI</Text>
                        <Text style={styles.resultValue}>{bmi}</Text>
                    </View>
                )}
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
    content: {
        marginTop: 20,
    },
    resultBox: {
        marginTop: 40,
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        padding: 30,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    resultLabel: {
        color: '#94a3b8',
        fontSize: 16,
        marginBottom: 8,
    },
    resultValue: {
        color: '#fff',
        fontSize: 48,
        fontWeight: 'bold',
    }
});
