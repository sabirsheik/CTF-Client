import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../../Hook/api/fetchApi";

const FilteringRound = () => {
  const [link, setLink] = useState<string>("");
  const [flag, setFlag] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await apiFetch("/api/auth/get-challenge");
        setLink(data.link);
      } catch (error) {
        setMessage("Failed to load challenge");
      }
    };
    fetchChallenge();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await apiFetch("/api/auth/verify-flag", {
        method: "POST",
        body: { flag },
      });
      if (data.success) {
        setMessage(data.message);
        // Redirect to teams page
        setTimeout(() => navigate("/dashboard/auth/user/teams"), 2000);
      } else {
        setMessage(data.message);
      }
    } catch (error: any) {
      setMessage(error.message || "Verification failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Filtering Round</h1>
        <p className="mb-4 text-center">
          Complete this challenge to be eligible for the CTF.
        </p>
        {link && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Challenge Link:</label>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {link}
            </a>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="flag" className="block text-sm font-medium mb-2">
              Enter Flag:
            </label>
            <input
              type="text"
              id="flag"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-baseColor text-white py-2 px-4 rounded-md hover:bg-hoverColor disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Submit Flag"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default FilteringRound;