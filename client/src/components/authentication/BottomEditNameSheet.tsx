import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import BottomSheet from '../common/BottomSheet';
import { ChangeEvent, useState } from 'react';

const BottomEditNameSheet = ({
  isVisible,
  onClose
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState('');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
  };

  return (
    <Sheet>
      <BottomSheet isVisible={isVisible} hideTopClose={true} onClose={() => {}}>
        <div className='title'>회원가입을 곧 마칠게요!</div>
        <div className='info-box'>
          <div className='input-container'>
            <input
              type='text'
              placeholder='홍길동'
              value={name}
              onChange={handleNameChange}
            />
            <Icon
              className='clearButton'
              icon='pajamas:clear'
              width='1.3rem'
              height='1.3rem'
              style={{ color: 'gray' }}
            />
          </div>
        </div>
        <button className='bottomClose' onClick={onClose}>
          이름작성 완료
        </button>
      </BottomSheet>
    </Sheet>
  );
};

const Sheet = styled.div`
  .menu {
    display: flex;
    gap: 10px;
  }

  .title {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .info-box {
    margin-bottom: 20px;
  }

  .input-container {
    position: relative;
  }

  .clearButton {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  input {
    width: 100%;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    padding: 12px;
    padding-right: 30px;
    box-sizing: border-box;
  }

  .bottomClose {
    margin-top: 20px;
  }
`;

export default BottomEditNameSheet;
