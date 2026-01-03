import { Link, useRouter } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/native/Button';
import { Input } from '../../components/native/Input';
import { Layout } from '../../components/native/Layout';
import userService from '../../services/userService';

export default function RegisterScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!formData.firstName || !formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        const result = await userService.registerUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
        });
        setLoading(false);

        if (result.success) {
            router.replace('/(tabs)/dashboard');
        } else {
            Alert.alert('Registration Failed', result.message || 'Could not create account');
        }
    };

    return (
        <Layout backgroundImage="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2000&auto=format&fit=crop">
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <UserPlus size={32} color="#3b82f6" />
                    </View>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the revolution today</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChangeText={(t) => setFormData({ ...formData, firstName: t })}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChangeText={(t) => setFormData({ ...formData, lastName: t })}
                            />
                        </View>
                    </View>

                    <Input
                        label="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={formData.email}
                        onChangeText={(t) => setFormData({ ...formData, email: t })}
                    />

                    <Input
                        label="Password (Numbers Only)"
                        secureTextEntry
                        keyboardType="numeric"
                        placeholder="123456"
                        value={formData.password}
                        onChangeText={(t) => setFormData({ ...formData, password: t.replace(/[^0-9]/g, '') })}
                    />

                    <Button onPress={handleRegister} loading={loading} style={styles.button}>
                        Create Account
                    </Button>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/(auth)/login" asChild>
                            <Text style={styles.link}>Sign In</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#94a3b8',
    },
    form: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    button: {
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    link: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 14,
    }
});
