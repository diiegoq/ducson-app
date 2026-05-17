'use client';
import { Alert } from '@mui/material';
import MermaidDiagram from './MermaidDiagram';
import { DatabaseSchema } from '@/lib/types';

interface DatabaseSectionProps {
  database: DatabaseSchema;
}

export default function DatabaseSection({ database }: DatabaseSectionProps) {
  if (database.type === 'none') {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
          Database Schema
        </h2>
        <Alert severity="info">
          No database schema detected in this repository.
        </Alert>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
        Database Schema
      </h2>

      {/* Database Info Summary */}
      <div className="card-playful-peach" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              Type
            </p>
            <span style={{
              background: 'var(--bob-yellow)',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '2px solid var(--bob-brown-light)',
              color: 'var(--bob-brown-dark)',
              display: 'inline-block'
            }}>
              {database.type.toUpperCase()}
            </span>
          </div>
          {database.provider && (
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Provider
              </p>
              <span style={{
                background: 'white',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '2px solid var(--bob-brown-light)',
                color: 'var(--text-primary)',
                display: 'inline-block'
              }}>
                {database.provider}
              </span>
            </div>
          )}
          {database.orm && (
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                ORM
              </p>
              <span style={{
                background: 'white',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '2px solid var(--bob-brown-light)',
                color: 'var(--text-primary)',
                display: 'inline-block'
              }}>
                {database.orm}
              </span>
            </div>
          )}
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              Models
            </p>
            <span style={{
              background: 'white',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '2px solid var(--bob-brown-light)',
              color: 'var(--text-primary)',
              display: 'inline-block'
            }}>
              {database.models.length}
            </span>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              Relationships
            </p>
            <span style={{
              background: 'white',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '2px solid var(--bob-brown-light)',
              color: 'var(--text-primary)',
              display: 'inline-block'
            }}>
              {database.relationships.length}
            </span>
          </div>
        </div>
      </div>

      {/* ER Diagram */}
      {database.diagram.content && (
        <div style={{ marginBottom: '1.5rem' }}>
          <MermaidDiagram
            content={database.diagram.content}
            description={database.diagram.description}
            title="Entity-Relationship Diagram"
          />
        </div>
      )}

      {/* Models */}
      <div className="card-playful-white" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          Models ({database.models.length})
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {database.models.map((model, index) => (
            <div 
              key={index} 
              style={{ 
                padding: '1rem', 
                border: '2px solid var(--bob-brown-light)', 
                borderRadius: '12px',
                background: 'var(--bob-yellow-light)'
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {model.name}
              </h4>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)', 
                marginBottom: '0.75rem',
                fontFamily: 'monospace'
              }}>
                {model.file}
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                Fields: {model.fields.length}
              </p>
              <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                {model.fields.map((field, fieldIndex) => (
                  <p 
                    key={fieldIndex} 
                    style={{ 
                      fontSize: '0.75rem', 
                      fontFamily: 'monospace',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {field.name}: {field.type}
                    {field.required && ' *'}
                    {field.unique && ' (unique)'}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relationships */}
      {database.relationships.length > 0 && (
        <div className="card-playful-white">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Relationships ({database.relationships.length})
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {database.relationships.map((rel, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '1rem', 
                  border: '2px solid var(--bob-brown-light)', 
                  borderRadius: '12px',
                  background: 'var(--bob-mint)'
                }}
              >
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <strong>{rel.from}</strong> → <strong>{rel.to}</strong>
                </p>
                <span style={{
                  background: 'white',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: '2px solid var(--bob-brown-light)',
                  color: 'var(--text-primary)',
                  display: 'inline-block',
                  marginBottom: '0.5rem'
                }}>
                  {rel.type}
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {rel.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}