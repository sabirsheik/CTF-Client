import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import apiFetch from "../../../Hook/api/fetchApi";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Terminal, Zap, CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface Challenge {
  id: string;
  name: string;
  description: string;
  link: string;
  solver: {
    username: string;
    solvedAt: Date;
  } | null;
}

export const CTF = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [flags, setFlags] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const data = await apiFetch("/api/challenges");
      setChallenges(data.challenges);
    } catch (error: any) {
      console.error("Failed to load challenges:", error.message);
    }
  };

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
      toast.success(data.message || "Flag submitted successfully");
      // Refresh challenges to show updated solver info
      setTimeout(() => {
        fetchChallenges();
        setFlags({ ...flags, [machineId]: "" });
      }, 1500);
    } catch (error: any) {
      setMessage({ ...message, [machineId]: error.message || "Submission failed" });
      toast.error(error.message || "Submission failed");
    }
    setLoading({ ...loading, [machineId]: false });
  };

  return (
    <div className="min-h-screen p-8 relative z-10">
      <div className="max-w-7xl mx-auto">
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
                "0 0 10px rgba(0, 255, 65, 0.8)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            [ CTF MACHINES ]
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-green-300/70 font-mono text-sm"
          >
            &gt; CAPTURE THE FLAG //
          </motion.p>
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
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Terminal className="w-6 h-6 text-green-400" />
                    </motion.div>
                    {challenge.solver && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </motion.div>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-green-400 mb-3 font-mono">{challenge.name}</h2>
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed font-mono">{challenge.description}</p>
                  <motion.a
                    href={challenge.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="text-green-400 hover:text-green-300 underline text-sm mb-4 block font-mono transition-colors"
                  >
                    &gt; {challenge.link}
                  </motion.a>
                  
                  {challenge.solver ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-green-500/20 border-2 border-green-400 rounded-lg"
                    >
                      <p className="text-green-400 font-bold text-sm font-mono flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        SOLVED BY: {challenge.solver.username}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Enter flag..."
                        value={flags[challenge.id] || ""}
                        onChange={(e) => handleFlagChange(challenge.id, e.target.value)}
                        className="bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono"
                      />
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => handleSubmit(challenge.id)}
                          disabled={loading[challenge.id] || !flags[challenge.id]}
                          className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 cursor-pointer font-mono font-bold transition-all flex items-center justify-center gap-2"
                        >
                          {loading[challenge.id] ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
                      {message[challenge.id] && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-sm font-mono font-bold ${
                            message[challenge.id].includes("Congratulations") ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {message[challenge.id].includes("Congratulations") ? "✓ " : "✗ "}
                          {message[challenge.id]}
                        </motion.p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};