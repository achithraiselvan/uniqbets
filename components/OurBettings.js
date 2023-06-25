import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

const OurBettings = ({ ourbettings }) => {
  return (
    <View style={styles.container}>
      {ourbettings.map((betting) => (
        <View key={betting.id} style={styles.bettingContainer}>
          <FastImage
            source={{
              uri: betting.imageurl,
              priority: FastImage.priority.normal,
            }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={styles.textContainer}>
            <Text style={styles.date}>{betting.name}</Text>
            <Text style={styles.time}>{betting.icon}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bettingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1, // If images are not square, remove this line
  },
  textContainer: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  time: {
    fontSize: 14,
    color: '#959EA7',
  },
});

export default OurBettings;
