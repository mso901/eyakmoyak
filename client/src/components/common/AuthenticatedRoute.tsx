import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthenticatedRouteProps {
  element: React.ComponentType;
}

const AuthenticatedRoute = ({
  element: Component
}: AuthenticatedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const login = Cookies.get('login');

        if (login) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('사용자 인증 실패', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <div>로딩 중...</div>;
  }

  return isAuthenticated ? <Component /> : <Navigate to='/login' />;
};

export default AuthenticatedRoute;
