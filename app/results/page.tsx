'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CircularProgress, Alert } from '@mui/material';
import { Ticket, AnalysisPerspective, PERSPECTIVES, PerspectiveInsights as PerspectiveInsightsType } from '@/lib/types';
import { PerspectiveInsights } from '@/components/PerspectiveInsights';

export default function Results() {
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [perspective, setPerspective] = useState<AnalysisPerspective>('technical-debt');
  const [perspectiveInsights, setPerspectiveInsights] = useState<PerspectiveInsightsType | null>(null);
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
    const perspectiveParam = searchParams.get('perspective') as AnalysisPerspective;

    if (!owner || !repo || !moduleId || !moduleName || !moduleFilesStr) {
      setError('Missing required parameters. Please start from the home page.');
      setLoading(false);
      return;
    }

    setModuleInfo({ owner, repo, moduleName });
    
    const selectedPerspective = perspectiveParam || 'technical-debt';
    setPerspective(selectedPerspective);

    let moduleFiles: string[] = [];
    try {
      moduleFiles = JSON.parse(moduleFilesStr);
    } catch {
      setError('Invalid module files data');
      setLoading(false);
      return;
    }

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
        },
        perspective: selectedPerspective
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setTickets(data.tickets || []);
        setPerspectiveInsights(data.perspectiveInsights || null);
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

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  if (loading) {
    return (
      <div className="container-playful" style={{ minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <CircularProgress size={60} style={{ color: 'var(--bob-yellow-dark)' }} />
          <h2 style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
            Analyzing {moduleInfo.moduleName}...
          </h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            This may take 30-60 seconds
          </p>
        </div>
      </div>
    );
  }

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
          onClick={() => window.location.href = '/'}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const perspectiveInfo = PERSPECTIVES[perspective];

  return (
    <div className="container-playful" style={{ minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          className="button-playful"
          onClick={() => window.location.href = '/'}
          style={{ marginBottom: '1.5rem' }}
        >
          ← Back
        </button>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2.25rem', margin: 0 }}>
              {moduleInfo.moduleName}
            </h1>
            <span style={{
              background: 'var(--bob-sky)',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '2px solid var(--bob-brown-light)',
              color: 'var(--bob-brown-dark)'
            }}>
              {perspectiveInfo.name}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            {moduleInfo.owner}/{moduleInfo.repo}
          </p>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Perspective Insights */}
      {perspectiveInsights && (
        <div style={{ marginBottom: '2rem' }}>
          <PerspectiveInsights perspective={perspective} insights={perspectiveInsights} />
        </div>
      )}

      {/* Tickets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {tickets.map((ticket) => (
          <div key={ticket.id} className="card-playful-lavender">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                  {ticket.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {ticket.id}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className={getPriorityBadgeClass(ticket.priority)}>
                  {ticket.priority}
                </span>
                <span style={{
                  background: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '2px solid var(--bob-brown-light)',
                  color: 'var(--text-primary)'
                }}>
                  {ticket.category}
                </span>
              </div>
            </div>

            <p style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              {ticket.description}
            </p>

            <div style={{ 
              borderTop: '2px solid var(--bob-brown-light)', 
              paddingTop: '1rem',
              marginBottom: '1rem'
            }}>
              <p style={{ 
                fontSize: '0.875rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem',
                color: 'var(--bob-brown-dark)'
              }}>
                Assigned to:
              </p>
              <span style={{
                background: 'white',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '2px solid var(--bob-brown-light)',
                color: 'var(--text-primary)',
                display: 'inline-block'
              }}>
                {ticket.assignedTeamMember}
              </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ 
                fontSize: '0.875rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem',
                color: 'var(--bob-brown-dark)'
              }}>
                Files:
              </p>
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary)',
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}>
                {ticket.files.join(', ')}
              </p>
            </div>

            <div>
              <p style={{ 
                fontSize: '0.875rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem',
                color: 'var(--bob-brown-dark)'
              }}>
                Actions:
              </p>
              <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {ticket.actions.map((action, index) => (
                  <li key={index} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {action}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {/* No Tickets Message */}
      {tickets.length === 0 && (
        <Alert severity="info" style={{ marginBottom: '2rem' }}>
          No tickets were generated for this module. This might indicate a well-maintained codebase or insufficient context.
        </Alert>
      )}

      {/* Export CSV Button - Centered at Bottom */}
      {tickets.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem', paddingBottom: '3rem' }}>
          <button
            className="button-playful button-playful-large"
            onClick={exportCSV}
            style={{ minWidth: '300px' }}
          >
            📥 Export All Tickets
          </button>
        </div>
      )}
    </div>
  );
}