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
import { motion } from "framer-motion";
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
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b-2 border-green-500/30 text-green-400 shadow-lg shadow-green-500/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* LEFT: Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            <ShieldCheck className="w-7 h-7 text-green-400 drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
          </motion.div>
          <h1 className="text-base sm:text-lg font-mono font-bold tracking-widest glow-text">
            [ CTF_SYSTEM ]
          </h1>
        </motion.div>

        {/* CENTER: User Info (Desktop only) */}
        {isLoggedIn && user && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:flex items-center gap-4 font-mono text-sm"
          >
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 backdrop-blur-sm"
            >
              <User className="w-4 h-4" />
              {user.email}
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 font-bold"
            >
              [{user.role.toUpperCase()}]
            </motion.span>
          </motion.div>
        )}


        {/* RIGHT: Actions + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={LogoutUser}
              className="flex items-center gap-2 px-5 py-2 font-mono text-sm rounded-lg
                         border-2 border-red-500/50 text-red-400 bg-red-500/10
                         hover:bg-red-500/20 hover:border-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              [LOGOUT]
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={LogoutUser}
              className="flex items-center gap-2 px-5 py-2 font-mono text-sm rounded-lg
                         border-2 border-red-500/50 text-red-400 bg-red-500/10
                         hover:bg-red-500/20 hover:border-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              [LOGOUT]
            </motion.button>
          )}

    
        </div>
      </div>
    </motion.header>
  );
};
