import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import type {RootStackParamList} from '../../router/Navigator';
import {updateNickname} from '../../api/mypage';

const {width} = Dimensions.get('window');

type ChangeInfoRouteProp = RouteProp<RootStackParamList, 'ChangeInfo'>;

const ChangeInfo = () => {
  const route = useRoute<ChangeInfoRouteProp>();
  const navigation = useNavigation();
  const {nickname} = route.params;

  const [newNickname, setNewNickname] = useState(nickname);

  const handleUpdateNickname = async () => {
    const success = await updateNickname(newNickname);
    if (success) {
      navigation.goBack(); // 닉네임이 변경된 후 이전 화면으로 돌아갑니다.
    } else {
      console.log('닉넴변경실패');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonPlaceholder} />
        <Text style={styles.headerTitle}>닉네임 변경</Text>
        <TouchableOpacity onPress={handleUpdateNickname}>
          <Text style={styles.headerButton}>완료</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.input}
          value={newNickname}
          onChangeText={setNewNickname}
          placeholderTextColor="#C0C0C0"
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
    fontFamily: 'Pretendard-Bold',
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
    fontFamily: 'Pretendard-SemiBold',
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

export default ChangeInfo;
