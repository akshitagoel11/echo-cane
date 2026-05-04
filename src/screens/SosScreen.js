import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import BaseScreen from '../components/BaseScreen';

import SosManager from '../services/SosManager';

const SosScreen = ({ navigation }) => {
  const handleSos = async () => {
    await SosManager.triggerSos();
  };

  return (
    <BaseScreen title="SOS" navigation={navigation} color="#D50000" icon="alert-circle">
      <Text style={styles.text}>EMERGENCY MODE</Text>
      <TouchableOpacity style={styles.emergencyButton} onPress={handleSos}>
        <Text style={styles.buttonText}>TRIGGER SOS</Text>
      </TouchableOpacity>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  emergencyButton: {
    backgroundColor: '#D50000',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default SosScreen;
