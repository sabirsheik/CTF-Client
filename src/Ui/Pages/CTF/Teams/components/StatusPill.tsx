import type { Team } from "../types";

export const StatusPill = ({ status }: { status: Team["status"] }) => {
  const cls =
    status === "Full"
      ? "bg-red-500/10 border-red-500/40 text-red-300"
      : status === "Pending Requests"
        ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-300"
        : "bg-green-500/10 border-green-500/40 text-green-300";

  return (
    <span
      className={`px-3 py-1 rounded-full border text-xs font-mono font-bold ${cls}`}
    >
      {status.toUpperCase()}
    </span>
  );
};
