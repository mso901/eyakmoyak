import styled from 'styled-components';
import { useCalendar, useDateStore } from '../../store/calendar';
import Info from '../common/Info';
import BloodSugar from './calendarDetails/BloodSugar';
import IsPillTaken from './calendarDetails/IsPillTaken';
import Photo from './calendarDetails/Photo';
import Temperature from './calendarDetails/Temperature';
import Weight from './calendarDetails/Weight';

interface DetailTextBoxProps {
  title: string;
  bloodsugarbefore?: number;
  bloodsugarafter?: number;
  temp?: number;
  weight?: number;
  photo?: string;
}

const DetailTextBox = ({
  title,
  bloodsugarbefore,
  bloodsugarafter,
  temp,
  weight,
  photo
}: DetailTextBoxProps) => {
  const { setArrow } = useDateStore();

  const { nowData } = useCalendar();

  const handleInfoText = () => {
    switch (title) {
      case '혈당':
        return (
          <Info
            text={
              '<p style="color: #23AF51">정상 : <br /> 공복 혈당 100미만, 식후 혈당 140미만 </p><br /> <p style="color: #F78500">관리 필요: <br /> 공복혈당 100이상 126미만, 식후혈당 140이상 200미만</p><br/> <p style="color: #EE3610">당뇨:  <br />공복혈당 126이상, 식후혈당 200이상 </p>'
            }
            category='혈당'
          />
        );
      case '체온':
        return (
          <Info
            text={
              '<p style="color: #72BF44">정상: 35.8 ~ 37.2도 </p> <br /><p style="color: #D8C100">미열: 37.2 ~ 37.9도 </p><br /><p style="color: #F69999">중등도열: 38 ~ 38.9도 </p> <br />  <p style="color: #C20000">고열: 39도 이상</p> '
            }
            category='체온'
          />
        );
      case '사진 기록':
        return (
          <Info
            text={
              '피부 염증처럼 상태를 기록하고 싶은 부분의 사진을 등록해보세요.<br /> 이후 병원 진료에 도움을 받을 수 있어요.'
            }
            category='사진 기록'
          />
        );
      default:
        return null;
    }
  };
  const handleContent = () => {
    switch (title) {
      case '약 복용 여부':
        return <IsPillTaken edit={false} />;
      case '혈당':
        return (
          <BloodSugar
            bloodsugarbefore={bloodsugarbefore}
            bloodsugarafter={bloodsugarafter}
          />
        );
      case '체온':
        return <Temperature temp={temp} />;
      case '체중':
        return <Weight weight={weight} />;
      case '사진 기록':
        return <Photo photo={photo} />;
      default:
        return null;
    }
  };

  const isPill = title === '약 복용 여부';

  const isAllEmpty =
    !nowData?.medications &&
    (nowData?.bloodsugarBefore === undefined ||
      nowData?.bloodsugarBefore === 0) &&
    (nowData?.bloodsugarAfter === undefined ||
      nowData?.bloodsugarAfter === 0) &&
    (nowData?.temperature === undefined || nowData?.temperature === 0) &&
    (nowData?.weight === undefined || nowData?.weight === 0) &&
    (!nowData?.calImg || nowData?.calImg === '');

  return (
    <>
      {!isAllEmpty && (
        <PillContainer isPill={isPill} onClick={() => setArrow(true)}>
          <ContentTitle>
            {title}
            {handleInfoText()}
          </ContentTitle>
          <UnitContainer>{handleContent()}</UnitContainer>
        </PillContainer>
      )}
    </>
  );
};

const PillContainer = styled.div<{ isPill?: boolean }>`
  border: 0.5px #d9d9d9 solid;
  border-radius: 10px;
  padding: 13px 10px;
  margin: 15px 0;
  display: ${({ isPill }) => (isPill ? 'block' : 'flex')};
  justify-content: ${({ isPill }) => (isPill ? 'normal' : 'space-between')};
  cursor: pointer;
`;

const ContentTitle = styled.div`
  font-size: 14pt;
  display: flex;
`;

const UnitContainer = styled.div`
  display: flex;
`;

export default DetailTextBox;
