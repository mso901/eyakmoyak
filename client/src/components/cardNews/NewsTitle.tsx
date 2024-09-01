import styled from 'styled-components';
import '../../assets/font/font.css';

const NewsTitleContainer = styled.div`
  width: 100vw;
  height: 11vh;
  background-color: #ffeb41;
  display: flex;
  justify-content: space-around;
`;

const Title = styled.div`
  padding-top: 2.5vh;
`;

const BigTitle = styled.div`
  font-weight: 800;
  font-size: 1.5rem;
`;

const SmallTitle = styled.div`
  font-weight: 500;
`;

const SmallImg = styled.img`
  width: 55px;
  height: 55px;
`;

const BigImg = styled.img`
  width: 75px;
  height: 50px;
`;

interface NewsTitleProps {
  bigTitle: string;
  smallTitle: string;
  images: string[];
}

const NewsTitle = ({ bigTitle, smallTitle, images }: NewsTitleProps) => {
  const [src, alt] = images;
  return (
    <NewsTitleContainer>
      <Title>
        <BigTitle>{bigTitle}</BigTitle>
        <SmallTitle>{smallTitle}</SmallTitle>
      </Title>
      <Title>
        {bigTitle === '올바른 약 복용법' ? (
          <BigImg src={src} alt={alt} />
        ) : (
          <SmallImg src={src} alt={alt} />
        )}
      </Title>
    </NewsTitleContainer>
  );
};

export default NewsTitle;
