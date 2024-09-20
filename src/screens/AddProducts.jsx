import React, { useState } from 'react';
import { 
  Alert, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Image, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import LinearGradient from 'react-native-linear-gradient';

// Initialize Firestore
const firebaseConfig = {
  apiKey: 'AIzaSyCOFFtTGvD-B7rhBva5pX13slbLv3HnZXA',
  authDomain: 'nihaar-d5d2f.firebaseapp.com',
  projectId: 'nihaar-d5d2f',
  storageBucket: 'nihaar-d5d2f.appspot.com',
  messagingSenderId: '532552721085',
  appId: '1:532552721085:web:9ba14efd088d3329d8cdd4',
  measurementId: 'G-FFBKMYK2VD'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = getFirestore();
const datacollection = collection(db, 'datacolnew');

const AddProducts = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUris, setImageUris] = useState([]); // Array for multiple images
  const [price, setPrice] = useState('');
  const [numberOfItems, setNumberOfItems] = useState('');
  const [uploading, setUploading] = useState(false);
  const [supplierId, setSupplierId] = useState(''); // New state for supplierId

  const pickImages = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: true, // Allow selection of multiple images
      cropping: true,
      width: 800,
      height: 800,
    }).then(images => {
      const imagePaths = images.map(image => image.path);
      setImageUris(prev => [...prev, ...imagePaths]); // Update state with multiple image paths
    }).catch(error => {
      console.error('ImagePicker Error: ', error);
    });
  };

  const uploadImages = async () => {
    if (imageUris.length === 0) {
      Alert.alert('No Images Selected', 'Please select images before submitting.');
      return null;
    }

    setUploading(true);
    const imageUrls = [];

    try {
      for (const imageUri of imageUris) {
        const fileName = `${new Date().getTime()}-${imageUri.split('/').pop()}`; // Unique name for each image
        const reference = storage().ref(fileName);
        await reference.putFile(imageUri);
        const imageUrl = await reference.getDownloadURL();
        imageUrls.push(imageUrl); // Collect all image URLs
      }
      return imageUrls;
    } catch (error) {
      console.error('Error uploading images: ', error);
      Alert.alert('Error', 'There was a problem uploading the images.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !price || !numberOfItems || !supplierId) {
      Alert.alert('Missing fields', 'Please fill all fields before submitting.');
      return;
    }

    try {
      const imageUrls = await uploadImages();
      if (imageUrls) {
        await addDoc(datacollection, {
          name,
          description,
          price: parseFloat(price),
          numberOfItems: parseInt(numberOfItems, 10),
          imageUrls, // Save array of image URLs
          supplierId, // Send supplierId but don't display it
          createdAt: serverTimestamp(),
        });
        Alert.alert('Success', 'Form submitted successfully!');
        setName('');
        setDescription('');
        setPrice('');
        setNumberOfItems('');
        setImageUris([]); // Clear the image array
      }
    } catch (error) {
      console.error('Error submitting form: ', error);
      Alert.alert('Error', 'There was a problem submitting the form.');
    }
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#80deea']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter product name"
          placeholderTextColor="#888"
        />
        <Text style={styles.label}>Description:</Text>
        <TextInput
          value={description}
          placeholder="Enter product description"
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
        <Text style={styles.label}>Number of Items:</Text>
        <TextInput
          value={numberOfItems}
          onChangeText={setNumberOfItems}
          keyboardType="numeric"
          placeholder="Enter number of items"
          placeholderTextColor="#888"
          style={styles.input}
        />
        <Text style={styles.label}>Supplier ID:</Text>
        <TextInput
          value={supplierId}
          onChangeText={setSupplierId}
          placeholder="Enter supplier ID"
          placeholderTextColor="#888"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={pickImages}>
          <Text style={styles.buttonText}>Pick Images</Text>
        </TouchableOpacity>
        {imageUris.length > 0 && (
          <View style={styles.imageContainer}>
            {imageUris.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity onPress={() => setImageUris(imageUris.filter((_, i) => i !== index))} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={uploading}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 2,
    borderRadius: 15,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default AddProducts;
