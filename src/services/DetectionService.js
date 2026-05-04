import { NativeModules, NativeEventEmitter } from 'react-native';
import AlertEngine from './AlertEngine';

const { TFLiteModule } = NativeModules;

class DetectionService {
  constructor() {
    this.isDetecting = false;
    this.eventEmitter = TFLiteModule ? new NativeEventEmitter(TFLiteModule) : null;
  }

  startDetection(cameraRef) {
    if (this.isDetecting) return;
    
    if (TFLiteModule) {
      TFLiteModule.startInference();
      this.isDetecting = true;
      this.cameraRef = cameraRef;
      
      // Listen for results
      this.subscription = this.eventEmitter.addListener('onObjectsDetected', (event) => {
        const { objects } = event;
        if (objects && objects.length > 0) {
          console.log(`[DetectionService] Objects detected: ${objects.map(o => o.label).join(', ')}`);
          AlertEngine.processDetections(objects);
        }
      });

      // Start capture loop
      this.captureLoop();
    } else {
      console.warn('TFLiteModule not found. Native bridge might not be linked.');
    }
  }

  async captureLoop() {
    if (!this.isDetecting || !this.cameraRef) return;

    try {
      const photo = await this.cameraRef.current.takePictureAsync({
        quality: 0.3, // Low quality for speed
        base64: false,
        skipProcessing: true,
      });

      if (TFLiteModule && this.isDetecting) {
        TFLiteModule.processFrame(photo.uri);
      }
    } catch (error) {
      console.error('Frame capture error:', error);
    }

    // Schedule next frame (approx 5 FPS)
    this.loopTimeout = setTimeout(() => this.captureLoop(), 200);
  }

  stopDetection() {
    this.isDetecting = false;
    if (this.loopTimeout) clearTimeout(this.loopTimeout);
    
    if (TFLiteModule) {
      TFLiteModule.stopInference();
      if (this.subscription) {
        this.subscription.remove();
      }
    }
  }
}

export default new DetectionService();
