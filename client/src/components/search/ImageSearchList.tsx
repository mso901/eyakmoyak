import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PillData, usePillStore } from '../../store/pill';
import Loading from '../Loading';
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
      {pill.similarity ? (
        <p>
          텍스트 추출이 불가능하여 AI 이미지 유사도 검사를 통해 유사한 알약을
          찾았습니다.
        </p>
      ) : (
        <p>AI 텍스트 추출 기술을 이용하여 유사한 알약을 찾았습니다.</p>
      )}
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
