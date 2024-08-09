import { styled } from 'styled-components';

interface WeightProps {
  weight?: number;
}

const Weight = ({ weight }: WeightProps) => {
  return (
    <>
      <Text style={{ fontWeight: '600' }}>{weight}</Text>
      <Unit>&nbsp;kg</Unit>
    </>
  );
};

export default Weight;

const Text = styled.div`
  font-size: 15pt;
`;

const Unit = styled.div`
  font-size: 12pt;
  line-height: 25px;
`;
