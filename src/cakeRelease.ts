import * as http from '@actions/http-client';

export async function getLatestVersion(): Promise<string | null> {
  const release = await getLatestCakeReleaseFromGitHub();
  return extractVersionNumber(release);
}

async function getLatestCakeReleaseFromGitHub(): Promise<GitHubRelease | null> {
  const client = new http.HttpClient('cake-build/cake-action');
  const response = await client.getJson<GitHubRelease>('https://api.github.com/repos/cake-build/cake/releases/latest');

  if (response.statusCode != 200) {
    console.log(`Could not determine the latest version of Cake. GitHub returned status code ${response.statusCode}`);
    return null;
  }

  return response.result;
}

function extractVersionNumber(release: GitHubRelease | null): string | null {
  return release?.tag_name?.replace(/^v/, '') || null;
}

interface GitHubRelease {
  tag_name: string;
}
