import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useRoute, RouteProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import ReRenderDayItem from './ReRenderDayItem';
import {updateSchedule} from '../../api/itinerary';

const {width} = Dimensions.get('window');
type DetailedInquiryNavigationProp = StackNavigationProp<RootStackParamList, 'TravelItinerary'>;

type Place = {
  id: string;
  name: string;
  address: string;
};

type Day = {
  id: string;
  day: string;
  date: string;
  places: Place[];
};

const DetailedInquiry = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'DetailedInquiry'>>();

  const {itinerary = null, dayId, selectedPlace} = route.params || {};
  const [scheduleId, setScheduleId] = useState<number | null>(itinerary?.scheduleId ?? null);
  const navigation = useNavigation<DetailedInquiryNavigationProp>();

  const [tripName, setTripName] = useState(itinerary?.title || '여행 이름');
  const [isEditing, setIsEditing] = useState(false);
  const [dailyPlans, setDailyPlans] = useState<Day[]>([]);
  const [startDate] = useState(itinerary?.startDate || '');
  const [endDate] = useState(itinerary?.endDate || '');

  useEffect(() => {
    if (itinerary && itinerary.scheduleId) {
      setScheduleId(itinerary.scheduleId);
    }
  }, [itinerary]);

  useEffect(() => {
    if (itinerary) {
      const plans = itinerary.dailyPlans.map(plan => ({
        id: plan.planId.toString(),
        day: `Day ${plan.day}`,
        date: plan.date,
        places: plan.touristSpots.map(spot => ({
          id: spot.spotId.toString(),
          name: spot.spotName,
          address: spot.spotAddress,
        })),
      }));
      setDailyPlans(plans);
    }
  }, [itinerary]);

  useEffect(() => {
    if (dayId && selectedPlace) {
      setDailyPlans(prevPlans =>
        prevPlans.map(day =>
          day.id === dayId ? {...day, places: [...day.places, selectedPlace]} : day,
        ),
      );
    }
  }, [dayId, selectedPlace]);

  useEffect(() => {
    const routeParams = JSON.stringify(route.params, null, 2);
  }, [route.params]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleTextChange = (text: string) => {
    setTripName(text);
  };

  const handleDragEnd = (data: Place[], dayId: string) => {
    setDailyPlans(prevPlans =>
      prevPlans.map(day => (day.id === dayId ? {...day, places: data} : day)),
    );
  };

  const handleUpdateSchedule = async () => {
    const formattedPlans = dailyPlans.map(day => ({
      date: day.date,
      spotIds: day.places.map(place => place.id),
    }));

    const requestData = {
      scheduleId,
      title: tripName,
      startDate,
      endDate,
      dailyPlans: formattedPlans,
    };

    try {
      const response = await updateSchedule(scheduleId, requestData);
      if (response) {
        navigation.navigate('TravelItinerary'); // 수정 후 여행 일정 화면으로 이동
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderFooter = () => {
    // dailyPlans 중 하나라도 places가 비어 있으면 버튼 비활성화
    const isButtonDisabled = dailyPlans.some(day => day.places.length === 0);

    return (
      <TouchableOpacity
        style={[styles.updateButton, isButtonDisabled && styles.disabledButton]}
        onPress={handleUpdateSchedule}
        disabled={isButtonDisabled} // 조건에 따라 버튼 활성/비활성화
      >
        <Text style={styles.updateButtonText}>수정하기</Text>
      </TouchableOpacity>
    );
  };

  const renderDaySection = ({item}: {item: Day}) => (
    <View style={styles.daySection}>
      <View style={styles.Divider} />
      <ReRenderDayItem item={item} handleDragEnd={handleDragEnd} />
    </View>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.topDivider} />

        <View style={styles.content}>
          <View style={styles.header}>
            {isEditing ? (
              <>
                <TextInput
                  value={tripName}
                  onChangeText={handleTextChange}
                  style={styles.tripNameInput}
                  autoFocus
                />
                <TouchableOpacity onPress={handleEditToggle}>
                  <Text style={styles.confirmText}>완료</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.tripName}>{tripName}</Text>
                <TouchableOpacity onPress={handleEditToggle}>
                  <Image
                    source={require('../../assets/imgs/pencil.png')}
                    style={styles.pencilIcon}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={styles.dateRange}>
            {startDate} - {endDate}
          </Text>

          <FlatList
            data={dailyPlans}
            keyExtractor={item => item.id}
            renderItem={renderDaySection}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.listContent}
            extraData={dailyPlans} // 업데이트된 dailyPlans로 리렌더링 강제
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.06,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topDivider: {
    width: width,
    height: 2,
    backgroundColor: 'rgba(51, 51, 51, 0.2)',
    marginBottom: 30,
    marginTop: 60,
  },
  tripNameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  tripName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  confirmText: {
    fontSize: 16,
    color: '#418663',
    marginLeft: 8,
    fontFamily: 'Pretendard-SemiBold',
  },
  pencilIcon: {
    width: 20,
    height: 20,
  },
  dateRange: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 16,
  },
  Divider: {
    width: width * 0.9,
    height: 1,
    backgroundColor: 'rgba(51, 51, 51, 0.2)',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  daySection: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  updateButton: {
    backgroundColor: '#418663',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: width * 0.1,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3', // 비활성화된 버튼 색상
  },
});

export default DetailedInquiry;
