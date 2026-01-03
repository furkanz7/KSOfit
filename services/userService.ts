import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserStats {
    totalWorkouts: number;
    totalMinutes: number;
    totalCalories: number; // Estimated
    streakDays: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
    rating: number; // 1.0 - 5.0
    lastWorkoutDate?: string;
}

const DEFAULT_STATS: UserStats = {
    totalWorkouts: 0,
    totalMinutes: 0,
    totalCalories: 0,
    streakDays: 0,
    level: 'Beginner',
    rating: 1.0
};

const KEY_STATS = 'user_stats_v1';
const KEY_PROFILE = 'user_profile_social_v1';

// --- INTERFACES ---

export interface UserProfile {
    uniqueId: string; // e.g. #AF3921
    username: string; // Defaults to "User" if not set
    friends: string[]; // List of friend uniqueIds
}

export interface FriendUser {
    uniqueId: string;
    username: string;
    level: string;
    workoutPlanName?: string;
    nutritionPlanName?: string;
    weeklyWorkout?: { day: string; workout: string }[];
    weeklyNutrition?: { day: string; meal: string; calories?: string; macros?: string }[];
    history?: HistoryLog[];
}

export interface HistoryLog {
    id: string;
    type: 'workout' | 'nutrition';
    date: string; // ISO
    displayDate: string; // "02 Jan 20:30"
    title: string;
    completedItems: string[]; // List of strings
}

const KEY_HISTORY = 'user_history_logs_v1';
const KEY_ACTIVE_WORKOUT = 'active_workout_plan_v1';
const KEY_ACTIVE_NUTRITION = 'active_nutrition_plan_v1';

// --- MOCK DATA FOR DEMO ---
export const MOCK_USERS: FriendUser[] = [
    {
        uniqueId: '#KD92LA',
        username: 'Ahmet Yılmaz',
        level: 'Advanced',
        workoutPlanName: 'Power Hybird',
        nutritionPlanName: 'High Protein',
        weeklyWorkout: [
            { day: 'Mon', workout: 'Chest & Triceps' },
            { day: 'Tue', workout: 'Back & Biceps' },
            { day: 'Wed', workout: 'Legs & Core' },
            { day: 'Thu', workout: 'Rest' },
            { day: 'Fri', workout: 'Shoulders & Arms' },
            { day: 'Sat', workout: 'Full Body' },
            { day: 'Sun', workout: 'Cardio' }
        ],
        weeklyNutrition: [
            { day: 'Mon', meal: 'Oatmeal / Chicken Rice', calories: '2200', macros: 'P:160 C:250 F:60' },
            { day: 'Tue', meal: 'Smoothie / Fish Salad', calories: '2100', macros: 'P:150 C:220 F:70' },
            { day: 'Wed', meal: 'Eggs / Steak Potatoes', calories: '2400', macros: 'P:180 C:260 F:80' },
            { day: 'Thu', meal: 'Yogurt / Pasta', calories: '2200', macros: 'P:140 C:300 F:50' },
            { day: 'Fri', meal: 'Pancakes / Chicken Rice', calories: '2300', macros: 'P:165 C:270 F:65' },
            { day: 'Sat', meal: 'Fruit / Pizza (Cheat)', calories: '2800', macros: 'P:120 C:400 F:100' },
            { day: 'Sun', meal: 'Oatmeal / Lean Salad', calories: '2000', macros: 'P:155 C:200 F:60' }
        ]
    },
    {
        uniqueId: '#92KSLA',
        username: 'Ayşe Demir',
        level: 'Intermediate',
        workoutPlanName: 'Glute Focus',
        nutritionPlanName: 'Balanced Diet',
        weeklyWorkout: [
            { day: 'Mon', workout: 'Lower Body' },
            { day: 'Tue', workout: 'Upper Body' },
            { day: 'Wed', workout: 'Glutes' },
            { day: 'Thu', workout: 'Rest' },
            { day: 'Fri', workout: 'HIIT' },
            { day: 'Sat', workout: 'Cardio' },
            { day: 'Sun', workout: 'Rest' }
        ],
        weeklyNutrition: [
            { day: 'Mon', meal: 'Quinoa Bowl / Salmon', calories: '1800', macros: 'P:120 C:180 F:50' },
            { day: 'Tue', meal: 'Greek Yogurt / Turkey Wrap', calories: '1750', macros: 'P:115 C:170 F:55' },
            { day: 'Wed', meal: 'Chia Pudding / Tofu Stir-fry', calories: '1850', macros: 'P:100 C:200 F:60' },
            { day: 'Thu', meal: 'Eggs / Avocado Toast', calories: '1800', macros: 'P:110 C:190 F:50' },
            { day: 'Fri', meal: 'Berry Smoothie / Lentil Soup', calories: '1700', macros: 'P:90 C:220 F:45' },
            { day: 'Sat', meal: 'Oats / Chicken Salad', calories: '1900', macros: 'P:130 C:190 F:60' },
            { day: 'Sun', meal: 'Pancakes / Roast Veggies', calories: '1750', macros: 'P:95 C:210 F:50' }
        ]
    },
    { uniqueId: '#MLA291', username: 'Mehmet Öztürk', level: 'Beginner', workoutPlanName: 'Full Body Start', nutritionPlanName: 'Keto' },
    { uniqueId: '#XOA921', username: 'Zeynep Kaya', level: 'Elite', workoutPlanName: 'CrossFit Prep', nutritionPlanName: 'Carb Cycling' },
];

