import styled from 'styled-components';
import SearchBox from '../search/SearchBox';

const MainHeaderContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 25vh;
  background-color: #ffeb41;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img.attrs({
  src: `/img/logo.svg`,
  alt: 'Logo'
})`
  width: 300px;
  height: auto;
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`;

const MainHeader: React.FC = () => {
  return (
    <MainHeaderContainer>
      <Logo />
      <SearchContainer>
        <SearchBox useRoute />
      </SearchContainer>
    </MainHeaderContainer>
  );
};

export default MainHeader;
