import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CreateTeamDialog } from "./CreateTeamDialog";
import type { BasicUser } from "../types";

type Props = {
  onBack: () => void;

  createDisabled: boolean;
  createOpen: boolean;
  setCreateOpen: (v: boolean) => void;

  createName: string;
  setCreateName: (v: string) => void;

  createSearch: string;
  setCreateSearch: (v: string) => void;

  createResults: BasicUser[];
  createSelected: BasicUser[];
  onToggleCreateSelect: (u: BasicUser) => void;
  onCreateTeam: () => void;
};

export const TeamsHeader = ({
  onBack,
  createDisabled,
  createOpen,
  setCreateOpen,
  createName,
  setCreateName,
  createSearch,
  setCreateSearch,
  createResults,
  createSelected,
  onToggleCreateSelect,
  onCreateTeam,
}: Props) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-4 ">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onBack}
          className="inline-flex w-fit items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded font-mono text-sm hover:bg-green-500/30 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          BACK
        </motion.button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-6">
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-400 font-mono glow-text text-center sm:text-left">
              TEAMS
            </h1>
            <p className="text-green-300/70 font-mono text-sm mt-2 text-center lg:text-left">
              Request-based teams · 2–3 members · Secure invitations
            </p>
          </div>

          <CreateTeamDialog
            disabled={createDisabled}
            open={createOpen}
            onOpenChange={setCreateOpen}
            createName={createName}
            setCreateName={setCreateName}
            search={createSearch}
            setSearch={setCreateSearch}
            results={createResults}
            selected={createSelected}
            onToggleSelect={onToggleCreateSelect}
            onCreate={onCreateTeam}
          />
        </div>
      </div>
    </header>
  );
};
