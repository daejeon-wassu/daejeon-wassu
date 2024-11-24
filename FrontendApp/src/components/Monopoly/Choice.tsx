import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Alert,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import SearchIcon from '../../assets/imgs/search.svg';
import {postMarble, postCustomMarble} from '../../api/mono';
import {getSpots} from '../../api/itinerary';

type ChoiceNavigationProp = StackNavigationProp<RootStackParamList>;
type ChoiceRouteProp = RouteProp<RootStackParamList, 'Choice'>;

const Choice = () => {
  const route = useRoute<ChoiceRouteProp>();
  const {single} = route.params || {};
  const navigation = useNavigation<ChoiceNavigationProp>();
  const {width, height} = useWindowDimensions();
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [searchResults, setSearchResults] = useState<
    {id: string; name: string; lat: number; lon: number}[]
  >([]);
  const [searchTarget, setSearchTarget] = useState<'departure' | 'arrival'>();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [preference, setPreference] = useState('');
  const [departureCoords, setDepartureCoords] = useState<{lat: number | null; lon: number | null}>({
    lat: null,
    lon: null,
  });
  const [arrivalCoords, setArrivalCoords] = useState<{lat: number | null; lon: number | null}>({
    lat: null,
    lon: null,
  });

  useEffect(() => {
    Orientation.lockToLandscapeLeft();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const handleCreateCustomBoard = async () => {
    if (
      !preference ||
      !departureCoords.lat ||
      !departureCoords.lon ||
      !arrivalCoords.lat ||
      !arrivalCoords.lon
    ) {
      Alert.alert('오류', '모든 필드를 채워주세요.');
      return;
    }
    try {
      const response = await postCustomMarble(
        preference,
        departureCoords.lat,
        departureCoords.lon,
        arrivalCoords.lat,
        arrivalCoords.lon,
        single,
      );
      if (response && response.roomId) {
        const roomId = response.roomId;
        navigation.navigate('GameOne', {roomId: roomId});
      } else {
        Alert.alert('실패', '보드 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('보드 생성 중 에러:', error);
    }
  };

  const handleThemeBoardSelection = async (marbled: number) => {
    try {
      const response = await postMarble(marbled.toString(), single);
      if (response && response.roomId) {
        const roomId = response.roomId;
        navigation.navigate('GameOne', {roomId});
      } else {
        Alert.alert('실패', '보드 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('보드 생성 중 에러:', error);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const results = await getSpots(query);
      if (results) {
        setSearchResults(
          results.map(item => ({
            id: item.id,
            name: item.spotName,
            lat: item.latitude,
            lon: item.longitude,
          })),
        );
        setIsSearchVisible(true);
      }
    } catch (error) {
      console.error('검색 오류:', error);
    }
  };

  const handleSelect = (item: {id: string; name: string; lat: number; lon: number}) => {
    if (searchTarget === 'departure') {
      setDeparture(item.name);
      setDepartureCoords({lat: item.lat, lon: item.lon});
    } else if (searchTarget === 'arrival') {
      setArrival(item.name);
      setArrivalCoords({lat: item.lat, lon: item.lon});
    }
    setIsSearchVisible(false); // 검색 결과 숨기기
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      fontFamily: 'Pretendard-Bold',
      color: '#333',
      position: 'absolute',
      top: 10,
      textAlign: 'center',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '70%',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      width: width * 0.25,
      height: height * 0.55,
      padding: 10,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'Pretendard-Bold',
      marginBottom: 20,
      color: '#333',
    },
    button: {
      backgroundColor: '#E0F2E0',
      borderColor: '#418663',
      borderWidth: 1.5,
      width: '80%',
      paddingVertical: 8,
      borderRadius: 25,
      marginBottom: 15,
      alignItems: 'center',
    },
    buttonText: {
      color: '#333333',
      fontSize: 14,
      fontFamily: 'Pretendard-Medium',
    },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
      marginBottom: 15,
    },
    label: {
      fontSize: 13,
      color: '#333',
      marginRight: 10,
      fontFamily: 'Pretendard-Medium',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#E0F2E0',
      borderColor: '#418663',
      borderWidth: 0.5,
      borderRadius: 25,
      paddingHorizontal: 10,
      height: 35,
    },
    input: {
      flex: 1,
      fontSize: 10,
      color: '#333',
      fontFamily: 'Pretendard-Light',
    },
    icon: {
      marginLeft: 5,
    },
    createButton: {
      backgroundColor: '#418663',
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 25,
      marginTop: 10,
    },
    createButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Pretendard-Bold',
    },
    searchResultContainer: {
      position: 'absolute',
      top: height * 0.26,
      left: width * 0.09,
      width: '60%',
      maxHeight: height * 0.4,
      backgroundColor: '#fff',
      borderRadius: 10,
      elevation: 5,
      padding: 10,
      shadowColor: '#333',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      zIndex: 10,
    },
    searchResultContainere: {
      position: 'absolute',
      top: height * 0.38,
      left: width * 0.042,
      maxHeight: height * 0.4,
      width: '60%',
      backgroundColor: '#fff',
      borderRadius: 10,
      elevation: 5,
      padding: 10,
      shadowColor: '#333',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      zIndex: 10,
      marginLeft: width * 0.05,
    },
    listItem: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    listItemText: {
      fontSize: 14,
      color: '#333',
    },
    clearText: {
      fontSize: 10,
      color: '#888',
      marginLeft: 5,
      fontFamily: 'Pretendard-Light',
    },
    inputs: {
      fontSize: 12,
      color: '#333',
      marginVertical: -15,
      alignItems: 'center',
      alignSelf: 'center',
      fontFamily: 'Pretendard-SemiBold',
    },
  });

  return (
    <ImageBackground
      source={require('../../assets/imgs/mono/DBack.jpg')}
      style={styles.background}
      resizeMode="cover">
      <Text style={styles.title}>게임 만들기</Text>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>테마 보드</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleThemeBoardSelection(1)}>
            <Text style={styles.buttonText}>빵집</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleThemeBoardSelection(8)}>
            <Text style={styles.buttonText}>맛집</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleThemeBoardSelection(10)}>
            <Text style={styles.buttonText}>과학</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>맞춤 보드</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>출발지</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={departure}
                onChangeText={text => {
                  setSearchTarget('departure');
                  setDeparture(text);
                  handleSearch(text);
                }}
              />
              {/* 검색 결과가 없을 때만 SearchIcon을 표시 */}
              {!isSearchVisible && !departure && <SearchIcon width={20} height={20} />}
            </View>
          </View>

          {/* 출발지 검색 결과 */}
          {isSearchVisible && searchTarget === 'departure' && (
            <View style={styles.searchResultContainer}>
              <FlatList
                data={searchResults}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => handleSelect(item)}>
                    <View style={styles.listItem}>
                      <Text style={styles.listItemText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>도착지</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={arrival}
                onChangeText={text => {
                  setSearchTarget('arrival');
                  setArrival(text);
                  handleSearch(text);
                }}
              />
              {/* 검색 결과가 없을 때만 SearchIcon을 표시 */}
              {!isSearchVisible && !arrival && <SearchIcon width={20} height={20} />}
            </View>
          </View>

          {/* 도착지 검색 결과 */}
          {isSearchVisible && searchTarget === 'arrival' && (
            <View style={styles.searchResultContainere}>
              <FlatList
                data={searchResults}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => handleSelect(item)}>
                    <View style={styles.listItem}>
                      <Text style={styles.listItemText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <TextInput
            style={[styles.inputs, {textAlign: 'center'}]}
            placeholder="선호하는 장소 태마 입력"
            value={preference}
            onChangeText={setPreference}
          />

          <TouchableOpacity style={styles.createButton} onPress={handleCreateCustomBoard}>
            <Text style={styles.createButtonText}>생성하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Choice;
