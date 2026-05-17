'use client';
import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { GitHub as GitHubIcon, Folder as FolderIcon } from '@mui/icons-material';

interface Module {
  id: string;
  name: string;
  description: string;
  files: string[];
  fileCount: number;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string; description: string } | null>(null);
  
  const handleAnalyze = async () => {
    setError('');
    setModules([]);
    setRepoInfo(null);
    
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      setError('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
      return;
    }
    
    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, '');
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo: cleanRepo })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed');
      }
      
      setModules(data.modules || []);
      setRepoInfo(data.repository || null);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleAnalyze();
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Curious Bob
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          AI-powered repository analysis and ticket generation
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="https://github.com/vercel/next.js"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          disabled={loading}
          InputProps={{
            startAdornment: <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        <Button
          variant="contained"
          onClick={handleAnalyze}
          disabled={loading || !url.trim()}
          sx={{ minWidth: 140, height: 56 }}
          size="large"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {repoInfo && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {repoInfo.owner}/{repoInfo.repo}
          </Typography>
          {repoInfo.description && (
            <Typography variant="body1" color="text.secondary">
              {repoInfo.description}
            </Typography>
          )}
        </Box>
      )}
      
      {modules.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Detected Modules ({modules.length})
          </Typography>
          <Grid container spacing={3}>
            {modules.map(module => (
              <Grid item xs={12} sm={6} md={4} key={module.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h3">
                        {module.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {module.description}
                    </Typography>
                    <Chip 
                      label={`${module.fileCount} files`} 
                      size="small" 
                      variant="outlined"
                    />
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        const params = new URLSearchParams({
                          owner: repoInfo?.owner || '',
                          repo: repoInfo?.repo || '',
                          moduleId: module.id,
                          moduleName: module.name,
                          moduleFiles: JSON.stringify(module.files)
                        });
                        window.location.href = `/results?${params.toString()}`;
                      }}
                    >
                      Analyze Module
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
            Analyzing repository structure...
          </Typography>
        </Box>
      )}
    </Container>
  );
}