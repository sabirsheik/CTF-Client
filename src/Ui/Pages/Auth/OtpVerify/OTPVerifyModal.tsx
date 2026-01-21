import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// Hook to verify OTP
import { useVerifyOtp } from "../../../../Hook/Auth/useAuth";

// Props interface
interface Props {
  email: string;
  onClose: () => void;
}

export const OTPVerifyModal = ({ email, onClose }: Props) => {
  // State variables
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 min timer
  const navigate = useNavigate();
  // Hook for OTP verification mutation
  const verifyOtpMutation = useVerifyOtp();

  /* ================= TIMER ================= */
  useEffect(() => {
    // If time is up, show error and close modal
    if (timeLeft <= 0) {
      toast.error("OTP expired");
      onClose(); // modal hide
      navigate("/login"); // redirect to login
      return;
    }
    // Set interval to decrease time left every second
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    // Cleanup interval on unmount or timeLeft change
    return () => clearInterval(timer);
  }, [timeLeft, onClose, navigate]);

  /* ================= VERIFY ================= */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    // === VALIDATION === //
    if (!otp) {
      toast.warning("Enter OTP");
      return;
    }
    //  === API CALL === //
    verifyOtpMutation.mutate(
      { email, otp },
      {
        // Callbacks for mutation result
        onSuccess: () => {
          // On success, show success message
          toast.success("OTP verified");

          // Navigate to ResetPassword route with email state
          navigate("/reset-password", { state: { email } });
        },
        // On error, show error message
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Invalid OTP");
        },
      }
    );
  };
  //  Calculate minutes and seconds for timer display
  const minutes = Math.floor(timeLeft / 60);
  // Calculate remaining seconds
  const seconds = timeLeft % 60;

  return (
    // OTP Verification Dialog
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-slate-900/95 backdrop-blur-xl shadow-2xl border-2 border-green-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
        <DialogHeader className="text-center space-y-3 relative z-10">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-16 h-16 border-2 border-green-400 rounded-full flex items-center justify-center mb-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 bg-green-400/20 rounded-full"
            />
          </motion.div>
          <DialogTitle className="text-2xl font-bold text-green-400 font-mono glow-text">
            [ VERIFY OTP ]
          </DialogTitle>
          <DialogDescription className="text-sm text-green-300/70 font-mono">
            &gt; Enter 6-digit verification code_
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-green-500/20" />

        {/* Timer */}
        <motion.div 
          className="text-center text-sm font-medium text-gray-400 mt-3 font-mono flex items-center justify-center gap-2 relative z-10"
          animate={timeLeft <= 10 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
        >
          <Clock className="w-4 h-4" />
          <span className={timeLeft <= 10 ? "text-red-400" : "text-green-400"}>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </motion.div>

        {/* OTP FORM */}
        <form onSubmit={handleVerify} className="space-y-5 mt-4 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              type="text"
              placeholder="••••••"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center tracking-[0.35em] text-xl font-bold bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              disabled={verifyOtpMutation.isPending}
              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 cursor-pointer font-mono font-bold transition-all"
            >
              {verifyOtpMutation.isPending ? "[ VERIFYING... ]" : "[ VERIFY OTP ]"}
            </Button>
          </motion.div>
        </form>
        <Separator className="bg-green-500/20" />
        {/* Footer Actions */}
        <div className="text-center text-sm mt-3 relative z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClose}
            className="block mx-auto text-gray-400 hover:text-green-400 font-mono transition-colors"
          >
            &gt; Cancel
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
};