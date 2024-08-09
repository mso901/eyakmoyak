import React, { useState } from 'react';
import { isUserLoggedIn } from '../../utils/auth';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import { useNavigate } from 'react-router-dom';

interface LoginCheckProps {
  children: (checkLogin: (callback: () => void) => void) => React.ReactNode;
}

const LoginCheck: React.FC<LoginCheckProps> = ({ children }) => {
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);
  const navigate = useNavigate();

  const handleCheckLogin = (callback: () => void) => {
    if (!isUserLoggedIn()) {
      setPopupType(PopupType.LoginRequired);
      setShowLoginPopup(true);
      return;
    }
    callback();
  };

  return (
    <>
      {children(handleCheckLogin)}
      {showLoginPopup && (
        <Popup onClose={() => setShowLoginPopup(false)}>
          {PopupContent(popupType, navigate)}
        </Popup>
      )}
    </>
  );
};

export default LoginCheck;
