import { Icon } from '@iconify-icon/react';
import styled from 'styled-components';

interface BotChatting {
  text: string;
  loading: boolean;
}

const BotChat = ({ text, loading }: BotChatting) => {
  return (
    <BotChattingContainer>
      <MeoYakContainer>
        <MeoYak src='/img/logo/just_chick.svg' />
      </MeoYakContainer>
      <Bot>
        <BotName>머약</BotName>
        {loading ? (
          <LoadingContainer>
            <Icon
              icon='eos-icons:three-dots-loading'
              width='30'
              style={{ textAlign: 'center' }}
            />
          </LoadingContainer>
        ) : (
          <BotChatting dangerouslySetInnerHTML={{ __html: text }} />
        )}
      </Bot>
    </BotChattingContainer>
  );
};

export default BotChat;

const BotChattingContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const BotChatting = styled.div`
  background-color: white;
  width: 250px;
  border-radius: 20px;
  padding: 15px 15px;
  line-height: 18px;
  margin-left: 5px;
  position: relative;
  z-index: 80;

  &::after {
    content: '';
    position: absolute;
    top: 6px;
    left: -4%;
    border-width: 15px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
`;

const Bot = styled.div`
  display: flex;
  flex-direction: column;
`;

const BotName = styled.div`
  font-weight: 500;
  padding: 5px 5px;
`;

const LoadingContainer = styled.div`
  background-color: white;
  width: 250px;
  border-radius: 20px;
  padding: 15px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px; /* Adjust height to ensure consistent size with regular messages */
  margin-left: 5px;
  position: relative;
  z-index: 80;

  &::after {
    content: '';
    position: absolute;
    top: 6px;
    left: -4%;
    border-width: 15px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
`;

const MeoYakContainer = styled.div``;

const MeoYak = styled.img`
  width: 35px;
`;
