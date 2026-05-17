import { NextResponse } from 'next/server';
import { getRepoOverview } from '@/lib/github';

export async function POST(request: Request) {
  try {
    const { owner, repo } = await request.json();
    
    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing owner or repo parameter' },
        { status: 400 }
      );
    }
    
    const { repoData, files, packageJson } = await getRepoOverview(owner, repo);
    
    const mockModules = [
      {
        id: 'core-module',
        name: 'Core Module',
        description: 'Main application logic and core functionality',
        files: files.filter(f => f.includes('src/') || f.includes('lib/')).slice(0, 15),
        fileCount: files.filter(f => f.includes('src/') || f.includes('lib/')).length
      },
      {
        id: 'api-module',
        name: 'API Module',
        description: 'API routes and backend services',
        files: files.filter(f => f.includes('api/')).slice(0, 15),
        fileCount: files.filter(f => f.includes('api/')).length
      },
      {
        id: 'ui-module',
        name: 'UI Module',
        description: 'User interface components and pages',
        files: files.filter(f => f.includes('components/') || f.includes('pages/')).slice(0, 15),
        fileCount: files.filter(f => f.includes('components/') || f.includes('pages/')).length
      }
    ].filter(m => m.fileCount > 0);
    
    return NextResponse.json({
      repository: {
        owner,
        repo,
        description: repoData.description || 'No description available'
      },
      modules: mockModules,
      totalFiles: files.length,
      hasPackageJson: !!packageJson
    });
  } catch (error: any) {
    console.error('Overview API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze repository' },
      { status: 500 }
    );
  }
}