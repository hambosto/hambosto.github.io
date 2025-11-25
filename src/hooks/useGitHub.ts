import { useState, useEffect, useCallback } from 'react';
import type { GitHubData, GitHubRepo, LanguageStats } from '../types/github';
import { fetchGitHubUser, fetchGitHubRepos, fetchGitHubEvents } from '../utils/api';

interface UseGitHubReturn {
    data: GitHubData | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const calculateLanguageStats = (repos: GitHubRepo[]): LanguageStats => {
    const stats: LanguageStats = {};
    repos.forEach((repo) => {
        if (repo.language) {
            stats[repo.language] = (stats[repo.language] || 0) + 1;
        }
    });
    return stats;
};

export const useGitHub = (username: string, token?: string): UseGitHubReturn => {
    const [data, setData] = useState<GitHubData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchGitHubData = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const options = { token };

            // Fetch user data
            const user = await fetchGitHubUser(username, options);

            // Fetch repositories
            const allRepos = await fetchGitHubRepos(username, options);

            // Filter out forks
            const repos = allRepos.filter((repo) => !repo.fork);

            // Fetch events
            const events = await fetchGitHubEvents(username, options);

            // Calculate language stats and total stars
            const languageStats = calculateLanguageStats(repos);
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

            setData({
                user,
                repos,
                events,
                languageStats,
                totalStars,
            });
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [username, token]);

    useEffect(() => {
        fetchGitHubData();
    }, [fetchGitHubData]);

    return { data, loading, error, refetch: fetchGitHubData };
};
