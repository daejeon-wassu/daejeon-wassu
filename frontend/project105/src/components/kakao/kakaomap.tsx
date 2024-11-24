import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";
export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: "7081816cda06eadc33cc160b7fbdfaa1",
    libraries: ["clusterer", "drawing", "services"],
  });
}
