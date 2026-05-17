'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!moduleInfo.moduleName) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{ mb: 2 }}
        >
          Back to Modules
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Analyze: {moduleInfo.moduleName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {moduleInfo.owner}/{moduleInfo.repo}
        </Typography>
      </Box>

      <PerspectiveSelector onSelect={handlePerspectiveSelect} />
    </Container>
  );
}