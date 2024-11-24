import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import CategoryList from '../../components/RecommendedPlace/CategoryList';
import {getTouristStamps} from '../../api/tourist';

type DaejeonStampNavigationProp = StackNavigationProp<RootStackParamList, 'RecommendedPlace'>;
const {width} = Dimensions.get('window');

// 이미지 맵
const categoryImages: {[key: string]: any} = {
  음식: require('../../assets/imgs/stamp/food.png'),
  자연: require('../../assets/imgs/stamp/nature.png'),
  역사: require('../../assets/imgs/stamp/history.png'),
  문화: require('../../assets/imgs/stamp/culture.png'),
  과학: require('../../assets/imgs/stamp/science.png'),
  교육: require('../../assets/imgs/stamp/education.png'),
  가족: require('../../assets/imgs/stamp/family.png'),
  빵집: require('../../assets/imgs/stamp/bakery.png'),
  스포츠: require('../../assets/imgs/stamp/sport.png'),
  랜드마크: require('../../assets/imgs/stamp/landmark.png'),
};

const DaejeonStamp = () => {
  const navigation = useNavigation<DaejeonStampNavigationProp>();
  const [stamps, setStamps] = useState<{id: string; name: string; image: any}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // 카테고리 선택 시 실행될 함수
  const handleSelectCategory = async (categoryName: string) => {
    setSelectedCategory(categoryName);
    try {
      // 카테고리가 "전체"인 경우 빈값으로 요청
      const response = await getTouristStamps();
      if (response) {
        const filteredStamps = response
          .filter(stamp => categoryName === '전체' || stamp.category === categoryName)
          .map((stamp, index) => ({
            id: (index + 1).toString(),
            name: stamp.spotName,
            image: categoryImages[stamp.category] || null,
          }));
        setStamps(filteredStamps);
      }
    } catch (error) {
      console.error('Error fetching stamps:', error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 전체 스탬프 가져오기
  useEffect(() => {
    handleSelectCategory('전체');
  }, []);

  const handleNavigateToRecommended = () => {
    navigation.navigate('RecommendedPlace', {});
  };

  return (
    <View style={styles.container}>
      {/* 일정 추가하기 버튼 */}
      <TouchableOpacity style={styles.addButton} onPress={handleNavigateToRecommended}>
        <Image source={require('../../assets/imgs/enter.png')} style={styles.plusIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.addButtonText}>다른 관광지 찾아보기</Text>
          <Text style={styles.addButtonSubtitle}>다른 관광지에 또 방문해 스탬프를 찍어보세요</Text>
        </View>
      </TouchableOpacity>
      {/* 대전 관광지 스탬프 타이틀과 필터 텍스트 */}
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>대전 관광지 스탬프</Text>
        <Text style={styles.filterText}>모두</Text>
        <Text style={styles.filterTextHighlight}>찍어보슈</Text>
      </View>
      {/* 가로 스크롤이 가능한 CategoryList */}
      <View style={styles.categoryIcon}>
        <CategoryList onSelectCategory={handleSelectCategory} />
      </View>
      <View>
        <Text style={styles.stampTitle}>{selectedCategory} 스탬프</Text>
      </View>

      {/* 도장 리스트 */}
      <FlatList
        data={stamps}
        keyExtractor={item => item.id}
        numColumns={3} // 한 줄에 3개씩 배치
        renderItem={({item}) => (
          <View style={styles.stampContainer}>
            <Image source={item.image} style={styles.stampImage} />
            <Text style={styles.stampName}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.stampList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
    marginVertical: 10,
  },
  mainTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#333333',
    marginRight: 10, // 제목과 필터 텍스트 간격
  },
  stampTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
    marginVertical: 10,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
    marginRight: 5,
    marginTop: 5,
    textShadowColor: '#5ECB8A', // 그림자 색상
    textShadowOffset: {width: 0, height: 4}, // 그림자 오프셋 (x, y)
    textShadowRadius: 4,
  },
  filterTextHighlight: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#333333',
    marginTop: 7,
    textShadowColor: '#5ECB8A', // 그림자 색상
    textShadowOffset: {width: 0, height: 4}, // 그림자 오프셋 (x, y)
    textShadowRadius: 4,
  },
  categoryIcon: {
    marginBottom: 20,
    marginTop: 5,
    alignItems: 'center',
  },
  stampList: {
    alignItems: 'flex-start', // 왼쪽 정렬
    justifyContent: 'flex-start', // 위쪽 정렬
    paddingHorizontal: 10,
  },
  stampContainer: {
    width: 100,
    alignItems: 'center',
    marginRight: 10,
  },
  stampImage: {
    width: 75,
    height: 75,
  },
  stampName: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default DaejeonStamp;
