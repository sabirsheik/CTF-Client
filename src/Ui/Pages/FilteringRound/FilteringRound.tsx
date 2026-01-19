import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../../Hook/api/fetchApi";
import { motion, type TargetAndTransition } from "framer-motion";
import { Shield, Lock, ExternalLink, Flag, CheckCircle2, XCircle } from "lucide-react";

const FilteringRound = () => {
  const [link, setLink] = useState<string>("");
  const [flag, setFlag] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await apiFetch("/api/auth/get-challenge");
        setLink(data.link);
      } catch (error) {
        setMessage("Failed to load challenge");
        setIsSuccess(false);
      }
    };
    fetchChallenge();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);
    try {
      const data = await apiFetch("/api/auth/verify-flag", {
        method: "POST",
        body: { flag },
      });
      if (data.success) {
        setMessage(data.message);
        setIsSuccess(true);
        // Redirect to teams page
        setTimeout(() => navigate("/dashboard/auth/user/teams"), 2000);
      } else {
        setMessage(data.message);
        setIsSuccess(false);
      }
    } catch (error: any) {
      setMessage(error.message || "Verification failed");
      setIsSuccess(false);
    }
    setLoading(false);
  };

  const containerHidden: TargetAndTransition = { opacity: 0, scale: 0.9 };
  const containerVisible: TargetAndTransition = { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      type: "spring",
      stiffness: 100
    }
  };

  const formHidden: TargetAndTransition = { opacity: 0, y: 20 };
  const formVisible: TargetAndTransition = { 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: 0.2,
      duration: 0.4
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={containerHidden}
        animate={containerVisible}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header Card */}
        <motion.div
          className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-green-500/30 mb-6"
          whileHover={{ boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)" }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-16 h-16 text-green-400" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-3 text-transparent bg-clip-text bg-linear-to-r from-green-400 via-emerald-400 to-cyan-400 glow-text">
            Filtering Round
          </h1>
          <p className="text-center text-green-100/80 text-lg flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" />
            Complete this challenge to be eligible for the CTF
          </p>
        </motion.div>

        {/* Main Challenge Card */}
        <motion.div
          initial={formHidden}
          animate={formVisible}
          className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-green-500/30"
        >
          {link && (
            <motion.div
              className="mb-6 p-5 bg-slate-800/60 rounded-xl border border-green-500/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold mb-3 text-green-400 items-center gap-2">
                <Flag className="w-4 h-4" />
                Challenge Link:
              </label>
              <motion.a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm break-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ExternalLink className="w-4 h-4 shrink-0 group-hover:rotate-12 transition-transform" />
                {link}
              </motion.a>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label 
                htmlFor="flag" 
                className="text-sm font-semibold mb-3 text-green-400 flex items-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Enter Flag:
              </label>
              <input
                type="text"
                id="flag"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="flag{...}"
                className="w-full px-4 py-3 bg-slate-800/60 border border-green-500/30 rounded-lg 
                         text-green-100 placeholder-green-900/50 font-mono
                         focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                         transition-all duration-300"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-3 px-6 
                       rounded-lg font-semibold shadow-lg hover:shadow-green-500/50
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: "0 0 30px rgba(34, 197, 94, 0.5)" }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Submit Flag
                </>
              )}
            </motion.button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-6 p-4 rounded-lg border flex items-center gap-3 ${
                isSuccess
                  ? "bg-green-500/10 border-green-500/30 text-green-300"
                  : "bg-red-500/10 border-red-500/30 text-red-300"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 shrink-0" />
              )}
              <p className="text-sm font-medium">{message}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-green-300/60 text-sm"
        >
          <p className="font-mono">// Analyze. Exploit. Capture the Flag.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FilteringRound;