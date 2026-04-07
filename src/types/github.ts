export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    name: string;
    bio: string;
    company: string | null;
    blog: string;
    location: string;
    email: string | null;
    hireable: boolean | null;
    twitter_username: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    size: number;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    topics: string[];
    visibility: string;
    fork: boolean;
}

export interface GitHubEvent {
    id: string;
    type: string;
    actor: {
        login: string;
        avatar_url: string;
    };
    repo: {
        name: string;
        url: string;
    };
    created_at: string;
    payload: unknown;
}

export interface LanguageStats {
    [key: string]: number;
}

export interface GitHubData {
    user: GitHubUser | null;
    repos: GitHubRepo[];
    events: GitHubEvent[];
    languageStats: LanguageStats;
    totalStars: number;
    totalForks: number;
    topRepo?: GitHubRepo;
}
