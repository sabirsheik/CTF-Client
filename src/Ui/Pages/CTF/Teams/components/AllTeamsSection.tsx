import { Card } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Separator } from "../../../../../components/ui/separator";
import { Input } from "../../../../../components/ui/input";
import type { Team } from "../types";
import { StatusPill } from "./StatusPill";
import { MemberChip } from "./MemberChip";
import { useState } from "react";
import { Search } from "lucide-react";

type Props = {
  teams: Team[];
  myTeam: Team | null;
  onRequestJoin: (teamId: string) => void;
};

export const AllTeamsSection = ({ teams, myTeam, onRequestJoin }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter teams based on search term
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-mono font-bold text-green-400">
          ALL TEAMS
        </h2>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400/60" />
          <Input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-green-500/30 text-green-300 placeholder:text-gray-600 focus:border-green-400 focus:ring-green-400/20 font-mono text-sm"
          />
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="font-mono text-green-300/60">
          {searchTerm ? "No teams found matching your search." : "No teams yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTeams.map((team) => {
            const alreadyInTeam = !!myTeam && !team.viewer.isMember;

            return (
              <Card
                key={team._id}
                className="p-5 sm:p-6 bg-slate-900/90 backdrop-blur-xl border-2 border-green-500/30 rounded-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-green-300 text-lg sm:text-xl font-bold truncate">
                      {team.name}
                    </div>
                    <div className="font-mono text-xs text-green-300/60 mt-1">
                      Owner: {team.owner?.username}
                    </div>
                  </div>
                  <StatusPill status={team.status} />
                </div>

                <Separator className="bg-green-500/20 my-4" />

                <div className="space-y-3">
                  <div className="font-mono text-xs text-green-300/60">
                    Members ({team.counts.members}/3)
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {team.members.map((m) => (
                      <MemberChip key={m._id} user={m} size="sm" />
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="font-mono text-xs text-green-300/50">
                      Requests: {team.counts.joinRequests} · Invites: {team.counts.invites}
                    </div>

                    {!team.viewer.isMember && (
                      <div className="flex flex-wrap gap-2">
                        {alreadyInTeam ? (
                          <Button
                            disabled
                            className="bg-slate-800/40 text-green-300/40 border-2 border-green-500/20 font-mono font-bold"
                          >
                            IN A TEAM
                          </Button>
                        ) : team.viewer.hasInvite ? (
                          <Button
                            disabled
                            className="bg-yellow-500/10 text-yellow-300 border-2 border-yellow-500/30 font-mono font-bold"
                          >
                            INVITED
                          </Button>
                        ) : team.viewer.hasPendingJoinRequest ? (
                          <Button
                            disabled
                            className="bg-slate-800/40 text-green-300/40 border-2 border-green-500/20 font-mono font-bold"
                          >
                            REQUESTED
                          </Button>
                        ) : (
                          <Button
                            disabled={team.status === "Full"}
                            onClick={() => onRequestJoin(team._id)}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 font-mono font-bold"
                          >
                            REQUEST JOIN
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};
