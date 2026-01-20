import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import { Input } from "../../../../../components/ui/input";
import { Separator } from "../../../../../components/ui/separator";
import type { BasicUser } from "../types";

type Props = {
  disabled: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;

  createName: string;
  setCreateName: (v: string) => void;

  search: string;
  setSearch: (v: string) => void;

  results: BasicUser[];
  selected: BasicUser[];
  onToggleSelect: (u: BasicUser) => void;

  onCreate: () => void;
};

export const CreateTeamDialog = ({
  disabled,
  open,
  onOpenChange,
  createName,
  setCreateName,
  search,
  setSearch,
  results,
  selected,
  onToggleSelect,
  onCreate,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="w-full sm:w-auto bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 font-mono font-bold"
        >
          CREATE NEW TEAM
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900/95 border-2 border-green-500/30 text-green-300">
        <DialogHeader>
          <DialogTitle className="font-mono text-green-400">
            Create Team
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-mono text-green-300/70">
              Team name
            </div>
            <Input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="e.g. NullByte Squad"
              className="bg-slate-800/50 border-green-500/30 text-green-300 font-mono"
            />
          </div>

          <Separator className="bg-green-500/20" />

          <div className="space-y-2">
            <div className="text-xs font-mono text-green-300/70">
              Invite users (select 1–2; minimum team size is 2)
            </div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username or email..."
              className="bg-slate-800/50 border-green-500/30 text-green-300 font-mono"
            />

            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selected.map((u) => (
                  <span
                    key={u._id}
                    className="px-2 py-1 rounded border border-green-500/30 bg-green-500/10 text-green-300 text-xs font-mono"
                  >
                    {u.username}
                  </span>
                ))}
              </div>
            )}

            <div className="max-h-44 overflow-auto rounded border border-green-500/20">
              {results.length === 0 ? (
                <div className="p-3 text-xs font-mono text-green-300/50">
                  Type at least 2 characters to search.
                </div>
              ) : (
                <div className="divide-y divide-green-500/10">
                  {results.map((u) => {
                    const isSelected = selected.some((x) => x._id === u._id);
                    return (
                      <button
                        key={u._id}
                        onClick={() => onToggleSelect(u)}
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
          </div>

          <Button
            onClick={onCreate}
            className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:border-green-400 font-mono font-bold"
          >
            CREATE TEAM
          </Button>

          {disabled && (
            <div className="text-xs font-mono text-red-300/80">
              You are already in a team.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
