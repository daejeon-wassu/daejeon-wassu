import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ImageBackground,
} from 'react-native';
import RecommendedSearchBar from './RecommendedSearchBar';
import CategoryList from './CategoryList';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import Header from '../common/Header';
import MarkerIcon from '../../assets/imgs/marker.svg';
import {getTouristSpotsByCategorys} from '../../api/tourist';
import {TouristSpot} from '../../types';
import {getSpots} from '../../api/itinerary';

const {width, height} = Dimensions.get('window');

type PlaceListNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceDetail'>;

type RouteParams = {
  PlaceList: {
    category: string;
  };
};

interface TouristSpots {
  id: string;
  image: {uri: string} | number;
  area: string;
  address: string;
  name: string;
}

const PlaceList: React.FC = () => {
  const navigation = useNavigation<PlaceListNavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'PlaceList'>>();
  const initialCategory = route.params?.category || '전체';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [places, setPlaces] = useState<TouristSpot[]>([]);
  const [page, setPage] = useState(0); // 현재 페이지
  const [isFetching, setIsFetching] = useState(false); // 데이터 로딩 여부
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TouristSpot[]>([]);
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);

  // 데이터 요청 함수
  const fetchPlacesByCategory = async (category: string, pageNum: number) => {
    try {
      setIsFetching(true); // 로딩 상태 표시
      const response = await getTouristSpotsByCategorys(category === '전체' ? '' : category);

      if (response) {
        const newPlaces = response.map((item: any) => ({
          id: item.id,
          image:
            item.image && item.image !== null
              ? {uri: item.image}
              : require('../../assets/imgs/hanbat.png'),
          area: item.spotAddress.split(' ')[1],
          address: item.spotAddress,
          name: item.spotName,
        }));

        setPlaces(prevPlaces => (pageNum === 0 ? newPlaces : [...prevPlaces, ...newPlaces]));
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setPage(0); // 페이지 초기화
    fetchPlacesByCategory(selectedCategory, 0);
  }, [selectedCategory]);

  const loadMorePlaces = () => {
    if (!isFetching) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPlacesByCategory(selectedCategory, nextPage);
    }
  };

  const goToPlaceDetail = (id: string) => {
    navigation.navigate('PlaceDetail', {id});
  };

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

  const renderPlaceItem = ({item}: {item: TouristSpot}) => (
    <TouchableOpacity onPress={() => goToPlaceDetail(item.id)}>
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <ImageBackground source={item.image} style={styles.image}>
            <View style={styles.overlay}>
              <View style={styles.leftOverlay}>
                <MarkerIcon width={20} height={20} />
                <Text style={styles.areaText}>{item.area}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <Text style={styles.addressText}>{item.address}</Text>
        <Text style={styles.nameText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        <View style={styles.search}>
          <RecommendedSearchBar
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

        <View style={styles.categoryIcon}>
          <CategoryList onSelectCategory={setSelectedCategory} />
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{selectedCategory} 관광지</Text>
          </View>
          <FlatList
            data={places}
            renderItem={renderPlaceItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            onEndReached={loadMorePlaces} // 끝에 도달했을 때 호출
            onEndReachedThreshold={0.5} // 리스트 끝에서 50% 지점에서 호출
            initialNumToRender={10} // 처음에 렌더링할 아이템 수
            ListFooterComponent={
              isFetching ? <Text style={styles.loadingText}>Loading...</Text> : null
            }
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#fff',
  },
  search: {
    marginVertical: 20,
  },
  categoryIcon: {
    marginBottom: 20,
  },
  cardSection: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardHeaderText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    paddingLeft: 10,
  },
  cardContainer: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  imageWrapper: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  leftOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  areaText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    marginLeft: 5,
  },
  addressText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Pretendard-Medium',
  },
  nameText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
  },
  searchResultContainer: {
    position: 'absolute',
    top: 70, // 검색창 아래 위치하도록 적절히 설정
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
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default PlaceList;
