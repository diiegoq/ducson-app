'use client';

import { useState } from 'react';
import { Alert } from '@mui/material';
import { AnalysisPerspective, PERSPECTIVES } from '@/lib/types';
import { PerspectiveCard } from './PerspectiveCard';

interface PerspectiveSelectorProps {
  onSelect: (perspective: AnalysisPerspective) => void;
  defaultPerspective?: AnalysisPerspective;
}

export function PerspectiveSelector({ onSelect, defaultPerspective = 'technical-debt' }: PerspectiveSelectorProps) {
  const [selectedPerspective, setSelectedPerspective] = useState<AnalysisPerspective>(defaultPerspective);

  const perspectives = Object.keys(PERSPECTIVES) as AnalysisPerspective[];

  const handleSelect = (perspective: AnalysisPerspective) => {
    setSelectedPerspective(perspective);
  };

  const handleConfirm = () => {
    onSelect(selectedPerspective);
  };

  const selectedInfo = PERSPECTIVES[selectedPerspective];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Choose Your Analysis Style
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Pick how Bob should look at this code
        </p>
      </div>

      {/* Perspective Grid - Show all perspectives */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {perspectives.map((perspective) => (
          <PerspectiveCard
            key={perspective}
            perspective={perspective}
            selected={selectedPerspective === perspective}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Selected Perspective Summary */}
      <div className="card-playful-peach" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Selected: {selectedInfo.name}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {selectedInfo.description}
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1rem'
        }}>
          <div>
            <p style={{ 
              fontSize: '0.875rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: 'var(--bob-brown-dark)'
            }}>
              Team Roster (Auto-adjusted):
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {selectedInfo.team.map((member, idx) => (
                <li key={idx} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  {member}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ 
              fontSize: '0.875rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: 'var(--bob-brown-dark)'
            }}>
              Focus Areas:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {selectedInfo.focusAreas.map((area, idx) => (
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
            </div>
          </div>
        </div>

        <Alert severity="info" style={{ marginTop: '1rem' }}>
          Estimated Analysis Time: 45-60 seconds
        </Alert>
      </div>

      {/* Confirm Button - Centered */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className="button-playful button-playful-large"
          onClick={handleConfirm}
          style={{ minWidth: '300px' }}
        >
          Start Analysis
        </button>
      </div>
    </div>
  );
}