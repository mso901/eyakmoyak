import { Icon } from '@iconify-icon/react';
import { useState } from 'react';
import styled from 'styled-components';
import { fetchUserAllReview, deleteReview } from '../../api/reviewApi';
import Loading from '../common/Loading';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../common/Toast';
import InfiniteScroll from '../common/InfiniteScroll';

interface MedicationItem {
  id: number;
  name: string;
  createdAt: string;
  content: string;
}

const ManageReviews = () => {
  const [deleteItem, setDeleteItem] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MedicationItem[]>([]);
  const [selected, setSelected] = useState<MedicationItem>();
  const [popupType, setPopupType] = useState(PopupType.None);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [toastMessage, setToastMessage] = useState('');

  const navigate = useNavigate();
  const maxTextLength = 15;

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    const [datePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');
    return `${year}.${month}.${day}`;
  };

  const fetchDatas = () => {
    setLoading(true);

    fetchUserAllReview(
      limit,
      offset,
      'createdAt',
      'DESC',
      (data) => {
        const reviews = data.data;
        const temp: MedicationItem[] = reviews.map((d: any) => ({
          id: d.id,
          name: d.name,
          content: d.content,
          createdAt: formatDate(d.createdat)
        }));
        setLoading(false);

        setItems((prevData) => [...prevData, ...temp]);
        setOffset((prevOffset) => prevOffset + temp.length);

        setItemCount(data.totalCount);
      },
      () => {
        setLoading(false);
      }
    );
  };

  const getPopupContent = (type: PopupType) => {
    switch (type) {
      case PopupType.DeleteReview:
        return (
          <div>
            <b>{selected?.name}</b>해당 리뷰를 삭제하시겠어요?
            <button
              className='bottomClose'
              onClick={() => {
                setLoading(true);

                deleteReview(
                  selected?.id ?? -1,
                  () => {
                    setItems((prevItems) =>
                      prevItems.filter((item) => item.id !== selected?.id)
                    );
                    setItemCount(itemCount - 1);
                    setLoading(false);
                    setSelected(undefined);
                    setToastMessage('리뷰 삭제 완료!');
                  },
                  () => {
                    setPopupType(PopupType.DeleteFavoriteFailure);
                    setSelected(undefined);
                    setLoading(false);
                  }
                );
              }}
            >
              리뷰제거
            </button>
          </div>
        );

      default:
        return PopupContent(type, navigate);
    }
  };

  const renderItems = (item: MedicationItem, showHr: boolean, key: number) => {
    return (
      <Item key={key}>
        <div className='title'>
          <div className='title2'>
            <div className='name_ko'>
              <Link
                to={`/search/name?q=${item.name}`}
                style={{ color: 'black', textDecoration: 'none' }}
              >
                {item.name.length > maxTextLength
                  ? item.name.substring(0, maxTextLength) + '...'
                  : item.name}
                <Icon
                  icon='ep:arrow-right-bold'
                  width='0.8rem'
                  height='0.8rem'
                  style={{
                    color: 'black'
                  }}
                />
              </Link>
            </div>

            <div className='name_en'>{item.createdAt}</div>
          </div>
          {deleteItem ? (
            <div
              className='delete-button'
              onClick={() => {
                setSelected(item);
                setPopupType(PopupType.DeleteReview);
              }}
            >
              삭제
            </div>
          ) : (
            ''
          )}
        </div>
        <div className='desc'>{item.content}</div>
        {showHr ? <hr /> : ''}
      </Item>
    );
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='totalCount'>
          내가 쓴 총 리뷰 {itemCount}개{' '}
          <Icon
            onClick={() => setDeleteItem(!deleteItem)}
            icon='ic:baseline-edit'
            width='1.3rem'
            height='1.3rem'
            style={{ color: deleteItem ? '#72bf44' : '#d1d1d1' }}
          />
        </div>
        <InfiniteScroll
          className='items'
          loading={loading && <div>로딩중</div>}
          onIntersect={() => fetchDatas()}
        >
          {items.map((item, index) =>
            renderItems(item, index < items.length - 1, index)
          )}
        </InfiniteScroll>
      </StyledContent>
      {loading && <Loading />}
      {popupType !== PopupType.None && (
        <Popup onClose={() => setPopupType(PopupType.None)}>
          {getPopupContent(popupType)}
        </Popup>
      )}
      {toastMessage != '' && (
        <Toast onEnd={() => setToastMessage('')}>{toastMessage}</Toast>
      )}
    </MyPageContainer>
  );
};

const MyPageContainer = styled.div`
  width: 100%;
  height: 70vh;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: 0px 20px 0px 20px;
`;

const StyledContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;

  .totalCount {
    font-weight: 500;
    display: flex;
    justify-content: space-between;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: auto;
    padding-right: 10px;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  hr {
    width: 100%;
  }

  .title {
    display: flex;
    gap: 5px;
    justify-content: space-between;
  }

  .desc {
    font-size: 0.9rem;
  }

  .title2 {
    justify-content: space-between;
  }

  .name_ko {
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }

  .name_en {
    color: gray;
    font-size: 0.8em;
  }

  .delete-button {
    right: 30px;
    background-color: #d9d9d9;
    border: none;
    border-radius: 25px;
    padding: 3px 8px;
    cursor: pointer;
    font-size: 0.8em;
    height: 22px;
  }
`;

export default ManageReviews;
