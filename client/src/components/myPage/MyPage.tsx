import styled from 'styled-components';
import Header from '../common/Header';
import EditMyInformation from './EditMyInformation';
import EditName from './EditName';
import EditPassword from './EditPassword';
import EditPharmacist from './EditPharmacist';
import FavoriteMedications from './FavoriteMedications';
import ManageReviews from './ManageReviews';
import MyInformation from './MyInformation';
import MyMedications from './MyMedications';
import Seo from '../common/Seo';

import { Icon } from '@iconify-icon/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount, logout } from '../../api/authService';
import { useChatBot } from '../../store/chatbot';
import useUserStore from '../../store/user';
import Loading from '../common/Loading';
import Nav from '../common/Nav';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import { useMyPillStore } from '../../store/myPill';
import { useAllAlarmStore } from '../../store/allAlarms';

enum pageState {
  Main,
  EditInfo,
  EditName,
  EditPassword,
  EditPharmacist,
  MyMedications,
  FavoriteMedications,
  ManageReviews
}

const MyPage = () => {
  const [currentState, setCurrentState] = useState(pageState.Main);
  const { user } = useUserStore.getState();
  const [popupType, setPopupType] = useState(PopupType.None);
  const [loading, setLoading] = useState(false);
  const { deleteChat } = useChatBot();
  const { clearAllPills } = useMyPillStore();
  const { clearAllAlarms } = useAllAlarmStore();

  const navigate = useNavigate();

  const renderContent = () => {
    switch (currentState) {
      case pageState.EditInfo:
      case pageState.EditName:
      case pageState.EditPassword:
      case pageState.EditPharmacist:
      case pageState.MyMedications:
      case pageState.FavoriteMedications:
      case pageState.ManageReviews:
        return (
          <div>
            {renderPageTitle(currentState)}
            {renderStatePage(currentState)}
          </div>
        );

      default:
        return (
          <StyledContent>
            <MyInformation
              onEditInfo={() => {
                setCurrentState(pageState.EditInfo);
              }}
            />
            <div className='entries'>
              <hr />
              {renderMenuItems()}
            </div>

            <div className='bottom-menu'>
              <div
                onClick={() =>
                  logout(() => {
                    navigate('/', { replace: true });
                    window.location.reload();
                    deleteChat();
                    clearAllPills();
                    clearAllAlarms();
                  })
                }
              >
                로그아웃
              </div>{' '}
              |{' '}
              <div onClick={() => setPopupType(PopupType.DeleteAccount)}>
                회원탈퇴
              </div>
            </div>

            {popupType !== PopupType.None && (
              <Popup onClose={() => setPopupType(PopupType.None)}>
                {getPopupContent(popupType)}
              </Popup>
            )}
            {loading && <Loading />}
          </StyledContent>
        );
    }
  };

  const renderStatePage = (state: pageState) => {
    switch (state) {
      case pageState.EditInfo:
        return (
          <EditMyInformation
            onEditNameClick={() => setCurrentState(pageState.EditName)}
            onEditPasswordClick={() => setCurrentState(pageState.EditPassword)}
            onEditPharmacistClick={() =>
              setCurrentState(pageState.EditPharmacist)
            }
          />
        );

      case pageState.EditName:
        return (
          <EditName
            onEdit={() => {
              setCurrentState(pageState.EditInfo);
            }}
          />
        );

      case pageState.EditPassword:
        return <EditPassword />;

      case pageState.EditPharmacist:
        return (
          <EditPharmacist
            onEdit={() => {
              setCurrentState(pageState.EditInfo);
            }}
          />
        );

      case pageState.MyMedications:
        return <MyMedications />;

      case pageState.FavoriteMedications:
        return <FavoriteMedications />;

      case pageState.ManageReviews:
        return <ManageReviews />;
    }
  };

  const getStateTitle = (state: pageState) => {
    switch (state) {
      case pageState.EditInfo:
        return '정보 수정';
      case pageState.EditName:
        return '이름 변경';
      case pageState.EditPassword:
        return '비밀번호 변경';
      case pageState.EditPharmacist:
        return '약사 인증';
      case pageState.MyMedications:
        return '나의 약';
      case pageState.FavoriteMedications:
        return '즐겨찾는 약';
      case pageState.ManageReviews:
        return '리뷰 관리';
    }
  };

  const getStateBackPage = (state: pageState) => {
    switch (state) {
      case pageState.EditName:
      case pageState.EditPassword:
      case pageState.EditPharmacist:
        return pageState.EditInfo;

      default:
        return pageState.Main;
    }
  };

  const renderPageTitle = (state: pageState) => {
    return (
      <PageTitle>
        <div className='title'>
          <Icon
            icon='ep:arrow-left-bold'
            width='1.2em'
            height='1.2em'
            style={{ color: '#FFBB25' }}
            onClick={() => setCurrentState(getStateBackPage(state))}
          />{' '}
          <div>{getStateTitle(state)}</div>
        </div>
        <hr />
      </PageTitle>
    );
  };

  const menus = [
    { name: '나의 약', state: pageState.MyMedications },
    { name: '즐겨찾는 약', state: pageState.FavoriteMedications },
    { name: '리뷰관리', state: pageState.ManageReviews }
  ];

  const renderMenuItems = () => {
    return menus.map((menu, index) => (
      <div key={index}>
        <div className='entry' onClick={() => setCurrentState(menu.state)}>
          <div>{menu.name}</div>
          <Icon
            icon='ep:arrow-right-bold'
            width='1.3em'
            height='1.3em'
            style={{ color: '#FFBB25' }}
          />
        </div>
        <hr />
      </div>
    ));
  };

  const getPopupContent = (type: PopupType) => {
    switch (type) {
      case PopupType.DeleteAccount:
        return (
          <div>
            이약뭐약 서비스 회원탈퇴를 하시겠어요?
            <button
              className='bottomClose'
              onClick={() => {
                setLoading(true);
                deleteAccount(
                  user?.id ?? '',
                  () => {
                    setLoading(false);
                    setPopupType(PopupType.DeleteAccountSuccess);
                  },
                  () => {
                    setLoading(false);
                    setPopupType(PopupType.DeleteAccountFailure);
                  }
                );
              }}
            >
              회원탈퇴
            </button>
          </div>
        );

      default:
        return PopupContent(type, navigate);
    }
  };

  return (
    <>
      <Seo title={'마이페이지'} />
      <MyPageContainer>
        <Header />
        {renderContent()}
        {/* <Toast str="이름 변경이 완료되었어요" /> */}

        <Nav />
      </MyPageContainer>
    </>
  );
};

const PageTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 5px;

  .title {
    display: flex;
    gap: 10px;
    width: 95%;
    font-size: 1.2em;
  }

  hr {
    width: 90%;
  }
`;

const MyPageContainer = styled.div`
  width: 100%;
  overflow: hidden;

  hr {
    background: #d8d8d8;
    height: 1px;
    border: 0;
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 10px;

  hr {
    width: 90%;
  }

  .bottom-menu {
    color: gray;
    margin-top: 50px;
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .entries {
    display: flex;
    gap: 5px;
    flex-direction: column;
    font-size: 1em;

    .entry {
      display: flex;
      justify-content: space-between;
      align-content: center;
      width: 90%;
      margin-left: 20px;
      margin-bottom: 10px;
      padding-left: 10px;
      padding-right: 10px;
      font-size: 1rem;
    }
  }
`;

export default MyPage;
