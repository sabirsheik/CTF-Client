import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import apiFetch from "../../../Hook/api/fetchApi";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Terminal, Zap, CheckCircle, Send, ArrowLeft, Lightbulb, Eye, Lock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../Hook/Auth/useAuth";

interface Hint {
  hintNumber: number;
  text: string | null;
  cost: number;
  isViewed: boolean;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  link: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  hints: Hint[];
  firstSolver: {
    username: string;
    solvedAt: Date;
  } | null;
  teamSolved: {
    solvedBy: string;
    solvedAt: Date;
  } | null;
}

interface HintConfirmation {
  machineId: string;
  hintNumber: number;
  cost: number;
}

export const CTF = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [flags, setFlags] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<{ [key: string]: string }>({});
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [teamPoints, setTeamPoints] = useState<number>(0);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [hintConfirmation, setHintConfirmation] = useState<HintConfirmation | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const navigate = useNavigate();
  const { data: user } = useUser();

  // Check team access on mount
  useEffect(() => {
    const checkTeamAccess = async () => {
      // Admins can always access
      if (user?.role === "admin") {
        setAccessChecked(true);
        return;
      }

      try {
        const res = await apiFetch("/api/teams?page=1&limit=50");
        const myTeam = res?.teams?.find((t: any) => t.viewer?.isMember);
        const memberCount = myTeam?.members?.length || 0;

        if (!myTeam) {
          toast.error("ACCESS DENIED", {
            description: "Create or join a team before accessing CTF machines.",
            duration: 5000,
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              border: "2px solid rgba(239, 68, 68, 0.5)",
              color: "#ffffff",
              fontFamily: "monospace",
            },
            classNames: {
              description: "!text-white font-mono text-xs",
            },
          });
          navigate("/dashboard/auth/user/teams");
          return;
        }

        if (memberCount < 2) {
          toast.error("ACCESS DENIED", {
            description: "Your team must have at least 2 members to access CTF machines.",
            duration: 5000,
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              border: "2px solid rgba(239, 68, 68, 0.5)",
              color: "#ffffff",
              fontFamily: "monospace",
            },
            classNames: {
              description: "!text-white font-mono text-xs",
            },
          });
          navigate("/dashboard/auth/user/teams");
          return;
        }

        setAccessChecked(true);
      } catch (error) {
        console.error("Failed to check team access:", error);
        navigate("/dashboard/auth/user/teams");
      }
    };

    if (user) {
      checkTeamAccess();
    }
  }, [user, navigate]);

  useEffect(() => {
    if (accessChecked) {
      fetchChallenges();
      fetchUserSolvedChallenges();
    }
  }, [accessChecked]);

  const fetchChallenges = async () => {
    try {
      const data = await apiFetch("/api/challenges");
      setChallenges(data.challenges);
      setTeamPoints(data.teamPoints || 0);
      setTeamName(data.teamName);
    } catch (error: any) {
      console.error("Failed to load challenges:", error.message);
    }
  };

  const fetchUserSolvedChallenges = async () => {
    try {
      const data = await apiFetch("/api/challenges/solved");
      setSolvedChallenges(data.solvedChallenges || []);
    } catch (error: any) {
      console.error("Failed to load solved challenges:", error.message);
    }
  };

  // Show loading while checking access
  if (!accessChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Terminal className="w-12 h-12 text-green-400" />
        </motion.div>
      </div>
    );
  }

  const handleFlagChange = (machineId: string, value: string) => {
    setFlags({ ...flags, [machineId]: value });
  };

  const handleSubmit = async (machineId: string) => {
    setLoading({ ...loading, [machineId]: true });
    setMessage({ ...message, [machineId]: "" });
    try {
      const data = await apiFetch("/api/challenges/submit", {
        method: "POST",
        body: { machineId, flag: flags[machineId] },
      });

      setMessage({ ...message, [machineId]: data.message });
      if (data.success) {
        const successMsg = data.pointsEarned 
          ? `${data.message} (+${data.pointsEarned} points!)` 
          : data.message;
        toast.success(successMsg);
        // Refresh challenges and solved list to show updated solver info
        setTimeout(() => {
          fetchChallenges();
          fetchUserSolvedChallenges();
          setFlags({ ...flags, [machineId]: "" });
        }, 1500);
        // Auto-clear success messages after 3 seconds
        setTimeout(() => {
          setMessage((prev) => ({ ...prev, [machineId]: "" }));
        }, 3000);
      } else {
        toast.error(data.message || "Incorrect flag");
        // Auto-clear error messages after 5 seconds
        setTimeout(() => {
          setMessage((prev) => ({ ...prev, [machineId]: "" }));
        }, 5000);
      }
    } catch (error: any) {
      const errorMsg = error.message || "Submission failed";
      setMessage({ ...message, [machineId]: errorMsg });
      toast.error(errorMsg);
      // Auto-clear error messages after 5 seconds
      setTimeout(() => {
        setMessage((prev) => ({ ...prev, [machineId]: "" }));
      }, 5000);
    }
    setLoading({ ...loading, [machineId]: false });
  };

  const openHintConfirmation = (machineId: string, hintNumber: number, cost: number) => {
    setHintConfirmation({ machineId, hintNumber, cost });
  };

  const handleViewHint = async () => {
    if (!hintConfirmation) return;
    
    setHintLoading(true);
    try {
      const data = await apiFetch("/api/challenges/hint", {
        method: "POST",
        body: { 
          machineId: hintConfirmation.machineId, 
          hintNumber: hintConfirmation.hintNumber 
        },
      });

      if (data.success) {
        toast.success(`Hint revealed! (-${hintConfirmation.cost} points)`);
        fetchChallenges(); // Refresh to show the hint
      } else {
        toast.error(data.message || "Failed to view hint");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to view hint");
    } finally {
      setHintLoading(false);
      setHintConfirmation(null);
    }
  };

  return (
    <>
      <div className="min-h-screen p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="container">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate(`/dashboard/auth/user/teams`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded font-mono text-sm hover:bg-green-500/30 transition-colors mb-10 lg:mb-0 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <motion.h1
              className="text-5xl font-bold text-green-400 font-mono mb-3 glow-text"
              animate={{
                textShadow: [
                  "0 0 10px rgba(0, 255, 65, 0.8)",
                  "0 0 20px rgba(0, 255, 65, 0.8)",
                  "0 0 10px rgba(0, 255, 65, 0.8)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              CTF MACHINES
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-green-300/70 font-mono text-sm"
            >
              CAPTURE THE FLAG
            </motion.p>
            {teamName && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 border-2 border-green-400/50 rounded-lg"
              >
                <span className="text-green-300 font-mono text-sm">Team:</span>
                <span className="text-green-400 font-bold font-mono text-lg">{teamName}</span>
                <span className="text-green-300 font-mono text-sm">|</span>
                <span className="text-green-300 font-mono text-sm">Score:</span>
                <motion.span 
                  key={teamPoints}
                  initial={{ scale: 1.5, color: '#4ade80' }}
                  animate={{ scale: 1, color: '#4ade80' }}
                  transition={{ duration: 0.3 }}
                  className="text-green-400 font-bold font-mono text-2xl"
                >
                  {teamPoints}
                </motion.span>
                <span className="text-green-300 font-mono text-sm">pts</span>
              </motion.div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, rotateY: 2 }}
              >
                <Card className="p-6 bg-slate-900/90 backdrop-blur-xl border-2 border-green-500/30 rounded-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-green-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Terminal className="w-6 h-6 text-green-400" />
                      </motion.div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-green-500/20 text-green-400 border border-green-500/50">
                          {challenge.points} PTS
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                          challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                          challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                          'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                          {challenge.difficulty.toUpperCase()}
                        </span>
                        {challenge.firstSolver && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-green-400 mb-3 font-mono">
                      {challenge.name}
                    </h2>
                    <p className="text-gray-300 mb-4 text-[15px] leading-relaxed font-mono">
                      {challenge.description}
                    </p>
                    <motion.a
                      href={challenge.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="text-green-400 hover:text-green-300 underline text-sm mb-4 block font-mono transition-colors"
                    >
                      {challenge.link}
                    </motion.a>

                    <div className="space-y-3">
                      {challenge.teamSolved ? (
                        <>
                          <Input
                            type="text"
                            placeholder="Solved by your team"
                            value=""
                            disabled
                            className="bg-slate-800/30 border-green-500/20 text-gray-500 placeholder:text-gray-600 font-mono cursor-not-allowed"
                          />
                          <Button
                            disabled
                            className="w-full bg-green-500/10 text-green-400/50 border-2 border-green-500/30 cursor-not-allowed font-mono font-bold flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            TEAM SOLVED
                          </Button>
                        </>
                      ) : solvedChallenges.includes(challenge.id) ? (
                        <>
                          <Input
                            type="text"
                            placeholder="Already solved"
                            value=""
                            disabled
                            className="bg-slate-800/30 border-green-500/20 text-gray-500 placeholder:text-gray-600 font-mono cursor-not-allowed"
                          />
                          <Button
                            disabled
                            className="w-full bg-green-500/10 text-green-400/50 border-2 border-green-500/30 cursor-not-allowed font-mono font-bold flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            ALREADY SOLVED
                          </Button>
                        </>
                      ) : (
                        <>
                          <Input
                            type="text"
                            placeholder="Enter flag..."
                            value={flags[challenge.id] || ""}
                            onChange={(e) =>
                              handleFlagChange(challenge.id, e.target.value)
                            }
                            className="bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono"
                          />
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={() => handleSubmit(challenge.id)}
                              // disabled={
                              //   loading[challenge.id] || !flags[challenge.id]
                              // }
                              disabled
                              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 cursor-pointer font-mono font-bold transition-all flex items-center justify-center gap-2"
                            >
                              {loading[challenge.id] ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                  >
                                    <Zap className="w-4 h-4" />
                                  </motion.div>
                                  SUBMITTING...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  SUBMIT FLAG
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </>
                      )}
                      {message[challenge.id] && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-sm font-mono font-bold ${
                            message[challenge.id].includes("Congratulations") ||
                            message[challenge.id].includes("correct")
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {message[challenge.id].includes("Congratulations") ||
                          message[challenge.id].includes("correct")
                            ? "✓ "
                            : "✗ "}
                          {message[challenge.id]}
                        </motion.p>
                      )}
                    </div>

                    {challenge.teamSolved && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 bg-blue-500/10 border border-blue-400/50 rounded-lg"
                      >
                        <p className="text-blue-400 font-bold text-sm font-mono">
                          ✓ Solved by your team (+{challenge.points} pts)
                        </p>
                      </motion.div>
                    )}

                    {challenge.firstSolver && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 bg-green-500/10 border border-green-400/50 rounded-lg"
                      >
                        <p className="text-green-400 font-bold text-sm font-mono">
                          First Blood : {challenge.firstSolver.username}
                        </p>
                      </motion.div>
                    )}

                    {/* Hints Section */}
                    {challenge.hints && challenge.hints.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-400/40 rounded-lg backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-400 font-bold text-sm font-mono tracking-wider">HINTS</span>
                        </div>
                        <div className="space-y-2">
                          {challenge.hints.map((hint) => (
                            <div key={hint.hintNumber} className="flex items-center gap-2">
                              {hint.isViewed ? (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="flex-1 p-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/10 border border-cyan-400/30 rounded text-cyan-300 font-mono text-xs"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <Eye className="w-3 h-3 text-cyan-400" />
                                    <span className="font-bold text-cyan-400">Hint {hint.hintNumber}</span>
                                  </div>
                                  <p className="text-cyan-200/90">{hint.text}</p>
                                </motion.div>
                              ) : (
                                <div className="flex-1 flex items-center gap-2">
                                  <div className="flex-1 p-2 bg-slate-800/60 border border-slate-600/40 rounded text-slate-500 font-mono text-xs flex items-center gap-2">
                                    <Lock className="w-3 h-3" />
                                    <span className="blur-sm select-none">This hint is locked. Click to reveal.</span>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => openHintConfirmation(challenge.id, hint.hintNumber, hint.cost)}
                                    disabled={!!challenge.teamSolved || teamPoints < hint.cost}
                                    className={`px-3 py-2 text-xs font-mono font-bold rounded border transition-all duration-200 ${
                                      challenge.teamSolved || teamPoints < hint.cost
                                        ? 'bg-slate-700/30 text-slate-500 border-slate-600/50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/50 hover:from-cyan-500/30 hover:to-teal-500/30 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] cursor-pointer'
                                    }`}
                                  >
                                    {teamPoints < hint.cost ? `Need ${hint.cost}pts` : `View (-${hint.cost}pts)`}
                                  </motion.button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Hint Confirmation Dialog */}
      <Dialog open={!!hintConfirmation} onOpenChange={() => setHintConfirmation(null)}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
          <DialogHeader>
            <DialogTitle className="text-cyan-400 font-mono flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              View Hint?
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-mono">
              Are you sure you want to view this hint? This will deduct{' '}
              <span className="text-orange-400 font-bold">{hintConfirmation?.cost} point{hintConfirmation?.cost !== 1 ? 's' : ''}</span>{' '}
              from your team's total score.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setHintConfirmation(null)}
              className="bg-slate-800/80 border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white font-mono transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleViewHint}
              disabled={hintLoading}
              className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border-2 border-cyan-500/50 hover:from-cyan-500/30 hover:to-teal-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono transition-all"
            >
              {hintLoading ? 'Revealing...' : 'Yes, View Hint'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <Outlet /> */}
    </>
  );
};
