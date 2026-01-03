import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../../../providers/SettingsContext';
import { getHistoryLogs, HistoryLog } from '../../../services/userService';

export default function HistoryScreen() {
    const router = useRouter();
    const { colors } = useSettings();
    const [logs, setLogs] = useState<HistoryLog[]>([]);
    const [tab, setTab] = useState<'workout' | 'nutrition'>('workout');

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        const history = await getHistoryLogs();
        setLogs(history);
    };

    const filteredLogs = logs.filter(l => l.type === tab);

    const renderItem = ({ item }: { item: HistoryLog }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: item.type === 'workout' ? colors.primary : '#10b981' }]}>
                    <Ionicons name={item.type === 'workout' ? 'barbell' : 'nutrition'} size={20} color="white" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDate}>{item.displayDate}</Text>
                </View>
                {item.type === 'workout' && (
                    <View style={[styles.scoreBadge, { backgroundColor: colors.primary + '33' }]}>
                        <Text style={[styles.scoreText, { color: colors.accent }]}>+{item.completedItems.length * 10} XP</Text>
                    </View>
                )}
            </View>

            {item.completedItems.length > 0 && (
                <View style={styles.divider} />
            )}

            <View style={styles.itemList}>
                {item.completedItems.slice(0, 3).map((completed, index) => (
                    <View key={index} style={styles.checkRow}>
                        <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                        <Text style={styles.checkText} numberOfLines={1}>{completed}</Text>
                    </View>
                ))}
                {item.completedItems.length > 3 && (
                    <Text style={styles.moreText}>+ {item.completedItems.length - 3} more items</Text>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'workout' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                    onPress={() => setTab('workout')}
                >
                    <Text style={[styles.tabText, tab === 'workout' && styles.tabTextActive]}>Workouts</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'nutrition' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                    onPress={() => setTab('nutrition')}
                >
                    <Text style={[styles.tabText, tab === 'nutrition' && styles.tabTextActive]}>Nutrition</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredLogs}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="clipboard-outline" size={64} color="#334155" />
                        <Text style={styles.emptyText}>No logs yet.</Text>
                        <Text style={styles.emptySub}>Finish a workout or diet plan to see it here.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tabActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    tabText: {
        color: '#94a3b8',
        fontWeight: '600',
    },
    tabTextActive: {
        color: 'white',
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cardDate: {
        color: '#94a3b8',
        fontSize: 12,
    },
    scoreBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    scoreText: {
        color: '#60a5fa',
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#334155',
        marginTop: 12,
        marginBottom: 12,
    },
    itemList: {
        gap: 6,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkText: {
        color: '#cbd5e1',
        fontSize: 14,
        flex: 1,
    },
    moreText: {
        color: '#64748b',
        fontSize: 12,
        marginLeft: 24,
        marginTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        opacity: 0.7,
    },
    emptyText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    emptySub: {
        color: '#94a3b8',
        marginTop: 8,
    },
});
