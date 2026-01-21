import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Terminal, Lock, Bug, Smartphone, Key, Zap, Database, ArrowLeft, UploadCloud, FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { toast } from "sonner";
import apiFetch from "../../../Hook/api/fetchApi";

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

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const SubmitChallengeDialog = ({ challengeId, challengeTitle }: { challengeId: string; challengeTitle: string }) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const totalSize = useMemo(() => files.reduce((sum, f) => sum + (f?.size || 0), 0), [files]);

  const onPickFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    setFiles(picked);
  };

  const upload = async () => {
    if (!files.length) {
      toast.error("Please choose at least one file");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setUploading(true);
      await apiFetch(`/api/challenges/${encodeURIComponent(challengeId)}/submissions`, {
        method: "POST",
        body: formData,
      });
      toast.success("Submission uploaded successfully");
      setFiles([]);
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          className="px-6 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded font-mono text-sm hover:bg-green-500/30 transition-colors"
        >
          SUBMIT
        </motion.button>
      </DialogTrigger>

      <DialogContent className="border-green-500/30 bg-black/90 text-green-100 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-green-400">Submit: {challengeTitle}</DialogTitle>
          <DialogDescription className="font-mono text-green-300/70">
            Upload PDFs, images, or any allowed file type. Maximum size is 500MB per file. One submission per challenge.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-md border border-green-500/30 bg-green-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <UploadCloud className="w-4 h-4 text-green-400" />
              <p className="font-mono text-sm text-green-300">Choose files to upload</p>
            </div>
            <Input
              type="file"
              multiple
              onChange={onPickFiles}
              className="border-green-500/30 text-green-200 file:text-green-300"
            />
            <p className="mt-2 font-mono text-xs text-green-300/70">
              Tip: You can select multiple files (PDF, images, documents). Allowed types are configurable by admin.
            </p>
          </div>

          {files.length > 0 && (
            <div className="rounded-md border border-green-500/30 bg-black/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-sm text-green-300">Selected files</p>
                <p className="font-mono text-xs text-green-300/70">Total: {formatBytes(totalSize)}</p>
              </div>
              <div className="max-h-40 overflow-auto space-y-2 pr-1">
                {files.map((f) => (
                  <div key={`${f.name}-${f.size}-${f.lastModified}`} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="font-mono text-xs text-green-200 truncate">{f.name}</span>
                    </div>
                    <span className="font-mono text-xs text-green-300/70 shrink-0">{formatBytes(f.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-green-500/30 bg-transparent text-green-300 hover:bg-green-500/10"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={upload}
            className="bg-green-500/20 border border-green-400 text-green-400 hover:bg-green-500/30"
            disabled={uploading}
          >
            {uploading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </span>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
            className="text-green-300/70 font-mono text-2xl tracking-wider"
          >
             SELECT YOUR MISSION
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-green-400/70 font-mono text-xl font-bold"
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
                    {/* <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                    </motion.div> */}
                      <challenge.icon className="w-8 h-8 text-green-400" />
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-green-400" />
                      {/* <span className="text-green-400 font-mono font-bold text-lg">{challenge.points}</span> */}
                      <span className="text-gray-500 text-sm">pts</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-green-400 font-mono group-hover:text-green-300 transition-colors">
                    {challenge.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono text-xs">
                     MISSION_ID: {String(challenge.id).padStart(3, '0')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="flex items-start gap-2 mb-4">
                    <Terminal className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                    <p className="text-[16px] text-gray-300 leading-relaxed">{challenge.description}</p>
                  </div>
                  <div className="flex items-center justify-center pt-4 border-t border-green-500/20">
                    <SubmitChallengeDialog
                      challengeId={String(challenge.id)}
                      challengeTitle={challenge.title}
                    />
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
