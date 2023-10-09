export type User = {
    id: string;
    tag: string;
    guilds: Record<string, { owner: boolean; advisor: boolean; voter: boolean; staff: boolean; council: boolean; roles: string[] }>;
    roles: string[];
    observer: boolean;
    owner: boolean;
    advisor: boolean;
    voter: boolean;
    council: boolean;
    staff: boolean;
    observerSince: number;
};

export type Role = { id: string; description: string; assignment: string };

export type Guild = {
    id: string;
    name: string;
    mascot: string;
    invite: string;
    owner: string;
    advisor: string | null;
    voter: string;
    delegated: boolean;
    users: Record<string, { staff: boolean; roles: string[] }>;
};

export type Attribute = { name: string; emoji: string };
export type Character = { id: string; name: string; short?: string; attributes: Record<string, string> };
export type CalendarEvent = { id: number; owner: string; start: number; end: number; title: string; body: string; invites: string[] };

export type TCNDoc = {
    id: string;
    official: boolean;
    deleted: boolean;
    author: string;
    anon: boolean;
    allowCouncil: boolean;
    allowEveryone: boolean;
    allowLoggedIn: boolean;
    allowlist: string[];
    title: string;
    body: string;
    embedTitle: string;
    embedBody: string;
    embedColor: number;
    embedImage: string;
    embedThumbnail: boolean;
};

export type AuditLogEntry = {
    hidden: boolean;
    uuid: number;
    time: number;
    user: string;
    token: string;
    action: string;
    data: any;
    reason: string | null;
};

export type ObservationRecord = {
    uuid: number;
    id: string;
    hidden: boolean;
    name: string | null;
    observer: string | null;
    start: number | null;
    end: number | null;
    status: string;
    notes: string;
};

export type ElectionHistoryRecord = { id: string; status: string; rerunning: boolean };

export type Poll = {
    id: number;
    message: string;
    close: number;
    closed: boolean;
    duration: number;
    dm: boolean;
    live: boolean;
    restricted: boolean;
    quorum: number;
} & (
    | { mode: "proposal"; question: string }
    | { mode: "induction"; preinduct: boolean; server: string }
    | { mode: "election"; wave: number; seats: number; candidates: string[] }
    | { mode: "selection"; question: string; min: number; max: number; options: string[] }
);

export type PollVote = {
    poll: number;
    user: string;
    mode: string;
    abstain: boolean;
    yes: boolean;
    verdict: string;
    candidates: Record<string, number>;
    selected: string[];
};

export type PollResults = {
    mode: string;
    abstains: number;
    votes: number;
    ballots: number;
    turnout: number;
    yes: number;
    no: number;
    induct: number;
    preinduct: number;
    reject: number;
    extend: number;
    winners: string[];
    tied: string[];
    scores: Record<string, number>;
};

export type Rolesync = {
    roleToStaff: string[];
    staffToRole: string[];
    roleToApi: Record<string, string[]>;
    apiToRole: Record<string, string[]>;
};
