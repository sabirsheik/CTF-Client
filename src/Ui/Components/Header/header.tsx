import { ShieldCheck, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";
import { useUser, useLogout } from "../../../Hook/Auth/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../Hook/api/fetchApi";
import { toast } from "sonner";

export const Header: React.FC = () => {
  const { data: user, refetch: fetchUser } = useUser();
  const logoutMutation = useLogout();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user's team status
  const { data: teamsData } = useQuery({
    queryKey: ["userTeamStatus"],
    queryFn: async () => {
      const res = await apiFetch("/api/teams?page=1&limit=50");
      return res;
    },
    enabled: isLoggedIn && user?.role !== "admin",
    staleTime: 30000, // 30 seconds
  });

  // Find user's team and member count
  const myTeam = teamsData?.teams?.find((t: any) => t.viewer?.isMember);
  const teamMemberCount = myTeam?.members?.length || 0;

  const isOnCTFPage =
    location.pathname === "/ctf" ||
    location.pathname === "/ctf/teams";

  const handleCTFAccess = () => {
    // Admins can always access
    if (user?.role === "admin") {
      navigate("/dashboard/auth/user/ctf");
      return;
    }

    // Check if user has a team
    if (!myTeam) {
      toast.error("ACCESS DENIED", {
        description: "Create or join a team before accessing CTF machines.",
        duration: 5000,
        style: {
          background: "rgba(15, 23, 42, 0.95)",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          color: "#ff0000",
          fontFamily: "monospace",
        },
        classNames: {
          description: "!text-white font-mono text-xs",
        },
      });
      return;
    }

    // Check if team has at least 1 members
    if (teamMemberCount < 1) {
      toast.error("ACCESS DENIED", {
        description: "Your team must have at least 2 members to access CTF machines.",
        duration: 5000,
        style: {
          background: "rgba(15, 23, 42, 0.95)",
          border: "2px solid rgba(239, 68, 68, 0.5)",
          color: "#fcfbfb",
          fontFamily: "monospace",
        },
        classNames: {
          description: "!text-white font-mono text-xs",
        },
      });
      return;
    }

    // All checks passed, navigate to CTF
    navigate("/dashboard/auth/user/ctf");
  };

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
      className="sticky top-0 z-50 backdrop-blur-xl border-b-2 border-green-500/30 text-green-400 shadow-lg shadow-green-500/10"
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
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity },
            }}
          >
            <ShieldCheck className="w-7 h-7 text-green-400 drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
          </motion.div>
          <h1 className="text-lg min-[470px]:text-base sm:text-lg font-mono font-bold tracking-widest glow-text cursor-pointer"   onClick={() => navigate(`/dashboard/auth/user/teams`)}>
           CTF SYSTEM
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
              {user.role.toUpperCase()}
            </motion.span>
          </motion.div>
        )}

        {/* RIGHT: Actions + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {isLoggedIn && isOnCTFPage && (
            <button
              onClick={handleCTFAccess}
              className="flex items-center gap-2 px-3 min-[470px]:px-5 py-2 font-mono text-xs min-[470px]:text-sm rounded-lg
                         border-2 border-green-500/50 text-green-400 bg-green-500/10
                         hover:bg-green-500/20 hover:border-green-400 transition-all cursor-pointer"
            >
              CTF Mechines
            </button>
          )}
          {isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={LogoutUser}
              className="flex items-center gap-2 px-3 sm:px-5 py-2 font-mono text-sm rounded-lg
                         border-2 border-red-500/50 text-red-400 bg-red-500/10
                         hover:bg-red-500/20 hover:border-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden min-[570px]:inline">LOGOUT</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={LogoutUser}
              className="flex items-center gap-2 px-3 sm:px-5 py-2 font-mono text-sm rounded-lg
                         border-2 border-red-500/50 text-red-400 bg-red-500/10
                         hover:bg-red-500/20 hover:border-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden min-[570px]:inline">LOGIN</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};
