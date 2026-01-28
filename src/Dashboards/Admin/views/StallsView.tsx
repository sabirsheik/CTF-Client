import { motion } from "framer-motion";
import { useAdminStalls, useDeleteStall } from "../../../Hook/Admin/useAdminApi";
import { Download, Trash2, Loader2, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ShimmerGrid } from "@/components/ui/shimmer";
import { useState, useEffect } from "react";

interface StallsViewProps {
  searchQuery?: string;
}

export const StallsView = ({ searchQuery = "" }: StallsViewProps) => {
  const { data, isLoading, isError } = useAdminStalls();
  const deleteStallMutation = useDeleteStall();
  const queryClient = useQueryClient();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter stalls
  const allStalls = (data?.data || []).filter((stall: any) => {
    if (!debouncedSearch) return true;
    const query = debouncedSearch.toLowerCase();
    return (
      stall.productName.toLowerCase().includes(query) ||
      stall.name.toLowerCase().includes(query) ||
      stall.email.toLowerCase().includes(query) ||
      stall.companyOrUniversity.toLowerCase().includes(query)
    );
  });

  const stalls = allStalls.slice(0, visibleCount);
  const hasMore = visibleCount < allStalls.length;

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        hasMore &&
        !isLoading
      ) {
        setVisibleCount((prev) => prev + 20);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  if (isLoading) return <ShimmerGrid count={6} />;

  if (isError) {
    return (
      <div className="text-center py-12 text-red-400 font-mono">
        <div className="text-lg font-bold">! Error loading stalls</div>
        <p className="text-sm mt-2 text-red-300/70">Please try again later</p>
      </div>
    );
  }

  const handleDownloadPDF = (submission: any) => {
    const submissionDate = new Date(submission.submissionDate).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Stall Submission - ${submission.productName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      background: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #10b981;
    }
    .header-icon {
      font-size: 32px;
    }
    .header-title {
      color: #10b981;
      font-size: 28px;
      font-weight: bold;
    }
    .info-box {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
      padding: 15px 20px;
      margin-bottom: 25px;
      border-radius: 4px;
    }
    .info-row {
      margin-bottom: 8px;
    }
    .info-label {
      color: #10b981;
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-value {
      color: #1f2937;
      font-size: 14px;
      margin-top: 2px;
    }
    .section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: #fafafa;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .section-icon {
      font-size: 20px;
    }
    .section-title {
      color: #1f2937;
      font-size: 18px;
      font-weight: bold;
    }
    .field {
      margin-bottom: 12px;
    }
    .field-label {
      color: #10b981;
      font-weight: 600;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .field-value {
      color: #374151;
      font-size: 14px;
      line-height: 1.5;
    }
    .description-box {
      background: white;
      padding: 15px;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <span class="header-icon">🏢</span>
      <h1 class="header-title">Project Display - Stall Submission</h1>
    </div>

    <!-- Submission Info Box -->
    <div class="info-box">
      <div class="info-row">
        <div class="info-label">Submission ID:</div>
        <div class="info-value">${submission._id}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Submission Date:</div>
        <div class="info-value">${submissionDate}</div>
      </div>
    </div>

    <!-- Contact Information Section -->
    <div class="section">
      <div class="section-header">
        <span class="section-icon">📋</span>
        <h2 class="section-title">Contact Information</h2>
      </div>
      <div class="field">
        <div class="field-label">Name:</div>
        <div class="field-value">${submission.name}</div>
      </div>
      <div class="field">
        <div class="field-label">Email:</div>
        <div class="field-value">${submission.email}</div>
      </div>
      <div class="field">
        <div class="field-label">Phone Number:</div>
        <div class="field-value">${submission.phoneNumber}</div>
      </div>
      <div class="field">
        <div class="field-label">Company / University:</div>
        <div class="field-value">${submission.companyOrUniversity}</div>
      </div>
    </div>

    <!-- Product Information Section -->
    <div class="section">
      <div class="section-header">
        <span class="section-icon">🎯</span>
        <h2 class="section-title">Product Information</h2>
      </div>
      <div class="field">
        <div class="field-label">Product Name:</div>
        <div class="field-value">${submission.productName}</div>
      </div>
      <div class="field">
        <div class="field-label">Product Description:</div>
        <div class="description-box">
          <div class="field-value">${submission.productDescription}</div>
        </div>
      </div>
    </div>

    <!-- Team Members Section -->
    ${submission.teamMembers ? `
    <div class="section">
      <div class="section-header">
        <span class="section-icon">👥</span>
        <h2 class="section-title">Team Members</h2>
      </div>
      <div class="field-value">${submission.teamMembers}</div>
    </div>
    ` : ''}
  </div>
</body>
</html>
    `.trim();

    const blob = new Blob([pdfContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stall-submission-${submission._id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("✓ Submission exported");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete submission from "${name}"?`)) return;

    try {
      await deleteStallMutation.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["admin", "stalls"] });
      toast.success("✓ Submission deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete submission");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stalls.map((submission: any, index: number) => (
          <motion.div
            key={submission._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
           <Card className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-green-500/30 hover:border-green-400 transition-all h-full shadow-lg hover:shadow-green-500/20 overflow-hidden">
  <CardHeader className="pb-3 overflow-hidden">
    <div className="flex items-start gap-3 mb-2 overflow-hidden">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-green-500 to-green-600/80 flex items-center justify-center border-2 border-green-400/50"
      >
        <Building2 className="w-5 h-5 text-white" />
      </motion.div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <CardTitle className="text-lg font-mono text-green-300 truncate">
          {submission.productName}
        </CardTitle>
        <p className="text-xs text-gray-400 font-mono truncate">
          {submission.companyOrUniversity}
        </p>
      </div>
    </div>
  </CardHeader>

  <CardContent className="space-y-3 overflow-hidden">
    <div className="bg-slate-800/40 rounded p-3 space-y-1 text-xs font-mono overflow-hidden">
      <p className="text-green-400/70">Contact</p>

      <p className="text-gray-300 break-words max-w-full">
        {submission.name}
      </p>

      <p className="text-gray-300 break-all max-w-full whitespace-normal">
        {submission.email}
      </p>

      <p className="text-gray-300 break-words max-w-full">
        {submission.phoneNumber}
      </p>
    </div>

    <div className="text-xs overflow-hidden">
      <span className="text-green-400/70 font-mono">Description:</span>
      <p className="text-gray-400 line-clamp-2 font-mono break-words max-w-full">
        {submission.productDescription}
      </p>
    </div>

    <div className="text-xs text-gray-500 border-t border-green-500/20 pt-2 font-mono break-words">
      {new Date(submission.submissionDate).toLocaleDateString()}
    </div>

    <div className="flex gap-2 mt-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleDownloadPDF(submission)}
        className="flex-1 flex items-center justify-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/50 hover:border-green-400 font-mono text-xs py-2 rounded overflow-hidden"
      >
        <Download className="w-3 h-3" />
        Export
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleDelete(submission._id, submission.name)}
        className="flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 p-2 rounded shrink-0"
      >
        <Trash2 className="w-3 h-3" />
      </motion.button>
    </div>
  </CardContent>
</Card>

          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {stalls.length === 0 && !isLoading && (
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
            <Building2 className="w-20 h-20 mx-auto text-purple-400/30" />
          </motion.div>
          <p className="text-gray-400 font-mono text-lg">
            {debouncedSearch ? "No stalls match your search" : "No stall submissions found"}
          </p>
          <p className="text-gray-500 font-mono text-sm mt-2">
            {debouncedSearch && "Try adjusting your search criteria"}
          </p>
        </motion.div>
      )}

      {/* Loading More Indicator */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-6"
        >
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            <span className="text-purple-400/70 font-mono text-sm">
              Scroll for more submissions...
            </span>
          </div>
        </motion.div>
      )}

      {/* End of List Indicator */}
      {!hasMore && stalls.length > 0 && allStalls.length > 20 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 border-t border-purple-500/20 mt-6"
        >
          <p className="text-gray-500 font-mono text-sm">
            ✓ Showing all {allStalls.length} submissions
          </p>
        </motion.div>
      )}
    </div>
  );
};
