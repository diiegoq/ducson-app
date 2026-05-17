'use client';
import { Box, Typography, Chip, Grid, Paper } from '@mui/material';
import MermaidDiagram from './MermaidDiagram';
import { ArchitectureAnalysis } from '@/lib/types';

interface ArchitectureSectionProps {
  architecture: ArchitectureAnalysis;
}

export default function ArchitectureSection({ architecture }: ArchitectureSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        System Architecture
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MermaidDiagram
            content={architecture.diagram.content}
            description={architecture.diagram.description}
            title="Architecture Diagram"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pattern
            </Typography>
            <Chip 
              label={architecture.pattern} 
              color="primary" 
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Components ({architecture.components.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {architecture.components.map((component) => (
                <Chip
                  key={component.id}
                  label={component.name}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Entry Points ({architecture.entryPoints.length})
            </Typography>
            {architecture.entryPoints.map((entry, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  {entry.file}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {entry.type} • {entry.description}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Component Details
            </Typography>
            <Grid container spacing={2}>
              {architecture.components.map((component) => (
                <Grid item xs={12} sm={6} md={4} key={component.id}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {component.name}
                    </Typography>
                    <Chip 
                      label={component.type} 
                      size="small" 
                      sx={{ my: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {component.description}
                    </Typography>
                    {component.dependencies.length > 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Dependencies: {component.dependencies.join(', ')}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

// Made with Bob
