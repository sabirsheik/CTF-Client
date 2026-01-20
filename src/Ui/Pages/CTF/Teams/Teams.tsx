import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import apiFetch from "../../../../Hook/api/fetchApi";

import type { BasicUser, JoinRequest, Team, TeamInvite } from "./types";
import { TeamsHeader } from "./components/TeamsHeader";
import { InvitationsSection } from "./components/InvitationsSection";
import { MyTeamSection } from "./components/MyTeamSection";
import { AllTeamsSection } from "./components/AllTeamsSection";
import { InviteUserDialog } from "./components/InviteUserDialog";
import { JoinRequestsDialog } from "./components/JoinRequestsDialog";

export const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createSearch, setCreateSearch] = useState("");
  const [createResults, setCreateResults] = useState<BasicUser[]>([]);
  const [createSelected, setCreateSelected] = useState<BasicUser[]>([]);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteTeam, setInviteTeam] = useState<Team | null>(null);
  const [inviteSearch, setInviteSearch] = useState("");
  const [inviteResults, setInviteResults] = useState<BasicUser[]>([]);
  const [inviteSelected, setInviteSelected] = useState<BasicUser | null>(null);

  const [requestsOpen, setRequestsOpen] = useState(false);
  const [requestsTeam, setRequestsTeam] = useState<Team | null>(null);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const navigate = useNavigate();

  const myTeam = useMemo(
    () => teams.find((t) => t.viewer.isMember) ?? null,
    [teams]
  );

  const refresh = async () => {
    const [teamsRes, invitesRes] = await Promise.all([
      apiFetch("/api/teams"),
      apiFetch("/api/teams/invites"),
    ]);
    setTeams(teamsRes.teams || []);
    setInvites(invitesRes.invites || []);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await refresh();
      } catch (e: any) {
        toast.error(e.message || "Failed to load teams");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Debounced search for create dialog
  useEffect(() => {
    const t = setTimeout(async () => {
      const q = createSearch.trim();
      if (!createOpen || q.length < 2) {
        setCreateResults([]);
        return;
      }
      try {
        const res = await apiFetch(`/api/users/search?q=${encodeURIComponent(q)}`);
        setCreateResults(res.users || []);
      } catch {
        setCreateResults([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [createSearch, createOpen]);

  // Debounced search for invite dialog
  useEffect(() => {
    const t = setTimeout(async () => {
      const q = inviteSearch.trim();
      if (!inviteOpen || q.length < 2) {
        setInviteResults([]);
        return;
      }
      try {
        const res = await apiFetch(`/api/users/search?q=${encodeURIComponent(q)}`);
        setInviteResults(res.users || []);
      } catch {
        setInviteResults([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [inviteSearch, inviteOpen]);

  const toggleCreateSelect = (u: BasicUser) => {
    const already = createSelected.some((x) => x._id === u._id);
    if (already) {
      setCreateSelected((prev) => prev.filter((x) => x._id !== u._id));
      return;
    }
    if (createSelected.length >= 2) {
      toast.error("You can select at most 2 invitees (max team size 3)");
      return;
    }
    setCreateSelected((prev) => [...prev, u]);
  };

  const createTeam = async () => {
    try {
      if (myTeam) {
        toast.error("You are already in a team");
        return;
      }
      const name = createName.trim();
      if (name.length < 2) {
        toast.error("Team name must be at least 2 characters");
        return;
      }
      if (createSelected.length < 1) {
        toast.error("Invite at least 1 user (minimum team size is 2)");
        return;
      }

      await apiFetch("/api/teams", {
        method: "POST",
        body: { name, inviteeIds: createSelected.map((u) => u._id) },
      });

      toast.success("Team created; invitations sent");
      setCreateOpen(false);
      setCreateName("");
      setCreateSearch("");
      setCreateResults([]);
      setCreateSelected([]);
      await refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to create team");
    }
  };

  const requestJoin = async (teamId: string) => {
    try {
      await apiFetch(`/api/teams/${teamId}/join-requests`, { method: "POST" });
      toast.success("Join request sent");
      await refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to send request");
    }
  };

  const openRequests = async (team: Team) => {
    setRequestsTeam(team);
    setRequestsOpen(true);
    setRequestsLoading(true);
    try {
      const res = await apiFetch(`/api/teams/${team._id}/join-requests`);
      setJoinRequests(res.joinRequests || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load requests");
      setJoinRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  const acceptRequest = async (teamId: string, userId: string) => {
    try {
      await apiFetch(`/api/teams/${teamId}/join-requests/${userId}/accept`, {
        method: "POST",
      });
      toast.success("Request accepted");
      await openRequests(teams.find((t) => t._id === teamId) || requestsTeam!);
      await refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to accept request");
    }
  };

  const rejectRequest = async (teamId: string, userId: string) => {
    try {
      await apiFetch(`/api/teams/${teamId}/join-requests/${userId}/reject`, {
        method: "POST",
      });
      toast.success("Request rejected");
      await openRequests(teams.find((t) => t._id === teamId) || requestsTeam!);
      await refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to reject request");
    }
  };

  const openInvite = (team: Team) => {
    setInviteTeam(team);
    setInviteSelected(null);
    setInviteSearch("");
    setInviteResults([]);
    setInviteOpen(true);
  };

  const sendInvite = async () => {
    if (!inviteTeam || !inviteSelected) return;
    try {
      await apiFetch(`/api/teams/${inviteTeam._id}/invites`, {
        method: "POST",
        body: { userId: inviteSelected._id },
      });
      toast.success("Invite sent");
      setInviteOpen(false);
      setInviteTeam(null);
      setInviteSelected(null);
      setInviteSearch("");
      setInviteResults([]);
      await refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to send invite");
    }
  };

  const acceptInvite = async (teamId: string) => {
    try {
      await apiFetch(`/api/teams/${teamId}/invites/accept`, { method: "POST" });
      toast.success("Joined team");
      await refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to accept invite");
    }
  };

  const declineInvite = async (teamId: string) => {
    try {
      await apiFetch(`/api/teams/${teamId}/invites/decline`, { method: "POST" });
      toast.success("Invite declined");
      await refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to decline invite");
    }
  };

  const leaveTeam = async (teamId: string) => {
    try {
      await apiFetch(`/api/teams/${teamId}/leave`, { method: "POST" });
      toast.success("Left team");
      await refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to leave team");
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      await apiFetch(`/api/teams/${teamId}`, { method: "DELETE" });
      toast.success("Team deleted");
      await refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete team");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 font-mono text-green-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <TeamsHeader
          onBack={() => navigate(`/dashboard/auth/user/ctf`)}
          createDisabled={!!myTeam}
          createOpen={createOpen}
          setCreateOpen={setCreateOpen}
          createName={createName}
          setCreateName={setCreateName}
          createSearch={createSearch}
          setCreateSearch={setCreateSearch}
          createResults={createResults}
          createSelected={createSelected}
          onToggleCreateSelect={toggleCreateSelect}
          onCreateTeam={createTeam}
        />

        <InvitationsSection
          invites={invites}
          onAccept={acceptInvite}
          onDecline={declineInvite}
        />

        <MyTeamSection
          myTeam={myTeam}
          onInvite={openInvite}
          onOpenRequests={openRequests}
          onLeave={leaveTeam}
          onDelete={deleteTeam}
        />

        <AllTeamsSection teams={teams} myTeam={myTeam} onRequestJoin={requestJoin} />

        <InviteUserDialog
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          teamName={inviteTeam?.name}
          search={inviteSearch}
          setSearch={setInviteSearch}
          results={inviteResults}
          selected={inviteSelected}
          setSelected={setInviteSelected}
          onSend={sendInvite}
          disabled={!inviteSelected || !inviteTeam}
        />

        <JoinRequestsDialog
          open={requestsOpen}
          onOpenChange={setRequestsOpen}
          teamName={requestsTeam?.name}
          loading={requestsLoading}
          requests={joinRequests}
          onAccept={(userId) => acceptRequest(requestsTeam!._id, userId)}
          onReject={(userId) => rejectRequest(requestsTeam!._id, userId)}
        />
      </div>
    </div>
  );
};
