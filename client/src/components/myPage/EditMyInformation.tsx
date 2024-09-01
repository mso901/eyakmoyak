import styled from 'styled-components';
import BottomPictureSheet from './BottomPictureSheet';
import { Icon } from '@iconify-icon/react';
import { useState } from 'react';
import useUserStore, { LoginType } from '../../store/user';
import Loading from '../common/Loading';
import Popup from '../common/popup/Popup';
import { changeProfileImage, fetchUserProfile } from '../../api/myPageService';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import { useNavigate } from 'react-router-dom';
import Toast from '../common/Toast';

interface Info {
  info: string;
  onClick?: () => void;
}

const EditMyInformation = ({
  onEditNameClick,
  onEditPasswordClick,
  onEditPharmacistClick
}: {
  onEditNameClick: () => void;
  onEditPasswordClick: () => void;
  onEditPharmacistClick: () => void;
}) => {
  const { user } = useUserStore.getState();
  const [bottomSheet, setBottomSheet] = useState(false);
  const [popupType, setPopupType] = useState(PopupType.None);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  let infos1: Info[] = [
    { info: '이메일', onClick: undefined },
    { info: '이름', onClick: onEditNameClick }
  ];

  let infos2: Info[] = [];

  if (user?.loginType == LoginType.none)
    infos1.push({ info: '비밀번호 변경', onClick: onEditPasswordClick });

  if (user?.loginType != LoginType.none)
    infos2.push({ info: '연동된 소셜계정', onClick: undefined });

  if (user?.role) infos2.push({ info: '약사 인증 완료', onClick: undefined });
  else infos2.push({ info: '약사 인증', onClick: onEditPharmacistClick });

  const handleClose = async (file: FileList | null) => {
    if (file !== null) {
      setLoading(true);

      const formData = new FormData();
      formData.append('profileImg', file[0]);
      try {
        await changeProfileImage(
          formData,
          () => {
            fetchUserProfile(() => {
              setToastMessage('프로필사진 수정 완료!');
            });
            setLoading(false);
          },
          (error) => {
            setLoading(false);
            setPopupType(PopupType.ChangeUserProfileImageFailure);
            throw error;
          }
        );
      } catch (error) {
        throw error;
      }
    }
    setBottomSheet(false);
  };

  const getInfoValue = (type: string) => {
    switch (type) {
      case '약사 인증 완료':
        return (
          <img
            src={`/img/pharm.png`}
            style={{ height: '1.5rem' }}
            alt='약사인증'
          />
        );
      case '이름':
        return user?.userName;
      case '이메일':
        return user?.email;
      case '프로필 이미지':
        return user?.profileImg;
      case '연동된 소셜계정': {
        if (user?.loginType == LoginType.kakao)
          return (
            <Icon
              icon='ri:kakao-talk-fill'
              width='1.5rem'
              height='1.5rem'
              style={{ color: '#3A1D1F' }}
            />
          );
        else if (user?.loginType == LoginType.naver)
          return (
            <Icon
              icon='simple-icons:naver'
              width='1.1rem'
              height='1.1rem'
              style={{ color: '#00c73c' }}
            />
          );
        else
          return <Icon icon='devicon:google' width='1.1rem' height='1.1rem' />;
      }
      default:
        return '';
    }
  };

  const generateItems = (infos: Info[]) => {
    const items = [];
    for (let i = 0; i < infos.length; i++) {
      items.push(
        <div key={i}>
          <div className='information-item' onClick={infos[i].onClick}>
            <div className='info-key'>{infos[i].info}</div>
            <div className='info-value'>
              <div>{getInfoValue(infos[i].info)}</div>{' '}
              {infos[i].onClick ? (
                <Icon icon='ep:arrow-right-bold' width='1.1em' height='1.1em' />
              ) : (
                ''
              )}{' '}
            </div>
          </div>
          {i == infos.length - 1 ? '' : <hr />}
        </div>
      );
    }
    return items;
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='thumbnail'>
          <img
            className='thumbnailImage'
            src={user?.profileImg ?? `img/user.svg`}
            alt='프로필 이미지'
          />
          <div className='edit-thumb' onClick={() => setBottomSheet(true)}>
            <Icon icon='solar:camera-bold' width='1.2em' height='1.2em' />
          </div>
        </div>
        <div className='informations'>{generateItems(infos1)}</div>

        <div className='informations'>{generateItems(infos2)}</div>
      </StyledContent>
      <BottomPictureSheet
        title={'사진 등록'}
        isLoading={loading}
        isVisible={bottomSheet}
        onClose={handleClose}
      />
      {popupType !== PopupType.None && (
        <Popup onClose={() => setPopupType(PopupType.None)}>
          {PopupContent(popupType, navigate)}
        </Popup>
      )}
      {loading && <Loading />}
      {toastMessage != '' && (
        <Toast onEnd={() => setToastMessage('')}>{toastMessage}</Toast>
      )}
    </MyPageContainer>
  );
};

const MyPageContainer = styled.div`
  width: 100%;
  overflow: hidden;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding-top: 20px;

  .thumbnail {
    position: relative;
    max-width: 200px;
    max-height: 200px;
    min-width: 100px;
    margin-right: 20px;
    margin-left: 20px;
    color: white;

    .thumbnailImage {
      width: 100%;
      height: 100%;
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }

    .edit-thumb {
      display: grid;
      place-items: center;
      position: absolute;
      width: 40px;
      height: 40px;
      font-size: 1.2em;
      border-radius: 50%;
      background-color: #ccc;
      right: 0;
      bottom: 0;
      border: 3px solid white;
    }
  }

  .informations {
    width: 90%;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;

    .information-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      height: 30px;
      place-items: center;

      .info-key {
        font-size: 1.1em;
        font-weight: 500;
      }

      .info-value {
        display: flex;
        gap: 10px;
        text-align: right;
        color: gray;
      }
    }

    .information-item:hover {
      cursor: pointer;
    }
  }

  .bottom-menu {
    color: gray;
    margin-top: 50px;
    display: flex;
    gap: 10px;
  }
`;

export default EditMyInformation;
