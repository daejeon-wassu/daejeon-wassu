import {LogBox} from 'react-native';
// 경고 메시지 무시 설정
LogBox.ignoreLogs([
  '(NOBRIDGE) WARN  [Reanimated] Tried to modify key `current` of an object which has been already passed to a worklet.',
]);

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigator from './src/router/Navigator';

const App = () => {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
};

export default App;
