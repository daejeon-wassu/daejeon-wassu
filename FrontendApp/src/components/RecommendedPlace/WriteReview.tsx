import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {useNavigation} from '@react-navigation/native';
import {ImagePickerResponse, launchImageLibrary} from 'react-native-image-picker';
import {createReview} from '../../api/tourist'; // createReview 함수 import
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
type WriteReviewScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type WriteReviewRouteProp = {
  spotId: string;
};

const {width} = Dimensions.get('window');

const WriteReview = () => {
  const navigation = useNavigation<WriteReviewScreenNavigationProp>();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // 이미지 파일 상태 추가
  const [charCountWarning, setCharCountWarning] = useState(false);
  const route = useRoute();
  const {spotId} = route.params as WriteReviewRouteProp;

  // 이미지 선택 함수
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('사용자가 취소했습니다.');
        } else if (response.errorMessage) {
          console.error('이미지 선택 오류: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          setImage(selectedImage.uri || null);
          if (selectedImage.uri && selectedImage.type && selectedImage.fileName) {
            // File 객체 생성
            const file = {
              uri: selectedImage.uri,
              type: selectedImage.type,
              name: selectedImage.fileName,
            } as unknown as File;
            setImageFile(file);
          }
        }
      },
    );
  };

  // 텍스트 변경 감지 및 경고
  const handleTextChange = (text: string) => {
    if (text.length > 200) {
      setCharCountWarning(true);
    } else {
      setCharCountWarning(false);
    }
    setContent(text.slice(0, 200)); // 200자 제한
  };

  const handleRegister = async () => {
    if (!content.trim()) {
      Alert.alert('알림', '내용을 입력해 주세요.');
      return;
    }
    const review = {
      content,
    };
    try {
      // 이미지 파일이 없을 경우 빈 배열 전달
      const image = imageFile ? [imageFile] : [];

      // 리뷰 등록 API 호출
      const success = await createReview(spotId, review, image);
      if (success) {
        navigation.goBack();
      } else {
        console.log('리뷰등록실패');
      }
    } catch (error) {
      console.error('리뷰 등록 오류:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
        <Text style={styles.registerButtonText}>등록</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{uri: image}} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>이미지 추가</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>내용</Text>
        <TextInput
          style={styles.input}
          placeholder="내용"
          value={content}
          onChangeText={handleTextChange}
          multiline
        />
        {charCountWarning && <Text style={styles.warningText}>200자를 초과할 수 없습니다.</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  registerButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  registerButtonText: {
    color: '#418663',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Bold',
  },
  imageContainer: {
    width: width * 0.5,
    height: width * 0.5,
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imagePlaceholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
    paddingVertical: 5,
    color: '#333',
  },
  warningText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default WriteReview;
