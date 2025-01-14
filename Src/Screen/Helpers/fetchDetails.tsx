import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchToken = async (): Promise<string | null> => {
    const token = await AsyncStorage.getItem('token');
    return token;
};

export const fetchUserId = async (): Promise<string | null> => {
    const userId = await AsyncStorage.getItem('userId');
    return userId;
};


export const LocationId = async (): Promise<string | null> => {
    const LocationId = await AsyncStorage.getItem('LocationId');
    return LocationId;
};