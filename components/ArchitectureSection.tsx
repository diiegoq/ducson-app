'use client';
import MermaidDiagram from './MermaidDiagram';
import { ArchitectureAnalysis } from '@/lib/types';

interface ArchitectureSectionProps {
  architecture: ArchitectureAnalysis;
}

export default function ArchitectureSection({ architecture }: ArchitectureSectionProps) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
        System Architecture
      </h2>

      {/* Architecture Diagram */}
      <div style={{ marginBottom: '1.5rem' }}>
        <MermaidDiagram
          content={architecture.diagram.content}
          description={architecture.diagram.description}
          title="Architecture Diagram"
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        {/* Pattern & Components */}
        <div className="card-playful-white">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Pattern
          </h3>
          <span style={{
            background: 'var(--bob-yellow)',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            border: '2px solid var(--bob-brown-light)',
            color: 'var(--bob-brown-dark)',
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
            {architecture.pattern}
          </span>
          
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Components ({architecture.components.length})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {architecture.components.map((component) => (
              <span
                key={component.id}
                style={{
                  background: 'white',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '2px solid var(--bob-brown-light)',
                  color: 'var(--text-primary)'
                }}
              >
                {component.name}
              </span>
            ))}
          </div>
        </div>

        {/* Entry Points */}
        <div className="card-playful-white">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Entry Points ({architecture.entryPoints.length})
          </h3>
          {architecture.entryPoints.map((entry, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {entry.file}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {entry.type} • {entry.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Component Details */}
      <div className="card-playful-white">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          Component Details
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {architecture.components.map((component) => (
            <div 
              key={component.id} 
              style={{ 
                padding: '1rem', 
                border: '2px solid var(--bob-brown-light)', 
                borderRadius: '12px',
                background: 'var(--bob-sky)'
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {component.name}
              </h4>
              <span style={{
                background: 'white',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '2px solid var(--bob-brown-light)',
                color: 'var(--text-primary)',
                display: 'inline-block',
                marginBottom: '0.75rem'
              }}>
                {component.type}
              </span>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {component.description}
              </p>
              {component.dependencies.length > 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Dependencies: {component.dependencies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}