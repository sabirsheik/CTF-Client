import { NavLink } from "react-router-dom";
import { useUser, useLogout } from "../../../Hook/Auth/useAuth";

export const Header: React.FC = () => {
  const { data: user, refetch: fetchUser } = useUser();
  const logoutMutation = useLogout();
  const isLoggedIn = !!user;

  const LogoutUser = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.log("Logout error", error);
    } finally {
      fetchUser();
    }
  };

  return (
    <header className="bg-linear-to-r from-baseColor to-hoverColor text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">CTF System</h1>
          {isLoggedIn && user && (
            <span className="hidden md:block text-sm text-green-100">
              Logged in as {user.role}: {user.email}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn && user && (
            <span className="md:hidden text-sm text-green-100">
              {user.role}
            </span>
          )}
          {isLoggedIn ? (
            <button
              onClick={LogoutUser}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};
