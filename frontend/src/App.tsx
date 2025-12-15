import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/Dashboard";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { useAuth } from "./state/AuthContext";
import { Skeleton } from "./components/Skeleton";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <Skeleton lines={4} />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;


