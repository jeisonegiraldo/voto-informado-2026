import Link from 'next/link';
import type { Candidate } from '@/types/candidate';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import { PartyBadge } from '@/components/shared/party-badge';

interface CandidatePreviewCardProps {
  candidate: Candidate;
}

export function CandidatePreviewCard({ candidate }: CandidatePreviewCardProps) {
  return (
    <Link href={`/candidatos/${candidate.slug}`}>
      <div
        className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        style={{ borderTopColor: candidate.color, borderTopWidth: 3 }}
      >
        <div className="flex items-start gap-3">
          <CandidateAvatar candidate={candidate} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700">
              {candidate.name}
            </h3>
            <p className="text-sm text-gray-500">{candidate.coalition}</p>
            <div className="mt-1">
              <PartyBadge party={candidate.party} color={candidate.color} />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: candidate.colorLight, color: candidate.color }}
          >
            {candidate.ideologyLabel}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {candidate.shortBio}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>{candidate.keyProposalCount} propuestas clave</span>
          <span>{candidate.governmentPlanPages} págs. plan de gobierno</span>
        </div>
      </div>
    </Link>
  );
}
