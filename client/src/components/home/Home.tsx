import styled from 'styled-components';
import MainHeader from './HomeHeader';
import CardNews from './CardNews';
import Nav from '../common/Nav';
import BottomEditNameSheet from '../authentication/BottomEditNameSheet';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Seo from '../common/Seo';

const MainContainer = styled.div`
  width: 100vw;
`;

const Home: React.FC = () => {
  const location = useLocation();
  const [BottomSheet, setBottomSheet] = useState(
    location.state?.showBottomSheet
  );

  return (
    <>
      <Seo />
      <MainContainer>
        <MainHeader />
        <CardNews />
        <BottomEditNameSheet
          isVisible={BottomSheet}
          onClose={() => setBottomSheet(false)}
        />
        <Nav />
      </MainContainer>
    </>
  );
};

export default Home;
