import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import SearchBar from '../components/Main/SearchBar';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';
import LogoIcon from '../assets/imgs/Logo2.svg';
import FoodIcon from '../assets/imgs/food.svg';
import HomeIcon from '../assets/imgs/home.svg';
import SportIcon from '../assets/imgs/sport.svg';
import ArtIcon from '../assets/imgs/art.svg';
import BreadIcon from '../assets/imgs/mainbread.svg';
import FlameIcon from '../assets/imgs/mainhot.svg';
import ScienceIcon from '../assets/imgs/sei.svg';
import CalendarIcon from '../assets/imgs/maincalendar.svg';
import MonopolyIcon from '../assets/imgs/monopoly.svg';
import LoginIcon from '../assets/imgs/user.svg';
import {getTokens} from '../utills/tokenStorage';
import {getRecommendedPosts} from '../api/community';
import {getSpots} from '../api/itinerary';
import {TouristSpot} from '../types';
import {getUserProfile} from '../api/mypage';
import {getMyMarble} from '../api/mono';

const {width, height} = Dimensions.get('window');

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type Category = {
  id: string;
  name: string;
  icon: any;
};

type Review = {
  id: string;
  nickname: string;
  userimg: any;
  title: string;
  context: string;
};

const categories: Category[] = [
  {id: '1', name: '음식', icon: <FoodIcon width={30} height={30} />},
  {id: '2', name: '자연', icon: <HomeIcon width={30} height={30} />},
  {
    id: '3',
    name: '역사',
    icon: (
      <Image
        source={require('../assets/imgs/categoryicon/free-icon-history-1373354.png')}
        style={{width: 30, height: 30}}
      />
    ),
  },
  {
    id: '4',
    name: '문화',
    icon: (
      <Image
        source={require('../assets/imgs/categoryicon/free-icon-culture-9531233.png')}
        style={{width: 30, height: 30}}
      />
    ),
  },
  {id: '5', name: '과학', icon: <ScienceIcon width={30} height={30} />},
  {id: '6', name: '교육', icon: <ArtIcon width={30} height={30} />},
  {
    id: '7',
    name: '가족',
    icon: (
      <Image
        source={require('../assets/imgs/categoryicon/free-icon-family-3884999.png')}
        style={{width: 30, height: 30}}
      />
    ),
  },
  {id: '8', name: '빵집', icon: <BreadIcon width={30} height={30} />},
  {id: '9', name: '스포츠', icon: <SportIcon width={30} height={30} />},
  {
    id: '10',
    name: '랜드마크',
    icon: (
      <Image
        source={require('../assets/imgs/categoryicon/free-icon-landmark-navigation-16996099.png')}
        style={{width: 30, height: 30}}
      />
    ),
  },
];

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunkedArr: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

