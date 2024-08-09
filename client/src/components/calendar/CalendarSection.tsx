import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { calendarAllGet } from '../../api/calendarApi';
import { useCalendar, useDateStore } from '../../store/calendar';
import '../../styles/calendar.css';

interface CalendarEntry {
  date: string;
  medications?: {
    name?: string;
    time?: string[];
    taken?: boolean[];
  }[];
  bloodsugarBefore?: number;
  bloodsugarAfter?: number;
  temperature?: number;
  weight?: number;
  calImg?: string;
}

interface TileContentProps {
  date: Date;
  view: string;
}

const CalendarSection: React.FC = () => {
  const login = Cookies.get('login');
  const { value, onChange, edit, arrow, resetPosted } = useDateStore();
  const { calendarEntries, setCalendarEntries } = useCalendar();
  const [postArray, setPostArray] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (login) {
      const fetchData = async () => {
        const data: CalendarEntry[] = (await calendarAllGet()).map(
          (entry: any) => ({
            ...entry,
            medications: entry.medications ?? []
          })
        );
        setCalendarEntries(data);
        const datesWithMedications = new Set(
          data
            .filter((post) => post.medications && post.medications.length > 0)
            .map((post) => new Date(post.date).toDateString())
        );
        setPostArray(datesWithMedications);
      };

      fetchData();
    }
  }, [edit, login, arrow]);

  useEffect(() => {
    const newPosts = calendarEntries.map((post) => ({
      date: dayjs(post.date).format('YYYY-MM-DD'),
      post: true
    }));

    resetPosted(newPosts);
  }, [calendarEntries, edit]);

  const addContent = ({ date, view }: TileContentProps) => {
    if (view === 'month' && postArray.has(date.toDateString())) {
      return (
        <Pill
          src='/img/calendarPill.png'
          alt='pill icon'
          className='pill-icon'
        />
      );
    }

    const healthData = calendarEntries.find(
      (post) => new Date(post.date).toDateString() === date.toDateString()
    );

    if (
      view === 'month' &&
      healthData &&
      (healthData.bloodsugarAfter ||
        healthData.bloodsugarBefore ||
        healthData.temperature ||
        healthData.weight ||
        healthData.calImg)
    ) {
      return (
        <Info
          src='/img/calendarInfo.png'
          alt='info icon'
          className='pill-icon'
        />
      );
    }

    return null;
  };

  const getDayClassName = ({ date, view }: { date: Date; view: string }) => {
    const SUNDAY = 0;
    const SATURDAY = 6;

    if (view !== 'month') {
      return '';
    }

    if (date.getDay() === SUNDAY) {
      return 'sunday';
    }
    if (date.getDay() === SATURDAY) {
      return 'saturday';
    }

    return '';
  };

  const formatDate = (
    date: Date,
    format: string,
    locale: string | undefined
  ) => {
    return dayjs(date)
      .locale(locale ?? 'en')
      .format(format);
  };

  const handleDateChange = (
    newDate: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (Array.isArray(newDate)) {
      if (newDate.length > 0 && newDate[0] instanceof Date) {
        onChange(newDate[0]);
      }
    } else if (newDate instanceof Date || newDate === null) {
      onChange(newDate);
    }
  };

  return (
    <CalendarContainer>
      <Calendar
        onChange={handleDateChange}
        value={value}
        calendarType='gregory'
        formatDay={(locale, date) => formatDate(date, 'D', locale)}
        tileContent={addContent}
        showNeighboringMonth={true}
        tileClassName={({ date, view }) => getDayClassName({ date, view })}
        className={`react-calendar ${
          (value as any).view === 'decade' ? 'react-calendar--decade-view' : ''
        } ${(value as any).view === 'year' ? 'react-calendar--year-view' : ''}`}
      />
    </CalendarContainer>
  );
};

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Pill = styled.img`
  width: 14px;
  height: auto;
`;

const Info = styled.img`
  width: 15px;
`;

export default CalendarSection;
