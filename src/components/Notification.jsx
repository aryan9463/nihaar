import { View, Text, Image, TouchableOpacity, Modal, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import firestore from '@react-native-firebase/firestore';

const Notification = () => {
  const [lowStockItems, setLowStockItems] = useState([]); // State to store low stock items
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  // Fetch product data from Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('datacolnew') // Assuming your collection is named 'products'
      .onSnapshot(querySnapshot => {
        let lowStock = [];

        querySnapshot.forEach(doc => {
          const productData = doc.data();
          if (productData.quantity <= 3) {
            lowStock.push({ id: doc.id, ...productData }); // Store product details
          }
        });

        setLowStockItems(lowStock); // Update state with low stock items
      });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to handle bell icon click
  const handleBellClick = () => {
    setModalVisible(true); // Show modal when bell is clicked
  };

  return (
    <View style={tw`relative`}>
      <TouchableOpacity onPress={handleBellClick}>
        <Image
          resizeMode="center"
          style={tw`w-10 h-10 mr-2`}
          source={require('../images/bell_icon.png')}
        />
        {/* Only show notification badge if there are low stock items */}
        {lowStockItems.length > 0 && (
          <View
            style={tw`absolute bg-red-500 rounded-full w-5 h-5 flex items-center justify-center top-0 right-0`}>
            <Text style={tw`text-white text-xs`}>{lowStockItems.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal to show low stock details or "No new notifications" */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-8 rounded-lg w-80`}>
            <Text style={tw`text-lg font-bold mb-4 text-black`}>
              {lowStockItems.length > 0 ? 'Low Stock Notifications' : 'No New Notifications'}
            </Text>
            
            {lowStockItems.length > 0 ? (
              <FlatList
                data={lowStockItems}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={tw`mb-4`}>
                    <Text style={tw`text-black`}>Product: {item.name}</Text>
                    <Text style={tw`text-red-500`}>Quantity: {item.quantity}</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={tw`text-black`}>No new notifications</Text>
            )}

            <TouchableOpacity
              style={tw`bg-blue-500 py-2 mt-4 rounded-lg shadow-md`}
              onPress={() => setModalVisible(false)}>
              <Text style={tw`text-white text-center text-lg`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Notification;
