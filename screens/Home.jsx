import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";

import { cacheData, getCachedData } from "../lib/cache";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyScreen, ProductCard } from "../components";

const API_KEY = 'UQZ247R01LE1O2PG';

const Home = ({ navigation }) => {
  const [gainers, setGainers] = useState(undefined);
  const [losers, setLosers] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("gainers");

  useEffect(() => {
    const fetchData = async () => {
      const cachedGainers = await getCachedData("gainers");
      const cachedLosers = await getCachedData("losers");

      if (cachedGainers && cachedLosers) {
        setGainers(cachedGainers);
        setLosers(cachedLosers);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`
        );
        if(response.status !== 200) {
          setError(true);
          setLoading(false);
          return;
        }
        const gainersData = response.data.top_gainers;
        const losersData = response.data.top_losers;
        await cacheData("gainers", gainersData);
        await cacheData("losers", losersData);
        setGainers(gainersData);
        setLosers(losersData);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error || !gainers || !losers) {
    return <EmptyScreen />;
  }

  const ProductPress = (stock) => {
    navigation.navigate("Product", { stock });
  }

  return (
    <SafeAreaView style={styles.safeView}>
      { tab === "gainers" ? 
        <View style={styles.container}>
          <Text style={styles.title}>Top Gainers</Text>
          <FlatList
            data={gainers}
            renderItem={({ item }) => (
              <ProductCard ticker={item.ticker} gainLoss={item.change_amount} onPress={ () => ProductPress(item)} />
            )}
            keyExtractor={(item) => item.ticker}
            horizontal={false}
            numColumns={2}
            contentContainerStyle={{ alignItems: 'center' }}
          />
        </View>
        : 
        <View style={styles.container}>
          <Text style={styles.title}>Top Losers</Text>
          <FlatList
            data={losers}
            renderItem={({ item }) => (
              <ProductCard ticker={item.ticker} gainLoss={item.change_amount} onPress={ () => ProductPress(item)} />
            )}
            keyExtractor={(item) => item.ticker}
            horizontal={false}
            numColumns={2}
            contentContainerStyle={{ alignItems: 'center' }} // Center the items
          />
        </View>
      }
      <View style={styles.tabs}>
        <TouchableOpacity style={ tab === "gainers" ? styles.activeTab : styles.tab} onPress={() => setTab("gainers")}>
          <Text style={{ color: tab === "gainers" ? "#fff" : "#000" }}>
            Top Gainers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={ tab === "losers" ? styles.activeTab : styles.tab} onPress={() => setTab("losers")}>
          <Text style={{ color: tab === "losers" ? "#fff" : "#000" }}>
            Top Losers
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    margin: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  tabs: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    bottom: 0,
    marginBottom: 0,
  },
  tab: {
    backgroundColor: "#fff",
    color: "black",
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#000",
  },
});

export default Home;