// --- PROFILE FUNCTIONS ---

const generateUniqueId = () => {
    return '#' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return { uniqueId: '#GUEST', username: 'Guest', friends: [] };
        }

        const userProfileKey = `user_profile_${currentUser.id}`;
        const json = await AsyncStorage.getItem(userProfileKey);

        if (!json) {
            const newProfile: UserProfile = {
                uniqueId: currentUser.id,
                username: currentUser.firstName || 'User',
                friends: []
            };
            await AsyncStorage.setItem(userProfileKey, JSON.stringify(newProfile));
            return newProfile;
        }
        return JSON.parse(json);
    } catch (e) {
        console.error("Failed to load profile", e);
        return { uniqueId: '#ERROR', username: 'User', friends: [] };
    }
};

export const searchUsers = async (query: string): Promise<FriendUser[]> => {
    const q = query.toLowerCase();

    // 1. Filter Mock Users
    const filteredMocks = MOCK_USERS.filter(u =>
        u.username.toLowerCase().includes(q) || u.uniqueId.toLowerCase().includes(q)
    );

    // 2. Filter Registered Users
    try {
        const usersRaw = await AsyncStorage.getItem(KEY_USERS);
        const registeredUsers = usersRaw ? JSON.parse(usersRaw) : [];
        const filteredRegistered = registeredUsers
            .filter((u: any) => (u.firstName + ' ' + (u.lastName || '')).toLowerCase().includes(q) || u.id.toLowerCase().includes(q))
            .map((u: any) => ({
                uniqueId: u.id,
                username: u.firstName + ' ' + (u.lastName || ''),
                level: 'New Member' // Default for fresh users
            }));

        return [...filteredMocks, ...filteredRegistered];
    } catch (e) {
        return filteredMocks;
    }
};

export const addFriend = async (friendId: string): Promise<boolean> => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return false;

        const profile = await getUserProfile();
        if (profile.friends.includes(friendId)) return false;

        // Verify it exists in MOCK_USERS or KEY_USERS
        const mocks = MOCK_USERS.find(u => u.uniqueId === friendId);
        let exists = !!mocks;

        if (!exists) {
            const usersRaw = await AsyncStorage.getItem(KEY_USERS);
            const users = usersRaw ? JSON.parse(usersRaw) : [];
            exists = users.some((u: any) => u.id === friendId);
        }

        if (!exists) return false;

        const newProfile = { ...profile, friends: [...profile.friends, friendId] };
        const userProfileKey = `user_profile_${currentUser.id}`;
        await AsyncStorage.setItem(userProfileKey, JSON.stringify(newProfile));
        return true;
    } catch (e) {
        console.error("Failed to add friend", e);
        return false;
    }
};

export const getFriendDetails = async (friendId: string): Promise<FriendUser | null> => {
    // Check Mock Users first
    const mock = MOCK_USERS.find(u => u.uniqueId === friendId);
    if (mock) return mock;

    // Check Registered Users
    try {
        const usersRaw = await AsyncStorage.getItem(KEY_USERS);
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const user = users.find((u: any) => u.id === friendId);

        if (user) {
            // Fetch their actual progress/plans
            const workout = await getActivePlanById('workout', user.id);
            const nutrition = await getActivePlanById('nutrition', user.id);
            const stats = await getUserStatsById(user.id);
            const history = await getHistoryLogsById(user.id);

            return {
                uniqueId: user.id,
                username: user.firstName + ' ' + (user.lastName || ''),
                level: stats.level,
                workoutPlanName: workout?.plan?.title || 'No Plan',
                nutritionPlanName: nutrition?.plan?.title || 'No Plan',
                weeklyWorkout: workout?.plan?.schedule,
                weeklyNutrition: nutrition?.plan?.schedule,
                history: history
            };
        }
    } catch (e) { }

    return null;
};

