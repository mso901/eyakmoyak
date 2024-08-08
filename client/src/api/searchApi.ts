import { get, post } from './api';

export const fetchPillDataByName = async (
  name: string,
  limit: number = 1,
  offset: number = 0
) => {
  try {
    const data = await get(`/api/pills/search/name`, { name, limit, offset });
    console.log('이름으로 검색 Get:', data);
    if (data.pills && data.pills.length > 0) {
      return data.pills[0];
    }
  } catch (error) {
    console.error('약데이터(name) 가져오기 실패:', error);
    throw error;
  }
};

export const fetchPillListByEfficacy = async (
  efficacy: string
) => {
  try {
    const data = await get(`/api/pills/search/efficacy`, {
      efficacy
    });
    console.log('효능으로 검색 Get:', data);
    if (data.pills && data.pills.length > 0) {
      return data.pills;
    }
  } catch (error) {
    console.error('약데이터 가져오기 실패:', error);
  }
};

export const fetchPillDataByImage = async (
  images: FileList,
  limit: number = 10,
  offset: number = 0
) => {
  const formData = new FormData();
  formData.append('image', images[0]);
  formData.append('image', images[1]);
  formData.append('limit', limit.toString());
  formData.append('offset', offset.toString());

  try {
    const data = await post(`/api/pills/search/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('이미지로 검색 Post', data);
    return data.pills;
  } catch (error) {
    console.error('이미지로 약 데이터 가져오기 실패', error);
    throw error;
  }
};

export const fetchAutocompleteSuggestions = async (name: string) => {
  try {
    const data = await get(`/api/pills/search/name`, {
      name,
      limit: 10,
      offset: 0
    });

    if (data && data.pills.length > 0) {
      return data.pills;
    } else {
      throw new Error('자동완성 잘못된 응답 형식');
    }
  } catch (error) {
    console.error('자동완성 데이터 가져오기 실패:', error);
    throw error;
  }
};

export const fetchReviewCount = async (pillId: string) => {
  try {
    const data = await get(`/api/pills/${pillId}/reviewcount`);
    console.log('리뷰수:', data);
    return data.count;
  } catch (error) {
    console.log('리뷰 수 가져오기 실패:', error);
  }
};

export const fetchFavoriteCount = async (pillId: number) => {
  try {
    const data = await get(`/api/pills/${pillId}/favoritecount`);
    console.log('좋아요 수:', data);
    return data.count;
  } catch (error) {
    console.error('즐겨찾기 수 가져오기 실패:', error);
    throw error;
  }
};
