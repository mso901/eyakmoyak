import { styled } from 'styled-components';

interface ColorTextProps {
  temp?: number;
  fasted?: number;
  afterMeals?: number;
  color: string;
}

const ChangeTextColor = ({
  color,
  temp,
  fasted,
  afterMeals
}: ColorTextProps) => {
  return (
    <TextContainer>
      {fasted !== undefined && (
        <Text style={{ fontSize: '13pt', lineHeight: '25px' }}>
          공복 혈당:&nbsp;
        </Text>
      )}
      {afterMeals !== undefined && (
        <Text style={{ fontSize: '13pt', lineHeight: '25px' }}>
          식후 혈당:&nbsp;
        </Text>
      )}
      <Text style={{ color, fontWeight: '600' }}>
        {temp !== undefined && <Text>{temp}</Text>}
        {fasted !== undefined && <Blood>{fasted}</Blood>}
        {afterMeals !== undefined && <Blood>{afterMeals}</Blood>}
      </Text>
      {(fasted !== undefined || afterMeals !== undefined) && (
        <Unit>&nbsp;mg/dL</Unit>
      )}
    </TextContainer>
  );
};

export default ChangeTextColor;

const Blood = styled.div`
  font-size: 15pt;
  width: 40px;
  text-align: center;
`;

const TextContainer = styled.div`
  display: flex;
`;

const Text = styled.div`
  font-size: 15pt;
`;

const Unit = styled.div`
  font-size: 12pt;
  line-height: 25px;
`;
