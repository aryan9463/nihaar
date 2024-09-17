import React, { useState } from 'react';
import { 
  Alert, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Modal 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext'; 
import { useDispatch, useSelector } from 'react-redux';
import { setPin } from '../redux/slices/PinSlice';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const pin = useSelector(state => state.pin).pin;
  const { signOut } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params || {};
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isChangePinModalVisible, setChangePinModalVisible] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');

  const confirmSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', onPress: signOut },
    ]);
  };

  const validatePassword = () => {
    if (password === pin) {
      setPassword(null);
      setModalVisible(false);
      navigation.navigate('ProductsData');
    } else {
      Alert.alert('Incorrect Password', 'Please try again.');
    }
  };

  const handleChangePin = () => {
    if (oldPin === pin) {
      if (newPin.length === 4) {
        dispatch(setPin(newPin));
        setOldPin('');
        setNewPin('');
        setChangePinModalVisible(false);
        Alert.alert('Success', 'PIN has been updated successfully');
      } else {
        Alert.alert('Invalid PIN', 'PIN should be 4 digits');
      }
    } else {
      Alert.alert('Incorrect Old PIN', 'Please enter the correct current PIN');
    }
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#80deea']} style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      <Text style={{ color: 'black', marginTop: 20, fontSize: 24, fontWeight: 'bold' }}>Welcome, {user.name}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('INVOICE')}
        style={{ marginTop: 20, backgroundColor: '#00796b', borderRadius: 10, width: '80%', padding: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 2 }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Start New Invoice</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, width: '100%' }}>
        <TouchableOpacity
          style={{ backgroundColor: 'white', borderRadius: 10, height: 100, width: '45%', justifyContent: 'center', alignItems: 'center', margin: 5, borderWidth: 1, borderColor: '#ccc', elevation: 2 }}
          onPress={() => navigation.navigate('AddItems')}>
          <Text style={{ color: '#00796b', fontSize: 16 }}>Register Items</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{ backgroundColor: 'white', borderRadius: 10, height: 100, width: '45%', justifyContent: 'center', alignItems: 'center', margin: 5, borderWidth: 1, borderColor: '#ccc', elevation: 2 }}
          onPress={() => navigation.navigate('RegisterSupplier')}>
          <Text style={{ color: '#00796b', fontSize: 16 }}>Register Supplier</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{ backgroundColor: 'white', borderRadius: 10, height: 100, width: '90%', justifyContent: 'center', alignItems: 'center', margin: 5, borderWidth: 1, borderColor: '#ccc', elevation: 2 }}
        onPress={() => setModalVisible(true)}>
        <Text style={{ color: '#00796b', fontSize: 16 }}>Available Items</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, width: '100%' }}>
        <TouchableOpacity
          style={{ backgroundColor: '#B0BEC5', borderRadius: 10, height: 50, width: '45%', justifyContent: 'center', alignItems: 'center', margin: 5 }}
          onPress={confirmSignOut}>
          <Text style={{ color: 'white', fontSize: 16 }}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#FFB74D', borderRadius: 10, height: 50, width: '45%', justifyContent: 'center', alignItems: 'center', margin: 5 }}
          onPress={() => setChangePinModalVisible(true)}>
          <Text style={{ color: 'white', fontSize: 16 }}>Change PIN</Text>
        </TouchableOpacity>
      </View>

      {/* Statement Button */}
      <TouchableOpacity
        style={{ backgroundColor: '#00796b', borderRadius: 10, height: 50, width: '90%', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}
        onPress={() => navigation.navigate('DownloadReport')}>
        <Text style={{ color: 'white', fontSize: 16 }}>Statement</Text>
      </TouchableOpacity>

      {/* Modal for password prompt */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ color: '#333', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Enter Password</Text>
            <TextInput
              value={password}
              keyboardType="numeric"
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={true}
              style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20, padding: 10, textAlign: 'center', color: '#333' }}
            />
            <TouchableOpacity
              style={{ backgroundColor: '#00796b', padding: 10, borderRadius: 5, marginBottom: 10 }}
              onPress={validatePassword}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
              onPress={() => {
                setModalVisible(false);
                setPassword(null);
              }}>
              <Text style={{ color: '#333', textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for changing PIN */}
      <Modal
        transparent={true}
        visible={isChangePinModalVisible}
        animationType="slide"
        onRequestClose={() => setChangePinModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ color: '#333', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Change PIN</Text>
            <TextInput
              value={oldPin}
              keyboardType="numeric"
              onChangeText={setOldPin}
              placeholder="Enter old PIN"
              secureTextEntry={true}
              style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20, padding: 10, textAlign: 'center', color: '#333' }}
            />
            <TextInput
              value={newPin}
              keyboardType="numeric"
              onChangeText={setNewPin}
              placeholder="Enter new PIN"
              secureTextEntry={true}
              style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20, padding: 10, textAlign: 'center', color: '#333' }}
            />
            <TouchableOpacity
              style={{ backgroundColor: '#00796b', padding: 10, borderRadius: 5, marginBottom: 10 }}
              onPress={handleChangePin}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
              onPress={() => {
                setChangePinModalVisible(false);
                setOldPin('');
                setNewPin('');
              }}>
              <Text style={{ color: '#333', textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default HomeScreen;
