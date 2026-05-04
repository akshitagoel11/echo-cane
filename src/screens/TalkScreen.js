import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BaseScreen from '../components/BaseScreen';
import ConversationManager from '../services/ConversationManager';

const TalkScreen = ({ navigation }) => {
  const [isListening, setIsListening] = React.useState(false);

  const toggleListening = async () => {
    if (isListening) {
      await ConversationManager.stopAndProcess();
      setIsListening(false);
    } else {
      await ConversationManager.startListening();
      setIsListening(true);
    }
  };

  return (
    <BaseScreen title="TALK" navigation={navigation} color="#00C853" icon="chatbubble-ellipses">
      <Text style={styles.text}>{isListening ? 'Listening...' : 'Ready to Talk'}</Text>
      
      <TouchableOpacity 
        style={[styles.micButton, isListening && styles.micActive]} 
        onPress={toggleListening}
      >
        <Ionicons name={isListening ? "stop-circle" : "mic"} size={50} color="white" />
      </TouchableOpacity>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 30,
  },
  micButton: {
    backgroundColor: '#00C853',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  micActive: {
    backgroundColor: '#D50000',
    transform: [{ scale: 1.1 }],
  }
});

export default TalkScreen;
