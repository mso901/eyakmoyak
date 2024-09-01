import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export interface AlarmInfo {
  name:string;
  id:string;
}

interface AlarmState {
  currentPillAlarms: AlarmInfo[];
  confirmedPillAlarms: AlarmInfo[];

  currentExpiredAlarms: AlarmInfo[];
  confirmedExpiredAlarms: AlarmInfo[];

  nextPillAlarmTime:Date|undefined;
  nextExpiredAlarmTime:Date|undefined;

  setNextPillAlarmTime: (date: Date) => void;
  setNextExpiredAlarmTime: (date: Date) => void;

  setCurrentPillAlarms: (alarms: AlarmInfo[]) => void;
  setConfirmedPillAlarms: (alarms: AlarmInfo[]) => void;

  addCurrentPillAlarms: (alarms: AlarmInfo[]) => void;
  addConfirmedPillAlarms: (alarms: AlarmInfo[]) => void;

  setCurrentExpiredAlarms: (alarms: AlarmInfo[]) => void;
  setConfirmedExpiredAlarms: (alarms: AlarmInfo[]) => void;

  addCurrentExpiredAlarms: (alarms: AlarmInfo[]) => void;
  addConfirmedExpiredAlarms: (alarms: AlarmInfo[]) => void;

  clearAllAlarms: () => void;
}

export const useAllAlarmStore = create(
  persist<AlarmState>(((set) => ({
    currentPillAlarms:[],
    confirmedPillAlarms:[],

    currentExpiredAlarms:[],
    confirmedExpiredAlarms:[],

    nextPillAlarmTime:undefined,
    nextExpiredAlarmTime:undefined,

    setNextPillAlarmTime: (date) => set({ nextPillAlarmTime:date }),
    setNextExpiredAlarmTime: (date) => set({ nextExpiredAlarmTime:date }),

    setCurrentPillAlarms: (alarms) => set({ currentPillAlarms:alarms }),
    setConfirmedPillAlarms: (alarms) => set({ confirmedPillAlarms:alarms }),


    addCurrentPillAlarms: (alarms: AlarmInfo[]) => set((state) => ({
      currentPillAlarms: [...state.currentPillAlarms, ...alarms],
    })),

    addConfirmedPillAlarms: (alarms: AlarmInfo[]) => set((state) => ({
      confirmedPillAlarms: [...state.confirmedPillAlarms, ...alarms],
    })),


    setCurrentExpiredAlarms: (alarms) => set({ currentExpiredAlarms:alarms }),
    setConfirmedExpiredAlarms: (alarms) => set({ confirmedExpiredAlarms:alarms }),


    addCurrentExpiredAlarms: (alarms: AlarmInfo[]) => set((state) => ({
      currentExpiredAlarms: [...state.currentExpiredAlarms, ...alarms],
    })),

    addConfirmedExpiredAlarms: (alarms: AlarmInfo[]) => set((state) => ({
      confirmedExpiredAlarms: [...state.confirmedExpiredAlarms, ...alarms],
    })),

    clearAllAlarms: () => {
      set({ 
        currentPillAlarms:[],
        confirmedPillAlarms:[],
    
        currentExpiredAlarms:[],
        confirmedExpiredAlarms:[],

        nextPillAlarmTime:undefined,
        nextExpiredAlarmTime:undefined,
       });}
      
  })), 
  {name: 'all-alarms-storage'
}));
