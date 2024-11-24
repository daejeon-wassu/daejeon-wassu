/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Modal,
  Image,
  useWindowDimensions,
  Alert,
  BackHandler,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Confetti from 'react-native-confetti';
import {useRoute, RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '../../router/Navigator';
import {
  getRoomDetails,
  playMarble,
  verifyLocation,
  endGame,
  regenerateInviteCode,
} from '../../api/mono';
import {getTokens} from '../../utills/tokenStorage';
import SSE from 'react-native-sse';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

type GameTwoRouteProp = RouteProp<RootStackParamList, 'GameTwo'>;
type GameTwoNavigationProp = StackNavigationProp<RootStackParamList>;

type Node = {
  nodeId: number;
  spotName: string;
  thumbnail: string;
  nodeOrder: number;
};

const SEGMENT_COLORS = ['#E0F2E0', '#D0E8FF', '#FFE0E0', '#FFF7CC'];

const GameTwo = () => {
  const navigation = useNavigation<GameTwoNavigationProp>();
  const route = useRoute<GameTwoRouteProp>();
  const {roomId, inviteCode: initialInviteCode} = route.params as {
    roomId: number;
    inviteCode?: string;
  };
  const [nodes, setNodes] = useState<Node[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [yourVerified, setYourVerified] = useState(false); // 서버에서 온 상태 값
  const [isVerifying, setIsVerifying] = useState(false); // 인증 중 여부
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [showDiceResult, setShowDiceResult] = useState(false);
  const [yourPass, setYourPass] = useState(1);
  const [playerIcon, setPlayerIcon] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState(initialInviteCode);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [opponentPosition, setOpponentPosition] = useState<number | null>(null);
  const [opponentIcon, setOpponentIcon] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [ready, setReady] = useState(false);
  const [showInviteCodeSection, setShowInviteCodeSection] = useState(true);
  const sseRef = useRef<any>(null);

  const confettiRef = useRef<Confetti | null>(null);
  const {width, height} = useWindowDimensions();

  const TOP_CELLS = 9;
  const SIDE_CELLS = 5;
  const CELL_WIDTH = width / TOP_CELLS;
  const CELL_HEIGHT = height / (SIDE_CELLS + 2);

  useEffect(() => {
    Orientation.lockToLandscape();

    const handleBackPress = () => {
      goToMain(); // 뒤로가기 버튼을 눌렀을 때 메인 화면으로 이동
      return true; // 기본 뒤로가기 동작을 막음
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    const fetchRoomDetails = async () => {
      try {
        const roomData = await getRoomDetails(roomId); // API 호출
        const sortedNodes = roomData.nodes.sort((a: Node, b: Node) => a.nodeOrder - b.nodeOrder);
        setNodes(sortedNodes); // 정렬된 노드 저장
        setPlayerIcon(roomData.you.profileImage); // profileImage 설정
        setOpponentIcon(roomData.opponent?.profileImage || null);
      } catch (error) {
        console.error('getRoomDetails Error:', error);
      }
    };

    const connectSSE = async () => {
      try {
        const {accessToken} = await getTokens();
        if (!accessToken) return;

        const sse = new SSE(`https://k11b105.p.ssafy.io/wassu/marble/room/${roomId}/sync`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        sse.addEventListener('open', () => {
          console.log('연결 성공');
        });

        sse.addEventListener('userInfo', (event: any) => {
          const userData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          console.log('userData:', userData);

          // 유저 이미지 업데이트
          if (userData.opponent) {
            setOpponentIcon(userData.opponent); // 상대 프로필 이미지 업데이트
            setShowInviteCodeSection(false);
          }
        });

        sse.addEventListener('message', (event: any) => {
          console.log('SSE message raw data:', event.data);
          if (event.data === 'keep-alive') return;

          const parsedData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          console.log('Parsed SSE data:', parsedData);

          if (parsedData.ready !== undefined) {
            setReady(parsedData.ready); // ready 값 업데이트
            setShowInviteCodeSection(!parsedData.ready);
          }

          if (parsedData.opponentPosition !== undefined) {
            const updatedOpponentPosition =
              parsedData.opponentPosition >= 27 ? 27 : parsedData.opponentPosition;
            setOpponentPosition(updatedOpponentPosition);
          }

          // 인증 상태 업데이트
          if (parsedData.dice1 === 0 && parsedData.dice2 === 0) {
            handleLocationVerification(parsedData);
          } else if (parsedData.dice1 >= 0 && parsedData.dice2 >= 0) {
            // 주사위 굴리기 이벤트 처리
            handleDiceRoll(parsedData);
          }

          // 인증상태 업뎃
          if (parsedData.yourVerified !== undefined) {
            setYourVerified(parsedData.yourVerified);
          }

          if (parsedData.yourPass !== undefined) {
            setYourPass(parsedData.yourPass); // SSE에서 yourPass 값 동기화
          }

          //현재 위치 업뎃
          if (parsedData.yourPosition !== undefined) {
            const updatedPosition = parsedData.yourPosition >= 27 ? 27 : parsedData.yourPosition;
            setCurrentPosition(updatedPosition);
          }

          // 내 게임이 끝났을 때
          if (Number(parsedData.yourPosition) >= 27 && Boolean(parsedData.yourVerified)) {
            setIsGameFinished(true);
          }

          // 종료 시키기
          if (
            Number(parsedData.yourPosition) >= 27 &&
            Number(parsedData.opponentPosition) >= 27 &&
            Boolean(parsedData.yourVerified) &&
            Boolean(parsedData.opponentVerified)
          ) {
            handleGameEnd(); // 종료 함수 호출
          }
        });

        sse.addEventListener('error', (error: any) => {
          console.error('SSE 연결 에러:', error);
        });

        sseRef.current = sse;

        return () => {
          sse.close();
          console.log('SSE 연결 종료');
        };
      } catch (error) {
        console.error('SSE 연결 중 오류 발생:', error);
      }
    };

    fetchRoomDetails();
    connectSSE();

    return () => {
      if (sseRef.current) {
        sseRef.current.close();
        console.log('SSE 연결 종료됨');
      }
      backHandler.remove();
      Orientation.unlockAllOrientations();
    };
  }, [roomId]);

  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        const {inviteCode: newInviteCode} = await regenerateInviteCode(roomId);
        console.log('재생성된 초대코드:', newInviteCode);
        setInviteCode(newInviteCode);
      } catch (error) {
        console.error('초대코드 재생성 실패:', error);
      }
    };
    fetchInviteCode();
    const interval = setInterval(fetchInviteCode, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    if (currentPosition >= 0 && currentPosition < nodes.length) {
      const targetNode = nodes[currentPosition];
      setSelectedNode(targetNode);
      setModalVisible(true);
    }
  }, [currentPosition]);

  const handleLocationVerification = (parsedData: any) => {
    console.log('장소 인증 이벤트 감지');
    if (parsedData.yourVerified !== undefined) {
      setYourVerified(parsedData.yourVerified);
      setModalVisible(false); // 인증 완료 후 모달 닫기
    }
  };

  const handleDiceRoll = (parsedData: any) => {
    const totalDiceValue = parsedData.dice1 + parsedData.dice2;
    setDiceResult(totalDiceValue); // 주사위 값 업데이트
    setShowDiceResult(true); // 주사위 결과 표시
    console.log(`주사위 결과: ${parsedData.dice1} + ${parsedData.dice2} = ${totalDiceValue}`);

    setTimeout(() => {
      setShowDiceResult(false); // 주사위 결과 숨김
    }, 2000);
  };

  const handleRollDice = async () => {
    try {
      setDiceRolling(true); // 주사위 GIF 시작
      const response = await playMarble(roomId, 'roll-dice');
      if (response.success) {
        console.log('게임 플레이 요청 성공:', response.message);
      } else {
        console.log('주사위 굴리기에 실패:', response.message);
      }
    } catch (error) {
      console.error('주사위 굴리기 에러:', error);
    } finally {
      setTimeout(() => {
        setDiceRolling(false); // 주사위 GIF 종료
      }, 2900); // GIF 2.9초 후 종료
    }
  };

  const handlePassDice = async () => {
    try {
      const response = await playMarble(roomId, 'pass');
      if (response.success) {
        console.log('Pass 요청 성공:', response.message);
        setYourPass(0); // Pass 버튼 비활성화
      } else {
        Alert.alert('오류', response.message || 'Pass에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', 'Pass 중 문제가 발생했습니다.');
      console.error('Pass 처리 에러:', error);
    }
  };

  const handleVerifyLocation = async () => {
    if (!selectedNode) return; // 선택된 노드가 없으면 종료
    setIsVerifying(true); // 인증 중 상태 설정
    try {
      const result = await verifyLocation(roomId, selectedNode.nodeId); // 인증 요청
      if (result.verified) {
        Alert.alert('성공', '위치 인증이 완료되었습니다!');
      } else {
        Alert.alert('실패', '위치 인증에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '위치 인증 중 문제가 발생했습니다.');
      console.error('위치 인증 에러:', error);
    } finally {
      setIsVerifying(false);
      setModalVisible(false);
    }
  };

  const goToMain = () => {
    navigation.navigate('Main');
  };

  // 바꿔야해요
  const handleGameEnd = async () => {
    try {
      const response = await endGame(roomId); // 게임 종료 API 호출
      if (response.status === 'marble deleted') {
        Alert.alert(
          '게임 종료',
          '게임이 종료되었습니다.',
          [
            {
              text: '확인',
              onPress: goToMain,
            },
          ],
          {cancelable: false},
        );
      } else {
        console.log('종료실패');
      }
    } catch (error) {
      console.error('게임 종료 에러:', error);
    }
  };

  const toggleInviteCodeVisibility = () => {
    setShowInviteCode(prev => !prev);
  };

  const renderCells = () => {
    return nodes.map((node, index) => {
      let left = 0;
      let top = 0;

      if (index < TOP_CELLS) {
        left = (TOP_CELLS - 1 - index) * CELL_WIDTH;
        top = height - CELL_HEIGHT;
      } else if (index < TOP_CELLS + SIDE_CELLS) {
        left = 0;
        top = (SIDE_CELLS - (index - TOP_CELLS)) * CELL_HEIGHT;
      } else if (index < TOP_CELLS * 2 + SIDE_CELLS) {
        left = (index - TOP_CELLS - SIDE_CELLS) * CELL_WIDTH;
        top = 0;
      } else {
        left = width - CELL_WIDTH;
        top = (index - TOP_CELLS * 2 - SIDE_CELLS + 1) * CELL_HEIGHT;
      }

      let segmentIndex = 0;
      if (index < TOP_CELLS) {
        segmentIndex = 0;
      } else if (index < TOP_CELLS + SIDE_CELLS) {
        segmentIndex = 1;
      } else if (index < TOP_CELLS * 2 + SIDE_CELLS) {
        segmentIndex = 2;
      } else {
        segmentIndex = 3;
      }

      const cellColor = SEGMENT_COLORS[segmentIndex];
      const isSamePosition = currentPosition === index && opponentPosition === index;
      return (
        <TouchableOpacity
          key={node.nodeId}
          style={[styles.cell, {left, top}]}
          onPress={() => {
            setSelectedNode(node);
            setModalVisible(true);
          }}>
          <LinearGradient
            colors={['#f1f1f1', cellColor, '#b0b0b0']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={StyleSheet.absoluteFillObject}
          />
          {/* 플레이어 아이콘 */}
          {currentPosition === index && playerIcon && (
            <Image
              source={{uri: playerIcon}}
              style={[
                styles.playerIcon,
                isSamePosition && {transform: [{translateX: -10}]}, // 왼쪽으로 이동
              ]}
            />
          )}
          {/* 상대방 아이콘 */}
          {opponentPosition === index && opponentIcon && (
            <Image
              source={{uri: opponentIcon}}
              style={[
                styles.opponentIcon,
                isSamePosition && {transform: [{translateX: 10}]}, // 오른쪽으로 이동
              ]}
            />
          )}
          <Text style={styles.cellText}>{node.spotName}</Text>
        </TouchableOpacity>
      );
    });
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    boardContainer: {
      position: 'absolute',
      width: width,
      height: height,
    },
    cellText: {
      fontSize: 12,
      color: '#333',
      textAlign: 'center',
      fontFamily: 'Pretendard-Bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: width * 0.4,
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333333',
    },
    modalImage: {
      width: width * 0.3,
      height: 130,
      resizeMode: 'cover',
      marginBottom: 20,
      borderRadius: 8,
    },
    modalButton: {
      backgroundColor: '#418663',
      paddingVertical: 7,
      paddingHorizontal: 15,
      borderRadius: 15,
    },
    modalButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 12,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: '#FF6B6B',
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    rollButton: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#418663',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 70,
      shadowColor: '#000',
      shadowOffset: {width: 4, height: 4},
      shadowOpacity: 0.8,
      shadowRadius: 6,
      elevation: 10,
    },
    rollButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
    },
    playerIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      resizeMode: 'cover',
      position: 'absolute',
      zIndex: 100,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#fff',
      elevation: 11, // Android 전용 그림자 높이
    },
    cell: {
      position: 'absolute',
      width: CELL_WIDTH,
      height: CELL_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: '#c0c0c0',
      shadowColor: '#000',
      shadowOffset: {width: 4, height: 4},
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 8,
      overflow: 'hidden',
    },
    gradientBackground: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    diceImage: {
      width: 150,
      height: 150,
      position: 'absolute',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    diceResultContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{translateX: 0}, {translateY: -50}],
      justifyContent: 'center',
      alignItems: 'center',
    },
    diceResultText: {
      fontSize: 50,
      color: '#333',
      fontFamily: 'Pretendard-ExtraBold',
    },
    actionButton: {
      position: 'absolute',
      bottom: 80,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#333',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButtons: {
      position: 'absolute',
      bottom: 80,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 14,
      fontFamily: 'Pretendard-ExtraBold',
    },
    actionButtonTexts: {
      color: '#333',
      fontSize: 14,
      fontFamily: 'Pretendard-ExtraBold',
    },
    passButton: {
      position: 'absolute',
      bottom: 150,
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 4, height: 4},
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 8,
    },
    passButtonText: {
      color: '#fff',
      fontSize: 14,
      fontFamily: 'Pretendard-ExtraBold',
    },
    inviteCodeContainer: {
      position: 'absolute',
      left: CELL_WIDTH * 1.5,
      top: height * 0.2,
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {width: 2, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    inviteCodeText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    hiddenInviteCode: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#aaa',
      textAlign: 'center',
    },
    opponentIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      resizeMode: 'cover',
      position: 'absolute',
      zIndex: 10,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#333',
    },
    modalContainers: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContents: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitles: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    modalMessage: {
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
      marginBottom: 20,
    },
    modalButtons: {
      backgroundColor: '#418663',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    modalButtonsText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <ImageBackground
      source={require('../../assets/imgs/mono/DBack.jpg')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.boardContainer}>{renderCells()}</View>

      {showInviteCodeSection && (
        <View style={styles.inviteCodeContainer}>
          <TouchableOpacity onPress={toggleInviteCodeVisibility}>
            <Text style={showInviteCode ? styles.inviteCodeText : styles.hiddenInviteCode}>
              {showInviteCode ? inviteCode : '초대코드 보기'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isGameFinished && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isGameFinished}
          onRequestClose={() => setIsGameFinished(false)}>
          <View style={styles.modalContainers}>
            <View style={styles.modalContents}>
              <Text style={styles.modalTitles}>게임 종료</Text>
              <Text style={styles.modalMessage}>게임이 종료되었습니다!</Text>

              <TouchableOpacity
                style={styles.modalButtons}
                onPress={() => {
                  setIsGameFinished(false); // 모달 닫기
                  goToMain(); // 메인 화면으로 이동
                }}>
                <Text style={styles.modalButtonsText}>메인 화면으로</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {diceRolling && (
        <FastImage
          style={{width: 300, height: 300}}
          source={require('../../assets/imgs/mono/dice.gif')}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}

      {showDiceResult && (
        <View style={styles.diceResultContainer}>
          <Text style={styles.diceResultText}>{diceResult}</Text>
        </View>
      )}

      <Confetti ref={confettiRef} duration={2000} />

      {selectedNode && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>{selectedNode.spotName}</Text>

              <Image source={{uri: selectedNode.thumbnail}} style={styles.modalImage} />

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {backgroundColor: isVerifying ? '#d3d3d3' : '#418663'}, // 인증 중일 때 회색
                ]}
                onPress={isVerifying ? undefined : handleVerifyLocation} // 인증 중일 때 클릭 불가
                disabled={isVerifying} // 인증 중일 때 비활성화
              >
                <Text style={styles.modalButtonText}>
                  {isVerifying ? '인증 중...' : '인증하기'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity
        style={[
          styles.passButton,
          {backgroundColor: yourPass === 1 ? '#418663' : '#aaa'}, // yourPass 값에 따라 색상 변경
        ]}
        onPress={yourPass === 1 ? handlePassDice : undefined} // yourPass가 1일 때만 클릭 가능
        disabled={yourPass === 0} // yourPass가 0일 때 비활성화
      >
        <Text style={styles.passButtonText}>Pass</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.rollButton, {backgroundColor: yourVerified ? '#418663' : '#aaa'}]}
        onPress={yourVerified ? handleRollDice : undefined}
        disabled={!yourVerified}>
        <Text style={styles.rollButtonText}>Roll</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default GameTwo;
