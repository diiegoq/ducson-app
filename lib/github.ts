import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function getRepoOverview(owner: string, repo: string) {
  try {
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: repoData.default_branch,
      recursive: 'true'
    });
    
    const files = treeData.tree
      .filter(item => item.type === 'blob')
      .filter(item => !item.path?.includes('node_modules'))
      .filter(item => !item.path?.includes('.git/'))
      .filter(item => !item.path?.match(/\.(jpg|jpeg|png|gif|svg|ico|pdf|zip|tar|gz|exe|dll|so|dylib)$/i))
      .map(item => item.path)
      .filter((path): path is string => path !== undefined);
    
    let packageJson = null;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: 'package.json'
      });
      if ('content' in data) {
        packageJson = Buffer.from(data.content, 'base64').toString();
      }
    } catch {
      // package.json doesn't exist, that's okay
    }
    
    return { 
      repoData, 
      files, 
      packageJson 
    };
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error('Repository not found. Please check the URL and ensure the repository is public.');
    }
    if (error.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later or add a GITHUB_TOKEN.');
    }
    throw new Error(`GitHub API error: ${error.message}`);
  }
}

export async function getFileContents(owner: string, repo: string, paths: string[]) {
  const contents = await Promise.all(
    paths.slice(0, 20).map(async path => {
      try {
        const { data } = await octokit.repos.getContent({ owner, repo, path });
        if ('content' in data) {
          const content = Buffer.from(data.content, 'base64').toString();
          const truncatedContent = content.length > 5000 
            ? content.slice(0, 5000) + '\n... (truncated)'
            : content;
          return {
            path,
            content: truncatedContent
          };
        }
      } catch {
        // File couldn't be fetched, skip it
      }
      return null;
    })
  );
  return contents.filter((item): item is { path: string; content: string } => item !== null);
}