import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderContainer>
      <Link to='/'>
        <Logo src='/img/logo_not_chicken.svg' alt='이약뭐약' />
      </Link>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  background-color: #ffffff;
  padding: 15px;
  padding-bottom: 8px;
`;

const Logo = styled.img`
  height: 40px;
  cursor: pointer;
`;

