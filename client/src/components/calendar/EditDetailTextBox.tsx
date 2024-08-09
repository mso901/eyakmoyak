import { Icon } from '@iconify-icon/react';
import styled from 'styled-components';
import { useCalendar, useDateStore } from '../../store/calendar';
import EditDetailPhoto from './EditDetailPhoto';
import IsPillTaken from './calendarDetails/IsPillTaken';

interface EditDetailTextBoxProps {
  title: string;
}

const EditDetailTextBox = ({ title }: EditDetailTextBoxProps) => {
  const {
    nowData,
    setBloodSugarAfter,
    setBloodSugarBefore,
    setTemperature,
    setWeight
  } = useCalendar();

  const { setAddTaken } = useDateStore();

  const renderSimpleInput = (
    label: string,
    value: number | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    unit: string,
    handleDelete: (label: string) => void
  ) => (
    <UnitContainer>
      {(label === '공복 혈당' || label === '식후 혈당') && (
        <Text style={{ fontSize: '13pt', lineHeight: '25px' }}>
          {label}: &nbsp;
        </Text>
      )}
      <TextInput
        value={value ?? ''}
        onChange={onChange}
        type='number'
        step='any'
      />
      <Unit>&nbsp;{unit}</Unit>
      <Icon
        icon='iconoir:delete-circle'
        style={{ marginTop: '5px', marginLeft: '5px' }}
        onClick={() => handleDelete(label)}
      />
    </UnitContainer>
  );

  const handleContent = (title: string) => {
    switch (title) {
      case '약 복용 여부':
        return (
          <UnitContainer>
            <PillCheck>
              <IsPillTaken edit={true} />
            </PillCheck>
          </UnitContainer>
        );
      case '혈당':
        return (
          <TextContainer>
            {renderSimpleInput(
              '공복 혈당',
              nowData?.bloodsugarBefore ?? null,
              (e) => setBloodSugarBefore(parseInt(e.target.value)),
              'mg/dL',
              handleDeleteField
            )}
            {renderSimpleInput(
              '식후 혈당',
              nowData?.bloodsugarAfter ?? null,
              (e) => setBloodSugarAfter(parseInt(e.target.value)),
              'mg/dL',
              handleDeleteField
            )}
          </TextContainer>
        );
      case '체온':
        return (
          <>
            {renderSimpleInput(
              '체온',
              nowData?.temperature ?? null,
              (e) => setTemperature(parseFloat(e.target.value)),
              '°C',
              handleDeleteField
            )}
          </>
        );

      case '체중':
        return (
          <>
            {renderSimpleInput(
              '체중',
              nowData?.weight ?? null,
              (e) => setWeight(parseFloat(e.target.value)),
              'kg',
              handleDeleteField
            )}
          </>
        );
      case '사진 기록':
        return (
          <UnitContainer className='photo'>
            <EditDetailPhoto />
          </UnitContainer>
        );
      default:
        return null;
    }
  };

  const handleDeleteField = (label: string) => {
    switch (label) {
      case '공복 혈당':
        setBloodSugarBefore(0);
        break;
      case '식후 혈당':
        setBloodSugarAfter(0);
        break;
      case '체온':
        setTemperature(0);
        break;
      case '체중':
        setWeight(0);
        break;
      default:
        break;
    }
  };

  const isPill = title === '약 복용 여부';

  return (
    <Container isPill={isPill}>
      <ContentTitle>
        {title}
        {isPill ? (
          <Icon
            icon='f7:plus-app'
            width='25px'
            onClick={() => setAddTaken(true)}
          />
        ) : null}
      </ContentTitle>
      {handleContent(title)}
      {isPill &&
      (!nowData?.medications || nowData?.medications.length === 0) ? (
        <div
          style={{
            textAlign: 'center',
            fontSize: '10pt',
            color: '#a9a9a9'
          }}
        >
          복용 여부를 확인할 약을 추가해주세요
        </div>
      ) : null}
    </Container>
  );
};

export default EditDetailTextBox;
const Container = styled.div<{ isPill?: boolean }>`
  border: 0.5px #d9d9d9 solid;
  border-radius: 10px;
  padding: 13px 10px;
  margin: 15px 0;
  display: ${({ isPill }) => (isPill ? 'block' : 'flex')};
  justify-content: ${({ isPill }) => (isPill ? 'normal' : 'space-between')};
`;

const ContentTitle = styled.div`
  font-size: 14pt;
  display: flex;
  justify-content: space-between;
`;

const UnitContainer = styled.div`
  display: flex;

  &.photo {
    justify-content: space-between;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextInput = styled.input`
  width: 50px;
  height: 17px;
  font-size: 15pt;
  border: #d9d9d9 solid;
  border-radius: 8px;
  text-align: center;
`;

const Unit = styled.div`
  font-size: 12pt;
  line-height: 25px;
`;

const Text = styled.div`
  font-size: 15pt;
`;

const PillCheck = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
