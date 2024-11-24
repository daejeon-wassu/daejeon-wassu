import React, {useState} from 'react';
import {View, Text, Button, PermissionsAndroid, Platform, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

// 좌표 타입 정의
interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

const Gps: React.FC = () => {
  // 초기 상태를 null로 설정
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: null,
    longitude: null,
  });

  // 위치 권한 요청 및 현재 위치 가져오기
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 요청',
            message: '이 앱은 정확한 위치 정보를 제공하기 위해 위치 권한이 필요합니다.',
            buttonNeutral: '나중에 묻기',
            buttonNegative: '취소',
            buttonPositive: '확인',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('권한 거부', '위치 권한이 거부되었습니다. 위치 기능을 사용할 수 없습니다.');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // iOS의 경우 위치 권한을 다르게 처리해야 합니다.
      getCurrentLocation();
    }
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCoordinates({latitude, longitude});
      },
      error => {
        console.log(error);
        // 에러 메시지 출력 및 null 값 설정
        Alert.alert('위치 가져오기 실패', error.message);
        setCoordinates({latitude: null, longitude: null});
      },
      {
        enableHighAccuracy: false, // 정확도 설정을 낮춰보기
        timeout: 20000, // 타임아웃 시간 늘리기 (20초)
        maximumAge: 1000, // 캐시된 위치를 1초까지만 허용
      },
    );
  };

  return (
    <View>
      <Text>Gps 화면 테스트</Text>
      <Button title="GPS 좌표 가져오기" onPress={requestLocationPermission} />
      {coordinates.latitude !== null && coordinates.longitude !== null ? (
        <Text>
          위도: {coordinates.latitude}, 경도: {coordinates.longitude}
        </Text>
      ) : (
        <Text>좌표가 없습니다</Text>
      )}
    </View>
  );
};

export default Gps;
