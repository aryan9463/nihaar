import React from 'react';
import { Image } from 'react-native';
import GoogleSignIn from './src/screens/GoogleSignIn';
import HomeScreen from './src/screens/HomeScreen';
import RegisterItems from './src/screens/RegisterItems';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { AuthProvider } from './src/auth/AuthContext';
import { store } from './src/redux/store';
import ProductsData from './src/screens/ProductsData';
import Invoice from './src/screens/Invoice';
import Splash from './src/screens/ScreenSplash';
import Notification from './src/components/Notification';
import RegisterSupplier from './src/screens/AddSupplier';
import Statement from './src/screens/Statement';
// import LinearGradient from 'react-native-linear-gradient';

const Stack = createStackNavigator();

const App = () => {
  // if (__DEV__) {

  //   console.log = () => {};
  
  //   console.warn = () => {};//hides errors from mobile screen
  
  //   console.error = () => {};
  
  // }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" options={{ headerShown: false }} component={Splash} />
            <Stack.Screen
              name="GoogleSignIn"
              options={{
                title: 'NIHAAR',
                headerTintColor: 'white',
                headerStyle: {
                  backgroundColor: 'gray',
                },
                headerLeft: () => null,
              }}
              component={GoogleSignIn}
            />
            <Stack.Screen name="AddItems" component={RegisterItems} />
            <Stack.Screen name="ProductsData" component={ProductsData} />
            <Stack.Screen name="RegisterSupplier" component={RegisterSupplier} />
            <Stack.Screen name="Statement" component={Statement} />
            <Stack.Screen
              options={{ headerLeft: () => null }}
              name="INVOICE"
              component={Invoice}
            />
            <Stack.Screen
              name="HomeScreen"
              options={{
                headerLeft: () => (
                  <Image
                    source={require('./src/images/floral.png')} // Replace with your image path
                    style={{ width: 150, height: 50, marginLeft: 15 }} // Adjust width to cover half of the header
                  />
                ),
                headerRight: () => <Notification />,
                headerTitle: () => null, // Remove title from the header
                headerStyle: {
                  backgroundColor: '#e0f7fa', // Match your HomeScreen background
                  elevation: 0, // Remove shadow on Android
                },
                headerTintColor: 'white', // Adjust text/icon color if needed
              }}
              component={HomeScreen}
            />
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
