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
  Chip,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { GitHub as GitHubIcon, Folder as FolderIcon, Architecture as ArchitectureIcon, Storage as StorageIcon, Code as CodeIcon } from '@mui/icons-material';
import ArchitectureSection from '@/components/ArchitectureSection';
import DatabaseSection from '@/components/DatabaseSection';
import TechStackSection from '@/components/TechStackSection';
import { EnhancedOverviewResponse } from '@/lib/types';

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
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string; description: string; stars: number } | null>(null);
  const [overviewData, setOverviewData] = useState<EnhancedOverviewResponse | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const handleAnalyze = async () => {
    setError('');
    setModules([]);
    setRepoInfo(null);
    setOverviewData(null);
    setActiveTab(0);
    
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
      setOverviewData(data);
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
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
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
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" gutterBottom>
                {repoInfo.owner}/{repoInfo.repo}
              </Typography>
              {repoInfo.description && (
                <Typography variant="body1" color="text.secondary">
                  {repoInfo.description}
                </Typography>
              )}
            </Box>
            <Chip
              icon={<GitHubIcon />}
              label={`⭐ ${repoInfo.stars.toLocaleString()}`}
              variant="outlined"
            />
          </Box>

          {overviewData?.readme && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {overviewData.readme.summary}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {overviewData && (
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab icon={<FolderIcon />} label="Modules" />
            <Tab icon={<ArchitectureIcon />} label="Architecture" />
            <Tab icon={<StorageIcon />} label="Database" />
            <Tab icon={<CodeIcon />} label="Tech Stack" />
          </Tabs>

          {activeTab === 0 && modules.length > 0 && (
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

          {activeTab === 1 && overviewData.architecture && (
            <ArchitectureSection architecture={overviewData.architecture} />
          )}

          {activeTab === 2 && overviewData.database && (
            <DatabaseSection database={overviewData.database} />
          )}

          {activeTab === 3 && overviewData.techStack && (
            <TechStackSection techStack={overviewData.techStack} />
          )}
        </Box>
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