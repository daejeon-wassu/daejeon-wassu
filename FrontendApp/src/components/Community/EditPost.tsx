import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {getPostDetail, updatePost} from '../../api/community';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RootStackParamList} from '../../router/Navigator';
import type {StackNavigationProp} from '@react-navigation/stack';

const {width} = Dimensions.get('window');

type EditPostScreenProp = StackNavigationProp<RootStackParamList, 'EditPost'>;

const EditPost = () => {
  const navigation = useNavigation<EditPostScreenProp>();
  const route = useRoute();
  const {articleId, initialTitle, initialContent, initialtags, initialPlace} = route.params as {
    articleId: string;
    initialTitle: string;
    initialContent: string;
    initialtags: any[]; // initialtags는 배열로 가정
    initialPlace: string;
  };

  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialtags && initialtags.length > 0 ? initialtags[0].tag : '카테고리 선택',
  ); // 초기값 설정
  const [selectedLocation, setSelectedLocation] = useState<string>(initialPlace || '');
  const [title, setTitle] = useState<string>(initialTitle || ''); // 제목 기본값 설정
  const [content, setContent] = useState<string>(initialContent || ''); // 내용 기본값 설정
  const [images, setImages] = useState<any[]>([]);

  const categories: string[] = ['맛집', '숙소', '우천', '스포츠', '예술', '빵', '역사', '과학'];

  useEffect(() => {
    const fetchPostDetail = async () => {
      const postDetail = await getPostDetail(articleId);

      if (postDetail && postDetail.status) {
        setImages(postDetail.status.images || []);
      }
    };

    fetchPostDetail();
  }, [articleId]);

  const toggleCategoryModal = () => setCategoryModalVisible(!isCategoryModalVisible);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCategoryModalVisible(false);
  };

  const handleImagePick = async () => {
    if (images.length >= 3) {
      Alert.alert('이미지 추가 불가', '최대 3장까지 이미지를 추가할 수 있습니다.');
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    });

    if (result && result.assets && result.assets.length > 0) {
      setImages(prevImages => [
        ...prevImages,
        ...result.assets!.slice(0, 3 - prevImages.length).map(asset => ({
          url: asset.uri!,
          type: asset.type ?? 'image/jpeg',
          fileName: asset.fileName ?? `image_${prevImages.length}.jpg`,
        })),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // 수정 버튼 핸들러
  const handleUpdate = async () => {
    if (!title || !content || selectedCategory === '카테고리 선택') {
      Alert.alert('모든 필드를 입력해 주세요.');
      return;
    }

    // 게시글 데이터 DTO
    const articleDTO = {
      title,
      content,
      tags: [selectedCategory], // 태그는 배열로 전송
      place: selectedLocation,
    };

    // 새로 추가된 이미지와 기존 이미지를 처리
    const files = images.map((image, index) => {
      if (image.url) {
        // 기존 이미지 (URL 형식은 그대로 반환)
        return {uri: image.url, type: 'image/jpeg', fileName: `image_${index}.jpg`};
      } else {
        // 새로 추가된 이미지
        return {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          fileName: image.fileName || `image_${index}.jpg`,
        };
      }
    });

    try {
      await updatePost(articleId, articleDTO, files); // DTO와 파일 배열을 넘겨줍니다.
      navigation.navigate('PostDetail', {articleId});
    } catch (error) {
      console.error('게시글 수정 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>게시글 수정</Text>
        <TouchableOpacity onPress={handleUpdate} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>수정</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* Category Selection */}
      <TouchableOpacity style={styles.selectionContainer} onPress={toggleCategoryModal}>
        <Text style={styles.selectionText}>
          {selectedCategory !== '카테고리 선택' ? selectedCategory : '카테고리 선택'}
        </Text>
        <Image source={require('../../assets/imgs/chevron-right.png')} style={styles.chevronIcon} />
      </TouchableOpacity>
      <View style={styles.divider} />

      {/* Location Input */}
      <TextInput
        style={styles.locationInput}
        placeholder="여행지를 입력해주세요"
        value={selectedLocation}
        onChangeText={setSelectedLocation}
      />
      <View style={styles.divider} />

      {/* Image Upload */}
      <View style={styles.imageUploadContainer}>
        <ScrollView horizontal>
          {images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => handleRemoveImage(index)}>
              <Image source={{uri: image.url}} style={styles.uploadedImage} />
            </TouchableOpacity>
          ))}
          {images.length < 3 && (
            <TouchableOpacity onPress={handleImagePick} style={styles.addImageContainer}>
              <Image source={require('../../assets/imgs/image.png')} style={styles.imageIcon} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Title Input */}
      <TextInput
        style={styles.titleInput}
        placeholder="제목을 작성해주세요"
        value={title}
        onChangeText={setTitle}
      />

      {/* Content Input */}
      <TextInput
        style={styles.contentInput}
        placeholder="내용을 작성해주세요"
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* Category Modal */}
      <Modal visible={isCategoryModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategorySelect(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={toggleCategoryModal}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
  },
  registerButton: {
    position: 'absolute',
    right: 10,
  },
  registerButtonText: {
    fontSize: 16,
    color: '#418663',
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: width * 0.06,
  },
  selectionText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
  },
  chevronIcon: {
    width: 24,
    height: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  imageUploadContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: width * 0.06,
  },
  imageIcon: {
    width: 80,
    height: 80,
  },
  titleInput: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#999999',
    paddingVertical: 20,
    paddingHorizontal: width * 0.06,
  },
  locationInput: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#333333',
    paddingVertical: 15,
    paddingHorizontal: width * 0.06,
  },
  contentInput: {
    fontSize: 16,
    color: '999999',
    paddingVertical: 10,
    height: 100,
    textAlignVertical: 'top',
    paddingHorizontal: width * 0.06,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 15,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    textAlign: 'center',
    color: '#418663',
    marginTop: 10,
    fontSize: 16,
  },
  addImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default EditPost;
