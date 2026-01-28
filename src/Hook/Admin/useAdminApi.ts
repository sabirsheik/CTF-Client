import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

// ==================== TYPES ====================
export interface User {
  _id: string;
  username: string;
  email: string;
  universityName?: string;
  phoneNumber?: string;
  role?: string;
  isVerified: boolean;
  isEligible?: boolean;
  assignedChallenge?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Team {
  _id: string;
  name: string;
  owner: User | string | undefined;
  members?: (User | string)[] | null;
  joinRequests?: Array<{ user: User | string; createdAt: string }> | null;
  invites?: Array<{
    user: User | string;
    invitedBy: User | string;
    createdAt: string;
  }> | null;
  createdAt: string;
  updatedAt: string;
}

export interface StallsSubmission {
  _id: string;
  name: string;
  email: string;
  companyOrUniversity: string;
  productName: string;
  productDescription: string;
  phoneNumber: string;
  teamMembers: string;
  submissionDate: string;
}

export interface ChallengeSubmission {
  _id: string;
  userId: string | User;
  machineId: string;
  submittedFlag: string;
  isCorrect: boolean;
  solvedAt: string;
  createdAt: string;
}

export interface ChallengeFileSubmission {
  _id: string;
  userId: string | User;
  challengeId: string;
  files: Array<{
    originalName: string;
    filename: string;
    path: string;
    mimeType: string;
    size: number;
  }>;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
  createdAt: string;
}

// ==================== ADMIN API HOOKS ====================

// Get paginated users
export const useAdminUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["admin", "users", page, limit],
    queryFn: async () => {
      const data = await apiFetch(`/api/admin/users?page=${page}&limit=${limit}`);
      return data as {
        users: User[];
        total: number;
        page: number;
        limit: number;
      };
    },
  });
};

// Get paginated users with infinite scroll
export const useAdminUsersInfinite = (limit: number = 20, searchQuery: string = "") => {
  return useInfiniteQuery({
    queryKey: ["admin", "users", "infinite", limit, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      let url = `/api/admin/users?page=${pageParam}&limit=${limit}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const data = await apiFetch(url);
      return data as {
        users: User[];
        total: number;
        page: number;
        limit: number;
      };
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page * lastPage.limit < lastPage.total;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Get single user detail
export const useAdminUserDetail = (userId: string) => {
  return useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: async () => {
      // Fetch detailed user data from the new endpoint
      const data = await apiFetch(`/api/admin/users/${userId}`);
      return data as {
        user: User;
        team: Team | null;
        challengeSubmissions: ChallengeSubmission[];
        fileSubmissions: ChallengeFileSubmission[];
      };
    },
    enabled: !!userId,
  });
};

// Get user's challenge submissions
export const useUserChallengeSubmissions = (userId: string) => {
  return useQuery({
    queryKey: ["admin", "user", userId, "submissions"],
    queryFn: async () => {
      const data = await apiFetch(`/api/admin/users/${userId}`);
      return data.challengeSubmissions as ChallengeSubmission[];
    },
    enabled: !!userId,
  });
};

// Get user's file submissions
export const useUserFileSubmissions = (userId: string) => {
  return useQuery({
    queryKey: ["admin", "user", userId, "fileSubmissions"],
    queryFn: async () => {
      const data = await apiFetch(`/api/admin/users/${userId}`);
      return data.fileSubmissions as ChallengeFileSubmission[];
    },
    enabled: !!userId,
  });
};

// Get all teams
export const useAdminTeams = (page: number = 1, limit: number = 1000) => {
  return useQuery({
    queryKey: ["admin", "teams", page, limit],
    queryFn: async () => {
      const data = await apiFetch(`/api/teams?page=${page}&limit=${limit}`);
      return data as {
        teams: Team[];
        total: number;
        totalTeams: number;
        page: number;
        limit: number;
      };
    },
  });
};

// Get teams with infinite scroll
export const useAdminTeamsInfinite = (limit: number = 20, searchQuery: string = "") => {
  return useInfiniteQuery({
    queryKey: ["admin", "teams", "infinite", limit, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      let url = `/api/teams?page=${pageParam}&limit=${limit}`;
      const data = await apiFetch(url);
      return data as {
        teams: Team[];
        totalTeams: number;
        currentPage: number;
        totalPages: number;
        nextPage: number | null;
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    initialPageParam: 1,
  });
};

// Get team detail
export const useAdminTeamDetail = (teamId: string) => {
  return useQuery({
    queryKey: ["admin", "team", teamId],
    queryFn: async () => {
      const data = await apiFetch(`/api/teams?page=1&limit=1000`);
      const team = data.teams.find((t: Team) => t._id === teamId);
      if (!team) throw new Error("Team not found");
      return team as Team;
    },
    enabled: !!teamId,
  });
};

// Get all stalls submissions
export const useAdminStalls = () => {
  return useQuery({
    queryKey: ["admin", "stalls"],
    queryFn: async () => {
      const data = await apiFetch(`/api/stalls`);
      return data as {
        success: boolean;
        count: number;
        data: StallsSubmission[];
      };
    },
  });
};

// Get single stalls submission
export const useAdminStallDetail = (id: string) => {
  return useQuery({
    queryKey: ["admin", "stall", id],
    queryFn: async () => {
      const data = await apiFetch(`/api/stalls/${id}`);
      return data as {
        success: boolean;
        data: StallsSubmission;
      };
    },
    enabled: !!id,
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const data = await apiFetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      return data;
    },
  });
};

// Delete stalls submission mutation
export const useDeleteStall = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const data = await apiFetch(`/api/stalls/${id}`, {
        method: "DELETE",
      });
      return data;
    },
  });
};

// Get dashboard stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      // Fetch all data to calculate stats
      const [usersData, teamsData, stallsData, machinesData, challengesData] = await Promise.all([
        apiFetch(`/api/admin/users?page=1&limit=1000`),
        apiFetch(`/api/teams?page=1&limit=1000`),
        apiFetch(`/api/stalls`),
        apiFetch(`/api/admin/challenge-submissions?page=1&limit=1`),
        apiFetch(`/api/admin/file-submissions?page=1&limit=1`),
      ]);

      return {
        totalUsers: usersData.total || 0,
        totalTeams: teamsData.totalTeams || teamsData.total || 0,
        totalStalls: stallsData.count || 0,
        totalMachines: machinesData.total || 0,
        totalChallenges: challengesData.total || 0,
      };
    },
  });
};

// Get paginated challenge submissions (CTF Machines) with infinite scroll
export const useAdminChallengeSubmissionsInfinite = (limit: number = 20, searchQuery: string = "") => {
  return useInfiniteQuery({
    queryKey: ["admin", "challenge-submissions", "infinite", limit, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      let url = `/api/admin/challenge-submissions?page=${pageParam}&limit=${limit}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const data = await apiFetch(url);
      return data as {
        submissions: ChallengeSubmission[];
        total: number;
        page: number;
        limit: number;
      };
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page * lastPage.limit < lastPage.total;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Get paginated file submissions (CTF Challenges) with infinite scroll
export const useAdminFileSubmissionsInfinite = (limit: number = 20, searchQuery: string = "") => {
  return useInfiniteQuery({
    queryKey: ["admin", "file-submissions", "infinite", limit, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      let url = `/api/admin/file-submissions?page=${pageParam}&limit=${limit}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const data = await apiFetch(url);
      return data as {
        submissions: ChallengeFileSubmission[];
        total: number;
        page: number;
        limit: number;
      };
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page * lastPage.limit < lastPage.total;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
