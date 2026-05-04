import React from 'react';
import { Text, StyleSheet } from 'react-native';
import BaseScreen from '../components/BaseScreen';

const SceneScreen = ({ navigation }) => {
  return (
    <BaseScreen title="SCENE" navigation={navigation} color="#2196F3" icon="eye">
      <Text style={styles.text}>Analyzing your surroundings...</Text>
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

export default SceneScreen;
