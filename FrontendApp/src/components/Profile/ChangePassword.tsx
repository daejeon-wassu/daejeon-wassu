import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert} from 'react-native';
import {changePassword} from '../../api/mypage';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import {logout} from '../../api/user';

const {width} = Dimensions.get('window');

type ChangePasswordNavigationProp = StackNavigationProp<RootStackParamList>;

const ChangePassword = () => {
  const navigation = useNavigation<ChangePasswordNavigationProp>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('오류', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    const response = await changePassword(currentPassword, newPassword);
    if (response && response.data && response.data.status === 'success') {
      await logout(); // 로그아웃 함수 호출
      navigation.navigate('Login'); // 로그인 페이지로 이동
    } else {
      Alert.alert('실패', '비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonPlaceholder} />
        <Text style={styles.headerTitle}>비밀번호 변경</Text>
        <TouchableOpacity onPress={handlePasswordChange}>
          <Text style={styles.headerButton}>완료</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>현재 비밀번호</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder=""
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>새 비밀번호</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder=""
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>새 비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder=""
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.06,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
    textAlign: 'center',
  },
  headerButton: {
    fontSize: 16,
    color: '#418663',
  },
  headerButtonPlaceholder: {
    width: 50, // 완료 버튼의 공간만큼 차지하도록 설정
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    color: '#333333',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    fontSize: 16,
    color: '#333333',
  },
});

export default ChangePassword;
