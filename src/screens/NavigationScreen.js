import React from 'react';
import { Text, StyleSheet } from 'react-native';
import BaseScreen from '../components/BaseScreen';

const NavigationScreen = ({ navigation }) => {
  return (
    <BaseScreen title="NAV" navigation={navigation} color="#6200EE" icon="navigate">
      <Text style={styles.text}>Where would you like to go?</Text>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '300',
  }
});

export default NavigationScreen;
