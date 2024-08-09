import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <NotFoundImg src='/404.png' alt='404 Not Found' />
      <Content className='main'>앗! 페이지가 없어요</Content>
      <Content className='sub'>
        요청하신 페이지가 존재하지 않거나, 이름이 변경되었거나, <br />
        일시적으로 사용이 중단되었어요.
      </Content>
      <ButtonContainer>
        <Button className='pre' onClick={() => navigate(-1)}>
          이전 페이지
        </Button>
        <Button className='home' onClick={() => navigate('/')}>
          이약뭐약 홈
        </Button>
      </ButtonContainer>
    </NotFoundContainer>
  );
};

export default NotFound;

const NotFoundContainer = styled.div`
  padding: 16vh 5vw;
  text-align: center;
`;

const NotFoundImg = styled.img`
  width: 80%;
`;

const Content = styled.div`
  color: #6f6f6f;

  &.main {
    font-size: 20pt;
  }
  &.sub {
    font-size: 10pt;
    margin-top: 20px;
    margin-bottom: 25%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Button = styled.button`
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 11pt;

  &.pre {
    border: #72bf44 solid;
    color: #72bf44;
    background-color: #ffffff;
  }

  &.home {
    border: none;
    background-color: #72bf44;
    color: #ffffff;
  }
`;
