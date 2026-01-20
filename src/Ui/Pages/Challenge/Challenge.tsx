
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Terminal, Lock, Bug, Smartphone, Key, Zap, Code, Database, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Malware dev",
    description: "Bind a payload to a pdf, so that it looks legitimate to the user (emphasis on social engineering element)",
    points: 100,
    icon: Bug,
     gradient: "from-black-500/20 to-teal-500/20"
  },
  {
    id: 2,
    title: "App Hijacking",
    description: "Write a script to access any web browsers camera/ mic without user permissions or interactions",
    points: 200,
    icon: Zap,
     gradient: "from-blue-500/20 to-teal-500/20"
  },
  {
    id: 3,
    title: "Malware dev",
    description: "Develop a ransomware to delete or encrypt all files on a host pc, make sure it bypasses windows AV",
    points: 300,
    icon: Lock,
     gradient: "from-black-500/20 to-teal-500/20"
  },
  {
    id: 4,
    title: "Malware dev",
    description: "Develop a keylogger to steal user credentials, make sure it bypasses windows AV. Only activates when user types in username, passwords or website URL",
    points: 250,
    icon: Key,
     gradient: "from-blue-500/20 to-teal-500/20"
  },
  {
    id: 5,
    title: "Android",
    description: "Develop a malware that infiltrates user data such as :  call logs, gps or at least an IP location, contact list, camera / mic, messages, whatsapp DB, saved passwords",
    points: 150,
    icon: Smartphone,
    gradient: "from-black-500/20 to-teal-500/20"
  }
];

export const Challenge = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative z-10">
      <div className="container mx-auto">
        {/* Back Button */}
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

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4 text-green-400 glow-text font-mono"
            animate={{ 
              textShadow: [
                "0 0 10px rgba(0, 255, 65, 0.8)",
                "0 0 20px rgba(0, 255, 65, 0.8)",
                "0 0 10px rgba(0, 255, 65, 0.8)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
             CTF CHALLENGES 
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-green-300/70 font-mono text-sm tracking-wider"
          >
             SELECT YOUR MISSION
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-green-300/70 font-mono text-[16px] font-bold"
          >
            This is an open challenge, and everyone is welcome to participate The challenge will take place on 27th January.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`relative border-2 border-green-500/30 bg-gradient-to-br ${challenge.gradient} backdrop-blur-xl overflow-hidden group cursor-pointer`}>
                <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-green-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <challenge.icon className="w-8 h-8 text-green-400" />
                    </motion.div>
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-green-400" />
                      {/* <span className="text-green-400 font-mono font-bold text-lg">{challenge.points}</span> */}
                      <span className="text-gray-500 text-sm">pts</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-green-400 font-mono group-hover:text-green-300 transition-colors">
                    {challenge.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono text-xs">
                    &gt; MISSION_ID: {String(challenge.id).padStart(3, '0')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="flex items-start gap-2 mb-4">
                    <Terminal className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                    <p className="text-sm text-gray-300 leading-relaxed">{challenge.description}</p>
                  </div>
                  <div className="flex items-center justify-center pt-4 border-t border-green-500/20">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="px-6 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded font-mono text-sm hover:bg-green-500/30 transition-colors"
                    >
                      READY TO HACK
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
