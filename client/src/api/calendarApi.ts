import { del, get, post, put } from './api';

// 사용자 일정 전체보기
export const calendarAllGet = async () => {
  try {
    const res = await get('/api/calendars');
    return res;
  } catch (err) {
    console.log('Get Csalendar Data failed', err);
  }
};

// 일정 상세보기
export const calendarGet = async (date: string) => {
  try {
    const res = await get(`/api/calendars/${date}`);
    return res;
  } catch (err) {
    console.log('Get Calendar Data failed', err);
  }
};

export const calendarPost = async (requestBody: object) => {
  try {
    const res = await post('/api/calendars', requestBody);
    return res;
  } catch (err) {
    console.log('Post Calendar Data failed', err);
  }
};

export const calendarPut = async (date: string, requestBody: FormData) => {
  try {
    const res = await put(`/api/calendars/${date}`, requestBody);
    return res;
  } catch (err) {
    console.log('Put Calendar Data failed', err);
  }
};

export const calendarDelete = async (date: string) => {
  try {
    const res = await del(`/api/calendars/${date}`);
    return res;
  } catch (err) {
    console.log('Delete Calendar Data failed', err);
  }
};
