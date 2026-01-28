import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy, Users, Target, Medal, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import apiFetch from "../../../Hook/api/fetchApi";

interface TeamRanking {
  rank: number;
  _id: string;
  name: string;
  points: number;
  solvedCount: number;
  memberCount: number;
  owner: string;
  members: string[];
}

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return { emoji: "🥇", color: "from-yellow-400 to-amber-500", border: "border-yellow-400", text: "text-yellow-400", bg: "bg-yellow-500/20" };
    case 2:
      return { emoji: "🥈", color: "from-gray-300 to-gray-400", border: "border-gray-300", text: "text-gray-300", bg: "bg-gray-400/20" };
    case 3:
      return { emoji: "🥉", color: "from-amber-600 to-amber-700", border: "border-amber-600", text: "text-amber-500", bg: "bg-amber-500/20" };
    default:
      return { emoji: `#${rank}`, color: "from-green-500/50 to-green-600/50", border: "border-green-500/30", text: "text-green-400", bg: "bg-green-500/10" };
  }
};

export const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TeamRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/admin/leaderboard");
      setTeams(data.leaderboard);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchLeaderboard();

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          {/* Back Button & Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate("/dashboard/auth/admin")}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border-2 border-green-500/50 hover:border-green-400 text-green-400 hover:text-green-300 hover:bg-green-500/20 font-mono transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">BACK TO DASHBOARD</span>
                <span className="sm:hidden">BACK</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="w-10 h-10 text-yellow-400" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-mono text-green-400 glow-text">
                TEAM RANKINGS
              </h1>
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="w-10 h-10 text-yellow-400" />
              </motion.div>
            </div>
            
          </motion.div>

          {/* Refresh Button & Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={fetchLeaderboard}
              disabled={loading}
              className="p-3 rounded-lg bg-green-500/20 border-2 border-green-500/50 hover:bg-green-500/30 hover:border-green-400 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-green-400 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono text-green-400/50 block">Last updated</span>
              <span className="text-sm font-mono text-green-400">{lastUpdated.toLocaleTimeString()}</span>
            </div>
          </motion.div>
        </div>       
       {/* Total Teams */}
        {/* {teams.length > 0 && (
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border-2 border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-green-300/70 font-mono text-sm">Total Teams</p>
            <p className="text-3xl font-bold font-mono text-green-400">{teams.length}</p>
          </div>
        )} */}
        {/* Leaderboard Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className=" p-4 md:p-6 lg:p-8"
        >
          {loading && teams.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-12 h-12 text-green-400" />
              </motion.div>
            </div>
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-green-400/50">
              <Trophy className="w-20 h-20 mb-4" />
              <p className="font-mono text-xl">No teams found</p>
              <p className="font-mono text-sm mt-2">Teams will appear here once created</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {teams.map((team, index) => {
                  const badge = getRankBadge(team.rank);
                  const isTopThree = team.rank <= 3;

                  return (
                    <motion.div
                      key={team._id}
                      layout
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: index * 0.05
                      }}
                      className={`relative rounded-xl border-2 ${badge.border} ${badge.bg} p-4 md:p-6 backdrop-blur-xl overflow-hidden group`}
                    >
                      {/* Animated background for top 3 */}
                      {isTopThree && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${badge.color} opacity-10`}
                          animate={{ opacity: [0.05, 0.15, 0.05] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10 flex items-center gap-4 md:gap-6">
                        {/* Rank Badge */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-2xl md:text-3xl lg:text-4xl font-bold">
                            {isTopThree ? badge.emoji : team.rank}
                          </span>
                        </motion.div>

                        {/* Team Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold font-mono ${badge.text} truncate`}>
                              {team.name}
                            </h3>
                            {isTopThree && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                              >
                                <Medal className={`w-6 h-6 md:w-7 md:h-7 ${badge.text}`} />
                              </motion.span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-2 text-sm md:text-base font-mono text-green-300/70">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {team.memberCount} members
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {team.solvedCount} solved
                            </span>
                            <span className="hidden md:block">Owner: {team.owner}</span>
                          </div>
                          {/* Members list - visible on larger screens */}
                          {team.members.length > 0 && (
                            <div className="hidden lg:flex flex-wrap items-center gap-2 mt-2">
                              {team.members.slice(0, 5).map((member, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs font-mono bg-green-500/10 border border-green-500/30 rounded-full text-green-300">
                                  {member}
                                </span>
                              ))}
                              {team.members.length > 5 && (
                                <span className="text-xs font-mono text-green-400/50">
                                  +{team.members.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Points */}
                        <div className="flex-shrink-0 text-right">
                          <motion.div
                            key={team.points}
                            initial={{ scale: 1.3, color: "#4ade80" }}
                            animate={{ scale: 1, color: isTopThree ? undefined : "#4ade80" }}
                            transition={{ duration: 0.3 }}
                            className={`text-3xl md:text-4xl lg:text-5xl font-bold font-mono ${badge.text}`}
                          >
                            {team.points}
                          </motion.div>
                          <span className="text-sm md:text-base font-mono text-green-300/50">points</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
