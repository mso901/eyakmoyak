import { ChangeEvent, useState, KeyboardEvent, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSearchStore } from '../store/search';
import { useSearchHistoryStore } from '../store/searchHistory';
import { fetchAutocompleteSuggestions } from '../api/search';

const SearchBox = () => {
  const { setSearchQuery, searchType, setSearchType, setSuggestions } =
    useSearchStore();
  const [query, setQuery] = useState<string>('');
  const addHistory = useSearchHistoryStore((state) => state.addHistory);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (query.length > 1) {
          const results = await fetchAutocompleteSuggestions(query);
          console.log(results);
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('자동완성 데이터 가져오기 실패:', error);
      }
    };

    fetchSuggestions();
  }, [query, setSuggestions]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query);
      addHistory(query);
      if (searchType === 'efficacy') {
        setSearchType('efficacy');
      }
    } else {
      setSearchQuery('');
      setQuery('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <Link to='/search' onClick={handleSearch}>
        <SearchContainer>
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
          <SearchIcon src={`/img/camera.png`} alt='camera' />
        </SearchContainer>
      </Link>
    </>
  );
};

export default SearchBox;

const SearchContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  width: 90vw;
  height: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const SearchInput = styled.input`
  flex: 1;
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
