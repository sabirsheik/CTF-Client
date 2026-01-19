
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Terminal, Lock } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "SQL Injection Basics",
    description: "Learn the fundamentals of SQL injection attacks by exploiting a vulnerable login form.",
    points: 100,
    difficulty: 'Easy'
  },
  {
    id: 2,
    title: "Cross-Site Scripting (XSS)",
    description: "Find and exploit XSS vulnerabilities in a web application to steal user cookies.",
    points: 200,
    difficulty: 'Medium'
  },
  {
    id: 3,
    title: "Buffer Overflow Exploit",
    description: "Exploit a buffer overflow vulnerability to gain shell access on a remote server.",
    points: 300,
    difficulty: 'Hard'
  },
  {
    id: 4,
    title: "Cryptography Challenge",
    description: "Decrypt a message encrypted with AES and find the hidden flag.",
    points: 250,
    difficulty: 'Medium'
  },
  {
    id: 5,
    title: "Web Exploitation",
    description: "Bypass authentication and access the admin panel through various web vulnerabilities.",
    points: 150,
    difficulty: 'Easy'
  },
  {
    id: 6,
    title: "Reverse Engineering",
    description: "Analyze a binary file and find the correct password to unlock the next level.",
    points: 350,
    difficulty: 'Hard'
  }
];

export const Challenge = () => {
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
            [ CTF CHALLENGES ]
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-green-300/70 font-mono text-sm tracking-wider"
          >
            &gt; SELECT YOUR MISSION //
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
              <Card className="relative border-2 border-green-500/30 bg-slate-900/90 backdrop-blur-xl overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-green-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Shield className="w-6 h-6 text-green-400" />
                    </motion.div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono border ${
                      challenge.difficulty === 'Easy' ? 'bg-green-500/20 border-green-400 text-green-400' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400' :
                      'bg-red-500/20 border-red-400 text-red-400'
                    }`}>
                      {challenge.difficulty.toUpperCase()}
                    </span>
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
                  <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-mono font-bold text-lg">{challenge.points}</span>
                      <span className="text-gray-500 text-sm">pts</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded font-mono text-xs hover:bg-green-500/30 transition-colors"
                    >
                      START &gt;
                    </motion.button>
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
