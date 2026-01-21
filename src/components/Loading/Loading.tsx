import { motion } from "framer-motion";

export const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-green-500/30 to-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-br from-blue-500/30 to-green-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated logo/spinner */}
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-green-500/30 border-t-green-400 rounded-full"
          />

          {/* Inner pulsing circle */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 m-auto w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-8 bg-green-400/40 rounded-full"
            />
          </motion.div>

          {/* Corner accents */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -left-2 w-6 h-6 border-2 border-blue-400 border-b-transparent border-r-transparent rounded-tl-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-2 -right-2 w-6 h-6 border-2 border-blue-400 border-t-transparent border-l-transparent rounded-br-full"
          />
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <motion.h2
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl font-bold text-green-400 font-mono tracking-wider"
          >
            LOADING
          </motion.h2>

          {/* Animated dots */}
          <div className="flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
            ))}
          </div>

          <motion.p
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-sm text-green-300/60 font-mono"
          >
            Initializing secure connection...
          </motion.p>
        </div>

        {/* Progress bar effect */}
        <div className="w-64 h-1 bg-slate-800/50 rounded-full overflow-hidden">
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-1/3 bg-linear-to-r from-transparent via-green-400 to-transparent"
          />
        </div>

        {/* Glitch effect text */}
        <div className="relative">
          <motion.div
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="absolute inset-0 text-blue-400 font-mono text-xs blur-sm"
          >
            [SECURE_MODE_ACTIVE]
          </motion.div>
          <p className="text-green-400/40 font-mono text-xs">
            [SECURE_MODE_ACTIVE]
          </p>
        </div>
      </div>

      {/* Scanning lines effect */}
      <motion.div
        animate={{
          y: ["0%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(transparent 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)",
          height: "100px",
        }}
      />
    </div>
  );
};
