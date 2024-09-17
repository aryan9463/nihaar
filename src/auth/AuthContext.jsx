import React, { createContext, useContext, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";

const AuthContext = createContext();
GoogleSignin.configure({
  webClientId: '455629437938-9qa7vqpstd6uv385sg9ugtkodpapf8e1.apps.googleusercontent.com', // From Firebase console
});

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.data.user) {
        // Update userInfo state
        setUserInfo(response.data.user);
        console.log(response.data.user);
        

        // Navigate to HomeScreen with the response data
        // navigation.reset({
        //   index: 0,
        //   routes: [
        //     {
        //       name: 'HomeScreen',
        //       params: { user: response.data.user },  // Use response data here
        //     },
        //   ],
        // });
        navigation.navigate('HomeScreen', { user: response.data.user });

      } else {
        console.log('Sign-in was cancelled');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    console.log("signing out");
    
    try {
      await GoogleSignin.signOut();
      setUserInfo(null); // Clear user info from the state
      navigation.reset({ index: 0, routes: [{ name: "GoogleSignIn" }] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ userInfo, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