const MainPage = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const [review, setReview] = useState<Review[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TouristSpot[]>([]);
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);

  const [userProfile, setUserProfile] = useState<{
    profileImage: string | null;
  } | null>(null);

  const handleSearch = async () => {
    if (searchText.trim()) {
      // 검색어가 있을 때만 검색 실행
      const results = await getSpots(searchText);
      setSearchResults(results ?? []); // If results is null, set an empty array
      setIsSearchResultVisible(true);
    } else {
      setSearchResults([]);
      setIsSearchResultVisible(false); // 검색어가 없으면 검색 결과 숨김
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    setIsSearchResultVisible(false);
  };

  // searchText가 변경될 때마다 handleSearch 실행
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        const recommendedPosts = await getRecommendedPosts();
        if (recommendedPosts) {
          const formattedReviews = recommendedPosts.map(post => ({
            id: post.id,
            nickname: post.nickName,
            userimg: {uri: post.profileImage},
            title: post.title,
            context: post.content,
          }));
          setReview(formattedReviews);
        }
      } catch (error) {
        console.error('Error fetching recommended posts:', error);
      }
    };

    fetchRecommendedPosts();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const {accessToken} = await getTokens();
      const {refreshToken} = await getTokens();

      if (accessToken) {
        const profile = await getUserProfile();
        if (profile) {
          setUserProfile({profileImage: profile.profileImage});
        } else {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    };

    const unsubscribe = navigation.addListener('focus', checkLoginStatus); // 화면 포커싱 시 확인
    return unsubscribe;
  }, [navigation]);

  const goToLoginOrProfile = async () => {
    const {accessToken} = await getTokens();
    if (accessToken) {
      navigation.navigate('MyPage');
    } else {
      navigation.navigate('Login');
    }
  };

  const goToRecommend = () => {
    navigation.navigate('RecommendedPlace', {category: ''});
  };

  const goToRecommends = (category: string) => {
    navigation.navigate('RecommendedPlace', {category});
  };

  const goToTravelChallenge = () => {
    navigation.navigate('TravelChallenge');
  };

  const goToMonopolyPage = async () => {
    try {
      const myMarble = await getMyMarble();

      if (myMarble) {
        const {roomId, single} = myMarble;

        if (single) {
          navigation.navigate('GameOne', {roomId}); // GameOne 페이지로 이동
        } else {
          navigation.navigate('GameTwo', {roomId}); // GameTwo 페이지로 이동
        }
      } else {
        // 진행 중인 마블이 없는 경우
        navigation.navigate('MonopolyPage'); // MonopolyPage로 이동
      }
    } catch (error) {
      console.error('MonopolyPage 이동 중 에러 발생:', error);
    }
  };

  const goToCommunity = () => {
    navigation.navigate('Community');
  };

  const goToTravelItinerary = () => {
    navigation.navigate('TravelItinerary');
  };

  const goToMap = () => {
    navigation.navigate('Map');
  };

  const goToPlaceDetail = (id: string) => {
    navigation.navigate('PlaceDetail', {id});
  };
  const insertLineBreak = (text: string, maxChars: number) => {
    const words = text.split(' ');
    let line = '';
    let result = '';

    words.forEach(word => {
      if ((line + word).length > maxChars) {
        result += line.trim() + '\n';
        line = '';
      }
      line += word + ' ';
    });

    result += line.trim();
    return result;
  };

  const recommendData = [
    {
      id: '1',
      title: insertLineBreak('대전에서 놓치지 말아야 할 명소, 지금 확인하세요!', 18),
      image: require('../assets/imgs/museum.png'),
      category: '랜드마크',
    },
    {
      id: '2',
      title: insertLineBreak('대전의 유명 빵집 투어, 맛있는 여정을 떠나보세요!', 15),
      image: require('../assets/imgs/breadFull.png'),
      category: '빵집',
    },
  ];

  const handlePress = (categoryName: string) => {
    navigation.navigate('RecommendedPlace', {category: categoryName});
  };
  const goToChallengeDetail = (id: number) => {
    navigation.navigate('ChallengeDetail', {id});
  };
  const categoryRows = chunkArray<Category>(categories, 5);

  const handlePostPress = (articleId: string) => {
    navigation.navigate('PostDetail', {articleId});
  };

  const checkLoginAndExecute = async (action: () => void) => {
    const {accessToken} = await getTokens();
    if (accessToken) {
      action();
    } else {
      Alert.alert('로그인 필요', '이 기능을 사용하려면 로그인이 필요합니다.', [
        {text: '취소', style: 'cancel'},
        {
          text: '로그인',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <LogoIcon width={50} height={50} />
          <Text style={styles.logoText}>대전왔슈</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={goToLoginOrProfile}>
          {userProfile && userProfile.profileImage ? (
            <Image source={{uri: userProfile.profileImage}} style={styles.profileImage} />
          ) : (
            <LoginIcon width={25} height={25} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchBarContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText} // 검색어 변경 시 자동 호출
          onSearch={handleSearch} // 엔터 키를 눌렀을 때 검색
          onClear={handleClearSearch} // X 버튼 클릭 시 검색어 초기화
        />
      </View>

      {isSearchResultVisible && (
        <View style={styles.searchResultContainer}>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => goToPlaceDetail(item.id)}>
                  <View style={styles.listItem}>
                    <Text style={styles.spotName}>{item.spotName}</Text>
                    <Text style={styles.spotAddress}>{item.spotAddress}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>검색 결과가 없습니다</Text>
            </View>
          )}
        </View>
      )}

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.recommendContainer}>
          <FlatList
            data={recommendData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.recommendItem}
                onPress={() => goToRecommends(item.category)}>
                <Text style={styles.recommendTitle} numberOfLines={2} ellipsizeMode="tail">
                  {item.title}
                </Text>
                <Image source={item.image} style={styles.recommendImage} />
              </TouchableOpacity>
            )}
          />

          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>
              대전 관광지 <Text style={styles.categorySubtitle}>모두 담아놨슈~</Text>
            </Text>
            <TouchableOpacity onPress={goToRecommend}>
              <Text style={styles.categoryMore}>&gt;</Text>
            </TouchableOpacity>
          </View>

          {categoryRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.rowContainer}>
              {row.map((item: Category) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.categoryItem}
                  onPress={() => handlePress(item.name)}>
                  {item.icon}
                  <Text style={styles.categoryName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.challengeContainer}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>코스를 돌며 왔슈몬을 잡는</Text>

            <View style={styles.challengeSubtitleContainer}>
              <Text style={styles.challengeSubtitle}>대전여행코스 챌린지</Text>
              <FlameIcon width={25} height={25} />

              <TouchableOpacity
                onPress={() => checkLoginAndExecute(goToTravelChallenge)}
                style={styles.viewAllContainer}>
                <Text style={styles.viewAllLink}>전체 코스 보기</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <TouchableOpacity onPress={() => checkLoginAndExecute(() => goToChallengeDetail(8))}>
                <ImageBackground source={require('../assets/imgs/noodle.jpg')} style={styles.image}>
                  <View style={styles.overlay}>
                    <Text style={styles.overlayTitle}>누들대전</Text>
                    <Text style={styles.overlayDescription}>
                      2024 누들대전 우수가게들을 만나보세요.
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <View style={styles.imageWrapper}>
              <TouchableOpacity
                onPress={() => checkLoginAndExecute(() => goToChallengeDetail(2))}
                style={styles.imageWrapper}>
                <ImageBackground source={require('../assets/imgs/bread.png')} style={styles.image}>
                  <View style={styles.overlay}>
                    <Text style={styles.overlayTitle}>대전 빵지순례</Text>
                    <Text style={styles.overlayDescription}>대전의 다양한 빵집을 소개합니다</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.scheduleContainer}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.scheduleTitle}>직접 정해보는 대전 여행 일정</Text>
              <CalendarIcon width={24} height={24} />
            </View>
            <View style={styles.imageStyleContainer}>
              <ImageBackground
                source={require('../assets/imgs/Rectangle.png')}
                style={styles.scheduleImageBackground}
                imageStyle={styles.imageStyle}>
                <Text style={styles.scheduleOverlayText}>
                  여행 일정에 맞춰 <Text style={styles.Bolds}>대전</Text>에서 할일을 채워보기
                </Text>
                <TouchableOpacity
                  style={styles.scheduleButton}
                  onPress={() => checkLoginAndExecute(goToTravelItinerary)}>
                  <Text style={styles.scheduleButtonText}>+ 일정 등록하고 대전 관광지 채우기</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        </View>

        <View style={styles.monopolyContainer}>
          <View style={styles.monopolyHeader}>
            <Text style={styles.monopolyTitle}>부루마블로 즐기는</Text>
            <View style={styles.monopolySubtitleContainer}>
              <Text style={styles.monopolySubtitle}>대전 여행</Text>
              <MonopolyIcon width={25} height={25} />
            </View>
          </View>

          <Image
            source={require('../assets/imgs/monopoly.png')}
            style={styles.monopolyImage}
            resizeMode="cover"
          />

          <Text style={styles.monopolyDescription}>2팀의 대결모드도 가능!</Text>
          <TouchableOpacity
            style={styles.monopolyButton}
            onPress={() => checkLoginAndExecute(goToMonopolyPage)}>
            <Text style={styles.monopolyButtonText}>마블와슈 하러가기!</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.containers}>
          {/* 인기 리뷰 섹션 */}
          <View style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewM}>
                <Text style={styles.reviewHeaderTitle}>대전와슈 인기 여행기</Text>
                <FlameIcon width={20} height={20} />
              </View>
              <TouchableOpacity style={styles.communityLink} onPress={goToCommunity}>
                <Text style={styles.communityLinkText}>커뮤니티 보기</Text>
              </TouchableOpacity>
            </View>

            {/* 인기 게시글 목록 */}
            {review.map(item => (
              <View key={item.id} style={styles.reviewCard}>
                <TouchableOpacity
                  onPress={() => checkLoginAndExecute(() => handlePostPress(item.id))}>
                  <View style={styles.userInfo}>
                    <Image source={item.userimg} style={styles.userImage} />
                    <Text style={styles.nickname}>{item.nickname}</Text>
                  </View>
                  <Text style={styles.reviewTitle}>{item.title}</Text>
                  <Text style={styles.reviewText}>{item.context}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F5FB',
  },
  containers: {
    backgroundColor: '#F2F5FB',
    marginBottom: 50,
  },
  contentContainer: {
    paddingHorizontal: width * 0.06,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#418663',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 30,
    color: '#fff',
    marginLeft: 10,
    fontFamily: 'malssami815',
  },
  loginButton: {
    marginRight: 10,
  },
  searchBarContainer: {
    backgroundColor: '#418663',
    paddingVertical: 10,
  },
  recommendContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  recommendItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    width: width * 0.75,
    borderRadius: 8,
  },
  recommendTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  recommendImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.06,
    paddingVertical: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
  },
  categorySubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: '#418663',
    textShadowColor: 'rgba(65, 134, 99, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  categoryMore: {
    fontSize: 24,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    width: width * 0.16,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
  },
  challengeContainer: {
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  challengeHeader: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  challengeTextContainer: {
    flexDirection: 'column',
  },
  challengeTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
  },
  challengeSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeSubtitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginRight: 6,
  },
  viewAllContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  viewAllLink: {
    fontSize: 10,
    color: '#999',
    marginRight: 10,
  },
  imageContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  imageWrapper: {
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 260,
    height: 120,
    justifyContent: 'flex-start',
  },
  overlay: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  overlayTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 5,
  },
  overlayDescription: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  scheduleContainer: {
    marginVertical: 0,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  scheduleTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginRight: 6,
  },
  Bolds: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
  },
  imageStyleContainer: {
    alignSelf: 'center',
  },
  scheduleImageBackground: {
    width: 300,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  imageStyle: {
    borderRadius: 12,
  },
  scheduleOverlayText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Pretendard-Regular',
    marginBottom: 8,
    marginTop: 10,
  },
  scheduleButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#418663',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  scheduleButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'Pretendard-SemiBold',
  },
  monopolyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
    alignItems: 'center',
  },
  monopolyHeader: {
    alignItems: 'flex-start',
    marginBottom: 10,
    width: '100%',
  },
  monopolyTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
  },
  monopolySubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  monopolySubtitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginRight: 6,
  },
  monopolyImage: {
    width: 200,
    height: 200,
  },
  monopolyDescription: {
    fontSize: 16,
    color: '#418663',
    fontFamily: 'Pretendard-Bold',
    marginVertical: 10,
  },
  monopolyButton: {
    backgroundColor: '#418663',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '75%',
  },
  monopolyButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Pretendard-Bold',
  },
  reviewContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  reviewM: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewHeaderTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginRight: 6,
  },
  communityLink: {
    alignItems: 'flex-end',
  },
  communityLinkText: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'Pretendard-Bold',
  },
  reviewCard: {
    padding: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ddd',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  nickname: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333',
  },
  reviewTitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333',
    marginTop: 5,
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'Pretendard-Regular',
  },
  searchResultContainer: {
    position: 'absolute',
    top: 115, // 검색창 아래 위치하도록 적절히 설정
    width: width * 0.75,
    maxHeight: height * 0.5,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: 'center',
    zIndex: 10,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  spotName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  spotAddress: {
    fontSize: 14,
    color: '#555',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Pretendard-Medium',
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

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default MainPage;
