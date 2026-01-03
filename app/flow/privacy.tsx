import { useRouter } from 'expo-router';
import { ArrowLeft, Shield } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Layout } from '../../components/native/Layout';
import { useSettings } from '../../providers/SettingsContext';

export default function PrivacyScreen() {
    const router = useRouter();
    const { language } = useSettings();

    const isTr = language === 'tr';

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isTr ? 'Gizlilik & Güvenlik' : 'Privacy & Security'}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.iconBox}>
                    <Shield size={64} color="#22c55e" />
                </View>

                <Text style={styles.versionText}>Version 1.0.0</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{isTr ? '1. Veri Kullanımı' : '1. Data Usage'}</Text>
                    <Text style={styles.text}>
                        {isTr
                            ? "Kişisel verileriniz (yaş, kilo, boy) sadece size özel antrenman ve beslenme programları oluşturmak için cihazınızda yerel olarak saklanır. AI servisleri ile paylaşılan veriler anonimdir."
                            : "Your personal data (age, weight, height) is stored locally on your device solely to generate personalized workout and nutrition plans. Data shared with AI services is anonymized."
                        }
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{isTr ? '2. Telif Hakları' : '2. Copyrights'}</Text>
                    <Text style={styles.text}>
                        {isTr
                            ? "© 2026 Furkan Yedek. Tüm hakları saklıdır. Bu uygulama Google Gemini AI teknolojisi kullanılarak geliştirilmiştir."
                            : "© 2026 Furkan Yedek. All rights reserved. This application is powered by Google Gemini AI technology."
                        }
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{isTr ? '3. Kullanım Şartları' : '3. Terms of Use'}</Text>
                    <Text style={styles.text}>
                        {isTr
                            ? "Bu uygulama tıbbi tavsiye vermez. Yeni bir egzersiz veya diyet programına başlamadan önce lütfen doktorunuza danışın."
                            : "This app does not provide medical advice. Please consult your physician before starting any new exercise or diet program."
                        }
                    </Text>
                </View>

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
    iconBox: {
        alignItems: 'center',
        marginBottom: 16,
    },
    versionText: {
        textAlign: 'center',
        color: '#64748b',
        marginBottom: 32,
    },
    section: {
        marginBottom: 24,
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    text: {
        color: '#94a3b8',
        lineHeight: 24,
        fontSize: 15,
    }
});
