import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

const EMERGENCY_NUMBER = '+91 9528441723';

class SosManager {
  async triggerSos() {
    try {
      // 1. Vibrate continuously (simulated with multiple bursts)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      // 2. Speak SOS message
      Speech.speak('आपातकाल! मदद बुला रहे हैं', { language: 'hi-IN' });

      // 3. Get Location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Speech.speak('स्थान अनुमति नहीं मिली', { language: 'hi-IN' });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

      // 4. Prepare SMS
      const smsMessage = `EchoVision SOS: I need help. Location: ${mapsUrl}`;
      const smsUrl = `sms:${EMERGENCY_NUMBER}?body=${encodeURIComponent(smsMessage)}`;

      // 5. Open Call and SMS
      // Note: We can only open one at a time via Linking, 
      // but we'll try to initiate the call first.
      
      await Linking.openURL(`tel:${EMERGENCY_NUMBER}`);
      
      // SMS would usually be triggered after or separately
      // In a real app, you might use a native SMS library for background sending
      setTimeout(() => {
        Linking.openURL(smsUrl);
      }, 3000);

    } catch (error) {
      console.error('SOS Error:', error);
    }
  }
}

export default new SosManager();
