import loadable from '@loadable/component';
import 'dayjs/locale/ko';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AuthenticatedRoute from './components/common/AuthenticatedRoute';

const Home = loadable(() => import('./components/home/Home'));
const News = loadable(() => import('./components/cardNews/News'));
const Search = loadable(() => import('./components/search/Search'));
const SearchResults = loadable(
  () => import('./components/search/SearchResults')
);
const TagPage = loadable(() => import('./components/search/TagPage'));
const Calendar = loadable(() => import('./components/calendar/CalendarPage'));
const Alarm = loadable(() => import('./components/alarm/Alarm'));
const MyPage = loadable(() => import('./components/myPage/MyPage'));
const Login = loadable(() => import('./components/authentication/Login'));
const Register = loadable(() => import('./components/authentication/Register'));
const EmailVerification = loadable(
  () => import('./components/authentication/EmailVerification')
);
const ResetPasswordRequest = loadable(
  () => import('./components/authentication/ResetPasswordRequest')
);
const ResetPassword = loadable(
  () => import('./components/authentication/ResetPassword')
);
const ChatBot = loadable(() => import('./components/chatBot/ChatBot'));
const Redirect = loadable(() => import('./components/authentication/Redirect'));
const NotFound = loadable(() => import('./components/common/NotFound'));

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/news/:num' element={<News />} />
        <Route path='/search' element={<Search />} />
        <Route path='/search/name' element={<SearchResults />} />
        <Route path='/search/efficacy' element={<TagPage />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/alarm' element={<Alarm />} />
        <Route
          path='/myPage'
          element={<AuthenticatedRoute element={MyPage} />}
        />
        <Route path='/login' element={<Login />} />
        <Route path='/verification/email' element={<EmailVerification />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/password/reset/request'
          element={<ResetPasswordRequest />}
        />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/chatbot'
          element={<AuthenticatedRoute element={ChatBot} />}
        />
        <Route path='/snsLogin/callback' element={<Redirect />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
