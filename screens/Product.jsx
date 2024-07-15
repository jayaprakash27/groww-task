import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { EmptyScreen } from '../components';
import { cacheData, getCachedData } from '../lib/cache';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_KEY = 'UQZ247R01LE1O2PG';

const Product = ({ route }) => {
  const { stock } = route.params;
  const [companyInfo, setCompanyInfo] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      
      const cachedOverView = await getCachedData(stock.ticker+"-overview");
      const cachedIntraDay = await getCachedData(stock.ticker+"-intraday");
      if (cachedOverView && cachedIntraDay) {
        setCompanyInfo(cachedOverView);
        setHistoricalData(cachedIntraDay);
        console.log(cachedIntraDay)
        setLoading(false);
        return;
      }
      try {
        // Fetch company overview
        const overviewResponse = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock.ticker}&apikey=${API_KEY}`);
        const overviewData = overviewResponse.data;
        // Fetch stock quote (intra-day data for the graph)
        const intradayResponse = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock.ticker}&interval=5min&apikey=${API_KEY}`);
        const intradayData = intradayResponse.data['Time Series (5min)'];
        
        const historicalDataArray = Object.keys(intradayData).map(time => ({
          time,
          price: parseFloat(intradayData[time]['4. close'])
        })).reverse();

        setCompanyInfo(overviewData);
        await cacheData(stock.ticker+"-overview", overviewData);
        setHistoricalData(historicalDataArray);
        await cacheData(stock.ticker+"-intraday", historicalDataArray);
        setLoading(false);
      } catch (err) {
        setError(true);
        console.log( "ERROR", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [stock.ticker]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <EmptyScreen />;
  }

  const {
    Name,
    Description,
    Industry,
    Sector,
    '52WeekLow': weekLow,
    '52WeekHigh': weekHigh,
    MarketCapitalization: marketCap,
    PERatio: peRatio,
    Beta,
    DividendYield: dividendYield,
    ProfitMargin: profitMargin,
  } = companyInfo;

  // Select only a few labels for the x-axis
  const labelInterval = Math.ceil(historicalData.length / 5);
  const labels = historicalData.map((item, index) => (index % labelInterval === 0 ? formatTimeToAMPM(item.time)  : ''));

  const data = {
    labels: labels,
    datasets: [
      {
        data: historicalData.map(item => item.price),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: `https://financialmodelingprep.com/image-stock/${stock.ticker}.png` }} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.companyName}>{Name}</Text>
          <Text style={styles.stockSymbol}>{stock.ticker}</Text>
          <Text style={styles.stockPrice}>${historicalData[historicalData.length - 1].price}</Text>
        </View>
      </View>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#f9f9f9',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '1',
            strokeWidth: '2',
            stroke: '#0000ff',
          },
        }}
        bezier
        style={styles.graph}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>About {Name}</Text>
        <Text style={styles.infoText}>{Description}</Text>
        <View style={styles.chipContainer}>
          <Text style={styles.chip}>{Industry}</Text>
          <Text style={styles.chip}>{Sector}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>52-Week Low</Text>
            <Text style={styles.value}>${weekLow}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>52-Week High</Text>
            <Text style={styles.value}>${weekHigh}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Market Cap</Text>
            <Text style={styles.value}>${marketCap}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>P/E Ratio</Text>
            <Text style={styles.value}>{peRatio}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Beta</Text>
            <Text style={styles.value}>{Beta}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Dividend Yield</Text>
            <Text style={styles.value}>{dividendYield}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Profit Margin</Text>
            <Text style={styles.value}>{profitMargin}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const formatTimeToAMPM = (dateString) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12; // Convert hour '0' to '12'
  const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutesFormatted} ${ampm}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stockSymbol: {
    fontSize: 18,
    color: '#888',
  },
  stockPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  graph: {
    marginVertical: 8,
    borderRadius: 16,
  },
  infoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginRight: 8,
    backgroundColor: '#eee',
    borderRadius: 16,
    fontSize: 12,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Product;
