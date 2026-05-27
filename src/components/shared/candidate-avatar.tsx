import Image from 'next/image';
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

const imageSizes = {
  sm: 32,
  md: 48,
  lg: 80,
};

export function CandidateAvatar({ candidate, size = 'md', className }: CandidateAvatarProps) {
  const initials = candidate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const px = imageSizes[size];

  if (candidate.photo) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-full ring-2 ring-white shadow-sm',
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={candidate.photo}
          alt={candidate.name}
          width={px}
          height={px}
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>
    );
  }

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
