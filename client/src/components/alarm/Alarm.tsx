import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAlarmStore } from '../../store/alarm';
import Nav from '../common/Nav';
import Toast from '../common/Toast';
import AlarmPage from './AlarmPage';
import AlarmSettings from './AlarmSettings';
import Seo from '../common/Seo';

export interface AlarmProps {
  setShowToast: Dispatch<SetStateAction<string>>;
}

const Alarm = () => {
  const [showToast, setShowToast] = useState<string>('');
  const { currentPage, setCurrentPage } = useAlarmStore();

  useEffect(() => {
    return () => setCurrentPage('main');
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'settings':
        return <AlarmSettings setShowToast={setShowToast} />;
      default:
        return <AlarmPage setShowToast={setShowToast} />;
    }
  };

  return (
    <>
      <Seo title={'알람'} />
      <PageContainer>
        {renderContent()}
        {showToast && <Toast onEnd={() => setShowToast('')}>{showToast}</Toast>}
        <Nav />
      </PageContainer>
    </>
  );
};

export default Alarm;

const PageContainer = styled.div`
  width: 100%;
`;
