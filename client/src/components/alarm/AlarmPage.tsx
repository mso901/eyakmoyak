import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import Header from '../common/Header';
import Loading from '../common/Loading';
import { Alarm, useAlarmStore } from '../../store/alarm';
import { getAlarms, deleteAlarm, updateAlarmStatus } from '../../api/alarmApi';
import LoginCheck from '../common/LoginCheck';
import { isUserLoggedIn } from '../../utils/auth';
import { AlarmProps } from './Alarm';

const AlarmPage = ({ setShowToast }: AlarmProps) => {
  const { alarms, setCurrentPage, setCurrentAlarm, setAlarms } =
    useAlarmStore();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = isUserLoggedIn();

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const data = await getAlarms();
        setAlarms(data);
      } catch (error) {
        console.error('알람을 불러오는 도중 에러 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isLoggedIn) {
      fetchAlarms();
    } else {
      setIsLoading(false);
    }
  }, [setAlarms]);

  const handleToggle = async (id: string) => {
    const updatedAlarms = alarms.map((alarm) => {
      if (alarm.id === id) {
        return { ...alarm, alarmStatus: !alarm.alarmStatus };
      }
      return alarm;
    });

    const updatedAlarm = updatedAlarms.find((alarm) => alarm.id === id);

    if (updatedAlarm && updatedAlarm.alarmStatus !== undefined) {
      try {
        await updateAlarmStatus(updatedAlarm.id, updatedAlarm.alarmStatus);
        console.log('알람상태:', updatedAlarm.alarmStatus);
        setAlarms(updatedAlarms);
        setShowToast('알람 상태가 업데이트되었습니다.');
      } catch (error) {
        console.error('알람 상태 업데이트 에러:', error);
      }
    }
  };

  const handleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAlarm(id);
      setAlarms(alarms.filter((alarm) => alarm.id !== id));
      setShowToast('알람이 삭제되었습니다.');
    } catch (error) {
      console.error('에러:', error);
    }
  };

  const handleEditAlarm = (alarm: Alarm) => {
    setCurrentAlarm(alarm);
    setCurrentPage('settings');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <LoginCheck>
        {(handleCheckLogin) => (
          <AlarmContainer>
            <IconContainer>
              <Icon
                icon='mdi:pencil'
                width='20px'
                height='20px'
                style={{
                  color: isDeleteMode ? '#72bf44' : 'gray'
                }}
                onClick={() => handleCheckLogin(handleDeleteMode)}
              />
            </IconContainer>
            {alarms.length === 0 ? (
              <NoAlarmsMessage>
                {isLoggedIn ? '알람을 추가해주세요' : '로그인 후 이용해주세요'}
              </NoAlarmsMessage>
            ) : (
              <AlarmList>
                {alarms.map((alarm) => (
                  <AlarmItemContainer key={alarm.id}>
                    <AlarmItem onClick={() => handleEditAlarm(alarm)}>
                      <AlarmHeader>
                        <AlarmName>{alarm.name}</AlarmName>
                        <ToggleSwitch
                          onClick={(event) => event.stopPropagation()}
                        >
                          <input
                            type='checkbox'
                            checked={alarm.alarmStatus}
                            onChange={() => handleToggle(alarm.id)}
                          />
                          <Slider />
                        </ToggleSwitch>
                      </AlarmHeader>
                      <AlarmTimes>
                        {alarm.times.map((timeObj, i) => (
                          <AlarmTime key={i}>{timeObj.time}</AlarmTime>
                        ))}
                      </AlarmTimes>
                    </AlarmItem>
                    {isDeleteMode && (
                      <DeleteButton onClick={() => handleDelete(alarm.id)}>
                        삭제
                      </DeleteButton>
                    )}
                  </AlarmItemContainer>
                ))}
              </AlarmList>
            )}
            <AddAlarm
              onClick={() =>
                handleCheckLogin(() => {
                  setCurrentAlarm(null);
                  setCurrentPage('settings');
                })
              }
            >
              <img src={`/img/plus.svg`} alt='알람추가' />
            </AddAlarm>
          </AlarmContainer>
        )}
      </LoginCheck>
    </>
  );
};

export default AlarmPage;

const AlarmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85vw;
  margin: auto;
`;

const IconContainer = styled.div`
  margin-left: auto;
  margin-bottom: 20px;
  cursor: pointer;
`;

const NoAlarmsMessage = styled.p`
  color: #9c9a9a;
  font-weight: 300;
`;

const AlarmList = styled.div`
  width: 100%;
`;

const AlarmItemContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const AlarmItem = styled.div`
  flex: 1;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const AlarmHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const AlarmName = styled.h4`
  padding-left: 5px;
  font-weight: 500;
`;

const AlarmTimes = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const AlarmTime = styled.span`
  background: #f0f0f0;
  border-radius: 5px;
  padding: 3px 6px;
  margin-right: 5px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  margin-right: 10px;
  width: 34px;
  height: 20px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + span {
    background-color: #4caf50;
  }

  input:checked + span:before {
    transform: translateX(14px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;

  &:before {
    position: absolute;
    content: '';
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const DeleteButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: 10px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const AddAlarm = styled.button`
  width: 60px;
  height: 60px;
  padding: 0;
  margin-top: 20px;
  border: none;
  background: transparent;
  cursor: pointer;

  & img {
    width: 100%;
    height: 100%;
  }
`;
