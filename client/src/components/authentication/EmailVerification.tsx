import styled from 'styled-components';
import Seo from '../common/Seo';

const EmailVerification = () => {
  return (
    <>
      <Seo title={'이메일 인증'} />
      <Overlay>
        <Content>
          <Logo src='/img/logo.svg' alt='이약뭐약' />
          <div className='title'>
            이메일 인증이 완료되었습니다. <br />
            회원가입을 계속 진행해주세요.
          </div>
        </Content>
      </Overlay>
    </>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  transition: opacity 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 20px;
`;

const Logo = styled.img`
  height: 80px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  align-content: center;
  gap: 50px;
  width: 100%;

  .title {
    text-align: center;
    font-weight: 500;
  }
`;

export default EmailVerification;
