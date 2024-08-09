import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { calendarDelete } from '../../api/calendarApi';
import { useCalendar, useDateStore } from '../../store/calendar';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import EditDetailTextBox from './EditDetailTextBox';

const ContentContainer = styled.div`
  overflow: hidden;
`;

const OpenCalendarDetail: React.FC = () => {
  const { value, setEdit, setArrow } = useDateStore();
  const { setCalImg, setPhoto } = useCalendar();
  const formattedDate = dayjs(value).format('YYYY-MM-DD');
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);
  const navigate = useNavigate();

  const handleDeleteCalender = async () => {
    try {
      const res = await calendarDelete(formattedDate);
      setCalImg('');
      setPhoto(new FormData());
      setEdit(false);
      setArrow(false);
      setPopupType(PopupType.DeleteData);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
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
                handleDeleteCalender();
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
    <ContentContainer>
      <DeleteButtonContainer>
        <DeleteButton onClick={() => setPopupType(PopupType.DeleteData)}>
          전체 삭제
        </DeleteButton>
      </DeleteButtonContainer>
      <EditDetailTextBox title='약 복용 여부' />
      <EditDetailTextBox title='혈당' />
      <EditDetailTextBox title='체온' />
      <EditDetailTextBox title='체중' />
      <EditDetailTextBox title='사진 기록' />
      {popupType !== PopupType.None && (
        <Popup onClose={() => setPopupType(PopupType.None)}>
          {getPopupContent(popupType)}
        </Popup>
      )}
    </ContentContainer>
  );
};

export default OpenCalendarDetail;

const DeleteButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DeleteButton = styled.button`
  border-radius: 10px;
  border: none;
  height: 30px;
  padding: 0 10px;
  background-color: #e8e8e8;
`;
