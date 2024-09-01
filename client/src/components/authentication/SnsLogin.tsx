import { Icon } from '@iconify-icon/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Popup from '../common/popup/Popup';
import { useEffect, useState } from 'react';

const SnsLogin = ({
  onClose,
  onEmailLoginClick,
  onEmailRegisterClick
}: {
  onClose: () => void;
  onEmailLoginClick: () => void;
  onEmailRegisterClick: () => void;
}) => {
  const AUTH_URLS = `http://localhost:3000/api/auth`;
  const [popupMessage, setPopupMessage] = useState<JSX.Element | null>(null);
  const navigate = useNavigate();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const message = query.get('message');

  const makeMessage = (msg: string) => {
    return (
      <div>
        {msg}

        <button onClick={() => navigate('/login')}>확인</button>
      </div>
    );
  };

  useEffect(() => {
    if (message != null) setPopupMessage(makeMessage(message ?? ''));
  }, [message]);

  const SNS_LOGINS = [
    {
      name: 'kakao',
      label: '카카오톡 로그인',
      icon: 'ri:kakao-talk-fill',
      style: { color: '#3A1D1F', marginRight: '10px' },
      iconSize: { width: '1.5rem', height: '1.5rem' }
    },
    {
      name: 'naver',
      label: '네이버 로그인',
      icon: 'simple-icons:naver',
      style: { color: 'white', marginRight: '10px', padding: '5px' },
      iconSize: { width: '1rem', height: '1rem' }
    },
    {
      name: 'google',
      label: '구글 로그인',
      icon: 'logos:google-icon',
      style: { marginRight: '10px', padding: '2px' },
      iconSize: { width: '1.4rem', height: '1.4rem' }
    }
  ];

  return (
    <Content>
      <Link to='/'>
        <Logo src='/img/logo/aside_chick.svg' alt='이약뭐약' />
      </Link>
      <div className='bubble'>⚡ 3초만에 빠른 회원가입</div>
      {SNS_LOGINS.map((sns) => {
        const { name, iconSize, label, ...rest } = sns;

        return (
          <a
            href={`${AUTH_URLS}/${name}`}
            key={name}
            className={`login ${name.toLowerCase()}`}
            onClick={onClose}
          >
            <div className='snsBox'>
              <Icon {...iconSize} {...rest} />
              {label}
            </div>
          </a>
        );
      })}

      <div className='other'>
        <div onClick={onEmailLoginClick}>이메일로 로그인</div>
        <div onClick={onEmailRegisterClick}>이메일로 회원가입</div>
      </div>

      {popupMessage !== null && (
        <Popup
          onClose={() => {
            setPopupMessage(null);
            navigate('/login');
          }}
        >
          {popupMessage}
        </Popup>
      )}
    </Content>
  );
};

const Logo = styled.img`
  height: 75px;
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
  gap: 10px;

  .bubble {
    position: relative;
    box-shadow: 0px 4px 5px 1px rgba(0, 0, 0, 0.1);
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    padding: 10px 20px 10px 20px;
    font-size: 0.8em;
    font-weight: bold;
    margin-bottom: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .bubble::after {
    content: '';
    position: absolute;
    bottom: -15px; /* Adjusted position */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border: 8px solid transparent; /* Reduced size */
    border-top-color: white;
  }

  .login {
    padding: 10px;
    width: 80%;
    border-radius: 5px;
    text-align: center;
    font-weight: 600;
    font-size: 12pt;
    align-items: center;
    display: flex;
    justify-content: center;
    text-decoration: none;
  }

  .login.kakao {
    background-color: #fae100;
    color: #2f3438;
  }

  .snsBox {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .login.naver {
    background-color: #00c73c;
    color: white;
  }

  .login.google {
    background-color: #f2f2f2;
    color: #2f3438;
  }

  .other {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 80px;
    text-decoration: underline;
    font-size: 0.9em;
  }
`;

export default SnsLogin;
