import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Main from '../pages/Main';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import RecommendedPlace from '../pages/RecommendedPlace';
import TravelChallenge from '../pages/TravelChallenge';
import MonopolyPage from '../pages/MonopolyPage';
import Community from '../pages/Community';
import Ar from '../components/TravelChallenge/Ar';

import Gps from '../pages/Gps';
import FindPassword from '../pages/FindPassword';
import MyPage from '../pages/MyPage';
import TravelItinerary from '../pages/TravelItinerary';
import OngoingChallenge from '../components/MyPage/OngoingChallenge';
import CompletedChallenge from '../components/MyPage/CompletedChallenge';
import Profile from '../pages/Profile';
import Dogam from '../components/MyPage/Dogam';
import ChangePassword from '../components/Profile/ChangePassword';
import ChangeInfo from '../components/Profile/ChangeInfo';
import CreateSchedule from '../components/TravelItinerary/CreateSchedule';
import Details from '../components/TravelItinerary/Details';
import CoursePage from '../components/TravelChallenge/CouresePage';
import CourseDescription from '../components/TravelChallenge/CourseDescription';
import ChallengeDetail from '../components/TravelChallenge/ChallengeDetail';
import PlaceList from '../components/RecommendedPlace/PlaceList';
import PlaceDetail from '../components/RecommendedPlace/PlaceDetail';
import Writing from '../components/Community/Writing';
import CommunitySearch from '../components/Community/CommunitySearch';
import WriteReview from '../components/RecommendedPlace/WriteReview';
import Map from '../pages/Map';
import PostDetail from '../components/Community/PostDetail';
import EditPost from '../components/Community/EditPost';
import Itinerary from '../components/TravelItinerary/Itinerary';
import DetailedInquiry from '../components/TravelItinerary/DetailedInquiry';
import ReItinerary from '../components/TravelItinerary/ReItinerary';
import {Day} from '../types';
import Choice from '../components/Monopoly/Choice';
import GameOne from '../components/Monopoly/GameOne';
import GameTwo from '../components/Monopoly/GameTwo';
import Invitation from '../components/Monopoly/Invitation';
import MainRoom from '../components/Monopoly/MainRoom';
import ChoiceTwo from '../components/Monopoly/ChoiceTwo';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  SignUp: undefined;
  RecommendedPlace: {category?: string};
  TravelChallenge: undefined;
  MonopolyPage: undefined;
  Community: undefined;
  Ar: {courseId: number; spotId: number}; // 매개변수 추가
  Gps: undefined;
  FindPassword: undefined;
  MyPage: undefined;
  TravelItinerary: undefined;
  OngoingChallenge: undefined;
  CompletedChallenge: undefined;
  Profile: undefined;
  Dogam: undefined;
  ChangePassword: undefined;
  ChangeInfo: {nickname: string};
  CreateSchedule: undefined;
  Details: {
    itinerary?: Day[];
    dayId?: string;
    selectedPlace?: {
      id: string;
      spotName: string;
      spotAddress: string;
    };
  };
  Course: undefined;
  CourseDescription: undefined;
  ChallengeDetail: {id: number};
  PlaceList: {category?: string};
  PlaceDetail: {id: string};
  Writing: undefined;
  CommunitySearch: undefined;
  WriteReview: {spotId: string}; // 여기에 spotId 추가
  Map: undefined;
  PostDetail: {articleId: string};
  Itinerary: {dayId: string};
  ReItinerary: {dayId: string};
  EditPost: {
    articleId: string;
    initialTitle: string;
    initialContent: string;
    initialImages: any[];
    initialtags: string;
    initialPlace?: string;
  };
  DetailedInquiry: {
    itinerary?: {
      scheduleId: number;
      title: string;
      startDate: string;
      endDate: string;
      dailyPlans: {
        planId: number;
        day: number;
        date: string;
        touristSpots: {
          spotId: number;
          spotName: string;
          spotAddress: string;
          favoritesCount: number;
          reviewCount: number;
          imageCount: number;
          favorite: boolean;
        }[];
      }[];
    };
    selectedPlace?: {
      id: string;
      name: string;
      address: string;
    };
    dayId?: string;
  };
  Choice: {single: boolean};
  ChoiceTwo: {single: boolean; inviteCode?: string};
  GameOne: {roomId: number};
  GameTwo: {roomId: number; inviteCode?: string};
  Invitation: {single: boolean};
  MainRoom: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function Navigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} options={{headerShown: false}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: false}} />
      <Stack.Screen
        name="RecommendedPlace"
        component={RecommendedPlace}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TravelChallenge"
        component={TravelChallenge}
        options={{headerShown: false}}
      />
      <Stack.Screen name="MonopolyPage" component={MonopolyPage} options={{headerShown: false}} />
      <Stack.Screen name="Community" component={Community} options={{headerShown: false}} />
      <Stack.Screen name="Ar" component={Ar} options={{headerShown: false}} />

      <Stack.Screen name="Gps" component={Gps} options={{headerShown: false}} />
      <Stack.Screen name="FindPassword" component={FindPassword} options={{headerShown: false}} />
      <Stack.Screen name="MyPage" component={MyPage} options={{headerShown: false}} />
      <Stack.Screen
        name="TravelItinerary"
        component={TravelItinerary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OngoingChallenge"
        component={OngoingChallenge}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CompletedChallenge"
        component={CompletedChallenge}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}} />
      <Stack.Screen name="Dogam" component={Dogam} options={{headerShown: false}} />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ChangeInfo" component={ChangeInfo} options={{headerShown: false}} />
      <Stack.Screen
        name="CreateSchedule"
        component={CreateSchedule}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Details" component={Details} options={{headerShown: false}} />
      <Stack.Screen name="Course" component={CoursePage} options={{headerShown: false}} />
      <Stack.Screen
        name="CourseDescription"
        component={CourseDescription}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChallengeDetail"
        component={ChallengeDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen name="PlaceList" component={PlaceList} options={{headerShown: false}} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetail} options={{headerShown: false}} />
      <Stack.Screen name="Writing" component={Writing} options={{headerShown: false}} />
      <Stack.Screen name="WriteReview" component={WriteReview} options={{headerShown: false}} />
      <Stack.Screen name="Map" component={Map} options={{headerShown: false}} />
      <Stack.Screen name="PostDetail" component={PostDetail} options={{headerShown: false}} />
      <Stack.Screen name="EditPost" component={EditPost} options={{headerShown: false}} />
      <Stack.Screen name="Itinerary" component={Itinerary} options={{headerShown: false}} />
      <Stack.Screen
        name="DetailedInquiry"
        component={DetailedInquiry}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ReItinerary" component={ReItinerary} options={{headerShown: false}} />
      <Stack.Screen
        name="CommunitySearch"
        component={CommunitySearch}
        options={{headerShown: false}}
      />

      <Stack.Screen name="Choice" component={Choice} options={{headerShown: false}} />
      <Stack.Screen name="ChoiceTwo" component={ChoiceTwo} options={{headerShown: false}} />
      <Stack.Screen name="GameOne" component={GameOne} options={{headerShown: false}} />
      <Stack.Screen name="GameTwo" component={GameTwo} options={{headerShown: false}} />
      <Stack.Screen name="Invitation" component={Invitation} options={{headerShown: false}} />
      <Stack.Screen name="MainRoom" component={MainRoom} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default Navigator;
