import Parser from 'rss-parser';
import { newsSources } from '@/data/sources';
import type { NewsSourceConfig } from '@/types/news';
import type { CandidateId } from '@/types/candidate';
import type { DimensionId } from '@/types/dimension';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'VotoInformado2026/1.0 (news-aggregator)',
  },
});

interface RawArticle {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  source: NewsSourceConfig;
}

const candidateKeywords: Record<CandidateId, string[]> = {
  cepeda: ['cepeda', 'iván cepeda', 'pacto histórico', 'aída quilcué'],
  espriella: ['espriella', 'abelardo', 'defensores de la patria', 'bukele colombiano'],
  valencia: ['paloma valencia', 'centro democrático', 'colombia más grande', 'juan daniel oviedo'],
  fajardo: ['fajardo', 'sergio fajardo', 'dignidad y compromiso', 'ahora colombia'],
};

const dimensionKeywords: Partial<Record<DimensionId, string[]>> = {
  security: ['seguridad', 'violencia', 'ejército', 'policía', 'paz total', 'crimen', 'extorsión'],
  healthcare: ['salud', 'eps', 'hospital', 'medicamentos', 'ips'],
  education: ['educación', 'universidad', 'icetex', 'sena', 'colegios'],
  'economic-model': ['economía', 'pib', 'inflación', 'empleo', 'desempleo'],
  'drug-policy': ['coca', 'narcotráfico', 'fumigación', 'cultivos ilícitos', 'drogas'],
  'petro-stance': ['petro', 'gobierno actual', 'reformas', 'continuismo'],
  technology: ['tecnología', 'inteligencia artificial', 'digital', 'innovación'],
};

function matchesCandidates(text: string): CandidateId[] {
  const lower = text.toLowerCase();
  const matches: CandidateId[] = [];
  for (const [id, keywords] of Object.entries(candidateKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matches.push(id as CandidateId);
    }
  }
  return matches;
}

function matchesDimensions(text: string): DimensionId[] {
  const lower = text.toLowerCase();
  const matches: DimensionId[] = [];
  for (const [id, keywords] of Object.entries(dimensionKeywords)) {
    if (keywords && keywords.some((kw) => lower.includes(kw))) {
      matches.push(id as DimensionId);
    }
  }
  return matches;
}

function isElectionRelated(text: string, source: NewsSourceConfig): boolean {
  const lower = text.toLowerCase();
  return source.electionKeywords.some((kw) => lower.includes(kw.toLowerCase()));
}

async function fetchRSS(source: NewsSourceConfig): Promise<RawArticle[]> {
  if (!source.rssUrl) return [];

  try {
    const feed = await parser.parseURL(source.rssUrl);
    return (feed.items || [])
      .filter((item) => item.title && item.link)
      .map((item) => ({
        title: item.title!,
        link: item.link!,
        pubDate: item.pubDate || new Date().toISOString(),
        contentSnippet: item.contentSnippet,
        source,
      }));
  } catch (error) {
    console.error(`[news-scraper] Failed to fetch RSS for ${source.name}:`, error);
    return [];
  }
}

export async function scrapeAllSources(): Promise<RawArticle[]> {
  const allArticles: RawArticle[] = [];

  for (const source of newsSources) {
    const articles = await fetchRSS(source);
    const relevant = articles.filter((a) =>
      isElectionRelated(`${a.title} ${a.contentSnippet || ''}`, source)
    );
    allArticles.push(...relevant);
  }

  // Sort by date, most recent first, cap at 50
  allArticles.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return allArticles.slice(0, 50);
}

export function enrichArticle(article: RawArticle) {
  const text = `${article.title} ${article.contentSnippet || ''}`;
  return {
    candidateIds: matchesCandidates(text),
    dimensionIds: matchesDimensions(text),
  };
}
