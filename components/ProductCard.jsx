import React, { useState } from 'react';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ ticker, gainLoss, onPress }) => {
    
    return (
        <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        >
            <Image source={{ uri: `https://financialmodelingprep.com/image-stock/${ticker}.png` }} style={styles.logo} />
            <Text style={styles.name}>{ticker}</Text>
            <Text style={ gainLoss > 0 ? styles.gain : styles.loss}>{gainLoss}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: 'white',
        width: 150,
        height: 150,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    gain: {
        fontSize: 14,
        marginTop: 5,
        color: "#008000",
        fontWeight: "600"
    },
    loss: {
        fontSize: 14,
        marginTop: 5,
        color: "#ff0000",
    },
});

export default ProductCard;