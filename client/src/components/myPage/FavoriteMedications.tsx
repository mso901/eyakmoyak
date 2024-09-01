import { Icon } from '@iconify-icon/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchMyFavorites, toggleFavoriteApi } from '../../api/favoriteApi';
import Loading from '../common/Loading';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import Toast from '../common/Toast';
import InfiniteScroll from '../common/InfiniteScroll';

interface MedicationItem {
  pillid: number;
  title: string;
  registrationDate: string;
  tags: string[];
}

const FavoriteMedications = () => {
  const [deleteItem, setDeleteItem] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MedicationItem[]>([]);
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

    fetchMyFavorites(
      offset,
      limit,
      'createdAt',
      'DESC',
      (data) => {
        const favorites = data.data;
        const temp: MedicationItem[] = favorites.map((d: any) => ({
          pillid: Number(d.pillid),
          title: d.name,
          registrationDate: formatDate(d.createdat),
          tags:
            d.importantWords === ''
              ? []
              : d.importantWords &&
                d.importantWords.trim() &&
                d.importantWords.split(', ')
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

  const renderItems = (item: MedicationItem, index: number) => {
    return (
      <Item key={index}>
        <div className='title'>
          <Link
            to={`/search/name?q=${item.title}`}
            style={{ color: 'black', textDecoration: 'none' }}
          >
            <div className='title2'>
              {item.title.length > maxTextLength
                ? item.title.substring(0, maxTextLength) + '...'
                : item.title}
              <Icon
                icon='ep:arrow-right-bold'
                width='1.2em'
                height='1.2em'
                style={{ color: 'black' }}
              />
            </div>
          </Link>

          {deleteItem ? (
            <div
              className='delete-button'
              onClick={() => {
                setLoading(true);
                toggleFavoriteApi(
                  { id: item.pillid },
                  () => {
                    setItems((prevItems) =>
                      prevItems.filter((t) => t.pillid !== item?.pillid)
                    );
                    setItemCount(itemCount - 1);
                    setLoading(false);
                    setToastMessage('즐겨찾는 약 삭제 완료!');
                  },
                  () => {
                    setPopupType(PopupType.DeleteFavoriteFailure);
                    setLoading(false);
                  }
                );
              }}
            >
              삭제
            </div>
          ) : (
            ''
          )}
        </div>

        <div className='registration'>등록일 {item.registrationDate}</div>
        {item.tags.length > 0 ? (
          <TagContainer>
            {item.tags.slice(0, 3)?.map((tag, index) => (
              <Tag key={index} to={`/search/efficacy?q=${tag}`}>
                {tag}
              </Tag>
            ))}
          </TagContainer>
        ) : (
          ''
        )}
      </Item>
    );
  };

  return (
    <MyPageContainer>
      <StyledContent>
        <div className='totalCount'>
          총 {itemCount}개{' '}
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
          {items.map((item, index) => renderItems(item, index))}
        </InfiniteScroll>
      </StyledContent>
      {loading && <Loading />}
      {popupType !== PopupType.None && (
        <Popup onClose={() => setPopupType(PopupType.None)}>
          {PopupContent(popupType, navigate)}
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
  gap: 20px;

  .totalCount {
    font-weight: 500;
    display: flex;
    justify-content: space-between;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 0px 10px 0px 0px;
    overflow: auto;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  .title {
    display: flex;
    font-weight: bold;
    justify-content: space-between;
    font-size: 0.9rem;
  }

  .title2 {
    display: flex;
    justify-content: space-between;
  }

  .registration {
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
    font-size: 0.6em;
  }
`;

const TagContainer = styled.div`
  display: flex;
  width: 100%;
  height: 30px;
`;

const Tag = styled(Link)`
  width: 48px;
  height: 25px;
  margin-right: 10px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  line-height: 25px;
  border-radius: 5px;
  background-color: var(--main-color);
  cursor: pointer;
  text-decoration: none;
  color: black;
`;

export default FavoriteMedications;
