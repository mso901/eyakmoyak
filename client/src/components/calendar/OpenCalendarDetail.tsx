import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { calendarGet, calendarPost, calendarPut } from '../../api/calendarApi';
import { useCalendar, useDateStore } from '../../store/calendar';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import DetailTextBox from './DetailTextBox';

interface CalendarData {
  medications?: {
    name?: string;
    time?: string[];
    taken?: boolean[];
  }[];
  bloodsugarBefore?: number;
  bloodsugarAfter?: number;
  temperature?: number;
  weight?: number;
  calImg?: string;
}

const OpenCalendarDetail: React.FC = () => {
  const today = dayjs().format('YYYY-MM-DD');
  const login = Cookies.get('login');
  const { calendarData, calImg } = useCalendar();
  const { setArrow, setEdit, value, edit, posted, addPosted } = useDateStore();
  const formattedDate = dayjs(value).format('YYYY-MM-DD');
  const [data, setData] = useState<CalendarData | null>(null);
  const isPosted = posted.some((item) => item.date === formattedDate);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);

  useEffect(() => {
    if (login && isPosted) {
      const fetchPillData = async () => {
        try {
          const fetchedData = await calendarGet(today);
          setData(fetchedData);
          addPosted({ date: formattedDate, post: true });
        } catch (err) {
          console.error('Error fetching pill data:', err);
        }
      };
      fetchPillData();
    }
  }, [login]);

  useEffect(() => {
    const formData = new FormData();
    formData.append('date', formattedDate);
    formData.append(
      'bloodsugarBefore',
      (calendarData?.bloodsugarbefore ?? 0).toString()
    );
    formData.append(
      'bloodsugarAfter',
      (calendarData?.bloodsugarafter ?? 0).toString()
    );
    formData.append(
      'medications',
      JSON.stringify(calendarData?.pillData ?? [])
    );
    formData.append('temperature', (calendarData?.temp ?? 0).toString());
    formData.append('weight', (calendarData?.weight ?? 0).toString());

    formData.append('calImg', calImg?.get('file') as Blob);

    const putData = async () => {
      try {
        let res;
        if (edit) return;

        if (isPosted) {
          res = await calendarPut(formattedDate, formData);
        } else {
          res = await calendarPost(formData);
          addPosted({ date: formattedDate, post: true });
        }

        setData(res);
      } catch (err) {
        console.error('수정 에러:', err);
      }
    };
    putData();
  }, [edit]);

  useEffect(() => {
    if (login && isPosted) {
      const fetchPillData = async () => {
        try {
          const fetchedData = await calendarGet(formattedDate);
          setData(fetchedData);
        } catch (err) {
          console.error('Error fetching pill data:', err);
        }
      };
      fetchPillData();
    } else if (!isPosted) {
      setData(null);
    }
  }, [formattedDate, edit, isPosted, login]);

  const hasContent = (name: string) => {
    switch (name) {
      case 'medications':
        return data?.medications && data.medications.length > 0;
      case 'bloodsugarBefore':
        return (
          data?.bloodsugarBefore !== undefined && data.bloodsugarBefore !== 0
        );
      case 'bloodsugarAfter':
        return (
          data?.bloodsugarAfter !== undefined && data.bloodsugarAfter !== 0
        );
      case 'temperature':
        return data?.temperature !== undefined && data.temperature !== 0;
      case 'weight':
        return data?.weight !== undefined && data.weight !== 0;
      case 'calImg':
        return data?.calImg !== undefined && data.calImg !== null;
      default:
        return false;
    }
  };

  const detailBoxes = [
    {
      title: '약 복용 여부',
      name: 'medications',
      component: (
        <DetailTextBox title='약 복용 여부' pillData={data?.medications} />
      )
    },
    {
      title: '혈당',
      name: 'bloodsugarBefore',
      component: (
        <DetailTextBox
          title='혈당'
          bloodsugarbefore={data?.bloodsugarBefore}
          bloodsugarafter={data?.bloodsugarAfter}
        />
      )
    },
    {
      title: '체온',
      name: 'temperature',
      component: <DetailTextBox title='체온' temp={data?.temperature} />
    },
    {
      title: '체중',
      name: 'weight',
      component: <DetailTextBox title='체중' weight={data?.weight} />
    },
    {
      title: '사진 기록',
      name: 'calImg',
      component: <DetailTextBox title='사진 기록' photo={data?.calImg} />
    }
  ];

  const isAllEmpty =
    (!data?.medications || data.medications.length === 0) &&
    !data?.bloodsugarBefore &&
    !data?.bloodsugarAfter &&
    !data?.temperature &&
    !data?.weight &&
    (!data?.calImg || data.calImg === '');

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
