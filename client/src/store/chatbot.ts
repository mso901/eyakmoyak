import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Chat {
  sender: string;
  text: string;
  loading?: boolean;
}

interface ChatBot {
  chatList: Array<Chat>;
  addBotChat: (botChat: string, loading?: boolean) => void;
  addUserChat: (userChat: string) => void;
  updateLastBotChat: (botChat: string) => void;
  deleteChat: () => void;
}

const initialChatList: Chat[] = [
  {
    sender: 'bot',
    text: '증상에 맞는 약을 찾고 계신가요? \n\n 저에게 구체적으로 증상을 말씀해주시면\n 더 정확히 답변 드릴 수 있어요 😃 '
  }
];

export const useChatBot = create(
  persist<ChatBot>(
    (set) => ({
      chatList: initialChatList,
      addBotChat: (newBotChat, loading = false) =>
        set((state) => ({
          chatList: [
            ...state.chatList,
            { sender: 'bot', text: newBotChat, loading }
          ]
        })),
      addUserChat: (newUserChat) =>
        set((state) => ({
          chatList: [...state.chatList, { sender: 'user', text: newUserChat }]
        })),
      updateLastBotChat: (updatedBotChat) =>
        set((state) => {
          const chatList = [...state.chatList];
          const lastIndex = chatList.length - 1;
          if (
            chatList[lastIndex].sender === 'bot' &&
            chatList[lastIndex].loading
          ) {
            chatList[lastIndex] = {
              sender: 'bot',
              text: updatedBotChat,
              loading: false
            };
          }
          return { chatList };
        }),
      deleteChat: () =>
        set(() => ({
          chatList: initialChatList
        }))
    }),
    {
      name: 'chat-bot-storage'
    }
  )
);
