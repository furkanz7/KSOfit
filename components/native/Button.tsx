import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onPress,
    variant = 'primary',
    fullWidth = false,
    disabled = false,
    loading = false,
    style
}) => {

    const getBackgroundColor = () => {
        if (disabled) return '#334155'; // Slate-700
        switch (variant) {
            case 'primary': return '#3b82f6'; // Blue-500
            case 'secondary': return '#ffffff';
            case 'outline': return 'transparent';
            default: return '#3b82f6';
        }
    };

    const getTextColor = () => {
        if (disabled) return '#94a3b8'; // Slate-400
        switch (variant) {
            case 'primary': return '#ffffff';
            case 'secondary': return '#0f172a'; // Slate-900
            case 'outline': return '#60a5fa'; // Blue-400
            default: return '#ffffff';
        }
    };

    const borderStyle: ViewStyle = variant === 'outline' ? {
        borderWidth: 2,
        borderColor: '#3b82f6',
    } : {};

    return (
        <TouchableOpacity
            onPress={() => {
                if (!disabled && !loading) {
                    if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    onPress();
                }
            }}
            disabled={disabled || loading}
            style={[
                styles.base,
                {
                    backgroundColor: getBackgroundColor(),
                    width: fullWidth ? '100%' : 'auto',
                    opacity: disabled ? 0.7 : 1,
                },
                borderStyle,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>
                    {children}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        // Shadow for primary
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});
