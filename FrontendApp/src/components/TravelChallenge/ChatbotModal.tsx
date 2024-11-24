import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'; // Import
import {getChatbotResponse} from '../../api/recommended';

const {width, height} = Dimensions.get('window');

interface ChatMessage {
  sender: 'user' | 'chatbot';
  text: string;
}

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({visible, onClose}) => {
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleSend = async () => {
    if (userInput.trim() === '') return;
    setChatMessages([...chatMessages, {sender: 'user', text: userInput}]);
    const response = await getChatbotResponse(userInput);
    setChatMessages(prevMessages => [
      ...prevMessages,
      {sender: 'chatbot', text: response || '죄송합니다. 응답을 받을 수 없습니다.'},
    ]);
    setUserInput('');
  };

  const handleModalClose = () => {
    setUserInput('');
    setChatMessages([]);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAwareScrollView
            style={styles.modalContainer}
            contentContainerStyle={{flexGrow: 1}}
            extraScrollHeight={0} // 키보드 위에 추가 여백
            enableOnAndroid // Android에서도 스크롤 동작 활성화
          >
            <View style={styles.header}>
              <Text style={styles.title}>왔슈봇</Text>
              <TouchableOpacity onPress={handleModalClose}>
                <Image source={require('../../assets/imgs/x.png')} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.chatWrapper}>
              {chatMessages.length === 0 ? (
                <Text style={styles.noChatText}>대화 내용은 실제 니니즈 세계관과 무관합니다.</Text>
              ) : (
                chatMessages.map((message, index) => (
                  <View
                    key={index}
                    style={[
                      styles.messageContainer,
                      message.sender === 'user' ? styles.userMessage : styles.chatbotMessage,
                    ]}>
                    {message.sender === 'chatbot' && (
                      <Image
                        source={require('../../assets/imgs/chatbot.png')}
                        style={styles.chatbotImage}
                      />
                    )}
                    <View style={styles.messageContent}>
                      {message.sender === 'chatbot' && (
                        <Text style={styles.chatbotName}>왔슈봇</Text>
                      )}
                      <Text style={styles.messageText}>{message.text}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={userInput}
                onChangeText={setUserInput}
                placeholder="메시지를 입력해주세요"
              />
              <TouchableOpacity onPress={handleSend}>
                <Image source={require('../../assets/imgs/input.png')} style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    marginVertical: 100,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 15,
  },
  modalContainer: {
    width: width * 0.95,
    height: height * 0.8,
    backgroundColor: '#FFF',
    borderRadius: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    left: width * 0.4,
    fontSize: 18,
    color: '#333',
    fontFamily: 'Pretendard-SemiBold',
    margin: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
    right: 10,
  },
  chatWrapper: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#C8DECB',
    paddingTop: 10,
  },
  noChatText: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  chatbotMessage: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 10,
    maxWidth: '80%',
    alignItems: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#418663',
    borderRadius: 15,
    padding: 10,
    maxWidth: '80%',
  },
  chatbotImage: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  messageContent: {
    flexShrink: 1,
    maxWidth: '85%',
  },
  chatbotName: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    padding: 10,
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendIcon: {
    width: 30,
    height: 30,
  },
});

export default ChatbotModal;
