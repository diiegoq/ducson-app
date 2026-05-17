'use client';
import { Box, Typography, Chip, Grid, Paper, Alert } from '@mui/material';
import MermaidDiagram from './MermaidDiagram';
import { DatabaseSchema } from '@/lib/types';

interface DatabaseSectionProps {
  database: DatabaseSchema;
}

export default function DatabaseSection({ database }: DatabaseSectionProps) {
  if (database.type === 'none') {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Database Schema
        </Typography>
        <Alert severity="info">
          No database schema detected in this repository.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Database Schema
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Type
                </Typography>
                <Chip label={database.type.toUpperCase()} color="primary" size="small" />
              </Box>
              {database.provider && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Provider
                  </Typography>
                  <Chip label={database.provider} variant="outlined" size="small" />
                </Box>
              )}
              {database.orm && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    ORM
                  </Typography>
                  <Chip label={database.orm} variant="outlined" size="small" />
                </Box>
              )}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Models
                </Typography>
                <Chip label={database.models.length} variant="outlined" size="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Relationships
                </Typography>
                <Chip label={database.relationships.length} variant="outlined" size="small" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {database.diagram.content && (
          <Grid item xs={12}>
            <MermaidDiagram
              content={database.diagram.content}
              description={database.diagram.description}
              title="Entity-Relationship Diagram"
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Models ({database.models.length})
            </Typography>
            <Grid container spacing={2}>
              {database.models.map((model, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {model.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      {model.file}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Fields: {model.fields.length}
                    </Typography>
                    <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                      {model.fields.map((field, fieldIndex) => (
                        <Typography key={fieldIndex} variant="caption" display="block" sx={{ fontFamily: 'monospace' }}>
                          {field.name}: {field.type}
                          {field.required && ' *'}
                          {field.unique && ' (unique)'}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {database.relationships.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Relationships ({database.relationships.length})
              </Typography>
              <Grid container spacing={2}>
                {database.relationships.map((rel, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>{rel.from}</strong> → <strong>{rel.to}</strong>
                      </Typography>
                      <Chip label={rel.type} size="small" sx={{ my: 1 }} />
                      <Typography variant="caption" color="text.secondary" display="block">
                        {rel.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

// Made with Bob
