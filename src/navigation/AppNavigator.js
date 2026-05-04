import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import CameraScreen from '../screens/CameraScreen';
import SceneScreen from '../screens/SceneScreen';
import TalkScreen from '../screens/TalkScreen';
import NavigationScreen from '../screens/NavigationScreen';
import SosScreen from '../screens/SosScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Camera"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
        }}
      >
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Scene" component={SceneScreen} />
        <Stack.Screen name="Talk" component={TalkScreen} />
        <Stack.Screen name="Navigation" component={NavigationScreen} />
        <Stack.Screen name="Sos" component={SosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
