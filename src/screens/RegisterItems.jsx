import React, { useEffect, useState } from 'react';
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
import firebase from "@react-native-firebase/app";
import storage from "@react-native-firebase/storage";
import { 
  addDoc, 
  collection, 
  getFirestore, 
  serverTimestamp, 
  getDocs 
} from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';

// Initialize Firestore
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
const datacollection = collection(db, 'datacolnew');
const suppliersCollection = collection(db, 'suppliers');

const RegisterItems = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUris, setImageUris] = useState([]); // Array for multiple images
  const [commission, setCommission] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [uploading, setUploading] = useState(false);
  const [suppliers, setSuppliers] = useState([]); // Array to hold supplier data
  const [selectedSupplier, setSelectedSupplier] = useState(''); // Selected supplier ID

  // Fetch suppliers from Firestore
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const snapshot = await getDocs(suppliersCollection);
        const suppliersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error fetching suppliers: ', error);
      }
    };

    fetchSuppliers();
  }, []);

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

  const captureImage = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      width: 800,
      height: 800,
    }).then(image => {
      setImageUris(prev => [...prev, image.path]); // Add captured image to the array
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
      return imageUrls; // Return array of image URLs
    } catch (error) {
      console.error('Error uploading images: ', error);
      Alert.alert('Error', 'There was a problem uploading the images.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSupplierChange = (supplierId) => {
    const selected = suppliers.find(supplier => supplier.id === supplierId);
    if (selected) {
      setCommission(selected.commission.toString()); // Update commission with the selected supplier's commission
    }
    setSelectedSupplier(supplierId); // Set the selected supplier ID
  };

  const handleSubmit = async () => {
    if (!name || !description || !price || !commission || !quantity) {
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
          commission: parseFloat(commission),
          quantity: parseInt(quantity, 10),
          imageUrl: imageUrls, // Save array of image URLs
          createdAt: serverTimestamp(),
        });
        Alert.alert('Success', 'Form submitted successfully!');
        setName('');
        setDescription('');
        setPrice('');
        setCommission('');
        setQuantity('');
        setImageUris([]); // Clear the image array
        setSelectedSupplier(''); // Clear selected supplier
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
        <Text style={styles.label}>Commission:</Text>
        <TextInput
          value={commission}
          onChangeText={setCommission}
          keyboardType="numeric"
          placeholder="Enter commission"
          placeholderTextColor="#888"
          style={styles.input}
        />
        <Text style={styles.label}>Number of Items:</Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Enter number of items"
          placeholderTextColor="#888"
          style={styles.input}
        />
        <Text style={styles.label}>Select Supplier:</Text>
        <Picker
          selectedValue={selectedSupplier}
          onValueChange={handleSupplierChange}
          style={styles.picker}>
          <Picker.Item label="Select a supplier" value="" />
          {suppliers.map((supplier) => (
            <Picker.Item key={supplier.id} label={supplier.name} value={supplier.id} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.button} onPress={pickImages}>
          <Text style={styles.buttonText}>Pick Images from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={captureImage}>
          <Text style={styles.buttonText}>Capture Image with Camera</Text>
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
    padding: 20,
  },
  scrollContainer: {
    paddingVertical: 20,
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
    borderRadius: 10,
    marginBottom: 10, // Spacing between buttons
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});

export default RegisterItems;
