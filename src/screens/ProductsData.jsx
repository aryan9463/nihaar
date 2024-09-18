import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import tw from 'twrnc';
import RNPrint from 'react-native-print'; // For printing functionality

const db = getFirestore();
export const datacollection = collection(db, 'datacolnew');

const ProductsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingValues, setEditingValues] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(datacollection);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    setEditingItemId(item.id);
    setEditingValues({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
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
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const incrementItem = () => {
    setEditingValues(prevValues => ({
      ...prevValues,
      quantity: (parseInt(prevValues.quantity) + 1).toString(),
    }));
  };

  const decrementItem = () => {
    setEditingValues(prevValues => ({
      ...prevValues,
      quantity: Math.max(1, parseInt(prevValues.quantity) - 1).toString(),
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
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${item.id}" alt="QR Code" />
          <p>₹${(item.price + item.commission).toFixed(2)}</p>
        </body>
      </html>
    `;

    try {
      await RNPrint.print({ html: htmlContent });
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
        renderItem={({ item }) => (
          <View style={tw`bg-white p-4 mb-5 rounded-lg shadow flex-row justify-between`}>
            <View>
              {editingItemId === item.id ? (
                <>
                  <TextInput
                    value={editingValues.name}
                    onChangeText={text => setEditingValues(prev => ({ ...prev, name: text }))}
                    style={tw`border-b mb-2 p-2 text-black`}
                  />
                  <TextInput
                    value={editingValues.description}
                    onChangeText={text => setEditingValues(prev => ({ ...prev, description: text }))}
                    style={tw`border-b mb-2 p-2 text-black`}
                  />
                  <TextInput
                    value={editingValues.price}
                    onChangeText={text => setEditingValues(prev => ({ ...prev, price: text }))}
                    keyboardType="numeric"
                    style={tw`border-b mb-2 p-2 text-black`}
                  />
                  <TextInput
                    value={editingValues.quantity}
                    onChangeText={text => setEditingValues(prev => ({ ...prev, quantity: text }))}
                    keyboardType="numeric"
                    style={tw`border-b mb-2 p-2 text-black`}
                  />
                  <View style={tw`flex-row items-center`}>
                    <TouchableOpacity onPress={decrementItem}>
                      <Text style={tw`text-2xl px-2`}>-</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-xl`}>{editingValues.quantity}</Text>
                    <TouchableOpacity onPress={incrementItem}>
                      <Text style={tw`text-2xl px-2`}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Button title="Save" onPress={() => saveChanges(item.id)} />
                </>
              ) : (
                <>
                  <Text style={tw`text-xl font-bold text-black`}>{item.name}</Text>
                  <Text style={tw`text-sm text-gray-500`}>{item.description}</Text>
                  <Text style={tw`text-lg text-green-600`}>₹{(item.price + item.commission).toFixed(2)}</Text>
                  <Text style={tw`text-yellow-600`}>Items: {item.quantity}</Text>
                  <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                    <Text style={tw`text-red-500`}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => startEditing(item)}>
                    <Text style={tw`text-blue-500`}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => generatePrintableTag(item)}>
                    <Text style={tw`text-purple-500`}>Print Tag</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View>
              {item.imageUrl && Array.isArray(item.imageUrl) && (
                <FlatList
                  data={item.imageUrl}
                  keyExtractor={(imageUri, index) => index.toString()}
                  horizontal
                  renderItem={({ item: imageUri }) => (
                    <Image
                      source={{ uri: imageUri }}
                      style={tw`w-36 h-36 rounded-lg mt-2`}
                    />
                  )}
                />
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ProductsData;
