import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function analyzeOverview(repoData: any, files: string[], packageJson: string) {
  return {
    message: 'LLM client - to be implemented'
  };
}

export async function analyzeModule(moduleName: string, files: any[], team: string[]) {
  return {
    message: 'LLM module analysis - to be implemented'
  };
}