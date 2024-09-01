/**
 * File Name : Footer
 * Description : 홈화면 하단의 정보 출처 표시
 * Author : 민선옥
 *
 * History
 * Date        Author   Status    Description
 * 2024.07.19  민선옥    Created
 */

import styled from 'styled-components';


const Footer = () => {
  return (
    <FooterContainer>
      <div>이약뭐약</div>
      <p>
        이 사이트는{' '}
        <a target='blank' href='https://www.data.go.kr/data/15075057/openapi.do'>
          식품의약품안전처_의약품개요정보(e약은요)
        </a>{' '}
        의 정보를 바탕으로 만들어 졌습니다.
      </p>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  background-color: #f8f8f8;
  padding: 20px;
  padding-bottom: 110px;

  & div {
    margin-bottom: 10px;
    color: #868686;
    font-weight: 800;
  }

  & p {
    color: #242323;
    font-size: 14px;
    font-style: italic;
    line-height: 26px;

    & a {
      color: #242323;
    }
  }
`;