import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Pill {
  pillid: string;
  pillname: string;
  expiredat?: string;
  alarmstatus?: boolean;
}

interface MyPillState {
  pills: Pill[];
  setPills: (pills: Pill[]) => void;
  addPill: (pill: Pill) => void;
  addPills: (pills: Pill[]) => void;
  deletePill: (id: string) => void;
  updatePill: (id: string, pillname:string, expiredat:string,alarmstatus:boolean) => void;
  clearAllPills: () => void;

}

export const useMyPillStore = create(
  persist<MyPillState>(
    (set) => ({
      pills: [],
      setPills: (pills) => set({ pills }),
    
      addPill: (pill) => set((state) => {
        const existingPillIds = new Set(state.pills.map(p => p.pillid));
        if (!existingPillIds.has(pill.pillid)) {
          return {
            pills: [...state.pills, pill],
          };
        }
        return state;
      }),
    
      addPills: (pills) => set((state) => {
        const existingPillIds = new Set(state.pills.map(pill => pill.pillid));
        const newPills = pills.filter(pill => !existingPillIds.has(pill.pillid));
    
        return {
          pills: [...state.pills, ...newPills],
        };
      }),
      
      deletePill: (id: string) =>
      set((state) => ({
        pills: state.pills.filter((pill) => pill.pillid !== id)
      })),

      updatePill: (id: string, pillname:string, expiredat:string,alarmstatus:boolean) =>
        set((state) => ({
          pills: state.pills.map((pill) =>
            pill.pillid === id
              ? { ...pill, pillname, expiredat, alarmstatus }
              : pill
          ),
        })),
    
      clearAllPills: () => {
        set({ 
          pills:[],
         });
      }
    }),     {
      name: 'my-pill-storage'
    }
  )
);
