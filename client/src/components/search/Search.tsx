import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSearchStore } from '../../store/search.ts';
import Nav from '../common/Nav.tsx';
import AutoComplete from './AutoComplete.tsx';
import ImageSearchList from './ImageSearchList.tsx';
import SearchHeader from './SearchHeader.tsx';
import SearchHistory from './SearchHistory.tsx';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchType, setSearchType, isImageSearch, imageResults } =
    useSearchStore();
  const [activeType, setActiveType] = useState<string>(searchType);

  const handleTypeClick = (type: string) => {
    setSearchType(type);
    setActiveType(type);
  };

  const renderer = () => {
    if (isImageSearch) return <ImageSearchList pills={imageResults} />;

    if (query && searchType !== 'efficacy') return <AutoComplete />;

    return <SearchHistory />;
  };

  return (
    <SearchContainer>
      <SearchHeader activeType={activeType} handleTypeClick={handleTypeClick} />
      {renderer()}
      <Nav />
    </SearchContainer>
  );
};

export default Search;

const SearchContainer = styled.div`
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
`;
