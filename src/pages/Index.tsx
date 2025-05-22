
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // This could be used for analytics or other initialization
    console.log('Application initialized');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Redirect to dashboard if logged in, otherwise to login page
  return <Navigate to={user ? "/" : "/login"} replace />;
};

export default Index;
