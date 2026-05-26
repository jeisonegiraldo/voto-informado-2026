import { notFound } from 'next/navigation';
import { candidates } from '@/data/candidates';
import { getCandidatePositions } from '@/data/positions';
import { dimensionMap } from '@/data/dimensions';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import { PartyBadge } from '@/components/shared/party-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Compass, TrendingUp, Receipt, Building2, Globe, Shield,
  Leaf, Heart, GraduationCap, Cpu, Stethoscope, ArrowLeftRight, HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

const iconMap: Record<string, LucideIcon> = {
  Compass, TrendingUp, Receipt, Building2, Globe, Shield,
  Leaf, Heart, GraduationCap, Cpu, Stethoscope, ArrowLeftRight,
};

function getDimensionIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || HelpCircle;
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const candidate = candidates.find((c) => c.slug === slug);
  if (!candidate) return { title: 'Candidato no encontrado' };
  return {
    title: `${candidate.name} — Perfil y Propuestas`,
    description: `Conoce las propuestas de ${candidate.fullName} (${candidate.party}) para las elecciones presidenciales de Colombia 2026.`,
  };
}

export function generateStaticParams() {
  return candidates.map((c) => ({ slug: c.slug }));
}

export default async function CandidateProfilePage({ params }: { params: Params }) {
  const { slug } = await params;
  const candidate = candidates.find((c) => c.slug === slug);
  if (!candidate) notFound();

  const positions = getCandidatePositions(candidate.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 sm:p-8"
        style={{ background: `linear-gradient(135deg, ${candidate.color}22, ${candidate.color}08)` }}
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <CandidateAvatar candidate={candidate} size="lg" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{candidate.fullName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <PartyBadge party={candidate.party} color={candidate.color} />
              <span className="text-sm text-gray-500">{candidate.coalition}</span>
            </div>
            <p className="mt-1 text-sm italic text-gray-600">&ldquo;{candidate.slogan}&rdquo;</p>
          </div>
          <Badge
            className="self-start text-xs"
            style={{ backgroundColor: candidate.colorLight, color: candidate.color }}
          >
            {candidate.ideologyLabel}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Fórmula vicepresidencial</p>
            <p className="font-medium text-gray-800">{candidate.runningMate}</p>
            <p className="text-sm text-gray-500">{candidate.runningMateRole}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Plan de gobierno</p>
            <p className="text-sm text-gray-600">
              {candidate.governmentPlanPages} páginas &middot; {candidate.keyProposalCount} propuestas
              clave
            </p>
            <Link
              href={candidate.governmentPlanPdf}
              target="_blank"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Descargar PDF
            </Link>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-700">{candidate.shortBio}</p>
      </div>

      {/* Positions */}
      <h2 className="mt-10 text-xl font-bold text-gray-900">
        Posiciones en 12 dimensiones clave
      </h2>
      <div className="mt-4 space-y-4">
        {positions.map((pos) => {
          const dim = dimensionMap[pos.dimensionId];
          if (!dim) return null;
          const Icon = getDimensionIcon(dim.icon);
          const pct = ((pos.score + 5) / 10) * 100;

          return (
            <Card key={pos.dimensionId}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">{dim.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mini spectrum bar */}
                <div className="relative mb-3 h-3 rounded-full bg-gray-100">
                  <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300" />
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                    style={{
                      left: `${Math.max(5, Math.min(95, pct))}%`,
                      backgroundColor: candidate.color,
                    }}
                  />
                </div>
                <div className="mb-3 flex justify-between text-[10px] text-gray-400">
                  <span>{dim.spectrumLabels[0]}</span>
                  <span>{dim.spectrumLabels[1]}</span>
                </div>

                <p className="text-sm text-gray-700">{pos.summary}</p>

                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase text-gray-400">Propuestas clave</p>
                  <ul className="mt-1 space-y-1">
                    {pos.keyProposals.map((prop, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: candidate.color }} />
                        {prop}
                      </li>
                    ))}
                  </ul>
                </div>

                {pos.risks.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase text-amber-600">Riesgos y críticas</p>
                    <ul className="mt-1 space-y-1">
                      {pos.risks.map((risk, i) => (
                        <li key={i} className="text-xs text-gray-500">
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
