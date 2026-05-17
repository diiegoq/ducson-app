import { NextResponse } from 'next/server';
import { getFileContents } from '@/lib/github';
import { analyzeModule } from '@/lib/llm';
import { DEFAULT_TEAM, AnalysisPerspective, PERSPECTIVES } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { owner, repo, module, perspective } = await request.json();
    
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
    
    const selectedPerspective: AnalysisPerspective = perspective || 'technical-debt';
    
    if (perspective && !PERSPECTIVES[perspective as AnalysisPerspective]) {
      return NextResponse.json(
        { error: `Invalid perspective: ${perspective}. Valid perspectives: ${Object.keys(PERSPECTIVES).join(', ')}` },
        { status: 400 }
      );
    }
    
    const files = await getFileContents(owner, repo, module.files);
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files could be fetched from the module' },
        { status: 404 }
      );
    }
    
    const perspectiveInfo = PERSPECTIVES[selectedPerspective];
    const team = perspectiveInfo.team;
    
    const analysis = await analyzeModule(module.name, files, team, selectedPerspective);
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Module analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Module analysis failed' },
      { status: 500 }
    );
  }
}