import AsyncStorage from '@react-native-async-storage/async-storage';

// cache data with expiry time in milliseconds

const cacheData = async (key, data, expiryInMs = 60000) => {
  try {
    const item = {
      data,
      expiry: Date.now() + expiryInMs,
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
  }
  catch (error) {
    console.error('Error caching data', error);
  }
}

const getCachedData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) {
      return null;
    }

    const item = JSON.parse(value);
    if (Date.now() > item.expiry) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return item.data;
  }
  catch (error) {
    console.error('Error getting cached data', error);
    return null;
  }
};

export { cacheData, getCachedData };