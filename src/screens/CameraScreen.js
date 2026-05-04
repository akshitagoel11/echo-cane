import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from '../components/ActionButton';
import SceneDescriptionManager from '../services/SceneDescriptionManager';
import AlertEngine from '../services/AlertEngine';
import DetectionService from '../services/DetectionService';

const CameraScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  // Real-time obstacle detection
  useFocusEffect(
    useCallback(() => {
      DetectionService.startDetection();
      return () => {
        DetectionService.stopDetection();
      };
    }, [])
  );

  const captureAndDescribe = async () => {
    if (cameraRef.current && !isProcessing) {
      setIsProcessing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });
        // Pass base64 directly — avoids FileSystem.EncodingType.Base64 TypeError
        await SceneDescriptionManager.describeScene(photo.uri, photo.base64);
      } catch (error) {
        console.error(error);
        AlertEngine.speak('तस्वीर लेने में त्रुटि', 'WARNING');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Full Screen Camera Preview */}
      <CameraView style={styles.camera} facing="back" ref={cameraRef} />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        {/* Top Info Area (Optional) */}
        <View style={styles.topSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ECHOVISION LIVE</Text>
          </View>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} pointerEvents="none" />

        {/* Bottom Action Grid */}
        <View style={styles.bottomSection}>
          <View style={styles.buttonRow}>
            <ActionButton 
              title="Scene" 
              color="#2196F3" 
              icon={<Ionicons name="eye" size={32} color="white" />}
              onPress={captureAndDescribe}
            />
            <ActionButton 
              title="Talk" 
              color="#00C853" 
              icon={<Ionicons name="chatbubble-ellipses" size={32} color="white" />}
              onPress={() => navigation.navigate('Talk')}
            />
          </View>
          <View style={styles.buttonRow}>
            <ActionButton 
              title="Nav" 
              color="#6200EE" 
              icon={<Ionicons name="navigate" size={32} color="white" />}
              onPress={() => navigation.navigate('Navigation')}
            />
            <ActionButton 
              title="SOS" 
              color="#D50000" 
              icon={<Ionicons name="alert-circle" size={32} color="white" />}
              onPress={() => navigation.navigate('Sos')}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topSection: {
    padding: 20,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  badgeText: {
    color: '#8A2BE2',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  bottomSection: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontSize: 18,
  },
  permissionButton: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  permissionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CameraScreen;
