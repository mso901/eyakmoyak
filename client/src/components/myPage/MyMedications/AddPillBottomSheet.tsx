import { Icon } from '@iconify-icon/react';
import BottomSheet from '../../common/BottomSheet';
import { ChangeEvent, useState } from 'react';
import { fetchAutocompleteSuggestions } from '../../../api/searchApi';

const AddPillBottomSheet = ({
  onSubmit,
  isVisible,
  onClose
}: {
  onSubmit: (name: string, date: string, alarm: boolean) => void;
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [alarm, setAlarm] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async (newQuery: string) => {
    if (newQuery === '') return;

    try {
      const results = await fetchAutocompleteSuggestions(newQuery);
      setSuggestions(results.map((r: any) => r.name));
    } catch (error) {
      setSuggestions([]);
    }
  };

  const handleNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    await fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion);
    setSuggestions([]);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
  };

  const isFormValid = (): boolean => {
    return name != '' && date != '';
  };

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <div className='title'>내 약 추가</div>
      <div className='info-box'>
        <div className='title2'>약 이름</div>

        <div className='input-container'>
          <input
            type='text'
            placeholder='약 이름'
            value={name}
            onChange={handleNameChange}
          />
        </div>

        {suggestions.length > 0 && (
          <ul className='drop-down'>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  borderBottom: '1px solid #ddd'
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='info-box'>
        <div className='title2'>
          사용 기한{' '}
          <Icon
            icon={alarm ? 'octicon:bell-16' : 'octicon:bell-slash-16'}
            width='1.4rem'
            height='1.4rem'
            style={{ color: 'gray' }}
            onClick={() => setAlarm(!alarm)}
          />
        </div>
        <div className='input-container'>
          <input
            type='date'
            value={date}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <button
        className='bottomClose'
        disabled={!isFormValid()}
        onClick={() => {
          onSubmit(name, date, alarm);
          setName('');
          setDate('');
          setAlarm(false);
        }}
      >
        등록 완료
      </button>
    </BottomSheet>
  );
};

export default AddPillBottomSheet;
