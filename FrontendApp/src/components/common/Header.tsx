import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import LoginIcon from '../../assets/imgs/user.svg';
import {getTokens} from '../../utills/tokenStorage';
import {getUserProfile} from '../../api/mypage';

type HeaderNavigationProp = StackNavigationProp<RootStackParamList>;

const Header = () => {
  const navigation = useNavigation<HeaderNavigationProp>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const checkLoginStatus = async () => {
    const {accessToken} = await getTokens();
    setIsLoggedIn(!!accessToken);

    if (accessToken) {
      const profile = await getUserProfile();
      setProfileImage(profile?.profileImage || null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const goToLoginOrProfile = () => {
    navigation.navigate(isLoggedIn ? 'MyPage' : 'Login');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/imgs/LogoHD.png')} style={styles.logo} />
      <TouchableOpacity style={styles.loginButtons} onPress={goToLoginOrProfile}>
        {isLoggedIn && profileImage ? (
          <Image source={{uri: profileImage}} style={styles.profileImage} />
        ) : (
          <LoginIcon width={25} height={25} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#418663',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  myButton: {
    backgroundColor: '#418663',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  myButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  logo: {
    resizeMode: 'contain',
  },
  loginButtons: {
    backgroundColor: '#418663',
    borderRadius: 20,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'cover', // 이미지가 꽉 차도록
  },
});

export default Header;
