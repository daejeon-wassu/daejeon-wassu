declare module 'react-native-immersive' {
  export default class Immersive {
    static on(): void; // Immersive 모드를 켭니다.
    static off(): void; // Immersive 모드를 끕니다.
    static setImmersive(immersive: boolean): void; // Immersive 모드 상태를 설정합니다.
  }
}
