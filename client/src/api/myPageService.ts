import { put, get } from './api';
import useUserStore from '../store/user';

export const fetchUserProfile = async ( onSuccess?:(arg0:any)=>void, onFailure?:(arg0:any)=>void) => {
  try {
    const data = await get('/api/mypage' );
    if (onSuccess) onSuccess(data);

    useUserStore.getState().setUserName(data.username);
    useUserStore.getState().setEmail(data.email);
    useUserStore.getState().setProfileImg(data.profileimg);


  } catch (error) {
    console.error('change UserName failed', error);
    if (onFailure) onFailure(error);
  }
};

export const changeUserName = async (userName: string,  onSuccess?:()=>void, onFailure?:(arg0:any)=>void) => {
    try {
      const data = await put('/api/mypage', { "username": userName });
      if (onSuccess) onSuccess();

      useUserStore.getState().setUserName(data.username);
    } catch (error) {
      console.error('change UserName failed', error);
      if (onFailure) onFailure(error);
    }
  };


  export const changeProfileImage = async (profileImg: FormData,  onSuccess?:()=>void, onFailure?:(arg0:any)=>void) => {
    try {
      const data = await put('/api/mypage/profile-picture',
        profileImg,
        {headers: {'Content-Type': 'multipart/form-data' }});

      if (onSuccess) onSuccess();

      useUserStore.getState().setProfileImg(data.profilePicture);
    } catch (error) {
      console.error('change ProfileImage failed', error);
      if (onFailure) onFailure(error);
    }
  };