import styled from 'styled-components';
import { useCalendar, useDateStore } from '../../../store/calendar';

interface IsPillTakenProps {
  edit: boolean;
}

export const convertToArray = (
  value: string | string[] | boolean | boolean[] | undefined
): string[] | boolean[] => {
  if (value === undefined) {
    return [];
  }
  if (typeof value === 'string') {
    return [value];
  }
  if (typeof value === 'boolean') {
    return [value];
  }
  return Array.isArray(value) ? value : [];
};

const IsPillTaken = ({ edit }: IsPillTakenProps) => {
  const { setEditTaken, setIndex } = useDateStore();
  const { nowData } = useCalendar();

  const handleIsTakenPill = (times: string[], takenStatuses: boolean[]) => {
    return times.map((time, index) => (
      <StyledLabel key={index}>
        <StyledInput type='checkbox' checked={takenStatuses[index]} readOnly />
        <Time>{time}</Time>
      </StyledLabel>
    ));
  };

  const handleEditTaken = (index: number) => {
    if (edit) {
      setEditTaken(true);
      setIndex(index);
    }
  };

  return (
    <PillCheck>
      {nowData?.medications &&
        nowData?.medications.map((pill, index) => {
          const times = convertToArray(pill.time) as string[];
          const takenStatuses = convertToArray(pill.taken) as boolean[];

          return (
            <PillRow key={index} onClick={() => handleEditTaken(index)}>
              <div>{pill.name}</div>
              <PillTimeContainer>
                {times.length && takenStatuses.length ? (
                  handleIsTakenPill(times, takenStatuses)
                ) : (
                  <div>시간 데이터 없음</div>
                )}
              </PillTimeContainer>
            </PillRow>
          );
        })}
    </PillCheck>
  );
};

export default IsPillTaken;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  appearance: none;
  border: 1.5px solid gainsboro;
  border-radius: 0.35rem;
  width: 1.5rem;
  height: 1.5rem;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 120% 120%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #72bf44;
  }

  &:not(:checked) {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 120% 120%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #d9d9d9;
  }
`;

const Time = styled.div`
  display: flex;
  align-items: center;
`;

const PillCheck = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PillRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: space-between;
`;

const PillTimeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-left: 10px;
`;
