import styled from 'styled-components';

interface photoSrc {
  photo?: string;
}

const Photo = ({ photo }: photoSrc) => {
  if (photo !== null) {
    return (
      <PhotoContainer>
        <StyledImage src={photo} alt='기록 사진' />
      </PhotoContainer>
    );
  }
  return null;
};

export default Photo;

const PhotoContainer = styled.div``;

const StyledImage = styled.img`
  width: 200px;
`;
