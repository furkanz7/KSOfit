import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: any; // ViewStyle
}

export const Input: React.FC<InputProps> = ({ label, error, style, containerStyle, ...props }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style
                ]}
                placeholderTextColor="#64748b" // Slate-500
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        color: 'rgba(209, 213, 219, 0.8)', // Gray-300 with opacity
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.6)', // Slate-900 with opacity
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)', // Blue-500 with opacity
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#ffffff',
        fontSize: 16,
    },
    inputError: {
        borderColor: '#ef4444', // Red-500
    },
    errorText: {
        color: '#f87171', // Red-400
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    }
});
