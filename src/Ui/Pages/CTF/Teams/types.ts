export type BasicUser = {
  _id: string;
  username: string;
  email?: string;
};

export type Team = {
  _id: string;
  name: string;
  owner: BasicUser;
  members: BasicUser[];
  status: "Open" | "Full" | "Pending Requests";
  counts: {
    members: number;
    joinRequests: number;
    invites: number;
  };
  viewer: {
    isMember: boolean;
    isOwner: boolean;
    hasPendingJoinRequest: boolean;
    hasInvite: boolean;
  };
};

export type TeamInvite = {
  team: { _id: string; name: string; owner: BasicUser };
  invitedBy: BasicUser;
  createdAt: string;
  teamMemberCount: number;
};

export type JoinRequest = {
  user: BasicUser;
  createdAt: string;
};