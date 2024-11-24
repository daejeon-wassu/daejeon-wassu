import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  FlatList,
} from 'react-native';
import RecommendedSearchBar from '../components/RecommendedPlace/RecommendedSearchBar';
import CategoryList from '../components/RecommendedPlace/CategoryList';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';
import Header from '../components/common/Header';
import MarkerIcon from '../assets/imgs/marker.svg';
import {getTouristSpotsByCategory} from '../api/tourist';
import {getSpots} from '../api/itinerary';
import {TouristSpot} from '../types';

const {width, height} = Dimensions.get('window');

type RecommendedPlaceNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceList'>;

type RouteParams = {
  RecommendedPlace: {
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

const RecommendedPlace = () => {
  const navigation = useNavigation<RecommendedPlaceNavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'RecommendedPlace'>>();
  const initialCategory = route.params?.category || '전체';
  const [places, setPlaces] = useState<TouristSpots[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TouristSpot[]>([]);
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);

  // 데이터 요청 함수
  const fetchPlacesByCategory = async (category: string) => {
    try {
      const response = await getTouristSpotsByCategory(category === '전체' ? '' : category);

      if (response) {
        const formattedPlaces: TouristSpots[] = response.map((item: any) => ({
          id: item.id,
          image:
            item.image && item.image !== null
              ? {uri: item.image}
              : require('../assets/imgs/hanbat.png'),
          area: item.spotAddress.split(' ')[1],
          address: item.spotAddress,
          name: item.spotName,
        }));
        setPlaces(formattedPlaces);
      } else {
        console.error('Failed to fetch places - Response is null or undefined');
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  useEffect(() => {
    fetchPlacesByCategory(selectedCategory);
  }, [selectedCategory]);

  const goToPlaceList = () => {
    navigation.navigate('PlaceList', {category: selectedCategory});
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

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
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

        <View style={styles.cardSection}>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>{selectedCategory} 관광지</Text>
              <TouchableOpacity onPress={goToPlaceList}>
                <Text style={styles.cardHeaderButton}>전체 보기 &gt;</Text>
              </TouchableOpacity>
            </View>

            <ScrollView nestedScrollEnabled={true}>
              {places.map(item => (
                <TouchableOpacity key={item.id} onPress={() => goToPlaceDetail(item.id)}>
                  <View key={item.id} style={styles.card}>
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
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
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
    alignItems: 'center',
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
  cardHeaderButton: {
    fontSize: 10,
    color: 'rgba(153, 153, 153, 0.5)',
    fontFamily: 'Pretendard-Regular',
    paddingRight: 10,
  },
  cardContainer: {
    maxHeight: 600,
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
  tagsText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Pretendard-Medium',
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
});

export default RecommendedPlace;
