import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import type { BasicUser } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamName?: string;

  search: string;
  setSearch: (v: string) => void;

  results: BasicUser[];
  selected: BasicUser | null;
  setSelected: (u: BasicUser) => void;

  onSend: () => void;
  disabled: boolean;
};

export const InviteUserDialog = ({
  open,
  onOpenChange,
  teamName,
  search,
  setSearch,
  results,
  selected,
  setSelected,
  onSend,
  disabled,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 border-2 border-green-500/30 text-green-300">
        <DialogHeader>
          <DialogTitle className="font-mono text-green-400">
            Invite User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-xs font-mono text-green-300/70">Team: {teamName}</div>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username or email..."
            className="bg-slate-800/50 border-green-500/30 text-green-300 font-mono"
          />

          <div className="max-h-52 overflow-auto rounded border border-green-500/20">
            {results.length === 0 ? (
              <div className="p-3 text-xs font-mono text-green-300/50">
                Type at least 2 characters to search.
              </div>
            ) : (
              <div className="divide-y divide-green-500/10">
                {results.map((u) => {
                  const isSelected = selected?._id === u._id;
                  return (
                    <button
                      key={u._id}
                      onClick={() => setSelected(u)}
                      className="w-full text-left px-3 py-2 hover:bg-green-500/10 transition-colors"
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-mono text-sm text-green-300 truncate">
                            {u.username}
                          </div>
                          {u.email && (
                            <div className="font-mono text-xs text-green-300/50 truncate">
                              {u.email}
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-xs font-mono px-2 py-1 rounded border ${
                            isSelected
                              ? "border-green-400/60 text-green-300 bg-green-500/10"
                              : "border-green-500/20 text-green-300/60"
                          }`}
                        >
                          {isSelected ? "SELECTED" : "SELECT"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            onClick={onSend}
            disabled={disabled}
            className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 font-mono font-bold"
          >
            SEND INVITE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
