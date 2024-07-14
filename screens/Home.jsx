import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

import { cacheData, getCachedData } from '../lib/cache';

const Home = ({ navigation }) => {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        const cachedGainers = await getCachedData('gainers');
      const cachedLosers = await getCachedData('losers');

      if (cachedGainers && cachedLosers) {
        setGainers(cachedGainers);
        setLosers(cachedLosers);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=LBQNJBW6HIF4HX1C`);

    const gainersData = response.data.top_gainers;
    const losersData = response.data.top_losers;

    await cacheData('gainers', gainersData);
    await cacheData('losers', losersData);

        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error loading data</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Gainers</Text>
      <FlatList
        data={gainers}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Product', { stock: item })}>
            <View style={styles.card}>
              <Text>{item.ticker}</Text>
              <Text>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.symbol}
      />
      <Text style={styles.title}>Top Losers</Text>
      <FlatList
        data={losers}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Product', { stock: item })}>
            <View style={styles.card}>
              <Text>{item.name}</Text>
              <Text>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.symbol}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default Home;
