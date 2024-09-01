import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import useUserStore from '../../store/user';
import { changePassword } from '../../api/authService';
import Loading from '../common/Loading';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import { useNavigate } from 'react-router-dom';
import ValidationError from '../common/ValidationError';

interface FormData {
  email: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

interface BlurState {
  newPassword: boolean;
  newPasswordConfirm: boolean;
}

enum InputType {
  OldPassword = 'oldPassword',
  NewPassword = 'newPassword',
  NewPasswordConfirm = 'newPasswordConfirm'
}

const EditPassword = () => {
  const navigate = useNavigate();
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);
  const user = useUserStore((state) => state.user);
  const [formData, setFormData] = useState<FormData>({
    email: user?.email ?? '',
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  });

  const [blurState, setBlurState] = useState<BlurState>({
    newPassword: false,
    newPasswordConfirm: false
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlurState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    changePassword(
      formData.email,
      formData.oldPassword,
      formData.newPassword,
      () => {
        setLoading(false);
        setPopupType(PopupType.changePasswordSuccess);
      },
      (error) => {
        setLoading(false);
        setPopupType(PopupType.changePasswordFailure);

        console.log(error);
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
      case InputType.OldPassword:
        return '현재 비밀번호';
      case InputType.NewPassword:
        return '새로운 비밀번호 (특수문자 포함 8자리 이상)';
      case InputType.NewPasswordConfirm:
        return '비밀번호 확인';
    }
  };

  const getInputType = (type: InputType) => {
    switch (type) {
      case InputType.OldPassword:
      case InputType.NewPassword:
      case InputType.NewPasswordConfirm:
        return showPassword ? 'text' : 'password';
      default:
        return 'text';
    }
  };

  const getValue = (type: InputType) => {
    switch (type) {
      case InputType.OldPassword:
        return formData.oldPassword;
      case InputType.NewPassword:
        return formData.newPassword;
      case InputType.NewPasswordConfirm:
        return formData.newPasswordConfirm;
      default:
        return '';
    }
  };

  const isFormValid = (): boolean => {
    const { oldPassword, newPassword, newPasswordConfirm } = formData;

    return (
      oldPassword !== '' &&
      newPassword !== '' &&
      newPassword === newPasswordConfirm &&
      newPassword.length >= 8 &&
      checkSpecialCharPattern(newPassword)
    );
  };

  const checkSpecialCharPattern = (str: string): boolean => {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharPattern.test(str);
  };

  const renderInput = (type: InputType) => {
    return (
      <div className='input-container'>
        <input
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
      </div>
    );
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <form onSubmit={handleSubmit}>
          <div>
            <div className='title'>
              안전한 변경을 위해 현재 비밀번호를 입력해 주세요
            </div>
            <div className='login-inputs'>
              {renderInput(InputType.OldPassword)}
            </div>
            <div className='title'>새로운 비밀번호를 입력해주세요</div>

            <div className='login-inputs'>
              {renderInput(InputType.NewPassword)}
              {renderInput(InputType.NewPasswordConfirm)}
              <ValidationError
                condition={
                  blurState.newPassword &&
                  (formData.newPassword.length < 8 ||
                    !checkSpecialCharPattern(formData.newPassword))
                }
              >
                패스워드는 8자리 이상, 특수문자를 포함해 입력해주세요.
              </ValidationError>
              <ValidationError
                condition={
                  blurState.newPassword &&
                  blurState.newPasswordConfirm &&
                  formData.newPassword != formData.newPasswordConfirm
                }
              >
                비밀번호와 비밀번호 확인이 동일하지않습니다.
              </ValidationError>
            </div>
          </div>

          <button
            className='submitButton'
            disabled={!isFormValid()}
            type='submit'
          >
            변경완료
          </button>
        </form>
      </StyledContent>
      {loading && <Loading />}
      {popupType !== PopupType.None && (
        <Popup onClose={() => setPopupType(PopupType.None)}>
          {PopupContent(popupType, navigate)}
        </Popup>
      )}
    </MyPageContainer>
  );
};

const MyPageContainer = styled.div`
  width: 100%;
  height: 70vh;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: 0px 20px 0px 20px;
`;

const StyledContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;

  form {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    font-weight: bold;
  }

  .login-inputs {
    width: 100%;
    padding: 10px 3px 10px 3px;
    margin-bottom: 50px;
    gap: 10px;
    display: flex;
    flex-direction: column;
  }

  .submitButton {
    background-color: #fde72e;
    border: none;
    padding: 12px;
    font-size: 1em;
    font-weight: bold;
    margin-top: auto;
  }

  .submitButton:disabled {
    background-color: #c7c7c7;
  }

  .input-container {
    position: relative;
  }

  input {
    width: 100%;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    padding: 12px;
    padding-right: 60px;
    box-sizing: border-box;
  }

  .clearButton {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
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
`;

export default EditPassword;
