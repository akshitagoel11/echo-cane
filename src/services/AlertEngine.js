import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

class AlertEngine {
  constructor() {
    this.lastAlertTime = 0;
    this.cooldown = 800; // 800ms cooldown as requested
    this.isSpeaking = false;
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
    // Assuming object coordinates are normalized 0-1
    const dangerZoneThreshold = 0.6; // Bottom 40% is > 0.6 in Y
    
    const dangerousObjects = objects.filter(obj => {
      // Check if any part of the object is in the danger zone
      return obj.y + obj.height > dangerZoneThreshold;
    });

    if (dangerousObjects.length > 0) {
      // Find the closest object (largest area or highest Y)
      const closest = dangerousObjects.reduce((prev, current) => {
        return (prev.y + prev.height > current.y + current.height) ? prev : current;
      });

      // Determine direction
      const centerX = closest.x + closest.width / 2;
      let direction = 'सामने'; // center
      if (centerX < 0.35) direction = 'बायें'; // left
      if (centerX > 0.65) direction = 'दायें'; // right

      this.speak(`${direction} बाधा है`, 'CRITICAL');
    }
  }
}

export default new AlertEngine();
