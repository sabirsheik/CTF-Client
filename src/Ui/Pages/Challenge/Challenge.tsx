
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "SQL Injection Basics",
    description: "Learn the fundamentals of SQL injection attacks by exploiting a vulnerable login form.",
    points: 100,
    difficulty: 'Easy'
  },
  {
    id: 2,
    title: "Cross-Site Scripting (XSS)",
    description: "Find and exploit XSS vulnerabilities in a web application to steal user cookies.",
    points: 200,
    difficulty: 'Medium'
  },
  {
    id: 3,
    title: "Buffer Overflow Exploit",
    description: "Exploit a buffer overflow vulnerability to gain shell access on a remote server.",
    points: 300,
    difficulty: 'Hard'
  },
  {
    id: 4,
    title: "Cryptography Challenge",
    description: "Decrypt a message encrypted with AES and find the hidden flag.",
    points: 250,
    difficulty: 'Medium'
  },
  {
    id: 5,
    title: "Web Exploitation",
    description: "Bypass authentication and access the admin panel through various web vulnerabilities.",
    points: 150,
    difficulty: 'Easy'
  },
  {
    id: 6,
    title: "Reverse Engineering",
    description: "Analyze a binary file and find the correct password to unlock the next level.",
    points: 350,
    difficulty: 'Hard'
  }
];

export const Challenge = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">CTF Challenges</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{challenge.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Difficulty: <span className={`font-semibold ${
                  challenge.difficulty === 'Easy' ? 'text-green-600' :
                  challenge.difficulty === 'Medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{challenge.difficulty}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{challenge.description}</p>
              <p className="text-lg font-semibold mt-2">Points: {challenge.points}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
