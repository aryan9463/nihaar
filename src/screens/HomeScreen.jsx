import React, { useState } from 'react';
import { 
  Alert, 
  Text, 
  TextInput, 
  Pressable, 
  View, 
  Modal, 
  StyleSheet 
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
      setPassword('');
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
    <LinearGradient colors={['#e0f7fa', '#80deea']} style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user.name}</Text>

      <Pressable
        onPress={() => navigation.navigate('INVOICE')}
        style={styles.fullWidthButton}>
        <Text style={styles.buttonText}>Start New Invoice</Text>
      </Pressable>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.fullWidthButton}
          onPress={() => navigation.navigate('AddItems')}>
          <Text style={styles.buttonText}>Register Items</Text>
        </Pressable>

        <Pressable
          style={styles.fullWidthButton}
          onPress={() => navigation.navigate('RegisterSupplier')}>
          <Text style={styles.buttonText}>Register Supplier</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.fullWidthButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Available Items</Text>
      </Pressable>

      <View style={styles.actionContainer}>
        <Pressable
          style={styles.outlineButton}
          onPress={confirmSignOut}>
          <Text style={styles.outlineButtonText}>Sign Out</Text>
        </Pressable>

        <Pressable
          style={styles.outlineButton}
          onPress={() => setChangePinModalVisible(true)}>
          <Text style={styles.outlineButtonText}>Change PIN</Text>
        </Pressable>
      </View>

      {/* Statement Button */}
      <Pressable
        style={styles.fullWidthButton}
        onPress={() => navigation.navigate('Statement')}>
        <Text style={styles.buttonText}>Statement</Text>
      </Pressable>

      {/* Modal for password prompt */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password</Text>
            <TextInput
              value={password}
              keyboardType="numeric"
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={true}
              style={styles.modalInput}
            />
            <Pressable
              style={styles.modalButton}
              onPress={validatePassword}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setPassword('');
              }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal for changing PIN */}
      <Modal
        transparent={true}
        visible={isChangePinModalVisible}
        animationType="slide"
        onRequestClose={() => setChangePinModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change PIN</Text>
            <TextInput
              value={oldPin}
              keyboardType="numeric"
              onChangeText={setOldPin}
              placeholder="Enter old PIN"
              secureTextEntry={true}
              style={styles.modalInput}
            />
            <TextInput
              value={newPin}
              keyboardType="numeric"
              onChangeText={setNewPin}
              placeholder="Enter new PIN"
              secureTextEntry={true}
              style={styles.modalInput}
            />
            <Pressable
              style={styles.modalButton}
              onPress={handleChangePin}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setChangePinModalVisible(false);
                setOldPin('');
                setNewPin('');
              }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  welcomeText: {
    color: '#00796b',
    marginTop: 20,
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 30,
  },
  fullWidthButton: {
    backgroundColor: '#00796b',
    borderRadius: 30,
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  outlineButton: {
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    height: 50,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  outlineButtonText: {
    color: 'black',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    textAlign: 'center',
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#00796b',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;
