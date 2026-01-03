import { useRouter } from 'expo-router';
import { ArrowLeft, Bot, Send } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Layout } from '../../components/native/Layout';
import { chatWithCoach } from '../../services/geminiService';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

export default function AiCoachScreen() {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Ben FUR-AI PT CHAT. Hedefin nedir? Sadece spor, beslenme ve motivasyon konuşuruz. Gereksiz lakayıtlıktan kaçın ve sorunu sor.", sender: 'ai' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Scroll to bottom
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const response = await chatWithCoach(userMsg.text);
            const aiMsg: Message = { id: (Date.now() + 1).toString(), text: response, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            // Error handled in service
        } finally {
            setLoading(false);
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FUR-AI PT CHAT</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.chatContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg) => (
                        <View key={msg.id} style={[
                            styles.messageBubble,
                            msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                        ]}>
                            {msg.sender === 'ai' && (
                                <View style={styles.avatarAi}>
                                    <View style={{ backgroundColor: '#ef4444', width: 4, height: 4, borderRadius: 2, position: 'absolute', top: 4, right: 4 }} />
                                    <Bot size={16} color="#fff" />
                                </View>
                            )}
                            <Text style={[
                                styles.messageText,
                                msg.sender === 'user' ? styles.userText : styles.aiText
                            ]}>
                                {msg.text}
                            </Text>
                        </View>
                    ))}
                    {loading && (
                        <View style={styles.loadingBubble}>
                            <View style={styles.avatarAi}>
                                <Bot size={16} color="#fff" />
                            </View>
                            <ActivityIndicator size="small" color="#94a3b8" />
                        </View>
                    )}
                </ScrollView>

                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        placeholder="Emret hocam..."
                        placeholderTextColor="#94a3b8"
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!input.trim() || loading}
                    >
                        <Send size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        paddingBottom: 10,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        zIndex: 10,
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
    chatContainer: {
        padding: 20,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '85%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#3b82f6',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    avatarAi: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#6366f1',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: '#fff',
    },
    aiText: {
        color: '#e2e8f0',
    },
    loadingBubble: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 4,
        marginBottom: 20,
    },
    inputArea: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        color: '#fff',
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#334155',
        opacity: 0.5,
    }
});
