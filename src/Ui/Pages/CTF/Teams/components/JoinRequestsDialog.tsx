import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import type { JoinRequest } from "../types";
import { initials } from "../helpers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamName?: string;

  loading: boolean;
  requests: JoinRequest[];

  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
};

export const JoinRequestsDialog = ({
  open,
  onOpenChange,
  teamName,
  loading,
  requests,
  onAccept,
  onReject,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 border-2 border-green-500/30 text-green-300">
        <DialogHeader>
          <DialogTitle className="font-mono text-green-400">
            Join Requests
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-xs font-mono text-green-300/70">Team: {teamName}</div>

          {loading ? (
            <div className="text-sm font-mono text-green-300/60">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-sm font-mono text-green-300/60">
              No pending requests.
            </div>
          ) : (
            <div className="space-y-2">
              {requests.map((r) => (
                <div
                  key={r.user._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg bg-slate-800/40 border border-green-500/20"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center font-mono text-xs text-green-300 flex-shrink-0">
                      {initials(r.user.username)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-sm text-green-300 truncate">
                        {r.user.username}
                      </div>
                      <div className="font-mono text-xs text-green-300/50">
                        Pending
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => onAccept(r.user._id)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 font-mono font-bold"
                    >
                      ACCEPT
                    </Button>
                    <Button
                      onClick={() => onReject(r.user._id)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border-2 border-red-500/40 hover:border-red-400 font-mono font-bold"
                    >
                      REJECT
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
