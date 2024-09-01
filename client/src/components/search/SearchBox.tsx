import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useState,
  useCallback
} from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  fetchAutocompleteSuggestions,
  fetchPillDataByImage
} from '../../api/searchApi';
import { usePillStore } from '../../store/pill.ts';
import { useSearchStore } from '../../store/search';
import { useSearchHistoryStore } from '../../store/searchHistory';
import BottomPictureSheet from '../myPage/BottomPictureSheet';
import Popup from '../common/popup/Popup';
import PopupContent, { PopupType } from '../common/popup/PopupMessages.tsx';
import { debounce } from 'lodash-es';

const SearchBox = ({ useRoute = false }: { useRoute?: boolean }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const {
    searchType,
    setSuggestions,
    setIsImageSearch,
    isImageSearch,
    setImageResults
  } = useSearchStore();
  const { loading, setLoading } = usePillStore();
  const [bottomSheet, setBottomSheet] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.None);

  const addHistory = useSearchHistoryStore((state) => state.addHistory);

  useEffect(() => {
    if (query && searchType !== 'efficacy') {
      fetchSuggestions(query);
    }
  }, [query, searchType]);

  const fetchSuggestions = async (newQuery: string) => {
    if (newQuery === '') return;

    try {
      const results = await fetchAutocompleteSuggestions(newQuery);
      setSuggestions(results);
    } catch (error) {
      console.error('자동완성 데이터 가져오기 실패:', error);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((newQuery: string) => {
      fetchSuggestions(newQuery);
    }, 300),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value.trim();

    if (isImageSearch) {
      setIsImageSearch(false);
    }

    setSearchParams({ q: newQuery });

    if (newQuery === '') return;

    if (searchType !== 'efficacy') {
      debouncedFetchSuggestions(newQuery);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      addHistory(query);
      navigate(`/search/${searchType}?q=${query}`);
    } else {
      setSearchParams({ q: '' });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCameraClick = () => {
    setBottomSheet(true);
    setPopupVisible(true);
    setPopupType(PopupType.ImageSearchInfo);
  };

  const handleImageUpload = async (images: FileList | null) => {
    if (images) {
      setLoading(true);
      try {
        const results = await fetchPillDataByImage(images, 10, 0);
        setImageResults(results);
        if (useRoute) {
          navigate(`/search`);
        }
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }
    setIsImageSearch(true);
    setBottomSheet(false);
    setPopupVisible(false);
  };

  return (
    <>
      <SearchBoxContainer>
        <StyledLink to='/search' onClick={handleSearch}>
          <SearchIcon
            src={`/img/search_icon.png`}
            alt='search'
            style={{ width: '20px' }}
          />
          <SearchInput
            placeholder='이미지 또는 이름으로 검색'
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </StyledLink>
        <SearchIcon
          src={`/img/camera1.png`}
          alt='camera'
          onClick={handleCameraClick}
        />
      </SearchBoxContainer>
      <BottomPictureSheet
        title={'사진 등록'}
        isLoading={loading}
        useMultiple
        isVisible={bottomSheet}
        onClose={handleImageUpload}
      />
      {popupVisible && (
        <Popup onClose={() => setPopupVisible(false)}>
          {PopupContent(popupType, navigate)}
        </Popup>
      )}
    </>
  );
};

export default SearchBox;

const SearchBoxContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  padding: 0 15px;
  margin-bottom: 10px;
  box-sizing: border-box;
  width: 90vw;
  height: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const StyledLink = styled(Link)`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const SearchInput = styled.input`
  padding-left: 10px;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: none;

  &::placeholder {
    color: #6c6b6b;
  }
`;

const SearchIcon = styled.img`
  width: 24px;
  cursor: pointer;
`;
