import messaging from '@react-native-firebase/messaging';


export const subscribeToTopic = async (topic) => {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic: ${topic}`, error);
    }
  };
  