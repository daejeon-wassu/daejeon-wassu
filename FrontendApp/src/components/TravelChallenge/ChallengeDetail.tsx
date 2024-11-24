import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import Header from '../common/Header';
import PlayIcon from '../../assets/imgs/play.svg';
import ProgressIcon from '../../assets/imgs/progress.png';
import CompleteIcon from '../../assets/imgs/complete.png';
import FlameIcon from '../../assets/imgs/flame.svg';
import {getCourseDetail, startCourse} from '../../api/recommended'; // startCourse API 추가
import GpsComponent from '../common/GpsComponent'; // GPS 컴포넌트 가져오기

const {width} = Dimensions.get('window');

type ChallengeDetailNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceDetail'>;
type ChallengeDetailRouteProp = RouteProp<RootStackParamList, 'ChallengeDetail'>;

interface Bakery {
  bakery_name: string;
  address: string;
  elastic_id: string;
  completed: boolean;
  spot_id: number;
  rating: number | null;
  phone: string;
  business_hours: string;
  description: string;
  spot_image_url: string | null;
  wassumon_image_url: string | null;
  wassumon_name: string;
  hashtags: string[];
  latitude: number;
  longitude: number; // Add longitude
}

const ChallengeDetail = () => {
  const navigation = useNavigation<ChallengeDetailNavigationProp>();
  const route = useRoute<ChallengeDetailRouteProp>();
  const {id} = route.params;
  const {id: courseId} = route.params; // courseId 가져오기
  const [courseName, setCourseName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]); // 새로운 상태 추가
  const [course_datail, setcourse_datail] = useState<Bakery[]>([]);
  const [completedAll, setCompletedAll] = useState('yet');
  const [showGpsComponent, setShowGpsComponent] = useState(false);
  const [selectedBakery, setSelectedBakery] = useState<Bakery | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false); // 버튼 비활성화 상태 추가

  // 데이터 가져오는 함수
  const fetchCourseDetail = useCallback(async () => {
    try {
      const data = await getCourseDetail(id);
      if (data) {
        setCourseName(data.course.course_name);
        setImages([data.course.image_url]);
        setcourse_datail(data.course_details);
        setCompletedAll(data.completed_all);
        setHashtags(data.course.hashtags);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  // 페이지가 포커스될 때마다 데이터 다시 가져오기
  useFocusEffect(
    useCallback(() => {
      fetchCourseDetail();
    }, [fetchCourseDetail]),
  );
  useEffect(() => {
    if (showGpsComponent) {
      setModalVisible(true);

      // 1초 후에 모달을 닫기
      const timer = setTimeout(() => {
        setModalVisible(false);
        setShowGpsComponent(false); // showGpsComponent도 false로 설정
      }, 1000);

      // 컴포넌트 언마운트 시 타이머 정리
      return () => clearTimeout(timer);
    }
  }, [showGpsComponent]);
  const handleBakeryButtonClick = (bakery: Bakery) => {
    if (buttonDisabled) return; // 버튼이 비활성화된 경우 클릭 무시

    if (completedAll === 'yet') {
      // 챌린지가 시작되지 않은 경우 모달을 열기
      Alert.alert('알림', '챌린지를 시작하셔야 합니다.');
    } else {
      // 챌린지가 시작된 경우에만 AR 페이지로 이동
      setSelectedBakery(bakery);
      setShowGpsComponent(true);
      setButtonDisabled(true); // GPS 위치 불러오는 동안 버튼 비활성화
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;
    const R = 6378137; // Earth radius in meters

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const onLocationRetrieved = (coords: {latitude: number; longitude: number} | null) => {
    if (!coords || !selectedBakery) {
      Alert.alert('위치 확인 실패', '현재 위치를 가져올 수 없습니다.');
      setShowGpsComponent(false);
      setButtonDisabled(false); // 위치 실패 시 버튼 다시 활성화
      return;
    }

    const distance = calculateDistance(
      coords.latitude,
      coords.longitude,
      selectedBakery.latitude,
      selectedBakery.longitude,
    );

    if (distance <= 500) {
      setShowGpsComponent(false); // GPS 확인 후 Alert 닫기
      goToARPage(selectedBakery.spot_id); // goToARPage 함수 호출로 변경
    } else {
      Alert.alert('위치가 너무 멀어요', '해당 장소에서 500미터 이내에 있어야 합니다.');
      setShowGpsComponent(false);
    }
    setButtonDisabled(false); // 위치 확인 후 버튼 다시 활성화
  };
  const handleStartChallenge = async () => {
    try {
      const response = await startCourse(courseId); // startCourse API 호출
      if (response) {
        setCompletedAll('start'); // 챌린지 상태를 'start'로 변경
        setModalVisible(false); // 모달 닫기
      } else {
        console.error('Failed to start challenge.');
      }
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
  };
  const goToPlaceDetail = (placeId: string) => {
    if (buttonDisabled) return; // 버튼이 비활성화된 경우 클릭 무시

    setButtonDisabled(true); // 버튼 비활성화
    navigation.navigate('PlaceDetail', {id: placeId});

    // 버튼을 다시 활성화 (필요에 따라 특정 시점에 활성화)
    setButtonDisabled(false);
  };

  const goToARPage = (spotId: number) => {
    navigation.navigate('Ar', {courseId, spotId}); // courseId와 spotId를 함께 전달
  };

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <View>
          {images.map((image, index) => (
            <ImageBackground
              key={index}
              source={{uri: image}}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </View>

        <View style={styles.containerT}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {courseName}
            </Text>
            <Text style={styles.subtitle}>왔슈볼을 눌러 도전하세요! 왔슈몬을 잡으세요.</Text>
          </View>

          <View style={styles.hashtagContainer}>
            {hashtags.map((hashtag, index) => (
              <TouchableOpacity key={index}>
                <View style={styles.hashtagButton}>
                  <FlameIcon width={25} height={25} />
                  <Text style={styles.hashtagText}>{hashtag}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {course_datail.map((bakery, index) => (
            <TouchableOpacity
              key={bakery.elastic_id}
              onPress={() => goToPlaceDetail(bakery.elastic_id)}>
              <View style={styles.courseItem}>
                <View style={styles.numberContainer}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>

                <View style={styles.courseDetails}>
                  <Text style={styles.courseTitle}>{bakery.bakery_name}</Text>
                  <Text style={styles.courseAddress}>{bakery.address}</Text>
                </View>

                {bakery.completed ? (
                  <Image
                    source={{uri: bakery.wassumon_image_url || ''}}
                    style={styles.courseIcon}
                  />
                ) : (
                  // '왓슈볼' 버튼을 눌렀을 때만 AR 페이지로 이동
                  <TouchableOpacity
                    onPress={() => handleBakeryButtonClick(bakery)}
                    disabled={buttonDisabled} // 버튼 비활성화
                  >
                    <Image source={require('../../assets/imgs/watsuball.png')} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.title2}>등장 왔슈몬</Text>
          <View style={styles.monContainer}>
            {course_datail.map((bakery, index) => (
              <View key={index} style={styles.monItem}>
                <Image source={{uri: bakery.wassumon_image_url || ''}} style={styles.monIcon} />
                <Text style={styles.monText}>{bakery.wassumon_name}</Text>
              </View>
            ))}
          </View>

          {completedAll === 'yet' ? (
            <TouchableOpacity style={styles.challengeButton} onPress={handleStartChallenge}>
              <PlayIcon width={20} height={20} style={styles.buttonIcon} />
              <Text style={styles.challengeButtonText}>챌린지 시작</Text>
            </TouchableOpacity>
          ) : completedAll === 'start' ? (
            <View style={styles.challengeButton}>
              <Image source={ProgressIcon} style={styles.buttonIcon} />
              <Text style={styles.challengeButtonText}>챌린지 진행중</Text>
            </View>
          ) : (
            <View style={styles.challengeButton}>
              <Image source={CompleteIcon} style={styles.buttonIcon} />
              <Text style={styles.challengeButtonText}>챌린지 완료</Text>
            </View>
          )}
        </View>

        {showGpsComponent && <GpsComponent onLocationRetrieved={onLocationRetrieved} />}
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: width,
    aspectRatio: 2.5,
  },
  containerT: {
    paddingHorizontal: width * 0.06,
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 10, // 기존 20에서 10으로 줄임
    flexWrap: 'wrap', // 줄바꿈 가능하게
  },
  subtitle: {
    fontSize: 12, // 작은 크기 (10에서 12로 증가)
    color: '#333333',
    fontFamily: 'Pretendard-Bold',
    marginTop: 5, // 제목과의 간격을 줄임
  },
  courseItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  hashtagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(153, 153, 153, 0.5)',
  },
  hashtagText: {
    fontSize: 16,
    color: '#999999',
    marginLeft: 5,
    fontFamily: 'Pretendard-Regular',
  },

  numberContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#418663',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
  },
  courseDetails: {
    flex: 1,
    marginLeft: 30,
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  courseAddress: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(51, 51, 51, 0.6)',
    marginBottom: 10,
  },
  courseIcon: {
    width: 75, // 이미지 너비
    height: 75, // 이미지 높이
    alignSelf: 'center',
  },
  title2: {
    color: '#418663',
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    marginVertical: 20,
  },
  monContainer: {
    backgroundColor: '#418663',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribute items evenly
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10, // Add some horizontal padding
  },
  monItem: {
    width: '30%', // Each item takes up 30% of the container width
    alignItems: 'center',
    marginBottom: 20, // Space between rows
  },
  monIcon: {
    width: 65,
    height: 65,
  },
  monText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
  },
  challengeButton: {
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#418663',
    marginBottom: 50,
    alignSelf: 'center',
  },
  buttonIcon: {
    marginRight: 10,
    width: 24,
    height: 24,
  },
  progress1Icon: {
    marginLeft: 10,
    width: 20,
    height: 20,
  },
  challengeButtonText: {
    color: '#418663',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
  },
  arButton: {
    backgroundColor: '#418663',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  arButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
  },
  gpsLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  gpsLoadingText: {
    fontSize: 16,
    color: '#418663',
    fontFamily: 'Pretendard-Bold',
  },
});

export default ChallengeDetail;
