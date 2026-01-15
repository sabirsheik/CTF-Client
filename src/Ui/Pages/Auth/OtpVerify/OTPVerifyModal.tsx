// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { useNavigate } from "react-router-dom";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";

// import { useVerifyOtp } from "../../../../Hook/Auth/useAuth";
// import ResetPasswordModal from "../ResetPasswordModal/ResetPasswordModal";

// interface Props {
//   email: string;
//   onClose: () => void;
//   onVerified: () => void;
// }

// const OTPVerifyModal = ({ email, onClose, onVerified }: Props) => {
//   const [otp, setOtp] = useState("");
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [showReset, setShowReset] = useState(false);
//   const navigate = useNavigate();
//   const verifyOtpMutation = useVerifyOtp();

//   /* ================= TIMER ================= */
//   useEffect(() => {
//     if (timeLeft <= 0) {
//       toast.error("OTP expired");
//       onClose(); // modal hide
//       navigate("/login"); // redirect to login
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, onClose, navigate]);

//   /* ================= VERIFY ================= */
//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!otp) {
//       toast.warning("Enter OTP");
//       return;
//     }

//     verifyOtpMutation.mutate(
//       { email, otp },
//       {
//         onSuccess: () => {
//           toast.success("OTP verified");
//           onVerified();
//         },
//         onError: (error: any) => {
//           toast.error(error.response?.data?.message || "Invalid OTP");
//         },
//       }
//     );
//   };

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   /* ================= RESET PASSWORD ================= */
//   if (showReset) {
//     return (
//       <ResetPasswordModal email={email} onClose={() => setShowReset(false)} />
//     );
//   }

//   return (
//     <Dialog open onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-sm bg-white/90 backdrop-blur-xl shadow-2xl border border-muted/40">
//         <DialogHeader className="text-center space-y-2">
//           <DialogTitle className="text-xl font-semibold text-baseColor">
//             Verify OTP
//           </DialogTitle>
//           <DialogDescription className="text-sm">
//             Enter the 6-digit code sent to your email
//           </DialogDescription>
//         </DialogHeader>

//         <Separator />

//         {/* Timer */}
//         <div className="text-center text-sm font-medium text-muted-foreground">
//           Time Remaining{" "}
//           <span className="text-baseColor">
//             {minutes}:{seconds.toString().padStart(2, "0")}
//           </span>
//         </div>

//         {/* OTP FORM */}
//         <form onSubmit={handleVerify} className="space-y-4 mt-4">
//           <Input
//             type="text"
//             placeholder="••••••"
//             maxLength={6}
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="text-center tracking-[0.35em] text-lg font-semibold"
//           />

//           <Button
//             disabled={verifyOtpMutation.isPending}
//             className="w-full bg-baseColor hover:bg-hoverColor text-white"
//           >
//             {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
//           </Button>
//         </form>

//         <Separator />

//         {/* Footer Actions */}
//         <div className="text-center text-sm space-y-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="block mx-auto text-muted-foreground hover:text-foreground"
//           >
//             Cancel
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default OTPVerifyModal;



import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useVerifyOtp } from "../../../../Hook/Auth/useAuth";

interface Props {
  email: string;
  onClose: () => void;
}

const OTPVerifyModal = ({ email, onClose }: Props) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(30); // 30 sec timer
  const navigate = useNavigate();
  const verifyOtpMutation = useVerifyOtp();

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("OTP expired");
      onClose(); // modal hide
      navigate("/login"); // redirect to login
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onClose, navigate]);

  /* ================= VERIFY ================= */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.warning("Enter OTP");
      return;
    }

    verifyOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.success("OTP verified");

          // Navigate to ResetPassword route with email state
          navigate("/reset-password", { state: { email } });
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Invalid OTP");
        },
      }
    );
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-white/90 backdrop-blur-xl shadow-2xl border border-muted/40">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-xl font-semibold text-baseColor">
            Verify OTP
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter the 6-digit code sent to your email
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Timer */}
        <div className="text-center text-sm font-medium text-muted-foreground mt-2">
          Time Remaining{" "}
          <span className="text-baseColor">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        {/* OTP FORM */}
        <form onSubmit={handleVerify} className="space-y-4 mt-4">
          <Input
            type="text"
            placeholder="••••••"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="text-center tracking-[0.35em] text-lg font-semibold"
          />

          <Button
            disabled={verifyOtpMutation.isPending}
            className="w-full bg-baseColor hover:bg-hoverColor text-white"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

        <Separator />

        {/* Footer Actions */}
        <div className="text-center text-sm mt-2">
          <button
            type="button"
            onClick={onClose}
            className="block mx-auto text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerifyModal;
