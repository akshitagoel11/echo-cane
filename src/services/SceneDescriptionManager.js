import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import AlertEngine from './AlertEngine';

// Replace with your actual API endpoint and key
const VISION_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';
const API_KEY = 'YOUR_GEMINI_API_KEY';

class SceneDescriptionManager {
  async describeScene(imageUri, base64Data = null) {
    try {
      AlertEngine.speak('दृश्य का विश्लेषण कर रहे हैं', 'INFO'); // "Analyzing scene"

      let base64 = base64Data;
      
      if (!base64) {
        // Read image as base64 only if not provided
        base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // Prepare payload for Gemini Vision
      const payload = {
        contents: [
          {
            parts: [
              { text: "Describe this scene in simple Hindi for a blind person in 2 sentences focusing on safety." },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64
                }
              }
            ]
          }
        ]
      };

      const response = await fetch(`${VISION_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const description = data.candidates[0].content.parts[0].text;

      AlertEngine.speak(description, 'INFO');
      return description;

    } catch (error) {
      console.error('Vision API Error:', error);
      AlertEngine.speak('क्षमा करें, मैं दृश्य का वर्णन नहीं कर सका।', 'WARNING'); // "Sorry, I couldn't describe the scene"
      return null;
    }
  }
}

export default new SceneDescriptionManager();
