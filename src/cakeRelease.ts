import * as core from '@actions/core';
import * as http from '@actions/http-client';

const latestReleaseUrl = 'https://api.github.com/repos/cake-build/cake/releases/latest';

export async function getLatestVersion(token?: string): Promise<string | null> {
  const release = await getLatestCakeReleaseFromGitHub(token);
  return extractVersionNumber(release);
}

async function getLatestCakeReleaseFromGitHub(token?: string): Promise<GitHubRelease | null> {
  try {
    return await requestLatestRelease(token);
  } catch (error) {
    // The token may not be valid for github.com (e.g. on GitHub Enterprise Server),
    // in which case we fall back to an anonymous request.
    if (token && getStatusCode(error) === http.HttpCodes.Unauthorized) {
      return getLatestCakeReleaseFromGitHub();
    }

    core.warning(`Could not determine the latest version of Cake. ${describeError(error)}`);
    return null;
  }
}

async function requestLatestRelease(token?: string): Promise<GitHubRelease | null> {
  const client = new http.HttpClient('cake-build/cake-action');
  const headers = {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await client.getJson<GitHubRelease>(latestReleaseUrl, headers);

  if (response.statusCode != 200) {
    core.warning(
      `Could not determine the latest version of Cake. GitHub returned status code ${response.statusCode}`
    );
    return null;
  }

  return response.result;
}

function getStatusCode(error: unknown): number | undefined {
  return error instanceof http.HttpClientError ? error.statusCode : undefined;
}

function describeError(error: unknown): string {
  if (error instanceof http.HttpClientError) {
    return `GitHub returned status code ${error.statusCode}: ${error.message}`;
  }
  return error instanceof Error ? error.message : String(error);
}

function extractVersionNumber(release: GitHubRelease | null): string | null {
  return release?.tag_name?.replace(/^v/, '') || null;
}

interface GitHubRelease {
  tag_name: string;
}
