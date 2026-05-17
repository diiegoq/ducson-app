'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack
} from '@mui/material';
import {
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  BugReport as BugIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Build as BuildIcon,
  Star as StarIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { Ticket } from '@/lib/types';

export default function Results() {
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moduleInfo, setModuleInfo] = useState({
    owner: '',
    repo: '',
    moduleName: ''
  });

  useEffect(() => {
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const moduleId = searchParams.get('moduleId');
    const moduleName = searchParams.get('moduleName');
    const moduleFilesStr = searchParams.get('moduleFiles');

    if (!owner || !repo || !moduleId || !moduleName || !moduleFilesStr) {
      setError('Missing required parameters. Please start from the home page.');
      setLoading(false);
      return;
    }

    setModuleInfo({ owner, repo, moduleName });

    let moduleFiles: string[] = [];
    try {
      moduleFiles = JSON.parse(moduleFilesStr);
    } catch {
      setError('Invalid module files data');
      setLoading(false);
      return;
    }

    // Fetch module analysis
    fetch('/api/module', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner,
        repo,
        module: {
          id: moduleId,
          name: moduleName,
          files: moduleFiles
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to analyze module');
        setLoading(false);
      });
  }, [searchParams]);

  const exportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Assigned To', 'Description', 'Files', 'Actions'];
    const rows = tickets.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.priority,
      t.assignedTeamMember,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.files.join('; ')}"`,
      `"${t.actions.join('; ')}"`
    ]);

    const csv = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `curious-bob-tickets-${moduleInfo.moduleName.toLowerCase().replace(/\s+/g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'bug': return <BugIcon />;
      case 'security': return <SecurityIcon />;
      case 'performance': return <SpeedIcon />;
      case 'technical debt': return <BuildIcon />;
      case 'feature': return <StarIcon />;
      case 'documentation': return <DescriptionIcon />;
      default: return <BuildIcon />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }} color="text.secondary">
            Analyzing {moduleInfo.moduleName}...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
            This may take 30-60 seconds
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.location.href = '/'}
          sx={{ mb: 2 }}
        >
          Back to Modules
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {moduleInfo.moduleName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {moduleInfo.owner}/{moduleInfo.repo}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportCSV}
            disabled={tickets.length === 0}
            size="large"
          >
            Export CSV
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} generated
        </Typography>
      </Box>

      <Stack spacing={3}>
        {tickets.map((ticket) => (
          <Card key={ticket.id} elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getCategoryIcon(ticket.category)}
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {ticket.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ticket.id}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={ticket.priority}
                    color={getPriorityColor(ticket.priority)}
                    size="small"
                  />
                  <Chip
                    label={ticket.category}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {ticket.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Assigned To
                </Typography>
                <Chip label={ticket.assignedTeamMember} color="primary" variant="outlined" />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Affected Files
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {ticket.files.map((file, index) => (
                    <Chip
                      key={index}
                      label={file}
                      size="small"
                      variant="outlined"
                      sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Suggested Actions
                </Typography>
                <List dense disablePadding>
                  {ticket.actions.map((action, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText
                        primary={`${index + 1}. ${action}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {tickets.length === 0 && (
        <Alert severity="info">
          No tickets were generated for this module. This might indicate a well-maintained codebase or insufficient context.
        </Alert>
      )}
    </Container>
  );
}