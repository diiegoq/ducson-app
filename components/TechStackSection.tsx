'use client';

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
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
        Technology Stack
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Languages */}
        <div className="card-playful-white">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Languages
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {techStack.languages.map((lang, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{lang.name}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {lang.percentage}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--bob-yellow-light)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid var(--bob-brown-light)'
                  }}
                >
                  <div
                    style={{
                      width: `${lang.percentage}%`,
                      height: '100%',
                      background: 'var(--bob-yellow)',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frameworks */}
        <div className="card-playful-white">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Frameworks & Libraries
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {techStack.frameworks.length > 0 ? (
              techStack.frameworks.map((framework, index) => (
                <span
                  key={index}
                  style={{
                    background: 'var(--bob-yellow-light)',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: '2px solid var(--bob-brown-light)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {framework}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No frameworks detected
              </p>
            )}
          </div>
        </div>

        {/* Databases */}
        <div className="card-playful-white">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Databases
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {techStack.databases.length > 0 ? (
              techStack.databases.map((db, index) => (
                <span
                  key={index}
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
                  {db}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No databases detected
              </p>
            )}
          </div>
        </div>

        {/* Infrastructure */}
        <div className="card-playful-white">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Infrastructure
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {techStack.infrastructure.length > 0 ? (
              techStack.infrastructure.map((infra, index) => (
                <span
                  key={index}
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
                  {infra}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No infrastructure tools detected
              </p>
            )}
          </div>
        </div>

        {/* Testing */}
        <div className="card-playful-white">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Testing
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {techStack.testing.length > 0 ? (
              techStack.testing.map((test, index) => (
                <span
                  key={index}
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
                  {test}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No testing frameworks detected
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}