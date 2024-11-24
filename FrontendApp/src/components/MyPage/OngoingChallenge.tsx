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
import {getUserChallenges} from '../../api/recommended'; // axios 함수 임포트

const {width} = Dimensions.get('window');

type CourseNavigationProp = StackNavigationProp<RootStackParamList, 'ChallengeDetail'>;

interface Course {
  id: number;
  course_name: string;
  description: string;
  image_url: string;
}

interface Challenge {
  course: Course;
  course_details: any[];
}

const OngoingChallenge = () => {
  const navigation = useNavigation<CourseNavigationProp>();
  const [inProgressChallenges, setInProgressChallenges] = useState<Challenge[]>([]);
  const [hasChallenges, setHasChallenges] = useState<boolean>(true); // 챌린지 여부 상태 추가

  useEffect(() => {
    const fetchChallenges = async () => {
      const data = await getUserChallenges();
      if (data && data.in_progress) {
        setInProgressChallenges(data.in_progress);
      } else {
        setHasChallenges(false); // 진행 중인 챌린지가 없을 경우
      }
    };
    fetchChallenges();
  }, []);

  const goToChallengeDetail = (courseId: number) => {
    navigation.navigate('ChallengeDetail', {id: courseId});
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>진행중인 챌린지</Text>

      {hasChallenges ? (
        inProgressChallenges.map(challenge => (
          <TouchableOpacity
            key={challenge.course.id}
            style={styles.card}
            onPress={() => goToChallengeDetail(challenge.course.id)}>
            <Image
              source={{uri: challenge.course.image_url}}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{challenge.course.course_name}</Text>
              <Text style={styles.cardDescription}>{challenge.course.description}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noChallengesContainer}>
          <Text style={styles.noChallengesText}>진행 중인 챌린지가 없습니다</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: width * 0.06,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    marginBottom: 30,
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
    width: 100, // Image 너비 설정
    height: 100, // Image 높이 설정
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
  noChallengesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noChallengesText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#888',
  },
});

export default OngoingChallenge;
