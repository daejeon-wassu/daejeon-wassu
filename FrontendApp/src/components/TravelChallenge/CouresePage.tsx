import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import {getCoursePresets} from '../../api/recommended'; // API 함수 가져오기

const {width} = Dimensions.get('window');

type CourseNavigationProp = StackNavigationProp<RootStackParamList, 'ChallengeDetail'>;

interface CourseData {
  id: number;
  course_name: string;
  description: string;
  image_url: string;
  completed_all: boolean; // completed_all 추가
}

const CoursePage = () => {
  // 컴포넌트 이름을 CoursePage로 변경
  const navigation = useNavigation<CourseNavigationProp>();
  const [courses, setCourses] = useState<CourseData[]>([]); // CourseData 타입 지정

  // API 호출 및 데이터 설정
  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getCoursePresets();
      if (data) {
        setCourses(data);
      }
    };
    fetchCourses();
  }, []);

  const goToChallengeDetail = (courseId: number) => {
    navigation.navigate('ChallengeDetail', {id: courseId});
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>대전왔슈 제공</Text>
      <Text style={styles.sectionSubtitle}>대전 여행 챌린지 코스 🔥</Text>

      {/* API로 가져온 코스 데이터를 렌더링 */}
      {courses.map(course => (
        <TouchableOpacity
          key={course.id}
          style={styles.card}
          onPress={() => goToChallengeDetail(course.id)}>
          <Image source={{uri: course.image_url}} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{course.course_name}</Text>
            <Text style={styles.cardDescription}>{course.description}</Text>
          </View>
          {/* completed_all이 true일 때 complete 도장을 표시 */}
          {course.completed_all && (
            <Image source={require('../../assets/imgs/complete.png')} style={styles.completeIcon} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: width * 0.06,
  },
  sectionTitle: {
    marginTop: 30,
    fontSize: 20,
    color: '#333',
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    marginRight: 10,
  },
  sectionSubtitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative',
  },
  cardImage: {
    width: 100, // 너비를 명시적으로 설정
    height: 100, // 높이를 명시적으로 설정
    marginRight: 10,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(51, 51, 51, 0.5)',
    marginTop: 10,
  },
  completeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    zIndex: 1,
  },
});

export default CoursePage; // 컴포넌트 이름을 CoursePage로 변경
