import React from 'react';
import {View, TextInput, StyleSheet, Dimensions, TouchableOpacity, Text} from 'react-native';
import SearchIcon from '../../assets/imgs/search.svg';

const {width} = Dimensions.get('window');

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

const SearchBar = ({value, onChangeText, onSearch, onClear}: SearchBarProps) => {
  return (
    <View style={styles.centerContainer}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          maxLength={100}
          placeholder="대전 관광지를 검색해보세요"
          value={value} // value 설정
          onChangeText={onChangeText} // onChangeText 호출
          onSubmitEditing={onSearch} // 엔터 누르면 검색
        />
        {value ? (
          <TouchableOpacity onPress={onClear}>
            <Text>X</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onSearch}>
            <SearchIcon width={20} height={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(153, 153, 153, 0.5)',
    width: width * 0.75,
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    color: '#333',
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
  },
});

export default SearchBar;
