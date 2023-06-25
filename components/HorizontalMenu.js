// HorizontalMenu.js
import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HorizontalMenu = (props) => {
  console.log("horizotal");
  const renderTitle = ({ item }) => {
    const isActive = item.id === props.activeMenuId;
    const lineStyle = isActive
    ? [styles.activeTitleLine, { width: '90%' }]
    : styles.titleLine;
    return (
      <TouchableOpacity
        onPress={() => 
        {
          props.handleMenuSelect(item.id);
          
        }}
        style={styles.titleContainer}
        
      >
        <Text
          style={[
            styles.titleText,
            isActive && styles.activeTitleText,
          ]}
        >
          {item.name}
        </Text>
        {isActive && <View style={lineStyle} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={props.category}
        renderItem={renderTitle}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  titleContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  titleText: {
    color: '#959EA7',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeTitleText: {
    color: 'white',
  },
  activeTitleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeTitleLine: {
    backgroundColor: '#2ECC71',
    height: 2,
    alignSelf: 'center',
  },
});

export default HorizontalMenu;
