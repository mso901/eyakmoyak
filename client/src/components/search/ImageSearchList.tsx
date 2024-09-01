import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PillData, usePillStore } from '../../store/pill';
import Loading from '../common/Loading';
import { useEffect } from 'react';
import { useSearchStore } from '../../store/search';

const ImageSearchList = ({ pills }: { pills: PillData[] | null }) => {
  const { setPillData, loading } = usePillStore();
  const { setIsImageSearch } = useSearchStore();

  const handleItemClick = (pill: PillData) => {
    setPillData(pill);
  };

  useEffect(() => {
    return () => setIsImageSearch(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='searchInner'>
      <p className='listTitle'>이미지로 검색결과</p>
      {(pills ?? []).map((pill) => (
        <ListItem
          to={`/search/name?q=${pill.name}`}
          key={pill.id}
          onClick={() => {
            handleItemClick(pill);
          }}
          className='listItem'
        >
          <img src={pill.imgurl} alt='알약' />
          <ListText>
            <p>{pill.name}</p>
            <span>{pill.similarity}</span>
          </ListText>
        </ListItem>
      ))}
    </div>
  );
};

export default ImageSearchList;

const ListItem = styled(Link)`
  display: flex;

  & img {
    width: 80px;
    height: auto;
  }
`;

const ListText = styled.div`
  margin-left: 10px;

  & span {
    color: gray;
    font-size: 14px;
  }
`;
