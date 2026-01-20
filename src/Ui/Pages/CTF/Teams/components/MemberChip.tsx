import type { BasicUser } from "../types";
import { initials } from "../helpers";

export const MemberChip = ({ user, size = "md" }: { user: BasicUser; size?: "sm" | "md" }) => {
  const avatarCls =
    size === "sm"
      ? "w-7 h-7 text-[10px]"
      : "w-8 h-8 text-xs";

  const nameCls = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-green-500/20">
      <div
        className={`${avatarCls} rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center font-mono text-green-300 flex-shrink-0`}
      >
        {initials(user.username)}
      </div>
      <div className={`font-mono ${nameCls} text-green-300 min-w-0 truncate`}>
        {user.username}
      </div>
    </div>
  );
};
