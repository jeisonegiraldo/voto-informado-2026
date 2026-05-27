import Link from 'next/link';
import type { Candidate } from '@/types/candidate';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import { PartyBadge } from '@/components/shared/party-badge';
import { ArrowRight } from 'lucide-react';

interface CandidatePreviewCardProps {
  candidate: Candidate;
}

export function CandidatePreviewCard({ candidate }: CandidatePreviewCardProps) {
  return (
    <Link href={`/candidatos/${candidate.slug}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-200">
        {/* Top color accent bar */}
        <div
          className="absolute inset-x-0 top-0 h-1 transition-all duration-300 group-hover:h-1.5"
          style={{ backgroundColor: candidate.color }}
        />

        <div className="flex items-start gap-3 pt-1">
          <CandidateAvatar candidate={candidate} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-teal-700">
              {candidate.name}
            </h3>
            <p className="text-sm text-gray-400">{candidate.coalition}</p>
            <div className="mt-1">
              <PartyBadge party={candidate.party} color={candidate.color} />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: candidate.colorLight, color: candidate.color }}
          >
            {candidate.ideologyLabel}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {candidate.shortBio}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-400">
          <span>{candidate.keyProposalCount} propuestas clave</span>
          <span className="flex items-center gap-1 font-medium text-teal-600 opacity-0 transition-opacity group-hover:opacity-100">
            Ver perfil
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
