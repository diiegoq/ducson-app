'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Alert, CircularProgress } from '@mui/material';
import { PerspectiveSelector } from '@/components/PerspectiveSelector';
import { AnalysisPerspective } from '@/lib/types';

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState('');
  const [moduleInfo, setModuleInfo] = useState({
    owner: '',
    repo: '',
    moduleId: '',
    moduleName: '',
    moduleFiles: ''
  });

  useEffect(() => {
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const moduleId = searchParams.get('moduleId');
    const moduleName = searchParams.get('moduleName');
    const moduleFiles = searchParams.get('moduleFiles');

    if (!owner || !repo || !moduleId || !moduleName || !moduleFiles) {
      setError('Missing required parameters. Please start from the home page.');
      return;
    }

    setModuleInfo({ owner, repo, moduleId, moduleName, moduleFiles });
  }, [searchParams]);

  const handlePerspectiveSelect = (perspective: AnalysisPerspective) => {
    const params = new URLSearchParams({
      owner: moduleInfo.owner,
      repo: moduleInfo.repo,
      moduleId: moduleInfo.moduleId,
      moduleName: moduleInfo.moduleName,
      moduleFiles: moduleInfo.moduleFiles,
      perspective
    });

    router.push(`/results?${params.toString()}`);
  };

  if (error) {
    return (
      <div className="container-playful" style={{ minHeight: '100vh' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Alert severity="error">
            {error}
          </Alert>
        </div>
        <button
          className="button-playful"
          onClick={() => router.push('/')}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  if (!moduleInfo.moduleName) {
    return (
      <div className="container-playful" style={{ minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <CircularProgress size={60} style={{ color: 'var(--bob-yellow-dark)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="container-playful" style={{ minHeight: '100vh' }}>
      {/* Back Button and Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          className="button-playful"
          onClick={() => router.push('/')}
          style={{ marginBottom: '1.5rem' }}
        >
          ← Back to Modules
        </button>
        
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
          Analyze: {moduleInfo.moduleName}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
          {moduleInfo.owner}/{moduleInfo.repo}
        </p>
      </div>

      <PerspectiveSelector onSelect={handlePerspectiveSelect} />
    </div>
  );
}

// Made with Bob
