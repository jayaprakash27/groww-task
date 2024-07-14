import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { CartesianChart } from 'victory-native';
import axios from 'axios';

const ProductScreen = ({ route }) => {
  const { stock } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.ticker}&apikey=LBQNJBW6HIF4HX1C`);
        console.log(response.data['Time Series (Daily)']);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
    console.log(stock.ticker);
  }, [stock]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error loading data</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{stock.name}</Text>
        <CartesianChart
            data={chartData}
            x="x"
            y="y"
            width={350}
            height={200}
            domainPadding={{ x: 20 }}
            style={{
                parent: {
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                },
                data: {
                    fill: '#007bff',
                },
            }}
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
});

export default ProductScreen;
