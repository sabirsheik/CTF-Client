 import { useState } from "react";
import { motion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
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
import { Loader2, Plus, X } from "lucide-react";

// Typed motion targets
const formCardInitial: TargetAndTransition = { opacity: 0, y: 50 };
const formCardAnimate: TargetAndTransition = { opacity: 1, y: 0 };
const formFieldInitial: TargetAndTransition = { x: 20, opacity: 0 };
const formFieldAnimate: TargetAndTransition = { x: 0, opacity: 1 };
const errorInitial: TargetAndTransition = { opacity: 0 };
const errorAnimate: TargetAndTransition = { opacity: 1 };

interface StallsFormData {
  name: string;
  email: string;
  companyOrUniversity: string;
  productName: string;
  productDescription: string;
  phoneNumber: string;
  teamMembers: string;
}

interface StallsFormErrors {
  name?: string;
  email?: string;
  companyOrUniversity?: string;
  productName?: string;
  productDescription?: string;
  phoneNumber?: string;
  teamMembers?: string;
}

export const Submit = () => {
  const [formData, setFormData] = useState<StallsFormData>({
    name: "",
    email: "",
    companyOrUniversity: "",
    productName: "",
    productDescription: "",
    phoneNumber: "",
    teamMembers: "",
  });

  const [errors, setErrors] = useState<StallsFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamMembersList, setTeamMembersList] = useState<string[]>([]);
  const [currentMember, setCurrentMember] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof StallsFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: StallsFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.companyOrUniversity.trim()) {
      newErrors.companyOrUniversity = "Company or University is required";
    }

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.productDescription.trim()) {
      newErrors.productDescription = "Product description is required";
    } else if (formData.productDescription.length < 10) {
      newErrors.productDescription =
        "Description must be at least 10 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (teamMembersList.length === 0) {
      newErrors.teamMembers = "At least one team member is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addTeamMember = () => {
    if (currentMember.trim()) {
      setTeamMembersList([...teamMembersList, currentMember.trim()]);
      setCurrentMember("");
      if (errors.teamMembers) {
        setErrors((prev) => ({ ...prev, teamMembers: undefined }));
      }
    }
  };

  const removeTeamMember = (index: number) => {
    setTeamMembersList(teamMembersList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
      
      // Prepare data with team members as comma-separated string
      const submitData = {
        ...formData,
        teamMembers: teamMembersList.join(", "),
      };
      
      const response = await fetch(`${API_URL}/api/stalls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit stalls form");
      }

      toast.success(data.message || "Stalls submission successful!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        companyOrUniversity: "",
        productName: "",
        productDescription: "",
        phoneNumber: "",
        teamMembers: "",
      });
      setTeamMembersList([]);
      setCurrentMember("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={formCardInitial}
      animate={formCardAnimate}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl bg-slate-900/90 backdrop-blur-xl border-2 border-blue-500/30 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent" />
        <CardHeader className="space-y-2 text-center relative z-10">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-14 h-14 border-2 border-blue-400 rounded-full flex items-center justify-center mb-1"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-7 h-7 bg-blue-400/20 rounded-full"
            />
          </motion.div>
          <CardTitle className="text-lg font-bold text-blue-400 font-mono glow-text">
            Project Display - Stalls 
          </CardTitle>
          <CardDescription className="text-xs text-blue-300/70 font-mono">
           Submit your stall details
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 relative z-10">
            {/* Name */}
            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.2 }}
              className="space-y-1"
            >
              <Label htmlFor="name" className="text-blue-400 font-mono text-xs">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-slate-800/50 border-blue-500/30 text-blue-300 placeholder:text-gray-600 focus:border-blue-400 focus:ring-blue-400/20 font-mono text-sm h-9"
              />
              {errors.name && (
                <motion.p
                  initial={errorInitial}
                  animate={errorAnimate}
                  className="text-xs text-red-400 font-mono"
                >
                  ! {errors.name}
                </motion.p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.25 }}
              className="space-y-1"
            >
              <Label
                htmlFor="stalls-email"
                className="text-blue-400 font-mono text-xs"
              >
                Email
              </Label>
              <Input
                id="stalls-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-slate-800/50 border-blue-500/30 text-blue-300 placeholder:text-gray-600 focus:border-blue-400 focus:ring-blue-400/20 font-mono text-sm h-9"
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

            {/* Company/University */}
            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.3 }}
              className="space-y-1"
            >
              <Label
                htmlFor="companyOrUniversity"
                className="text-blue-400 font-mono text-xs"
              >
                Company / University
              </Label>
              <Input
                id="companyOrUniversity"
                name="companyOrUniversity"
                type="text"
                placeholder="Your organization"
                value={formData.companyOrUniversity}
                onChange={handleInputChange}
                className="bg-slate-800/50 border-blue-500/30 text-blue-300 placeholder:text-gray-600 focus:border-blue-400 focus:ring-blue-400/20 font-mono text-sm h-9"
              />
              {errors.companyOrUniversity && (
                <motion.p
                  initial={errorInitial}
                  animate={errorAnimate}
                  className="text-xs text-red-400 font-mono"
                >
                  ! {errors.companyOrUniversity}
                </motion.p>
              )}
            </motion.div>

            {/* Product Name */}
            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.35 }}
              className="space-y-1"
            >
              <Label
                htmlFor="productName"
                className="text-blue-400 font-mono text-xs"
              >
                Product Name
              </Label>
              <Input
                id="productName"
                name="productName"
                type="text"
                placeholder="Product name"
                value={formData.productName}
                onChange={handleInputChange}
                className="bg-slate-800/50 border-blue-500/30 text-blue-300 placeholder:text-gray-600 focus:border-blue-400 focus:ring-blue-400/20 font-mono text-sm h-9"
              />
              {errors.productName && (
                <motion.p
                  initial={errorInitial}
                  animate={errorAnimate}
                  className="text-xs text-red-400 font-mono"
                >
                  ! {errors.productName}
                </motion.p>
              )}
            </motion.div>

            {/* Product Description */}
            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.4 }}
              className="space-y-1"
            >
              <Label
                htmlFor="productDescription"
                className="text-blue-400 font-mono text-xs"
              >
                Product Description
              </Label>
              <textarea
                id="productDescription"
                name="productDescription"
                placeholder="Describe your product..."
                value={formData.productDescription}
                onChange={handleInputChange}
                rows={2}
                className="w-full bg-slate-800/50 border border-blue-500/30 text-blue-300 placeholder:text-gray-600 focus:border-blue-400 focus:ring-blue-400/20 font-mono text-sm rounded-md px-3 py-2 resize-none"
              />
              {errors.productDescription && (
                <motion.p
                  initial={errorInitial}
                  animate={errorAnimate}
                  className="text-xs text-red-400 font-mono"
                >
                  ! {errors.productDescription}
                </motion.p>
              )}
            </motion.div>

            {/* Phone Number */}
            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.45 }}
              className="space-y-1"
            >
              <Label
                htmlFor="phoneNumber"
                className="text-blue-400 font-mono text-xs"
              >
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="03345678909"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="bg-slate-800/50 border-blue-500/30 text-blue-300 placeholder:text-gray-600 focus:border-blue-400 focus:ring-blue-400/20 font-mono text-sm h-9"
              />
              {errors.phoneNumber && (
                <motion.p
                  initial={errorInitial}
                  animate={errorAnimate}
                  className="text-xs text-red-400 font-mono"
                >
                  ! {errors.phoneNumber}
                </motion.p>
              )}
            </motion.div>

            {/* Team Members */}
            <motion.div
              initial={formFieldInitial}
              animate={formFieldAnimate}
              transition={{ delay: 0.5 }}
              className="space-y-1"
            >
              <Label
                htmlFor="teamMembers"
                className="text-blue-400 font-mono text-xs"
              >
                Team Members
              </Label>
              <div className="flex gap-2">
                <Input
                  id="teamMembers"
                  name="teamMembers"
                  type="text"
                  placeholder="Enter member name"
                  value={currentMember}
                  onChange={(e) => setCurrentMember(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTeamMember();
                    }
                  }}
                  className="bg-slate-800/50 border-blue-500/30 text-blue-300 placeholder:text-gray-600 focus:border-blue-400 focus:ring-blue-400/20 font-mono text-sm h-9"
                />
                <Button
                  type="button"
                  onClick={addTeamMember}
                  disabled={!currentMember.trim()}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 hover:border-blue-400 h-9 px-3"
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              {/* Team Members List */}
              {teamMembersList.length > 0 && (
                <div className="mt-2 space-y-1">
                  {teamMembersList.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded px-3 py-1.5"
                    >
                      <span className="text-blue-300 font-mono text-xs">
                        {member}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {errors.teamMembers && (
                <motion.p
                  initial={errorInitial}
                  animate={errorAnimate}
                  className="text-xs text-red-400 font-mono"
                >
                  ! {errors.teamMembers}
                </motion.p>
              )}
            </motion.div>
          </CardContent>

          <CardFooter className="relative z-10 pt-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-2 border-blue-500/50 hover:border-blue-400 cursor-pointer font-mono font-bold transition-all text-sm h-9"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    SUBMITTING...
                  </>
                ) : (
                  "SUBMIT STALLS FORM"
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

