import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchReviewCount } from '../../api/searchApi';
import { fetchReviews, createReview } from '../../api/reviewApi';
import InfiniteScroll from '../common/InfiniteScroll';
import LoginCheck from '../common/LoginCheck';
import Toast from '../common/Toast';

export interface Review {
  id: number;
  pillId: number;
  name?: string;
  userid: string;
  username?: string;
  role?: boolean;
  content: string;
  profileimg?: string;
  createdat: string;
}

const Review = ({ pillId }: { pillId: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [nextCursor, setNextCursor] = useState<number>(0);
  const [isWritingReview, setIsWritingReview] = useState<boolean>(false);
  const [newReview, setNewReview] = useState<string>('');
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const loadReviews = async (pillId: number, cursor: string | null) => {
    if (nextCursor !== 0 && !cursor) return;

    setIsLoading(true);
    try {
      const data = await fetchReviews({ pillId, cursor });
      setReviews((prevReviews) => {
        return [...prevReviews, ...data.reviews];
      });

      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error('리뷰 불러오기 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    const newReviewItem = { content: newReview, pillId };
    try {
      const data = await createReview(newReviewItem);
      setReviews((prevReviews) => [data, ...prevReviews]);
      setNewReview('');
      setIsWritingReview(false);
      setShowToast(true);
      setReviewCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('리뷰 생성 에러:', error);
    }
  };

  const handleCancelReview = () => {
    setNewReview('');
    setIsWritingReview(false);
  };

  useEffect(() => {
    const fetchCount = async () => {
      const count = await fetchReviewCount(pillId.toString());
      setReviewCount(count);
    };
    fetchCount();
  }, [pillId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}.${month}.${day}`;
  };

  return (
    <ReviewContainer>
      <ReviewHeader>
        <p>
          리뷰 <span>{reviewCount}</span>
        </p>
        <LoginCheck>
          {(handleCheckLogin) => (
            <WriteReview
              onClick={() => handleCheckLogin(() => setIsWritingReview(true))}
            >
              리뷰 작성하기
            </WriteReview>
          )}
        </LoginCheck>
      </ReviewHeader>
      {isWritingReview && (
        <ReviewForm>
          <textarea
            placeholder='리뷰를 작성해 주세요.&#10;욕설, 비방, 명예훼손성 표현은 사용하지 말아주세요.'
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <ButtonContainer>
            <CancelButton onClick={handleCancelReview}>취소</CancelButton>
            <SubmitButton onClick={handleReviewSubmit}>완료</SubmitButton>
          </ButtonContainer>
        </ReviewForm>
      )}
      <InfiniteScroll
        loading={isLoading && <div>로딩중</div>}
        onIntersect={() => loadReviews(pillId, nextCursor?.toString() ?? '')}
      >
        <ReviewList>
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              style={{
                backgroundColor: review.role ? 'rgba(114,191,68, 0.1)' : 'white'
              }}
            >
              <User>
                <Profile
                  src={review.profileimg ?? `/img/user.svg`}
                  alt='프로필'
                />
                <span>{review.username}</span>
                {review.role && (
                  <img
                    src='/img/pharm.png'
                    alt='Role Icon'
                    style={{ width: '18px' }}
                  />
                )}
                <span
                  style={{ marginLeft: 'auto', fontWeight: 300, color: 'gray' }}
                >
                  {formatDate(review.createdat)}
                </span>
              </User>
              <p>{review.content}</p>
            </ReviewItem>
          ))}
        </ReviewList>
      </InfiniteScroll>
      {isLoading && <LoadingText>로딩 중...</LoadingText>}
      {showToast && (
        <Toast onEnd={() => setShowToast(false)}>
          리뷰가 성공적으로 작성되었습니다.
        </Toast>
      )}
    </ReviewContainer>
  );
};

export default Review;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 30px 100px;
`;

const ReviewHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;

  & span {
    color: gray;
  }
`;

const WriteReview = styled.button`
  width: 125px;
  height: 35px;
  font-weight: 600;
  background-color: #ffffff;
  border: 1px solid var(--secondary-color);
  border-radius: 10px;
`;

const ReviewForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  & textarea {
    width: 90%;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    resize: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const CancelButton = styled.button`
  width: 60px;
  height: 30px;
  margin-top: 10px;
  margin-right: 10px;
  background-color: #fff;
  border: 1px solid #ffd700;
  border-radius: 5px;
  color: #fdc706;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 60px;
  height: 30px;
  margin-top: 10px;
  background-color: #ffd700;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
`;

const ReviewList = styled.ul`
  width: 85vw;
`;

const ReviewItem = styled.li`
  margin: 20px 0;
  padding: 15px;
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  & p {
    margin-top: 10px;
    font-size: 14px;
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;

  & span {
    margin-left: 7px;
    font-size: 15px;
    font-weight: 500;
  }
`;

const Profile = styled.img`
  width: 30px;
  border-radius: 15px;
`;

const LoadingText = styled.div`
  margin: 20px 0;
  font-size: 14px;
  color: gray;
`;
