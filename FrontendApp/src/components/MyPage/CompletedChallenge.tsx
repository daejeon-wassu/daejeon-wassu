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
import CompleteIcon from '../../assets/imgs/complete.svg';
import {getUserChallenges} from '../../api/recommended'; // axios 함수 임포트

const {width} = Dimensions.get('window');

type CourseNavigationProp = StackNavigationProp<RootStackParamList, 'TravelChallenge'>;

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

const CompletedChallenge = () => {
  const navigation = useNavigation<CourseNavigationProp>();
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const data = await getUserChallenges();
      if (data) {
        setCompletedChallenges(data.completed);
      }
    };
    fetchChallenges();
  }, []);

  const goToChallengeDetail = (courseId: number) => {
    navigation.navigate('TravelChallenge');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>완료한 챌린지</Text>

      {completedChallenges.map(challenge => (
        <TouchableOpacity
          key={challenge.course.id}
          style={styles.card}
          onPress={() => goToChallengeDetail(challenge.course.id)}>
          <Image
            source={{uri: challenge.course.image_url}}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <CompleteIcon width={50} height={50} style={styles.completeIcon} />
          <View style={styles.cardContent}>
            {/* 텍스트를 반드시 <Text> 컴포넌트로 감싸기 */}
            <Text style={styles.cardTitle}>{challenge.course.course_name}</Text>
            <Text style={styles.cardDescription}>{challenge.course.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
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
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
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
    zIndex: 1,
  },
});
export default CompletedChallenge;
