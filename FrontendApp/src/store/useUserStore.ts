import {create} from 'zustand';
import {getUserProfile} from '../api/mypage';

interface UserProfile {
  email?: string;
  gender?: string;
  birth_year?: number;
  nickname?: string;
  level?: string;
  exp?: number;
}

interface UserProfileState {
  userProfile: UserProfile | null;
  isLoading: boolean;
  fetchUserProfile: () => Promise<void>;
}

export const useUserProfileStore = create<UserProfileState>(set => ({
  userProfile: null,
  isLoading: false,

  fetchUserProfile: async () => {
    set({isLoading: true});
    const profile = await getUserProfile();
    set({userProfile: profile, isLoading: false});
  },
}));
