/**
 * File Name : Toast
 * Description : 토스트메시지
 * Author : 오선아
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.21  오선아   Created
 */

import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import styled, { keyframes } from 'styled-components';

const CalendarToast = ({ title, str }: { title: string; str: string }) => {
  return (
    <ToastContainer>
      <div style={{ display: 'flex', alignItems: 'center', width: '25px' }}>
        {title === '시간추가' ? (
          <Icon
            icon='fluent:info-12-filled'
            width='20px'
            style={{ color: '#FFBB25' }}
          />
        ) : (
          <Icon icon='gg:check-o' style={{ color: '#19B878' }} />
        )}
      </div>
      {str}
    </ToastContainer>
  );
};

const toastAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-50%,20px);
  }
  10% {
    opacity: 1;
    transform: translateY(-50%,0);
  }
  90% {
    opacity: 1;
    transform: translateY(-50%,0);
  }
  100% {
    opacity: 0;
    transform: translateY(-50%,20px);
  }
`;

const ToastContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 14%;
  left: 50%;
  // width: 80%;
  transform: translate(-50%, -50%);
  background-color: rgba(51, 51, 51, 0.7);
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  animation: ${toastAnimation} 2s ease-out;
`;

export default CalendarToast;
