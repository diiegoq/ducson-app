'use client';

import { AnalysisPerspective, PERSPECTIVES } from '@/lib/types';

interface PerspectiveCardProps {
  perspective: AnalysisPerspective;
  selected: boolean;
  onSelect: (perspective: AnalysisPerspective) => void;
}

export function PerspectiveCard({ perspective, selected, onSelect }: PerspectiveCardProps) {
  const info = PERSPECTIVES[perspective];
  
  return (
    <div
      className={selected ? 'card-selected' : 'card-unselected'}
      onClick={() => onSelect(perspective)}
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        height: '100%',
        padding: '1.5rem',
        borderRadius: '16px'
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '5px 5px 0px var(--bob-brown-light)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '3px 3px 0px var(--bob-brown-light)';
        }
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          {info.name}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {info.description}
        </p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ 
          fontSize: '0.75rem', 
          fontWeight: 'bold', 
          color: 'var(--text-secondary)', 
          marginBottom: '0.25rem',
          textTransform: 'uppercase'
        }}>
          For:
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
          {info.targetRoles.join(', ')}
        </p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ 
          fontSize: '0.75rem', 
          fontWeight: 'bold', 
          color: 'var(--text-secondary)', 
          marginBottom: '0.5rem',
          textTransform: 'uppercase'
        }}>
          Focus Areas:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {info.focusAreas.slice(0, 3).map((area, idx) => (
            <span
              key={idx}
              style={{
                background: 'white',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '2px solid var(--bob-brown-light)',
                color: 'var(--text-primary)'
              }}
            >
              {area}
            </span>
          ))}
          {info.focusAreas.length > 3 && (
            <span
              style={{
                background: 'white',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '2px solid var(--bob-brown-light)',
                color: 'var(--text-secondary)'
              }}
            >
              +{info.focusAreas.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div>
        <p style={{ 
          fontSize: '0.75rem', 
          fontWeight: 'bold', 
          color: 'var(--text-secondary)', 
          marginBottom: '0.25rem',
          textTransform: 'uppercase'
        }}>
          Team:
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {info.team.join(', ')}
        </p>
      </div>
    </div>
  );
}