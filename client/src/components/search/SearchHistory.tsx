import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSearchHistoryStore } from '../../store/searchHistory';
import { useSearchStore } from '../../store/search';

const SearchHistory = () => {
  const { history, clearHistory } = useSearchHistoryStore();
    const { searchType } = useSearchStore();

  return (
    <div className='searchInner'>
      <HistoryTitle className='listTitle'>
        <span>최근 검색어</span>
        <span onClick={clearHistory}>전체삭제</span>
      </HistoryTitle>
      <HistoryList>
        {history.map((item, index) => (
          <HistoryItem
            to={`/search/${searchType}?q=${encodeURIComponent(item)}`}
            key={index}
            className='listItem'
          >
            {item}
          </HistoryItem>
        ))}
      </HistoryList>
    </div>
  );
};

export default SearchHistory;

const HistoryTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HistoryList = styled.div``;

const HistoryItem = styled(Link)``;
