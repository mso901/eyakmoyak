import { create } from 'zustand';

export interface Alarm {
  id: string;
  userId?: string;
  name: string;
  startDate?: string;
  endDate?: string;
  times: { time: string }[];
  alarmStatus?: boolean;
}

interface AlarmState {
  alarms: Alarm[];
  setAlarms: (alarms: Alarm[]) => void;
  addAlarm: (alarm: Alarm) => void;
  updateAlarm: (updatedAlarm: Alarm) => void;
  deleteAlarm: (id: string) => void;
  currentPage: 'main' | 'settings' | 'edit';
  setCurrentPage: (page: 'main' | 'settings' | 'edit') => void;
  currentAlarm: Alarm | null;
  setCurrentAlarm: (alarm: Alarm | null) => void;
}

export const useAlarmStore = create<AlarmState>((set) => ({
  alarms: [],
  setAlarms: (alarms) => set({ alarms }),
  addAlarm: (alarm) =>
    set((state) => ({
      alarms: [
        ...state.alarms,
        { ...alarm, id: String(state.alarms.length + 1) }
      ]
    })),
  updateAlarm: (updatedAlarm) =>
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === updatedAlarm.id ? updatedAlarm : alarm
      )
    })),
  deleteAlarm: (id: string) =>
    set((state) => ({
      alarms: state.alarms.filter((alarm) => alarm.id !== id)
    })),
  updateAlarmStatus: (id: string, status: boolean) =>
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, alarmStatus: status } : alarm
      )
    })),
  currentPage: 'main',
  setCurrentPage: (page) => set({ currentPage: page }),
  currentAlarm: null,
  setCurrentAlarm: (alarm) => set({ currentAlarm: alarm })
}));
