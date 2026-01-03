import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Layout } from '../../components/native/Layout';
import { NearbyGyms } from '../../components/native/NearbyGyms';

export default function GymFinderScreen() {
    return (
        <Layout>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Gym Finder</Text>
                    <Text style={styles.subtitle}>Discover fitness centers near you</Text>
                </View>
                <View style={styles.mapWrapper}>
                    <NearbyGyms />
                </View>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 4,
    },
    mapWrapper: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
    }
});
