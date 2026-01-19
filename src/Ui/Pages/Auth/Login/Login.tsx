import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";

// Typed motion targets to satisfy TypeScript
const loginCardInitial: TargetAndTransition = { opacity: 0, y: 50 };
const loginCardAnimate: TargetAndTransition = { opacity: 1, y: 0 };
const formFieldInitial: TargetAndTransition = { x: -20, opacity: 0 };
const formFieldAnimate: TargetAndTransition = { x: 0, opacity: 1 };
const errorInitial: TargetAndTransition = { opacity: 0 };
const errorAnimate: TargetAndTransition = { opacity: 1 };

// Hooks to handle user authentication
import { useUser, useLogin } from "../../../../Hook/Auth/useAuth";
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
import { Eye, EyeOff } from "lucide-react";
// Login Component
export const Login = () => {
  // State variables
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();
  // Hooks for user data and login mutation
  const { refetch: fetchUser } = useUser();
  const loginMutation = useLogin();
  //  Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update form data state based on input changes
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    try {
      // Call login mutation
      const res = await loginMutation.mutateAsync(formData);
      // On success, show success message and fetch user data
      toast.success(res.message || "Login successful");
      // Fetch user data and navigate to dashboard
      fetchUser();
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

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
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-green-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={loginCardInitial}
        animate={loginCardAnimate}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl bg-slate-900/90 backdrop-blur-xl border-2 border-green-500/30 relative z-10 overflow-hidden">
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
            <CardTitle className="text-3xl font-bold text-green-400 font-mono glow-text">
              [ ACCESS LOGIN ]
            </CardTitle>
            <CardDescription className="text-sm text-green-300/70 font-mono">
              &gt; Enter credentials to proceed_
            </CardDescription>
          </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 relative z-10">
            {/* Email */}
            <motion.div 
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-green-400 font-mono text-sm">&gt; Email address</Label>
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
                  initial={errorInitial}
                  animate={errorAnimate}
                  className="text-xs text-red-400 font-mono"
                >
                  ! {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div 
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-green-400 font-mono text-sm">&gt; Password</Label>
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
                  initial={errorInitial}
                  animate={errorAnimate}
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
                disabled={loginMutation.isPending}
                className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 cursor-pointer font-mono font-bold transition-all"
              >
                {loginMutation.isPending ? "[ AUTHENTICATING... ]" : "[ INITIATE LOGIN ]"}
              </Button>
            </motion.div>

            <Separator className="bg-green-500/20" />

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-400 font-mono">
                &gt; New user?
                <NavLink
                  to="/register"
                  className="ml-2 text-green-400 hover:text-green-300 hover:underline transition-colors"
                >
                  [Register]
                </NavLink>
              </p>

              <NavLink
                to="/forget-password"
                className="text-sm text-green-400/70 hover:text-green-400 hover:underline transition-colors font-mono block"
              >
                &gt; Forgot credentials?
              </NavLink>
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
    </div>
  );
};