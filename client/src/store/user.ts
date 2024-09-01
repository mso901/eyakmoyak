import { create } from 'zustand'
//persist 사용하기.

export enum LoginType {
  kakao,
  naver,
  google,

  none,
}

interface User {
  user: {
    userName: string;
    email: string;
    profileImg: string;
    id: string;
    role: boolean;
    loginType:LoginType;
  } | null;

  userToken: {
    token: string;
    refreshToken: string;
  };

  setToken: (token: string, refreshToken: string) => void;

  setUser: (
    userName: string,
    email: string,
    profileImg: string,
    id: string,
    role: boolean,
    loginType:LoginType
  ) => void;

  setUserId: (id: string) => void;
  setProfileImg: (profileImg: string) => void;
  setUserName: (userName: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: boolean) => void;
  setLoginType: (role: LoginType) => void;
  clearUser: () => void;
}

const useUserStore = create<User>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  userToken: {
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refreshToken') || ''
  },

  setToken: (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    set(() => ({
      userToken: { token, refreshToken }
    }));
  },

  setUser: (userName, email, profileImg, id, role, loginType) => {
    const user = { userName, email, profileImg, id, role, loginType };
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setLoginType: (loginType) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, loginType } : null;
      if (updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),

  setUserId: (id) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, id } : null;
      if (updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
    setRole: (role) =>
      set((state) => {
        const updatedUser = state.user ? { ...state.user, role } : null;
        if (updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser));
        return { user: updatedUser };
      }),
  setUserName: (userName) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, userName } : null;
      if (updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
  setProfileImg: (profileImg) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, profileImg } : null;
      if (updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
  setEmail: (email) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, email } : null;
      if (updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
  clearUser: () => {
    localStorage.removeItem('user');
    set({ user: null });
  }
}));

export default useUserStore;
