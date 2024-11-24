import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type MonopolyNavigationProp = StackNavigationProp<RootStackParamList>;

const MonopolyPage = () => {
  const navigation = useNavigation<MonopolyNavigationProp>();
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    Orientation.lockToLandscapeLeft();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const goToChoice = () => {
    navigation.navigate('Choice', {single: true});
  };

  const goToInvitation = () => {
    navigation.navigate('Invitation', {single: false});
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '70%',
    },
    button: {
      backgroundColor: '#E0F2E0',
      borderWidth: 15,
      borderColor: '#ffffff',
      width: width * 0.15,
      height: height * 0.5,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonText: {
      fontSize: 20,
      color: '#333',
      fontWeight: 'bold',
      fontFamily: 'Pretendard-Bold',
    },
  });

  return (
    <ImageBackground
      source={require('../assets/imgs/mono/DBack.jpg')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={goToChoice}>
          <Text style={styles.buttonText}>혼자</Text>
          <Text style={styles.buttonText}>왔슈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToInvitation}>
          <Text style={styles.buttonText}>대결</Text>
          <Text style={styles.buttonText}>왔슈</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default MonopolyPage;
