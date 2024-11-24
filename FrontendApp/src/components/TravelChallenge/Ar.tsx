import React, {useState, useEffect} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import {StyleSheet, View, Text, Modal, Image, TouchableOpacity} from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroAnimations,
  ViroARImageMarker,
  ViroARTrackingTargets, // 추가
} from '@reactvision/react-viro';
import {markSpotAsVisited, getWassumonDetails, getCourseDetail} from '../../api/recommended';

interface HelloWorldSceneARProps {
  onAnimationEnd: () => void;
}
ViroARTrackingTargets.createTargets({
  SSAFYImage: {
    source: require('../../assets/ar/ssafy.jpg'), // 감지할 이미지 경로
    orientation: 'Up',
    physicalWidth: 0.1, // 실제 이미지의 폭 (미터 단위)
  },
});

// 애니메이션 등록
ViroAnimations.registerAnimations({
  throwBall: {
    properties: {
      positionX: 0.1,
      positionY: 0.1,
      positionZ: -0.75,
      rotateY: '+=360',
    },
    duration: 1000,
    easing: 'easeInEaseOut',
  },
  monsterFlyAway: {
    properties: {
      positionX: '0.1',
      positionZ: '+=0.75',
      scaleX: 0,
      scaleY: 0,
      scaleZ: 0,
      opacity: 0,
    },
    duration: 800,
    easing: 'easeIn',
  },
});

const HelloWorldSceneAR: React.FC<HelloWorldSceneARProps & {wassumonName: string | null}> = ({
  onAnimationEnd,
  wassumonName,
}) => {
  const [text, setText] = useState('Initializing AR...');
  const [throwAnim, setThrowAnim] = useState(false);
  const [monsterAnim, setMonsterAnim] = useState(false);
  const [isMarkerDetected, setIsMarkerDetected] = useState(false);
  const [markerTriggered, setMarkerTriggered] = useState(false); // 한 번만 트리거되도록 상태 추가
  const [modelPosition, setModelPosition] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    setText('Click Ball!');
  }, []);

  const handleThrowBall = () => {
    if (isMarkerDetected || wassumonName !== 'SSAFY몬') {
      // 공 애니메이션 실행
      setThrowAnim(true);
      setTimeout(() => {
        setMonsterAnim(true);
        setTimeout(() => {
          onAnimationEnd();
        }, 800);
      }, 1000);
    }
  };

  const handleMarkerDetected = (anchorPosition: [number, number, number]) => {
    // 이미지가 인식된 후 한 번만 트리거되도록 설정
    if (markerTriggered) return;

    if (wassumonName === 'SSAFY몬') {
      setIsMarkerDetected(true);
      setMarkerTriggered(true); // 트리거를 한 번만 실행하도록 설정
      setModelPosition([0, 0, 0]); // 기준점을 0, 0, 0으로 설정
      setText('SSAFY몬 Detected!');
    }
  };
  const getModelSource = () => {
    switch (wassumonName?.trim()) {
      case '밀면몬':
        return require('../../assets/ar/3d-models/밀면몬.glb');
      case '쌀국수몬':
        return require('../../assets/ar/3d-models/쌀국수몬.glb');
      case '칼국수몬':
        return require('../../assets/ar/3d-models/칼국수몬.glb');
      case '식빵몬':
        return require('../../assets/ar/3d-models/식빵몬.glb');
      case '카스테라몬':
        return require('../../assets/ar/3d-models/카스테라몬.glb');
      case '소금빵몬':
        return require('../../assets/ar/3d-models/소금빵몬.glb');
      case '소보루몬':
        return require('../../assets/ar/3d-models/소보루몬.glb');
      case '단팥몬':
        return require('../../assets/ar/3d-models/단팥몬.glb');
      case '바게트몬':
        return require('../../assets/ar/3d-models/바게트몬.glb');
      case 'SSAFY몬':
        return require('../../assets/ar/3d-models/SSAFY몬.glb');
      default:
        return require('../../assets/ar/3d-models/model.glb');
    }
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" intensity={200} />
      <ViroSpotLight
        position={[0, 2, 0]}
        direction={[0, -1, 0]}
        attenuationStartDistance={1}
        attenuationEndDistance={4}
        castsShadow={true}
      />

      {/* SSAFY몬일 때 이미지 인식은 시작 신호 역할 및 위치 고정 */}
      {wassumonName === 'SSAFY몬' && (
        <ViroARImageMarker
          target="SSAFYImage"
          onAnchorFound={anchor =>
            handleMarkerDetected([anchor.position[0], anchor.position[1], anchor.position[2]])
          }
        />
      )}

      {/* 고정된 위치에 3D 모델 렌더링 */}
      {modelPosition && (
        <>
          {/* Bread Ball 3D Object */}
          <Viro3DObject
            source={require('../../assets/ar/3d-models/bread_ball.glb')}
            position={[modelPosition[0], modelPosition[1] - 0.1, modelPosition[2] - 0.2]} // 기준점에서 가중치 적용
            scale={[0.03, 0.03, 0.03]}
            type="GLB"
            onClick={handleThrowBall}
            animation={{
              name: 'throwBall',
              run: throwAnim,
              loop: false,
            }}
          />
          {/* SSAFY몬 3D Object */}
          {wassumonName === 'SSAFY몬' && (
            <Viro3DObject
              source={require('../../assets/ar/3d-models/SSAFY몬.glb')}
              position={[modelPosition[0], modelPosition[1], modelPosition[2] - 1.5]} // 기준점에 SSAFY몬 렌더링
              scale={[0.4, 0.4, 0.4]}
              rotation={[0, 0, 0]}
              type="GLB"
              animation={{
                name: 'monsterFlyAway',
                run: monsterAnim,
                loop: false,
              }}
            />
          )}
        </>
      )}

      {/* SSAFY몬이 아닌 경우에도 같은 위치에 렌더링 */}
      {wassumonName !== 'SSAFY몬' && (
        <>
          <Viro3DObject
            source={require('../../assets/ar/3d-models/bread_ball.glb')}
            position={[0, -0.1, -0.2]} // 고정된 위치
            scale={[0.03, 0.03, 0.03]}
            type="GLB"
            onClick={handleThrowBall}
            animation={{
              name: 'throwBall',
              run: throwAnim,
              loop: false,
            }}
          />
          <Viro3DObject
            source={getModelSource()}
            position={[0, 0, -1.5]} // 고정된 위치
            scale={[0.4, 0.4, 0.4]}
            rotation={[0, 0, 0]}
            type="GLB"
            animation={{
              name: 'monsterFlyAway',
              run: monsterAnim,
              loop: false,
            }}
          />
        </>
      )}

      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 1, -2]}
        style={styles.helloWorldTextStyle}
      />
    </ViroARScene>
  );
};

