'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { AnalysisPerspective, PERSPECTIVES } from '@/lib/types';
import { PerspectiveCard } from './PerspectiveCard';

interface PerspectiveSelectorProps {
  onSelect: (perspective: AnalysisPerspective) => void;
  defaultPerspective?: AnalysisPerspective;
}

export function PerspectiveSelector({ onSelect, defaultPerspective = 'technical-debt' }: PerspectiveSelectorProps) {
  const [selectedPerspective, setSelectedPerspective] = useState<AnalysisPerspective>(defaultPerspective);
  const [showAll, setShowAll] = useState(false);

  const perspectives = Object.keys(PERSPECTIVES) as AnalysisPerspective[];
  const displayedPerspectives = showAll ? perspectives : perspectives.slice(0, 4);

  const handleSelect = (perspective: AnalysisPerspective) => {
    setSelectedPerspective(perspective);
  };

  const handleConfirm = () => {
    onSelect(selectedPerspective);
  };

  const selectedInfo = PERSPECTIVES[selectedPerspective];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Select Analysis Perspective
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose how you want to analyze this module. Each perspective provides tailored insights for different roles and concerns.
        </Typography>
      </Box>

      {/* Perspective Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {displayedPerspectives.map((perspective) => (
          <Grid item xs={12} md={6} key={perspective}>
            <PerspectiveCard
              perspective={perspective}
              selected={selectedPerspective === perspective}
              onSelect={handleSelect}
            />
          </Grid>
        ))}
      </Grid>

      {/* Show More/Less Button */}
      {perspectives.length > 4 && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setShowAll(!showAll)}
            endIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            size="large"
          >
            {showAll ? 'Show Less' : `Show ${perspectives.length - 4} More Perspectives`}
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Selected Perspective Summary */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ fontSize: '2rem' }}>{selectedInfo.icon}</Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Selected: {selectedInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedInfo.description}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Team Roster (Auto-adjusted):
            </Typography>
            <List dense disablePadding>
              {selectedInfo.team.map((member, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemText
                    primary={`• ${member}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Focus Areas:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedInfo.focusAreas.map((area, idx) => (
                <Chip
                  key={idx}
                  label={area}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mt: 2 }}>
          Estimated Analysis Time: 45-60 seconds
        </Alert>
      </Paper>

      {/* Confirm Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleConfirm}
          startIcon={<PlayArrowIcon />}
          sx={{ minWidth: 250, py: 1.5 }}
        >
          Analyze with {selectedInfo.name}
        </Button>
      </Box>
    </Box>
  );
}