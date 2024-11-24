import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import MyTrips from '../components/MyPage/MyTrips';
import DaejeonStamp from '../components/MyPage/DaejeonStamp';
import ChallengeCourse from '../components/MyPage/ChallengeCourse';
import TravelLog from '../components/MyPage/TravelLog';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';
import {getUserProfile} from '../api/mypage';

const {width} = Dimensions.get('window');

type MyPageNavigationProp = StackNavigationProp<RootStackParamList>;

const MyPage = () => {
  const navigation = useNavigation<MyPageNavigationProp>();
  const [activeTab, setActiveTab] = useState<
    'MyTrips' | 'DaejeonStamp' | 'ChallengeCourse' | 'TravelLog'
  >('MyTrips');
  const [profile, setProfile] = useState<{nickname: string; profileImage: string | null}>({
    nickname: '',
    profileImage: null,
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        const userProfile = await getUserProfile();
        if (userProfile) {
          setProfile({
            nickname: userProfile.nickname,
            profileImage:
              userProfile.profileImage !== 'default'
                ? userProfile.profileImage
                : '../assets/imgs/user.png',
          });
        }
      };
      fetchUserProfile();
    }, []),
  );

  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  const goToCollection = () => {
    navigation.navigate('Dogam');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'MyTrips':
        return <MyTrips />;
      case 'DaejeonStamp':
        return <DaejeonStamp />;
      case 'ChallengeCourse':
        return <ChallengeCourse />;
      case 'TravelLog':
        return <TravelLog />;
      default:
        return <MyTrips />;
    }
  };

  return (
    <View style={styles.container}>
      {/* 프로필 정보 */}
      <View style={styles.profileContainer}>
        <Image
          source={
            profile.profileImage ? {uri: profile.profileImage} : require('../assets/imgs/user.png')
          }
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <View style={styles.profileHeader}>
            <Text style={styles.nickname}>{profile.nickname || '사용자 이름'}</Text>
            <TouchableOpacity onPress={goToProfile}>
              <Image
                source={require('../assets/imgs/chevron-right.png')}
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.collectionButton} onPress={goToCollection}>
          <Image source={require('../assets/imgs/monster.png')} style={styles.monsterIcon} />
          <Text style={styles.collectionText}>왔슈몬 도감</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'MyTrips' && styles.activeTab]}
          onPress={() => setActiveTab('MyTrips')}>
          <Text style={[styles.tabText, activeTab === 'MyTrips' && styles.activeTabText]}>
            나의 여행
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'DaejeonStamp' && styles.activeTab]}
          onPress={() => setActiveTab('DaejeonStamp')}>
          <Text style={[styles.tabText, activeTab === 'DaejeonStamp' && styles.activeTabText]}>
            대전 스탬프
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ChallengeCourse' && styles.activeTab]}
          onPress={() => setActiveTab('ChallengeCourse')}>
          <Text style={[styles.tabText, activeTab === 'ChallengeCourse' && styles.activeTabText]}>
            챌린지 코스
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'TravelLog' && styles.activeTab]}
          onPress={() => setActiveTab('TravelLog')}>
          <Text style={[styles.tabText, activeTab === 'TravelLog' && styles.activeTabText]}>
            여행기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 탭에 따른 콘텐츠 */}
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: width * 0.06,
  },
  logo: {
    width: 24,
    height: 24,
    marginVertical: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 30,
    marginRight: 15,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  nickname: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
    letterSpacing: -1.6, // 글자 간격 조정
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  introduction: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#333333',
    marginTop: 10,
  },
  collectionButton: {
    flexDirection: 'row',
    alignItems: 'flex-end', // 아래쪽 정렬
  },
  monsterIcon: {
    width: 15,
    height: 15,
    marginRight: 8,
  },
  collectionText: {
    fontSize: 10,
    fontFamily: 'Pretendard Variable',
    color: '#333333',
    marginTop: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: -width * 0.06, // paddingHorizontal 상쇄
  },
  tab: {
    width: width / 4,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#rgba(153, 153, 153, 0.2)', // 비활성 탭 구분선 색상
  },
  activeTab: {
    borderBottomColor: '#418663', // 활성 탭 구분선 색상
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: 'rgba(153, 153, 153, 0.2)', // 비활성 탭 텍스트 색상
    textAlign: 'center', // 텍스트 가운데 정렬
  },
  activeTabText: {
    color: '#333333', // 활성 탭 텍스트 색상
  },
  contentContainer: {
    flex: 1,
  },
});

export default MyPage;
