import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
 
const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('GoogleSignIn');
    }, 2000);
  }, []);
 
  return (
    <View style={styles.container}>
      <Image
        source={require('../images/splash_screen.png')}
        style={styles.logo}
      />
      <Text style={styles.text}></Text>
    </View>
  );
};
 
export default Splash;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',  // Make background black for a more immersive look
  },
  logo: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',  // Cover the entire screen with the image while maintaining aspect ratio
  },
  text: {
    color: 'gold',   // Use gold text for a modern look
    fontSize: 30,
    fontWeight: 'bold',
    position: 'absolute', // Keep the text on top of the image
    bottom: 50,   // Adjust to position the text at the bottom
    textAlign: 'center',
  },
});
