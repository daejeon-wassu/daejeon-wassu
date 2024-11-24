import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import {joinRoom} from '../../api/mono';

type InvitationNavigationProp = StackNavigationProp<RootStackParamList>;
type InvitationRouteProp = RouteProp<RootStackParamList, 'Invitation'>;

const Invitation = () => {
  const route = useRoute<InvitationRouteProp>();
  const {single} = route.params || {};
  const navigation = useNavigation<InvitationNavigationProp>();
  const {width, height} = useWindowDimensions();

  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    Orientation.lockToLandscapeLeft();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const goToGameTwo = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('오류', '초대 코드를 입력해주세요.');
      return;
    }
    try {
      const {roomId} = await joinRoom(inviteCode.trim());
      navigation.navigate('GameTwo', {roomId});
    } catch (error) {
      console.error('방 입장 중 에러:', error);
      Alert.alert('오류', '올바르지 않은 초대 코드입니다.');
    }
  };

  const goToChoiceTwo = () => {
    navigation.navigate('ChoiceTwo', {single});
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      height: '70%',
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '60%',
      alignItems: 'center',
    },
    icon: {
      width: 150,
      height: 150,
    },
    icons: {
      width: 175,
      height: 175,
    },
    inputRow: {
      flexDirection: 'column',
      width: '50%',
    },
    inputRows: {
      width: '40%',
      backgroundColor: '#E0F2E0',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 5,
      borderRadius: 15,
    },
    label: {
      fontSize: 16,
      color: '#333',
      fontFamily: 'Pretendard-Medium',
    },
    underlineInput: {
      width: '80%',
      height: 36,
      borderBottomWidth: 3,
      borderBottomColor: '#418663',
      fontFamily: 'Pretendard-Regular',
      textAlign: 'center',
      color: '#333',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '60%',
      alignItems: 'center',
    },
    button: {
      paddingVertical: 10,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      width: '25%', // 버튼 너비를 설정하여 두 버튼이 균등하게 보이도록
    },
    greenButton: {
      backgroundColor: '#418663',
    },
    orangeButton: {
      backgroundColor: '#F49C30',
    },
    buttonText: {
      color: '#333333',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Pretendard-SemilBold',
    },
  });

  return (
    <ImageBackground
      source={require('../../assets/imgs/mono/DBack.jpg')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.iconRow}>
          <Image source={require('../../assets/imgs/mono/ghome.png')} style={styles.icon} />
          <Image source={require('../../assets/imgs/mono/yhome.png')} style={styles.icons} />
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputRows}>
            <Text style={styles.label}>코드 입력</Text>
            <TextInput
              style={styles.underlineInput}
              placeholder="초대 코드를 입력하세요"
              placeholderTextColor="#333"
              value={inviteCode} // 상태값으로 연결
              onChangeText={setInviteCode} // 상태 업데이트
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={goToGameTwo}>
            <Text style={styles.buttonText}>방 들어가기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.orangeButton]} onPress={goToChoiceTwo}>
            <Text style={styles.buttonText}>방 만들기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Invitation;
