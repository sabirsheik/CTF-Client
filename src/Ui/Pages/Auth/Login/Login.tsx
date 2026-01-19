import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white px-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-purple-200 to-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-xl border border-muted/40 relative z-10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold text-baseColor">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm">
            Login using your registered email & password
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
                placeholder="Enter your password"
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
              disabled={loginMutation.isPending}
              className="w-full bg-baseColor hover:bg-hoverColor text-white cursor-pointer"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>

            <Separator />

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?
                <NavLink
                  to="/register"
                  className="ml-1 text-baseColor hover:underline"
                >
                  Register
                </NavLink>
              </p>

              <NavLink
                to="/forget-password"
                className="text-sm text-baseColor hover:underline"
              >
                Forgot password?
              </NavLink>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};