import type {RootStackParamList} from '../../router/Navigator';

type ARRouteProp = RouteProp<RootStackParamList, 'Ar'>;

const ARModalExample = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [wassumonDetails, setWassumonDetails] = useState<any>(null); // 상태 추가
  const [wassumonName, setWassumonName] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const route = useRoute<ARRouteProp>();
  const {courseId, spotId} = route.params;
  const navigation = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Wassumon 세부 정보 가져오기
        const wassumonDetails = await getWassumonDetails(spotId);
        if (wassumonDetails) {
          setWassumonDetails(wassumonDetails);
          setWassumonName(wassumonDetails.wassumon_name);
        } else {
          console.log('Wassumon details not found for spotId:', spotId); // 추가 로그
        }

        // 코스 세부 정보 가져오기 및 해당 spotId에 맞는 모델 URL 찾기
        const courseDetails = await getCourseDetail(courseId);
        if (courseDetails && courseDetails.course_details) {
          const spotDetail = courseDetails.course_details.find(
            (detail: any) => detail.spot_id === spotId,
          );
          if (spotDetail && spotDetail.wassumon_model) {
            setModelUrl(spotDetail.wassumon_model);
          }
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };

    fetchData();
  }, [courseId, spotId]);
  // 모달 열릴 때 post 요청 수행
  useEffect(() => {
    if (modalVisible && wassumonDetails) {
      const markVisited = async () => {
        try {
          // courseId와 spotId를 함께 전달
          const response = await markSpotAsVisited(courseId, spotId);
        } catch (error) {
          console.error('Error marking spot as visited:', error);
        }
      };

      markVisited();
    }
  }, [modalVisible, wassumonDetails, courseId, spotId]);

  const handleAnimationEnd = async () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={{flex: 1}}>
      {wassumonName ? ( // wassumonName이 null이 아닐 때만 ViroARSceneNavigator 렌더링
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: () => (
              <HelloWorldSceneAR onAnimationEnd={handleAnimationEnd} wassumonName={wassumonName} />
            ),
          }}
          style={styles.f1}
        />
      ) : (
        <Text>Loading AR scene...</Text> // 로딩 중 메시지 추가
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {wassumonDetails && (
              <>
                <Image source={{uri: wassumonDetails.wassumon_image}} style={styles.monsterImage} />
                <Text style={styles.monsterName}>{wassumonDetails.wassumon_name}</Text>
                <Text style={styles.monsterRegion}>출몰지역: {wassumonDetails.spot_name}</Text>
                <View style={styles.monsterStats}>
                  <Text>{wassumonDetails.wassumon_height}m</Text>
                  <Text>{wassumonDetails.wassumon_type} 타입</Text>
                  <Text>{wassumonDetails.wassumon_weight}kg</Text>
                </View>
                <Text style={styles.monsterDescription}>
                  {wassumonDetails.wassumon_description}
                </Text>
              </>
            )}
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ARModalExample;

const styles = StyleSheet.create({
  f1: {flex: 1},
  helloWorldTextStyle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#040404',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  monsterImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  monsterName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  monsterRegion: {
    fontSize: 16,
    color: '#418663',
    marginBottom: 10,
  },
  monsterStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  monsterDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#418663',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
