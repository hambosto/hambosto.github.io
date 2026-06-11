import type { GitHubUser, GitHubRepo, GitHubEvent } from "../types/github";

const GITHUB_API_BASE = "https://api.github.com";

interface FetchOptions {
  token?: string;
}

export const fetchGitHubUser = async (
  username: string,
  options?: FetchOptions,
): Promise<GitHubUser> => {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (options?.token) {
    headers["Authorization"] = `token ${options.token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json();
};

export const fetchGitHubRepos = async (
  username: string,
  options?: FetchOptions,
): Promise<GitHubRepo[]> => {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (options?.token) {
    headers["Authorization"] = `token ${options.token}`;
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repos: ${response.statusText}`);
  }

  return response.json();
};

export const fetchGitHubEvents = async (
  username: string,
  options?: FetchOptions,
): Promise<GitHubEvent[]> => {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (options?.token) {
    headers["Authorization"] = `token ${options.token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}/users/${username}/events/public`, { headers });

  if (!response.ok) {
    // Events endpoint can fail gracefully
    return [];
  }

  return response.json();
};
