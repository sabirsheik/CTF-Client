import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../Hook/Auth/useAuth";
// Protected Route Component
const ProtectedRoute = ({ role }: { role: "user" | "admin" }) => {
  // Get user data
  const { data: user, isLoading } = useUser();
  // Check if user is logged in
  const isLoggedIn = !!user;

  if (isLoading) return null;
  // If not logged in redirect to login Page
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const currentRole = String(user?.role ?? "").toLowerCase();
  const isAdmin = currentRole === "admin";
  const isUser = currentRole === "user";

  // Admin-only routes: admin must match exactly.
  // User routes: allow both user and admin.
  const isAllowed = role === "admin" ? isAdmin : isUser || isAdmin;
  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
