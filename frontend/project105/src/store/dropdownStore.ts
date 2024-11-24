import { create } from "zustand";

interface DropdownState {
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  closeDropdown: () => void;
}

const useDropdownStore = create<DropdownState>((set) => ({
  isDropdownOpen: false, // 초기값
  toggleDropdown: () =>
    set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),
  closeDropdown: () => set({ isDropdownOpen: false }),
}));

export default useDropdownStore;
