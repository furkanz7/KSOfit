import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { Award, ChevronRight, LogOut, Settings, TrendingUp, UserPlus, Users } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Layout } from '../../../components/native/Layout';
import { useSettings } from '../../../providers/SettingsContext';
import { getCurrentUser, getUserProfile, getUserStats, UserProfile } from '../../../services/userService';

const Badge = ({ icon: Icon, color, label }: any) => (
    <View style={styles.badge}>
        <View style={[styles.badgeIcon, { backgroundColor: `${color}20` }]}>
            <Icon size={20} color={color} />
        </View>
        <Text style={styles.badgeLabel}>{label}</Text>
    </View>
)

const SettingItem = ({ icon: Icon, label, onPress, color = '#fff' }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
        <View style={styles.settingLeft}>
            <View style={styles.settingIconBox}>
                <Icon size={20} color={color} />
            </View>
            <Text style={styles.settingLabel}>{label}</Text>
        </View>
        <ChevronRight size={20} color="#64748b" />
    </TouchableOpacity>
)

export default function ProfileScreen() {
    const router = useRouter();
    const { colors, t } = useSettings();
    const [user, setUser] = useState({ firstName: '', lastName: '', photo: '' });
    const [stats, setStats] = useState({ totalWorkouts: 0, totalMinutes: 0, level: 'Beginner', rating: 1.0 });
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const loadData = async () => {
        try {
            const p = await getCurrentUser();
            if (p) setUser(p);

            const s = await getUserStats();
            setStats(s);

            const socialProfile = await getUserProfile();
            setProfile(socialProfile);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const handleLogout = async () => {
        await AsyncStorage.clear();
        router.replace('/(auth)/login');
    }

    const shareId = async () => {
        if (profile?.uniqueId) {
            await Share.share({
                message: `Add me on KsoFit! My ID is ${profile.uniqueId}`,
            });
        }
    };

    return (
        <Layout>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View style={[styles.avatarLarge, { backgroundColor: colors.primary, borderColor: colors.accent + '4d' }]}>
                        {user.photo ? (
                            <Image source={{ uri: user.photo }} style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <Text style={styles.avatarTextLarge}>{user.firstName?.[0]}</Text>
                        )}
                    </View>
                    <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                    <Text style={[styles.status, { color: colors.accent }]}>{stats.level} Member</Text>

                    {/* Unique ID Display */}
                    {profile && (
                        <TouchableOpacity onPress={shareId} style={styles.idChip}>
                            <Text style={styles.idText}>ID: {profile.uniqueId}</Text>
                            <Users size={14} color="#94a3b8" style={{ marginLeft: 6 }} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Social & Tools Actions */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                        <TouchableOpacity
                            style={[styles.socialBtn, { borderColor: colors.primary + '33' }]}
                            onPress={() => router.push('/flow/friends/my-friends')}
                        >
                            <Users size={24} color={colors.primary} />
                            <Text style={styles.socialBtnText}>My Friends</Text>
                            <View style={[styles.counterBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.counterText}>{profile?.friends.length || 0}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.socialBtn, { backgroundColor: colors.primary, borderColor: colors.accent }]}
                            onPress={() => router.push('/flow/friends/add-friend')}
                        >
                            <UserPlus size={24} color="white" />
                            <Text style={styles.socialBtnText}>Add Friend</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Gym Finder Button */}
                    <TouchableOpacity
                        style={[styles.socialBtn, { flexDirection: 'row', gap: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: colors.primary }]}
                        onPress={() => router.push('/tools/gym-finder')}
                    >
                        <View style={{ backgroundColor: colors.primary + '20', padding: 8, borderRadius: 10 }}>
                            <Ionicons name="location" size={20} color={colors.primary} />
                        </View>
                        <Text style={[styles.socialBtnText, { marginTop: 0, fontSize: 16 }]}>Find Nearby Gyms</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Overview */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>{stats.totalWorkouts}</Text>
                        <Text style={styles.statLbl}>Workouts</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>{stats.totalMinutes}</Text>
                        <Text style={styles.statLbl}>Minutes</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>{stats.rating || '1.0'}</Text>
                        <Text style={styles.statLbl}>Rating</Text>
                    </View>
                </View>

                {/* Badges */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesRow}>
                        <Badge icon={Award} color="#f59e0b" label="Early Bird" />
                        <Badge icon={TrendingUp} color="#22c55e" label="Streak 7" />
                        <Badge icon={Award} color="#3b82f6" label="Goal Hitter" />
                    </ScrollView>
                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.settingsGroup}>
                        <SettingItem icon={Settings} label="Account Settings" onPress={() => router.push('/flow/settings')} />
                        <SettingItem icon={LogOut} label="Log Out" color="#ef4444" onPress={handleLogout} />
                    </View>
                </View>

            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingBottom: 100,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    idChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    idText: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'monospace',
    },
    socialBtn: {
        flex: 1,
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        position: 'relative',
    },
    socialBtnText: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 8,
    },
    counterBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ef4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    counterText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 40,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        boxShadow: '0px 10px 20px rgba(59, 130, 246, 0.3)',
        elevation: 10,
    },
    avatarTextLarge: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    status: {
        fontSize: 14,
        color: '#f59e0b',
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    statItem: {
        alignItems: 'center',
    },
    statVal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLbl: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
        marginLeft: 4,
    },
    badgesRow: {
        gap: 12,
    },
    badge: {
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        width: 100,
    },
    badgeIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    badgeLabel: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    settingsGroup: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    settingIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    }
});
