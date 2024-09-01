import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { login, fetchUserInformation } from '../../api/authService';
import { Link, useNavigate } from 'react-router-dom';
import Popup from '../common/popup/Popup';
import Loading from '../common/Loading';
import { getAlarms } from '../../api/alarmApi';
import { useAlarmStore } from '../../store/alarm';
import { fetchExpiredPills } from '../../api/myMedicineApi';
import { useMyPillStore } from '../../store/myPill';

const EmailLogin = ({
  onRegisterClick,
  onResetPasswordClick
}: {
  onRegisterClick: () => void;
  onResetPasswordClick: () => void;
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailButtonEnabled, setIsEmailButtonEnabled] =
    useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [isPasswordButtonEnabled, setIsPasswordButtonEnabled] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState('');
  const { setAlarms } = useAlarmStore();
  const { setPills } = useMyPillStore();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailButtonEnabled(value.trim().length > 0);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordButtonEnabled(value.trim().length > 0);
  };

  useEffect(() => {
    setIsEmailButtonEnabled(email.trim().length > 0);
    setIsPasswordButtonEnabled(password.trim().length > 0);
    return () => {};
  }, [email, password]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    login(
      email,
      password,
      () => {
        fetchUserInformation(() => {
          onFetchUserInformationSucceed();
        });
      },
      () => {
        setLoading(false);
        setPopupMessage(
          '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.'
        );
      }
    );
  };

  const onFetchUserInformationSucceed = async () => {
    try {
      const data = await getAlarms();
      setAlarms(data);
    } catch {}

    try {
      const expiredPills = await fetchExpiredPills();
      setPills(expiredPills);
    } catch {}

    setLoading(false);
    navigate('/');
  };

  return (
    <Content>
      <Link to='/'>
        <Logo src='/img/logo/big_chick.svg' alt='이약뭐약' />
      </Link>
      <form onSubmit={handleSubmit}>
        <div className='login-inputs'>
          <div className='input-container'>
            <input
              type='email'
              placeholder='이메일 주소'
              value={email}
              onChange={handleEmailChange}
            />
            <Icon
              className='input-left-btn'
              icon='pajamas:clear'
              width='1rem'
              height='1rem'
              style={{
                color: 'gray',
                display: isEmailButtonEnabled ? '' : 'none'
              }}
              onClick={() => setEmail('')}
            />
          </div>

          <hr />

          <div className='input-container'>
            <input
              className='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='비밀번호'
              value={password}
              onChange={handlePasswordChange}
            />
            <Icon
              className='input-left-btn'
              icon='pajamas:clear'
              width='1rem'
              height='1rem'
              style={{
                color: 'gray',
                display: isPasswordButtonEnabled ? '' : 'none'
              }}
              onClick={() => setPassword('')}
            />
            <Icon
              className='input-left-btn input-left-second'
              icon={showPassword ? 'mdi:show' : 'mdi:hide'}
              width='1.2rem'
              height='1.2rem'
              style={{
                color: 'gray',
                display: isPasswordButtonEnabled ? '' : 'none'
              }}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className='other'>
          <div onClick={onResetPasswordClick}>비밀번호 찾기</div>
          <div onClick={onRegisterClick}>이메일로 회원가입</div>
        </div>

        <button
          className='submitButton'
          disabled={!isEmailButtonEnabled || !isPasswordButtonEnabled}
          type='submit'
        >
          시작하기
        </button>
      </form>

      {popupMessage !== '' && (
        <Popup onClose={() => setPopupMessage('')}>{popupMessage}</Popup>
      )}
      {loading && <Loading />}
    </Content>
  );
};

const Logo = styled.img`
  width: 120px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Content = styled.div`
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-content: center;
  gap: 20px;
  margin-top: -50px;

  .other {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 30px;
    text-decoration: underline;
    font-size: 0.9em;
  }

  .input-container {
    position: relative;
  }

  input {
    width: 100%;
    border: none;
    border-radius: 4px;
    padding: 8px 3px 8px 3px;
    padding-right: 30px;
    box-sizing: border-box;
  }

  .password {
    padding-right: 60px;
  }

  .input-left-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .input-left-second {
    right: 35px;
  }

  .login-inputs {
    width: 80%;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px 3px 10px 3px;
    margin-bottom: 20px;
  }

  .submitButton {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #fde72e;
    border: none;
    padding: 12px;
    font-size: 1em;
    font-weight: bold;
  }

  .submitButton:disabled {
    background-color: #c7c7c7;
  }

  form {
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    align-content: center;
    gap: 20px;
  }
`;

export default EmailLogin;
