import { Icon } from '@iconify-icon/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { requestEmailVerification, signup } from '../../api/authService';
import Loading from '../common/Loading';
import ValidationError from '../common/ValidationError';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';

interface FormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

interface BlurState {
  email: boolean;
  name: boolean;
  password: boolean;
  confirmPassword: boolean;
}

enum InputType {
  Email = 'email',
  Name = 'name',
  Password = 'password',
  ConfirmPassword = 'confirmPassword'
}

const Register = () => {
  const navigate = useNavigate();
  const inputKeys = Object.keys(InputType) as Array<keyof typeof InputType>;

  const [loading, setLoading] = useState(false);
  const [popupType, setPopupType] = useState(PopupType.None);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });

  const [blurState, setBlurState] = useState<BlurState>({
    email: false,
    name: false,
    password: false,
    confirmPassword: false
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlurState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    signup(
      formData.email,
      formData.name,
      formData.password,
      formData.confirmPassword,
      () => {
        setLoading(false);
        setPopupType(PopupType.RegistrationSuccess);
      },
      () => {
        setLoading(false);
        setPopupType(PopupType.RegistrationFailure);
      }
    );
  };

  const clearData = (name: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: ''
    }));
  };

  const getPlaceholder = (type: InputType) => {
    switch (type) {
      case InputType.Name:
        return '이름 (3~20자)';
      case InputType.Email:
        return '이메일 주소';
      case InputType.Password:
        return '비밀번호 (특수문자 포함 8자리 이상)';
      case InputType.ConfirmPassword:
        return '비밀번호 확인';
    }
  };

  const getInputType = (type: InputType) => {
    switch (type) {
      case InputType.Email:
        return 'email';
      case InputType.Password:
      case InputType.ConfirmPassword:
        return showPassword ? 'text' : 'password';
      default:
        return 'text';
    }
  };

  const getValue = (type: InputType) => {
    switch (type) {
      case InputType.Name:
        return formData.name;
      case InputType.Email:
        return formData.email;
      case InputType.Password:
        return formData.password;
      case InputType.ConfirmPassword:
        return formData.confirmPassword;
      default:
        return '';
    }
  };

  const isFormValid = (): boolean => {
    const { email, name, password, confirmPassword } = formData;

    return (
      email !== '' &&
      name !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      password === confirmPassword &&
      name.length >= 3 &&
      name.length < 20 &&
      password.length >= 8 &&
      checkSpecialCharPattern(password) &&
      checkEmailPattern(email)
    );
  };

  const checkSpecialCharPattern = (str: string): boolean => {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharPattern.test(str);
  };

  const checkEmailPattern = (str: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
  };

  const getInputRightPadding = (type: InputType) => {
    switch (type) {
      case InputType.Email:
        return 100;
      case InputType.Password:
      case InputType.ConfirmPassword:
        return 60;
      default:
        return 30;
    }
  };

  const isEmailInvalid = () => {
    return blurState.email && !checkEmailPattern(formData.email);
  };

  const isNameInvalid = () => {
    return blurState.name && formData.name.length < 3;
  };

  const isPasswordInvalid = () => {
    return (
      blurState.password &&
      (formData.password.length < 8 ||
        !checkSpecialCharPattern(formData.password))
    );
  };

  const isConfirmPasswordInvalid = () => {
    return (
      blurState.password &&
      blurState.confirmPassword &&
      formData.password != formData.confirmPassword
    );
  };

  const checkInvalid = (type: InputType) => {
    if (type == InputType.Email) return isEmailInvalid();
    else if (type == InputType.Name) return isNameInvalid();
    else if (type == InputType.Password) return isPasswordInvalid();
    else if (type == InputType.ConfirmPassword)
      return isConfirmPasswordInvalid();
  };

  const renderInput = (type: InputType, showHr: boolean) => {
    return (
      <div className='input-container' key={type}>
        <input
          style={{
            paddingRight: `${getInputRightPadding(type)}px`,
            backgroundColor: checkInvalid(type) ? 'rgba(255, 0, 0, 0.1)' : ''
          }}
          type={getInputType(type)}
          name={type}
          placeholder={getPlaceholder(type)}
          value={getValue(type)}
          onChange={handleChange}
          required
          onBlur={handleBlur}
        />
        <Icon
          className='input-left-btn'
          icon='pajamas:clear'
          width='1rem'
          height='1rem'
          style={{
            color: 'gray',
            display: getValue(type).trim().length > 0 ? '' : 'none'
          }}
          onClick={() => clearData(type)}
        />

        {(type === InputType.Password ||
          type === InputType.ConfirmPassword) && (
          <Icon
            className='input-left-btn input-left-second'
            icon={showPassword ? 'mdi:show' : 'mdi:hide'}
            width='1.2rem'
            height='1.2rem'
            style={{
              color: 'gray',
              display: getValue(type).trim().length > 0 ? '' : 'none'
            }}
            onClick={() => setShowPassword(!showPassword)}
          />
        )}

        {type === InputType.Email && (
          <div
            className='input-left-btn input-left-second text-btn'
            onClick={() => {
              setLoading(true);
              requestEmailVerification(
                formData.email,
                () => {
                  setLoading(false);
                  setPopupType(PopupType.VerificationEmailSentSuccess);
                },
                () => {
                  setLoading(false);
                  setPopupType(PopupType.VerificationEmailSentFailure);
                }
              );
            }}
          >
            인증하기
          </div>
        )}
        {showHr && <hr />}
      </div>
    );
  };

  return (
    <Overlay>
      <Icon
        className='topClose'
        onClick={() => {
          navigate(-1);
        }}
        icon='material-symbols:close'
        width='1.7rem'
        height='1.7rem'
        style={{ color: 'black' }}
      />

      <Content>
        <Link to='/'>
          <Logo src='/img/logo/big_chick.svg' alt='이약뭐약' />
        </Link>
        <div className='title'>
          간편하게 가입하고 <br /> 다양한 서비스를 이용하세요.
        </div>
        <form onSubmit={handleSubmit}>
          <div className='login-inputs'>
            {inputKeys.map((key, index) =>
              renderInput(InputType[key], index < inputKeys.length - 1)
            )}
          </div>

          <div className='errors'>
            <ValidationError condition={isEmailInvalid()}>
              이메일 형식이 올바르지않습니다.
            </ValidationError>
            <ValidationError condition={isNameInvalid()}>
              이름은 3글자 이상 입력해주세요.
            </ValidationError>
            <ValidationError condition={isPasswordInvalid()}>
              패스워드는 8자리 이상, 특수문자를 포함해 입력해주세요.
            </ValidationError>
            <ValidationError condition={isConfirmPasswordInvalid()}>
              비밀번호와 비밀번호 확인이 동일하지않습니다.
            </ValidationError>
          </div>

          <button
            className='submitButton'
            disabled={!isFormValid()}
            type='submit'
          >
            시작하기
          </button>
        </form>
      </Content>
      {loading && <Loading />}
      {popupType !== PopupType.None && (
        <Popup onClose={() => setPopupType(PopupType.None)}>
          {PopupContent(popupType, navigate)}
        </Popup>
      )}
    </Overlay>
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
  gap: 20px;

  .topClose {
    top: 10px;
    left: 10px;
    padding-left: 10px;
    padding-top: 10px;
    background: none;
    border: none;
    font-size: 24px;
    color: #333;
  }
`;

const Logo = styled.img`
  width: 100px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Content = styled.div`
  height: 100%;
  margin-top: 100px;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-content: center;
  gap: 20px;
  width: 100%;

  .errors {
    display: flex;
    flex-direction: column;
  }

  .title {
    margin-bottom: 10px;
    text-align: center;
    font-style: 14px;
    font-weight: 500;
  }

  .other {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 30px;
    text-decoration: underline;
    font-size: 0.9em;
  }

  form {
    width: 80%;
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
    top: 10%;
    right: 0;
    transform: translatex(30%);
    cursor: pointer;
  }

  .text-btn {
    font-size: 0.9rem;
    background-color: #ccc;
    color: white;
    border-radius: 10px;
    padding: 3px;
  }

  .input-left-second {
    right: 35px;
  }

  .login-inputs {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px 3px 10px 3px;
    margin-bottom: 20px;
  }

  .submitButton {
    position: absolute;
    bottom: 0;
    left: 0;
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
`;

export default Register;
