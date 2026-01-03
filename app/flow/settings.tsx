import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Globe, Shield, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Layout } from '../../components/native/Layout';
import { ThemeType, useSettings } from '../../providers/SettingsContext';

const SettingOption = ({ icon: Icon, label, value, onToggle, type = 'toggle', activeColor }: any) => (
    <View style={styles.option}>
        <View style={styles.optionLeft}>
            <View style={[styles.iconBox, activeColor && { backgroundColor: activeColor }]}>
                <Icon size={20} color={activeColor ? '#fff' : "#94a3b8"} />
            </View>
            <Text style={styles.label}>{label}</Text>
        </View>
        {type === 'toggle' ? (
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#334155', true: '#3b82f6' }}
                thumbColor="#fff"
            />
        ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {value && <Text style={{ color: '#64748b', fontSize: 14 }}>{value}</Text>}
                <ArrowLeft size={16} color="#475569" style={{ transform: [{ rotate: '180deg' }] }} />
            </View>
        )}
    </View>
);

const CIRCLE_THEMES: { id: ThemeType; color: string }[] = [
    { id: 'blue', color: '#3b82f6' },
    { id: 'emerald', color: '#10b981' },
    { id: 'purple', color: '#8b5cf6' },
    { id: 'rose', color: '#f43f5e' },
    { id: 'amber', color: '#f59e0b' },
];

export default function SettingsScreen() {
    const router = useRouter();
    const { theme, setTheme, colors, language, setLanguage, t } = useSettings();
    const [notifications, setNotifications] = React.useState(true);

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('settings')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.container}>
                <Text style={styles.sectionTitle}>{t('themes')}</Text>
                <View style={styles.card}>
                    <View style={styles.themeRow}>
                        {CIRCLE_THEMES.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.themeCircle,
                                    { backgroundColor: item.color },
                                    theme === item.id && styles.activeThemeCircle
                                ]}
                                onPress={() => setTheme(item.id)}
                            />
                        ))}
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.card}>
                    <SettingOption
                        icon={Bell}
                        label="Push Notifications"
                        value={notifications}
                        onToggle={() => setNotifications(!notifications)}
                        activeColor={colors.primary}
                    />
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={() => setLanguage(language === 'en' ? 'tr' : 'en')}>
                        <SettingOption
                            icon={Globe}
                            label={t('language')}
                            value={language === 'en' ? 'English' : 'Türkçe'}
                            type="link"
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.card}>
                    <TouchableOpacity onPress={() => router.push('/flow/edit-profile')}>
                        <SettingOption icon={User} label="Edit Profile" type="link" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={() => router.push('/flow/privacy')}>
                        <SettingOption icon={Shield} label="Privacy & Security" type="link" />
                    </TouchableOpacity>
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
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#94a3b8',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 24,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        padding: 4,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        color: '#cbd5e1',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginLeft: 60,
    },
    themeRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    themeCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeThemeCircle: {
        borderColor: '#fff',
        transform: [{ scale: 1.1 }],
    }
});
