import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import SplashScreen from './components/SplashScreen';
import HorizontalMenu from './components/HorizontalMenu';
import Loader from './components/Loader';
import PredictionCard from './components/PredictionCard';
import OurBettings from './components/OurBettings';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

function App() {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [ourbettings, setOurBettings] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const controllerRef = useRef(null);
  const [predictionLoading, setPredictionLoading] = useState(true);
  const [activeButton, setActiveButton] = useState('button1');
  const [prediction, setPrediction] = useState([]);
  const [noPredictionMessage, setNoPredictionMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  const checkNotificationPermission = async () => {
    try {
      const status = await check(PERMISSIONS.IOS.NOTIFICATIONS);

      if (status === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.IOS.NOTIFICATIONS);

        if (requestResult === RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      } else if (status === RESULTS.GRANTED) {
        console.log('Notification permission already granted');
      } else {
        console.log('Notification permission undetermined');
      }
    } catch (error) {
      console.log('Error checking notification permission:', error);
    }
  };

  const subscribeToTopic = async (topicName) => {
    try {
      await messaging().subscribeToTopic(topicName);
      console.log(messaging().getToken);
      console.log('Subscribed to topic:', topicName);
    } catch (error) {
      console.log('Subscription to topic failed:', error);
    }
  };

  const token = async () => {
    messaging()
      .getToken()
      .then((token) => {
        console.log('FCM Token:', token);
      })
      .catch((error) => {
        console.log('Failed to get FCM token:', error);
      });
  };

  const handleButtonPress = (buttonName) => {
    if (activeButton !== buttonName) {
      setActiveButton(buttonName);
      if (buttonName === 'button1') {
        getCategory();
      }
      if (buttonName === 'button2') {
        setOurBettings([]);
        getOurBettings();
      }
    }
  };

  const getCategory = async () => {
    console.log('category');
    const newController = new AbortController();
    controllerRef.current = newController;
    try {
      const response = await fetch(`https://uniq-bets.com/data/category.php`, {
        signal: newController.signal,
      });

      if (!response.ok) {
        throw new Error('API request failed'); // Throw an error for non-2xx response status
      }

      const data = await response.json();
      setCategory(data); // Handle the API response data
      handleMenuSelect(data[0]?.id);
    } catch (error) {
      if (error.name === 'AbortError') {
        // API call was aborted, do not handle the error
      } else {
        console.error(error);
        // Handle the error here
        if (!isConnected) {
          showRetryAlert('Failed to fetch categories. Please check your internet connection and try again.');
        }
      }
    } finally {
      // Set loading state to false after the API call is completed
      setIsLoading(false);
    }
  };

  const getOurBettings = async () => {
    const newController = new AbortController();
    controllerRef.current = newController;
    try {
      const response = await fetch(`https://uniq-bets.com/data/ourbetting.php`, {
        signal: newController.signal,
      });

      if (!response.ok) {
        throw new Error('API request failed'); // Throw an error for non-2xx response status
      }

      const data = await response.json();
      setOurBettings(data); // Handle the API response data
    } catch (error) {
      if (error.name === 'AbortError') {
        // API call was aborted, do not handle the error
      } else {
        console.error(error);
        // Handle the error here
        if (!isConnected) {
          showRetryAlert('Failed to fetch our bettings. Please check your internet connection and try again.');
        }
      }
    } finally {
      // Set loading state to false after the API call is completed
      setPredictionLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    checkNotificationPermission();
    token();

    subscribeToTopic('TestTopic');
    getCategory();

    return () => {
      unsubscribe(); // Unsubscribe from NetInfo event listener when the component unmounts
    };
  }, []);

  const handleMenuSelect = async (menuId) => {
    if (activeMenuId !== menuId) {
      setPredictionLoading(true);
      setActiveMenuId(menuId);
      setPrediction([]);
      setNoPredictionMessage('');

      if (controllerRef.current) {
        // Cancel the pending API call
        controllerRef.current.abort();
      }

      const newController = new AbortController();
      controllerRef.current = newController;

      try {
        const response = await fetch(`https://www.uniq-bets.com/data/predictions.php?category=${menuId}`, {
          signal: newController.signal,
        });

        if (!response.ok) {
          throw new Error('API request failed'); // Throw an error for non-2xx response status
        }

        const data = await response.json();

        if (data.length === 0) {
          setNoPredictionMessage('There is no prediction available for the selected game. Please check out other games.');
        } else {
          setPrediction(data); // Handle the API response data
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          // API call was aborted, do not handle the error
        } else {
          console.error(error);
          // Handle the error here
          if (!isConnected) {
            showRetryAlert('Failed to fetch predictions. Please check your internet connection and try again.');
          }
        }
      } finally {
        // Set loading state to false after the API call is completed
        setPredictionLoading(false);
      }
    }
  };

  const handleButton1Press = () => {
    // Handle button 1 press
  };

  const handleButton2Press = () => {
    // Handle button 2 press
  };

  return (
    <View style={styles.container}>
      {!isConnected && (
        <Text style={styles.offlineText}>You are currently offline. Please check your internet connection.</Text>
      )}
      {isLoading ? (
        <SplashScreen />
      ) : (
        <>
          {activeButton === 'button1' && (
            <>
              {category && (
                <HorizontalMenu category={category} activeMenuId={activeMenuId} handleMenuSelect={handleMenuSelect} />
              )}
            </>
          )}
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {activeButton === 'button1' && (
              <>
                {noPredictionMessage ? (
                  <Text style={styles.noPredictionMessage}>{noPredictionMessage}</Text>
                ) : (
                  <>
                    {prediction && <PredictionCard prediction={prediction} />}
                    {predictionLoading && <Loader />}
                  </>
                )}
              </>
            )}
            {activeButton === 'button2' && (
              <>
                {predictionLoading && <Loader />}
                {ourbettings && <OurBettings ourbettings={ourbettings} />}
              </>
            )}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, activeButton === 'button1' && styles.activeButton]}
              onPress={() => handleButtonPress('button1')}
            >
              <Text
                style={[
                  styles.buttonText,
                  activeButton === 'button1' && styles.activeButtonText,
                ]}
              >
                Predictions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, activeButton === 'button2' && styles.activeButton]}
              onPress={() => handleButtonPress('button2')}
            >
              <Text
                style={[
                  styles.buttonText,
                  activeButton === 'button2' && styles.activeButtonText,
                ]}
              >
                Our Bettings
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    paddingBottom: 10,
    paddingTop: 10,
    width: '100%',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#959EA7',
    width: '40%',
  },
  buttonText: {
    color: '#959EA7',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeButtonText: {
    color: 'white',
  },
  activeButton: {
    backgroundColor: '#2ECC71',
    color: 'white',
  },
  noPredictionMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 20,
  },
  offlineText: {
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#FF0000',
  },
});

export default App;
