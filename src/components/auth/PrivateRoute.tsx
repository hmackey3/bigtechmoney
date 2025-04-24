
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/providers/auth-provider";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const { user, isLoading } = useAuth();

  // While checking authentication status, show nothing or a loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated, render the protected component
  return <>{element}</>;
};

export default PrivateRoute;
