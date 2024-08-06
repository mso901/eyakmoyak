import { Icon } from '@iconify-icon/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { chatBot, endChatBot } from '../../api/chatbot';
import { useChatBot } from '../../store/chatbot';
import Popup from '../popup/Popup';
import PopupContent, { PopupType } from '../popup/PopupMessages';
import BotChat from './BotChat';
import UserChat from './UserChat';

const ChatBotBox: React.FC = () => {
  const navigate = useNavigate();
  const { chatList, addBotChat, addUserChat, deleteChat, updateLastBotChat } =
    useChatBot();
  const [text, setText] = useState<string>('');
  const chattingContainerRef = useRef<HTMLDivElement>(null);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);

  // 스크롤 항상 아래로
  useEffect(() => {
    if (chattingContainerRef.current) {
      chattingContainerRef.current.scrollTop =
        chattingContainerRef.current.scrollHeight;
    }
  }, [chatList]);

  const handleChatting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === '') return;

    addUserChat(text);
    addBotChat('', true);
    setText('');

    try {
      const res = await chatBot(text);
      console.log('챗봇 대답', res);
      const formattedRes = res.replace(/\n/g, '<br />');
      updateLastBotChat(formattedRes);
    } catch (err) {
      console.log('챗봇 대화 실패', err);
      updateLastBotChat('챗봇 대화 실패');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleFinish = async () => {
    try {
      const res = await endChatBot();
      console.log('채팅 종료 성공', res);
    } catch (err) {
      console.error('채팅 종료 실패', err);
    }
  };

  const getPopupContent = (type: PopupType) => {
    switch (type) {
      case PopupType.FinishChatBot:
        return (
          <div style={{ textAlign: 'center' }}>
            채팅을 종료하시면 기존 내용은 삭제됩니다. <br />
            종료하시겠습니까?
            <button
              className='bottomClose'
              onClick={() => {
                setPopupType(PopupType.None);
                handleFinish();
                deleteChat();
              }}
            >
              확인
            </button>
          </div>
        );

      default:
        return PopupContent(type, navigate);
    }
  };

  return (
    <ChatBotBoxContainer>
      <Box>
        <FinishButton onClick={() => setPopupType(PopupType.FinishChatBot)}>
          채팅 종료
        </FinishButton>
        <ChattingContainer ref={chattingContainerRef}>
          {chatList.map((chat, index) =>
            chat.sender === 'user' ? (
              <UserChat key={index} text={chat.text} />
            ) : (
              <BotChat
                key={index}
                text={chat.text}
                loading={chat.loading || false}
              />
            )
          )}
        </ChattingContainer>
        <ChattingInputContainer onSubmit={handleChatting}>
          <Chatting
            placeholder='증상에 맞는 약을 질문해보세요!'
            onChange={onChange}
            value={text}
          />
          <SubmitButton type='submit'>
            <Icon
              icon='clarity:circle-arrow-solid'
              style={{ color: ' #FFBB25' }}
              width='30px'
            />
          </SubmitButton>
        </ChattingInputContainer>
      </Box>
      {popupType !== PopupType.None && (
        <Popup onClose={() => setPopupType(PopupType.None)}>
          {getPopupContent(popupType)}
        </Popup>
      )}
    </ChatBotBoxContainer>
  );
};

export default ChatBotBox;

const ChatBotBoxContainer = styled.div`
  width: 100%;
  height: 84vh;
`;

const Box = styled.div`
  margin: 10px 5%;
  position: relative;
  border-radius: 40px;
  background-color: #ffe612;
  width: 90%;
  height: 90%;
  padding: 10px;
  font-size: 10.5pt;
`;

const ChattingContainer = styled.div`
  margin-top: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 90%;
`;

const ChattingInputContainer = styled.form`
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 5px;
  box-sizing: border-box;
  width: 80vw;
  height: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const Chatting = styled.input`
  flex: 1;
  border-width: 0;

  &::placeholder {
    color: #6c6b6b;
  }

  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.button`
  border: none;
  background: none;
`;

const FinishButton = styled.button`
  position: absolute;
  z-index: 100;
  right: 10px;
  width: 90px;
  height: 30px;
  margin-top: 5px;
  border-radius: 10px;
  border: none;
  background-color: #72bf44;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
