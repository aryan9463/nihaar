import QRCode from 'react-native-qrcode-svg';
import RNPrint from 'react-native-print';
import React, {useEffect, useRef, useState} from 'react';
import tw from 'twrnc';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import Carousel from 'react-native-snap-carousel';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  Button,
  BackHandler,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import CustomCarousel from '../components/Corousel';
const {width: screenWidth} = Dimensions.get('window');
const db = getFirestore();
export const datacollection = collection(db, 'datacolnew');
// const { width: screenWidth } = Dimensions.get('window');
const ProductsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingValues, setEditingValues] = useState({
    name: '',
    description: '',
    price: '',
    quantity: null,
  });
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Confirm Exit',
          'Are you sure you want to leave the Product details? Any unsaved changes will be lost.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Yes',
              onPress: () => navigation.goBack(), // Navigate back if the user confirms
            },
          ],
          {cancelable: true},
        );
        return true; // Prevent default back behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(datacollection);
        const items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setData(items);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const confirmDelete = id => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteItem(id),
          style: 'destructive',
        },
      ],
    );
  };

  const deleteItem = async id => {
    try {
      await deleteDoc(doc(db, 'datacolnew', id));
      setData(prevData => prevData.filter(item => item.id !== id));
      Alert.alert('Success', 'Item deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const startEditing = item => {
    console.log(item.quantity);

    setEditingItemId(item.id);
    setEditingValues({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      quantity: item.quantity,
    });
  };

  const saveChanges = async id => {
    try {
      const itemRef = doc(db, 'datacolnew', id);
      await updateDoc(itemRef, {
        name: editingValues.name,
        description: editingValues.description,
        price: parseFloat(editingValues.price),
        quantity: parseInt(editingValues.quantity, 10),
      });

      setData(prevData =>
        prevData.map(item =>
          item.id === id
            ? {
                ...item,
                ...editingValues,
                price: parseFloat(editingValues.price),
                quantity: parseInt(editingValues.quantity, 10),
              }
            : item,
        ),
      );

      Alert.alert('Success', 'Item updated successfully');
      setEditingItemId(null);
    } catch (err) {
      Alert.alert(err, 'Failed to save changes');
    }
  };

  const incrementItem = () => {
    setEditingValues(prevValues => ({
      ...prevValues,
      quantity: (parseInt(prevValues.quantity, 10) + 1).toString(),
    }));
  };

  const decrementItem = () => {
    setEditingValues(prevValues => ({
      ...prevValues,
      quantity: Math.max(1, parseInt(prevValues.quantity, 10) - 1).toString(),
    }));
  };

  const generatePrintableTag = async item => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              width: 150px; /* Width of the paper */
              height: 250px; /* Height of the paper */
              margin: 0; /* Remove default margins */
              padding: 10px; /* Add padding to the content */
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              font-family: Arial, sans-serif;
              text-align: center;
              border: 1px solid #ddd; /* Optional border for better visibility */
              border-radius: 10px; /* Rounded corners */
            }
            h1 {
              font-size: 18px;
              color: #333;
              margin-bottom: 8px;
            }
            img {
              width: 120px;
              height: 120px;
              margin-bottom: 8px;
            }
            p {
              font-size: 20px;
              color: green;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <h1>${item.name}</h1>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${
            item.id
          }" alt="QR Code" />
          <p>₹${(item.price + item.commission).toFixed(2)}</p>
        </body>
      </html>


    `;
    try {
      await RNPrint.print({html: htmlContent});
    } catch (error) {
      console.error('Error generating printable tag: ', error);
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator style={tw`mb-3`} size="large" color="gray" />
        <Text style={tw`text-lg text-gray-500`}>Loading Products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg text-red-500`}>{error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg text-gray-800`}>No Products Available</Text>
      </View>
    );
  }
  console.log(data);

  // const imageData = [
  //   {uri: 'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Image1'},
  //   {uri: 'https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Image2'},
  //   {uri: 'https://via.placeholder.com/400x300/0000FF/FFFFFF?text=Image3'},
  //   {uri: 'https://via.placeholder.com/400x300/FFFF00/FFFFFF?text=Image4'},
  //   {uri: 'https://via.placeholder.com/400x300/00FFFF/FFFFFF?text=Image5'},
  // ];

  // // Render individual carousel items
  // const renderItem = ({item}) => {
  //   return (
  //     <View style={styles.carouselItem}>
  //       <Image source={{uri: item.uri}} style={styles.image} />
  //     </View>
  //   );
  // };
  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <Text style={tw`text-2xl font-bold text-center mb-5 text-gray-800`}>
            Available Products
          </Text>
        )}
        renderItem={({item}) => (
          <View
            style={tw`bg-white p-4 mb-5  rounded-lg shadow flex-row justify-between`}>
            <View>
              {editingItemId === item.id ? (
                <>
                  <TextInput
                    value={editingValues.name}
                    onChangeText={text =>
                      setEditingValues(prev => ({...prev, name: text}))
                    }
                    style={tw`border-b mb-2 p-2 text-black`}
                  />
                  <TextInput
                    value={editingValues.description}
                    onChangeText={text =>
                      setEditingValues(prev => ({...prev, description: text}))
                    }
                    style={tw`border-b mb-2 p-2 text-black`}
                  />
                  <TextInput
                    value={editingValues.price}
                    onChangeText={text =>
                      setEditingValues(prev => ({...prev, price: text}))
                    }
                    keyboardType="numeric"
                    style={tw`border-b mb-2 p-2 text-black`}
                  />

                  <View style={tw`flex-row items-center`}>
                    <TouchableOpacity onPress={decrementItem}>
                      <Text style={tw`text-2xl text-black px-2`}>-</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-xl text-black`}>
                      {editingValues.quantity}
                    </Text>
                    <TouchableOpacity onPress={incrementItem}>
                      <Text style={tw`text-2xl text-black px-2`}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Button title="Save" onPress={() => saveChanges(item.id)} />
                </>
              ) : (
                <>
                  <Text style={tw`text-xl font-bold text-black`}>
                    {item.name}
                  </Text>
                  <Text style={tw`text-sm text-gray-500`}>
                    {item.description}
                  </Text>
                  <Text style={tw`text-lg text-green-600`}>
                    ₹{(item.price + item.commission).toFixed(2)}
                  </Text>
                  <Text style={tw`text-yellow-600`}>
                    Items: {item.quantity}
                  </Text>
                  <TouchableOpacity
                    style={tw`absolute bottom-0 z-1 left-0 opacity-50`}
                    onPress={() => confirmDelete(item.id)}>
                    <Image
                      style={tw`w-8 h-8`}
                      source={require('../images/bin.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`absolute bottom-0 z-1 left-10 opacity-50`}
                    onPress={() => startEditing(item)}>
                    <Image
                      style={tw`w-8 h-8`}
                      source={require('../images/pen.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`absolute bottom-0 z-1 left-20 `}
                    onPress={() => generatePrintableTag(item)}>
                    <Image
                      style={tw`w-7 h-7`}
                      source={require('../images/label.png')}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={tw``}>
              {item.imageUrl && item.imageUrl.length > 0 ? (
                <CustomCarousel images={item.imageUrl} />
              ) : (
                <Text>No Images Available</Text>
              )}
            </View>
            {/* <View style={styles.container}>
              <Carousel
                ref={carouselRef}
                data={imageData}
                sliderWidth={screenWidth}
                itemWidth={screenWidth * 0.8} // Set the width of each carousel item
                renderItem={renderItem}
                onSnapToItem={index => setActiveIndex(index)} // Update active index on snap
                layout="default" // Can use "default", "stack", or "tinder" layout
              />
              <Text style={styles.caption}>
                Image {activeIndex + 1} of {imageData.length}
              </Text>
            </View> */}
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 250,
  },
  caption: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
export default ProductsData; 