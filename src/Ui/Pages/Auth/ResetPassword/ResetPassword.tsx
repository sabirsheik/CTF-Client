import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import { useResetPassword } from "../../../../Hook/Auth/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";

// Typed motion targets
const cardInitial: TargetAndTransition = { opacity: 0, y: 50 };
const cardAnimate: TargetAndTransition = { opacity: 1, y: 0 };
const formFieldInitial: TargetAndTransition = { x: -20, opacity: 0 };
const formFieldAnimate: TargetAndTransition = { x: 0, opacity: 1 };
const errorInitial: TargetAndTransition = { opacity: 0 };
const errorAnimate: TargetAndTransition = { opacity: 1 };

export const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const resetPasswordMutation = useResetPassword();

  const email = location.state?.email;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    } else if (
      !/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
        formData.newPassword
      )
    ) {
      newErrors.newPassword =
        "Password must contain at least one letter, one number, and one special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    } 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      await resetPasswordMutation.mutateAsync({
        email,
        newPassword: formData.newPassword,
      });

      toast.success("Password reset successful");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Reset failed");
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  if (!email) {
    return null; // render nothing while redirecting
  }


  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
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
        initial={cardInitial}
        animate={cardAnimate}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-10 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl relative z-10 border-2 border-green-500/30 overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent" />
        <div className="relative z-10">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-16 h-16 border-2 border-green-400 rounded-full flex items-center justify-center mb-4"
          >
            <Lock className="w-8 h-8 text-green-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-center text-green-400 mb-2 font-mono glow-text">
            [ RESET PASSWORD ]
          </h2>
          <p className="text-center text-sm text-green-300/70 mb-8 font-mono">
            &gt; Create new secure password_
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="newPassword" className="text-green-400 font-mono text-sm">&gt; New Password</Label>
              <div className="relative mt-2">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.newPassword}
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
              {errors.newPassword && (
                <motion.p
                  initial={errorInitial}
                  animate={errorAnimate}
                  className="text-xs text-red-400 mt-1 font-mono"
                >
                  ! {errors.newPassword}
                </motion.p>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="confirmPassword" className="text-green-400 font-mono text-sm">&gt; Confirm Password</Label>
              <div className="relative mt-2">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono pr-12"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={errorInitial}
                  animate={errorAnimate}
                  className="text-xs text-red-400 mt-1 font-mono"
                >
                  ! {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6"
            >
              <Button
                disabled={resetPasswordMutation.isPending}
                className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 cursor-pointer font-mono font-bold transition-all py-3"
              >
                {resetPasswordMutation.isPending
                  ? "[ RESETTING... ]"
                  : "[ RESET PASSWORD ]"}
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};