import Cookies from 'js-cookie';
import useUserStore, { LoginType } from '../store/user';
import { del, get, post, patch } from './api';

export const login = async (
  email: string,
  password: string,
  onSuccess?: () => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await post('/api/auth/login', { email: email, password });
    Cookies.set('login', data.message);

    if (onSuccess) onSuccess();
  } catch (error) {
    console.error('Login failed', error);
    if (onFailure) onFailure(error);
  }
};

export const fetchUserInformation = async (
  onSuccess?: () => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await get('/api/auth/user-info');

    let loginType = LoginType.none;
    if (data.kakaoid !== null) loginType = LoginType.kakao;
    else if (data.naverid !== null) loginType = LoginType.naver;
    else if (data.googleid !== null) loginType = LoginType.google;


    useUserStore
      .getState()
      .setUser(
        data.username,
        data.email,
        data.profileimg,
        data.id,
        data.role,
        loginType
      );

    if (onSuccess) onSuccess();
  } catch (error) {
    console.error('fetch User Information failed', error);
    if (onFailure) onFailure(error);
  }
};

export const deleteAccount = async (
  userId: string,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await del('/api/auth/delete-account', { userId: userId });
    useUserStore.getState().clearUser();
    Cookies.remove('login');
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('delete Account failed', error);
    if (onFailure) onFailure(error);
  }
};

export const signup = async (
  email: string,
  username: string,
  password: string,
  confirmPassword: string,
  onSuccess: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await post('/api/auth/signup', {
      email: email,
      username: username,
      password: password,
      confirmPassword: confirmPassword
    });

    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('signup failed', error);
    if (onFailure) onFailure(error);
  }
};

export const requestEmailVerification = async (
  email: string,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await post('/api/auth/request-email-verification', {
      email: email
    });
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('request Email Verification failed', error);
    if (onFailure) onFailure(error);
  }
};

export const logout = async (callback?: () => void) => {
  try {
    await post('/api/auth/logout', {});
    useUserStore.getState().clearUser();
    Cookies.remove('login');

    if (callback) callback();
  } catch (error) {
    console.error('Logout failed', error);
  }
};

export const loginForKakao = async (code: string) => {
  try {
    const data = await post('/api/auth/kakao/callback', { code });
    Cookies.set('login', data.message);
  } catch (error) {
    console.error('Login failed', error);
  }
};

export const loginForGoogle = async (code: string) => {
  try {
    const data = await post('/api/auth/google/callback', { code });
    Cookies.set('login', data.message);
  } catch (error) {
    console.error('Login failed', error);
  }
};

export const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await patch('/api/auth/change-password', {
      email,
      oldPassword,
      newPassword
    });

    if (onSuccess) onSuccess(data);
  } catch (error) {
    if (onFailure) onFailure(error);
    console.error('changePassword failed', error);
  }
};

export const resetPasswordRequest = async (
  email: string,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await post('/api/auth/request-password', { email: email });

    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('reset Password failed', error);
    if (onFailure) onFailure(error);
  }
};

export const resetPassword = async (
  password: string,
  token: string,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await post('/api/auth/reset-password', {
      token: token,
      newPassword: password
    });

    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('reset Password failed', error);
    if (onFailure) onFailure(error);
  }
};
