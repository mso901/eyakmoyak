import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import { Button, Input, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import styled from 'styled-components';
import { useCalendar, useDateStore } from '../../store/calendar';
import CalendarToast from './CalendarToast';

const AddPill = () => {
  const { addMedications } = useCalendar();
  const { setAddTaken, edit } = useDateStore();
  const [pillName, setPillName] = useState<string>('');
  const [alarmTimes, setAlarmTimes] = useState<
    { time: Dayjs; status: string; checked: boolean }[]
  >([
    { time: dayjs('09:00', 'HH:mm'), status: 'active', checked: true },
    { time: dayjs('13:00', 'HH:mm'), status: 'active', checked: true }
  ]);
  const [maxTime, setMaxTime] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [timeError, setTimeError] = useState<boolean>(false);

  const handleSavePill = () => {
    if (!pillName) {
      setNameError(true);
      return;
    }
    if (alarmTimes.length === 0) {
      setTimeError(true);
      return;
    }

    const times = alarmTimes.map((item) => item.time.format('HH:mm'));
    const taken = alarmTimes.map((item) => item.checked);

    const medications = [
      {
        name: pillName,
        time: times,
        taken: taken
      }
    ];

    console.log(medications);
    addMedications(medications);
    setAddTaken(false);

    console.log(edit);
  };

  const handleAddTime = () => {
    if (alarmTimes.length < 3) {
      setAlarmTimes([
        ...alarmTimes,
        { time: dayjs(), status: 'active', checked: true }
      ]);
    } else {
      setMaxTime(true);
      setTimeout(() => setMaxTime(false), 2000);
    }
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

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newAlarmTimes = [...alarmTimes];
    newAlarmTimes[index] = { ...newAlarmTimes[index], checked };
    setAlarmTimes(newAlarmTimes);
  };

  return (
    <>
      <AddPillContainer>
        <Title>약 정보 추가하기</Title>
        <hr />
        <SubTitle>
          <Pill>💊 복용 여부를 확인할 약 이름</Pill>
          <StyledAntdInput
            placeholder='예) 처방약'
            value={pillName}
            onChange={(e) => {
              setPillName(e.target.value);
              if (e.target.value) {
                setNameError(false);
              }
            }}
            error={nameError}
          />
          {nameError && <ErrorText>약 이름은 필수값입니다.</ErrorText>}
        </SubTitle>
        <SubTitle className='time'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingRight: '40px'
            }}
          >
            <Pill>⏰ 복용 시간</Pill>
            <Pill>✔️ 복용 여부</Pill>
          </div>
          {alarmTimes.map((timeObj, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                icon={<Icon icon='mdi:minus-circle' style={{ color: 'red' }} />}
                onClick={() => handleRemoveTime(index)}
              />
              <TimePicker
                value={timeObj.time}
                onChange={(time) => handleTimeChange(time!, index)}
                format='HH:mm'
                style={{ width: '100px', margin: '0 10px' }}
              />
              <StyledCheckbox
                type='checkbox'
                checked={timeObj.checked}
                onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                style={{ marginLeft: '15%' }}
              />
              {timeObj.checked ? '먹었어요' : '안 먹었어요'}
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
          {timeError && <ErrorText>시간은 필수값입니다.</ErrorText>}
        </SubTitle>

        {maxTime && (
          <CalendarToast
            title='시간추가'
            str='시간 추가는 최대 3개까지 가능합니다.'
          />
        )}
      </AddPillContainer>
      <ButtonContainer>
        <RunButton onClick={() => setAddTaken(false)}>취소</RunButton>
        <RunButton onClick={handleSavePill}>저장</RunButton>
      </ButtonContainer>
    </>
  );
};

export default AddPill;

const AddPillContainer = styled.div`
  padding: 0 10px;
  overflow-y: auto;
  margin-bottom: 80px;
`;

const Title = styled.div`
  text-align: center;
  font-size: 15pt;
  font-weight: 500;
  margin-bottom: 15px;
`;

const SubTitle = styled.div`
  margin: 25px 0;

  &.time {
    margin-top: 50px;
  }
`;

const Pill = styled.div`
  font-size: 13pt;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 80px;
  height: 50px;
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

const StyledAntdInput = styled(Input)<{ error: boolean }>`
  border-color: ${(props) => (props.error ? 'red' : '')};
`;

const ErrorText = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const StyledCheckbox = styled.input`
  appearance: none;
  border: 1.5px solid gainsboro;
  border-radius: 0.35rem;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;

  &:checked {
    border-color: transparent;
    background-color: #72bf44;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 120% 120%;
    background-position: 50%;
    background-repeat: no-repeat;
  }

  &:not(:checked) {
    border-color: transparent;
    background-color: #d9d9d9;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 120% 120%;
    background-position: 50%;
    background-repeat: no-repeat;
  }
`;
