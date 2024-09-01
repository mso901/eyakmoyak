import { Icon } from '@iconify-icon/react';
import { Button, Input, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCalendar, useDateStore } from '../../store/calendar';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import CalendarToast from './CalendarToast';

const EditPill = () => {
  const { updateMedications, nowData, removeMedications } = useCalendar();
  const { edit, setEditTaken, index } = useDateStore();
  const [pillName, setPillName] = useState<string>('');
  const [alarmTimes, setAlarmTimes] = useState<
    { time: Dayjs; status: string; checked: boolean }[]
  >([]);
  const [maxTime, setMaxTime] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [timeError, setTimeError] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);
  const navigate = useNavigate();

  useEffect(() => {
    if (nowData?.medications?.length) {
      const pillData = nowData.medications[index];
      setPillName(pillData.name ?? '');

      const timesArray = Array.isArray(pillData.time) ? pillData.time : [];
      const initialTimes = timesArray.map((time, index) => ({
        time: dayjs(time, 'HH:mm'),
        status: 'active',
        checked: Array.isArray(pillData.taken)
          ? pillData.taken[index] ?? false
          : false
      }));

      setAlarmTimes(initialTimes);
    }
  }, [nowData]);

  const handleSaveEditedPill = () => {
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

    updateMedications(medications);
    setEditTaken(false);

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

  const handleDeletePillData = () => {
    removeMedications(pillName);
    setEditTaken(false);
  };

  const getPopupContent = (type: PopupType) => {
    switch (type) {
      case PopupType.DeleteData:
        return (
          <div style={{ textAlign: 'center' }}>
            삭제하시겠습니까?
            <button
              className='bottomClose'
              onClick={() => {
                setPopupType(PopupType.None);
                handleDeletePillData();
              }}
            >
              확인
            </button>
          </div>
        );

      default:
        return PopupContent(type, navigate);
    }
  };
  return (
    <>
      <AddPillContainer>
        <Title>약 정보 수정하기</Title>
        <hr />
        <DeleteContainer>
          <Delete onClick={() => setPopupType(PopupType.DeleteData)}>
            <Icon icon='ph:trash-bold' width='20px' />
            삭제
          </Delete>
        </DeleteContainer>
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
        <RunButton onClick={() => setEditTaken(false)}>취소</RunButton>
        <RunButton onClick={handleSaveEditedPill}>저장</RunButton>
      </ButtonContainer>
      {popupType !== PopupType.None && (
        <Popup onClose={() => setPopupType(PopupType.None)}>
          {getPopupContent(popupType)}
        </Popup>
      )}
    </>
  );
};

export default EditPill;

const AddPillContainer = styled.div`
  padding: 0 10px;
  overflow-y: auto;
  margin-bottom: 80px;
`;

const DeleteContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  color: #ff3d00;
`;

const Delete = styled.button`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  color: #ff3d00;
  border: none;
  border-radius: 5px;
  background-color: #ffe6de;
  padding: 5px 10px;
  line-height: 20px;
`;

const Title = styled.div`
  text-align: center;
  font-size: 15pt;
  font-weight: 500;
  margin-bottom: 15px;
`;

const SubTitle = styled.div`
  margin-bottom: 20px;

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
