import { useState } from "react";
import { motion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
// Hook to handle forget password
import { useForgetPassword } from "../../../../Hook/Auth/useAuth";
import { toast } from "sonner";
import { NavLink } from "react-router-dom";

// Typed motion targets
const modalInitial: TargetAndTransition = { opacity: 0, scale: 0.9 };
const modalAnimate: TargetAndTransition = { opacity: 1, scale: 1 };
const formFieldInitial: TargetAndTransition = { x: -20, opacity: 0 };
const formFieldAnimate: TargetAndTransition = { x: 0, opacity: 1 };
// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
// OTP Verification Modal
import { OTPVerifyModal } from "../OtpVerify/OTPVerifyModal";

export const ForgetPasswordModal = () => {
  // State variables
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"forget" | "otp">("forget");
  //  Hook for forget password mutation
  const forgetPasswordMutation = useForgetPassword();
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // === VALIDATION === //
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    // === API CALL === //
    try {
      // Call forget password mutation
      const res = await forgetPasswordMutation.mutateAsync({ email });
      // On success, show success message and move to OTP step
      toast.success(res.message || "OTP sent");
      setStep("otp");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send OTP";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  /* ================= OTP STEP ================= */
  // Render OTP verification modal if in OTP step
  if (step === "otp") {
    return <OTPVerifyModal email={email} onClose={() => setStep("forget")} />;
  }

  /* ================= FORGET PASSWORD UI ================= */
  return (
    // Modal
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-md px-4">
      <motion.div
        initial={modalInitial}
        animate={modalAnimate}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-900/90 backdrop-blur-xl shadow-2xl border-2 border-green-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
          {/* Close Button */}
          <NavLink
            to="/login"
            className="absolute right-4 top-3 text-2xl font-semibold text-green-400 hover:text-green-300 z-20"
          >
            ×
          </NavLink>

          <CardHeader className="text-center space-y-3 relative z-10">
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
            <CardTitle className="text-2xl font-bold text-green-400 font-mono glow-text">
              [ FORGOT PASSWORD ]
            </CardTitle>
            <CardDescription className="text-sm text-green-300/70 font-mono">
              &gt; Enter email to receive OTP_
            </CardDescription>
          </CardHeader>

          <Separator className="bg-green-500/20" />

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 relative z-10">
            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-green-400 font-mono text-sm">&gt; Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@system.ctf"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono"
              />
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-400 font-mono"
                >
                  ! {error}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-2 text-sm"
            >
              <Checkbox id="confirm" required className="border-green-500/50" />
              <Label
                htmlFor="confirm"
                className="text-gray-400 leading-snug font-mono text-xs"
              >
                &gt; I confirm this email belongs to my account
              </Label>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col gap-5 mt-4 relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                disabled={forgetPasswordMutation.isPending}
                className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 cursor-pointer font-mono font-bold transition-all"
              >
                {forgetPasswordMutation.isPending ? "[ SENDING... ]" : "[ SEND OTP ]"}
              </Button>
            </motion.div>

            <p className="text-sm text-gray-400 text-center font-mono">
              &gt; Remember password?
              <NavLink
                to="/login"
                className="ml-2 text-green-400 hover:text-green-300 hover:underline transition-colors"
              >
                [Login]
              </NavLink>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
    </div>
  );
};