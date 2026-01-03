import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/native/Button';
import { Input } from '../../components/native/Input';
import { Layout } from '../../components/native/Layout';

export default function EditProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        age: '',
        photo: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const p = await AsyncStorage.getItem('userProfile');
            if (p) {
                const data = JSON.parse(p);
                setForm({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    age: data.age || '',
                    photo: data.photo || ''
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setForm({ ...form, photo: result.assets[0].uri });
        }
    };

    const handleSave = async () => {
        if (!form.firstName.trim()) {
            Alert.alert("Error", "First name is required.");
            return;
        }
        setLoading(true);
        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify(form));
            // Force a small delay to simulate processing
            await new Promise(r => setTimeout(r, 500));

            Alert.alert("Success", "Profile updated!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (e) {
            Alert.alert("Error", "Failed to save profile.");
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
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.container}>
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={handlePickImage} style={styles.avatarLarge}>
                        {form.photo ? (
                            <Image source={{ uri: form.photo }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>{form.firstName?.[0] || 'U'}</Text>
                        )}
                        <View style={styles.cameraBadge}>
                            <Camera size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePickImage} style={{ padding: 10 }}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Input
                        label="First Name"
                        value={form.firstName}
                        onChangeText={t => setForm({ ...form, firstName: t })}
                    />
                    <Input
                        label="Last Name"
                        value={form.lastName}
                        onChangeText={t => setForm({ ...form, lastName: t })}
                    />
                    <Input
                        label="Age"
                        value={form.age}
                        onChangeText={t => setForm({ ...form, age: t })}
                        keyboardType="numeric"
                    />

                    <View style={{ height: 20 }} />

                    <Button onPress={handleSave} loading={loading} fullWidth>
                        Save Changes
                    </Button>
                </View>
            </View>
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
        marginBottom: 20,
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
    container: {
        padding: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 4,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        position: 'relative',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#22c55e',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#0f172a',
    },
    changePhotoText: {
        color: '#3b82f6',
        fontWeight: '600',
        fontSize: 14,
    },
    form: {
        gap: 16,
    }
});
