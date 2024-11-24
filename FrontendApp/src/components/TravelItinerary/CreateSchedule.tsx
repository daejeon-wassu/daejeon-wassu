import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

const {width} = Dimensions.get('window');

// Locale 설정
LocaleConfig.locales.ko = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

type CreateScheduleNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

type CustomDateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

type CustomCalendarMarkedDates = {
  [date: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    color: string;
    textColor: string;
    disabled?: boolean;
    disableTouchEvent?: boolean;
  };
};

// 날짜를 "MM.DD(요일)" 형식으로 변환하는 함수
const getFormattedDate = (date: string | null) => {
  if (!date) return '날짜 선택';

  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[dateObj.getDay()];

  return `${month}.${day}(${dayName})`;
};

const CreateSchedule = () => {
  const navigation = useNavigation<CreateScheduleNavigationProp>();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const generateItinerary = () => {
    if (!startDate || !endDate) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const itinerary = [];
    let currentDate = start;
    let dayCount = 1;

    while (currentDate <= end) {
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      itinerary.push({
        id: dayCount.toString(),
        day: `Day ${dayCount}`,
        date: `${month}/${day}`,
        places: [], // 빈 장소 배열
      });
      dayCount++;
      currentDate.setDate(currentDate.getDate() + 1); // 다음 날짜로 이동
    }

    return itinerary;
  };

  const goToDetails = () => {
    const itinerary = generateItinerary();
    navigation.navigate('Details', {itinerary});
  };

  const onDayPress = (day: CustomDateObject) => {
    const selectedDate = new Date(day.dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜 기준 시간 초기화

    if (selectedDate < today) {
      // 과거 날짜 선택 시 출발 및 도착 날짜 초기화
      setStartDate(null);
      setEndDate(null);
      return;
    }

    if (!startDate || (startDate && endDate)) {
      // 출발 날짜 설정 및 도착 날짜 초기화
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (selectedDate >= new Date(startDate)) {
      // 도착 날짜가 출발 날짜 이후인 경우에만 도착 날짜 설정
      setEndDate(day.dateString);
    } else {
      // 선택한 날짜가 출발 날짜보다 과거인 경우 초기화
      setStartDate(null);
      setEndDate(null);
    }
  };

  const markedDates: CustomCalendarMarkedDates = {};

  // 오늘 이전 날짜들을 비활성화하고 회색으로 표시
  const disablePastDates = () => {
    const currentDate = new Date();
    for (
      let d = new Date(currentDate.setDate(currentDate.getDate() - 1));
      d >= new Date('2023-01-01');
      d.setDate(d.getDate() - 1)
    ) {
      const dateString = d.toISOString().split('T')[0];
      markedDates[dateString] = {
        color: 'ffffff', // 연한 회색 (10% 투명도)
        textColor: 'rgba(51, 51, 51, 0.3)', // 더 짙은 회색 텍스트
        disabled: true, // 날짜 비활성화
        disableTouchEvent: true, // 터치 비활성화
      };
    }
  };

  // 호출하여 이전 날짜들에 대한 설정 적용
  disablePastDates();

  // 출발 및 도착 날짜 마킹
  if (startDate) {
    // 출발 날짜 설정
    markedDates[startDate] = {
      startingDay: true,
      endingDay: !endDate || startDate === endDate,
      color: '#418663',
      textColor: '#fff',
    };

    if (endDate) {
      // 도착 날짜 설정
      markedDates[endDate] = {
        startingDay: startDate === endDate,
        endingDay: true,
        color: '#418663',
        textColor: '#fff',
      };

      // 출발과 도착 사이 날짜 설정
      const start = new Date(startDate);
      const end = new Date(endDate);
      for (let d = new Date(start.getTime() + 86400000); d < end; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        markedDates[dateString] = {
          color: '#418663', // 연한 초록색 (40% 투명도)
          textColor: '#ffffff', // 회색 텍스트
        };
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topDivider} />
        <Text style={styles.title}>여행, 언제가유?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>일정에 맞춰 정보를 제공합니다.</Text>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          markingType={'period'}
          monthFormat={'yyyy년 MM월'}
          hideExtraDays={true}
          theme={{
            selectedDayBackgroundColor: '#418663',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#418663',
            dayTextColor: '#333333',
            textDisabledColor: 'rgba(51, 51, 51, 0.3)',
            arrowColor: '#418663',
            monthTextColor: 'rgba(51, 51, 51, 0.8)',
            textMonthFontSize: 14,
            textMonthFontWeight: 'bold',
            textSectionTitleColor: '#6C7072',
          }}
          locale={'ko'}
        />
      </ScrollView>

      <View style={styles.bottomDivider} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.dateContainer}>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>출발</Text>
            <Text style={styles.dateText}>{getFormattedDate(startDate)}</Text>
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>도착</Text>
            <Text style={styles.dateText}>{getFormattedDate(endDate)}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, (!startDate || !endDate) && styles.disabledButton]}
          onPress={goToDetails}
          disabled={!startDate || !endDate} // 날짜가 선택되지 않았을 경우 비활성화
        >
          <Text style={styles.buttonText}>
            {startDate && endDate
              ? `${getFormattedDate(startDate)} - ${getFormattedDate(endDate)} 등록하기`
              : '날짜를 선택하세요'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
  },
  topDivider: {
    width: width,
    height: 2,
    backgroundColor: 'rgba(51, 51, 51, 0.2)',
    marginBottom: 30,
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    paddingHorizontal: width * 0.06,
  },
  bottomDivider: {
    width: width,
    height: 1,
    backgroundColor: 'rgba(51, 51, 51, 0.2)',
    marginTop: 10,
    marginBottom: 20,
  },
  content: {},
  subtitle: {
    fontSize: 16,
    color: '#999999',
    marginVertical: 10,
    marginBottom: 60,
    paddingHorizontal: width * 0.06,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  dateBox: {},
  dateLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
    fontFamily: 'Pretendard-SemiBold',
  },
  dateText: {
    fontSize: 20,
    color: '#418663',
    fontFamily: 'Pretendard-Bold',
  },
  button: {
    backgroundColor: '#418663',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3', // 비활성화된 버튼 색상
  },
});

export default CreateSchedule;
