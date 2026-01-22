import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useSignup, useVerifyOtp } from "../../../../Hook/Auth/useAuth";
import { toast } from "sonner";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Clock } from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();

  //  ADDED fields ONLY
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    universityName: "",
    phoneNumber: "",
    password: "",
  });

  const [showNew, setShowNew] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min timer
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    universityName?: string;
    phoneNumber?: string;
    password?: string;
    otp?: string;
  }>({});

  const signupMutation = useSignup();
  const verifyOtpMutation = useVerifyOtp();

  // Timer for OTP modal
  useEffect(() => {
    if (!showOtpModal) return;

    if (timeLeft <= 0) {
      toast.error("OTP expired");
      setShowOtpModal(false);
      navigate("/register");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showOtpModal, navigate]);

  // Reset timer when modal opens
  useEffect(() => {
    if (showOtpModal) {
      setTimeLeft(600);
    }
  }, [showOtpModal]);

  // ✅ SAME handler, just extended professionally
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "otp") {
      setOtp(value);
      return;
    }

    let updatedValue = value;

    if (name === "username") {
      updatedValue = value.toLowerCase().trim();
    }
    

    if (name === "phoneNumber") {
      updatedValue = value.trim();
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // EXISTING validation UNCHANGED
  const validateSignupForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must include letters, numbers & special characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateSignupForm()) return;

    try {
      const res = await signupMutation.mutateAsync(formData);
      toast.success(res.message || "OTP sent to your email");
      setShowOtpModal(true);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    }
  };

  const handleVerifyOtp = async () => {
    setErrors({});

    try {
      await verifyOtpMutation.mutateAsync({
        email: formData.email,
        otp,
      });
      toast.success("Account verified successfully");
      navigate("/login");
    } catch (err: any) {
      setErrors({ otp: err.message || "Invalid OTP" });
      toast.error(err.message || "OTP verification failed");
    }
  };

  // Calculate minutes and seconds for timer display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-green-500/30 to-blue-500/30 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-br from-blue-500/30 to-green-500/30 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-green-500/30 bg-slate-900/90 backdrop-blur-xl relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent" />
            <CardHeader className="space-y-3 text-center relative z-10">
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
              <CardTitle className="text-xl font-bold text-green-400 font-mono glow-text">
                Register for Cyber CTF And Challenges 
              </CardTitle>
              <CardDescription className="text-sm text-green-300/70 font-mono">
                Register new user credentials_
              </CardDescription>
            </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4 relative z-10">
              {/* Username */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="username" className="text-green-400 font-mono text-sm"> Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="username_"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono"
                />
              </motion.div>

              {/* University Name */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
              >
                <Label htmlFor="universityName" className="text-green-400 font-mono text-sm"> University</Label>
                <Input
                  id="universityName"
                  name="universityName"
                  placeholder="institution_name"
                  value={formData.universityName}
                  onChange={handleInputChange}
                  className="bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono"
                />
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="phoneNumber" className="text-green-400 font-mono text-sm"> Phone</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="03XXXXXXXXX"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono"
                />
              </motion.div>

              {/* Email */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-green-400 font-mono text-sm">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@system.ctf"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono"
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-400 font-mono"
                  >
                    ! {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-green-400 font-mono text-sm"> Password</Label>
               <div className="relative">
                 <Input
                  id="password"
                  name="password"
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono pr-12"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 cursor-pointer"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
               </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-400 font-mono"
                  >
                    ! {errors.password}
                  </motion.p>
                )}
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col gap-5 mt-4 relative z-10">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  type="submit"
                  className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 cursor-pointer font-mono font-bold transition-all"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending
                    ? " PROCESSING... "
                    : " CREATE ACCOUNT "}
                </Button>
              </motion.div>

              <Separator className="bg-green-500/20" />

              <p className="text-sm text-gray-400 font-mono">
               Existing user?
                <NavLink
                  to="/login"
                  className="ml-2 text-green-400 hover:text-green-300 hover:underline transition-colors"
                >
                  Login
                </NavLink>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
      </div>
      <Dialog open={showOtpModal} onOpenChange={(open) => !open ? null : setShowOtpModal(open)}>
        <DialogContent className="sm:max-w-sm bg-slate-900/95 backdrop-blur-xl shadow-2xl border-2 border-green-500/30 overflow-hidden" onInteractOutside={(e) => e.preventDefault()}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-green-400 text-center font-mono text-2xl glow-text">
               VERIFY OTP 
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400 font-mono text-sm">
              Enter 6-digit verification code_
            </DialogDescription>
          </DialogHeader>

          {/* Timer */}
          <motion.div 
            className="text-center text-sm font-medium text-gray-400 mt-3 font-mono flex items-center justify-center gap-2 relative z-10"
            animate={timeLeft <= 60 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: timeLeft <= 60 ? Infinity : 0 }}
          >
            <Clock className="w-4 h-4" />
            <span className={timeLeft <= 60 ? "text-red-400" : "text-green-400"}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </motion.div>

          <Separator className="bg-green-500/20" />

          <div className="space-y-5 mt-4 relative z-10">
            <Input
              name="otp"
              maxLength={6}
              value={otp}
              onChange={handleInputChange}
              className="text-center tracking-widest text-xl bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono"
              placeholder="••••••"
            />

            {errors.otp && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-400 text-center font-mono"
              >
                ! {errors.otp}
              </motion.p>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleVerifyOtp}
                disabled={verifyOtpMutation.isPending}
                className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 font-mono font-bold transition-all"
              >
                {verifyOtpMutation.isPending
                  ? " VERIFYING... "
                  : " VERIFY OTP "}
              </Button>
            </motion.div>
          </div>

          <Separator className="bg-green-500/20" />

          {/* Footer Actions */}
          <div className="text-center text-sm mt-3 relative z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="block mx-auto text-gray-400 hover:text-green-400 font-mono transition-colors"
            >
              &gt; Cancel
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};