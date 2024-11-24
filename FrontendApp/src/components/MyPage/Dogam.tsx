import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getUserWassumon} from '../../api/recommended';

const {width} = Dimensions.get('window');

interface Wassumon {
  spot_id: number;
  wassumon_name: string;
  wassumon_image: string;
}

const Dogam = () => {
  const [wassumons, setWassumons] = useState<Wassumon[]>([]);

  useEffect(() => {
    const fetchWassumons = async () => {
      const data = await getUserWassumon();
      if (data) {
        setWassumons(data.collected_wassumons || []); // 빈 배열로 설정
      }
    };
    fetchWassumons();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 도감</Text>
      <View style={styles.divider} />
      <LinearGradient
        colors={['#C8DECB', '#418663']}
        style={styles.gradientContainer}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        {wassumons.length === 0 ? (
          <Text style={styles.noItemsText}>도감에 등록된 왔슈몬이 없습니다.</Text>
        ) : (
          wassumons.map((wassumon, index) => (
            <View key={wassumon.spot_id} style={styles.monItem}>
              <Image
                source={{uri: wassumon.wassumon_image}}
                style={styles.monIcon}
                resizeMode="contain"
              />
              <Text style={styles.monText}>{wassumon.wassumon_name}</Text>
            </View>
          ))
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333',
    marginTop: 20,
    marginBottom: 20,
  },
  divider: {
    height: 2,
    backgroundColor: '#418663',
  },
  gradientContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15, // 좌우 여백 추가
    paddingVertical: 20, // 상하 여백 추가
  },
  monItem: {
    alignItems: 'center',
    width: '30%', // 한 줄에 3개 배치
    marginBottom: 20,
  },
  monIcon: {
    width: 75,
    height: 75,
  },
  monText: {
    fontSize: 16,
    color: '#418663',
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
    marginTop: 5,
  },
  noItemsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Dogam;
