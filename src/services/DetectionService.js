import { NativeModules, NativeEventEmitter } from 'react-native';
import AlertEngine from './AlertEngine';

const { TFLiteModule } = NativeModules;

class DetectionService {
  constructor() {
    this.isDetecting = false;
    this.eventEmitter = TFLiteModule ? new NativeEventEmitter(TFLiteModule) : null;
  }

  startDetection() {
    if (this.isDetecting) return;
    
    if (TFLiteModule) {
      TFLiteModule.startInference();
      this.isDetecting = true;
      
      // Listen for results
      this.subscription = this.eventEmitter.addListener('onObjectsDetected', (event) => {
        const { objects } = event;
        AlertEngine.processDetections(objects);
      });
    } else {
      console.warn('TFLiteModule not found. Native bridge might not be linked.');
    }
  }

  stopDetection() {
    if (TFLiteModule) {
      TFLiteModule.stopInference();
      this.isDetecting = false;
      if (this.subscription) {
        this.subscription.remove();
      }
    }
  }
}

export default new DetectionService();
