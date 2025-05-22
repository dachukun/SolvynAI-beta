
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from './sidebar/AppSidebar';
import BottomNavbar from './ui/BottomNavbar';
import { useIsMobile } from '@/hooks/use-mobile';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected content with the sidebar or bottom navbar
  return (
    <div className="flex min-h-screen h-screen overflow-hidden">
      {!isMobile && <AppSidebar />}
      <main className="flex-1 overflow-y-auto p-6 w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      {isMobile && <BottomNavbar />}
    </div>
  );
};

export default ProtectedRoute;
