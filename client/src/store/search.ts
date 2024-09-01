import { create } from 'zustand';
import { PillData } from './pill.ts';

interface SearchState {
  searchType: string;
  setSearchType: (type: string) => void;
  suggestions: PillData[];
  setSuggestions: (suggestions: PillData[]) => void;
  isImageSearch: boolean;
  setIsImageSearch: (isImageSearch: boolean) => void;
  imageResults: PillData[] | null;
  setImageResults: (data: PillData[] | null) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchType: 'name',
  setSearchType: (type) => set({ searchType: type }),
  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions }),
  isImageSearch: false,
  setIsImageSearch: (isImageSearch: boolean) => set({ isImageSearch }),
  imageResults: null,
  setImageResults: (data: PillData[] | null) => set({ imageResults: data })
}));
