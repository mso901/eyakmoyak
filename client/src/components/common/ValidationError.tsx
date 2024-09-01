import styled from 'styled-components';

const ValidationError = ({
  condition,
  children
}: {
  condition: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Container
      style={{
        display: condition ? 'initial' : 'none',
        animation: condition ? `shake 0.3s ease-in-out` : 'none'
      }}
    >
      <b>!</b> {children}
    </Container>
  );
};

const Container = styled.div`
  color: red;
  font-size: 0.9rem;

  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
    100% {
      transform: translateX(0);
    }
  }
`;

export default ValidationError;
