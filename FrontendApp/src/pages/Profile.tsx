import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';
import AccountDeletionModal from '../components/Profile/AccountDeletionModal';
import ProfileImagePickerModal from '../components/Profile/ProfileImagePickerModal';
import {deleteAccount, logout} from '../api/user';
import {getUserProfile, updateProfileImage} from '../api/mypage';
import {launchImageLibrary} from 'react-native-image-picker';

const {width} = Dimensions.get('window');

type ProfileNavigationProp = StackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isImagePickerModalVisible, setImagePickerModalVisible] = useState(false);

  const [profile, setProfile] = useState<{
    nickname: string;
    email: string;
    profileImage: string | null;
  }>({
    nickname: '',
    email: '',
    profileImage: null,
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        const userProfile = await getUserProfile();
        if (userProfile) {
          setProfile({
            nickname: userProfile.nickname,
            email: userProfile.email,
            profileImage: userProfile.profileImage,
          });
        }
      };
      fetchUserProfile();
    }, []),
  );

  const profileImageSource =
    !profile.profileImage || profile.profileImage === 'default'
      ? require('../assets/imgs/uiicon.png')
      : {uri: profile.profileImage};

  const goToChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const goToChangeInfo = () => {
    navigation.navigate('ChangeInfo', {nickname: profile.nickname});
  };

  const openDeleteModal = () => setDeleteModalVisible(true);
  const closeDeleteModal = () => setDeleteModalVisible(false);

  const handleConfirmDelete = async () => {
    const success = await deleteAccount();
    if (success) {
      Alert.alert('계정 삭제 완료', '계정이 성공적으로 삭제되었습니다.');
      navigation.navigate('Login');
    } else {
      console.log('삭제 실패');
    }
    closeDeleteModal();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Main');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const openImagePickerModal = () => setImagePickerModalVisible(true);
  const closeImagePickerModal = () => setImagePickerModalVisible(false);

  const handleResetImage = async () => {
    const defaultImage = {
      uri: 'asset:/imgs/uiicon.png', // Android에서 로컬 asset 접근 시 기본 경로
      type: 'image/png',
      name: 'profile_image.png',
    };

    const file = {
      uri: defaultImage.uri,
      type: 'image/png',
      name: 'profile_image.png',
    };

    const success = await updateProfileImage(file);
    if (success) {
      setProfile(prevProfile => ({...prevProfile, profileImage: defaultImage.uri}));
      Alert.alert('프로필 이미지 변경 완료', '기본 이미지로 변경되었습니다.');
    } else {
      Alert.alert('프로필 이미지 변경 실패', '이미지 변경에 실패했습니다. 다시 시도해 주세요.');
    }
    closeImagePickerModal();
  };

  const handleSelectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('이미지 선택 취소');
      return;
    }

    if (result.errorCode) {
      console.error('이미지 선택 오류:', result.errorMessage);
      Alert.alert('이미지 선택 오류', '이미지 선택 중 오류가 발생했습니다.');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      if (!selectedImage.uri || !selectedImage.type || !selectedImage.fileName) {
        Alert.alert('이미지 처리 오류', '이미지 정보가 올바르지 않습니다.');
        return;
      }

      const file = {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.fileName,
      };

      try {
        const success = await updateProfileImage(file);
        if (success) {
          setProfile(prevProfile => ({
            ...prevProfile,
            profileImage: selectedImage.uri || null,
          }));
          Alert.alert('프로필 이미지 변경 완료', '프로필 이미지가 변경되었습니다.');
        } else {
          Alert.alert('프로필 이미지 변경 실패', '이미지 변경에 실패했습니다. 다시 시도해 주세요.');
        }
      } catch (error) {
        console.error('프로필 이미지 업로드 중 에러:', error);
        Alert.alert('오류', '이미지 업로드 중 문제가 발생했습니다.');
      }
    }
    closeImagePickerModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필</Text>
      <Image source={profileImageSource} style={styles.profileImage} />
      <TouchableOpacity onPress={openImagePickerModal}>
        <Text style={styles.editProfileText}>프로필 사진 바꾸기</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>닉네임</Text>
        <Text style={styles.infoText}>{profile.nickname}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>이메일</Text>
        <Text style={styles.infoText}>{profile.email}</Text>
      </View>

      <View style={styles.actionContainer}>
        <Text style={styles.actionLabel}>닉네임 변경</Text>
        <TouchableOpacity onPress={goToChangeInfo}>
          <Text style={styles.arrow}>〉</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.actionLabel}>비밀번호 변경</Text>
        <TouchableOpacity onPress={goToChangePassword}>
          <Text style={styles.arrow}>〉</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutAccountText}>로그 아웃</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={openDeleteModal}>
        <Text style={styles.deleteAccountText}>계정 삭제</Text>
      </TouchableOpacity>

      {/* 계정 삭제 모달 */}
      <AccountDeletionModal
        visible={isDeleteModalVisible}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* 프로필 이미지 선택 모달 */}
      <ProfileImagePickerModal
        visible={isImagePickerModalVisible}
        onClose={closeImagePickerModal}
        onSelectImage={handleSelectImage}
        onResetImage={handleResetImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
    marginTop: 50,
  },
  editProfileText: {
    color: '#418663',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 30,
    fontFamily: 'Pretendard-Regular',
  },
  infoContainer: {
    flexDirection: 'row',
    width: width * 0.8,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Pretendard-Bold',
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Pretendard-Regular',
  },
  actionContainer: {
    flexDirection: 'row',
    width: width * 0.8,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderColor: '#E0E0E0',
  },
  actionLabel: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Pretendard-Bold',
  },
  arrow: {
    fontSize: 16,
    color: '#333333',
  },
  deleteAccountText: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
  },
  logoutAccountText: {
    fontSize: 12,
    color: 'rgb(0,0,250)',
    marginTop: 20,
  },
});

export default Profile;
