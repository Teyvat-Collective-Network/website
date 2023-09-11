export type User = {
    id: string;
    tag: string;
    guilds: Record<string, string[]>;
    roles: string[];
    observer: boolean;
    owner: boolean;
    advisor: boolean;
    voter: boolean;
    council: boolean;
    staff: boolean;
};
