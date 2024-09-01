import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchHistoryState {
  history: string[];
  addHistory: (query: string) => void;
  clearHistory: () => void;
}

const useSearchHistoryStore = create(
  persist<SearchHistoryState>(
    (set, get) => ({
      history: [],
      addHistory: (query) => {
        const currentHistory = get().history;
        const updatedHistory = currentHistory.filter((item) => item !== query);
        updatedHistory.unshift(query);
        set({ history: updatedHistory });
      },
      clearHistory: () => set({ history: [] })
    }),
    {
      name: 'searchHistory'
    }
  )
);

export { useSearchHistoryStore };
