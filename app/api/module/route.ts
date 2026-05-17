import { NextResponse } from 'next/server';
import { getFileContents } from '@/lib/github';
import { analyzeModule } from '@/lib/llm';
import { DEFAULT_TEAM } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { owner, repo, module } = await request.json();
    
    // Validate input
    if (!owner || !repo || !module) {
      return NextResponse.json(
        { error: 'Missing required fields: owner, repo, module' },
        { status: 400 }
      );
    }
    
    if (!module.files || !Array.isArray(module.files)) {
      return NextResponse.json(
        { error: 'Module must include files array' },
        { status: 400 }
      );
    }
    
    // Fetch file contents (max 20 files)
    const files = await getFileContents(owner, repo, module.files);
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files could be fetched from the module' },
        { status: 404 }
      );
    }
    
    // Analyze module with LLM
    const analysis = await analyzeModule(module.name, files, DEFAULT_TEAM);
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Module analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Module analysis failed' },
      { status: 500 }
    );
  }
}