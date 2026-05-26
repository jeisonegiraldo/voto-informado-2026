import { NextResponse } from 'next/server';
import { getCachedNews } from '@/lib/kv-cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const candidateId = searchParams.get('candidate');

  let articles = await getCachedNews();

  if (candidateId) {
    articles = articles.filter((a) => a.candidateIds.includes(candidateId as never));
  }

  return NextResponse.json({ articles, count: articles.length });
}
