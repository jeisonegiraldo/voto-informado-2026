import { cn } from '@/lib/utils';
import type { Candidate } from '@/types/candidate';

interface CandidateAvatarProps {
  candidate: Candidate;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-20 w-20 text-lg',
};

export function CandidateAvatar({ candidate, size = 'md', className }: CandidateAvatarProps) {
  const initials = candidate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-bold text-white',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: candidate.color }}
    >
      {initials}
    </div>
  );
}
