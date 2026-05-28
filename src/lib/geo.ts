import type { GeoData } from '@/types/analytics';

/**
 * Extract geographic data from Vercel's automatic geo headers.
 *
 * Vercel automatically sets these headers on every request:
 * - x-vercel-ip-city        → URL-encoded city name
 * - x-vercel-ip-country-region → region/state/departamento code
 * - x-vercel-ip-country     → ISO 3166-1 alpha-2 country code
 * - x-vercel-ip-latitude    → latitude
 * - x-vercel-ip-longitude   → longitude
 *
 * These are NOT available in localhost; only on Vercel-hosted deployments.
 */
export function extractGeo(headers: Headers): GeoData {
  const city = headers.get('x-vercel-ip-city');
  const region = headers.get('x-vercel-ip-country-region');
  const country = headers.get('x-vercel-ip-country');
  const lat = headers.get('x-vercel-ip-latitude');
  const lon = headers.get('x-vercel-ip-longitude');

  return {
    city: city ? safeDecodeURI(city) : undefined,
    region: region ? safeDecodeURI(region) : undefined,
    country: country || undefined,
    lat: lat || undefined,
    lon: lon || undefined,
  };
}

/**
 * Map Colombian region codes to departamento names.
 * Vercel returns ISO 3166-2:CO subdivision codes (e.g. "ANT" for Antioquia).
 */
const COLOMBIA_REGIONS: Record<string, string> = {
  AMA: 'Amazonas', ANT: 'Antioquia', ARA: 'Arauca', ATL: 'Atlantico',
  BOL: 'Bolivar', BOY: 'Boyaca', CAL: 'Caldas', CAQ: 'Caqueta',
  CAS: 'Casanare', CAU: 'Cauca', CES: 'Cesar', CHO: 'Choco',
  COR: 'Cordoba', CUN: 'Cundinamarca', DC: 'Bogota D.C.',
  GUA: 'Guainia', GUV: 'Guaviare', HUI: 'Huila', LAG: 'La Guajira',
  MAG: 'Magdalena', MET: 'Meta', NAR: 'Narino',
  NSA: 'Norte de Santander', PUT: 'Putumayo', QUI: 'Quindio',
  RIS: 'Risaralda', SAP: 'San Andres', SAN: 'Santander',
  SUC: 'Sucre', TOL: 'Tolima', VAC: 'Valle del Cauca',
  VAU: 'Vaupes', VID: 'Vichada',
};

/**
 * Resolve a region code to a human-readable departamento name.
 * Falls back to the code itself if not found in the map.
 */
export function resolveRegionName(regionCode?: string): string | undefined {
  if (!regionCode) return undefined;
  return COLOMBIA_REGIONS[regionCode.toUpperCase()] || regionCode;
}

/**
 * Detect device type from User-Agent string.
 */
export function detectDevice(ua?: string | null): 'mobile' | 'tablet' | 'desktop' {
  if (!ua) return 'desktop';
  const lower = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(lower)) return 'tablet';
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/.test(lower)) return 'mobile';
  return 'desktop';
}

/**
 * Extract browser family from User-Agent (no version, no full string).
 */
export function detectBrowser(ua?: string | null): string {
  if (!ua) return 'unknown';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Firefox/')) return 'Firefox';
  return 'other';
}

/** Safe URI decode that doesn't throw on malformed input */
function safeDecodeURI(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
