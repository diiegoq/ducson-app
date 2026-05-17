'use client';
import { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, IconButton, Alert } from '@mui/material';
import { Fullscreen as FullscreenIcon, Close as CloseIcon } from '@mui/icons-material';

interface MermaidDiagramProps {
  content: string;
  description?: string;
  title?: string;
}

export default function MermaidDiagram({ content, description, title }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  useEffect(() => {
    const loadMermaid = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit'
        });
        setMermaidLoaded(true);
      } catch (err) {
        setError('Failed to load diagram renderer');
        console.error('Mermaid load error:', err);
      }
    };

    loadMermaid();
  }, []);

  useEffect(() => {
    if (!mermaidLoaded || !containerRef.current || !content) return;

    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          
          const { svg } = await mermaid.render(id, content);
          
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        }
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to render diagram');
        console.error('Mermaid render error:', err);
      }
    };

    renderDiagram();
  }, [content, mermaidLoaded]);

  if (!content) {
    return null;
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const diagramContent = (
    <Paper 
      elevation={isFullscreen ? 0 : 2}
      sx={{ 
        p: 3,
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 'auto',
        width: isFullscreen ? '100vw' : 'auto',
        height: isFullscreen ? '100vh' : 'auto',
        overflow: isFullscreen ? 'auto' : 'visible',
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {title && (
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        )}
        <Box sx={{ ml: 'auto' }}>
          <IconButton onClick={handleFullscreen} size="small">
            {isFullscreen ? <CloseIcon /> : <FullscreenIcon />}
          </IconButton>
        </Box>
      </Box>

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <Box
          ref={containerRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
            '& svg': {
              maxWidth: '100%',
              height: 'auto'
            }
          }}
        />
      )}
    </Paper>
  );

  return diagramContent;
}