// Helper for fetching other users data
const getActivePlanById = async (type: 'workout' | 'nutrition', userId: string) => {
    const key = type === 'workout' ? `active_workout_${userId}` : `active_nutrition_${userId}`;
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : null;
};

const getHistoryLogsById = async (userId: string): Promise<HistoryLog[]> => {
    const json = await AsyncStorage.getItem(`user_history_${userId}`);
    return json ? JSON.parse(json) : [];
};

const getUserStatsById = async (userId: string): Promise<UserStats> => {
    // Stats are currently global in this mock app, we should make them user-specific in the future
    // For now, let's keep them as is or try to find user-specific ones if they exist
    const json = await AsyncStorage.getItem(`user_stats_${userId}`);
    return json ? JSON.parse(json) : DEFAULT_STATS;
};

export const removeFriend = async (friendId: string) => {
    try {
        const currentUser = await getCurrentUser();
        /* v8 ignore next */
        if (!currentUser) return;

        const profile = await getUserProfile();
        const newProfile = { ...profile, friends: profile.friends.filter(id => id !== friendId) };

        // Save to user-specific key
        const userProfileKey = `user_profile_${currentUser.id}`;
        await AsyncStorage.setItem(userProfileKey, JSON.stringify(newProfile));
        return newProfile;
    } catch (e) {
        console.error("Failed to remove friend", e);
    }
};

export const getFriendsDetailsList = async (friendIds: string[]): Promise<FriendUser[]> => {
    const results = await Promise.all(friendIds.map(id => getFriendDetails(id)));
    return results.filter((u): u is FriendUser => u !== null);
};

// --- HISTORY FUNCTIONS (User Specific) ---
export const getHistoryLogs = async (): Promise<HistoryLog[]> => {
    try {
        const user = await getCurrentUser();
        if (!user) return [];

        const json = await AsyncStorage.getItem(`user_history_${user.id}`);
        if (!json) return [];
        return JSON.parse(json);
    } catch (e) {
        console.error("Failed to load history", e);
        return [];
    }
};

export const saveHistoryLog = async (log: HistoryLog) => {
    try {
        const user = await getCurrentUser();
        if (!user) return false;

        const logs = await getHistoryLogs();
        const newLogs = [log, ...logs];
        await AsyncStorage.setItem(`user_history_${user.id}`, JSON.stringify(newLogs));

        if (log.type === 'workout') {
            await updateUserStats({ minutes: 45, calories: 300 });
        }
        return true;
    } catch (e) {
        console.error("Failed to save history", e);
        return false;
    }
};

// --- STATS FUNCTIONS (User Specific) ---
export const getUserStats = async (): Promise<UserStats> => {
    try {
        const user = await getCurrentUser();
        if (!user) return DEFAULT_STATS;

        const json = await AsyncStorage.getItem(`user_stats_${user.id}`);
        if (!json) return DEFAULT_STATS;
        return JSON.parse(json);
    } catch (e) {
        console.error("Failed to load stats", e);
        return DEFAULT_STATS;
    }
};

export const updateUserStats = async (session: { minutes: number; calories?: number }) => {
    try {
        const user = await getCurrentUser();
        if (!user) return;

        const current = await getUserStats();

        const newStats: UserStats = {
            ...current,
            totalWorkouts: current.totalWorkouts + 1,
            totalMinutes: current.totalMinutes + session.minutes,
            totalCalories: current.totalCalories + (session.calories || 0),
            level: calculateLevel(current.totalWorkouts + 1),
            rating: calculateRating(current.totalWorkouts + 1, current.streakDays)
        };

        await AsyncStorage.setItem(`user_stats_${user.id}`, JSON.stringify(newStats));
        return newStats;
    } catch (e) {
        console.error("Failed to update stats", e);
    }
};

