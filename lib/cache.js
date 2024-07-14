import AsyncStorage from '@react-native-async-storage/async-storage';

const cacheData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching data', error);
  }
};

const getCachedData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached data', error);
    return null;
  }
};

export { cacheData, getCachedData };