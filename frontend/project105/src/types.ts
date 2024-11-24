export interface ImageData {
  url: string;
  alt: string;
}

export interface LocaImgData {
  imageId: number;
  imageUrl: string;
}

export interface CategoryData {
  category: string;
}

export interface ArticleData {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  liked: number;
  user: number;
  viewCount: number;
  images: ImageData[];
  profileImage: string;
  nickName: string;
  userLiked: boolean;
  matched: boolean;
  place: string;
}
export interface ReviewImageData {
  reviewImageId: number;
  imageUrl: string;
}

export interface ProfileData {
  email: string;
  nickname: string;
  birthYear: number;
  gender: string;
  level: string;
  exp: number;
  profileImage: string;
}

export interface ReviewData {
  reviewId: number;
  content: string;
  likeCount: number;
  profile: ProfileData;
  reviewImages: ReviewImageData[];
}

export interface LocationData {
  id: number;
  businessHours: string;
  categories: CategoryData[];
  touristSpotImages: LocaImgData[];
  latitude: number;
  longitude: number;
  liked: number;
  phoneNumber: string;
  spotAddress: string;
  spotDescription: string;
  spotName: string;
  stamp: boolean;
  reviewCount: number;
  favoritesCount: number;
  favorite: boolean;
  phone: string;
  reviews: ReviewData[]; // reviews 배열은 ReviewData 타입의 객체들을 포함
  images: Array<{ image: string }>;
  stamped: boolean;
}

export interface CourseData {
  id: number;
  course_name: string;
  description: string;
  image_url: string;
}

export interface BakeriesData {
  address: string;
  bakery_name: string;
  business_hours: string;
  description: string;
  elastic_id: string;
  image_url: string;
  phone: string;
}

export interface CourseDetailData {
  bakeries: BakeriesData[];
  course: CourseData;
}

export interface UserData {
  email: string;
  gender: string;
  birth_year: string;
  nickname: string;
  level: string;
  exp: number;
  profileImage: string;
}

export interface ScheduleData {
  endDate: string;
  scheduleId: number;
  spotCount: number;
  startDate: string;
  thumbnail: string;
  title: string;
}

export interface MyScheduleData {
  onGoingSchedules: ScheduleData;
  pastSchedules: ScheduleData[];
  upcomingSchedules: ScheduleData[];
}

export interface RecoData {
  likeCount: number;
  reviewCount: number;
  spotAddress: string;
  spotDescription: string;
  spotId: string;
  spotName: string;
  thumbnail: string;
}

export interface RecosData {
  data: RecoData[];
}

export interface StampData {
  category: string;
  spotName: string;
}

export interface ProgressData {
  address: string;
  bakery_name: string;
  business_hours: string;
  completed: boolean;
  description: string;
  elastic_id: string;
  image_url: string;
  spot_image_url: string;
  wassumon_image_url: string;
}

export interface CompletedData {
  course: CourseData;
  course_details: ProgressData[];
  completed_count: number;
}

export interface ChallengeData {
  completed: CompletedData[];
  in_progress: CompletedData[];
}
