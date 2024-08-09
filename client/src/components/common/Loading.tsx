import styled, { keyframes } from 'styled-components';

const Loading = () => {
  return (
    <Container>
      <Overlay>
        <AnimationContainer>
          <Image src='/img/loading.png' />
          <LoadingBottom>&nbsp;</LoadingBottom>
        </AnimationContainer>
      </Overlay>
      <Text>
        정보를 불러오는 중이에요 <br /> 잠시만 기다려 주세요
      </Text>
    </Container>
  );
};

const fadeInAndOut = keyframes`
  0% {
    opacity: 0;
    height: 0;
  }
  50% {
    opacity: 1;
    height: 150px;
  }
  100% {
    opacity: 0;
    height: 0;
  }
`;

const Container = styled.div``;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 80%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnimationContainer = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 150px;
  position: relative;
  z-index: 10;
`;

const LoadingBottom = styled.div`
  background-color: #72bf44;
  width: 143.5px;
  height: 110px;
  position: relative;
  left: 3px;
  top: -30px;
  z-index: 5;
  border-bottom-left-radius: 44%;
  border-bottom-right-radius: 44%;

  opacity: 0;
  animation: ${fadeInAndOut} 1s infinite;
`;

const Text = styled.div`
  text-align: center;
  position: absolute;
  bottom: 27%;
  left: 26%;
  font-size: 14pt;
  color: #6f6f6f;
  line-height: 25px;
`;

export default Loading;
