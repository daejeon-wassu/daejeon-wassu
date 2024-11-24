import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import HeartIcon from '../assets/imgs/heart.svg';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';
import {filterPosts, toggleLike} from '../api/community'; // toggleLike 함수 추가
import userPlaceholder from '../assets/imgs/user.png';
import {getTokens} from '../utills/tokenStorage';

const {width} = Dimensions.get('window');

type CommunityNavigationProp = StackNavigationProp<RootStackParamList>;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}.${month}.${day} ${hours}시 ${minutes}분`;
};

const Community = () => {
  const navigation = useNavigation<CommunityNavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [likedPosts, setLikedPosts] = useState<{[key: string]: boolean}>({});
  const [likesCount, setLikesCount] = useState<{[key: string]: number}>({});
  const [currentPages, setCurrentPages] = useState<{[key: string]: number}>({});
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const goToWriting = () => {
    navigation.navigate('Writing');
  };

  const goToCommunitySearch = () => {
    navigation.navigate('CommunitySearch');
  };

  const categories = ['전체', '맛집', '숙소', '우천', '스포츠', '예술', '빵', '역사', '과학'];

  const fetchPosts = async (category: string) => {
    setLoading(true);
    try {
      const response = await filterPosts(category === '전체' ? '' : category);
      if (response) {
        setPosts(response.content);
        const initialLikes = response.content.reduce((acc: any, post: any) => {
          acc[post.id] = post.userLiked;
          return acc;
        }, {});
        const initialLikesCount = response.content.reduce((acc: any, post: any) => {
          acc[post.id] = post.liked;
          return acc;
        }, {});
        setLikesCount(initialLikesCount);
        setLikedPosts(initialLikes);
      }
    } catch (error) {
      console.error('게시글 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(selectedCategory);
  }, [selectedCategory]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts(selectedCategory);
    }, [selectedCategory]),
  );

  const handleToggleLike = async (postId: string) => {
    const isLiked = likedPosts[postId];

    try {
      const updatedData = await toggleLike(postId, isLiked);
      if (updatedData) {
        setLikedPosts(prevLikedPosts => ({
          ...prevLikedPosts,
          [postId]: !isLiked,
        }));

        setLikesCount(prevLikesCount => ({
          ...prevLikesCount,
          [postId]: isLiked ? prevLikesCount[postId] - 1 : prevLikesCount[postId] + 1,
        }));
      }
    } catch (error) {
      console.error(`좋아요 처리 실패 (게시물 ID: ${postId}):`, error);
    }
  };

  const handleNextImage = (postId: string, imagesLength: number) => {
    setCurrentPages(prevPages => {
      const nextPage = (prevPages[postId] || 0) + 1;
      return {...prevPages, [postId]: nextPage < imagesLength ? nextPage : 0};
    });
  };

  const handlePreviousImage = (postId: string, imagesLength: number) => {
    setCurrentPages(prevPages => {
      const prevPage = (prevPages[postId] || 0) - 1;
      return {...prevPages, [postId]: prevPage >= 0 ? prevPage : imagesLength - 1};
    });
  };

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>여행기</Text>
        <TouchableOpacity onPress={goToCommunitySearch} style={styles.searchButton}>
          <Image source={require('../assets/imgs/search.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={{paddingHorizontal: 10, backgroundColor: '#FFFFFF'}}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonSelected,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.categoryDivider} />

      {loading ? (
        <ActivityIndicator size="large" color="#418663" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <View
              style={[
                styles.postContainer,
                index === posts.length - 1 && styles.lastPostContainer, // 마지막 요소에만 추가 스타일
              ]}>
              <TouchableOpacity
                onPress={() => checkLoginAndExecute(() => handlePostPress(item.id))}>
                <View style={styles.postHeader}>
                  <Image
                    source={
                      item.profileImage === 'default' ? userPlaceholder : {uri: item.profileImage}
                    }
                    style={styles.profileImage}
                  />
                  <Text style={styles.nickname}>{item.nickName || '익명'}</Text>
                </View>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postContent}>{item.content}</Text>

                {item.images && item.images.length > 0 ? (
                  <View style={styles.carouselContainer}>
                    <TouchableOpacity
                      onPress={() => handlePreviousImage(item.id, item.images.length)}
                      style={styles.arrowButton}>
                      <Image
                        source={require('../assets/imgs/chevron-left.png')}
                        style={styles.arrowIcon}
                      />
                    </TouchableOpacity>
                    <Image
                      source={{uri: item.images[currentPages[item.id] || 0]?.url}}
                      style={styles.carouselImage}
                    />
                    <TouchableOpacity
                      onPress={() => handleNextImage(item.id, item.images.length)}
                      style={styles.arrowButton}>
                      <Image
                        source={require('../assets/imgs/chevron-right.png')}
                        style={styles.arrowIcon}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}

                <View style={styles.postDetails}>
                  <Text style={styles.location}>{item.location}</Text>
                  <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
                </View>

                <View style={styles.paginationContainer}>
                  {item.images &&
                    item.images.map((_: any, index: React.Key | null | undefined) => (
                      <View
                        key={index}
                        style={[
                          styles.paginationDot,
                          (currentPages[item.id] || 0) === index && styles.paginationDotActive,
                        ]}
                      />
                    ))}
                </View>

                <View style={styles.likeContainer}>
                  <Text style={styles.likes}>좋아요 {likesCount[item.id]}</Text>
                  <TouchableOpacity onPress={() => handleToggleLike(item.id)}>
                    {likedPosts[item.id] ? (
                      <Image
                        source={require('../assets/imgs/heart1.png')}
                        style={{width: 20, height: 20}}
                      />
                    ) : (
                      <HeartIcon width={20} height={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => checkLoginAndExecute(goToWriting)}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
  },
  searchButton: {
    position: 'absolute',
    right: 25,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  categoryContainer: {
    marginTop: 30,
    height: 50,
  },
  categoryButton: {
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 35,
    justifyContent: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#418663',
  },
  categoryText: {
    fontSize: 14,
    color: '#333333',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  categoryDivider: {
    borderBottomWidth: 5,
    borderBottomColor: '#E8E8E8',
  },
  postContainer: {
    paddingHorizontal: width * 0.06,
    borderBottomWidth: 5,
    borderBottomColor: '#E8E8E8',
    paddingVertical: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postTitle: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333333',
  },
  postContent: {
    fontSize: 14,
    color: '#666666',
  },
  postDetails: {
    flexDirection: 'row',
    marginTop: 5,
  },
  location: {
    fontSize: 12,
    color: '#999999',
  },
  time: {
    fontSize: 12,

    color: '#999999',
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  carouselImage: {
    width: width * 0.7,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  arrowButton: {
    padding: 10,
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#418663',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likes: {
    fontSize: 14,
    marginRight: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#418663',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  lastPostContainer: {
    marginBottom: 50, // 마지막 요소에만 추가 여백
  },
});

export default Community;
