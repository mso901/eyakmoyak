import { useState } from 'react';
import styled from 'styled-components';
import SearchHeader from './SearchHeader';

const NotSearched = () => {
  const [activeType, setActiveType] = useState<string>('name');

  const handleTypeClick = (type: string) => {
    setActiveType(type);
  };

  return (
    <>
      <SearchHeader activeType={activeType} handleTypeClick={handleTypeClick} />
      <NotSearchedContainer>
        <Image src='/img/notSearched.png' />
        <Text className='main'>검색 결과가 없어요</Text>
        <Text className='sub'>
          검색 타입을 확인하거나
          <br /> 다른 키워드로 검색해보세요.
        </Text>
      </NotSearchedContainer>
    </>
  );
};

export default NotSearched;

const NotSearchedContainer = styled.div`
  padding: 30% 20%;
  margin-top: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 65%;
  padding-left: 15%;
`;

const Text = styled.div`
  color: #6f6f6f;
  text-align: center;

  &.main {
    margin-top: 30px;
    font-size: 18pt;
  }
  &.sub {
    font-size: 10pt;
    margin-top: 20px;
    margin-bottom: 25%;
  }
`;
