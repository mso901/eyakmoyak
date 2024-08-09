import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Alarm, useAlarmStore } from '../../store/alarm';
import { useAllAlarmStore } from '../../store/allAlarms';
import Popup from '../common/popup/Popup';
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';

const PillAlarmChecker = () => {
  const { alarms } = useAlarmStore();
  const {
    currentPillAlarms,
    confirmedPillAlarms,

    setCurrentPillAlarms,
    addCurrentPillAlarms,
    addConfirmedPillAlarms,

    nextPillAlarmTime,
    setNextPillAlarmTime
  } = useAllAlarmStore();

  const [currentTime, setCurrentTime] = useState('');
  let intervalId: NodeJS.Timeout;

  const checkTime = () => {
    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    setCurrentTime(getTimeString(now));

    alarms.forEach((alarm) => {
      if (!alarm.alarmStatus) return;

      if (nextPillAlarmTime != undefined && nextPillAlarmTime > now) return;

      let startDate = new Date(alarm.startDate ?? '');
      startDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );

      if (startDate > nowDate) return;

      let endDate = new Date(alarm.endDate ?? '');
      endDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );

      if (endDate < nowDate) return;

      alarm.times.map((time) => {
        if (time.time == currentTime) updatePillAlarm(alarm);
      });
    });
  };

  const getTimeString = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (!intervalId) intervalId = setInterval(checkTime, 1000);

    return () => clearInterval(intervalId);
  }, [
    alarms,
    currentPillAlarms,
    confirmedPillAlarms,
    currentTime,
    nextPillAlarmTime
  ]);

  const updatePillAlarm = (alarm: Alarm) => {
    const prevAlarms = currentPillAlarms ?? [];
    let alarmInfo = { id: alarm.id, name: alarm.name };

    const alreadyExists = prevAlarms.some(
      (existingAlarm) => existingAlarm.id === alarm.id
    );

    const alreadyConfirmed = confirmedPillAlarms?.some(
      (existingAlarm) => existingAlarm.id === alarm.id
    );

    if (!alreadyExists && !alreadyConfirmed) addCurrentPillAlarms([alarmInfo]);
  };

  const confirmCurrentPills = () => {
    addConfirmedPillAlarms(currentPillAlarms);
  };

  const getPillAlarmsName = () => {
    let names = '';
    currentPillAlarms?.map((alarm, index) => {
      names += alarm.name;

      if (currentPillAlarms.length - 1 > index) names += ', ';
    });
    return names;
  };

  const addSecondsToDate = (date: Date, seconds: number) => {
    return new Date(date.getTime() + seconds * 1000);
  };

  return (
    <Container>
      {(currentPillAlarms?.length ?? 0) > 0 && (
        <Popup
          onClose={() => {
            setCurrentPillAlarms([]);
            setNextPillAlarmTime(addSecondsToDate(new Date(), 10));
          }}
        >
          <div className='center'>
            <Icon
              icon='line-md:alert-circle-twotone-loop'
              width='3rem'
              height='3rem'
              style={{ color: '#FFBB25' }}
            />
            <br /> <b>{currentTime}</b>
            <br />약 먹을 시간입니다!
            <br />
            <div style={{ fontSize: '0.9rem' }}>(닫기 시 10초 뒤 재알람)</div>
            <br />
            <div className='pill-list'>{getPillAlarmsName()}</div>
            <button onClick={() => confirmCurrentPills()}>먹었어요</button>
          </div>
        </Popup>
      )}
    </Container>
  );
};

const Container = styled.nav`
  .pill-list {
    background-color: #d9d9d9;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    width: 100%;
  }
`;
export default PillAlarmChecker;
