import { get, post, del } from './api';
export const fetchReviews = async ({
  pillId,
  initialLimit = 10,
  cursorLimit = 10,
  cursor = null
}: {
  pillId: number;
  initialLimit?: number;
  cursorLimit?: number;
  cursor?: string | null;
}) => {
  try {
    const data = await get(`/api/reviews/pills/${pillId}`, {
      initialLimit,
      cursorLimit,
      cursor
    });

    return data;
  } catch (error) {
    console.error('리뷰불러오기 에러:', error);
    throw error;
  }
};

export const createReview = async ({
  content,
  pillId
}: {
  content: string;
  pillId: number;
}) => {
  try {
    const data = await post(`/api/reviews`, { content, pillid: pillId });
    return data;
  } catch (error) {
    console.error('리뷰생성 에러:', error);
    throw error;
  }
};

export const deleteReview = async (
  id: number,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await del(`/api/reviews/${id}`);
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('change ProfileImage failed', error);
    if (onFailure) onFailure(error);
  }
};

export const fetchUserAllReview = async (
  limit: number,
  offset: number,
  sortedBy: string,
  order: string,
  onSuccess?: (arg0: any) => void,
  onFailure?: (arg0: any) => void
) => {
  try {
    const data = await get('/api/reviews/users', {
      limit: limit,
      offset: offset,
      sortedBy: sortedBy,
      order: order
    });
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('change ProfileImage failed', error);
    if (onFailure) onFailure(error);
  }
};
