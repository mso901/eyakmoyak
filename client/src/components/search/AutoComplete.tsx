import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSearchStore } from '../../store/search';

const AutoComplete = () => {
  const { suggestions, setSuggestions } = useSearchStore();

  const handleSelectSuggestion = (suggestion: string) => {
    setSuggestions([]);
    console.log(`Selected suggestion: ${suggestion}`);
  };

  return (
    <div className='searchInner'>
      <p className='listTitle'>추천 검색어</p>
      {suggestions.map((suggestion) => {
        const { name, id } = suggestion;

        return (
          <AutoCompleteItem
            to={`/search/name?q=${name}`}
            key={id}
            onClick={() => handleSelectSuggestion(name)}
            className='listItem'
          >
            {name}
          </AutoCompleteItem>
        );
      })}
    </div>
  );
};

export default AutoComplete;

const AutoCompleteItem = styled(Link)``;
