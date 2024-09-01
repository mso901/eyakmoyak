import { useEffect } from 'react';
import styled from 'styled-components';
import { useDateStore } from '../../store/calendar';
import AddPill from './AddPill';
import EditCalendarDatail from './EditCalendarDetail';
import EditPill from './EditPill';
import OpenCalendarDetail from './OpenCalendarDetail';

const CalendarDetail: React.FC = () => {
  const {
    value,
    edit,
    setEdit,
    addTaken,
    setAddTaken,
    editTaken,
    setEditTaken
  } = useDateStore();

  useEffect(() => {
    setEdit(false);
    setAddTaken(false);
    setEditTaken(false);
  }, [value]);

  return (
    <CalandarDatailContainer>
      {editTaken ? (
        <EditPill />
      ) : addTaken ? (
        <AddPill />
      ) : edit ? (
        <EditCalendarDatail />
      ) : (
        <OpenCalendarDetail />
      )}
    </CalandarDatailContainer>
  );
};

const CalandarDatailContainer = styled.div`
  background-color: #ffffff;
  padding: 5px 25px;
  overflow-y: auto;
`;

export default CalendarDetail;
