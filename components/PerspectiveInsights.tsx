'use client';

import { PerspectiveInsights as PerspectiveInsightsType, AnalysisPerspective, PERSPECTIVES } from '@/lib/types';

interface PerspectiveInsightsProps {
  perspective: AnalysisPerspective;
  insights: PerspectiveInsightsType;
}

export function PerspectiveInsights({ perspective, insights }: PerspectiveInsightsProps) {
  const perspectiveInfo = PERSPECTIVES[perspective];

  return (
    <div className="card-playful-peach">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
          Perspective Insights
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {perspectiveInfo.name}
        </p>
      </div>

      {/* Summary */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Summary
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {insights.summary}
        </p>
      </div>

      <div style={{ 
        borderTop: '2px solid var(--bob-brown-light)', 
        paddingTop: '1rem',
        marginBottom: '1.5rem'
      }} />

      {/* Key Findings */}
      {insights.keyFindings && insights.keyFindings.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
            Key Findings
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {insights.keyFindings.map((finding, idx) => (
              <li key={idx} style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem'
              }}>
                {finding}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
            Recommendations
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {insights.recommendations.map((rec, idx) => (
              <li key={idx} style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem'
              }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metrics */}
      {insights.metrics && Object.keys(insights.metrics).length > 0 && (
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Metrics
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(insights.metrics).map(([key, value]) => (
              <div 
                key={key} 
                style={{ 
                  padding: '1rem', 
                  background: 'white',
                  borderRadius: '12px',
                  border: '2px solid var(--bob-brown-light)'
                }}
              >
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-secondary)', 
                  textTransform: 'capitalize',
                  marginBottom: '0.5rem'
                }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold',
                  color: 'var(--bob-brown-dark)',
                  margin: 0
                }}>
                  {typeof value === 'number' && key.toLowerCase().includes('score')
                    ? `${value}/100`
                    : value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}