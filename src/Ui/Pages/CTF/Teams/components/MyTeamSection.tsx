import { Card } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import type { Team } from "../types";
import { StatusPill } from "./StatusPill";
import { MemberChip } from "../components/MemberChip";

type Props = {
  myTeam: Team | null;
  onInvite: (team: Team) => void;
  onOpenRequests: (team: Team) => void;
  onLeave: (teamId: string) => void;
  onDelete: (teamId: string) => void;
};

export const MyTeamSection = ({
  myTeam,
  onInvite,
  onOpenRequests,
  onLeave,
  onDelete,
}: Props) => {
  if (!myTeam) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg sm:text-xl font-mono font-bold text-green-400 mb-3">
        YOUR TEAM
      </h2>
      <Card className="p-5 sm:p-6 bg-slate-900/90 backdrop-blur-xl border-2 border-green-500/30 rounded-xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="font-mono text-green-300 text-xl sm:text-2xl font-bold wrap-break-word">
                {myTeam.name}
              </div>
              <StatusPill status={myTeam.status} />
              {myTeam.viewer.isOwner && (
                <span className="px-2 py-1 rounded border border-green-500/30 bg-green-500/10 text-green-300 text-xs font-mono">
                  OWNER
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {myTeam.members.map((m) => (
                <MemberChip key={m._id} user={m} />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-auto lg:min-w-56 flex flex-col gap-2">
            <Button
              onClick={() => onInvite(myTeam)}
              disabled={myTeam.counts.members >= 3}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 font-mono font-bold"
            >
              INVITE USER
            </Button>

            <Button
              onClick={() => onOpenRequests(myTeam)}
              className="bg-green-500/10 hover:bg-green-500/20 text-green-300 border-2 border-green-500/30 hover:border-green-400 font-mono font-bold"
            >
              REQUESTS ({myTeam.counts.joinRequests})
            </Button>

            {myTeam.viewer.isOwner ? (
              <Button
                onClick={() => onDelete(myTeam._id)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border-2 border-red-500/40 hover:border-red-400 font-mono font-bold"
              >
                DELETE TEAM
              </Button>
            ) : (
              <Button
                onClick={() => onLeave(myTeam._id)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border-2 border-red-500/40 hover:border-red-400 font-mono font-bold"
              >
                LEAVE TEAM
              </Button>
            )}

            <div className="text-xs font-mono text-green-300/50">
              Max 3 members
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};
