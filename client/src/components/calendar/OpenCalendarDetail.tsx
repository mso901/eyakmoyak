import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { calendarGet } from '../../api/calendarApi';
import { useCalendar, useDateStore } from '../../store/calendar';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import DetailTextBox from './DetailTextBox';

const OpenCalendarDetail: React.FC = () => {
  const login = Cookies.get('login');
  const { calendarEntries, nowData, setNowData } = useCalendar();
  const { setArrow, setEdit, value } = useDateStore();
  const formattedDate = dayjs(value).format('YYYY-MM-DD');
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);

  useEffect(() => {
    const getTodayData = async () => {
      try {
        const res = await calendarGet(formattedDate);
        setNowData(res);
      } catch (err) {
        console.log(err);
      }
    };
    getTodayData();
  }, []);

  useEffect(() => {
    const matchedEntry = calendarEntries.find(
      (entry) => dayjs(entry.date).format('YYYY-MM-DD') === formattedDate
    );
    if (matchedEntry !== nowData) {
      setNowData(matchedEntry || null);
    }
  }, [value]);

  const hasContent = (name: string) => {
    switch (name) {
      case 'medications':
        return nowData?.medications && nowData.medications.length > 0;
      case 'bloodsugarBefore':
        return (
          nowData?.bloodsugarBefore !== undefined &&
          nowData.bloodsugarBefore !== 0
        );
      case 'bloodsugarAfter':
        return (
          nowData?.bloodsugarAfter !== undefined &&
          nowData.bloodsugarAfter !== 0
        );
      case 'temperature':
        return nowData?.temperature !== undefined && nowData.temperature !== 0;
      case 'weight':
        return nowData?.weight !== undefined && nowData.weight !== 0;
      case 'calImg':
        return nowData?.calImg !== undefined && nowData.calImg !== null;
      default:
        return false;
    }
  };

  const detailBoxes = [
    {
      title: '약 복용 여부',
      name: 'medications',
      component: <DetailTextBox title='약 복용 여부' />
    },
    {
      title: '혈당',
      name: 'bloodsugarBefore',
      component: (
        <DetailTextBox
          title='혈당'
          bloodsugarbefore={nowData?.bloodsugarBefore}
          bloodsugarafter={nowData?.bloodsugarAfter}
        />
      )
    },
    {
      title: '체온',
      name: 'temperature',
      component: <DetailTextBox title='체온' temp={nowData?.temperature} />
    },
    {
      title: '체중',
      name: 'weight',
      component: <DetailTextBox title='체중' weight={nowData?.weight} />
    },
    {
      title: '사진 기록',
      name: 'calImg',
      component: <DetailTextBox title='사진 기록' photo={nowData?.calImg} />
    }
  ];

  const isAllEmpty =
    (!nowData?.medications || nowData.medications.length === 0) &&
    !nowData?.bloodsugarBefore &&
    !nowData?.bloodsugarAfter &&
    !nowData?.temperature &&
    !nowData?.weight &&
    (!nowData?.calImg || nowData.calImg === '');

  const openEdit = () => {
    if (login) {
      setEdit(true);
      setArrow(true);
    } else {
      setPopupType(PopupType.LoginRequired);
      setShowPopup(true);
    }
  };

  return (
    <ContentContainer>
      {isAllEmpty ? (
        <Empty onClick={() => openEdit()}>
          건강 정보 없음. 추가하려면 탭 하세요.
        </Empty>
      ) : (
        detailBoxes.map(
          (box, index) =>
            hasContent(box.name) && <div key={index}>{box.component}</div>
        )
      )}
      {showPopup && (
        <Popup onClose={() => setShowPopup(false)}>
          {PopupContent(popupType, navigate)}
        </Popup>
      )}
    </ContentContainer>
  );
};

export default OpenCalendarDetail;

const ContentContainer = styled.div`
  padding-bottom: 88px;
`;

const Empty = styled.div`
  border-radius: 10px;
  background-color: #ececec;
  border: #d9d9d9 solid 0.5px;
  height: 50px;
  padding-left: 10px;
  line-height: 50px;
  font-size: 10.5pt;
  margin-top: 10px;
  color: #9b9a9a;
  cursor: pointer;
`;
