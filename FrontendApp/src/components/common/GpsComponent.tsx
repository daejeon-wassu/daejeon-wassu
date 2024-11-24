import React from 'react';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GpsComponentProps {
  onLocationRetrieved: (coords: Coordinates) => void;
}

const GpsComponent: React.FC<GpsComponentProps> = ({onLocationRetrieved}) => {
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 요청',
            message: '위치 정보를 제공하기 위해 권한이 필요합니다.',
            buttonNeutral: '나중에 묻기',
            buttonNegative: '취소',
            buttonPositive: '확인',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('권한 거부', '위치 권한이 거부되었습니다.');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        onLocationRetrieved({latitude, longitude});
      },
      error => {
        onLocationRetrieved({latitude: 0, longitude: 0});
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  };

  requestLocationPermission(); // 실행 시 권한 요청 및 위치 가져오기

  return null; // UI 컴포넌트가 필요 없으므로 null 반환
};

export default GpsComponent;
