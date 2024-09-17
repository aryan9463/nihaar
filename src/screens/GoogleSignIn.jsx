import React from 'react';
import tw from 'twrnc';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import LinearGradient from 'react-native-linear-gradient';

const GoogleSignIn = () => {
  const { signOut, signIn, setUserInfo, userInfo } = useAuth();

  return (
    <LinearGradient colors={['#e0f7fa', '#80deea']} style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-black text-4xl font-bold mb-8`}>Please Sign In</Text>
      
      <TouchableOpacity 
        onPress={signIn}
        style={tw`bg-white rounded-lg shadow-md w-56 p-4 flex-row items-center justify-center`}
      >
        <Image
          style={tw`w-12 h-12 mr-2`} // Increased size for better visibility
          source={require('../images/google.png')}
        />
        <Text style={tw`text-lg text-gray-800 font-semibold`}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Optional Sign Out Button for testing */}
      {userInfo && (
        <TouchableOpacity 
          onPress={signOut}
          style={tw`mt-4 bg-red-500 rounded-lg shadow-md w-56 p-4 flex-row items-center justify-center`}
        >
          <Text style={tw`text-white text-lg font-semibold`}>Sign Out</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

export default GoogleSignIn;
