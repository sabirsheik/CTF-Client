import { NavLink } from "react-router-dom";
import {
  ShieldCheck,
  LogOut,
  LogIn,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useUser, useLogout } from "../../../Hook/Auth/useAuth";

export const Header: React.FC = () => {
  const { data: user, refetch: fetchUser } = useUser();
  const logoutMutation = useLogout();
  const isLoggedIn = !!user;

  // UI ONLY (Mobile menu)
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-baseColor/90 backdrop-blur-md border-b border-green-500/20 text-green-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-green-500" />
          <h1 className="text-base sm:text-lg font-mono font-bold tracking-widest">
            CTF :: SYSTEM
          </h1>
        </div>

        {/* CENTER: User Info (Desktop only) */}
        {isLoggedIn && user && (
          <div className="hidden lg:flex items-center gap-4 font-mono text-sm">
            <span className="flex items-center gap-2 px-3 py-1 rounded bg-green-500/5 border border-green-500/20">
              <User className="w-4 h-4" />
              {user.email}
            </span>
            <span className="px-3 py-1 rounded bg-green-500/10 border border-green-500/30">
              ROLE: {user.role.toUpperCase()}
            </span>
          </div>
        )}


        {/* RIGHT: Actions + Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button
              onClick={LogoutUser}
              className="hidden sm:flex items-center gap-2 px-4 py-2 font-mono text-sm
                         border border-red-500/40 text-red-400
                         hover:bg-red-500/10 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          ) : (
            <NavLink
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 font-mono text-sm
                         border border-green-500/40 text-green-400
                         hover:bg-green-500/10 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              LOGIN
            </NavLink>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 border border-green-500/30 rounded cursor-pointer"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
};
