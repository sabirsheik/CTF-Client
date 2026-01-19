import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";

export const Teams = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Teams Page</h1>
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/dashboard/auth/user/ctf")}
            className="w-full"
          >
            Go to CTF Page
          </Button>
          <Button
            onClick={() => navigate("/dashboard/auth/user/challenge")}
            className="w-full"
            variant="outline"
          >
            Go to Challenge Page
          </Button>
        </div>
      </div>
    </div>
  );
};