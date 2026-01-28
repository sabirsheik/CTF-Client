import { motion } from "framer-motion";
import { useAdminTeamsInfinite } from "../../../Hook/Admin/useAdminApi";
import { Users, User, Crown, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Team, User as UserType } from "../../../Hook/Admin/useAdminApi";
import { ShimmerGrid } from "@/components/ui/shimmer";

interface TeamsViewProps {
  searchQuery?: string;
}

export const TeamsView = ({ searchQuery = "" }: TeamsViewProps) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use larger limit when searching to load all teams
  const fetchLimit = debouncedSearch ? 200 : 20;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useAdminTeamsInfinite(fetchLimit, debouncedSearch);

  const allTeams = data?.pages.flatMap((page) => page.teams) || [];

  // Filter teams based on search query (client-side filtering)
  const teams = allTeams.filter((team) => {
    if (!team || !team._id) return false;
    if (!debouncedSearch) return true;
    
    const query = debouncedSearch.toLowerCase();
    const teamName = team.name?.toLowerCase() || "";
    const ownerName = typeof team.owner === "string" 
      ? team.owner.toLowerCase() 
      : (team.owner?.username?.toLowerCase() || team.owner?.email?.toLowerCase() || "");
    
    // Also search in member names
    const memberNames = (team.members || []).map((m: any) => 
      typeof m === "string" ? m.toLowerCase() : (m?.username?.toLowerCase() || m?.email?.toLowerCase() || "")
    ).join(" ");
    
    return teamName.includes(query) || ownerName.includes(query) || memberNames.includes(query);
  });

  // Auto-fetch all pages when searching
  useEffect(() => {
    if (debouncedSearch && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [debouncedSearch, hasNextPage, isFetchingNextPage, fetchNextPage, allTeams.length]);

  // Infinite scroll handler with improved detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      if (
        scrollTop + clientHeight >= scrollHeight - 300 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && !allTeams.length) {
    return <ShimmerGrid count={6} />;
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-400 font-mono">
        <div className="text-lg font-bold">! Error loading teams</div>
        <p className="text-sm mt-2 text-red-300/70">Please try again later</p>
      </div>
    );
  }

  const getMemberCount = (team: Team | null | undefined) => {
    if (!team || !team.members) return 0;
    return Array.isArray(team.members) ? team.members.length : 0;
  };

  const getOwnerName = (owner: UserType | string | undefined) => {
    if (!owner) return "Unknown";
    if (typeof owner === "string") return owner || "Unknown";
    return owner?.username || owner?.email || "Unknown";
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.filter((team) => team && team._id).map((team, index) => (
          <motion.div
            key={team._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer group shadow-lg hover:shadow-blue-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600/80 flex items-center justify-center border-2 border-blue-400/50"
                  >
                    <Users className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-mono text-blue-300 truncate group-hover:text-blue-200">
                      {team.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-mono mt-1">
                      <Crown className="w-3 h-3 text-yellow-400" />
                      <span className="truncate">{getOwnerName(team.owner)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-blue-400/70">Members:</span>
                    <span className="text-blue-300 font-bold">{getMemberCount(team)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-blue-400/70">Join Requests:</span>
                    <span className="text-yellow-400 font-bold">
                      {team.joinRequests?.length || 0}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Created:{" "}
                    {new Date(team.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTeam(team)}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500/30 to-blue-600/20 hover:from-blue-500/40 hover:to-blue-600/30 text-blue-300 border-2 border-blue-500/50 hover:border-blue-400 font-mono font-bold py-2 rounded-md transition-all"
                >
                  VIEW DETAILS
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {teams.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4"
          >
            <Users className="w-20 h-20 mx-auto text-blue-400/30" />
          </motion.div>
          <p className="text-gray-400 font-mono text-lg">
            {searchQuery ? "No teams match your search" : "No teams found"}
          </p>
          <p className="text-gray-500 font-mono text-sm mt-2">
            {searchQuery && "Try adjusting your search criteria"}
          </p>
        </motion.div>
      )}

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-6"
        >
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-blue-400/70 font-mono text-sm">
              Loading more teams...
            </span>
          </div>
        </motion.div>
      )}

      {/* End of List Indicator */}
      {!hasNextPage && teams.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 border-t border-blue-500/20 mt-6"
        >
          <p className="text-gray-500 font-mono text-sm">
            ✓ Showing {teams.length} teams
          </p>
        </motion.div>
      )}

      {/* Team Detail Dialog */}
      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="border-green-500/30 bg-slate-900/95 text-green-100 backdrop-blur-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-green-400 text-2xl">
              {selectedTeam?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 font-mono">
            {/* Owner */}
            <div className="bg-slate-800/50 border border-green-500/30 rounded p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-green-400 font-bold">Team Owner</span>
              </div>
              <p className="text-gray-300 pl-7">
                {getOwnerName(selectedTeam?.owner as any)}
              </p>
            </div>

            {/* Members */}
            <div className="bg-slate-800/50 border border-green-500/30 rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold">
                  Members ({getMemberCount(selectedTeam!)})
                </span>
              </div>
              <div className="space-y-2 pl-7">
                {selectedTeam?.members?.map((member: any, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <User className="w-4 h-4 text-green-400/70" />
                    <span>
                      {typeof member === "string"
                        ? member
                        : member.username || member.email || "Unknown"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Requests */}
            {selectedTeam?.joinRequests && selectedTeam.joinRequests.length > 0 && (
              <div className="bg-slate-800/50 border border-yellow-500/30 rounded p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">
                    Pending Join Requests ({selectedTeam.joinRequests.length})
                  </span>
                </div>
                <div className="space-y-2 pl-7">
                  {selectedTeam.joinRequests.map((request: any, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-gray-300"
                    >
                      <span>
                        {typeof request.user === "string"
                          ? request.user
                          : request.user.username || request.user.email || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-gray-500 pt-2 border-t border-green-500/20">
              <div>Created: {new Date(selectedTeam?.createdAt || "").toLocaleString()}</div>
              <div>Last Updated: {new Date(selectedTeam?.updatedAt || "").toLocaleString()}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
