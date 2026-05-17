'use client';

import { Card, CardContent, Typography, Box, Chip, Radio } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { AnalysisPerspective, PERSPECTIVES } from '@/lib/types';

interface PerspectiveCardProps {
  perspective: AnalysisPerspective;
  selected: boolean;
  onSelect: (perspective: AnalysisPerspective) => void;
}

export function PerspectiveCard({ perspective, selected, onSelect }: PerspectiveCardProps) {
  const info = PERSPECTIVES[perspective];
  
  return (
    <Card
      elevation={selected ? 8 : 2}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: selected ? 3 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        },
        height: '100%',
        position: 'relative'
      }}
      onClick={() => onSelect(perspective)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Box sx={{ fontSize: '2.5rem', lineHeight: 1 }}>
            {info.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
              {info.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {info.description}
            </Typography>
          </Box>
          <Radio
            checked={selected}
            sx={{ mt: -1 }}
            color="primary"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 0.5 }}>
            For:
          </Typography>
          <Typography variant="body2">
            {info.targetRoles.join(', ')}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Focus Areas:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {info.focusAreas.slice(0, 3).map((area, idx) => (
              <Chip
                key={idx}
                label={area}
                size="small"
                variant="outlined"
              />
            ))}
            {info.focusAreas.length > 3 && (
              <Chip
                label={`+${info.focusAreas.length - 3} more`}
                size="small"
                variant="outlined"
                color="default"
              />
            )}
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Team:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {info.team.join(', ')}
          </Typography>
        </Box>

        {selected && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircleIcon />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}