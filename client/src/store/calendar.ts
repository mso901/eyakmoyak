import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Store {
  value: Date | null;
  onChange: (date: Date | null) => void;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  arrow: boolean;
  setArrow: (arrow: boolean) => void;
  index: number;
  setIndex: (index: number) => void;
  editTaken: boolean;
  setEditTaken: (editTaken: boolean) => void;
  addTaken: boolean;
  setAddTaken: (addTaken: boolean) => void;
  posted: Array<{ date?: string; post?: boolean }>;
  addPosted: (newPost: { date: string; post: boolean }) => void;
  setPosted: (date: string, post: boolean) => void;
  resetPosted: (newPosts: Array<{ date?: string; post?: boolean }>) => void;
}

export const useDateStore = create<Store>((set) => ({
  value: new Date(),
  onChange: (date: Date | null) => set({ value: date }),
  edit: false,
  setEdit: (edit) => set({ edit }),
  arrow: false,
  setArrow: (arrow) => set({ arrow }),
  index: 0,
  setIndex: (index) => set({ index }),
  editTaken: false,
  setEditTaken: (editTaken) => set({ editTaken }),
  addTaken: false,
  setAddTaken: (addTaken) => set({ addTaken }),
  posted: [],
  addPosted: (newPost) =>
    set((state) => {
      const exists = state.posted.some((item) => item.date === newPost.date);
      if (!exists) {
        return {
          posted: [...state.posted, newPost]
        };
      } else {
        return state;
      }
    }),
  setPosted: (date, post) =>
    set((state) => ({
      posted: state.posted.map((item) =>
        item.date === date ? { ...item, post } : item
      )
    })),
  resetPosted: (newPosts) =>
    set(() => ({
      posted: newPosts
    }))
}));

interface CalendarEntry {
  date: string;
  medications?: {
    name?: string;
    time?: string[];
    taken?: boolean[];
  }[];
  bloodsugarBefore?: number;
  bloodsugarAfter?: number;
  temperature?: number;
  weight?: number;
  calImg?: string;
}

interface Calendar {
  calendarEntries: CalendarEntry[];
  calImg?: FormData | null;
  setCalendarEntries: (entries: CalendarEntry[]) => void;
  addMedications: (newMedications: CalendarEntry['medications']) => void;
  updateMedications: (updatedMedications: CalendarEntry['medications']) => void;
  removeMedications: (pillName: string) => void;
  setBloodSugarBefore: (bloodsugarBefore: number | undefined) => void;
  setBloodSugarAfter: (bloodsugarAfter: number | undefined) => void;
  setTemperature: (temperature: number | undefined) => void;
  setWeight: (weight: number | undefined) => void;
  setCalImg: (calImg: string | undefined) => void;
  photo: FormData | null;
  setPhoto: (photo: FormData) => void;
  nowData: CalendarEntry | null;
  setNowData: (data: CalendarEntry | null) => void;
}

export const useCalendar = create<Calendar>()(
  devtools((set) => ({
    calendarEntries: [],
    calImg: null,
    nowData: null,

    setCalendarEntries: (entries) => set({ calendarEntries: entries }),

    addMedications: (newMedications: CalendarEntry['medications']) =>
      set((state) => {
        const updatedMedications = Array.isArray(newMedications)
          ? newMedications
          : [];

        if (state.nowData) {
          const updatedData = {
            ...state.nowData,
            medications: [
              ...(state.nowData.medications || []),
              ...updatedMedications
            ]
          };
          return { nowData: updatedData };
        } else {
          const newEntry: CalendarEntry = {
            date: new Date().toISOString(),
            medications: updatedMedications
          };
          return { nowData: newEntry };
        }
      }),

    updateMedications: (updatedMedications: CalendarEntry['medications']) =>
      set((state) => {
        if (state.nowData) {
          const existingMedications = state.nowData.medications || [];
          const updatedEntry = {
            ...state.nowData,
            medications: existingMedications.map((medication) => {
              const updatedMedication =
                updatedMedications &&
                updatedMedications.find((med) => med.name === medication.name);
              return updatedMedication
                ? { ...medication, ...updatedMedication }
                : medication;
            })
          };
          return { nowData: updatedEntry };
        }
        return state;
      }),

    removeMedications: (pillName: string) =>
      set((state) => {
        if (state.nowData) {
          const filteredMedications = (state.nowData.medications || []).filter(
            (medication) => medication.name !== pillName
          );
          return {
            nowData: { ...state.nowData, medications: filteredMedications }
          };
        }
        return state;
      }),

    setBloodSugarBefore: (bloodsugarBefore) =>
      set((state) => ({
        nowData: state.nowData
          ? { ...state.nowData, bloodsugarBefore }
          : { date: new Date().toISOString(), bloodsugarBefore }
      })),

    setBloodSugarAfter: (bloodsugarAfter) =>
      set((state) => ({
        nowData: state.nowData
          ? { ...state.nowData, bloodsugarAfter }
          : { date: new Date().toISOString(), bloodsugarAfter }
      })),

    setTemperature: (temperature) =>
      set((state) => ({
        nowData: state.nowData
          ? { ...state.nowData, temperature }
          : { date: new Date().toISOString(), temperature }
      })),

    setWeight: (weight) =>
      set((state) => ({
        nowData: state.nowData
          ? { ...state.nowData, weight }
          : { date: new Date().toISOString(), weight }
      })),

    setCalImg: (calImg) =>
      set((state) => ({
        nowData: state.nowData
          ? { ...state.nowData, calImg }
          : { date: new Date().toISOString(), calImg }
      })),

    setNowData: (data) => set({ nowData: data }),

    photo: null,
    setPhoto: (formData: FormData) => {
      set({
        photo: formData
      });
    }
  }))
);
