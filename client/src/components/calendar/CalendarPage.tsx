import { Icon } from '@iconify-icon/react';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { calendarGet, calendarPost, calendarPut } from '../../api/calendarApi';
import { useCalendar, useDateStore } from '../../store/calendar';
import Layout from '../common/Layout';
import Seo from '../common/Seo';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import CalendarDetail from './CalendarDetail';
import CalendarSection from './CalendarSection';
import CalendarToast from './CalendarToast';

const CalendarPage: React.FC = () => {
  const {
    value,
    arrow,
    setArrow,
    edit,
    setEdit,
    setAddTaken,
    posted,
    addPosted,
    onChange
  } = useDateStore();
  const { nowData, photo, setNowData } = useCalendar();
  dayjs.locale('ko');
  const days = dayjs(value).format('D일 ddd');
  const formattedDate = dayjs(value).format('YYYY-MM-DD');
  const login = Cookies.get('login');
  const [maxTime, setMaxTime] = useState<boolean>(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);
  const isPosted = posted.some((item) => item.date === formattedDate);

  useEffect(() => {
    onChange(dayjs().toDate());
    const getTodayData = async () => {
      try {
        const res = await calendarGet(dayjs().format('YYYY-MM-DD'));
        setNowData(res);
      } catch (err) {
        console.log(err);
      }
    };
    getTodayData();
    setEdit(false);
    setArrow(false);
    setAddTaken(false);
  }, []);

  const formData = new FormData();
  formData.append('date', formattedDate);
  formData.append(
    'bloodsugarBefore',
    (nowData?.bloodsugarBefore ?? 0).toString()
  );
  formData.append(
    'bloodsugarAfter',
    (nowData?.bloodsugarAfter ?? 0).toString()
  );
  formData.append('medications', JSON.stringify(nowData?.medications ?? []));
  formData.append('temperature', (nowData?.temperature ?? 0).toString());
  formData.append('weight', (nowData?.weight ?? 0).toString());
  formData.append('calImg', photo?.get('file') as Blob);

  const putData = async () => {
    try {
      if (isPosted) {
        const res = await calendarPut(formattedDate, formData);
        setNowData(res);
      } else {
        const res = await calendarPost(formData);
        setNowData(res);
        addPosted({ date: formattedDate, post: true });
      }
    } catch (err) {
      console.error('수정 에러:', err);
    }
  };

  const openEdit = (open: boolean) => {
    if (login) {
      if (open === false) {
        if (nowData && !isPosted) {
          const newEntry = {
            date: formattedDate,
            medications: nowData?.medications?.map((pill) => ({
              name: pill.name || '',
              time: Array.isArray(pill.time) ? pill.time : [pill.time || ''],
              taken: Array.isArray(pill.taken)
                ? pill.taken
                : [pill.taken || false]
            })),
            bloodsugarBefore: nowData?.bloodsugarBefore || 0,
            bloodsugarAfter: nowData?.bloodsugarAfter || 0,
            temperature: nowData?.temperature || 0,
            weight: nowData?.weight || 0,
            calImg: photo?.get('file')
              ? URL.createObjectURL(photo.get('file') as Blob)
              : undefined
          };
          setNowData(newEntry);
        }
        putData();
        setAddTaken(false);
        setEdit(false);
        setMaxTime(true);
        setTimeout(() => setMaxTime(false), 2000);
      } else {
        setEdit(true);
      }
      setArrow(true);
    } else {
      setPopupType(PopupType.LoginRequired);
      setShowPopup(true);
    }
  };

  const handleModal = () => {
    setEdit(false);
    setAddTaken(false);
    setArrow(false);
  };

  return (
    <>
      <Seo title={'캘린더'} />
      <CalendarContainer>
        <Modal
          expanded={arrow ? 'true' : undefined}
          onClick={() => handleModal()}
        />
        <Layout />
        <MainContent>
          <CalendarSection />
          <EntireDetail expanded={arrow ? 'true' : undefined}>
            <CalandarDatailContainer>
              <ImgContainer onClick={() => setArrow(!arrow)}>
                <Line />
              </ImgContainer>
              <TopContainer onClick={() => setArrow(true)}>
                <DateBox>{days}</DateBox>
                {!edit ? (
                  <Icon
                    icon='uil:edit'
                    width='20px'
                    height='20px'
                    onClick={() => openEdit(true)}
                  />
                ) : (
                  <Icon
                    icon='uil:edit'
                    width='20px'
                    height='20px'
                    style={{ color: '#72bf44' }}
                    onClick={() => openEdit(false)}
                  />
                )}
              </TopContainer>
            </CalandarDatailContainer>
            <DetailContainer>
              <CalendarDetail />
            </DetailContainer>
          </EntireDetail>
        </MainContent>
        {showPopup && (
          <Popup onClose={() => setShowPopup(false)}>
            {PopupContent(popupType, navigate)}
          </Popup>
        )}
        {!edit && maxTime ? (
          <CalendarToast title='저장' str='저장 완료!' />
        ) : null}
      </CalendarContainer>
    </>
  );
};

export default CalendarPage;

const CalendarContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const EntireDetail = styled.div<{ expanded?: string }>`
  position: ${({ expanded }) => (expanded ? 'absolute' : 'relative')};
  bottom: ${({ expanded }) => (expanded ? '80px' : '0')};
  width: 100%;
  height: ${({ expanded }) => (expanded ? '65%' : 'auto')};
  margin-bottom: ${({ expanded }) => (expanded ? 'auto' : '80px')};
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: height 0.7s ease-out, bottom 0.7s ease-out;
  border-top-left-radius: ${({ expanded }) => (expanded ? '20px' : '0')};
  border-top-right-radius: ${({ expanded }) => (expanded ? '20px' : '0')};
  z-index: 10;
`;

const CalandarDatailContainer = styled.div`
  padding: 0px 25px;
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Line = styled.div`
  width: 80px;
  height: 3px;
  background-color: #a9a9a9;
  border-radius: 10px;
  margin-top: 10px;
`;

const DateBox = styled.div`
  font-weight: 500;
  font-size: 14pt;
`;

const DetailContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  width: 100%;
`;

const Modal = styled.div<{ expanded?: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: ${({ expanded }) => (expanded ? '10' : '-1')};
  opacity: ${({ expanded }) => (expanded ? '1' : '0')};
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;
