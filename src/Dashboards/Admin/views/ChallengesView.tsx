import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAdminFileSubmissionsInfinite } from "../../../Hook/Admin/useAdminApi";
import { FileText, User, Clock, AlertCircle, CheckCircle2, XCircle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShimmerGrid } from "@/components/ui/shimmer";
import { toast } from "sonner";

interface ChallengesViewProps {
  searchQuery?: string;
}

export const ChallengesView = ({ searchQuery = "" }: ChallengesViewProps) => {
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
  } = useAdminFileSubmissionsInfinite(20, debouncedSearch);

  const allSubmissions = data?.pages.flatMap((page) => page.submissions) || [];

  // Download file handler - direct download without auth check
  const handleDownload = (filePath: string, originalName: string) => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const downloadUrl = `${baseUrl}/${filePath}`;
    
    // Create anchor and trigger download
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = originalName;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success(`Downloading ${originalName}`);
  };

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

  if (isLoading && !allSubmissions.length) {
    return <ShimmerGrid count={9} />;
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-400 font-mono">
        <div className="text-lg font-bold">! Error loading CTF challenges</div>
        <p className="text-sm mt-2 text-red-300/70">Please try again later</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/30 text-green-300 border-green-500/60";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allSubmissions.map((submission, index) => {
          const user = typeof submission.userId === "object" ? submission.userId : null;
          
          return (
            <motion.div
              key={submission._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-green-500/30 hover:border-green-400 transition-all shadow-lg hover:shadow-green-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600/80 flex items-center justify-center border-2 border-green-400/50"
                    >
                      <FileText className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-mono text-green-400 truncate">
                        Challenge {submission.challengeId}
                      </CardTitle>
                      {user && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-mono mt-1">
                          <User className="w-3 h-3" />
                          <span className="truncate">{user.username}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="space-y-2 text-sm font-mono">
                    <div className="text-gray-400">
                      <span className="text-green-400/70">Files:</span>{" "}
                      <span className="text-gray-300">
                        {submission.files.length} file{submission.files.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    
                    {submission.files.length > 0 && (
                      <div className="space-y-2">
                        {submission.files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-slate-800/50 p-2 rounded border border-green-500/20">
                            <span className="truncate text-gray-300 flex-1">📄 {file.originalName}</span>
                            <button
                              onClick={() => handleDownload(file.path, file.originalName)}
                              className="ml-2 p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded transition-colors flex items-center gap-1"
                              title="Download file"
                            >
                              <Download className="w-3 h-3 text-green-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 text-xs rounded font-bold transition-all flex items-center gap-1 border ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {getStatusIcon(submission.status)}
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                      
                      {submission.submittedAt && (
                        <span className="px-2 py-1 text-xs rounded bg-blue-500/25 text-blue-300 border border-blue-500/60 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {user && user.email && (
                    <div className="pt-2 border-t border-green-500/20 text-xs font-mono text-gray-400">
                      {user.email}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {allSubmissions.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <FileText className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
          </motion.div>
          <p className="text-green-400/50 font-mono text-lg">
            No CTF challenge submissions found
          </p>
          <p className="text-gray-500 font-mono text-sm mt-2">
            File submissions will appear here once users upload challenge files
          </p>
        </motion.div>
      )}

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-green-500/30 border-t-green-400 rounded-full"
          />
        </div>
      )}
    </div>
  );
};
