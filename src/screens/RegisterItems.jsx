import React, { useState } from 'react';
import { 
  Alert, 
  Text, 
  TextInput, 
  View, 
  Image, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from "@react-native-firebase/app";
import storage from "@react-native-firebase/storage";
import { 
  addDoc, 
  collection, 
  getFirestore, 
  serverTimestamp 
} from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBkWLveBW4GF34Bkr5aj9r3cEcZfYwsIHU',
  authDomain: 'nihaar-app.firebaseapp.com',
  projectId: 'nihaar-app',
  storageBucket: 'nihaar-app.appspot.com',
  messagingSenderId: '455629437938',
  appId: '1:455629437938:web:eb4ed48e0166697cfe496b',
  measurementId: 'G-J3RN24PFSS',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = getFirestore();
const datacollection = collection(db, 'dataCollection');

const RegisterItems = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [commission, setCommission] = useState('');
  const [price, setPrice] = useState('');
  const [numberOfItems, setNumberOfItems] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      width: 800,
      height: 800,
    })
      .then(image => {
        setImageUri(image.path);
      })
      .catch(error => {
        console.error('ImagePicker Error: ', error);
      });
  };

  const captureImage = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      width: 800,
      height: 800,
    })
      .then(image => {
        setImageUri(image.path);
      })
      .catch(error => {
        console.error('ImagePicker Error: ', error);
      });
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('No Image Selected', 'Please select an image before submitting.');
      return null;
    }

    const fileName = `${new Date().getTime()}.jpg`;
    const reference = storage().ref(fileName);
    setUploading(true);

    try {
      await reference.putFile(imageUri);
      const imageUrl = await reference.getDownloadURL();
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image: ', error);
      Alert.alert('Error', 'There was a problem uploading the image.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const imageUrl = await uploadImage();
      if (imageUrl) {
        await addDoc(datacollection, {
          name,
          description,
          price: parseFloat(price),
          commission: parseFloat(commission),
          numberOfItems: parseInt(numberOfItems, 10),
          imageUrl,
          createdAt: serverTimestamp(),
        });
        Alert.alert('Success', 'Form submitted successfully!');
        setName('');
        setDescription('');
        setPrice('');
        setCommission('');
        setNumberOfItems('');
        setImageUri(null);
      }
    } catch (error) {
      console.error('Error submitting form: ', error);
      Alert.alert('Error', 'There was a problem submitting the form.');
    }
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#80deea']} style={styles.container}>
      <Text>Name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Enter product name"
        placeholderTextColor="#888"
      />
      <Text>Description:</Text>
      <TextInput
        value={description}
        placeholder="Enter product description"
        placeholderTextColor="#888"
        onChangeText={setDescription}
        style={styles.input}
      />
      <Text>Price:</Text>
      <TextInput
        value={price}
        placeholder="Price"
        placeholderTextColor="#888"
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Text>Commission:</Text>
      <TextInput
        value={commission}
        onChangeText={setCommission}
        keyboardType="numeric"
        placeholder="Enter commission"
        placeholderTextColor="#888"
        style={styles.input}
      />
      <Text>Number of Items:</Text>
      <TextInput
        value={numberOfItems}
        onChangeText={setNumberOfItems}
        keyboardType="numeric"
        placeholder="Enter number of items"
        placeholderTextColor="#888"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image from Gallery</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={captureImage}>
        <Text style={styles.buttonText}>Capture Image with Camera</Text>
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={uploading}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    color: 'black',
  },
  button: {
    backgroundColor: '#00796b', // Teal color
    padding: 10,
    borderRadius: 10,
    marginBottom: 10, // Spacing between buttons
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  imageContainer: {
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
});

export default RegisterItems;
