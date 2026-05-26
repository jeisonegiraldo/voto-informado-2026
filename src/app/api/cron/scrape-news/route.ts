import { NextResponse } from 'next/server';
import { scrapeAllSources, enrichArticle } from '@/lib/news-scraper';
import { summarizeArticle } from '@/lib/news-summarizer';
import { getCachedNews, setCachedNews } from '@/lib/kv-cache';
import type { NewsArticle } from '@/types/news';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await getCachedNews();
    const existingUrls = new Set(existing.map((a) => a.url));

    const rawArticles = await scrapeAllSources();
    const newArticles = rawArticles.filter((a) => !existingUrls.has(a.link));

    const processed: NewsArticle[] = [];
    // Process max 10 new articles per cycle to avoid timeout
    for (const raw of newArticles.slice(0, 10)) {
      const { candidateIds, dimensionIds } = enrichArticle(raw);

      // Only summarize if we have API key
      let summary = raw.contentSnippet?.slice(0, 200) || '';
      if (process.env.ANTHROPIC_API_KEY) {
        const aiSummary = await summarizeArticle(raw.title, raw.contentSnippet || '');
        if (aiSummary) summary = aiSummary;
      }

      processed.push({
        id: Buffer.from(raw.link).toString('base64').slice(0, 32),
        title: raw.title,
        summary,
        source: raw.source.id,
        sourceName: raw.source.name,
        url: raw.link,
        publishedAt: raw.pubDate,
        scrapedAt: new Date().toISOString(),
        candidateIds,
        dimensionIds,
      });
    }

    // Merge with existing, most recent first, cap at 50
    const all = [...processed, ...existing]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 50);

    await setCachedNews(all);

    return NextResponse.json({
      ok: true,
      newArticles: processed.length,
      totalCached: all.length,
    });
  } catch (error) {
    console.error('[cron/scrape-news] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
