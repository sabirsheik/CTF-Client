import { Card } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import type { TeamInvite } from "../types";
import { StatusPill } from "./StatusPill";

type Props = {
  invites: TeamInvite[];
  onAccept: (teamId: string) => void;
  onDecline: (teamId: string) => void;
};

export const InvitationsSection = ({ invites, onAccept, onDecline }: Props) => {
  if (invites.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg sm:text-xl font-mono font-bold text-green-400 mb-3">
        INVITATIONS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {invites.map((inv) => (
          <Card
            key={inv.team._id}
            className="p-5 bg-slate-900/90 backdrop-blur-xl border-2 border-green-500/30 rounded-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-mono text-green-300 text-lg font-bold truncate">
                  {inv.team.name}
                </div>
                <div className="font-mono text-xs text-green-300/60 mt-1">
                  Invited by {inv.invitedBy?.username}
                </div>
              </div>
              <StatusPill status="Pending Requests" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => onAccept(inv.team._id)}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 font-mono font-bold"
              >
                ACCEPT
              </Button>
              <Button
                onClick={() => onDecline(inv.team._id)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border-2 border-red-500/40 hover:border-red-400 font-mono font-bold"
              >
                DECLINE
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
