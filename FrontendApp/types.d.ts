declare module 'react-native-sse' {
  export interface EventType {
    userInfo: Event;
  }
}

declare module 'react-native-sse' {
  export default class SSE {
    constructor(url: string, options?: {headers?: Record<string, string>});
    addEventListener(event: string, callback: (event: any) => void): void;
    removeEventListener(event: string, callback: (event: any) => void): void;
    close(): void;
  }
}
