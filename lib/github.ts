import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function getRepoOverview(owner: string, repo: string) {
  return {
    message: 'GitHub client - to be implemented'
  };
}

export async function getFileContents(owner: string, repo: string, paths: string[]) {
  return [];
}