import { Icon } from '@iconify-icon/react';
import { useState } from 'react';
import { css, styled } from 'styled-components';

interface InfoText {
  text: string;
  category: '혈당' | '체온' | '사진 기록';
}

const Info = ({ text, category }: InfoText) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <InfoContainer>
      <Icon
        icon='gg:info'
        width='17px'
        style={{ color: '#777777' }}
        onClick={() => setShow(!show)}
      />
      {show && (
        <Text category={category} dangerouslySetInnerHTML={{ __html: text }} />
      )}
    </InfoContainer>
  );
};

export default Info;

const InfoContainer = styled.div`
  margin-top: 2px;
  margin-left: 5px;
  display: flex;
  position: relative;
`;

const Text = styled.div<{ category: '혈당' | '체온' | '사진 기록' }>`
  padding: 5px;
  color: #777777;
  font-size: 8pt;
  position: absolute;
  left: 20px;
  top: 5px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 1000;

  ${({ category }) =>
    category === '체온' &&
    css`
      width: 35vw;
    `}

  ${({ category }) =>
    category === '혈당' &&
    css`
      width: 65vw;
    `}

  ${({ category }) =>
    category === '사진 기록' &&
    css`
      width: 60vw;
    `}
`;
