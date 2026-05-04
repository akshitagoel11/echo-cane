import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

class AlertEngine {
  constructor() {
    this.lastAlertTime = 0;
    this.cooldown = 800; // 800ms cooldown as requested
    this.isSpeaking = false;
    this.labels = {
      'person': 'व्यक्ति',
      'car': 'गाड़ी',
      'pothole': 'गड्ढा',
      'obstacle': 'बाधा',
      'chair': 'कुर्सी',
      'table': 'मेज़',
      'door': 'दरवाज़ा',
      'stair': 'सीढ़ी'
    };
  }

  async speak(text, priority = 'INFO') {
    const now = Date.now();
    
    // Check cooldown
    if (now - this.lastAlertTime < this.cooldown) {
      return;
    }

    this.lastAlertTime = now;

    // Vibration based on priority
    if (priority === 'CRITICAL') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (priority === 'WARNING') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    // Speak in Hindi
    Speech.speak(text, {
      language: 'hi-IN',
      pitch: 1.0,
      rate: 0.9,
      onStart: () => { this.isSpeaking = true; },
      onDone: () => { this.isSpeaking = false; },
      onError: () => { this.isSpeaking = false; },
    });
  }

  processDetections(objects) {
    if (!objects || objects.length === 0) return;

    // Filter for danger zone (bottom 40% of screen)
    const dangerZoneThreshold = 0.6; 
    
    const dangerousObjects = objects.filter(obj => {
      const bottomY = obj.y + (obj.height || 0.1);
      return bottomY > dangerZoneThreshold;
    });

    if (dangerousObjects.length > 0) {
      const closest = dangerousObjects.reduce((prev, current) => {
        const prevBottom = prev.y + (prev.height || 0.1);
        const currBottom = current.y + (current.height || 0.1);
        return (prevBottom > currBottom) ? prev : current;
      });

      // Determine direction
      const centerX = closest.x + (closest.width || 0) / 2;
      let direction = 'सामने';
      if (centerX < 0.35) direction = 'बायें';
      if (centerX > 0.65) direction = 'दायें';

      // Translate label
      const labelHindi = this.labels[closest.label] || 'बाधा';

      this.speak(`${direction} ${labelHindi} है`, 'CRITICAL');
    }
  }
}

export default new AlertEngine();
