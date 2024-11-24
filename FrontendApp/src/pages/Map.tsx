// 현수야 안녕 ?
// 1. 입장하면 자동으로 연결됨.
// 2. axios 요청을 보내면 해당 요청으로 인한 response 값은 sse.addEventListener('message') 해당 코드에서 출력된다.
//    위 코드 단락에서 상태를 갱신하는 방향으로 활용하면 된다.
// 3. 받게 될 데이터에 대한 타입설정해서 유연하게 활용하자.

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {getTokens} from '../utills/tokenStorage';
import SSE from 'react-native-sse';
import axios from 'axios';

interface EventData {
  user1Email: string;
  user1Data: number;
  user2Email: string;
  user2Data: number;
}

const RoomScreen = () => {
  // 내가 어떤 요청을 보냈을 때, eventlistner로 값을 갱신해줄 상태
  // 필요한건 만들면서 사용하자.
  const [event1, setEvent] = useState<EventData | null>(null);

  // 마운트 됐을 때 연결을 시작한다
  useEffect(() => {
    const fetchTokenAndConnect = async () => {
      try {
        const {accessToken} = await getTokens();
        if (!accessToken) {
          return;
        }
        // SSE 연결
        const sse = new SSE('https://k11b105.p.ssafy.io/wassu/tourist/test/1', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // 연결 성공 시
        sse.addEventListener('open', () => {});
        // 본인, 혹은 타인에 의해 변화가 발생하면 실시간으로 값을 반환하는 코드
        // 예를 들어서, 상대방이 주사위를 굴리면 해당 값을 event1.data로 받아올 수 있다.
        sse.addEventListener('message', (event: any) => {
          if (event.data !== 'keep-alive') {
            // 데이터를 json 형식으로 바꿔주고
            const parsedData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            // 위에서 만든 상태를 해당 값으로 갱신해준다.
            setEvent(parsedData);
          }
        });

        sse.addEventListener('error', (error: any) => {
          console.error('SSE 연결 에러:', error);
        });

        return () => {
          sse.close();
        };
      } catch (error) {
        console.error('SSE 연결 중 오류 발생:', error);
      }
    };
    fetchTokenAndConnect();
  }, []);

  // 데이터 전송 핸들러 (예. 주사위 굴리기 axios)
  const sendMessage = async () => {
    const {accessToken} = await getTokens(); // 토큰 가져오기
    try {
      const response = await axios.get(`https://k11b105.p.ssafy.io/wassu/tourist/send/1`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 헤더에 accessToken 추가
        },
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    // 여기서는 그냥 코드 작성하면 된다.
    <View style={styles.container}>
      <Text style={styles.title}>Room ID: 1</Text>
      <Text style={styles.title}>user 1: {event1?.user1Email || 'No Data'}</Text>
      <Text style={styles.title}>user 2: {event1?.user2Email || 'No Data'}</Text>
      <Text style={styles.subtitle}>Events: {event1?.user1Data ?? 'No Data'}</Text>
      <Text style={styles.subtitle}>Events: {event1?.user2Data ?? 'No Data'}</Text>
      <Button title="데이터 보내자." onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
  pingStatus: {
    color: 'green',
    marginTop: 20,
    fontSize: 16,
  },
});

export default RoomScreen;
