import styled from 'styled-components';

interface UserChatting {
  text: string;
}

const UserChat = ({ text }: UserChatting) => {
  return (
    <UserChattingContainer>
      <UserChatting>{text}</UserChatting>
    </UserChattingContainer>
  );
};

export default UserChat;

const UserChattingContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
`;

const UserChatting = styled.div`
  background-color: #72bf44;
  width: auto;
  min-width: 100px;
  border-radius: 20px;
  padding: 15px 15px;
  line-height: 18px;
  margin-left: 50px;
  margin-right: 10px;
  position: relative;
  z-index: 80;
  word-wrap: break-word;
  overflow-wrap: break-word;

  // &::after {
  //   content: '';
  //   position: absolute;
  //   top: 3px;
  //   left: 90%;
  //   border-width: 15px;
  //   border-style: solid;
  //   border-color: #72bf44 transparent transparent transparent;
  // }
`;
