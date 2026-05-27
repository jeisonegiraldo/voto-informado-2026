import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { candidates } from '@/data/candidates';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Extract percentages from URL params: ?cepeda=72&espriella=45&valencia=63&fajardo=58&top=cepeda
  const percentages = {
    cepeda: parseInt(searchParams.get('cepeda') || '0'),
    espriella: parseInt(searchParams.get('espriella') || '0'),
    valencia: parseInt(searchParams.get('valencia') || '0'),
    fajardo: parseInt(searchParams.get('fajardo') || '0'),
  };
  const topId = searchParams.get('top') || 'cepeda';
  const topCandidate = candidates.find((c) => c.id === topId) || candidates[0];
  const topPct = percentages[topId as keyof typeof percentages] || 0;

  const sorted = [...candidates].sort(
    (a, b) =>
      (percentages[b.id as keyof typeof percentages] || 0) -
      (percentages[a.id as keyof typeof percentages] || 0)
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f172a',
          padding: '48px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontSize: '32px', fontWeight: 800 }}>
              Voto<span style={{ color: '#14b8a6' }}>Informado</span>
            </span>
            <span style={{ color: '#94a3b8', fontSize: '16px', marginTop: '4px' }}>
              Quiz de Afinidad — Elecciones 2026
            </span>
          </div>
          <span
            style={{
              color: '#ffffff',
              backgroundColor: topCandidate.color,
              padding: '8px 20px',
              borderRadius: '24px',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            {topPct}% de afinidad
          </span>
        </div>

        {/* Top result */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: topCandidate.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            {topCandidate.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontSize: '36px', fontWeight: 700 }}>
              Mi mayor afinidad: {topCandidate.name}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '20px' }}>
              {topCandidate.party}
            </span>
          </div>
        </div>

        {/* All candidates bars */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '40px',
            flex: 1,
          }}
        >
          {sorted.map((c) => {
            const pct = percentages[c.id as keyof typeof percentages] || 0;
            return (
              <div
                key={c.id}
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <span
                  style={{
                    color: '#e2e8f0',
                    fontSize: '18px',
                    fontWeight: 600,
                    width: '140px',
                    textAlign: 'right',
                  }}
                >
                  {c.name.split(' ').slice(-1)[0]}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '32px',
                    backgroundColor: '#1e293b',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: c.color,
                      borderRadius: '16px',
                    }}
                  />
                </div>
                <span
                  style={{
                    color: c.color,
                    fontSize: '20px',
                    fontWeight: 700,
                    width: '60px',
                  }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <span style={{ color: '#64748b', fontSize: '16px' }}>
            Descubre tu afinidad en votainformadoco.org/quiz
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
