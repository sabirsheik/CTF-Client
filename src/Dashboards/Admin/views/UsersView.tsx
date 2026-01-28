import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAdminUsersInfinite } from "../../../Hook/Admin/useAdminApi";
import { User, Mail, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ShimmerGrid } from "@/components/ui/shimmer";

interface UsersViewProps {
  searchQuery?: string;
}

export const UsersView = ({ searchQuery = "" }: UsersViewProps) => {
  const navigate = useNavigate();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useAdminUsersInfinite(20, debouncedSearch);

  const allUsers = data?.pages.flatMap((page) => page.users) || [];

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && !allUsers.length) {
    return <ShimmerGrid count={9} />;
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-400 font-mono">
        <div className="text-lg font-bold">! Error loading users</div>
        <p className="text-sm mt-2 text-red-300/70">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users Grid with Enhanced Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allUsers.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-green-500/30 hover:border-green-400 transition-all cursor-pointer group shadow-lg hover:shadow-green-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600/80 flex items-center justify-center border-2 border-green-400/50"
                  >
                    <User className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-mono text-green-400 truncate group-hover:text-green-300">
                      {user.username}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-mono mt-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm font-mono">
                  {user.universityName && (
                    <div className="text-gray-400">
                      <span className="text-green-400/70">University:</span>{" "}
                      <span className="text-gray-300">{user.universityName}</span>
                    </div>
                  )}
                  {user.phoneNumber && (
                    <div className="text-gray-400">
                      <span className="text-green-400/70">Phone:</span>{" "}
                      <span className="text-gray-300">{user.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-1 text-xs rounded font-bold transition-all ${
                        user.isVerified
                          ? "bg-green-500/30 text-green-300 border border-green-500/60"
                          : "bg-red-500/20 text-red-400 border border-red-500/50"
                      }`}
                    >
                      {user.isVerified ? "✓ Verified" : "✗ Unverified"}
                    </span>
                    {user.role && (
                      <span className="px-2 py-1 text-xs rounded bg-blue-500/25 text-blue-300 border border-blue-500/60 font-bold">
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/admin/users/${user._id}`)}
                  className="w-full mt-4 bg-gradient-to-r from-green-500/30 to-green-600/20 hover:from-green-500/40 hover:to-green-600/30 text-green-300 border-2 border-green-500/50 hover:border-green-400 font-mono font-bold transition-all py-2 rounded-md"
                >
                  VIEW DETAILS
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {allUsers.length === 0 && !isLoading && (
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
            <User className="w-20 h-20 mx-auto text-green-400/30" />
          </motion.div>
          <p className="text-gray-400 font-mono text-lg">
            {debouncedSearch ? "No users match your search" : "No users found"}
          </p>
          <p className="text-gray-500 font-mono text-sm mt-2">
            {debouncedSearch && "Try adjusting your search criteria"}
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
            <Loader2 className="w-5 h-5 animate-spin text-green-400" />
            <span className="text-green-400/70 font-mono text-sm">
              Loading more users...
            </span>
          </div>
        </motion.div>
      )}

      {/* End of List Indicator */}
      {!hasNextPage && allUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 border-t border-green-500/20 mt-6"
        >
          <p className="text-gray-500 font-mono text-sm">
            ✓ Showing {allUsers.length} users
          </p>
        </motion.div>
      )}
    </div>
  );
};
