import React from 'react';
import {Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import GroupIcon from '../../assets/imgs/Group.svg';
import FoodIcon from '../../assets/imgs/food.svg';
import HomeIcon from '../../assets/imgs/home.svg';
import SportIcon from '../../assets/imgs/sport.svg';
import ArtIcon from '../../assets/imgs/art.svg';
import ScienceIcon from '../../assets/imgs/sei.svg';
import BreadIcon from '../../assets/imgs/mainbread.svg';

const categories = [
  {id: '1', name: '전체', icon: <GroupIcon width={30} height={30} />},
  {id: '2', name: '음식', icon: <FoodIcon width={30} height={30} />},
  {id: '3', name: '자연', icon: <HomeIcon width={30} height={30} />},
  {
    id: '4',
    name: '역사',
    icon: (
      <Image
        source={require('../../assets/imgs/categoryicon/free-icon-history-1373354.png')}
        style={{width: 30, height: 30}}
      />
    ),
  },
  {
    id: '5',
    name: '문화',
    icon: (
      <Image
        source={require('../../assets/imgs/categoryicon/free-icon-culture-9531233.png')}
        style={{width: 30, height: 30}}
      />
    ),
  },
  {id: '6', name: '과학', icon: <ScienceIcon width={30} height={30} />},
  {id: '7', name: '교육', icon: <ArtIcon width={30} height={30} />},
  {
    id: '8',
    name: '가족',
    icon: (
      <Image
        source={require('../../assets/imgs/categoryicon/free-icon-family-3884999.png')}
        style={{width: 30, height: 30}}
      />
    ),
  },
  {id: '9', name: '빵집', icon: <BreadIcon width={30} height={30} />},
  {id: '10', name: '스포츠', icon: <SportIcon width={30} height={30} />},
  {
    id: '11',
    name: '랜드마크',
    icon: (
      <Image
        source={require('../../assets/imgs/categoryicon/free-icon-landmark-navigation-16996099.png')}
        style={{width: 30, height: 30}}
      />
    ),
  },
];

interface CategoryListProps {
  onSelectCategory: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({onSelectCategory}) => {
  const handlePress = (categoryName: string) => {
    console.log(`Selected Category: ${categoryName}`); // 디버깅 로그
    onSelectCategory(categoryName || '카테고리 없음');
  };

  return (
    <FlatList
      data={categories}
      horizontal
      renderItem={({item}) => (
        <TouchableOpacity onPress={() => handlePress(item.name)} style={styles.categoryItem}>
          {item.icon}
          <Text style={styles.categoryText}>{item.name || '카테고리 없음'}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 10,
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },
});

export default CategoryList;
