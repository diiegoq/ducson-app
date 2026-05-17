'use client';
import { Box, Typography, Chip, Grid, Paper } from '@mui/material';

interface TechStackProps {
  techStack: {
    frameworks: string[];
    languages: { name: string; percentage: number }[];
    databases: string[];
    infrastructure: string[];
    testing: string[];
  };
}

export default function TechStackSection({ techStack }: TechStackProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Technology Stack
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Languages
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {techStack.languages.map((lang, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{lang.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lang.percentage}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        width: `${lang.percentage}%`,
                        height: '100%',
                        bgcolor: 'primary.main',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Frameworks & Libraries
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {techStack.frameworks.length > 0 ? (
                techStack.frameworks.map((framework, index) => (
                  <Chip key={index} label={framework} color="primary" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No frameworks detected
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Databases
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {techStack.databases.length > 0 ? (
                techStack.databases.map((db, index) => (
                  <Chip key={index} label={db} variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No databases detected
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Infrastructure
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {techStack.infrastructure.length > 0 ? (
                techStack.infrastructure.map((infra, index) => (
                  <Chip key={index} label={infra} variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No infrastructure tools detected
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Testing
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {techStack.testing.length > 0 ? (
                techStack.testing.map((test, index) => (
                  <Chip key={index} label={test} variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No testing frameworks detected
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

// Made with Bob