const calculateRating = (workouts: number, streak: number): number => {
    // Logic: Base 1.0 + 0.1 per workout + 0.2 per streak day
    const score = 1.0 + (workouts * 0.1) + (streak * 0.2);
    return Math.min(5.0, Math.round(score * 10) / 10);
};

const calculateLevel = (workouts: number): UserStats['level'] => {
    if (workouts > 50) return 'Elite';
    if (workouts > 20) return 'Advanced';
    if (workouts > 5) return 'Intermediate';
    return 'Beginner';
};
// --- AUTH & BACKEND SIMULATION ---

const KEY_USERS = 'users_db_v1';
const KEY_SESSION = 'current_session_v1';

export interface AuthResponse {
    success: boolean;
    user?: any;
    message?: string;
}

export const registerUser = async (user: any): Promise<AuthResponse> => {
    try {
        const usersRaw = await AsyncStorage.getItem(KEY_USERS);
        const users = usersRaw ? JSON.parse(usersRaw) : [];

        // Check if email exists
        if (users.find((u: any) => u.email === user.email)) {
            return { success: false, message: 'Email already exists' };
        }

        const newUser = {
            id: generateUniqueId(),
            ...user,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await AsyncStorage.setItem(KEY_USERS, JSON.stringify(users));

        // Auto login
        await AsyncStorage.setItem(KEY_SESSION, JSON.stringify(newUser));
        return { success: true, user: newUser };
    } catch (e) {
        return { success: false, message: 'Registration failed' };
    }
};

export const loginUser = async (email: string, pass: string): Promise<AuthResponse> => {
    try {
        const usersRaw = await AsyncStorage.getItem(KEY_USERS);
        const users = usersRaw ? JSON.parse(usersRaw) : [];

        const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

        if (user) {
            await AsyncStorage.setItem(KEY_SESSION, JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid email or password' };
    } catch (e) {
        return { success: false, message: 'Login failed' };
    }
};

export const logoutUser = async () => {
    await AsyncStorage.removeItem(KEY_SESSION);
};

export const getCurrentUser = async () => {
    try {
        const json = await AsyncStorage.getItem(KEY_SESSION);
        return json ? JSON.parse(json) : null;
    } catch (e) { return null; }
};

// --- MODIFIED PLAN FUNCTIONS (User Specific) ---

export const saveActivePlan = async (type: 'workout' | 'nutrition', plan: any) => {
    try {
        const user = await getCurrentUser();
        if (!user) return false;

        const key = type === 'workout' ? `active_workout_${user.id}` : `active_nutrition_${user.id}`;
        const existingRaw = await AsyncStorage.getItem(key);
        const existing = existingRaw ? JSON.parse(existingRaw) : null;

        const data = {
            plan,
            checkedItems: existing ? existing.checkedItems : [],
            lastUpdated: new Date().toISOString()
        };
        await AsyncStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("Failed to save active plan", e);
        return false;
    }
};

export const getActivePlan = async (type: 'workout' | 'nutrition') => {
    try {
        const user = await getCurrentUser();
        if (!user) return null;

        const key = type === 'workout' ? `active_workout_${user.id}` : `active_nutrition_${user.id}`;
        const json = await AsyncStorage.getItem(key);
        return json ? JSON.parse(json) : null;
    } catch (e) {
        console.error("Failed to get active plan", e);
        return null;
    }
};

export const updateActivePlanProgress = async (type: 'workout' | 'nutrition', checkedItems: string[]) => {
    try {
        const user = await getCurrentUser();
        if (!user) return;

        const key = type === 'workout' ? `active_workout_${user.id}` : `active_nutrition_${user.id}`;
        const current = await getActivePlan(type);
        if (current) {
            current.checkedItems = checkedItems;
            await AsyncStorage.setItem(key, JSON.stringify(current));
        }
    } catch (e) {
        console.error("Failed to update active plan progress", e);
    }
};

export const deleteActivePlan = async (type: 'workout' | 'nutrition') => {
    try {
        const user = await getCurrentUser();
        if (!user) return;
        const key = type === 'workout' ? `active_workout_${user.id}` : `active_nutrition_${user.id}`;
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error("Failed to delete active plan", e);
    }
};

export default {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    saveActivePlan,
    getActivePlan,
    deleteActivePlan,
    updateActivePlanProgress,
    // Friend / Profile functions
    getUserProfile,
    addFriend,
    removeFriend,
    getFriendDetails,
    getFriendsDetailsList,
    getUserStats,
    updateUserStats
};
