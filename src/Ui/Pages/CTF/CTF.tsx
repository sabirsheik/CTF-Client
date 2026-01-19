import { useEffect, useState } from "react";
import apiFetch from "../../../Hook/api/fetchApi";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";

interface Challenge {
  id: string;
  name: string;
  description: string;
  link: string;
  solver: {
    username: string;
    solvedAt: Date;
  } | null;
}

export const CTF = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [flags, setFlags] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const data = await apiFetch("/api/challenges");
      setChallenges(data.challenges);
    } catch (error: any) {
      console.error("Failed to load challenges:", error.message);
    }
  };

  const handleFlagChange = (machineId: string, value: string) => {
    setFlags({ ...flags, [machineId]: value });
  };

  const handleSubmit = async (machineId: string) => {
    setLoading({ ...loading, [machineId]: true });
    setMessage({ ...message, [machineId]: "" });
    try {
      const data = await apiFetch("/api/challenges/submit", {
        method: "POST",
        body: { machineId, flag: flags[machineId] },
      });
      setMessage({ ...message, [machineId]: data.message });
      // Refresh challenges to show updated solver info
      setTimeout(() => {
        fetchChallenges();
        setFlags({ ...flags, [machineId]: "" });
      }, 1500);
    } catch (error: any) {
      setMessage({ ...message, [machineId]: error.message || "Submission failed" });
    }
    setLoading({ ...loading, [machineId]: false });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">CTF Machines</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{challenge.name}</h2>
              <p className="text-gray-600 mb-4 text-sm">{challenge.description}</p>
              <a
                href={challenge.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm mb-4 block"
              >
                {challenge.link}
              </a>
              
              {challenge.solver ? (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-700 font-medium text-sm">
                    ✓ Solved by: {challenge.solver.username}
                  </p>
                </div>
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder="Enter flag"
                    value={flags[challenge.id] || ""}
                    onChange={(e) => handleFlagChange(challenge.id, e.target.value)}
                    className="mb-3"
                  />
                  <Button
                    onClick={() => handleSubmit(challenge.id)}
                    disabled={loading[challenge.id] || !flags[challenge.id]}
                    className="w-full"
                  >
                    {loading[challenge.id] ? "Submitting..." : "Submit Flag"}
                  </Button>
                  {message[challenge.id] && (
                    <p className={`mt-2 text-sm ${message[challenge.id].includes("Congratulations") ? "text-green-600" : "text-red-600"}`}>
                      {message[challenge.id]}
                    </p>
                  )}
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};