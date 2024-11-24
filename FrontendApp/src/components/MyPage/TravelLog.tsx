import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions} from 'react-native';
import {getUserArticles} from '../../api/mypage';
import type {UserArticle} from '../../api/mypage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

const {width} = Dimensions.get('window');

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

type TravelLogNavigationProp = StackNavigationProp<RootStackParamList, 'PostDetail'>;

const TravelLog = () => {
  const navigation = useNavigation<TravelLogNavigationProp>();
  const [articles, setArticles] = useState<UserArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPages, setCurrentPages] = useState<{[key: string]: number}>({});

  useFocusEffect(
    React.useCallback(() => {
      const fetchArticles = async () => {
        setLoading(true);
        const fetchedArticles = await getUserArticles();
        if (fetchedArticles) {
          setArticles(fetchedArticles);
        }
        setLoading(false);
      };

      fetchArticles();
    }, []),
  );

  const handleNextImage = (articleId: string, imagesLength: number) => {
    setCurrentPages(prevPages => {
      const nextPage = (prevPages[articleId] || 0) + 1;
      return {...prevPages, [articleId]: nextPage < imagesLength ? nextPage : 0};
    });
  };

  const handlePreviousImage = (articleId: string, imagesLength: number) => {
    setCurrentPages(prevPages => {
      const prevPage = (prevPages[articleId] || 0) - 1;
      return {...prevPages, [articleId]: prevPage >= 0 ? prevPage : imagesLength - 1};
    });
  };

  const handlePostPress = (articleId: string) => {
    navigation.navigate('PostDetail', {articleId});
  };
  const handleNavigateToRecommended = () => {
    navigation.navigate('Community');
  };
  const renderArticle = ({item}: {item: UserArticle}) => (
    <View style={styles.articleCard}>
      <TouchableOpacity onPress={() => handlePostPress(item.id)}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleContent} numberOfLines={2}>
          {item.content}
        </Text>
      </TouchableOpacity>

      {item.images && item.images.length > 0 && (
        <View style={styles.carouselContainer}>
          <TouchableOpacity
            onPress={() => handlePreviousImage(item.id, item.images.length)}
            style={styles.arrowButton}>
            <Image
              source={require('../../assets/imgs/chevron-left.png')}
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
              source={require('../../assets/imgs/chevron-right.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.articleInfo}>
        <Text style={styles.articleDate}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.articleTag}>{item.tags.length > 0 ? `#${item.tags[0].tag}` : ''}</Text>
      </View>
      {/* <Text style={styles.articleLikes}>좋아요 {item.liked}개</Text> */}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleNavigateToRecommended}>
        <Image source={require('../../assets/imgs/travel.png')} style={styles.plusIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.addButtonText}>다른 여행기 보러가기</Text>
          <Text style={styles.addButtonSubtitle}>다른 사람의 여행기도 구경해보세요.</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>작성한 여행기</Text>
      {articles.length > 0 ? (
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noArticlesText}>작성한 여행기가 없습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 20,
  },
  articleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // 유리 느낌을 위한 옅은 테두리
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // Android 그림자 효과
  },
  articleTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Pretendard-Bold',
  },
  articleContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  carouselImage: {
    width: width * 0.7,
    height: 200,
    borderRadius: 10,
  },
  arrowButton: {
    padding: 10,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  articleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  articleDate: {
    fontSize: 12,
    color: '#999',
  },
  articleTag: {
    fontSize: 12,
    color: '#418663',
  },
  articleLikes: {
    fontSize: 14,
    color: '#333',
  },
  noArticlesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
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
    color: 'rgba(51, 51, 51, 0.8)',
    marginTop: 5,
  },
});

export default TravelLog;
