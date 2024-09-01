import styled from 'styled-components';
import Layout from '../common/Layout';
import ChatBotBox from './ChatBotBox';
import Seo from '../common/Seo';

const ChatBot: React.FC = () => {
  return (
    <>
      <Seo title={'챗봇'} />
      <ChatBotContainer>
        <Layout />
        <ChatBotBox />
      </ChatBotContainer>
    </>
  );
};

export default ChatBot;

const ChatBotContainer = styled.div`
  width: 100vw;
`;
