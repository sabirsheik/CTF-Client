import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
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
import { Eye, EyeOff } from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();

  // ✅ ADDED fields ONLY
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

  // ❌ EXISTING validation UNCHANGED
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

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white px-4">
        <Card className="w-full max-w-md shadow-xl border border-muted/40">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold text-baseColor">
              Create your account
            </CardTitle>
            <CardDescription className="text-sm">
              Secure signup with email verification
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="yourusername"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              {/* University Name */}
              <div className="space-y-1.5">
                <Label htmlFor="universityName">University Name</Label>
                <Input
                  id="universityName"
                  name="universityName"
                  placeholder="Your university"
                  value={formData.universityName}
                  onChange={handleInputChange}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="03XXXXXXXXX"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
               <div className="relative">
                 <Input
                  id="password"
                  name="password"
                  type={showNew ? "text" : "password"}
                  placeholder="Strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
               </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 mt-4">
              <Button
                type="submit"
                className="w-full bg-baseColor hover:bg-hoverColor cursor-pointer"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending
                  ? "Creating account..."
                  : "Sign Up"}
              </Button>

              <Separator />

              <p className="text-sm text-muted-foreground">
                Already have an account?
                <NavLink
                  to="/login"
                  className="ml-1 text-baseColor hover:underline"
                >
                  Login
                </NavLink>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-baseColor text-center">
              Verify OTP
            </DialogTitle>
            <DialogDescription className="text-center">
              Enter the 6-digit code sent to your email
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              name="otp"
              maxLength={6}
              value={otp}
              onChange={handleInputChange}
              className="text-center tracking-widest text-lg"
              placeholder="••••••"
            />

            {errors.otp && (
              <p className="text-sm text-red-600 text-center">
                {errors.otp}
              </p>
            )}

            <Button
              onClick={handleVerifyOtp}
              disabled={verifyOtpMutation.isPending}
              className="w-full bg-baseColor hover:bg-hoverColor"
            >
              {verifyOtpMutation.isPending
                ? "Verifying..."
                : "Verify OTP"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};