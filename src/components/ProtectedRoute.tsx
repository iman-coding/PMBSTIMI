import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  // This is a simplified check. In a real app, you'd verify the token against a backend.
  // For now, we'll just check if the cookie exists.
  const token = document.cookie.includes('token=');
  return token;
};

const ProtectedRoute = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
