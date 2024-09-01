import { create } from 'zustand';

export interface PillData {
  imgurl: string;
  id: number;
  name: string;
  engname: string;
  companyname: string;
  importantWords: string;
  ingredientname: string;
  efficacy: string;
  dosage: string;
  caution: string;
  source: string;
  similarity: string;
  boxurl: string;
  departments: string;
  type: string;
}

interface PillState {
  pillData: PillData | null;
  setPillData: (data: PillData | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const usePillStore = create<PillState>((set) => ({
  pillData: null,
  setPillData: (data: PillData | null) => set({ pillData: data }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading })
}));
