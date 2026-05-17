'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  FiberManualRecord as BulletIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { PerspectiveInsights as PerspectiveInsightsType, AnalysisPerspective, PERSPECTIVES } from '@/lib/types';

interface PerspectiveInsightsProps {
  perspective: AnalysisPerspective;
  insights: PerspectiveInsightsType;
}

export function PerspectiveInsights({ perspective, insights }: PerspectiveInsightsProps) {
  const perspectiveInfo = PERSPECTIVES[perspective];

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ fontSize: '2rem' }}>{perspectiveInfo.icon}</Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Perspective Insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {perspectiveInfo.name}
            </Typography>
          </Box>
        </Box>

        {/* Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {insights.summary}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Key Findings */}
        {insights.keyFindings && insights.keyFindings.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Key Findings
            </Typography>
            <List dense disablePadding>
              {insights.keyFindings.map((finding, idx) => (
                <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <BulletIcon color="primary" sx={{ fontSize: 12 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={finding}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Recommendations */}
        {insights.recommendations && insights.recommendations.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Recommendations
            </Typography>
            <List dense disablePadding>
              {insights.recommendations.map((rec, idx) => (
                <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color="success" sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={rec}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Metrics */}
        {insights.metrics && Object.keys(insights.metrics).length > 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Metrics
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(insights.metrics).map(([key, value]) => (
                <Grid item xs={6} sm={4} key={key}>
                  <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                      {typeof value === 'number' && key.toLowerCase().includes('score')
                        ? `${value}/100`
                        : value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}