import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Layout } from '../../../components/native/Layout';
import { FriendUser, getFriendDetails } from '../../../services/userService';

export default function FriendProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [friend, setFriend] = React.useState<FriendUser | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (id) {
            getFriendDetails(id as string).then(data => {
                setFriend(data);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>Loading friend profile...</Text>
                </View>
            </Layout>
        );
    }

    if (!friend) {
        return (
            <Layout>
                <Text style={{ color: 'white', textAlign: 'center', marginTop: 100 }}>Friend not found.</Text>
            </Layout>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>{friend.username}'s Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Stats Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{friend.username.charAt(0)}</Text>
                    </View>
                    <Text style={styles.name}>{friend.username}</Text>
                    <Text style={styles.id}>{friend.uniqueId}</Text>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{friend.level}</Text>
                    </View>
                </View>

                {/* Plans Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1-Week Workout Plan</Text>
                    <View style={styles.planCard}>
                        {friend.weeklyWorkout ? friend.weeklyWorkout.map((w, i) => (
                            <View key={i} style={styles.planRow}>
                                <Text style={styles.dayText}>{w.day}</Text>
                                <Text style={styles.workoutText}>{w.workout}</Text>
                            </View>
                        )) : (
                            <Text style={styles.noData}>No specific plan shared.</Text>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1-Week Nutrition Plan</Text>
                    <View style={styles.planCard}>
                        {friend.weeklyNutrition ? friend.weeklyNutrition.map((n, i) => (
                            <View key={i} style={styles.planRow}>
                                <Text style={styles.dayText}>{n.day}</Text>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.mealText}>{n.meal}</Text>
                                    {(n.calories || n.macros) && (
                                        <View style={styles.macroRow}>
                                            {n.calories && <Text style={styles.macroText}>{n.calories} kcal</Text>}
                                            {n.calories && n.macros && <Text style={styles.macroSeparator}>•</Text>}
                                            {n.macros && <Text style={styles.macroText}>{n.macros}</Text>}
                                        </View>
                                    )}
                                </View>
                            </View>
                        )) : (
                            <Text style={styles.noData}>No specific plan shared.</Text>
                        )}
                    </View>
                </View>

                {/* Recent Activity Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <View style={styles.planCard}>
                        {friend.history && friend.history.length > 0 ? friend.history.slice(0, 5).map((log, i) => (
                            <View key={log.id} style={[styles.planRow, { borderBottomWidth: i === friend.history!.length - 1 || i === 4 ? 0 : 1 }]}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{
                                            padding: 4,
                                            borderRadius: 6,
                                            backgroundColor: log.type === 'workout' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                            marginRight: 8
                                        }}>
                                            <Ionicons
                                                name={log.type === 'workout' ? 'fitness' : 'nutrition'}
                                                size={14}
                                                color={log.type === 'workout' ? '#3b82f6' : '#10b981'}
                                            />
                                        </View>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{log.title}</Text>
                                    </View>
                                    <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>{log.displayDate}</Text>
                                </View>
                                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                            </View>
                        )) : (
                            <Text style={styles.noData}>No recent activity shared.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    backBtn: { marginRight: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    content: { padding: 20 },
    profileCard: {
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: 24,
        borderRadius: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
    },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
    name: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    id: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
    levelBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 12
    },
    levelText: { color: '#60a5fa', fontWeight: 'bold', fontSize: 12 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 12 },
    planCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    planRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'space-between'
    },
    dayText: { color: '#60a5fa', fontWeight: 'bold', width: 40 },
    workoutText: { color: 'white', flex: 1, marginLeft: 10 },
    mealText: { color: '#10b981', flex: 1, marginLeft: 10, fontWeight: '600' },
    macroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4
    },
    macroText: {
        color: '#94a3b8',
        fontSize: 12
    },
    macroSeparator: {
        color: '#475569',
        marginHorizontal: 6,
        fontSize: 12
    },
    noData: { color: '#64748b', fontStyle: 'italic' }
});
