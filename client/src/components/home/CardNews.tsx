import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const News1 = ({
  onClick
}: {
  onClick: React.MouseEventHandler<HTMLImageElement>;
}) => (
  <NewsImage num={1} onClick={onClick}>
    <img src={`/img/cardNews/news1_1.png`} alt='News 1' />
  </NewsImage>
);

const News2 = ({
  onClick
}: {
  onClick: React.MouseEventHandler<HTMLImageElement>;
}) => (
  <NewsImage num={2} onClick={onClick}>
    <img src={`/img/cardNews/news2_1.png`} alt='News 2' />
  </NewsImage>
);

const News3 = ({
  onClick
}: {
  onClick: React.MouseEventHandler<HTMLImageElement>;
}) => (
  <NewsImage num={3} onClick={onClick}>
    <img src={`/img/cardNews/news3_1.png`} alt='News 3' />
  </NewsImage>
);

const CardNews: React.FC = () => {
  const navigate = useNavigate();
  // 카드뉴스 열기
  const openCardNews = (num: number) => () => {
    navigate(`/news/${num}`);
  };

  return (
    <Container>
      <Title>
        <News />
        뭐약뉴스
      </Title>
      <Explanation>이약뭐약에서 제공하는 카드뉴스입니다</Explanation>
      <Contents>
        <News1 onClick={openCardNews(1)} />
        <News2 onClick={openCardNews(2)} />
        <News3 onClick={openCardNews(3)} />
      </Contents>
    </Container>
  );
};

const Container = styled.div`
  margin: 8vh 8vw;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const News = styled.img.attrs({
  src: `/img/news.png`,
  alt: 'News Icon'
})`
  width: 5.5vw;
  height: auto;
  margin-top: 2%;
  margin-right: 2%;
`;

const Explanation = styled.div`
  font-size: 1rem;
  font-weight: 300;
  margin: 5px 0;
  color: #6c6b6b;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface NewsImageProps {
  num: number;
}

const NewsImage = styled.div<NewsImageProps>`
  position: relative;
  width: 90%;
  height: auto;
  margin-top: 10%;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    transition: transform 0.5s ease-in-out;
  }

  &:hover img {
    transform: scale(1.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ num }) => `url(/img/cardNews/back${num}.png)`} no-repeat
      center center / cover;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    z-index: 1;
  }

  &:hover::before {
    opacity: 1;
  }
`;

export default CardNews;
