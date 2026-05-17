import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function getFileContent(owner: string, repo: string, path: string): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if ('content' in data) {
      return Buffer.from(data.content, 'base64').toString();
    }
  } catch {
    return null;
  }
  return null;
}

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
    
    const packageJson = await getFileContent(owner, repo, 'package.json');
    
    const readmeFiles = ['README.md', 'README.MD', 'readme.md', 'Readme.md'];
    let readme = null;
    for (const readmeFile of readmeFiles) {
      readme = await getFileContent(owner, repo, readmeFile);
      if (readme) break;
    }
    
    const databaseFiles: { path: string; content: string }[] = [];
    const dbPatterns = [
      'schema.prisma',
      'prisma/schema.prisma',
      'database/schema.prisma'
    ];
    
    for (const pattern of dbPatterns) {
      const content = await getFileContent(owner, repo, pattern);
      if (content) {
        databaseFiles.push({ path: pattern, content });
      }
    }
    
    const modelFiles = files.filter(f =>
      f.match(/\/(models|entities|schemas)\/.*\.(ts|js)$/i) ||
      f.match(/\.model\.(ts|js)$/i) ||
      f.match(/\.entity\.(ts|js)$/i) ||
      f.match(/\.schema\.(ts|js)$/i)
    ).slice(0, 5);
    
    for (const modelFile of modelFiles) {
      const content = await getFileContent(owner, repo, modelFile);
      if (content) {
        databaseFiles.push({ path: modelFile, content: content.slice(0, 3000) });
      }
    }
    
    const configFiles: { path: string; content: string }[] = [];
    const configPatterns = [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'next.config.ts',
      'vite.config.js',
      'vite.config.ts',
      'webpack.config.js'
    ];
    
    for (const pattern of configPatterns) {
      const content = await getFileContent(owner, repo, pattern);
      if (content) {
        configFiles.push({ path: pattern, content: content.slice(0, 2000) });
      }
    }
    
    return {
      repoData,
      files,
      packageJson,
      readme,
      databaseFiles,
      configFiles
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