import { NextResponse } from 'next/server';
import { getRepoOverview } from '@/lib/github';
import { analyzeOverview, analyzeArchitecture, analyzeDatabaseSchema, analyzeReadme } from '@/lib/llm';

export async function POST(request: Request) {
  try {
    const { owner, repo } = await request.json();
    
    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing owner or repo parameter' },
        { status: 400 }
      );
    }
    
    const { repoData, files, packageJson, readme, databaseFiles, configFiles } = await getRepoOverview(owner, repo);
    
    const [moduleAnalysis, architectureAnalysis, databaseSchema, readmeAnalysis] = await Promise.all([
      analyzeOverview(repoData, files, packageJson),
      analyzeArchitecture(repoData, files, configFiles, readme),
      analyzeDatabaseSchema(databaseFiles),
      analyzeReadme(readme)
    ]);
    
    const fileTreeAnalysis = {
      tree: {
        name: repo,
        path: '/',
        type: 'directory' as const,
        children: []
      },
      statistics: {
        totalFiles: files.length,
        totalDirectories: 0,
        totalLines: 0,
        languageBreakdown: architectureAnalysis.techStack.languages
      },
      criticalFiles: configFiles.map(f => f.path),
      configFiles: configFiles.map(f => f.path)
    };
    
    return NextResponse.json({
      repository: {
        owner,
        repo,
        description: repoData.description || 'No description available',
        language: repoData.language,
        stars: repoData.stargazers_count,
        url: repoData.html_url
      },
      modules: moduleAnalysis.modules,
      totalFiles: files.length,
      hasPackageJson: !!packageJson,
      architecture: architectureAnalysis.architecture,
      fileTree: fileTreeAnalysis,
      database: databaseSchema,
      techStack: architectureAnalysis.techStack,
      readme: readmeAnalysis
    });
  } catch (error: any) {
    console.error('Overview API error:', error);
    
    let errorMessage = 'Failed to analyze repository';
    let statusCode = 500;
    
    if (error.message.includes('not found')) {
      errorMessage = error.message;
      statusCode = 404;
    } else if (error.message.includes('rate limit')) {
      errorMessage = error.message;
      statusCode = 429;
    } else if (error.message.includes('parse')) {
      errorMessage = 'AI analysis failed. Please try again.';
      statusCode = 500;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}