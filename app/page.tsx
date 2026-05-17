'use client';
import { useState } from 'react';
import { CircularProgress, Alert } from '@mui/material';
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
  
  const tabs = [
    { id: 0, label: 'Modules', icon: '📁' },
    { id: 1, label: 'Architecture', icon: '🏗️' },
    { id: 2, label: 'Database', icon: '💾' },
    { id: 3, label: 'Tech Stack', icon: '⚙️' }
  ];
  
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section - Full Width */}
      <div style={{
        background: 'linear-gradient(180deg, var(--bob-yellow-light) 0%, var(--background-primary) 100%)',
        padding: '3rem 1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            Curious Bob
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Your Friendly Repository Guide
          </p>
          
          {/* URL Input and Button */}
          <div style={{ display: 'flex', gap: '1rem', maxWidth: '800px', margin: '0 auto', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input-playful"
            placeholder="🔗 Paste GitHub URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            style={{ flex: 1, minWidth: '300px' }}
          />
          <button
            className="button-playful button-playful-large"
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Repository'}
          </button>
        </div>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="container-playful">
        {/* Error Alert */}
        {error && (
          <div style={{ marginBottom: '2rem' }}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </div>
      )}
      
      {/* Repository Info Card */}
      {repoInfo && (
        <div className="card-playful-peach" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                {repoInfo.owner}/{repoInfo.repo}
              </h2>
              {repoInfo.description && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {repoInfo.description}
                </p>
              )}
            </div>
            <div style={{ 
              background: 'white', 
              padding: '8px 16px', 
              borderRadius: '12px',
              border: '2px solid var(--bob-brown-light)',
              fontWeight: 600
            }}>
              {repoInfo.stars.toLocaleString()} stars
            </div>
          </div>

          {overviewData?.readme && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'rgba(255, 255, 255, 0.5)', 
              borderRadius: '12px',
              border: '2px solid var(--bob-brown-light)'
            }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                {overviewData.readme.summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tabs and Content */}
      {overviewData && (
        <div style={{ marginBottom: '2rem' }}>
          {/* Tab Navigation */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '-2px',
            flexWrap: 'wrap',
            borderBottom: '3px solid var(--bob-brown-light)'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-playful ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ border: '3px solid var(--bob-brown-light)', borderBottom: 'none' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ paddingTop: '2rem' }}>
            {activeTab === 0 && modules.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
                  Detected Modules ({modules.length})
                </h2>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {modules.map(module => (
                    <div key={module.id} className="card-playful-mint">
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                        {module.name}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '3rem' }}>
                        {module.description}
                      </p>
                      <div style={{ 
                        display: 'inline-block',
                        background: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        border: '2px solid var(--bob-brown-light)'
                      }}>
                        {module.fileCount} files
                      </div>
                      <button
                        className="button-playful"
                        style={{ width: '100%' }}
                        onClick={() => {
                          const params = new URLSearchParams({
                            owner: repoInfo?.owner || '',
                            repo: repoInfo?.repo || '',
                            moduleId: module.id,
                            moduleName: module.name,
                            moduleFiles: JSON.stringify(module.files)
                          });
                          window.location.href = `/analyze?${params.toString()}`;
                        }}
                      >
                        Analyze Module
                      </button>
                    </div>
                  ))}
                </div>
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
          </div>
        </div>
      )}
      
        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <CircularProgress size={60} style={{ color: 'var(--bob-yellow-dark)' }} />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
              Analyzing repository structure...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}