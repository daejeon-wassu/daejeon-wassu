import React, {useEffect} from 'react';
import {View, Text, ImageBackground, StyleSheet, useWindowDimensions, Image} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

type MainRoomNavigationProp = StackNavigationProp<RootStackParamList>;

const MainRoom = () => {
  const navigation = useNavigation<MainRoomNavigationProp>();
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    Orientation.lockToLandscapeLeft();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const goToGameTwo = () => {
    navigation.navigate('GameTwo');
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inviteCodeContainer: {
      position: 'absolute',
      top: 20,
      left: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    inviteCodeText: {
      fontSize: 24,
      fontFamily: 'Pretendard-Bold',
      color: '#333',
      marginRight: 10,
    },
    codeText: {
      fontSize: 18,
      fontFamily: 'Pretendard-Bold',
      color: '#333',
      marginTop: 2,
    },
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '70%',
    },
    profileCard: {
      width: width * 0.18,
      height: height * 0.5,
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 15,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 5,
    },
    profileImage: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginTop: 10,
    },
    profileName: {
      fontSize: 16,
      color: '#333',
      textAlign: 'center',
      fontFamily: 'Pretendard-SemiBold',
      marginTop: 45,
    },
    emptyCard: {
      width: width * 0.18,
      height: height * 0.5,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderRadius: 15,
    },
  });

  return (
    <ImageBackground
      source={require('../../assets/imgs/mono/DBack.jpg')}
      style={styles.background}
      resizeMode="cover">
      {/* 초대 코드 */}
      <View style={styles.inviteCodeContainer}>
        <Text style={styles.inviteCodeText}>초대 코드</Text>
        <Text style={styles.codeText}>U1N89X</Text>
      </View>

      {/* 카드 컨테이너 */}
      <View style={styles.cardContainer}>
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <Image source={require('../../assets/imgs/uiicon.png')} style={styles.profileImage} />
          <Text style={styles.profileName}>대전의 아들 장현수</Text>
        </View>

        {/* 빈 카드 */}
        <View style={styles.emptyCard} />
      </View>
    </ImageBackground>
  );
};

export default MainRoom;
