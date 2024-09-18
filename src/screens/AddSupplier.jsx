import React, { useState } from 'react';
import { Alert, Text, TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import tw from 'twrnc';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const RegisterSupplier = () => {
  const [name, setName] = useState('');
  const [commission, setCommission] = useState(''); // Change from contactNumber to commission
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !commission) {
      Alert.alert('Missing fields', 'Please fill all fields before submitting.');
      return;
    }
    setUploading(true);

    try {
      await firestore().collection('suppliers').add({
        name,
        commission: parseFloat(commission), // Ensure commission is stored as a number
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setUploading(false);
      Alert.alert('Success', 'Supplier has been added successfully');
      setName('');
      setCommission(''); // Clear the commission input
    } catch (error) {
      console.error('Error adding supplier: ', error);
      setUploading(false);
      Alert.alert('Error', 'There was a problem submitting the form.');
    }
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#80deea']} style={styles.container}>
      <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Supplier Name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={tw`border-b border-gray-300 mb-4 p-2 text-black`}
        placeholder="Enter supplier name"
        placeholderTextColor="#888"
      />

      <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Commission:</Text>
      <TextInput
        value={commission}
        onChangeText={setCommission}
        keyboardType="numeric" // Use numeric keyboard for commission
        style={tw`border-b border-gray-300 mb-4 p-2 text-black`}
        placeholder="Enter commission"
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={uploading}>
        <Text style={tw`text-white text-center`}>{uploading ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#00796b', // Green color
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default RegisterSupplier;

