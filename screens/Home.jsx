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

const API_KEY = '0A1DTP7NIQXJPFII';

const Home = ({ navigation }) => {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
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
        // const response = {
        //   data: {"last_updated": "2024-07-12 16:15:58 US/Eastern", "metadata": "Top gainers, losers, and most actively traded US tickers", "most_actively_traded": [{"change_amount": "0.2242", "change_percentage": "109.206%", "price": "0.4295", "ticker": "QLGN", "volume": "412757769"}, {"change_amount": "-0.0032", "change_percentage": "-1.3295%", "price": "0.2375", "ticker": "MAXN", "volume": "276018556"}, {"change_amount": "1.875", "change_percentage": "1.4717%", "price": "129.275", "ticker": "NVDA", "volume": "247654647"}, {"change_amount": "0.0179", "change_percentage": "21.8027%", "price": "0.1", "ticker": "AGRI", "volume": "185410833"}, {"change_amount": "0.85", "change_percentage": "25.0%", "price": "4.25", "ticker": "LCID", "volume": "166790994"}, {"change_amount": "7.2", "change_percentage": "2.9872%", "price": "248.23", "ticker": "TSLA", "volume": "155183167"}, {"change_amount": "-0.11", "change_percentage": "-1.4417%", "price": "7.52", "ticker": "SQQQ", "volume": "148192326"}, {"change_amount": "0.3751", "change_percentage": "110.9763%", "price": "0.7131", "ticker": "VEV", "volume": "114827008"}, {"change_amount": "0.83", "change_percentage": "15.4562%", "price": "6.2", "ticker": "SOUN", "volume": "106896133"}, {"change_amount": "1.355", "change_percentage": "8.0847%", "price": "18.115", "ticker": "RIVN", "volume": "96457508"}, {"change_amount": "0.545", "change_percentage": "4.046%", "price": "14.015", "ticker": "F", "volume": "85149350"}, {"change_amount": "0.0454", "change_percentage": "6.9965%", "price": "0.6943", "ticker": "FCEL", "volume": "82258268"}, {"change_amount": "0.78", "change_percentage": "5.8912%", "price": "14.02", "ticker": "TSLL", "volume": "74307334"}, {"change_amount": "-0.66", "change_percentage": "-3.3183%", "price": "19.23", "ticker": "SOXS", "volume": "63735604"}, {"change_amount": "1.19", "change_percentage": "16.8555%", "price": "8.25", "ticker": "QS", "volume": "62798462"}, {"change_amount": "0.995", "change_percentage": "2.9701%", "price": "34.495", "ticker": "INTC", "volume": "62027334"}, {"change_amount": "-0.0322", "change_percentage": "-10.0562%", "price": "0.288", "ticker": "DNA", "volume": "60627722"}, {"change_amount": "1.1", "change_percentage": "70.9677%", "price": "2.65", "ticker": "TOYO", "volume": "56446132"}, {"change_amount": "1.745", "change_percentage": "9.1746%", "price": "20.765", "ticker": "MARA", "volume": "53369327"}, {"change_amount": "-3.59", "change_percentage": "-5.9674%", "price": "56.57", "ticker": "WFC", "volume": "52887741"}], "top_gainers": [{"change_amount": "0.0212", "change_percentage": "140.3974%", "price": "0.0363", "ticker": "NUKKW", "volume": "3718"}, {"change_amount": "0.3751", "change_percentage": "110.9763%", "price": "0.7131", "ticker": "VEV", "volume": "114827008"}, {"change_amount": "0.2242", "change_percentage": "109.206%", "price": "0.4295", "ticker": "QLGN", "volume": "412757769"}, {"change_amount": "0.0202", "change_percentage": "103.5897%", "price": "0.0397", "ticker": "PAVMZ", "volume": "2802"}, {"change_amount": "0.0043", "change_percentage": "95.5556%", "price": "0.0088", "ticker": "SEPAW", "volume": "34336"}, {"change_amount": "0.038", "change_percentage": "90.4762%", "price": "0.08", "ticker": "LIXTW", "volume": "19584"}, {"change_amount": "4.98", "change_percentage": "89.0877%", "price": "10.57", "ticker": "IVP", "volume": "40463826"}, {"change_amount": "8.56", "change_percentage": "87.2579%", "price": "18.37", "ticker": "LPA", "volume": "7090866"}, {"change_amount": "0.48", "change_percentage": "80.0%", "price": "1.08", "ticker": "ZURAW", "volume": "484378"}, {"change_amount": "1.1", "change_percentage": "70.9677%", "price": "2.65", "ticker": "TOYO", "volume": "56446132"}, {"change_amount": "0.0699", "change_percentage": "69.8302%", "price": "0.17", "ticker": "GLSTR", "volume": "2700"}, {"change_amount": "4.5", "change_percentage": "63.9205%", "price": "11.54", "ticker": "TDW+", "volume": "13081"}, {"change_amount": "0.0731", "change_percentage": "60.7143%", "price": "0.1935", "ticker": "NXLIW", "volume": "146"}, {"change_amount": "0.0449", "change_percentage": "59.787%", "price": "0.12", "ticker": "MRDB+", "volume": "621751"}, {"change_amount": "0.0346", "change_percentage": "57.3798%", "price": "0.0949", "ticker": "HLLY+", "volume": "1300"}, {"change_amount": "0.0272", "change_percentage": "53.8614%", "price": "0.0777", "ticker": "AENTW", "volume": "2537"}, {"change_amount": "0.0049", "change_percentage": "53.8462%", "price": "0.014", "ticker": "APLMW", "volume": "7313"}, {"change_amount": "0.0697", "change_percentage": "53.4919%", "price": "0.2", "ticker": "NRSNW", "volume": "4986"}, {"change_amount": "3.13", "change_percentage": "51.9934%", "price": "9.15", "ticker": "NISN", "volume": "7352583"}, {"change_amount": "0.027", "change_percentage": "50.9434%", "price": "0.08", "ticker": "ZPTAW", "volume": "47530"}], "top_losers": [{"change_amount": "-0.0368", "change_percentage": "-78.2979%", "price": "0.0102", "ticker": "MCACW", "volume": "42607"}, {"change_amount": "-1.2795", "change_percentage": "-60.3538%", "price": "0.8405", "ticker": "SISI", "volume": "4634899"}, {"change_amount": "-0.0166", "change_percentage": "-56.2712%", "price": "0.0129", "ticker": "HYZNW", "volume": "9276"}, {"change_amount": "-3.47", "change_percentage": "-49.5007%", "price": "3.54", "ticker": "MCAC", "volume": "181308"}, {"change_amount": "-0.0055", "change_percentage": "-47.8261%", "price": "0.006", "ticker": "ALSAW", "volume": "74963"}, {"change_amount": "-0.0114", "change_percentage": "-46.9136%", "price": "0.0129", "ticker": "SRZNW", "volume": "4409"}, {"change_amount": "-0.2117", "change_percentage": "-44.8802%", "price": "0.26", "ticker": "FMSTW", "volume": "2000"}, {"change_amount": "-0.0299", "change_percentage": "-42.7143%", "price": "0.0401", "ticker": "SATLW", "volume": "60916"}, {"change_amount": "-0.0073", "change_percentage": "-39.2473%", "price": "0.0113", "ticker": "SVMHW", "volume": "43503"}, {"change_amount": "-3.28", "change_percentage": "-38.5882%", "price": "5.22", "ticker": "MCACU", "volume": "2393"}, {"change_amount": "-0.0103", "change_percentage": "-36.7857%", "price": "0.0177", "ticker": "RMCOW", "volume": "108"}, {"change_amount": "-0.0061", "change_percentage": "-35.6725%", "price": "0.011", "ticker": "PRENW", "volume": "21722"}, {"change_amount": "-0.0258", "change_percentage": "-33.9474%", "price": "0.0502", "ticker": "MMVWW", "volume": "15205"}, {"change_amount": "-0.0125", "change_percentage": "-32.8947%", "price": "0.0255", "ticker": "VLN+", "volume": "15908"}, {"change_amount": "-0.0313", "change_percentage": "-30.8983%", "price": "0.07", "ticker": "MACAW", "volume": "3750"}, {"change_amount": "-0.1311", "change_percentage": "-30.0%", "price": "0.3059", "ticker": "NXGLW", "volume": "5191"}, {"change_amount": "-0.0999", "change_percentage": "-29.991%", "price": "0.2332", "ticker": "PHGE=", "volume": "302"}, {"change_amount": "-0.0147", "change_percentage": "-29.5181%", "price": "0.0351", "ticker": "ONMDW", "volume": "81561"}, {"change_amount": "-0.0087", "change_percentage": "-29.2929%", "price": "0.021", "ticker": "ECXWW", "volume": "1500"}, {"change_amount": "-0.06", "change_percentage": "-28.5714%", "price": "0.15", "ticker": "CYTHW", "volume": "1099"}]}
        // };
        console.log(response.data);
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

  if (error) {
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
            contentContainerStyle={{ alignItems: 'center' }} // Center the items
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
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
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
