import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminUserDetail } from "../../../Hook/Admin/useAdminApi";
import {
  ArrowLeft,
  User,
  Mail,
  Building2,
  Phone,
  Shield,
  Users,
  Flag,
  FileText,
  Loader2,
  Crown,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useAdminUserDetail(userId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <p className="text-red-400 font-mono text-lg">User not found</p>
          <Button
            onClick={() => navigate("/admin")}
            className="mt-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO DASHBOARD
          </Button>
        </div>
      </div>
    );
  }

  const { user, team, challengeSubmissions, fileSubmissions } = data;

  const getMemberName = (member: any) => {
    if (typeof member === "string") return member;
    return member.username || member.email || "Unknown";
  };

  return (
    <div className="min-h-screen bg-black/50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigate("/admin")}
            className="mb-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 hover:border-green-400 font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO DASHBOARD
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-green-400 font-mono glow-text">
            USER DETAILS
          </h1>
        </motion.div>

        {/* User Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-900/90 backdrop-blur-xl border-2 border-green-500/30 mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-400/50">
                  <User className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-mono text-green-400">
                    {user.username}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-3 py-1 text-xs rounded font-mono ${
                        user.isVerified
                          ? "bg-green-500/20 text-green-400 border border-green-500/50"
                          : "bg-red-500/20 text-red-400 border border-red-500/50"
                      }`}
                    >
                      {user.isVerified ? "✓ Verified" : "✗ Unverified"}
                    </span>
                    {user.role && (
                      <span className="px-3 py-1 text-xs rounded font-mono bg-blue-500/20 text-blue-400 border border-blue-500/50">
                        <Shield className="w-3 h-3 inline mr-1" />
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <Separator className="bg-green-500/20" />
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-green-400/70">Email</p>
                      <p className="text-gray-300">{user.email}</p>
                    </div>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-green-400/70">Phone Number</p>
                        <p className="text-gray-300">{user.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                  {user.universityName && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-green-400/70">University</p>
                        <p className="text-gray-300">{user.universityName}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Flag className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-green-400/70">Assigned Challenge</p>
                      <p className="text-gray-300">
                        {user.assignedChallenge
                          ? `Challenge #${user.assignedChallenge}`
                          : "None"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-green-400/70">Eligible Status</p>
                      <p className="text-gray-300">
                        {user.isEligible ? "Eligible" : "Not Eligible"}
                      </p>
                    </div>
                  </div>
                  {user.createdAt && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-green-400/70">Account Created</p>
                        <p className="text-gray-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-slate-900/90 backdrop-blur-xl border-2 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-xl font-mono text-green-400 flex items-center gap-2">
                <Users className="w-6 h-6" />
                TEAM INFORMATION
              </CardTitle>
            </CardHeader>
            <Separator className="bg-green-500/20" />
            <CardContent className="pt-6">
              {team ? (
                <div className="font-mono text-sm space-y-4">
                  <div>
                    <p className="text-green-400/70 mb-2">Team Name</p>
                    <p className="text-gray-300 text-lg">{team.name}</p>
                  </div>
                  <div>
                    <p className="text-green-400/70 mb-2">Team Owner</p>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      {getMemberName(team.owner)}
                    </div>
                  </div>
                  <div>
                    <p className="text-green-400/70 mb-2">
                      Team Members ({team.members?.length || 0})
                    </p>
                    <div className="space-y-2 pl-4">
                      {team.members?.map((member: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-gray-300"
                        >
                          <User className="w-4 h-4 text-green-400/70" />
                          {getMemberName(member)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 font-mono text-center py-4">
                  User is not part of any team
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Challenge Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-slate-900/90 backdrop-blur-xl border-2 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-xl font-mono text-green-400 flex items-center gap-2">
                <Flag className="w-6 h-6" />
               CTF Machine SUBMISSIONS
              </CardTitle>
            </CardHeader>
            <Separator className="bg-green-500/20" />
            <CardContent className="pt-6">
              {challengeSubmissions && challengeSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {challengeSubmissions.map((submission, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/50 border border-green-500/30 rounded p-4 font-mono text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-green-400">
                          Challenge: {submission.machineId}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            submission.isCorrect
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {submission.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        Submitted: {new Date(submission.solvedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 font-mono text-center py-4">
                  No challenge submissions yet
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* File Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-900/90 backdrop-blur-xl border-2 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-xl font-mono text-green-400 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                FILE SUBMISSIONS
              </CardTitle>
            </CardHeader>
            <Separator className="bg-green-500/20" />
            <CardContent className="pt-6">
              {fileSubmissions && fileSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {fileSubmissions.map((submission, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/50 border border-green-500/30 rounded p-4 font-mono text-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-400">
                          Challenge #{submission.challengeId}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            submission.status === "accepted"
                              ? "bg-green-500/20 text-green-400"
                              : submission.status === "rejected"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {submission.files.map((file, fileIdx) => (
                          <div
                            key={fileIdx}
                            className="flex items-center justify-between text-gray-300 bg-slate-900/50 p-2 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-green-400" />
                              <span className="truncate max-w-xs">
                                {file.originalName}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 font-mono text-center py-4">
                  No file submissions yet
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
