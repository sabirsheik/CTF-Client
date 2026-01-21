import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Users, Flag, Trophy } from "lucide-react";

export const Teams = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-900/90 backdrop-blur-xl p-10 rounded-2xl border-2 border-green-500/30 w-full max-w-lg text-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-20 h-20 border-2 border-green-400 rounded-full flex items-center justify-center mb-6"
          >
            <Users className="w-10 h-10 text-green-400" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl lg:text-4xl font-bold mb-6 text-green-400 font-mono glow-text"
          >
            TEAMS PANEL 
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-green-300/70 font-mono text-sm mb-8"
          >
             Select your mission path
          </motion.p>
          
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => navigate("/ctf/teams")}
                className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 cursor-pointer font-mono font-bold text-[14px] lg:text-lg py-6 transition-all flex items-center justify-center gap-3"
              >
                <Flag className="w-5 h-5" />
                CTF Teams
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={() => navigate("/dashboard/auth/user/challenge")}
                className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 border-2 border-green-500/30 hover:border-green-400 cursor-pointer font-mono font-bold text-[13px] lg:text-lg py-6 transition-all flex items-center justify-center gap-3"
              >
                <Trophy className="w-5 h-5" />
                CHALLENGES
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};