export interface TouristSpot {
  id: string;
  spotName: string;
  spotAddress: string;
  liked: number;
  stamp: number;
  spotDescription: string;
  phoneNumber: string;
  businessHour: string;
  latitude: number;
  longitude: number;
  categories: {category: string}[];
  images: {image: string}[];
}

export type Place = {
  id: string;
  name: string;
  address: string;
};

export type Day = {
  id: string;
  day: string;
  date: string;
  places: Place[];
};
