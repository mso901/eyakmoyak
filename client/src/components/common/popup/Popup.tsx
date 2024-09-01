import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';

const Popup = ({
  onClose,
  children
}: {
  onClose: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <Overlay onClick={onClose}>
      <SheetContainer>
        <div className='header'>
          <Icon
            className='topClose'
            onClick={onClose}
            icon='material-symbols:close'
            width='1.7rem'
            height='1.7rem'
            style={{ color: 'black' }}
          />
        </div>
        <div className='contents'>{children}</div>
      </SheetContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s ease;
  z-index: 999;
`;

const SheetContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 80%;
  min-height: 150px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  padding: 0px 20px 20px 20px;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  font-size: 1.1em;
  gap: 10px;

  button {
    font-size: 1em;
    font-weight: bold;
    padding: 5px 10px 5px 10px;
    background-color: #ffeb41;
    border: none;
    border-radius: 5px;
    margin-top: 20px;
  }

  .header {
    position: flex;
    width: 100%;

    display: flex;
    justify-content: right;
    align-items: right;
    align-content: right;
    margin: 10px 10px 0px 10px;
  }

  .contents {
    min-height: 60px;

    div {
      justify-content: center;
      align-items: center;
      display: flex;
      align-content: center;
      flex-direction: column;
    }
  }
`;

export default Popup;
