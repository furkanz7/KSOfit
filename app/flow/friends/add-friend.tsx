import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addFriend, FriendUser, searchUsers } from '../../../services/userService';

export default function AddFriendScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<FriendUser[]>([]);
    const [addedIds, setAddedIds] = useState<string[]>([]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const filtered = await searchUsers(searchQuery);
        setResults(filtered);
    };

    const handleAdd = async (id: string) => {
        const success = await addFriend(id);
        if (success) {
            setAddedIds([...addedIds, id]);
        }
    };

    const renderItem = ({ item }: { item: FriendUser }) => {
        const isAdded = addedIds.includes(item.uniqueId);

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 16, borderRadius: 16, marginBottom: 12 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
                        {item.username.charAt(0)}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{item.username}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 14 }}>{item.uniqueId} • {item.level}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleAdd(item.uniqueId)}
                    disabled={isAdded}
                    style={{
                        backgroundColor: isAdded ? '#334155' : '#3b82f6',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20
                    }}
                >
                    <Text style={{ color: isAdded ? '#94a3b8' : 'white', fontWeight: '600' }}>
                        {isAdded ? 'Added' : 'Add'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
            <View style={{ padding: 20 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Find Friends</Text>
                </View>

                {/* Search Bar */}
                <View style={{ flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 16, padding: 4, marginBottom: 24, alignItems: 'center' }}>
                    <Ionicons name="search" size={20} color="#94a3b8" style={{ marginLeft: 12 }} />
                    <TextInput
                        style={{ flex: 1, color: 'white', padding: 12, fontSize: 16 }}
                        placeholder="Search by Name or ID (e.g. #AB12)"
                        placeholderTextColor="#64748b"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity onPress={handleSearch} style={{ backgroundColor: '#3b82f6', padding: 10, borderRadius: 12, margin: 4 }}>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Info Tip */}
                {results.length === 0 && searchQuery.length === 0 && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40, opacity: 0.6 }}>
                        <Ionicons name="people-outline" size={64} color="#64748b" />
                        <Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 16, maxWidth: '80%' }}>
                            Search for workout partners by their Name or unique ID. Try searching for "Ahmet" to test.
                        </Text>
                    </View>
                )}

                {/* Results List */}
                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={item => item.uniqueId}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            </View>
        </SafeAreaView>
    );
}
