import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import apiFetch from "../../../../Hook/api/fetchApi";

import type { BasicUser, JoinRequest, Team } from "./types";
import { TeamsHeader } from "./components/TeamsHeader";
import { InvitationsSection } from "./components/InvitationsSection";
import { MyTeamSection } from "./components/MyTeamSection";
import { AllTeamsSection } from "./components/AllTeamsSection";
import { InviteUserDialog } from "./components/InviteUserDialog";
import { JoinRequestsDialog } from "./components/JoinRequestsDialog";

const TEAMS_PER_PAGE = 1;

export const Teams = () => {

  const navigate = useNavigate();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch teams with infinite query
  const {
    data: teamsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: teamsLoading,
    refetch: refetchTeams,
  } = useInfiniteQuery({
    queryKey: ["teams"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiFetch(`/api/teams?page=${pageParam}&limit=${TEAMS_PER_PAGE}`);
      return res;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  // Fetch invites
  const { data: invitesData, refetch: refetchInvites } = useQuery({
    queryKey: ["teamInvites"],
    queryFn: async () => {
      const res = await apiFetch("/api/teams/invites");
      return res;
    },
  });

  const teams = useMemo(() => {
    if (!teamsData?.pages) return [];
    return teamsData.pages.flatMap((page) => page.teams || []);
  }, [teamsData]);

  const invites = invitesData?.invites || [];

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

  const myTeam = useMemo(
    () => teams.find((t) => t.viewer.isMember) ?? null,
    [teams]
  );

  const refresh = useCallback(async () => {
    await Promise.all([refetchTeams(), refetchInvites()]);
  }, [refetchTeams, refetchInvites]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

  if (teamsLoading) {
    return (
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 font-mono text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mb-4"></div>
          <div>Loading teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <TeamsHeader
          onBack={() => navigate(`/dashboard/auth/user/teams`)}
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

        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="py-4 text-center font-mono">
          {isFetchingNextPage && (
            <div className="flex flex-col items-center gap-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
              <span className="text-green-400/70 text-sm">Loading more teams...</span>
            </div>
          )}
          {!hasNextPage && teams.length > 0 && (
            <div className="text-green-400/50 text-sm py-4">
              <div className="inline-flex items-center gap-2">
                <div className="h-px w-8 bg-green-400/30"></div>
                <span>You've reached the last team</span>
                <div className="h-px w-8 bg-green-400/30"></div>
              </div>
            </div>
          )}
        </div>

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
