import { styled } from 'styled-components';
import ChangeTextColor from './ChangeTextColor';

interface TemperatureProps {
  temp?: number;
}

const Temperature = ({ temp }: TemperatureProps) => {
  const handleTemperature = () => {
    if (temp !== undefined) {
      const color =
        temp >= 39
          ? '#C20000'
          : temp >= 38
          ? '#F69999'
          : temp >= 37.2
          ? '#D8C100'
          : temp >= 35.8
          ? '#72BF44'
          : '#000000';
      return <ChangeTextColor temp={temp} color={color} />;
    }
  };

  return (
    <>
      {handleTemperature()}
      <Unit>&nbsp;°C</Unit>
    </>
  );
};

export default Temperature;

const Unit = styled.div`
  font-size: 12pt;
  line-height: 25px;
`;
