import { ImageResponse } from 'next/og';
import { candidates } from '@/data/candidates';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f172a',
          padding: '56px',
          fontFamily: 'system-ui, sans-serif',
          justifyContent: 'space-between',
        }}
      >
        {/* Top: Brand + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '52px', fontWeight: 800, color: '#ffffff' }}>
              Vota<span style={{ color: '#14b8a6' }}>Informado</span>
            </span>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#14b8a6',
                backgroundColor: '#14b8a620',
                padding: '4px 12px',
                borderRadius: '8px',
              }}
            >
              2026
            </span>
          </div>
          <span style={{ fontSize: '28px', color: '#94a3b8', marginTop: '12px' }}>
            Herramienta ciudadana no-partidista para las elecciones presidenciales de Colombia
          </span>
        </div>

        {/* Middle: Candidate cards */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '40px',
            justifyContent: 'center',
          }}
        >
          {candidates.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                padding: '24px 32px',
                flex: 1,
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: c.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {c.name.split(' ').slice(-1)[0].charAt(0)}
              </div>
              <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>
                {c.name.split(' ').slice(-1)[0]}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
                {c.party}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom: features + CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '40px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { emoji: '🧭', label: 'Brújula a Ciegas' },
              { emoji: '📊', label: 'Comparador' },
              { emoji: '🎯', label: 'Test de Afinidad' },
              { emoji: '🤖', label: 'Chat IA' },
            ].map((f) => (
              <div
                key={f.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  padding: '10px 16px',
                }}
              >
                <span style={{ fontSize: '20px' }}>{f.emoji}</span>
                <span style={{ color: '#e2e8f0', fontSize: '16px', fontWeight: 600 }}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>
          <span style={{ color: '#64748b', fontSize: '16px' }}>
            votainformadoco.org
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
