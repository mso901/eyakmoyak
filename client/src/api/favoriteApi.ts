import { PillData } from '../store/pill';
import { get, post } from './api';

interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
}

export const toggleFavoriteApi = async (
  pill: Pick<PillData, 'id'>,
  onSuccess?: (response: ToggleFavoriteResponse) => void,
  onFailure?: (error: Error) => void
): Promise<ToggleFavoriteResponse> => {
  try {
    const data = await post(`/api/favorites/${pill.id}`, { pillId: pill.id });
    if (onSuccess) onSuccess(data);
    return data;
  } catch (error) {
    console.error('좋아요토글 실패:', error);
    if (onFailure) {
      if (error instanceof Error) {
        onFailure(error);
      } else {
        onFailure(new Error('Unknown error'));
      }
    }
    throw error;
  }
};

export const fetchFavoriteStatusApi = async (pillId: number) => {
  try {
    const data = await get(`/api/favorites/${pillId}/status`);
    return data;
  } catch (error) {
    throw error;
  }
};



export const fetchMyFavorites = async (
  offset: number,
  limit?: number,
  sortedBy?: string,
  order?: string,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await get('/api/favorites', {
      offset: offset,
      limit: limit,
      sortedBy: sortedBy,
      order: order
    });

    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('fetchMyFavorites failed', error);
    if (onFailure) onFailure(error);
  }
};
