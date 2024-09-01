import { useEffect } from 'react';
import { useCalendar } from '../../../store/calendar';
import ChangeTextColor from './ChangeTextColor';

interface BloodSugarProps {
  bloodsugarbefore?: number;
  bloodsugarafter?: number;
}

const BloodSugar = ({ bloodsugarbefore, bloodsugarafter }: BloodSugarProps) => {
  const { setBloodSugarBefore, setBloodSugarAfter } = useCalendar();

  useEffect(() => {
    if (bloodsugarbefore !== undefined) {
      setBloodSugarBefore(bloodsugarbefore);
    }
    if (bloodsugarafter !== undefined) {
      setBloodSugarAfter(bloodsugarafter);
    }
  }, [
    bloodsugarbefore,
    bloodsugarafter,
    setBloodSugarBefore,
    setBloodSugarAfter
  ]);

  const getBloodSugarColor = (value: number, isFasted: boolean) => {
    if (isFasted) {
      return value < 100 ? '#23AF51' : value < 126 ? '#F78500' : '#EE3610';
    } else {
      return value < 140 ? '#23AF51' : value < 200 ? '#F78500' : '#EE3610';
    }
  };

  const handleBloodSugar = (isAfter: boolean) => {
    if (isAfter && bloodsugarafter !== undefined) {
      const color = getBloodSugarColor(bloodsugarafter, false);
      return <ChangeTextColor color={color} afterMeals={bloodsugarafter} />;
    }

    if (!isAfter && bloodsugarbefore !== undefined) {
      const color = getBloodSugarColor(bloodsugarbefore, true);
      return <ChangeTextColor color={color} fasted={bloodsugarbefore} />;
    }

    return null;
  };

  return (
    <div>
      {bloodsugarbefore !== null && handleBloodSugar(false)}
      {bloodsugarafter !== null && handleBloodSugar(true)}
    </div>
  );
};

export default BloodSugar;
