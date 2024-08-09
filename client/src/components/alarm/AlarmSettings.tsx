import { Icon } from '@iconify-icon/react';
import { Button, Input, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createAlarm, updateAlarm } from '../../api/alarmApi';
import { Alarm, useAlarmStore } from '../../store/alarm';
import { AlarmProps } from './Alarm';

const AlarmSettings = ({ setShowToast }: AlarmProps) => {
  const setCurrentPage = useAlarmStore((state) => state.setCurrentPage);
  const currentAlarm = useAlarmStore((state) => state.currentAlarm);
  const setCurrentAlarm = useAlarmStore((state) => state.setCurrentAlarm);
  const [alarmNameError, setAlarmNameError] = useState<string>('');
  const [alarmName, setAlarmName] = useState<string>('');
  const [alarmTimes, setAlarmTimes] = useState<{ time: Dayjs }[]>([
    { time: dayjs('09:00', 'HH:mm') },
    { time: dayjs('13:00', 'HH:mm') },
    { time: dayjs('20:00', 'HH:mm') }
  ]);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (currentAlarm) {
      setAlarmName(currentAlarm.name);
      setAlarmTimes(
        currentAlarm.times.map((t) => ({
          time: dayjs(t.time, 'HH:mm')
        }))
      );
      if (currentAlarm.startDate) {
        setStartDate(currentAlarm.startDate.split('T')[0]);
      }
      if (currentAlarm.endDate) {
        setEndDate(currentAlarm.endDate.split('T')[0]);
      }
    }
  }, [currentAlarm]);

  const handleAddTime = () => {
    setAlarmTimes([...alarmTimes, { time: dayjs() }]);
  };

  const handleRemoveTime = (index: number) => {
    const newAlarmTimes = alarmTimes.filter((_, i) => i !== index);
    setAlarmTimes(newAlarmTimes);
  };

  const handleTimeChange = (time: Dayjs, index: number) => {
    const newAlarmTimes = [...alarmTimes];
    newAlarmTimes[index] = { ...newAlarmTimes[index], time };
    setAlarmTimes(newAlarmTimes);
  };

  const handleSave = async () => {
    if (!alarmName) {
      setAlarmNameError('약 이름을 입력해주세요.');
      return;
    }

    const alarmData: Alarm = {
      id: currentAlarm?.id || '',
      name: alarmName,
      times: alarmTimes.map((t) => ({
        time: t.time.format('HH:mm')
      })),
      startDate: startDate,
      endDate: endDate,
      alarmStatus: true
    };

    try {
      if (currentAlarm && currentAlarm.id) {
        await updateAlarm(currentAlarm.id, alarmData);
        setShowToast('알람이 수정되었습니다.');
      } else {
        await createAlarm(alarmData);
        setShowToast('알람이 생성되었습니다.');
      }
      setCurrentPage('main');
      setCurrentAlarm(null);
    } catch (error) {
      console.error('에러:', error);
    }
  };

  return (
    <>
      <AlarmSettingsContainer>
        <h2>알람 설정</h2>
        <SettingList>
          <AlarmName>
            <h4>어떤 약을 드시고 계신가요?</h4>
            <Input
              placeholder='알르레기 약'
              value={alarmName}
              onChange={(e) => {
                setAlarmName(e.target.value);
                if (e.target.value) {
                  setAlarmNameError('');
                }
              }}
            />
            {alarmNameError && <ErrorText>{alarmNameError}</ErrorText>}
          </AlarmName>
          <AlarmStartDate>
            <h4>언제부터 약을 드시나요?</h4>
            <Input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </AlarmStartDate>
          <AlarmEndDate>
            <h4>언제까지 약을 드시나요?</h4>
            <Input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </AlarmEndDate>
          <AlarmTime>
            <h4>알람 시간</h4>
            {alarmTimes.map((timeObj, index) => (
              <div key={index}>
                <Button
                  icon={
                    <Icon icon='mdi:minus-circle' style={{ color: 'red' }} />
                  }
                  onClick={() => handleRemoveTime(index)}
                />
                <TimePicker
                  value={timeObj.time}
                  onChange={(time) => handleTimeChange(time!, index)}
                  format='HH:mm'
                  style={{ width: '100px', margin: '0 10px' }}
                />
              </div>
            ))}
            <Button
              type='dashed'
              onClick={handleAddTime}
              icon={<Icon icon='mdi:plus-circle' style={{ color: 'green' }} />}
              style={{ marginTop: '10px' }}
            >
              시간 추가
            </Button>
          </AlarmTime>
        </SettingList>
      </AlarmSettingsContainer>
      <ButtonContainer>
        <RunButton onClick={() => setCurrentPage('main')}>취소</RunButton>
        <RunButton onClick={handleSave}>저장</RunButton>
      </ButtonContainer>
    </>
  );
};

export default AlarmSettings;

const AlarmSettingsContainer = styled.div`
  margin: auto;
  padding: 20px 0;
  margin-bottom: 160px;
  width: 80vw;

  & h2 {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
  }
`;

const SettingList = styled.div`
  padding-top: 40px;

  & section {
    padding: 15px 0;
  }

  & h4 {
    margin-bottom: 10px;
    font-weight: 400;
  }
`;

const AlarmName = styled.section``;

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin: 5px 0 0 8px;
`;

const AlarmStartDate = styled.section``;

const AlarmEndDate = styled.section``;

const AlarmTime = styled.section`
  div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
`;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 100px;
  height: 60px;
  background-color: var(--main-color);
`;

const RunButton = styled.button`
  flex: 1;
  height: 100%;
  font-size: 16px;
  font-weight: bold;
  border: none;
  background-color: transparent;
`;
