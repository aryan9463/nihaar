import React, { useState } from 'react';
import { 
  Alert, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Image, 
  StyleSheet 
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import LinearGradient from 'react-native-linear-gradient';

// Initialize Firestore
const firebaseConfig = {
  apiKey: "AIzaSyCOFFtTGvD-B7rhBva5pX13slbLv3HnZXA",
  authDomain: "nihaar-d5d2f.firebaseapp.com",
  projectId: "nihaar-d5d2f",
  storageBucket: "nihaar-d5d2f.appspot.com",
  messagingSenderId: "532552721085",
  appId: "1:532552721085:web:9ba14efd088d3329d8cdd4",
  measurementId: "G-FFBKMYK2VD"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = getFirestore();
const datacollection = collection(db, "datacolnew");

const AddProducts = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [commission, setCommission] = useState('');
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      width: 800,
      height: 800,
    }).then(image => {
      setImageUri(image.path);
    }).catch(error => {
      console.error('ImagePicker Error: ', error);
    });
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('No Image Selected', 'Please select an image before submitting.');
      return null;
    }

    const fileName = `${new Date().getTime()}.jpg`; // Unique name for each image
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
          imageUrl,
          createdAt: serverTimestamp(),
        });
        Alert.alert('Success', 'Form submitted successfully!');
        setName('');
        setDescription('');
        setPrice('');
        setCommission('');
        setImageUri(null);
      }
    } catch (error) {
      console.error('Error submitting form: ', error);
      Alert.alert('Error', 'There was a problem submitting the form.');
    }
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#80deea']} style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#888"
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        value={description}
        placeholder="Enter your Description"
        placeholderTextColor="#888"
        onChangeText={setDescription}
        style={styles.input}
      />
      <Text style={styles.label}>Price:</Text>
      <TextInput
        value={price}
        placeholder='Price'
        placeholderTextColor="#888"
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.label}>Commission:</Text>
      <TextInput
        value={commission}
        onChangeText={setCommission}
        keyboardType="numeric"
        placeholder="Enter commission"
        placeholderTextColor="#888"
        style={styles.input}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit} 
        disabled={uploading}>
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
  label: {
    color: '#333',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    color: 'black',
  },
  button: {
    backgroundColor: '#00796b', // Teal color
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
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

export default AddProducts;
