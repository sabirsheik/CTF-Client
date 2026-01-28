import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UsersRound, Building2, Search, X, Server, FileText, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UsersView } from "./views/UsersView";
import { TeamsView } from "./views/TeamsView";
import { StallsView } from "./views/StallsView";
import { MachinesView } from "./views/MachinesView";
import { ChallengesView } from "./views/ChallengesView";
import { useAdminStats } from "../../Hook/Admin/useAdminApi";
import { ShimmerStatCard } from "@/components/ui/shimmer";

type TabType = "users" | "teams" | "stalls" | "machines" | "challenges";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [globalSearch, setGlobalSearch] = useState("");
  const { data: stats, isLoading: statsLoading } = useAdminStats();

  const tabs = [
    {
      id: "users" as TabType,
      label: "Users",
      icon: Users,
      count: stats?.totalUsers || 0,
      color: "green",
    },
    {
      id: "teams" as TabType,
      label: "Teams",
      icon: UsersRound,
      count: stats?.totalTeams || 0,
      color: "blue",
    },
    {
      id: "stalls" as TabType,
      label: "Project Display Stalls",
      icon: Building2,
      count: stats?.totalStalls || 0,
      color: "purple",
    },
    {
      id: "machines" as TabType,
      label: "CTF Machines",
      icon: Server,
      count: stats?.totalMachines || 0,
      color: "cyan",
    },
    {
      id: "challenges" as TabType,
      label: "CTF Challenges",
      icon: FileText,
      count: stats?.totalChallenges || 0,
      color: "orange",
    },
  ];

  const getTabName = (tab: TabType) => {
    const names = {
      users: "User Management",
      teams: "Team Management",
      stalls: "Project Display Stalls",
      machines: "CTF Machines Submissions",
      challenges: "CTF Challenges Submissions",
    };
    return names[tab];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Title, Rankings Button and Search */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-400 font-mono glow-text mb-2">
              ADMIN DASHBOARD
            </h1>
            <p className="text-green-300/70 font-mono text-sm">
              {getTabName(activeTab)} • System Administration Console
            </p>
          </motion.div>

          {/* Rankings Button and Search */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto"
          >
            {/* Team Rankings Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate("/admin/leaderboard")}
                className="flex items-center gap-2 px-4 py-2 h-10 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 hover:border-yellow-400 text-yellow-400 hover:text-yellow-300 font-mono font-bold transition-all shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20"
              >
                <Trophy className="w-5 h-5" />
                <span className="hidden sm:inline">TEAM RANKINGS</span>
                <span className="sm:hidden">RANKINGS</span>
              </Button>
            </motion.div>

            {/* Search */}
            <div className="relative w-full sm:w-64 lg:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/50 w-4 h-4" />
              <Input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="pl-10 pr-10 bg-slate-800/60 border-2 border-green-500/30 focus:border-green-400 text-green-100 placeholder:text-green-400/40 font-mono h-10 rounded-lg"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400/50 hover:text-green-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Summary Cards with Shimmer Loading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
              >
                {statsLoading ? (
                  <ShimmerStatCard />
                ) : (
                  <Card
                    className={`cursor-pointer transition-all backdrop-blur-xl shadow-lg ${
                      isActive
                        ? "bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-400 shadow-green-500/30"
                        : "bg-slate-900/70 border-2 border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/20"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-mono text-green-400/70 mb-1">
                            {tab.label}
                          </p>
                          <p className="text-3xl font-bold font-mono text-green-400 font-extrabold">
                            {tab.count.toLocaleString()}
                          </p>
                        </div>
                        <motion.div
                          animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-gradient-to-br from-green-500 to-green-600 border-2 border-green-300 shadow-lg shadow-green-500/50"
                              : "bg-green-500/10 border-2 border-green-500/30 group-hover:border-green-400/50"
                          }`}
                        >
                          <Icon
                            className={`w-7 h-7 ${
                              isActive ? "text-white" : "text-green-400/70"
                            }`}
                          />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Active Tab Content with Enhanced Layout */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-lg border-2 border-green-500/30 rounded-lg p-8 shadow-2xl shadow-green-500/10"
        >
          {activeTab === "users" && <UsersView searchQuery={globalSearch} />}
          {activeTab === "teams" && <TeamsView searchQuery={globalSearch} />}
          {activeTab === "stalls" && <StallsView searchQuery={globalSearch} />}
          {activeTab === "machines" && <MachinesView searchQuery={globalSearch} />}
          {activeTab === "challenges" && <ChallengesView searchQuery={globalSearch} />}
        </motion.div>
      </div>
    </div>
  );
};