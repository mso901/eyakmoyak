import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const Toast = ({
  children,
  onEnd
}: {
  children: React.ReactNode;
  onEnd: () => void;
}) => {
  useEffect(() => {
    setTimeout(() => {
      onEnd();
    }, 2000);
  }, []);

  return <ToastContainer>{children}</ToastContainer>;
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
  position: fixed;
  top: 50%;
  left: 50%;
  display: inline-block;
  max-width: 300px;

  transform: translate(-50%, -50%);
  background-color: rgba(51, 51, 51, 0.8);
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  animation: ${toastAnimation} 2s ease-out;
  animation-fill-mode: forwards;
`;

export default Toast;
