import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSettings } from '../../providers/SettingsContext';

export default function TabLayout() {
  const { colors } = useSettings();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopWidth: 0,
          height: 60,
          position: 'absolute',
          bottom: 40, // Increased to avoid system gesture bar overlap
          left: 20,
          right: 20,
          borderRadius: 30,
          elevation: 5,
          paddingBottom: 0,
          paddingTop: 0,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
        },
        tabBarItemStyle: {
          height: 60,
          paddingVertical: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#64748b',
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: 30 }} />
        ),
      }}
    >
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="history/index"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={focused ? "time" : "time-outline"} size={26} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={focused ? "grid" : "grid-outline"} size={26} color={color} />
            </View>
          ),
        }}
      />

    </Tabs>
  );
}
