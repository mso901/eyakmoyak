import { Icon } from '@iconify-icon/react';
import informationOutline from '@iconify/icons-mdi/information-outline';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  fetchFavoriteStatusApi,
  toggleFavoriteApi
} from '../../api/favoriteApi';
import { fetchFavoriteCount, fetchPillDataByName } from '../../api/searchApi';
import { usePillStore } from '../../store/pill';
import Loading from '../common/Loading';
import Nav from '../common/Nav';
import NotSearched from './NotSearched';
import PillExp from './PillExp';
import Review from './Review';
import SearchHeader from './SearchHeader';

import LoginCheck from '../common/LoginCheck';
import Toast from '../common/Toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { pillData, setPillData, loading, setLoading } = usePillStore();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('effectiveness');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<string>('name');
  const [activeType, setActiveType] = useState<string>(searchType);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');

  const formatTextWithLineBreaks = (text: string) => {
    return text.split('(').map((part, index, array) => (
      <React.Fragment key={index}>
        {part}
        {index < array.length - 1 && (
          <>
            <br />
            {}
          </>
        )}
      </React.Fragment>
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPillDataByName(query, 1, 0);

        if (data) {
          setPillData(data);

          const count = await fetchFavoriteCount(data.id);
          setFavoriteCount(count);

          const { status } = await fetchFavoriteStatusApi(data.id);
          setIsFavorite(status);
        } else {
          setPillData(null);
        }
      } catch (error) {
        console.error('검색결과페이지 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, setIsFavorite, setPillData]);

  const handleToggleFavorite = async () => {
    if (!pillData?.id) return;

    try {
      await toggleFavoriteApi(
        { id: pillData.id },
        (response) => {
          setIsFavorite((prevIsFavorite) => !prevIsFavorite);
          console.log(response.message);
          setShowToast(true);
        },
        (error) => {
          console.error('좋아요 상태 업데이트 에러:', error);
        }
      );
      const count = await fetchFavoriteCount(pillData.id);
      setFavoriteCount(count);
    } catch (error) {
      console.error('좋아요상태 실패:', error);
    }
  };

  const handleTypeClick = (type: string) => {
    setSearchType(type);
    setActiveType(type);
  };

  const openModal = (src: string) => {
    setModalImageSrc(src);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImageSrc('');
  };

  const tabs = [
    { key: 'effectiveness', label: '효능•용법' },
    { key: 'review', label: '리뷰' }
  ];

  if (loading) {
    return <Loading />;
  }

  if (!pillData) {
    return (
      <>
        <NotSearched />
      </>
    );
  }

  return (
    <>
      <SearchHeader activeType={activeType} handleTypeClick={handleTypeClick} />
      <SearchResultsContainer>
        <PillInfo>
          <PillImgs>
            {pillData.boxurl && (
              <img
                src={pillData.boxurl}
                alt='약 박스'
                onClick={() => openModal(pillData.boxurl)}
              />
            )}
            <img
              src={pillData.imgurl}
              alt='알약'
              onClick={() => openModal(pillData.imgurl)}
            />
          </PillImgs>
          <section>
            <PillHeader>
              <PillText>
                <div>
                  <p>{pillData.type}</p>
                  <h3>{formatTextWithLineBreaks(pillData.name)}</h3>
                </div>
                <LoginCheck>
                  {(handleCheckLogin) => (
                    <HeartButton
                      onClick={() => handleCheckLogin(handleToggleFavorite)}
                    >
                      <Icon
                        icon='mdi:heart'
                        style={{
                          color: isFavorite ? 'red' : 'gray'
                        }}
                        width='24'
                        height='24'
                      />
                      <p>{favoriteCount}</p>
                    </HeartButton>
                  )}
                </LoginCheck>
              </PillText>
              <span>{pillData.engname}</span>
              <p>{pillData.companyname}</p>
            </PillHeader>
            <TagContainer className='tagContainer'>
              {pillData.importantWords &&
                pillData.importantWords.trim() &&
                pillData.importantWords.split(', ').map((word) => (
                  <Tag
                    to={`/search/efficacy?q=${word}`}
                    key={word}
                    className='tag'
                  >
                    {word}
                  </Tag>
                ))}

              <InfoIconContainer onClick={() => setShowInfo(!showInfo)}>
                <Icon icon={informationOutline} width='24' height='24' />
              </InfoIconContainer>
              {showInfo && (
                <InfoBox>태그를 클릭해 관련 증상들을 모아보세요.</InfoBox>
              )}
            </TagContainer>
          </section>
        </PillInfo>
        <Source>
          <span>출처 :</span>
          <a target='_blank' href={pillData.source}>
            식품의약품안전처 의약품통합정보시스템
          </a>
        </Source>
        <PillMore>
          <Menu>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={activeTab === tab.key ? 'active' : ''}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </Menu>
          <Contants>
            {activeTab === 'effectiveness' ? (
              <PillExp />
            ) : (
              <Review pillId={pillData.id} />
            )}
          </Contants>
        </PillMore>
      </SearchResultsContainer>
      <Nav />
      {showToast && (
        <Toast onEnd={() => setShowToast(false)}>
          {isFavorite ? '좋아요가 추가되었습니다.' : '좋아요가 취소되었습니다.'}
        </Toast>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Image Modal'
      >
        <img
          src={modalImageSrc}
          alt='확대된 이미지'
          style={{ width: '100%' }}
        />
      </Modal>
    </>
  );
};

export default SearchResults;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '90vh',
    overflow: 'auto'
  }
};

const SearchResultsContainer = styled.div``;

const PillInfo = styled.div`
  display: flex;
  align-items: flex-start;
  width: 80vw;
  margin: auto;

  & section {
    flex: 1;
    padding-left: 15px;
  }
`;

const PillImgs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 35%;
  cursor: pointer;

  & img {
    width: 100%;
  }
`;

const PillHeader = styled.div`
  & p {
    padding-top: 5px;
    padding-bottom: 10px;
    font-size: 12px;
    font-weight: 300;
  }

  & span {
    color: #696969;
    font-size: 10px;
    font-style: italic;
  }
`;

const PillText = styled.div`
  display: flex;

  & h3 {
    font-size: 15px;
    font-weight: 500;
  }
`;

const HeartButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const TagContainer = styled.div`
  position: relative;
`;
const Tag = styled(Link)``;

const InfoIconContainer = styled.div`
  cursor: pointer;
`;

const InfoBox = styled.div`
  position: absolute;
  top: 90%;
  right: 0;
  background: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  font-size: 14px;
`;

const Source = styled.p`
  display: flex;
  align-items: center;
  margin: 15px 10vw;
  font-size: 14px;

  & a {
    display: inline-block;
    max-width: 300px;
    color: #696969;
    margin-left: 5px;
  }
`;

const PillMore = styled.div`
  margin-top: 20px;
`;

const Menu = styled.div`
  display: flex;
  border-bottom: 4px solid var(--main-color);

  & button {
    flex: 1;
    margin: 0;
    padding: 10px;
    text-align: center;
    font-weight: 600;
    border: none;
    background: none;
    cursor: pointer;
  }

  & button.active {
    border-radius: 10px 10px 0 0;
    background-color: var(--main-color);
  }
`;

const Contants = styled.div``;
