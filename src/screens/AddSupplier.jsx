import React, { useState } from 'react';
import { Alert, Text, TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import tw from 'twrnc';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const RegisterSupplier = () => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !contactNumber || !companyName) {
      Alert.alert('Missing fields', 'Please fill all fields before submitting.');
      return;
    }
    setUploading(true);

    try {
      await firestore().collection('suppliers').add({
        name,
        contactNumber,
        companyName,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setUploading(false);
      Alert.alert('Success', 'Supplier has been added successfully');
      setName('');
      setContactNumber('');
      setCompanyName('');
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

      <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Contact Number:</Text>
      <TextInput
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
        style={tw`border-b border-gray-300 mb-4 p-2 text-black`}
        placeholder="Enter contact number"
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
