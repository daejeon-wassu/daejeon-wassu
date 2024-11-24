import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {searchPosts} from '../../api/community';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import {getTokens} from '../../utills/tokenStorage';

const {width} = Dimensions.get('window');

type CommunitySearchNavigationProp = StackNavigationProp<RootStackParamList>;

const CommunitySearch = () => {
  const navigation = useNavigation<CommunitySearchNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    const result = await searchPosts(searchText);
    if (result && result.content) {
      setSearchResults(result.content);
    } else {
      setSearchResults([]);
    }
    setLoading(false);
  }, [searchText]);

  useEffect(() => {
    if (searchText.length > 0) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchText, handleSearch]);

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
      <View style={styles.searchBar}>
        <Image source={require('../../assets/imgs/search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="커뮤니티 내에서 검색"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#418663" />}

      <FlatList
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => checkLoginAndExecute(() => handlePostPress(item.articleId ?? item.id))}>
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultLocation}>{item.location || '위치 정보 없음'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>결과가 없습니다</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F7FB',
    borderRadius: 10,
    padding: 10,
    marginVertical: 15,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resultItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultLocation: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default CommunitySearch;
