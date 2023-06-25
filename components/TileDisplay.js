import React from 'react';
import { View, FlatList, Image, Text, StyleSheet, Dimensions  } from 'react-native';
import { Tile } from 'react-native-elements';
const windowWidth = Dimensions.get('window').width;
const TileDisplay = (props) => {
  console.log(props.category);
  const renderTile = ({ item }) => (  
    <View style={styles.tileContainer}>
    <Image source={{ uri: item.imageurl }} style={styles.image} />
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{item.name}</Text>
    </View>
  </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={props.category}
        renderItem={renderTile}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  tileContainer: {
    width: windowWidth * 0.45,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop:10,
    marginBottom:10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
  },
  titleText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TileDisplay;
