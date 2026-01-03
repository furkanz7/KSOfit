import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FriendUser, getFriendsDetailsList, getUserProfile } from '../../../services/userService';

export default function MyFriendsScreen() {
    const router = useRouter();
    const [friends, setFriends] = useState<FriendUser[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadFriends();
        }, [])
    );

    const loadFriends = async () => {
        setLoading(true);
        const profile = await getUserProfile();
        const details = await getFriendsDetailsList(profile.friends);
        setFriends(details);
        setLoading(false);
    };

    const renderItem = ({ item }: { item: FriendUser }) => (
        <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 16, borderRadius: 16, marginBottom: 12 }}
            onPress={() => {
                router.push({
                    pathname: '/flow/friends/profile',
                    params: { id: item.uniqueId }
                });
            }}
        >
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
                    {item.username.charAt(0)}
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{item.username}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14 }}>{item.uniqueId}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#3b82f6', fontSize: 12, fontWeight: 'bold' }}>{item.level}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" style={{ marginTop: 4 }} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
            <View style={{ padding: 20, flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>My Friends</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/flow/friends/add-friend')}
                        style={{ backgroundColor: '#3b82f6', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Ionicons name="person-add" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {loading ? (
                    <Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 20 }}>Loading friends...</Text>
                ) : friends.length === 0 ? (
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 60, opacity: 0.6 }}>
                        <Ionicons name="people" size={80} color="#334155" />
                        <Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 16, fontSize: 16 }}>No friends yet.</Text>
                        <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 8, maxWidth: '70%' }}>
                            Tap the + button above to find and add workout partners!
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={friends}
                        renderItem={renderItem}
                        keyExtractor={item => item.uniqueId}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
