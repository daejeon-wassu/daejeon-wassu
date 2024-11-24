import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import DeleteConfirmationModal from '../MyPage/DeleteConfirmationModal';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import {deleteSchedule, getMySchedules, getScheduleDetails} from '../../api/itinerary';

type MyTripsNavigationProp = StackNavigationProp<RootStackParamList, 'TravelItinerary'>;

interface TripItem {
  id: string;
  title: string;
  date: string;
  places: string;
  thumbnail?: string;
}

const {width} = Dimensions.get('window');

const MyTrips = () => {
  const navigation = useNavigation<MyTripsNavigationProp>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [onGoingSchedules, setOnGoingSchedules] = useState<TripItem | null>(null);
  const [upcomingSchedules, setUpcomingSchedules] = useState<TripItem[]>([]);
  const [pastSchedules, setPastSchedules] = useState<TripItem[]>([]);

  const fetchSchedules = async () => {
    const schedules = await getMySchedules();
    if (schedules) {
      const ongoingSchedule: TripItem | null = schedules.onGoingSchedules
        ? {
            id: schedules.onGoingSchedules.scheduleId.toString(),
            title: schedules.onGoingSchedules.title,
            date: `${schedules.onGoingSchedules.startDate} ~ ${schedules.onGoingSchedules.endDate}`,
            places: `${schedules.onGoingSchedules.spotCount}개 관광지`,
            thumbnail: schedules.onGoingSchedules.thumbnail,
          }
        : null;

      const upcoming = schedules.upcomingSchedules.map(schedule => ({
        id: schedule.scheduleId.toString(),
        title: schedule.title,
        date: `${schedule.startDate} ~ ${schedule.endDate}`,
        places: `${schedule.spotCount}개 관광지`,
        thumbnail: schedule.thumbnail,
      }));

      const past = schedules.pastSchedules.map(schedule => ({
        id: schedule.scheduleId.toString(),
        title: schedule.title,
        date: `${schedule.startDate} ~ ${schedule.endDate}`,
        places: `${schedule.spotCount}개 관광지`,
        thumbnail: schedule.thumbnail,
      }));

      setOnGoingSchedules(ongoingSchedule);
      setUpcomingSchedules(upcoming);
      setPastSchedules(past);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
    }, []),
  );

  const handleNavigateToItinerary = () => {
    navigation.navigate('TravelItinerary');
  };

  const handleTrashPress = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedScheduleId) {
      handleDelete(selectedScheduleId);
    }
  };

  const handleDelete = async (scheduleId: string) => {
    const isDeleted = await deleteSchedule(scheduleId);
    if (isDeleted) {
      await fetchSchedules(); // 일정 목록을 새로 로드
      setIsModalVisible(false);
    } else {
      console.error('일정 삭제 실패');
    }
  };

  const handleSchedulePress = async (scheduleId: string) => {
    try {
      const scheduleDetails = await getScheduleDetails(scheduleId);
      if (scheduleDetails) {
        navigation.navigate('DetailedInquiry', {itinerary: scheduleDetails});
      }
    } catch (error) {
      console.error('Failed to fetch schedule details:', error);
    }
  };

  const renderOngoingTripItem = ({item}: {item: TripItem}) => (
    <TouchableOpacity onPress={() => handleSchedulePress(item.id)}>
      <View style={[styles.tripContainer, styles.onGoingTripContainer]}>
        <View>
          <Text style={styles.tripTitle}>{item.title}</Text>
          <Text style={styles.tripDate}>{item.date}</Text>
          <Text style={styles.tripPlaces}>{item.places}</Text>
        </View>
        <Image
          source={item.thumbnail ? {uri: item.thumbnail} : require('../../assets/imgs/travel1.png')}
          style={styles.tripImage}
        />
        <TouchableOpacity style={styles.trashButton} onPress={() => handleTrashPress(item.id)}>
          <Image source={require('../../assets/imgs/trash.png')} style={styles.trashIcon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderTripItem = ({item}: {item: TripItem}) => (
    <TouchableOpacity onPress={() => handleSchedulePress(item.id)}>
      <View style={styles.tripContainer}>
        <View>
          <Text style={styles.tripTitle}>{item.title}</Text>
          <Text style={styles.tripDate}>{item.date}</Text>
          <Text style={styles.tripPlaces}>{item.places}</Text>
        </View>
        <Image
          source={item.thumbnail ? {uri: item.thumbnail} : require('../../assets/imgs/travel1.png')}
          style={styles.tripImage}
        />
        <TouchableOpacity style={styles.trashButton} onPress={() => handleTrashPress(item.id)}>
          <Image source={require('../../assets/imgs/trash.png')} style={styles.trashIcon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* 일정 추가하기 버튼 */}
      <TouchableOpacity style={styles.addButton} onPress={handleNavigateToItinerary}>
        <Image source={require('../../assets/imgs/plus.png')} style={styles.plusIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.addButtonText}>대전 여행 일정 추가하기</Text>
          <Text style={styles.addButtonSubtitle}>대전와슈와 대전 여행을 함께하세요</Text>
        </View>
      </TouchableOpacity>

      {/* 진행 중인 여행 */}
      <Text style={styles.sectionTitle}>진행 중인 여행</Text>
      {onGoingSchedules ? (
        <FlatList
          data={[onGoingSchedules]}
          renderItem={renderOngoingTripItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noDataText}>진행 중인 여행이 없습니다</Text>
      )}

      {/* 다가오는 여행 */}
      <Text style={styles.sectionTitle}>다가오는 여행</Text>
      {upcomingSchedules.length > 0 ? (
        <FlatList
          data={upcomingSchedules}
          renderItem={renderTripItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noDataText}>다가오는 여행이 없습니다</Text>
      )}

      {/* 지난 여행 */}
      <Text style={styles.sectionTitle}>지난 여행</Text>
      {pastSchedules.length > 0 ? (
        <FlatList
          data={pastSchedules}
          renderItem={renderTripItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noDataText}>지난 여행이 없습니다</Text>
      )}

      {/* 삭제 확인 모달 */}
      <DeleteConfirmationModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={confirmDelete}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    width: width * 0.9,
    height: 80,
    backgroundColor: 'rgba(153, 153, 153, 0.05)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 0.06 * width,
  },
  plusIcon: {
    width: 33,
    height: 33,
    marginBottom: 5,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 20,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
  },
  addButtonSubtitle: {
    fontSize: 10,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(51, 51, 51, 0.8)', // 80% 투명도 적용
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    paddingHorizontal: width * 0.05,
  },
  tripList: {},
  tripContainer: {
    width: '90%',
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  tripTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  tripDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 15,
  },
  tripPlaces: {
    fontSize: 12,
    color: '#999999',
  },
  tripImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginLeft: 50,
  },
  trashButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5,
    marginBottom: 50,
  },
  trashIcon: {
    width: 24,
    height: 24,
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  onGoingTripContainer: {
    borderColor: '#418663',
    borderWidth: 2,
    backgroundColor: '#E6F4EC',
  },
});

export default MyTrips;
