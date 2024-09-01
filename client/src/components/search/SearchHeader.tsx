import styled from 'styled-components';
import SearchBox from './SearchBox';

const SEARCH_TYPES = [
  {
    key: 'name',
    label: '이름'
  },
  {
    key: 'efficacy',
    label: '효능'
  }
];

interface SearchHeaderProps {
  activeType?: string;
  handleTypeClick: (type: string) => void;
}

const SearchHeader = ({
  activeType,
  handleTypeClick,
}: SearchHeaderProps) => {
  return (
    <BackgroundHeader>
      <SearchTypeSelect>
        {SEARCH_TYPES.map((type) => {
          const { key, label } = type;
          const isActive = key === activeType;

          return (
            <SearchTypeButton
              key={key}
              onClick={() => handleTypeClick(key)}
              $isActive={isActive}
            >
              {label}
            </SearchTypeButton>
          );
        })}
      </SearchTypeSelect>
      <SearchBox />
    </BackgroundHeader>
  );
};

export default SearchHeader;

const BackgroundHeader = styled.div`
  position: relative;
  margin-bottom: 40px;
  width: 100vw;
  height: 60px;
  background-color: var(--main-color);
`;

const SearchTypeSelect = styled.div`
  padding: 15px 25px;
`;

const SearchTypeButton = styled.button<{ $isActive: boolean }>`
  position: relative;
  color: ${({ $isActive }) => (!$isActive ? 'gray' : 'black')};
  font-size: 15px;
  border: none;
  background: none;

  &:first-child::after {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    content: '';
    display: block;
    width: 1px;
    height: 10px;
    background-color: gray;
  }
`;
