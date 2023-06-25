// SplashScreen.js

import React from 'react';
import { View,Image, Text, StyleSheet } from 'react-native';


const SplashScreen = () => {
    console.log("called");
  return (
    <View style={styles.container}>
    <Image
      source={require('../src/assets/uniqbets-logo.png')}
      style={styles.image}
      resizeMode="contain"
    />
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height:'100%'
      },
      image: {
        width: 200, // Adjust the width as needed
        height: 200, // Adjust the height as needed
        marginTop:'auto',
        marginBottom:'auto'
      },
});

export default SplashScreen;
