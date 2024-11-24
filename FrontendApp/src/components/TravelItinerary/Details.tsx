import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StyleSheet,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useRoute, RouteProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import RenderDayItem from './RenderDayItem';
import {createSchedule} from '../../api/itinerary';

const {width} = Dimensions.get('window');
type DetailsNavigationProp = StackNavigationProp<RootStackParamList, 'TravelItinerary'>;

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

const Details = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Details'>>();
  const {itinerary: initialItinerary} = route.params;
  const [tripName, setTripName] = useState('여행 이름을 입력하세요');
  const [isEditing, setIsEditing] = useState(false);
  const [hasCustomName, setHasCustomName] = useState(false);
  const [itinerary, setItinerary] = useState<Day[]>(initialItinerary || []);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const dayIdToUpdate = route.params?.dayId;
  const selectedPlace = route.params?.selectedPlace;

  useEffect(() => {
    if (itinerary.length > 0) {
      setStartDate(itinerary[0].date);
      setEndDate(itinerary[itinerary.length - 1].date);
    }
  }, [itinerary]);

  useEffect(() => {
    if (dayIdToUpdate && selectedPlace) {
      const newPlace: Place = {
        id: selectedPlace.id,
        name: selectedPlace.spotName,
        address: selectedPlace.spotAddress,
      };

      setItinerary(prevItinerary =>
        prevItinerary.map(day =>
          day.id === dayIdToUpdate ? {...day, places: [...day.places, newPlace]} : day,
        ),
      );
    }
  }, [dayIdToUpdate, selectedPlace]);

  useEffect(() => {
    console.log('Updated Itinerary:', JSON.stringify(itinerary, null, 2));
    console.log(startDate);
  }, [itinerary, startDate]);

  const navigation = useNavigation<DetailsNavigationProp>();

  const goToTravelItinerary = () => {
    navigation.navigate('TravelChallenge');
  };

  const handleEdit = () => {
    setTripName('');
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (!tripName.trim()) {
      Alert.alert('경고', '여행 이름을 입력해야 합니다.');
    } else {
      setIsEditing(false);
      setHasCustomName(true);
    }
  };

  const handleTextChange = (text: string) => {
    setTripName(text);
  };

  const handleDragEnd = (data: Place[], dayId: string) => {
    setItinerary(prevItinerary =>
      prevItinerary.map(day => (day.id === dayId ? {...day, places: data} : day)),
    );
  };

  const renderDaySection = ({item}: {item: Day}) => (
    <View style={styles.daySection}>
      <View style={styles.Divider} />
      <RenderDayItem item={item} handleDragEnd={handleDragEnd} />
    </View>
  );

  const handleAddSchedule = async () => {
    const formattedStartDate = `2024-${startDate.replace('/', '-')}`;
    const formattedEndDate = `2024-${endDate.replace('/', '-')}`;

    const dailyPlans = itinerary.map(day => ({
      date: `2024-${day.date.replace('/', '-')}`,
      spotIds: day.places.map(place => place.id),
    }));

    const requestData = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      title: tripName,
      dailyPlans: dailyPlans,
    };
    try {
      const response = await createSchedule(requestData);
      if (response) {
        navigation.navigate('TravelItinerary');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderFooter = () => {
    const isButtonDisabled = itinerary.some(day => day.places.length === 0);

    return (
      <TouchableOpacity
        style={[styles.addScheduleButton, isButtonDisabled && styles.disabledButton]}
        onPress={handleAddSchedule}
        disabled={isButtonDisabled} // 조건에 따라 버튼 활성/비활성화
      >
        <Text style={styles.addScheduleButtonText}>일정추가하기</Text>
      </TouchableOpacity>
    );
  };

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
                  placeholder={!hasCustomName ? '여행 이름을 입력하세요' : ''}
                  autoFocus
                />
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.confirmText}>확인</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.tripName}>{tripName}</Text>
                <TouchableOpacity onPress={handleEdit}>
                  <Image
                    source={require('../../assets/imgs/pencil.png')}
                    style={styles.pencilIcon}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Start Date와 End Date 표시 */}
          <Text style={styles.dateRange}>
            {startDate} - {endDate}
          </Text>

          <TouchableOpacity style={styles.recommendButton} onPress={goToTravelItinerary}>
            <Text style={styles.recommendButtonText}>+ 추천 코스 보기</Text>
          </TouchableOpacity>

          <FlatList
            data={itinerary}
            keyExtractor={item => item.id}
            renderItem={renderDaySection}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.listContent}
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
  recommendButton: {
    backgroundColor: '#418663',
    padding: 5,
    borderRadius: 20,
    alignItems: 'center',
    width: (width * 7) / 18,
    marginBottom: 15,
  },
  recommendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  addScheduleButton: {
    backgroundColor: '#418663',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 50,
    marginHorizontal: width * 0.1,
  },
  addScheduleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3', // 비활성화된 버튼 색상
  },
});

export default Details;
