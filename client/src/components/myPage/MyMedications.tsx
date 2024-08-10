import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { useState } from 'react';
import {
  addMyPills,
  fetchMyPills,
  deleteMyPills,
  updateMyPills
} from '../../api/myMedicineApi';
import Loading from '../common/Loading';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages';
import { useNavigate } from 'react-router-dom';
import Toast from '../common/Toast';
import { useMyPillStore } from '../../store/myPill';
import InfiniteScroll from '../common/InfiniteScroll';
import AddPillBottomSheet from './MyMedications/AddPillBottomSheet';
import ModifyPillBottomSheet from './MyMedications/ModifyPillBottomSheet';

interface MedicationItem {
  id: string;
  title: string;
  expiration: string;
  alarmstatus: boolean;
}

const MyMedications = () => {
  const [addBottomSheet, setAddBottomSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MedicationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MedicationItem | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [popupType, setPopupType] = useState(PopupType.None);
  const [deleteItem, setDeleteItem] = useState(false);
  const [selected, setSelected] = useState<MedicationItem>();
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [toastMessage, setToastMessage] = useState('');
  const { addPills, deletePill, updatePill } = useMyPillStore();

  const maxTextLength = 15;

  const navigate = useNavigate();

  const getPopupContent = (type: PopupType) => {
    switch (type) {
      case PopupType.DeleteMyPill:
        return (
          <div>
            <b>{selected?.title}</b>해당 약을 삭제하시겠어요?
            <button
              className='bottomClose'
              onClick={() => {
                setLoading(true);

                deleteMyPills(
                  selected?.id.toString() ?? '',
                  () => {
                    setItems((prevItems) =>
                      prevItems.filter((item) => item.id !== selected?.id)
                    );
                    deletePill(selected?.id ?? '');
                    setItemCount(itemCount - 1);
                    setLoading(false);
                    setSelected(undefined);
                    setToastMessage('나의 약 삭제 완료!');
                  },
                  () => {
                    setPopupType(PopupType.DeleteMyPillFailure);
                    setSelected(undefined);
                    setLoading(false);
                  }
                );
              }}
            >
              삭제
            </button>
          </div>
        );

      case PopupType.ExpiredMedNotice:
        return (
          <div>
            <Icon
              icon='line-md:alert-circle-twotone-loop'
              width='3rem'
              height='3rem'
              style={{ color: 'red' }}
            />
            <br /> <br />
            <b>{selected?.title}</b>폐의약품을 일반 쓰레기로 버리면 심각한 환경
            오염을 유발해요. <br />
            폐의약품 전용 수거함에 버려주세요!
            <br />
            <br />
            <button
              className='bottomClose'
              onClick={() => {
                window.location.href =
                  'https://map.seoul.go.kr/smgis2/short/6OgWi';
              }}
            >
              폐의약품 전용수거함 위치 보기
            </button>
          </div>
        );

      default:
        return PopupContent(type, navigate);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-');
    return `${year}.${month}.${day}`;
  };

  const fetchDatas = async (latestData = false) => {
    fetchMyPills(
      latestData ? 1 : limit,
      latestData ? 0 : offset,
      'createdAt',
      'DESC',
      (data) => {
        addPills(data.data);

        const pillDatas = data.data;
        const temp: MedicationItem[] = pillDatas.map((d: any) => ({
          id: d.pillid,
          title: d.pillname,
          expiration: formatDate(d.expiredat),
          alarmstatus: d.alarmstatus
        }));
        setLoading(false);
        setOffset((prevOffset) => prevOffset + temp.length);

        if (latestData) {
          setItems((prevData) => [...temp, ...prevData]);
        } else {
          setItems((prevData) => [...prevData, ...temp]);
        }

        setItemCount(data.totalCount);
      },
      () => {
        setLoading(false);
      }
    );
  };

  const formatDateToISO = (date: string): string => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const renderItems = (item: MedicationItem, key: number) => {
    return (
      <Item key={key}>
        <div className='title'>
          {/* <Link
            to={`/search/name?q=${item.title}`}
            style={{ color: 'black', textDecoration: 'none' }}
          > */}
          <div className='title2' onClick={() => setSelectedItem(item)}>
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
          {/* </Link> */}

          {deleteItem ? (
            <div
              className='delete-button'
              onClick={() => {
                setSelected(item);
                setPopupType(PopupType.DeleteMyPill);
              }}
            >
              삭제
            </div>
          ) : (
            ''
          )}
        </div>
        <div className='registration'>
          <b>유효기간</b> {item.expiration}
        </div>
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
        <div
          className='info'
          onClick={() => setPopupType(PopupType.ExpiredMedNotice)}
        >
          📍<u>유효기간 지나기 전에 버리세요!</u>
        </div>
        <Item className='add-new-item' style={{ marginBottom: '20px' }}>
          <div className='empty' onClick={() => setAddBottomSheet(true)}>
            <Icon
              icon='basil:add-solid'
              width='2rem'
              height='2rem'
              style={{ color: '#ffbb25' }}
            />
            새로운 나의 약 추가하기
          </div>
        </Item>
        <InfiniteScroll
          className='items'
          loading={loading && <div>로딩중</div>}
          onIntersect={() => fetchDatas()}
        >
          {items.map((item, index) => renderItems(item, index))}
        </InfiniteScroll>

        <Sheet>
          <AddPillBottomSheet
            onSubmit={(name, date, alarm) => {
              setLoading(true);
              addMyPills(
                name,
                date.toString(),
                alarm,
                () => {
                  setAddBottomSheet(false);
                  setLoading(false);
                  fetchDatas(true);
                  setToastMessage('나의 약 등록 완료!');
                },
                () => {
                  setLoading(false);
                  setPopupType(PopupType.AddMyPillFailure);
                }
              );
            }}
            isVisible={addBottomSheet}
            onClose={() => setAddBottomSheet(false)}
          />

          <ModifyPillBottomSheet
            onSubmit={(name, date, alarm) => {
              setLoading(true);
              updateMyPills(
                selectedItem?.id ?? '',
                name,
                date,
                alarm,
                () => {
                  setItems((prevItems) =>
                    prevItems.map((item) =>
                      item.id === (selectedItem?.id ?? '')
                        ? {
                            ...item,
                            title: name,
                            expiration: date,
                            alarmstatus: alarm
                          }
                        : item
                    )
                  );

                  updatePill(selectedItem?.id ?? '', name, date, alarm);
                  setSelectedItem(null);
                  setLoading(false);
                  setToastMessage('나의 약 수정 완료!');
                },
                () => {
                  setLoading(false);
                  setPopupType(PopupType.AddMyPillFailure);
                }
              );
            }}
            isVisible={selectedItem != null}
            _name={selectedItem?.title ?? ''}
            _date={formatDateToISO(selectedItem?.expiration ?? '')}
            _alarm={selectedItem?.alarmstatus ?? false}
            onClose={() => setSelectedItem(null)}
          />
        </Sheet>
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

const Sheet = styled.div`
  .title {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .title2 {
    font-size: 1.1em;
    font-weight: 500;
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
  }

  .info-box {
    margin-bottom: 20px;
  }

  .input-container {
    position: relative;
  }

  .clearButton {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  input {
    width: 100%;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    padding: 12px;
    box-sizing: border-box;
  }

  .bottomClose {
    margin-top: 20px;
  }

  .bottomClose:disabled {
    color: gray;
    background-color: #c7c7c7;
  }
`;

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

  .totalCount {
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    margin-bottom: 10px;
  }

  .info {
    margin-bottom: 30px;
    font-weight: 500;
    margin-left: -5px;

    a {
      color: gray;
      text-decoration: none;
    }
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 30px;
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
    font-weight: bold;
    font-size: 0.9rem;
    justify-content: space-between;
  }

  .title2 {
    display: flex;
    justify-content: space-between;
  }

  .registration {
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
  }

  .empty {
    color: gray;
    border: 1px dotted gray;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    text-align: center;
    padding: 5px 0px 5px 0px;
  }
`;

export default MyMedications;
