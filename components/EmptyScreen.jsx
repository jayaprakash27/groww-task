import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const EmptyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>An Error Occured!</Text>
    </SafeAreaView>
  )
}

export default EmptyScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
})